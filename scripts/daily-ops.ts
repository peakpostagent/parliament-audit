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
}

// ── 1. Site health ───────────────────────────────────────────────────────

async function checkRoute(
  path: string,
  expected: { status?: number; contentType?: string } = { status: 200 },
): Promise<CheckResult> {
  const url = `https://parliamentaudit.ca${path}`;
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
    };
  } catch (e: any) {
    return {
      ok: false,
      label: path,
      detail: `error: ${(e?.message || String(e)).slice(0, 100)}`,
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

  const checks = await Promise.all([
    checkRoute('/'),
    checkRoute('/news'),
    checkRoute(`/news/${latestSlug}`),
    checkRoute(`/api/og/news/${latestSlug}`, { status: 200, contentType: 'image/png' }),
    checkRoute(`/api/og/feed-card?slug=${latestSlug}`, { status: 200, contentType: 'image/png' }),
    checkRoute('/rss.xml', { status: 200, contentType: 'xml' }),
    checkRoute('/sitemap.xml', { status: 200, contentType: 'xml' }),
    checkRoute(`/n/${latestSlug}?s=bsky`, { status: 302 }),
    checkRoute('/support'),
    checkRoute('/builders'),
    checkRoute('/find-your-mp'),
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
    const total = queue.queue?.length || 0;
    // We can't fully resolve URI-based dedupe without hitting Bluesky,
    // so we report the gross queue depth here.
    return total;
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
  const target = 2; // soft target: 2 originals per platform per day (see editorial-autonomy.md v3)

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

  // ── Auto-publish gate (per content/editorial-autonomy.md) ──────────
  const autoActions: string[] = [];
  const autoPauseGlobal = existsSync(resolve(ROOT, 'content/AUTO_PAUSE'));
  const autoPauseBsky = existsSync(resolve(ROOT, 'content/AUTO_PAUSE_BLUESKY'));
  const autoPauseX = existsSync(resolve(ROOT, 'content/AUTO_PAUSE_X'));
  const sitePassing = failedRoutes.length === 0;

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
    log(`  ⏸ Site has ${failedRoutes.length} failed route(s) — no auto-posting until green`);
    autoActions.push(`paused-site-issue:${failedRoutes.length}`);
  } else if (cadence.xToday >= cadence.target && cadence.blueskyToday >= cadence.target) {
    log(`  ✓ Cadence target (${cadence.target}/platform) already met for today — no auto-posting needed`);
    autoActions.push('cadence-met');
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
      // Mirror queue empty — try auto-amplify (category 2). Repost up to
      // dailyMax candidates from the trusted handles in
      // content/amplification-queue.json.
      log('  → mirror queue empty; trying auto-amplify (Bluesky reposts of trusted handles)');
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
  if (failedRoutes.length) {
    actions.push(`- ${failedRoutes.length} site route(s) failed health check — investigate before posting more.`);
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
