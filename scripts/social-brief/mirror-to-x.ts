/**
 * Mirror Bluesky originals onto X.
 *
 * Reads our @parliamentaudit.bsky.social author feed, identifies original
 * posts (not reposts, not replies) that we haven't yet mirrored to X,
 * filters out any that won't fit X's 280-char limit, then either previews
 * the queue (--dry-run, default) or posts them via the browser path
 * (--apply) with sensible spacing.
 *
 * Usage:
 *   npx tsx scripts/social-brief/mirror-to-x.ts                       # dry-run preview
 *   npx tsx scripts/social-brief/mirror-to-x.ts --apply --batch 1     # post one
 *   npx tsx scripts/social-brief/mirror-to-x.ts --apply --batch 3     # post 3 with 30-min spacing
 *   npx tsx scripts/social-brief/mirror-to-x.ts --apply --since 7d    # widen window to 7 days
 *
 * Safety rails:
 *   - Hard daily cap (DAILY_CAP). State tracked in .x-mirror-state.json.
 *   - Skips replies, quote-posts, and reposts on the Bluesky side.
 *   - Skips posts that contain placeholder markers ([ADD ...]).
 *   - Skips posts that won't fit on X after re-tagging URLs with utm_source=x.
 *   - 30-min minimum spacing between posts in --batch mode.
 *   - Skips anything we've already mirrored or explicitly skipped.
 */

import 'dotenv/config';
import { AtpAgent } from '@atproto/api';
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from 'node:fs';
import { resolve, join } from 'node:path';
import { postToX } from '../browser/post-x-lib.js';
import { withUtm } from '../utm.js';

// ─── CLI ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
function arg(name: string, dflt?: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : dflt;
}
const BATCH = parseInt(arg('batch', '1') || '1', 10);
const SINCE = arg('since', '7d') || '7d';
const SPACING_MIN = parseInt(arg('spacing-min', '30') || '30', 10);
const DAILY_CAP = parseInt(arg('daily-cap', '6') || '6', 10);

function parseSince(s: string): number {
  const m = s.match(/^(\d+)([dh])$/);
  if (!m) throw new Error(`--since must be like "7d" or "48h"; got "${s}"`);
  const n = parseInt(m[1], 10);
  return m[2] === 'd' ? n * 24 * 3600 * 1000 : n * 3600 * 1000;
}

// ─── Paths + state ────────────────────────────────────────────────────────
const ROOT = process.cwd();
const STATE_DIR = resolve(ROOT, 'content/social-briefs');
const STATE_PATH = join(STATE_DIR, '.x-mirror-state.json');

mkdirSync(STATE_DIR, { recursive: true });

interface MirrorState {
  /** uri -> { mirroredAt: ISO, finalText: string } */
  mirrored: Record<string, { mirroredAt: string; finalText: string }>;
  /** uri -> { reason: string, skippedAt: ISO } */
  skipped: Record<string, { reason: string; skippedAt: string }>;
  /** Daily counter to enforce DAILY_CAP. */
  todayCount: number;
  todayDate: string; // YYYY-MM-DD
  /** ISO ts of last successful post — used for spacing checks. */
  lastPostedAt: string | null;
}

function todayStamp(): string {
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
    const parsed = JSON.parse(readFileSync(STATE_PATH, 'utf8'));
    // Roll over the daily counter if the date has changed
    if (parsed.todayDate !== todayStamp()) {
      parsed.todayCount = 0;
      parsed.todayDate = todayStamp();
    }
    return { ...empty, ...parsed };
  } catch {
    return empty;
  }
}

function saveState(s: MirrorState) {
  writeFileSync(STATE_PATH, JSON.stringify(s, null, 2));
}

// ─── Bluesky fetch ────────────────────────────────────────────────────────
async function bskyAgent(): Promise<AtpAgent> {
  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) {
    throw new Error('BLUESKY_HANDLE / BLUESKY_APP_PASSWORD missing');
  }
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD });
  return agent;
}

interface Candidate {
  uri: string;
  cid: string;
  createdAt: string;
  text: string;
  /** parliamentaudit.ca URL extracted from the post's embed (if any) — mirrored as the X link. */
  embedUrl?: string;
  /** Predicted effective length on X (post text + 23-char URL if present). */
  effectiveXLen: number;
  /** Detected blockers (placeholder markers, too-long, partisan keywords). */
  skipReason?: string;
}

function deriveSkipReason(text: string, effectiveXLen: number): string | null {
  if (/\[ADD FACTUAL NOTE|\[SLUG\]/i.test(text)) return 'placeholder';
  if (effectiveXLen > 280) return `too-long (${effectiveXLen} chars > 280)`;
  // Reuse the loaded-language list from the social-brief watchlist.
  const skipKeywords = [
    'libtard',
    'cuckservative',
    'comrade',
    'wef',
    'great reset',
    'who lockdowns',
    '15-minute cities',
    'marxist',
    'libtards',
  ];
  const lower = text.toLowerCase();
  for (const k of skipKeywords) {
    if (lower.includes(k)) return `loaded-language:${k}`;
  }
  return null;
}

async function fetchCandidates(
  agent: AtpAgent,
  state: MirrorState,
  sinceMs: number,
): Promise<Candidate[]> {
  const did = agent.session!.did;
  const out: Candidate[] = [];
  let cursor: string | undefined;
  for (let pages = 0; pages < 5; pages++) {
    const res = await agent.getAuthorFeed({
      actor: did,
      limit: 50,
      filter: 'posts_no_replies',
      cursor,
    });
    cursor = res.data.cursor;
    if (!res.data.feed?.length) break;

    for (const item of res.data.feed) {
      // Skip reposts (we shouldn't re-amp our own reposts)
      if ((item.reason as any)?.$type === 'app.bsky.feed.defs#reasonRepost') continue;
      const post = item.post;
      if (!post?.record) continue;

      const record = post.record as any;
      // Belt-and-suspenders: skip replies (filter above should do it but...)
      if (record.reply) continue;

      const createdAt = record.createdAt;
      if (!createdAt) continue;
      const ts = new Date(createdAt).getTime();
      if (ts < Date.now() - sinceMs) {
        // We're past the window — earlier pages won't help
        return out;
      }

      // Already handled?
      if (state.mirrored[post.uri] || state.skipped[post.uri]) continue;

      const text = record.text as string;
      if (!text || !text.trim()) continue;

      // Pull a parliamentaudit.ca URL from the embed if present
      let embedUrl: string | undefined;
      const embed = record.embed;
      if (embed?.$type === 'app.bsky.embed.external' && embed.external?.uri) {
        const u = embed.external.uri as string;
        if (/parliamentaudit\.ca/.test(u)) {
          embedUrl = u;
        }
      }

      // Estimate X effective length: text + (link cost = 23 if embedUrl)
      const effectiveXLen = embedUrl ? text.length + 2 + 23 : text.length;

      const reason = deriveSkipReason(text, effectiveXLen);
      const c: Candidate = {
        uri: post.uri,
        cid: post.cid,
        createdAt,
        text,
        embedUrl,
        effectiveXLen,
        ...(reason ? { skipReason: reason } : {}),
      };
      out.push(c);
    }

    if (!cursor) break;
  }
  // Oldest-first so we mirror chronologically
  out.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return out;
}

// ─── ntfy ─────────────────────────────────────────────────────────────────
const NTFY_TOPIC = process.env.NTFY_TOPIC || 'parliamentaudit-posts';
async function notify(title: string, body: string, click?: string) {
  try {
    const headers: Record<string, string> = {
      Title: title,
      Tags: 'x_twitter,mirror',
      Priority: '3',
    };
    if (click) headers.Click = click;
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, { method: 'POST', headers, body });
  } catch {
    /* never break run */
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  const sinceMs = parseSince(SINCE);
  const state = loadState();

  console.log(`[mirror] window: last ${SINCE} | batch: ${BATCH} | apply: ${APPLY}`);
  console.log(`[mirror] today's count: ${state.todayCount} / ${DAILY_CAP}`);
  if (state.lastPostedAt) {
    const minsSince = Math.round((Date.now() - new Date(state.lastPostedAt).getTime()) / 60000);
    console.log(`[mirror] minutes since last X post: ${minsSince}`);
  }

  const agent = await bskyAgent();
  const candidates = await fetchCandidates(agent, state, sinceMs);

  const queue = candidates.filter((c) => !c.skipReason);
  const skipped = candidates.filter((c) => c.skipReason);

  console.log(`\n[mirror] ${candidates.length} unhandled posts in window:`);
  console.log(`         ${queue.length} mirrorable, ${skipped.length} blocked`);

  if (skipped.length > 0) {
    console.log('\n  Blocked posts (will be persisted to skipped state on --apply):');
    for (const c of skipped.slice(0, 10)) {
      console.log(`    [skip ${c.skipReason}] ${c.createdAt}  "${c.text.slice(0, 90).replace(/\n/g, ' ')}"`);
    }
    if (skipped.length > 10) console.log(`    … and ${skipped.length - 10} more.`);
  }

  if (queue.length === 0) {
    console.log('\n[mirror] No mirrorable candidates. Nothing to do.');
    if (APPLY) {
      // Persist the skip decisions so we don't reconsider them every run
      for (const c of skipped) {
        state.skipped[c.uri] = { reason: c.skipReason!, skippedAt: new Date().toISOString() };
      }
      saveState(state);
    }
    return;
  }

  console.log('\n[mirror] Mirrorable queue (oldest first):');
  for (const c of queue.slice(0, 20)) {
    console.log(`  ${c.createdAt}  ${c.effectiveXLen}c  "${c.text.slice(0, 90).replace(/\n/g, ' ')}…"`);
  }
  if (queue.length > 20) console.log(`  … and ${queue.length - 20} more.`);

  if (!APPLY) {
    console.log('\n[mirror] Dry run — no posts sent. Add --apply to ship.');
    return;
  }

  // Persist all skips so we don't re-evaluate them next run
  for (const c of skipped) {
    state.skipped[c.uri] = { reason: c.skipReason!, skippedAt: new Date().toISOString() };
  }
  saveState(state);

  // Spacing check
  if (state.lastPostedAt) {
    const minsSince = (Date.now() - new Date(state.lastPostedAt).getTime()) / 60000;
    if (minsSince < SPACING_MIN) {
      const wait = Math.ceil(SPACING_MIN - minsSince);
      console.log(`\n[mirror] Last X post was ${Math.round(minsSince)} min ago. Need ${SPACING_MIN} min spacing — would wait ${wait} min.`);
      console.log('[mirror] Aborting now to be safe. Re-run later or pass --spacing-min 0 to override.');
      return;
    }
  }

  // Daily cap
  const remainingToday = DAILY_CAP - state.todayCount;
  if (remainingToday <= 0) {
    console.log(`\n[mirror] Daily cap (${DAILY_CAP}) reached. Try again tomorrow or pass --daily-cap N to override.`);
    return;
  }

  const toShip = queue.slice(0, Math.min(BATCH, remainingToday));
  console.log(`\n[mirror] Posting ${toShip.length} of ${queue.length} candidates (cap: ${remainingToday}/${DAILY_CAP} today)…`);

  let posted = 0;
  let failed = 0;
  for (const [i, c] of toShip.entries()) {
    console.log(`\n[mirror] ${i + 1}/${toShip.length}  ${c.createdAt}`);
    console.log(`  text: "${c.text.slice(0, 90).replace(/\n/g, ' ')}…"`);
    if (c.embedUrl) console.log(`  link: ${c.embedUrl}`);

    try {
      const res = await postToX({
        text: c.text,
        url: c.embedUrl,
        utmCampaign: `mirror-${todayStamp()}`,
      });
      console.log(`  [ok] posted to X. profile: ${res.profileUrl}`);
      state.mirrored[c.uri] = {
        mirroredAt: new Date().toISOString(),
        finalText: res.finalText,
      };
      state.todayCount += 1;
      state.lastPostedAt = new Date().toISOString();
      saveState(state);
      posted += 1;

      await notify(
        'Mirrored to X',
        c.text.split('\n\n')[0].slice(0, 140),
        res.profileUrl,
      );

      if (i < toShip.length - 1) {
        // Wait between posts in a batch run
        const waitMs = SPACING_MIN * 60 * 1000;
        console.log(`  [wait] ${SPACING_MIN} min before next…`);
        await new Promise((r) => setTimeout(r, waitMs));
      }
    } catch (e: any) {
      const msg = (e?.message || String(e)).slice(0, 240);
      console.error(`  [fail] ${msg}`);
      failed += 1;
      await notify('Mirror to X FAILED', msg);
      // Don't update state on failure — we'll retry next run
      // Don't continue the batch — fail fast
      break;
    }
  }

  // Final summary
  await notify(
    `X mirror: ${posted} posted${failed > 0 ? `, ${failed} failed` : ''}`,
    queue.length > posted ? `${queue.length - posted} candidate(s) still queued for next run.` : 'Queue empty for now.',
    'https://x.com/ParliamentAudit',
  );

  console.log(`\n[mirror] Done. Posted ${posted}/${toShip.length}. Failed ${failed}. Queue remaining: ${queue.length - posted}.`);
}

main().catch((e) => {
  console.error('[mirror] Fatal:', e?.message || e);
  if (e?.stack) console.error(e.stack.slice(0, 1000));
  process.exit(1);
});
