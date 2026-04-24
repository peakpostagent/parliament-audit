/**
 * Daily Social Brief — Executor
 *
 * Parses today's reviewed brief, finds candidates marked `[x] APPROVE` or
 * `[x] APPROVE WITH EDITS`, and posts them to Bluesky (and X when wired).
 *
 * Behaviour:
 *   - Reads the latest non-executed file in content/social-briefs/
 *   - For each section with an approval box checked:
 *     - REPLY → agent.post with reply ref to the original post
 *     - REPOST → agent.repost
 *     - QUOTE-TWEET → agent.post with embed record referencing the original
 *   - Updates state: records the URI in executedPostUris
 *   - Moves the brief to content/social-briefs/executed/<DATE>.md
 *
 * Safety:
 *   - Dry-run by default; must pass --apply to actually post.
 *   - Marks state *before* posting each item so a mid-run crash doesn't
 *     re-execute an item on retry.
 *
 * Usage:
 *   npx tsx scripts/social-brief/execute.ts           # dry-run (default)
 *   npx tsx scripts/social-brief/execute.ts --apply   # actually post
 *   npx tsx scripts/social-brief/execute.ts --file content/social-briefs/2026-04-24.md
 */

import 'dotenv/config';
import { AtpAgent, RichText } from '@atproto/api';
import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  renameSync,
  mkdirSync,
} from 'node:fs';
import { resolve, join } from 'node:path';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const FILE_OVERRIDE = (() => {
  const i = args.indexOf('--file');
  return i !== -1 ? args[i + 1] : null;
})();

/**
 * Daily-cap safety rail. Any real human reviewing 15 candidates is unlikely
 * to want >12 items shipped in a single day — if they did it's usually a
 * misplaced [x] approval or over-enthusiasm that will make @ParliamentAudit
 * look like a bot. Hard ceiling, overridable with --no-cap for the rare
 * case where you actually want to blast (e.g. a budget-day live thread).
 */
const DAILY_CAP = args.includes('--no-cap') ? Infinity : 12;

const ROOT = process.cwd();
const BRIEFS_DIR = resolve(ROOT, 'content/social-briefs');
const EXECUTED_DIR = join(BRIEFS_DIR, 'executed');
const STATE_PATH = join(BRIEFS_DIR, '.state.json');

mkdirSync(EXECUTED_DIR, { recursive: true });

// ─── Types ────────────────────────────────────────────────────────────────

interface State {
  lastRun?: string;
  processedPostUris: string[];
  executedPostUris: string[];
  lastExecuteRun?: string;
}

interface Item {
  heading: string;
  action: 'reply' | 'repost' | 'quote-tweet' | 'unknown';
  approved: boolean;
  editedText?: string; // only if APPROVE WITH EDITS
  originalUri?: string;
  originalCid?: string;
  authorHandle?: string;
}

// ─── State ────────────────────────────────────────────────────────────────

function loadState(): State {
  if (!existsSync(STATE_PATH)) {
    return { processedPostUris: [], executedPostUris: [] };
  }
  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf8')) as State;
  } catch {
    return { processedPostUris: [], executedPostUris: [] };
  }
}

function saveState(s: State) {
  writeFileSync(STATE_PATH, JSON.stringify(s, null, 2), 'utf8');
}

// ─── Brief parsing ────────────────────────────────────────────────────────

function pickLatestBrief(): string | null {
  if (!existsSync(BRIEFS_DIR)) return null;
  const candidates = readdirSync(BRIEFS_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .sort()
    .reverse();
  if (candidates.length === 0) return null;
  return join(BRIEFS_DIR, candidates[0]);
}

function parseBrief(path: string): Item[] {
  const content = readFileSync(path, 'utf8');
  // Split on '---' separators but keep the prelude for context
  const sections = content.split(/\n---\n/);
  const items: Item[] = [];

  for (const section of sections) {
    const head = section.match(/^##\s+\d+\.\s+\[(\w+(?:-\w+)*)\]/m);
    if (!head) continue;

    const actionText = head[1].toLowerCase();
    const action: Item['action'] =
      actionText === 'reply'
        ? 'reply'
        : actionText === 'repost'
          ? 'repost'
          : actionText === 'quote-tweet'
            ? 'quote-tweet'
            : 'unknown';

    const uri = section.match(/uri:\s*(at:\/\/[^\s]+)/)?.[1];
    const cid = section.match(/cid:\s*(bafy[a-z0-9]+)/)?.[1];
    const authorHandle = section.match(/—\s*@([a-z0-9.-]+)\s/i)?.[1];

    const approveBox = /\n- \[x\] APPROVE\s*\n/i.test(section);
    const approveEditsBox = /\n- \[x\] APPROVE WITH EDITS\s*\n/i.test(section);
    const rejectBox = /\n- \[x\] REJECT\s*\n/i.test(section);

    if (rejectBox) continue;

    const approved = approveBox || approveEditsBox;
    if (!approved) continue;

    // Extract the edited text from the draft code block
    let editedText: string | undefined;
    const codeBlockMatch = section.match(/```\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      editedText = codeBlockMatch[1].trim();
    }

    items.push({
      heading: head[0],
      action,
      approved,
      editedText,
      originalUri: uri,
      originalCid: cid,
      authorHandle,
    });
  }

  return items;
}

// ─── Bluesky posting ──────────────────────────────────────────────────────

async function createAgent(): Promise<AtpAgent> {
  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) {
    throw new Error('BLUESKY_HANDLE and BLUESKY_APP_PASSWORD must be set');
  }
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: BLUESKY_HANDLE,
    password: BLUESKY_APP_PASSWORD,
  });
  return agent;
}

async function postReply(
  agent: AtpAgent,
  text: string,
  parentUri: string,
  parentCid: string,
) {
  const rt = new RichText({ text });
  await rt.detectFacets(agent);

  // Reply refs: need root too. For a reply-to-reply chain, we'd need the
  // original root; for a top-level reply, root === parent.
  // Fetch the parent to discover its root if it's already a reply.
  let rootUri = parentUri;
  let rootCid = parentCid;
  try {
    const parent = await agent.getPost({
      repo: parentUri.split('/')[2],
      rkey: parentUri.split('/').pop() as string,
    });
    const replyRef = (parent.value as any).reply;
    if (replyRef?.root?.uri) {
      rootUri = replyRef.root.uri;
      rootCid = replyRef.root.cid;
    }
  } catch {
    // Best effort — fall back to parent as root
  }

  return await agent.post({
    text: rt.text,
    facets: rt.facets,
    reply: {
      root: { uri: rootUri, cid: rootCid },
      parent: { uri: parentUri, cid: parentCid },
    },
  });
}

async function repost(agent: AtpAgent, uri: string, cid: string) {
  return await agent.repost(uri, cid);
}

async function quotePost(agent: AtpAgent, text: string, uri: string, cid: string) {
  const rt = new RichText({ text });
  await rt.detectFacets(agent);
  return await agent.post({
    text: rt.text,
    facets: rt.facets,
    embed: {
      $type: 'app.bsky.embed.record',
      record: { uri, cid },
    } as any,
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  const briefPath = FILE_OVERRIDE ? resolve(ROOT, FILE_OVERRIDE) : pickLatestBrief();
  if (!briefPath || !existsSync(briefPath)) {
    console.error('[execute] No brief found. Run generate.ts first.');
    process.exit(1);
  }
  console.log(`[execute] Reading ${briefPath}`);

  const items = parseBrief(briefPath);
  if (items.length === 0) {
    console.log('[execute] No approved items in this brief. Nothing to do.');
    process.exit(0);
  }

  console.log(`[execute] Found ${items.length} approved item(s):`);
  for (const it of items) {
    const preview = (it.editedText || '').slice(0, 80);
    console.log(
      `  - ${it.action.padEnd(12)} @${it.authorHandle ?? '?'.padEnd(20)}  ${preview}…`,
    );
  }

  if (items.length > DAILY_CAP) {
    console.error(
      `\n[execute] ABORT: ${items.length} approvals exceeds the daily cap of ${DAILY_CAP}.`,
    );
    console.error(
      '  A real reader is unlikely to want that many posts from us in one day.',
    );
    console.error('  Either:');
    console.error('    - Uncheck some approvals in the brief and re-run, OR');
    console.error('    - Pass --no-cap to override (e.g. for a budget-day live thread).');
    process.exit(1);
  }

  if (!APPLY) {
    console.log('\n[execute] --apply not passed. Dry run complete. No posts sent.');
    console.log('[execute] To actually post: npx tsx scripts/social-brief/execute.ts --apply');
    return;
  }

  const state = loadState();
  console.log('\n[execute] Authenticating to Bluesky…');
  const agent = await createAgent();

  let posted = 0;
  let failed = 0;
  const failures: Array<{ item: Item; reason: string }> = [];

  for (const it of items) {
    if (!it.originalUri || !it.originalCid) {
      failures.push({ item: it, reason: 'Missing original uri/cid — brief format mismatch' });
      failed++;
      continue;
    }
    if (state.executedPostUris.includes(it.originalUri)) {
      console.log(`  [skip] Already executed against ${it.originalUri}`);
      continue;
    }

    // Mark state BEFORE posting so mid-run crashes don't cause double-posts
    state.executedPostUris.push(it.originalUri);
    saveState(state);

    try {
      if (it.action === 'reply') {
        const text = it.editedText || '';
        if (!text || text.includes('[ADD FACTUAL NOTE') || text.includes('[SLUG]')) {
          throw new Error(
            'Reply text still has placeholder markers. Edit the draft before approving.',
          );
        }
        if (text.length > 300) {
          throw new Error(`Reply exceeds Bluesky 300-char limit (${text.length} chars)`);
        }
        await postReply(agent, text, it.originalUri, it.originalCid);
      } else if (it.action === 'repost') {
        await repost(agent, it.originalUri, it.originalCid);
      } else if (it.action === 'quote-tweet') {
        const text = it.editedText || '';
        if (!text) throw new Error('Quote-tweet has no draft text');
        if (text.length > 300) throw new Error(`Quote-tweet exceeds 300 chars (${text.length})`);
        await quotePost(agent, text, it.originalUri, it.originalCid);
      } else {
        throw new Error(`Unknown action: ${it.action}`);
      }
      console.log(`  [ok] ${it.action} → @${it.authorHandle}`);
      posted++;
    } catch (e: any) {
      // Roll back the state mark since this one failed
      state.executedPostUris = state.executedPostUris.filter((u) => u !== it.originalUri);
      saveState(state);
      const reason = e?.message || String(e);
      failures.push({ item: it, reason });
      console.error(`  [fail] ${it.action} → @${it.authorHandle}: ${reason.slice(0, 180)}`);
      failed++;
    }
  }

  state.lastExecuteRun = new Date().toISOString();
  saveState(state);

  console.log(`\n[execute] Done. Posted: ${posted}. Failed: ${failed}.`);

  if (posted > 0) {
    // Archive the brief
    const basename = briefPath.split(/[/\\]/).pop() as string;
    const archivedPath = join(EXECUTED_DIR, basename);
    try {
      renameSync(briefPath, archivedPath);
      console.log(`[execute] Archived brief → ${archivedPath}`);
    } catch (e: any) {
      console.warn(`[execute] Could not archive brief: ${e.message}`);
    }
  }

  if (failures.length > 0) {
    console.log('\n[execute] Failures:');
    for (const { item, reason } of failures) {
      console.log(`  - @${item.authorHandle}: ${reason}`);
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('[execute] Fatal:', e?.message || e);
  if (e?.stack) console.error(e.stack.slice(0, 800));
  process.exit(1);
});
