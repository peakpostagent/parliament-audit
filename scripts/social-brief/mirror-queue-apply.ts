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
import { verifyXPost } from '../browser/verify-x-post.js';
import { runAllGuards } from './guard-rails.js';

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
const FAILURE_LOG_PATH = resolve(ROOT, 'content/social-briefs/.x-mirror-failures.json');

/**
 * After postToX returns, we re-open X and confirm the tweet actually
 * appears on our public profile. Without this check, the script can mark
 * a post as `mirrored` in state even when X silently dropped it (rate
 * limit, "we couldn't post that" modal the script missed, etc.). The
 * verification policy is:
 *   1. Wait 30s after compose-submit (X needs render time)
 *   2. Try verifyXPost (up to 4 attempts, 15s apart)
 *   3. If verification fails:
 *      a. retry the WHOLE post ONCE (same content, same image)
 *      b. if that also fails verification: retry the post WITHOUT image
 *      c. if THAT also fails: log to .x-mirror-failures.json + ntfy alert,
 *         do NOT mark as mirrored (so next run retries)
 * The unique substring used for verification is the first 40 chars of
 * the queue entry's text, which is distinctive enough across our content.
 */
function verifySubstringFor(text: string): string {
  return text.replace(/\s+/g, ' ').trim().slice(0, 40);
}

interface MirrorFailureRecord {
  slug: string;
  bskyUri: string;
  attemptedAt: string;
  attempts: number;
  finalText: string;
  reason: string;
  staleMatchPostedAt?: string;
}
interface MirrorFailureLog {
  failures: MirrorFailureRecord[];
}
function loadFailureLog(): MirrorFailureLog {
  if (!existsSync(FAILURE_LOG_PATH)) return { failures: [] };
  try {
    return { failures: [], ...JSON.parse(readFileSync(FAILURE_LOG_PATH, 'utf8')) };
  } catch {
    return { failures: [] };
  }
}
function appendFailure(rec: MirrorFailureRecord) {
  const log = loadFailureLog();
  log.failures.push(rec);
  // Keep the file from growing unbounded — keep the most recent 200.
  if (log.failures.length > 200) log.failures = log.failures.slice(-200);
  writeFileSync(FAILURE_LOG_PATH, JSON.stringify(log, null, 2));
}

interface QueueEntry {
  bskyUri: string;
  matchSubstring: string;
  slug: string;
  text: string;
  /**
   * If set, /api/og/feed-card is rendered with this mode and attached
   * to the X post directly (suppresses the wide link card). Modes:
   *   stat       — hero-stat-dominant 1200×1200
   *   comparison — split-portrait (subjects[] required on the article)
   *   quote      — pull-quote treatment (imageQuote / imageAttrib / imageContext required)
   *   headline   — fallback, headline-dominant
   */
  imageMode?: 'stat' | 'comparison' | 'quote' | 'headline';
  imageQuote?: string;
  imageAttrib?: string;
  imageContext?: string;
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
      // Pre-post guard rails — bracket leaks, stale dates, tragedy pause.
      // category='analysis' so committee + transcript posts get the 7d window
      // instead of the 24h breaking-news window.
      const guard = runAllGuards({
        text: e.text,
        eventDate: undefined, // queue entries don't carry an event date today
        category: 'analysis',
      });
      if (guard.severity === 'block') {
        console.error(`  [block] guard-rail tripped: ${guard.reason}`);
        await notify('X mirror BLOCKED by guard-rail', `${e.slug}: ${guard.reason}`);
        failed += 1;
        // Don't post; don't break — let the loop try the next item, since
        // the failure is item-specific, not run-fatal.
        continue;
      }
      if (guard.severity === 'warn') {
        console.warn(`  [warn] guard-rail: ${guard.reason}`);
      }

      const articleUrl = `https://parliamentaudit.ca/news/${e.slug}`;

      // Build the feed-card image URL. As of 2026-05-12 we attach an
      // image to EVERY X mirror, defaulting to imageMode='headline' if
      // the queue entry didn't specify one. Previously the absence of
      // imageMode meant we relied on X's link-card crawler — which
      // sometimes lagged and rendered a blank grey card on X even
      // though the page's twitter:image meta was valid. Attaching the
      // 1200×1200 feed-card directly via X's compose upload removes
      // that dependency and makes the card deterministic.
      //
      // Authors should still specify imageMode for richer treatments:
      //   stat       — hero-stat-dominant ($$, % vote splits, large
      //                round numbers — best for budget/quant pieces)
      //   comparison — split portrait (REQUIRES subjects[] on the
      //                article — for floor-crossings, then/now, etc.)
      //   quote      — pull-quote treatment (REQUIRES imageQuote +
      //                imageAttrib + imageContext on the queue entry)
      //   headline   — default fallback, headline-dominant
      const mode = e.imageMode ?? 'headline';
      const params = new URLSearchParams({ slug: e.slug, mode });
      if (mode === 'quote') {
        if (e.imageQuote) params.set('q', e.imageQuote);
        if (e.imageAttrib) params.set('attrib', e.imageAttrib);
        if (e.imageContext) params.set('context', e.imageContext);
      }
      const attachImage = `https://parliamentaudit.ca/api/og/feed-card?${params.toString()}`;
      console.log(`  [image] mode=${mode} ${attachImage}`);
      if (!e.imageMode) {
        console.log(`  [image] note: no imageMode set on entry; defaulted to 'headline'. Consider stat/comparison/quote for richer cards.`);
      }

      // ── Step 1: post via compose ──────────────────────────────────
      let res = await postToX({
        text: e.text,
        url: articleUrl,
        utmCampaign: `mirror-${todayStamp()}`,
        attachImage,
      });
      console.log(`  [submit] compose returned ok. ${res.profileUrl}`);

      // ── Step 2: verify the tweet actually appeared on our profile ─
      const verifySub = verifySubstringFor(e.text);
      console.log(`  [verify] looking for "${verifySub}" on profile (30s settle)`);
      await new Promise((r) => setTimeout(r, 30_000));
      let v = await verifyXPost({ textSubstring: verifySub });
      let verifyMode: 'first' | 'retry-with-image' | 'retry-no-image' = 'first';

      // ── Step 3a: retry once with the same content if verify failed ─
      if (!v.ok) {
        console.log(`  [verify] FIRST attempt failed (${v.reason}). Retrying post with same content in 60s.`);
        await notify(
          `X verify failed, retrying: ${e.slug}`,
          `reason=${v.reason}; first retry with same content`,
        );
        await new Promise((r) => setTimeout(r, 60_000));
        res = await postToX({
          text: e.text,
          url: articleUrl,
          utmCampaign: `mirror-${todayStamp()}-r1`,
          attachImage,
        });
        await new Promise((r) => setTimeout(r, 30_000));
        v = await verifyXPost({ textSubstring: verifySub });
        verifyMode = 'retry-with-image';
      }

      // ── Step 3b: if still failing AND we had an image, try without ─
      if (!v.ok && attachImage) {
        console.log(`  [verify] retry-with-image failed (${v.reason}). Trying without image.`);
        await notify(
          `X verify failed twice, trying no-image: ${e.slug}`,
          `reason=${v.reason}; image upload may be the suspect`,
        );
        await new Promise((r) => setTimeout(r, 60_000));
        res = await postToX({
          text: e.text,
          url: articleUrl,
          utmCampaign: `mirror-${todayStamp()}-r2`,
          // attachImage intentionally omitted — fall back to X's link-card crawler
        });
        await new Promise((r) => setTimeout(r, 30_000));
        v = await verifyXPost({ textSubstring: verifySub });
        verifyMode = 'retry-no-image';
      }

      // ── Step 4: decide ────────────────────────────────────────────
      if (v.ok) {
        console.log(`  [verify] ✓ post is live (${verifyMode}, ${v.attempts} verify-attempts). ${v.found?.url || ''}`);
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
          (verifyMode !== 'first' ? `(via ${verifyMode}) ` : '') +
            e.text.split('\n\n')[0].slice(0, 120),
          v.found?.url || res.profileUrl,
        );
      } else {
        // All recovery paths exhausted. Log to audit trail; DO NOT mark
        // as mirrored. Next mirror-queue-apply run will see this entry
        // as still-pending and retry.
        console.error(
          `  [verify] ✗ post is NOT live after ${verifyMode} (${v.attempts} verify-attempts). reason=${v.reason}.`,
        );
        appendFailure({
          slug: e.slug,
          bskyUri: e.resolvedUri,
          attemptedAt: new Date().toISOString(),
          attempts: v.attempts,
          finalText: res.finalText,
          reason: `${verifyMode}:${v.reason}`,
          staleMatchPostedAt: v.staleMatch?.postedAt,
        });
        failed += 1;
        await notify(
          `🚨 X mirror FAILED verification: ${e.slug}`,
          `Tried ${verifyMode}. reason=${v.reason}. Logged to .x-mirror-failures.json. Entry remains in queue for next run.`,
        );
        // Don't break — keep trying other queue entries; this one is just
        // logged as a failure and will be retried on the next run.
      }

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
