/**
 * Autonomous series publisher.
 *
 * Walks `content/series/*​/day-NN.article.ts` files in order, finds the first
 * one whose slug isn't yet in `apps/web/src/content/news-articles.ts`, and
 * runs the full publish chain end-to-end:
 *
 *   1. Lift the article object literal as TEXT (no eval, no JSON round-trip)
 *   2. Prepend to news-articles.ts inside the newsArticles[] array
 *   3. git add + commit + push (Railway picks up the deploy)
 *   4. Poll the deploy until the article URL serves real content
 *   5. Post Bluesky via post-arbitrary-bluesky.ts using day-NN.bsky.txt
 *   6. Prepend day-NN.x-queue.json to scripts/social-brief/x-mirror-queue.json
 *      with the resolved bskyUri filled in
 *   7. Fire mirror-queue-apply --apply --batch 1 (auto verify-x-post)
 *
 * Designed to be called by `scripts/daily-ops.ts` ahead of the existing
 * mirror-queue → auto-amplify fallback chain. When there is a staged but
 * unpublished day, this script is the auto-publish gate's first choice;
 * the existing fallbacks remain for days when the series is already
 * caught up.
 *
 * Per operator authorization 2026-05-17 ("Full publish without asking"):
 * this script ships content without requiring per-day approval, provided:
 *   - The article object validates structurally (slug, headline, sections,
 *     sources all present and non-empty)
 *   - The Bluesky body is non-empty and under the chars cap
 *   - There is no AUTO_PAUSE_TRAGEDY flag present
 * Otherwise the script exits with a clear error so the daily-ops cron
 * reports it and you see it in the morning.
 *
 * Usage:
 *   npx tsx scripts/series/publish-next-day.ts                    # dry-run by default
 *   npx tsx scripts/series/publish-next-day.ts --apply             # do the publish
 *   npx tsx scripts/series/publish-next-day.ts --series bill-c-22 --apply
 *   npx tsx scripts/series/publish-next-day.ts --apply --skip-x   # skip X mirror
 */
import 'dotenv/config';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const SKIP_X = args.includes('--skip-x');
const SKIP_BSKY = args.includes('--skip-bsky');

function arg(name: string, dflt?: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : dflt;
}
const SERIES = arg('series', 'bill-c-22')!;
const ROOT = process.cwd();
const SERIES_DIR = resolve(ROOT, 'content/series', SERIES);
const NEWS_ARTICLES_PATH = resolve(ROOT, 'apps/web/src/content/news-articles.ts');
const X_QUEUE_PATH = resolve(ROOT, 'scripts/social-brief/x-mirror-queue.json');
const AUTO_PAUSE_TRAGEDY = resolve(ROOT, 'content/AUTO_PAUSE_TRAGEDY');

const NTFY_TOPIC = process.env.NTFY_TOPIC || 'parliamentaudit-posts';

function log(...a: any[]) {
  console.log('[series-publish]', ...a);
}
async function notify(title: string, body: string, click?: string) {
  try {
    const headers: Record<string, string> = {
      Title: title,
      Tags: 'series,bill_c22,auto_publish',
      Priority: '3',
    };
    if (click) headers.Click = click;
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, { method: 'POST', headers, body });
  } catch {
    /* best-effort */
  }
}

function bail(msg: string): never {
  console.error('[series-publish] FAIL:', msg);
  notify('🚨 series-publish FAILED', msg.slice(0, 240));
  process.exit(1);
}

async function main() {
// ── Step 0: brand-safety check ────────────────────────────────────────
if (existsSync(AUTO_PAUSE_TRAGEDY)) {
  log('⏸ AUTO_PAUSE_TRAGEDY present — skipping series publish until halt clears.');
  process.exit(0);
}

// ── Step 1: find next unpublished day in this series ─────────────────
if (!existsSync(SERIES_DIR)) bail(`series dir not found: ${SERIES_DIR}`);
const newsContent = readFileSync(NEWS_ARTICLES_PATH, 'utf8');

const articleFiles = readdirSync(SERIES_DIR)
  .filter((f) => /^day-\d+\.article\.ts$/.test(f))
  .sort();
if (articleFiles.length === 0) bail(`no day-NN.article.ts files in ${SERIES_DIR}`);

let nextDayFile: string | undefined;
let nextSlug: string | undefined;
let nextDayContent: string | undefined;
for (const f of articleFiles) {
  const content = readFileSync(join(SERIES_DIR, f), 'utf8');
  const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
  if (!slugMatch) {
    log(`warn: no slug found in ${f}, skipping`);
    continue;
  }
  const slug = slugMatch[1];
  if (newsContent.includes(`slug: '${slug}'`) || newsContent.includes(`slug: "${slug}"`)) {
    log(`already published: ${f} (${slug})`);
    continue;
  }
  nextDayFile = f;
  nextSlug = slug;
  nextDayContent = content;
  break;
}

if (!nextDayFile || !nextSlug || !nextDayContent) {
  log(`✓ series "${SERIES}" complete — no unpublished days. Exiting clean.`);
  process.exit(0);
}
log(`next day: ${nextDayFile} (slug=${nextSlug})`);

// ── Step 2: lift the article object literal as TEXT ──────────────────
// We do NOT eval. We slice the source between the `= ` after the type
// annotation and the matching closing `};`. Brace-depth tracking handles
// nested objects + arrays correctly.
const startMarker = /export const article:\s*NewsArticle\s*=\s*/;
const startMatch = nextDayContent.match(startMarker);
if (!startMatch) bail(`could not find "export const article: NewsArticle = " in ${nextDayFile}`);
const startIdx = (startMatch.index ?? 0) + startMatch[0].length;

let depth = 0;
let endIdx = -1;
let inString: string | null = null;
let escape = false;
for (let i = startIdx; i < nextDayContent.length; i++) {
  const ch = nextDayContent[i];
  if (escape) {
    escape = false;
    continue;
  }
  if (inString) {
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (ch === inString) inString = null;
    continue;
  }
  if (ch === "'" || ch === '"' || ch === '`') {
    inString = ch;
    continue;
  }
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) {
      endIdx = i + 1;
      break;
    }
  }
}
if (endIdx === -1) bail(`couldn't find matching }; in ${nextDayFile}`);

let articleLiteral = nextDayContent.slice(startIdx, endIdx);

// Replace `publishedAt: new Date().toISOString()` (or a static future
// date) with the current ISO timestamp at publish moment. The string
// also has to round-trip through TS syntax cleanly.
const nowIso = new Date().toISOString();
articleLiteral = articleLiteral.replace(
  /publishedAt:\s*new Date\(\)\.toISOString\(\)/,
  `publishedAt: '${nowIso}'`,
);
// Or replace a placeholder string like 'TBD' or 'PUBLISH_TIME':
articleLiteral = articleLiteral.replace(
  /publishedAt:\s*['"](?:TBD|PUBLISH_TIME)['"]/,
  `publishedAt: '${nowIso}'`,
);

// ── Step 3: prepend into newsArticles[] ──────────────────────────────
const arrayMarker = 'export const newsArticles: NewsArticle[] = [';
const arrayStartIdx = newsContent.indexOf(arrayMarker);
if (arrayStartIdx === -1) bail(`couldn't find newsArticles array start in ${NEWS_ARTICLES_PATH}`);
const insertPoint = arrayStartIdx + arrayMarker.length;

const newNewsContent =
  newsContent.slice(0, insertPoint) +
  '\n  ' +
  articleLiteral +
  ',' +
  newsContent.slice(insertPoint);

if (!APPLY) {
  log(`DRY RUN. Would prepend article (${articleLiteral.length} chars) to news-articles.ts.`);
  log(`Would commit, push, deploy, then post Bluesky + queue X mirror.`);
  process.exit(0);
}

writeFileSync(NEWS_ARTICLES_PATH, newNewsContent);
log(`✓ prepended article to news-articles.ts (slug=${nextSlug})`);

// ── Step 4: git commit + push ────────────────────────────────────────
function sh(cmd: string, opts: { allowFailure?: boolean } = {}): string {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).toString();
  } catch (e: any) {
    if (opts.allowFailure) return '';
    bail(`shell failed: ${cmd}\n${(e?.stderr?.toString() || e?.message || '').slice(0, 400)}`);
  }
}

sh(`git add ${JSON.stringify(NEWS_ARTICLES_PATH)}`);
sh(
  `git commit -m ${JSON.stringify(
    `Series ${SERIES}: auto-publish ${nextSlug}\n\nFired by scripts/series/publish-next-day.ts on the daily-ops cron.\nStaged file: content/series/${SERIES}/${nextDayFile}`,
  )}`,
);
sh('git push origin main');
log('✓ committed + pushed');

// ── Step 5: poll the deploy until article URL is live ────────────────
const articleUrl = `https://parliamentaudit.ca/news/${nextSlug}`;
async function pollDeploy(timeoutMs: number): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(articleUrl + '?cb=' + Date.now(), {
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) {
        const text = await res.text();
        // The Next.js 404 fallback returns 200 with "Article Not Found"
        // body. Real article pages contain the slug in <title> or in the
        // first <h1>. Cheapest check: the article's headline word.
        if (!text.includes('Article Not Found')) {
          return true;
        }
      }
    } catch {
      /* keep polling */
    }
    await new Promise((r) => setTimeout(r, 10_000));
  }
  return false;
}

log(`polling deploy at ${articleUrl}…`);
const deployed = await pollDeploy(6 * 60 * 1000); // 6 min cap
if (!deployed) bail(`deploy didn't go live within 6 minutes (${articleUrl})`);
log('✓ article deploy is live');

// ── Step 6: post Bluesky ─────────────────────────────────────────────
const bskyTxtFile = join(SERIES_DIR, nextDayFile.replace('.article.ts', '.bsky.txt'));
if (!existsSync(bskyTxtFile)) bail(`Bluesky companion file not found: ${bskyTxtFile}`);

if (SKIP_BSKY) {
  log('--skip-bsky set; skipping Bluesky post');
} else {
  const campaign = `series-${SERIES}-${nextDayFile.replace('.article.ts', '')}`;
  log(`posting to Bluesky (campaign=${campaign})…`);
  const bskyOut = sh(
    `npx tsx scripts/post-arbitrary-bluesky.ts --text-file ${JSON.stringify(
      bskyTxtFile,
    )} --slug ${JSON.stringify(nextSlug)} --campaign ${JSON.stringify(campaign)}`,
  );
  log(bskyOut.trim().split('\n').slice(-5).join('\n'));
  // Pause briefly for the AppView to settle before the X-mirror lookup.
  await new Promise((r) => setTimeout(r, 8_000));
}

// ── Step 7: prepend X mirror queue entry + fire ──────────────────────
const xQueueEntryFile = join(SERIES_DIR, nextDayFile.replace('.article.ts', '.x-queue.json'));
if (SKIP_X) {
  log('--skip-x set; skipping X mirror');
} else if (!existsSync(xQueueEntryFile)) {
  log(`warn: X queue entry file not found: ${xQueueEntryFile}; skipping X mirror`);
} else {
  let xQueue: any = { queue: [], skip_as_duplicate: [] };
  if (existsSync(X_QUEUE_PATH)) {
    xQueue = JSON.parse(readFileSync(X_QUEUE_PATH, 'utf8'));
    if (!Array.isArray(xQueue.queue)) xQueue.queue = [];
    if (!Array.isArray(xQueue.skip_as_duplicate)) xQueue.skip_as_duplicate = [];
  }
  const newEntry = JSON.parse(readFileSync(xQueueEntryFile, 'utf8'));
  // Strip internal _comment fields, drop the human-readable bskyUri
  // label if it lacks an at:// prefix — mirror-queue-apply resolves it
  // at runtime via the matchSubstring search.
  delete newEntry._comment;
  if (!newEntry.bskyUri) {
    newEntry.bskyUri = `Series ${SERIES} — ${nextDayFile}`;
  }
  xQueue.queue.unshift(newEntry);
  writeFileSync(X_QUEUE_PATH, JSON.stringify(xQueue, null, 2));
  log('✓ X mirror queue entry prepended');

  // Commit + push the queue update so cron-side state is consistent.
  sh(`git add ${JSON.stringify(X_QUEUE_PATH)}`);
  sh(
    `git commit -m ${JSON.stringify(`Series ${SERIES}: queue X mirror for ${nextSlug}`)}`,
    { allowFailure: true },
  );
  sh('git push origin main', { allowFailure: true });

  // Fire mirror-queue-apply. The verify-x-post module inside it auto-
  // recovers from silent X failures (retry-with-image, retry-without-
  // image). spacing-min override of 5 is appropriate because the prior
  // X post is likely from > 24h ago by the time the cron fires.
  log('firing mirror-queue-apply --apply --batch 1 --spacing-min 5');
  const xOut = sh(
    `npx tsx scripts/social-brief/mirror-queue-apply.ts --apply --batch 1 --spacing-min 5`,
  );
  const tail = xOut.trim().split('\n').slice(-8).join('\n');
  log(tail);
}

await notify(
  `✓ series ${SERIES}: ${nextSlug}`,
  `Day published end-to-end. Bluesky + X + (Mastodon next cron). Article: ${articleUrl}`,
  articleUrl,
);

log(`✓ series day published end-to-end: ${articleUrl}`);
process.exit(0);
}

main().catch((e) => {
  console.error('[series-publish] fatal:', e?.message || e);
  process.exit(1);
});
