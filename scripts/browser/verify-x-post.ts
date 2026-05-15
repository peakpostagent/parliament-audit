/**
 * Verify that a post we just submitted to X via browser automation is
 * actually live on our public profile timeline.
 *
 * Why this exists:
 *   `postToX()` returns success when it successfully *submitted* the
 *   compose form. That's NOT the same as the post being live. X can:
 *     - Silently drop the post due to a rate limit
 *     - Show a "we couldn't post that" modal that the script missed
 *     - Hold the post in a "Pending" / shadow-banned state
 *     - Strip the attached image while keeping the text
 *     - Trim the URL via t.co in a way that broke the link card
 *   Treating the compose-form return as ground truth caused us to mark
 *   posts as `mirrored` in state when they hadn't actually shipped.
 *
 * Strategy:
 *   Re-open a clean browser, navigate to /ParliamentAudit, scan the
 *   first ~15 rendered articles for one whose `time[datetime]` is
 *   within `withinSeconds` of now AND whose text contains a
 *   distinctive substring of what we just posted. Retry with backoff
 *   so we tolerate X's render lag (often 5–30s on a fresh post).
 *
 * Read-only via browser — no API call, no auth required beyond the
 * existing session in .browser-profile/. Works whether or not we
 * have X API read access.
 *
 * Usage as a module:
 *   import { verifyXPost } from './verify-x-post.js';
 *   const v = await verifyXPost({ textSubstring: 'Budget 2025, by the numbers' });
 *   if (!v.ok) console.error('post did not appear:', v.reason);
 *
 * Usage as a CLI (debugging, ad-hoc):
 *   npx tsx scripts/browser/verify-x-post.ts --text "Budget 2025, by the numbers"
 *   npx tsx scripts/browser/verify-x-post.ts --text "..." --within 600 --attempts 4
 */
import { openBrowser } from './context.js';

export interface VerifyXPostOpts {
  /**
   * Distinctive substring of the post body to look for in our profile feed.
   * Should be a unique phrase from the post (not "the" or "Canada"). At least
   * 25 chars recommended.
   */
  textSubstring: string;
  /**
   * Post must have a tweet `time[datetime]` within this many seconds of now
   * to count. Defaults to 600 (10 min) — generous to account for X's render
   * lag and our own retry interval.
   */
  withinSeconds?: number;
  /** Total number of profile-load attempts. Default 4. */
  maxAttempts?: number;
  /** Delay between attempts. Default 15000 ms. */
  intervalMs?: number;
  /** Run browser headless. Default true (background). */
  headless?: boolean;
  /** Print step-by-step logs. Default false. */
  verbose?: boolean;
}

export interface VerifyXPostFound {
  /** datetime attribute of the matched tweet's <time> element (ISO). */
  postedAt: string;
  /** The matched tweet's visible text (first ~200 chars). */
  text: string;
  /** Best-effort URL to the tweet (if extractable). */
  url?: string;
}

export interface VerifyXPostResult {
  ok: boolean;
  found?: VerifyXPostFound;
  attempts: number;
  /**
   * Why ok=false. One of:
   *   'no-match'           — profile loaded, no recent tweet contained the substring
   *   'profile-empty'      — profile loaded but rendered no articles
   *   'browser-error'      — navigation/render error
   *   'all-attempts-failed'— exceeded maxAttempts
   */
  reason?: string;
  /**
   * If we found a tweet with the substring but its time was too old, we
   * report it here so callers can distinguish "post never appeared" from
   * "post appeared but we got the wrong one back" (e.g. duplicate-detect
   * collision with an old article).
   */
  staleMatch?: VerifyXPostFound;
}

const PROFILE_URL = 'https://x.com/ParliamentAudit';

/**
 * Tweet articles on X's profile timeline carry:
 *   - <time datetime="..."> the post time (ISO 8601)
 *   - <a href="/ParliamentAudit/status/<id>"> the permalink
 *   - innerText of the article including all card text
 * We extract those three things via a single page.evaluate() call so the
 * traversal happens in one round trip.
 */
interface ScrapedTweet {
  time: string;
  text: string;
  permalink: string;
}

export async function verifyXPost(opts: VerifyXPostOpts): Promise<VerifyXPostResult> {
  const {
    textSubstring,
    withinSeconds = 600,
    maxAttempts = 4,
    intervalMs = 15000,
    headless = true,
    verbose = false,
  } = opts;

  if (!textSubstring || textSubstring.length < 8) {
    throw new Error(
      'verifyXPost: textSubstring must be ≥ 8 chars (need it to be distinctive enough to match)',
    );
  }

  const cutoffMs = Date.now() - withinSeconds * 1000;
  const log = (...args: any[]) => verbose && console.log('[verify-x-post]', ...args);

  let lastStale: VerifyXPostFound | undefined;
  let attempt = 0;
  let { ctx, page } = await openBrowser({ headless });

  try {
    while (attempt < maxAttempts) {
      attempt += 1;
      try {
        log(`attempt ${attempt}/${maxAttempts} — loading profile`);
        await page.goto(PROFILE_URL, { waitUntil: 'load', timeout: 30_000 });
        // X uses streamed/virtualized rendering. Wait for at least one
        // <article> + a small settle pause so links populate.
        await page.waitForSelector('article', { timeout: 20_000 }).catch(() => null);
        await page.waitForTimeout(2500);

        const scraped: ScrapedTweet[] = await page.evaluate(() => {
          const out: { time: string; text: string; permalink: string }[] = [];
          for (const a of Array.from(document.querySelectorAll('article'))) {
            const time = a.querySelector('time')?.getAttribute('datetime') || '';
            // Permalink: time element typically has an <a> ancestor whose
            // href is /<handle>/status/<id>. Find the closest such anchor.
            let permalink = '';
            const link = a.querySelector('a[href*="/status/"]') as HTMLAnchorElement | null;
            if (link && link.href) permalink = link.href;
            const text = (a as HTMLElement).innerText.replace(/\s+/g, ' ').trim();
            if (time) out.push({ time, text, permalink });
          }
          return out;
        });

        log(`scraped ${scraped.length} articles`);

        if (scraped.length === 0) {
          log('profile rendered no articles — retrying');
        } else {
          // Find a tweet whose innerText contains the substring.
          const matchAll = scraped.filter((t) => t.text.includes(textSubstring));
          // Among matches, prefer ones within our recency window.
          const matchFresh = matchAll.find((t) => {
            const ts = Date.parse(t.time);
            return !Number.isNaN(ts) && ts >= cutoffMs;
          });
          if (matchFresh) {
            log(`fresh match: ${matchFresh.time}`);
            return {
              ok: true,
              attempts: attempt,
              found: {
                postedAt: matchFresh.time,
                text: matchFresh.text.slice(0, 200),
                url: matchFresh.permalink || undefined,
              },
            };
          }
          if (matchAll.length && !lastStale) {
            // Remember the stale match for the failure path.
            const m = matchAll[0];
            lastStale = {
              postedAt: m.time,
              text: m.text.slice(0, 200),
              url: m.permalink || undefined,
            };
            log(`stale match: ${m.time} (outside ${withinSeconds}s window)`);
          }
        }
      } catch (e: any) {
        log(`attempt error: ${(e?.message || String(e)).slice(0, 120)}`);
        // Don't bail — let the retry loop handle it.
      }

      if (attempt < maxAttempts) {
        log(`waiting ${intervalMs}ms before retry`);
        await new Promise((r) => setTimeout(r, intervalMs));
      }
    }

    return {
      ok: false,
      attempts: attempt,
      reason: lastStale ? 'no-fresh-match' : 'no-match',
      staleMatch: lastStale,
    };
  } finally {
    await ctx.close().catch(() => null);
  }
}

// ── CLI entry-point ─────────────────────────────────────────────────────
function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

if (process.argv[1] && /verify-x-post\.ts$/.test(process.argv[1])) {
  const text = arg('text');
  if (!text) {
    console.error('Usage: --text "<substring>" [--within <sec>] [--attempts <n>] [--verbose]');
    process.exit(1);
  }
  const opts: VerifyXPostOpts = {
    textSubstring: text,
    withinSeconds: arg('within') ? parseInt(arg('within')!, 10) : undefined,
    maxAttempts: arg('attempts') ? parseInt(arg('attempts')!, 10) : undefined,
    verbose: process.argv.includes('--verbose'),
    headless: !process.argv.includes('--show'),
  };
  verifyXPost(opts).then(
    (r) => {
      if (r.ok) {
        console.log(`[verify-x-post] ✓ verified after ${r.attempts} attempt(s).`);
        console.log(`  posted: ${r.found?.postedAt}`);
        console.log(`  url:    ${r.found?.url ?? '(not extracted)'}`);
        console.log(`  text:   ${r.found?.text?.slice(0, 200) ?? ''}`);
        process.exit(0);
      } else {
        console.error(`[verify-x-post] ✗ not verified after ${r.attempts} attempt(s).`);
        console.error(`  reason: ${r.reason}`);
        if (r.staleMatch) {
          console.error(
            `  stale match: ${r.staleMatch.postedAt} — ${r.staleMatch.text.slice(0, 140)}`,
          );
        }
        process.exit(2);
      }
    },
    (e) => {
      console.error('Fatal:', e?.message || e);
      process.exit(1);
    },
  );
}
