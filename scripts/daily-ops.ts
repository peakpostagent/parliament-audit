/**
 * Parliament Audit — Daily Operations Audit
 *
 * Single-entry "is everything working" check, intended to run once
 * a day from a Claude Code scheduled task. Output:
 *   - Markdown report → content/daily-ops/<YYYY-MM-DD>.md
 *   - ntfy summary → topic parliamentaudit-posts
 *
 * Sections:
 *   1. Site health  (routes, OG images, RSS, sitemap, redirect)
 *   2. Social state (X + Bluesky last-post age, post count, engagement)
 *   3. Cadence      (today's post count vs target; mirror queue depth)
 *   4. Umami        (24h pageviews, top URLs, top referrers)
 *   5. Action items (what needs attention)
 *
 * Usage:
 *   npx tsx scripts/daily-ops.ts
 *   npx tsx scripts/daily-ops.ts --no-ntfy   # skip ntfy summary
 *   npx tsx scripts/daily-ops.ts --quiet     # minimal stdout (good for cron)
 */

import 'dotenv/config';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { AtpAgent } from '@atproto/api';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORTS_DIR = resolve(ROOT, 'content/daily-ops');
mkdirSync(REPORTS_DIR, { recursive: true });

const SKIP_NTFY = process.argv.includes('--no-ntfy');
const QUIET = process.argv.includes('--quiet');
// --no-auto-publish disables the auto-publish gate even when conditions
// would otherwise fire mirror-queue-apply. Useful for read-only cron testing.
const SKIP_AUTO_PUBLISH = process.argv.includes('--no-auto-publish');
const NTFY_TOPIC = process.env.NTFY_TOPIC || 'parliamentaudit-posts';

const log = (...args: any[]) => {
  if (!QUIET) console.log(...args);
};

interface CheckResult {
  ok: boolean;
  label: string;
  detail: string;
  /**
   * Critical routes block auto-publishing when they fail (the reader-
   * facing article path is actually broken). Non-critical routes —
   * OG-image endpoints, sitemap, secondary pages — only warn.
   *
   * Added 2026-06-10 after a single 404 on /api/og/news/<new-slug>
   * (a deploy-lag artifact on a social-card image) blocked the entire
   * June 9 publishing day via paused-site-issue. A missing decoration
   * must never silence the newsroom.
   */
  critical: boolean;
}

// ── 1. Site health ───────────────────────────────────────────────────────

async function checkRoute(
  path: string,
  expected: { status?: number; contentType?: string; critical?: boolean } = { status: 200 },
): Promise<CheckResult> {
  const url = `https://parliamentaudit.ca${path}`;
  const critical = expected.critical ?? true;
  try {
    const res = await fetch(url, {
      method: path.includes('/api/og/') ? 'GET' : 'HEAD',
      headers: { 'user-agent': 'ParliamentAuditDailyOps/1.0' },
      signal: AbortSignal.timeout(20000),
      redirect: 'manual',
    });
    const expectedStatus = expected.status ?? 200;
    const ct = res.headers.get('content-type') || '';
    const statusOk =
      expectedStatus === 302
        ? res.status === 302 || res.status === 307
        : res.status === expectedStatus;
    const ctOk = expected.contentType ? ct.includes(expected.contentType) : true;
    const ok = statusOk && ctOk;
    return {
      ok,
      label: path,
      detail: `HTTP ${res.status}${expected.contentType ? ` · ${ct}` : ''}`,
      critical,
    };
  } catch (e: any) {
    return {
      ok: false,
      label: path,
      detail: `error: ${(e?.message || String(e)).slice(0, 100)}`,
      critical,
    };
  }
}

async function siteHealth(): Promise<CheckResult[]> {
  log('\n[site-health]');
  // Pull a couple of recent slugs to test news + OG paths
  const newsArticlesPath = resolve(ROOT, 'apps/web/src/content/news-articles.ts');
  const articlesSrc = readFileSync(newsArticlesPath, 'utf8');
  const slugs = Array.from(articlesSrc.matchAll(/slug:\s*'([^']+)'/g))
    .map((m) => m[1])
    .slice(0, 3);
  const latestSlug = slugs[0] || 'news';

  // critical: reader-facing article path + the redirect social posts
  // depend on + the RSS feed the Mastodon mirror reads. Everything
  // else (OG images, sitemap, secondary pages) warns but does not
  // block publishing — OG endpoints in particular 404 transiently
  // for a freshly-deployed slug and self-heal on the next deploy.
  const checks = await Promise.all([
    checkRoute('/'),
    checkRoute('/news'),
    checkRoute(`/news/${latestSlug}`),
    checkRoute(`/api/og/news/${latestSlug}`, { status: 200, contentType: 'image/png', critical: false }),
    checkRoute(`/api/og/feed-card?slug=${latestSlug}`, { status: 200, contentType: 'image/png', critical: false }),
    checkRoute('/rss.xml', { status: 200, contentType: 'xml' }),
    checkRoute('/sitemap.xml', { status: 200, contentType: 'xml', critical: false }),
    checkRoute(`/n/${latestSlug}?s=bsky`, { status: 302 }),
    checkRoute('/support', { status: 200, critical: false }),
    checkRoute('/builders', { status: 200, critical: false }),
    checkRoute('/find-your-mp', { status: 200, critical: false }),
  ]);
  for (const c of checks) {
    log(`  ${c.ok ? '✓' : '✗'} ${c.label}  ${c.detail}`);
  }
  return checks;
}

// ── 2. Social state ──────────────────────────────────────────────────────

interface SocialSummary {
  bluesky: {
    followers: number;
    following: number;
    posts: number;
    lastPostAt: string | null;
    hoursSinceLastPost: number | null;
    last5: Array<{ at: string; text: string; likes: number; reposts: number }>;
  } | null;
  x: {
    posts: Array<{ at: string; text: string; views: number; likes: number }>;
    hoursSinceLastPost: number | null;
  } | null;
}

async function blueskyStats(): Promise<SocialSummary['bluesky']> {
  try {
    const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
    if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) return null;
    const agent = new AtpAgent({ service: 'https://bsky.social' });
    await agent.login({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD });
    const profile = await agent.getProfile({ actor: BLUESKY_HANDLE });
    const feed = await agent.getAuthorFeed({
      actor: agent.session!.did,
      limit: 5,
      filter: 'posts_no_replies',
    });
    const last5: SocialSummary['bluesky']['last5'] = [];
    let lastPostAt: string | null = null;
    for (const item of feed.data.feed || []) {
      if ((item.reason as any)?.$type === 'app.bsky.feed.defs#reasonRepost') continue;
      const r = item.post.record as any;
      if ((r as any).reply) continue;
      if (!lastPostAt) lastPostAt = r.createdAt;
      last5.push({
        at: r.createdAt,
        text: (r.text || '').slice(0, 100),
        likes: item.post.likeCount ?? 0,
        reposts: item.post.repostCount ?? 0,
      });
    }
    const hoursSince = lastPostAt
      ? (Date.now() - new Date(lastPostAt).getTime()) / 3600_000
      : null;
    return {
      followers: profile.data.followersCount ?? 0,
      following: profile.data.followsCount ?? 0,
      posts: profile.data.postsCount ?? 0,
      lastPostAt,
      hoursSinceLastPost: hoursSince,
      last5,
    };
  } catch (e: any) {
    log(`  [bsky] error: ${(e?.message || String(e)).slice(0, 100)}`);
    return null;
  }
}

async function xStats(): Promise<SocialSummary['x']> {
  // Reads from the .browser-profile/ via Playwright. This is the same
  // approach as scripts/browser/x-stats.ts. Inlined here to keep
  // daily-ops a single file.
  try {
    const { chromium } = await import('playwright');
    const PROFILE_DIR = resolve(ROOT, '.browser-profile');
    const ctx = await chromium.launchPersistentContext(PROFILE_DIR, {
      headless: true,
      channel: 'chrome',
      viewport: { width: 1280, height: 800 },
    });
    const page = ctx.pages()[0] ?? (await ctx.newPage());
    try {
      await page.goto('https://x.com/ParliamentAudit', {
        waitUntil: 'domcontentloaded',
        timeout: 25000,
      });
      await page.waitForTimeout(4000);
      const data = (await page.evaluate(`(() => {
        const articles = Array.from(document.querySelectorAll('article')).slice(0, 6);
        return articles.map((a) => {
          const time = a.querySelector('time') ? a.querySelector('time').getAttribute('datetime') : null;
          const text = (a.querySelector('[data-testid="tweetText"]') ? a.querySelector('[data-testid="tweetText"]').textContent : '').slice(0, 100);
          const buttons = Array.from(a.querySelectorAll('[role="button"], a[role="link"]'));
          const out = {};
          for (const b of buttons) {
            const label = b.getAttribute('aria-label') || '';
            let m;
            if ((m = label.match(/(\\d[\\d,]*)\\s+like/i))) out.likes = m[1];
            else if ((m = label.match(/(\\d[\\d,]*)\\s+view/i))) out.views = m[1];
          }
          return { at: time, text, likes: parseInt((out.likes || '0').replace(/,/g, ''), 10), views: parseInt((out.views || '0').replace(/,/g, ''), 10) };
        });
      })()`)) as any[];
      const lastPostAt = data[0]?.at || null;
      const hoursSince = lastPostAt
        ? (Date.now() - new Date(lastPostAt).getTime()) / 3600_000
        : null;
      return { posts: data, hoursSinceLastPost: hoursSince };
    } finally {
      await ctx.close();
    }
  } catch (e: any) {
    log(`  [x] error: ${(e?.message || String(e)).slice(0, 100)}`);
    return null;
  }
}

// ── 3. Mirror queue depth ────────────────────────────────────────────────

function mirrorQueueDepth(): number | null {
  try {
    const queuePath = resolve(ROOT, 'scripts/social-brief/x-mirror-queue.json');
    if (!existsSync(queuePath)) return null;
    const queue = JSON.parse(readFileSync(queuePath, 'utf8'));
    const statePath = resolve(ROOT, 'content/social-briefs/.x-mirror-state.json');
    const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : { mirrored: {} };
    const queueEntries: any[] = queue.queue || [];
    // Fixed 2026-05-12: previously returned the gross queue length, but
    // mirror-queue-apply dedupes via state.mirrored before posting. The
    // gate would fire mirror-queue-apply on an already-fully-mirrored
    // queue, "succeed" without posting anything, then mark itself fired
    // — and never fall through to auto-amplify. We now estimate
    // unmirrored depth using a slug / matchSubstring heuristic against
    // mirrored finalTexts (offline, cheap).
    const mirroredTexts: string[] = Object.values(state.mirrored || {}).map(
      (m: any) => (m && typeof m.finalText === 'string' ? m.finalText : ''),
    );
    const unmirrored = queueEntries.filter((e: any) => {
      const slugHit = e?.slug && mirroredTexts.some((t) => t.includes(e.slug));
      const subHit = e?.matchSubstring && mirroredTexts.some((t) => t.includes(e.matchSubstring));
      return !(slugHit || subHit);
    });
    return unmirrored.length;
  } catch {
    return null;
  }
}

// ── 4. Umami stats (last 24h) ────────────────────────────────────────────

interface UmamiStats {
  pageviews: number;
  visitors: number;
  bounces: number;
  topReferrers: Array<{ source: string; count: number }>;
}

async function umamiStats(): Promise<UmamiStats | null> {
  try {
    const credsPath = resolve(ROOT, '.umami-creds.json');
    if (!existsSync(credsPath)) return null;
    const creds = JSON.parse(readFileSync(credsPath, 'utf8'));
    const UMAMI_URL = 'https://umami-production-d170.up.railway.app';
    const login = await fetch(`${UMAMI_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        username: creds.adminUsername || 'admin',
        password: creds.adminPassword,
      }),
    });
    if (!login.ok) return null;
    const { token } = await login.json();
    const auth = { authorization: `Bearer ${token}` };
    const websiteId = creds.websiteId;
    const endAt = Date.now();
    const startAt = endAt - 24 * 3600 * 1000;
    const statsRes = await fetch(
      `${UMAMI_URL}/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
      { headers: auth },
    );
    const s = (await statsRes.json()) as any;
    const refRes = await fetch(
      `${UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=America%2FEdmonton&type=referrer&limit=5`,
      { headers: auth },
    );
    const refs = (await refRes.json()) as any[];
    return {
      pageviews: s.pageviews || 0,
      visitors: s.visitors || 0,
      bounces: s.bounces || 0,
      topReferrers: (Array.isArray(refs) ? refs : []).map((r: any) => ({
        source: r.x || '(direct)',
        count: r.y,
      })),
    };
  } catch {
    return null;
  }
}

// ── 5. Cadence audit ─────────────────────────────────────────────────────

interface CadenceAudit {
  blueskyToday: number;
  xToday: number;
  target: number;
  underTarget: boolean;
  notes: string[];
}

function cadenceAudit(social: SocialSummary): CadenceAudit {
  const now = new Date();
  const startOfTodayUtc = new Date(now);
  startOfTodayUtc.setUTCHours(0, 0, 0, 0);
  // Soft target: 1 original per platform per day. Lowered from 2 on
  // 2026-06-10 after the analytics review: our highest-volume week
  // (5+ posts/day) coincided with a net follower LOSS on Bluesky, and
  // engagement concentrates in 1-2 strong Accountability posts, not
  // volume. Peer accounts that grow (Geist, Polling Canada) cap at
  // 2-3/day with heavy reply/quote activity — quality over cadence.
  const target = 1;

  const bskyToday =
    social.bluesky?.last5.filter((p) => new Date(p.at) >= startOfTodayUtc).length ?? 0;
  const xToday =
    social.x?.posts.filter((p) => p.at && new Date(p.at) >= startOfTodayUtc).length ?? 0;
  const notes: string[] = [];
  if (bskyToday === 0) notes.push('No Bluesky post today.');
  if (xToday === 0) notes.push('No X post today.');
  if (
    social.bluesky?.hoursSinceLastPost &&
    social.bluesky.hoursSinceLastPost > 30
  ) {
    notes.push(
      `Bluesky last post: ${social.bluesky.hoursSinceLastPost.toFixed(1)}h ago.`,
    );
  }
  if (social.x?.hoursSinceLastPost && social.x.hoursSinceLastPost > 30) {
    notes.push(`X last post: ${social.x.hoursSinceLastPost.toFixed(1)}h ago.`);
  }
  return {
    blueskyToday: bskyToday,
    xToday: xToday,
    target,
    underTarget: bskyToday < target || xToday < target,
    notes,
  };
}

// ── 6. ntfy + report writer ──────────────────────────────────────────────

async function notify(title: string, body: string, click?: string) {
  if (SKIP_NTFY) return;
  try {
    const headers: Record<string, string> = {
      Title: title,
      Tags: 'parliament_audit,daily_ops',
      Priority: '3',
    };
    if (click) headers.Click = click;
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, { method: 'POST', headers, body });
  } catch {}
}

async function main() {
  const startedAt = new Date();
  log(`Parliament Audit — Daily Ops · ${startedAt.toISOString()}`);

  const site = await siteHealth();
  log('\n[social-state]');
  const bsky = await blueskyStats();
  log(
    `  Bluesky: ${bsky ? `${bsky.posts} posts · ${bsky.followers} followers · last post ${bsky.hoursSinceLastPost?.toFixed(1) ?? '?'}h ago` : '<error>'}`,
  );
  const x = await xStats();
  log(
    `  X:       ${x ? `${x.posts.length} recent posts · last post ${x.hoursSinceLastPost?.toFixed(1) ?? '?'}h ago` : '<error>'}`,
  );

  log('\n[mirror-queue]');
  const queueDepth = mirrorQueueDepth();
  log(`  ${queueDepth ?? '?'} entries remaining in x-mirror-queue.json`);

  log('\n[umami 24h]');
  const u = await umamiStats();
  log(
    `  ${u ? `pageviews=${u.pageviews} · visitors=${u.visitors} · bounces=${u.bounces}` : '<error>'}`,
  );
  if (u && u.topReferrers.length) {
    for (const r of u.topReferrers.slice(0, 3))
      log(`    ${r.count}× ${r.source}`);
  }

  const cadence = cadenceAudit({ bluesky: bsky, x });
  log('\n[cadence]');
  log(`  X today: ${cadence.xToday} · Bluesky today: ${cadence.blueskyToday}`);
  for (const n of cadence.notes) log(`  ⚠ ${n}`);

  // Computed early so the auto-publish gate can use it before report write.
  const failedRoutes = site.filter((c) => !c.ok);
  // Only CRITICAL failures block publishing. A 404 on an OG image or a
  // secondary page is a warning, not a newsroom outage — on June 9 a
  // transient OG-route 404 for the newest slug silenced a full
  // publishing day. Non-critical failures still land in the report's
  // action items.
  const failedCritical = failedRoutes.filter((c) => c.critical);

  // ── Auto-publish gate (per content/editorial-autonomy.md) ──────────
  const autoActions: string[] = [];
  const autoPauseGlobal = existsSync(resolve(ROOT, 'content/AUTO_PAUSE'));
  const autoPauseBsky = existsSync(resolve(ROOT, 'content/AUTO_PAUSE_BLUESKY'));
  const autoPauseX = existsSync(resolve(ROOT, 'content/AUTO_PAUSE_X'));
  const sitePassing = failedCritical.length === 0;

  // Run the tragedy-halt poll BEFORE we look at the autopublish gate.
  // This both (a) refreshes the AUTO_PAUSE_TRAGEDY flag based on current
  // newswire state, and (b) gives daily-ops a single composable entry
  // point so the cron only schedules one task. Failure here is non-fatal
  // — if the poll throws we don't auto-publish, but we don't crash the
  // ops audit either.
  log('\n[tragedy-halt poll]');
  try {
    const out = execSync('npx tsx scripts/social-brief/halt-on-tragedy.ts --quiet', {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 60_000,
    });
    if (out.trim()) {
      log(out.split('\n').map((l) => `  ${l}`).join('\n'));
    } else {
      log('  ✓ clean poll, no tragedy flag');
    }
  } catch (e: any) {
    log(`  ⚠ halt-on-tragedy error: ${(e?.message || String(e)).slice(0, 120)}`);
    // Fall through — we still respect AUTO_PAUSE_TRAGEDY's file-presence
    // even if the poll itself errored, so we never blast through it on
    // a stale flag.
  }
  const autoPauseTragedy = existsSync(resolve(ROOT, 'content/AUTO_PAUSE_TRAGEDY'));

  log('\n[auto-publish gate]');
  let didFire = false;
  if (SKIP_AUTO_PUBLISH) {
    log('  ⏸ --no-auto-publish flag set — gate skipped');
  } else if (autoPauseGlobal) {
    log('  ⏸ content/AUTO_PAUSE present — no auto-posting this run');
    autoActions.push('paused-globally');
  } else if (autoPauseTragedy) {
    log('  ⏸ content/AUTO_PAUSE_TRAGEDY present — no auto-posting until news cycle clears');
    autoActions.push('paused-tragedy-halt');
  } else if (!sitePassing) {
    log(`  ⏸ Site has ${failedCritical.length} CRITICAL failed route(s) — no auto-posting until green`);
    autoActions.push(`paused-site-issue:${failedCritical.length}`);
  } else if (cadence.xToday >= cadence.target && cadence.blueskyToday >= cadence.target) {
    log(`  ✓ Cadence target (${cadence.target}/platform) already met for today — no SOCIAL auto-posting needed`);
    autoActions.push('cadence-met');
    // Site-only series are NOT social posts — the cadence gate must not
    // starve them. (June 10 post-mortem: evergreen day-03 sat staged
    // while cadence-met skipped the whole chain.) Fire at most one
    // site-only series day per tick, with --skip-bsky --skip-x.
    const seriesRoot = resolve(ROOT, 'content/series');
    if (existsSync(seriesRoot)) {
      const fsx = require('node:fs');
      const siteOnlyDirs: string[] = fsx.readdirSync(seriesRoot)
        .filter((d: string) => {
          const full = resolve(seriesRoot, d);
          return fsx.statSync(full).isDirectory() && existsSync(resolve(full, '.site-only'));
        })
        .sort();
      for (const seriesName of siteOnlyDirs) {
        const seriesDir = resolve(seriesRoot, seriesName);
        const dayFiles: string[] = fsx.readdirSync(seriesDir)
          .filter((f: string) => /^day-\d+\.article\.ts$/.test(f))
          .sort();
        const articlesContent = fsx.readFileSync(
          resolve(ROOT, 'apps/web/src/content/news-articles.ts'), 'utf8');
        const hasUnpublished = dayFiles.some((f: string) => {
          try {
            const m = fsx.readFileSync(resolve(seriesDir, f), 'utf8').match(/slug:\s*['\"]([^'\"]+)['\"]/);
            return m && !articlesContent.includes(`slug: '${m[1]}'`) && !articlesContent.includes(`slug: \"${m[1]}\"`);
          } catch { return false; }
        });
        if (!hasUnpublished) continue;
        log(`  → site-only series "${seriesName}" has an unpublished day; firing publish-next-day (site-only, cadence-exempt)`);
        try {
          const out = execSync(
            `npx tsx scripts/series/publish-next-day.ts --apply --series ${seriesName} --skip-bsky --skip-x`,
            { cwd: ROOT, encoding: 'utf8', timeout: 12 * 60 * 1000 },
          );
          log(out.split('\n').slice(-8).map((l) => `    ${l}`).join('\n'));
          autoActions.push(`series-publish:${seriesName}:fired-site-only`);
        } catch (e: any) {
          const msg = (e?.stderr?.toString() || e?.message || String(e)).slice(0, 240);
          log(`  ✗ site-only series-publish failed: ${msg}`);
          autoActions.push(`series-publish:${seriesName}:failed:${msg.slice(0, 80)}`);
        }
        break; // one per tick
      }
    }
  } else {
    // ── Priority 0: Vote watcher (live divisions) ──────────────────
    // Time-sensitive: the GovTrack pattern only compounds when the
    // post lands within hours of the division. Runs before the series
    // chain; if it posts, that's the tick's social activity. Bluesky-
    // only, capped at 2 posts/run inside the watcher, deterministic
    // template drafts from official XML (no LLM prose). State was
    // bootstrapped 2026-06-10 at division 144 — only NEW divisions post.
    try {
      const out = execSync('npx tsx scripts/watcher/vote-watcher.ts --apply', {
        cwd: ROOT,
        encoding: 'utf8',
        timeout: 5 * 60 * 1000,
      });
      const tail = out.split('\n').slice(-6).join('\n');
      log(tail.split('\n').map((l) => `    ${l}`).join('\n'));
      const postedMatch = out.match(/done\. posted=(\d+)/);
      const votesPosted = postedMatch ? parseInt(postedMatch[1], 10) : 0;
      if (votesPosted > 0) {
        didFire = true;
        autoActions.push(`vote-watcher:posted:${votesPosted}`);
      } else {
        autoActions.push('vote-watcher:no-new-votes');
      }
    } catch (e: any) {
      const msg = (e?.stderr?.toString() || e?.message || String(e)).slice(0, 240);
      log(`  ✗ vote-watcher failed: ${msg}`);
      autoActions.push(`vote-watcher:failed:${msg.slice(0, 80)}`);
    }
    if (didFire) {
      // Vote post(s) shipped — that's this tick's activity.
    } else {
    // ── Priority 1: Series publisher ───────────────────────────────
    // If there's an active multi-day series with an unpublished day
    // staged in content/series/<series>/day-NN.article.ts, fire that
    // first. The script handles the full chain: prepend to
    // news-articles.ts, commit/push, wait for deploy, post Bluesky,
    // queue + fire X mirror, ntfy. Idempotent: exits clean when the
    // series is caught up. Safe to call every cron tick.
    //
    // Discovery: scan content/series/*/day-*.article.ts. We default to
    // the first series alphabetically (currently bill-c-22). When new
    // series are added, this list extends; we ship one series-day per
    // cron tick to spread cadence across the day.
    const seriesDirs: string[] = (() => {
      const seriesRoot = resolve(ROOT, 'content/series');
      if (!existsSync(seriesRoot)) return [];
      try {
        return require('node:fs').readdirSync(seriesRoot)
          .filter((d: string) => {
            const full = resolve(seriesRoot, d);
            return require('node:fs').statSync(full).isDirectory();
          })
          .sort();
      } catch {
        return [];
      }
    })();
    let seriesFired = false;
    for (const seriesName of seriesDirs) {
      // Cheap pre-check: are there ANY day-NN.article.ts files whose
      // slug isn't already in news-articles.ts? If yes, run the
      // publisher. If not, skip to the next series. We do this with a
      // grep-style scan rather than evaluating to keep daily-ops fast.
      const seriesDir = resolve(ROOT, 'content/series', seriesName);
      const dayFiles: string[] = require('node:fs')
        .readdirSync(seriesDir)
        .filter((f: string) => /^day-\d+\.article\.ts$/.test(f))
        .sort();
      let hasUnpublished = false;
      for (const f of dayFiles) {
        try {
          const content = require('node:fs').readFileSync(resolve(seriesDir, f), 'utf8');
          const m = content.match(/slug:\s*['\"]([^'\"]+)['\"]/);
          if (!m) continue;
          const slug = m[1];
          const articlesContent = require('node:fs').readFileSync(
            resolve(ROOT, 'apps/web/src/content/news-articles.ts'),
            'utf8',
          );
          if (!articlesContent.includes(`slug: '${slug}'`) && !articlesContent.includes(`slug: \"${slug}\"`)) {
            hasUnpublished = true;
            break;
          }
        } catch {
          /* ignore individual file errors */
        }
      }
      if (!hasUnpublished) {
        log(`  ✓ series "${seriesName}" caught up — no unpublished day`);
        continue;
      }
      log(`  → series "${seriesName}" has an unpublished day; firing publish-next-day`);
      // Social-split (2026-06-10, analytics-driven): series marked with a
      // .site-only file publish to the website only (Mastodon still picks
      // them up via the RSS mirror). Bluesky/X are reserved for
      // Accountability-category pieces — our own engagement data shows
      // 7.0 engagements/post for Accountability vs 2.3 for Legislation
      // explainers, and follower count DROPPED during the highest-volume
      // mirror-everything week. Evergreen explainers are SEO inventory,
      // not social inventory.
      const siteOnly = existsSync(resolve(seriesDir, '.site-only'));
      if (siteOnly) log(`    (.site-only marker — skipping Bluesky + X for this series)`);
      try {
        const out = execSync(
          `npx tsx scripts/series/publish-next-day.ts --apply --series ${seriesName}${siteOnly ? ' --skip-bsky --skip-x' : ''}`,
          { cwd: ROOT, encoding: 'utf8', timeout: 12 * 60 * 1000 },
        );
        const tail = out.split('\n').slice(-12).join('\n');
        log(tail.split('\n').map((l) => `    ${l}`).join('\n'));
        didFire = true;
        seriesFired = true;
        autoActions.push(`series-publish:${seriesName}:fired`);
        break; // one series-day per cron tick
      } catch (e: any) {
        const msg = (e?.stderr?.toString() || e?.message || String(e)).slice(0, 240);
        log(`  ✗ series-publish failed: ${msg}`);
        autoActions.push(`series-publish:${seriesName}:failed:${msg.slice(0, 80)}`);
        // Continue to fallback chain on failure rather than blocking
        // the whole gate. The series day stays staged for the next
        // tick.
      }
    }
    if (seriesFired) {
      // We shipped a series-day; skip the rest of the auto-publish
      // chain for this tick to avoid double-posting.
    } else {
    const queueDepthForGate = mirrorQueueDepth();
    if (queueDepthForGate && queueDepthForGate > 0) {
      // Mirror queue has items; fire one. mirror-queue-apply has its own
      // safety rails (daily cap, spacing, dedupe, draft validation).
      const platformsToFire: string[] = [];
      if (cadence.blueskyToday < cadence.target && !autoPauseBsky) platformsToFire.push('bluesky');
      if (cadence.xToday < cadence.target && !autoPauseX) platformsToFire.push('x');
      // mirror-queue-apply ships to BOTH platforms by default (the queue
      // is platform-agnostic; each entry has both an X draft + a Bluesky
      // draft path internally). One --batch=1 ships one queue item across.
      if (platformsToFire.length > 0) {
        log(`  → firing mirror-queue-apply --apply --batch 1 (gap on: ${platformsToFire.join(', ')})`);
        try {
          const out = execSync(
            'npx tsx scripts/social-brief/mirror-queue-apply.ts --apply --batch 1',
            { cwd: ROOT, encoding: 'utf8', timeout: 5 * 60 * 1000 },
          );
          // Show the last ~12 lines of the apply output so it lands in our
          // markdown report and is grep-able by the cron orchestrator.
          const tail = out.split('\n').slice(-15).join('\n');
          log(tail.split('\n').map((l) => `    ${l}`).join('\n'));
          didFire = true;
          autoActions.push('mirror-queue-apply:fired');
        } catch (e: any) {
          const msg = (e?.stderr?.toString() || e?.message || String(e)).slice(0, 240);
          log(`  ✗ mirror-queue-apply failed: ${msg}`);
          autoActions.push(`mirror-queue-apply:failed:${msg.slice(0, 80)}`);
        }
      } else {
        log('  ⏸ Both platforms paused via per-platform AUTO_PAUSE files');
        autoActions.push('paused-per-platform');
      }
    } else {
      // Mirror queue empty — emergency-recycle first (re-promote one of
      // our own back-catalogue Accountability pieces with a Sonnet-fresh
      // body; drives traffic to OUR site), then auto-amplify (reposts of
      // trusted handles) as the true last resort.
      let recycled = false;
      if (cadence.blueskyToday < cadence.target && !autoPauseBsky) {
        log('  → mirror queue empty; trying emergency-recycle (re-promote back-catalogue)');
        try {
          const out = execSync('npx tsx scripts/social-brief/emergency-recycle.ts --apply', {
            cwd: ROOT,
            encoding: 'utf8',
            timeout: 5 * 60 * 1000,
          });
          const tail = out.split('\n').slice(-8).join('\n');
          log(tail.split('\n').map((l) => `    ${l}`).join('\n'));
          if (out.includes('✓ posted')) {
            didFire = true;
            recycled = true;
            autoActions.push('emergency-recycle:fired');
          } else {
            autoActions.push('emergency-recycle:no-candidates');
          }
        } catch (e: any) {
          const msg = (e?.stderr?.toString() || e?.message || String(e)).slice(0, 240);
          log(`  ✗ emergency-recycle failed: ${msg}`);
          autoActions.push(`emergency-recycle:failed:${msg.slice(0, 80)}`);
        }
      }
      if (!recycled) {
        log('  → trying auto-amplify (Bluesky reposts of trusted handles)');
        try {
          const out = execSync('npx tsx scripts/social-brief/auto-amplify.ts --apply --max 1', {
            cwd: ROOT,
            encoding: 'utf8',
            timeout: 5 * 60 * 1000,
          });
          const tail = out.split('\n').slice(-12).join('\n');
          log(tail.split('\n').map((l) => `    ${l}`).join('\n'));
          if (out.includes('Reposted') && !out.includes('Reposted 0')) {
            didFire = true;
            autoActions.push('auto-amplify:fired');
          } else {
            autoActions.push('auto-amplify:no-candidates');
          }
        } catch (e: any) {
          const msg = (e?.stderr?.toString() || e?.message || String(e)).slice(0, 240);
          log(`  ✗ auto-amplify failed: ${msg}`);
          autoActions.push(`auto-amplify:failed:${msg.slice(0, 80)}`);
        }
      }
    }
    } // end of "else (series didn't fire)" — fall through to mirror-queue / auto-amplify chain
    } // end of "else (vote-watcher didn't post)" — fall through to series chain
  }

  // ── Quality-content cadence (independent of the vote-watcher gate) ─
  // The vote-watcher posts ≤2 notable divisions/day, but those draw
  // little engagement. To keep the Bluesky feed anchored by the
  // accountability content that actually grows followers, re-promote a
  // back-catalogue Accountability article ~2x/week (every ≥3 days),
  // regardless of what the gate above did. emergency-recycle has its
  // own 60-day per-article cooldown + 14-day min-age, so it never
  // repeats and never promotes something still fresh.
  if (!SKIP_AUTO_PUBLISH && !autoPauseGlobal && !autoPauseTragedy && !autoPauseBsky && sitePassing) {
    try {
      const recycleStatePath = resolve(ROOT, 'content/social-briefs/.recycle-state.json');
      let daysSinceRecycle = Infinity;
      if (existsSync(recycleStatePath)) {
        const rs = JSON.parse(readFileSync(recycleStatePath, 'utf8'));
        const dates = Object.values(rs.recycled || {}).map((d) => new Date(d as string).getTime());
        if (dates.length) daysSinceRecycle = (Date.now() - Math.max(...dates)) / 86400000;
      }
      if (daysSinceRecycle >= 3) {
        log(`\n[quality-cadence] ${Math.round(daysSinceRecycle)}d since last recycle ≥ 3 — promoting a back-catalogue Accountability piece`);
        const out = execSync('npx tsx scripts/social-brief/emergency-recycle.ts --apply', {
          cwd: ROOT, encoding: 'utf8', timeout: 5 * 60 * 1000,
        });
        log(out.split('\n').slice(-4).map((l) => `    ${l}`).join('\n'));
        autoActions.push(out.includes('✓ posted') ? 'quality-recycle:fired' : 'quality-recycle:no-op');
      }
    } catch (e: any) {
      log(`  ⚠ quality-cadence recycle error: ${(e?.message || String(e)).slice(0, 120)}`);
    }
  }

  // ── Analytics snapshot (read-only, every cron tick, fast) ─────────
  // Appends today's entry to content/analytics/.followers-ledger.json
  // so we have a real growth time-series. Writes a daily JSON snapshot.
  // Idempotent: re-running on the same UTC date overwrites today's
  // entry rather than duplicating.
  log('\n[analytics-snapshot]');
  try {
    const out = execSync('npx tsx scripts/analytics/snapshot.ts', {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 90_000,
    });
    // Only log the high-signal summary lines, not the full report.
    const summaryLines = out
      .split('\n')
      .filter(
        (l) =>
          l.includes('Followers:') ||
          l.includes('Last 24h:') ||
          l.includes('wrote ') ||
          l.includes('⚠'),
      )
      .slice(0, 12);
    for (const l of summaryLines) log(`  ${l.trim()}`);
    autoActions.push('analytics-snapshot:done');
  } catch (e: any) {
    const msg = (e?.stderr?.toString() || e?.message || String(e)).slice(0, 240);
    log(`  ✗ analytics-snapshot failed: ${msg}`);
    autoActions.push(`analytics-snapshot:failed:${msg.slice(0, 80)}`);
  }

  // ── Mastodon mirror (RSS-driven, runs independently of the auto-publish
  //    gate above) ──────────────────────────────────────────────────────
  // Posts any newly-published articles to our Mastodon account. Hooks the
  // existing RSS feed; tracks state in content/social-briefs/.mastodon-state.json
  // (gitignored). Tragedy-halt-aware inside the script itself, so it skips
  // automatically during breaking-news halts. Silent no-op if the
  // MASTODON_* env vars aren't configured yet (so this loop is safe to
  // ship before the operator finishes the one-time Mastodon signup).
  if (!SKIP_AUTO_PUBLISH) {
    log('\n[mastodon-mirror]');
    try {
      const out = execSync('npx tsx scripts/social-brief/mastodon-rss-mirror.ts --apply --limit 3', {
        cwd: ROOT,
        encoding: 'utf8',
        timeout: 2 * 60 * 1000,
      });
      const tail = out.split('\n').slice(-8).join('\n');
      log(tail.split('\n').map((l) => `  ${l}`).join('\n'));
      if (out.includes('posted ') && !out.includes('posted 0')) {
        autoActions.push('mastodon-mirror:posted');
      } else {
        autoActions.push('mastodon-mirror:nothing-new');
      }
    } catch (e: any) {
      const msg = (e?.stderr?.toString() || e?.message || String(e)).slice(0, 240);
      log(`  ✗ mastodon-mirror failed: ${msg}`);
      autoActions.push(`mastodon-mirror:failed:${msg.slice(0, 80)}`);
    }
  }

  // ── Write report ────────────────────────────────────────────────────
  const today = startedAt.toISOString().slice(0, 10);
  const reportPath = join(REPORTS_DIR, `${today}.md`);
  const lines: string[] = [];
  lines.push(`# Daily Ops — ${today}`);
  lines.push('');
  lines.push(`Generated ${startedAt.toISOString()}`);
  lines.push('');
  lines.push('## Site health');
  for (const c of site) {
    lines.push(`- ${c.ok ? '✅' : '❌'} \`${c.label}\` — ${c.detail}`);
  }
  lines.push('');
  lines.push('## Social state');
  lines.push('### Bluesky');
  if (bsky) {
    lines.push(`- Followers: **${bsky.followers}**, following ${bsky.following}, ${bsky.posts} posts`);
    lines.push(
      `- Last post: ${bsky.lastPostAt ?? '?'} (${bsky.hoursSinceLastPost?.toFixed(1) ?? '?'}h ago)`,
    );
    lines.push('');
    lines.push('Last 5 originals:');
    for (const p of bsky.last5) {
      lines.push(`  - ${p.at} · ♥${p.likes} ↻${p.reposts} · "${p.text}"`);
    }
  } else {
    lines.push('- _(could not pull Bluesky stats — see stderr)_');
  }
  lines.push('### X');
  if (x) {
    lines.push(`- Last post: ${x.posts[0]?.at ?? '?'} (${x.hoursSinceLastPost?.toFixed(1) ?? '?'}h ago)`);
    lines.push('');
    lines.push('Last 6 posts:');
    for (const p of x.posts.slice(0, 6)) {
      lines.push(`  - ${p.at ?? '?'} · views=${p.views} ♥${p.likes} · "${p.text}"`);
    }
  } else {
    lines.push('- _(could not pull X stats — browser-profile session may need re-login)_');
  }
  lines.push('');
  lines.push('## Mirror queue');
  lines.push(`Depth: ${queueDepth ?? '?'} entries.`);
  lines.push('');
  lines.push('## Umami (24h)');
  if (u) {
    lines.push(`- Pageviews: **${u.pageviews}**, visitors: ${u.visitors}, bounces: ${u.bounces}`);
    if (u.topReferrers.length) {
      lines.push('- Top referrers:');
      for (const r of u.topReferrers) lines.push(`  - ${r.count}× ${r.source}`);
    } else {
      lines.push('- No referrers captured this window.');
    }
  } else {
    lines.push('- _(Umami creds missing or auth failed)_');
  }
  lines.push('');
  lines.push('## Cadence');
  lines.push(`- X today: **${cadence.xToday}** · Bluesky today: **${cadence.blueskyToday}** · target: ≥${cadence.target}/platform`);
  for (const n of cadence.notes) lines.push(`- ⚠ ${n}`);
  lines.push('');
  lines.push('## Auto-publish gate');
  for (const a of autoActions) lines.push(`- ${a}`);
  if (didFire) {
    lines.push('- ✓ Auto-publish action fired. See output above for details.');
  }
  lines.push('');
  lines.push('## Action items');
  const actions: string[] = [];
  if (failedCritical.length) {
    actions.push(`- ${failedCritical.length} CRITICAL route(s) failed health check — publishing is paused until these are green.`);
  }
  const failedWarnOnly = failedRoutes.filter((c) => !c.critical);
  if (failedWarnOnly.length) {
    actions.push(`- ${failedWarnOnly.length} non-critical route(s) failing (${failedWarnOnly.map((c) => c.label).join(', ')}) — publishing continues; investigate when convenient.`);
  }
  if (cadence.underTarget && !didFire) {
    actions.push('- Below daily cadence target.');
    if (queueDepth && queueDepth > 0) {
      actions.push('  - Mirror queue has ' + queueDepth + ' entries. Run: `npx tsx scripts/social-brief/mirror-queue-apply.ts --apply --batch 1`');
    } else {
      actions.push('  - Mirror queue empty. Consider drafting a fresh post or adding to amplification queue.');
    }
  }
  if (autoPauseGlobal) actions.push('- ⏸ AUTO_PAUSE active. Remove `content/AUTO_PAUSE` to resume auto-publishing.');
  if (actions.length === 0) actions.push('- ✅ No urgent actions. All systems green.');
  for (const a of actions) lines.push(a);

  writeFileSync(reportPath, lines.join('\n'), 'utf8');
  log(`\nReport: ${reportPath}`);

  // ── ntfy summary ─────────────────────────────────────────────────────
  const allOk = failedRoutes.length === 0 && !cadence.underTarget;
  const title = allOk
    ? '✅ Daily ops: all green'
    : `⚠ Daily ops: ${failedRoutes.length} site issue(s), cadence ${cadence.underTarget ? 'under target' : 'on track'}`;
  const summary = [
    `Site: ${site.length - failedRoutes.length}/${site.length} OK`,
    `X today: ${cadence.xToday} · Bluesky today: ${cadence.blueskyToday}`,
    `Umami 24h: ${u?.pageviews ?? '?'} pageviews · ${u?.visitors ?? '?'} visitors`,
    `Mirror queue: ${queueDepth ?? '?'} pending`,
  ].join('\n');
  await notify(title, summary, 'https://parliamentaudit.ca');
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
