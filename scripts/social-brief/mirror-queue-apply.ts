/**
 * Posts the hand-trimmed X queue from x-mirror-queue.json. For each
 * entry, finds the original Bluesky post by substring match (so we can
 * record its URI in mirror state and avoid re-mirroring), then posts the
 * trimmed text to X via the browser path. Also persists the
 * skip-as-duplicate decisions so the live mirror-to-x.ts won't re-evaluate
 * them tomorrow.
 *
 * Usage:
 *   npx tsx scripts/social-brief/mirror-queue-apply.ts                         # dry-run (default)
 *   npx tsx scripts/social-brief/mirror-queue-apply.ts --apply                 # post all (paced)
 *   npx tsx scripts/social-brief/mirror-queue-apply.ts --apply --batch 1       # post one
 *   npx tsx scripts/social-brief/mirror-queue-apply.ts --apply --spacing-min 0 # no spacing (use only for testing)
 */
import 'dotenv/config';
import { AtpAgent } from '@atproto/api';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { postToX } from '../browser/post-x-lib.js';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
function arg(name: string, dflt?: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : dflt;
}
const BATCH = parseInt(arg('batch', '99') || '99', 10);
const SPACING_MIN = parseInt(arg('spacing-min', '30') || '30', 10);
const DAILY_CAP = parseInt(arg('daily-cap', '6') || '6', 10);

const ROOT = process.cwd();
const QUEUE_PATH = resolve(ROOT, 'scripts/social-brief/x-mirror-queue.json');
const STATE_PATH = resolve(ROOT, 'content/social-briefs/.x-mirror-state.json');

interface QueueEntry {
  bskyUri: string;
  matchSubstring: string;
  slug: string;
  text: string;
}
interface SkipEntry {
  matchSubstring: string;
  reason: string;
}
interface QueueFile {
  queue: QueueEntry[];
  skip_as_duplicate: SkipEntry[];
}
interface MirrorState {
  mirrored: Record<string, { mirroredAt: string; finalText: string }>;
  skipped: Record<string, { reason: string; skippedAt: string }>;
  todayCount: number;
  todayDate: string;
  lastPostedAt: string | null;
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}
function loadState(): MirrorState {
  const empty: MirrorState = {
    mirrored: {},
    skipped: {},
    todayCount: 0,
    todayDate: todayStamp(),
    lastPostedAt: null,
  };
  if (!existsSync(STATE_PATH)) return empty;
  try {
    const s = JSON.parse(readFileSync(STATE_PATH, 'utf8'));
    if (s.todayDate !== todayStamp()) {
      s.todayCount = 0;
      s.todayDate = todayStamp();
    }
    return { ...empty, ...s };
  } catch {
    return empty;
  }
}
function saveState(s: MirrorState) {
  writeFileSync(STATE_PATH, JSON.stringify(s, null, 2));
}

const NTFY_TOPIC = process.env.NTFY_TOPIC || 'parliamentaudit-posts';
async function notify(title: string, body: string, click?: string) {
  try {
    const headers: Record<string, string> = { Title: title, Tags: 'x_twitter,mirror', Priority: '3' };
    if (click) headers.Click = click;
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, { method: 'POST', headers, body });
  } catch {
    /* ignore */
  }
}

async function findBskyUri(
  agent: AtpAgent,
  substring: string,
): Promise<{ uri: string; text: string } | null> {
  const did = agent.session!.did;
  let cursor: string | undefined;
  for (let p = 0; p < 5; p++) {
    const res = await agent.getAuthorFeed({
      actor: did,
      limit: 50,
      filter: 'posts_no_replies',
      cursor,
    });
    cursor = res.data.cursor;
    if (!res.data.feed?.length) break;
    for (const item of res.data.feed) {
      if ((item.reason as any)?.$type === 'app.bsky.feed.defs#reasonRepost') continue;
      const post = item.post;
      const r = post.record as any;
      if (!r?.text) continue;
      if ((r.text as string).includes(substring)) {
        return { uri: post.uri, text: r.text };
      }
    }
    if (!cursor) break;
  }
  return null;
}

async function main() {
  if (!existsSync(QUEUE_PATH)) {
    console.error(`Missing queue file at ${QUEUE_PATH}`);
    process.exit(1);
  }
  const queueFile: QueueFile = JSON.parse(readFileSync(QUEUE_PATH, 'utf8'));
  const state = loadState();

  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) throw new Error('Bluesky creds missing');
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD });
  console.log(`[queue] ${queueFile.queue.length} mirror entries, ${queueFile.skip_as_duplicate.length} skip-as-duplicate entries`);

  // Resolve Bluesky URIs from substrings
  const resolved: Array<QueueEntry & { resolvedUri: string; bskyText: string }> = [];
  for (const e of queueFile.queue) {
    const found = await findBskyUri(agent, e.matchSubstring);
    if (!found) {
      console.warn(`  [warn] could not resolve URI for: "${e.matchSubstring}"`);
      continue;
    }
    resolved.push({ ...e, resolvedUri: found.uri, bskyText: found.text });
  }
  console.log(`\n[queue] Resolved ${resolved.length}/${queueFile.queue.length} Bluesky URIs.`);

  // Resolve skip URIs
  const skipResolved: Array<SkipEntry & { resolvedUri: string }> = [];
  for (const e of queueFile.skip_as_duplicate) {
    const found = await findBskyUri(agent, e.matchSubstring);
    if (found) skipResolved.push({ ...e, resolvedUri: found.uri });
  }
  console.log(`[queue] Resolved ${skipResolved.length}/${queueFile.skip_as_duplicate.length} skip URIs.`);

  // Drop already-mirrored
  const pending = resolved.filter((e) => !state.mirrored[e.resolvedUri]);
  console.log(`\n[queue] ${pending.length} pending after dedupe.`);

  // Show preview
  for (const [i, e] of pending.entries()) {
    const totalLen = e.text.length + 2 + 23; // +URL via postToX
    console.log(`\n  ${i + 1}. ${e.slug}`);
    console.log(`     X effective: ~${totalLen} chars  bsky: ${e.resolvedUri}`);
    console.log(`     "${e.text.replace(/\n/g, ' | ').slice(0, 140)}…"`);
  }

  if (!APPLY) {
    console.log('\n[queue] Dry-run. Pass --apply to ship.');
    return;
  }

  // Persist skip decisions in state so mirror-to-x.ts agrees
  for (const s of skipResolved) {
    if (!state.skipped[s.resolvedUri]) {
      state.skipped[s.resolvedUri] = {
        reason: `dup-of-manual-x: ${s.reason}`,
        skippedAt: new Date().toISOString(),
      };
    }
  }
  saveState(state);

  // Daily cap
  const remaining = DAILY_CAP - state.todayCount;
  if (remaining <= 0) {
    console.log(`\n[queue] Daily cap (${DAILY_CAP}) reached. Try again tomorrow.`);
    return;
  }

  // Spacing check (skip if no prior posts today)
  if (state.lastPostedAt) {
    const minsSince = (Date.now() - new Date(state.lastPostedAt).getTime()) / 60000;
    if (minsSince < SPACING_MIN) {
      const wait = Math.ceil(SPACING_MIN - minsSince);
      console.log(`\n[queue] Last X post was ${Math.round(minsSince)} min ago. Need ${SPACING_MIN} min spacing — would wait ${wait} min.`);
      console.log('[queue] Aborting; re-run later or pass --spacing-min 0 to override.');
      return;
    }
  }

  const toShip = pending.slice(0, Math.min(BATCH, remaining));
  console.log(`\n[queue] Posting ${toShip.length} of ${pending.length} pending (cap remaining today: ${remaining}/${DAILY_CAP})…`);

  let posted = 0;
  let failed = 0;
  for (const [i, e] of toShip.entries()) {
    console.log(`\n[queue] ${i + 1}/${toShip.length}  ${e.slug}`);
    try {
      const articleUrl = `https://parliamentaudit.ca/news/${e.slug}`;
      const res = await postToX({
        text: e.text,
        url: articleUrl,
        utmCampaign: `mirror-${todayStamp()}`,
      });
      console.log(`  [ok] posted to X. ${res.profileUrl}`);
      state.mirrored[e.resolvedUri] = {
        mirroredAt: new Date().toISOString(),
        finalText: res.finalText,
      };
      state.todayCount += 1;
      state.lastPostedAt = new Date().toISOString();
      saveState(state);
      posted += 1;

      await notify(
        `Mirrored to X: ${e.slug}`,
        e.text.split('\n\n')[0].slice(0, 140),
        res.profileUrl,
      );

      if (i < toShip.length - 1) {
        console.log(`  [wait] ${SPACING_MIN} min before next…`);
        await new Promise((r) => setTimeout(r, SPACING_MIN * 60 * 1000));
      }
    } catch (err: any) {
      const msg = (err?.message || String(err)).slice(0, 240);
      console.error(`  [fail] ${msg}`);
      failed += 1;
      await notify('X mirror FAILED', msg);
      break;
    }
  }

  await notify(
    `X queue batch: ${posted} posted${failed > 0 ? `, ${failed} failed` : ''}`,
    pending.length - posted > 0
      ? `${pending.length - posted} still queued. Re-run after spacing window or tomorrow.`
      : 'Queue empty.',
    'https://x.com/ParliamentAudit',
  );

  console.log(`\n[queue] Done. Posted ${posted}/${toShip.length}. Failed ${failed}. Pending remaining: ${pending.length - posted}.`);
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  if (e?.stack) console.error(e.stack.slice(0, 1200));
  process.exit(1);
});
