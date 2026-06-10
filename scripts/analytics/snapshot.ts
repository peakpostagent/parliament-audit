/**
 * Master analytics snapshot — pulls every channel's stats and appends
 * a daily entry to content/analytics/.followers-ledger.json so we can
 * see growth over time, not just a point-in-time number.
 *
 * Channels:
 *   - Bluesky (followers/following/posts via AT Proto)
 *   - X via API v2 (twitter-api-v2 with our OAuth 1.0a tokens)
 *   - Mastodon (verify_credentials)
 *   - Umami (24h + 7-day pageviews/visitors + top URLs/titles + events)
 *   - Newsletter subscribers (Postgres via Drizzle, optional — requires DB)
 *
 * Outputs:
 *   - Stdout: human-readable report
 *   - content/analytics/.followers-ledger.json: time series, appended daily
 *   - content/analytics/snapshot-<ISO date>.json: full snapshot for that day
 *
 * Idempotent: re-running on the same UTC date overwrites that day's
 * ledger entry rather than duplicating.
 *
 * Usage:
 *   npx tsx scripts/analytics/snapshot.ts
 *   npx tsx scripts/analytics/snapshot.ts --no-write  # report only
 */
import dotenv from 'dotenv';
dotenv.config({ override: true });

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { AtpAgent } from '@atproto/api';
import { TwitterApi } from 'twitter-api-v2';

const ROOT = process.cwd();
const ANALYTICS_DIR = resolve(ROOT, 'content/analytics');
mkdirSync(ANALYTICS_DIR, { recursive: true });
const LEDGER_PATH = join(ANALYTICS_DIR, '.followers-ledger.json');

const NO_WRITE = process.argv.includes('--no-write');
const todayISO = new Date().toISOString().slice(0, 10);

interface BlueskySnap {
  followers: number;
  following: number;
  posts: number;
  recentEngagement: Array<{
    createdAt: string;
    text: string;
    likes: number;
    reposts: number;
    replies: number;
    slug?: string;
  }>;
  recentFollowers: string[];
}

interface XSnap {
  followers: number | null;
  following: number | null;
  postsCount: number | null;
  recentEngagement: Array<{
    id: string;
    createdAt: string;
    text: string;
    likes: number;
    retweets: number;
    replies: number;
    impressions: number;
    quotes: number;
    bookmarks: number;
  }>;
  error?: string;
}

interface MastodonSnap {
  // Counts are nullable so we can distinguish "API said zero" from
  // "API failed / returned malformed data." The latter should NOT be
  // written as zero into the follower-growth ledger.
  followers: number | null;
  following: number | null;
  statuses: number | null;
  recentStatuses: Array<{
    createdAt: string;
    text: string;
    favourites: number;
    reblogs: number;
    replies: number;
  }>;
  recentFollowers: string[];
  error?: string;
}

interface UmamiSnap {
  last24h: { pageviews: number; visitors: number; bounces: number; totaltime: number };
  prior24h: { pageviews: number; visitors: number; bounces: number; totaltime: number };
  last7d: { pageviews: number; visitors: number; bounces: number; totaltime: number };
  topPaths: Array<{ path: string; views: number }>;
  topReferrers: Array<{ source: string; visits: number }>;
  events: Array<{ event: string; count: number }>;
  active: number;
  // Per-channel rollup (referrer-grouped, last 24h)
  utmBreakdown?: Record<string, number>;
  // Per-campaign breakdown: parsed from individual session referrer URLs.
  // Each entry tells us which specific post drove traffic. The campaign
  // string follows our convention `<topic>-<YYYY-MM-DD>[-rN]` or
  // `series-<series-name>-day-NN`.
  utmCampaigns?: Array<{ campaign: string; source: string; visits: number }>;
}

interface SubscribersSnap {
  total: number | null;
  confirmed: number | null;
  unsubscribed: number | null;
  error?: string;
}

interface Snapshot {
  date: string;
  bluesky: BlueskySnap;
  x: XSnap;
  mastodon: MastodonSnap;
  umami: UmamiSnap;
  newsletter: SubscribersSnap;
}

// ── Bluesky ──────────────────────────────────────────────────────────
async function pullBluesky(): Promise<BlueskySnap> {
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: process.env.BLUESKY_HANDLE!,
    password: process.env.BLUESKY_APP_PASSWORD!,
  });
  const did = agent.session!.did;
  const profile = await agent.getProfile({ actor: did });
  const feed = await agent.getAuthorFeed({ actor: did, limit: 15, filter: 'posts_no_replies' });
  const recentEngagement: BlueskySnap['recentEngagement'] = [];
  for (const it of feed.data.feed) {
    if ((it.reason as any)?.$type === 'app.bsky.feed.defs#reasonRepost') continue;
    const p = it.post as any;
    const r = p.record;
    if (!r?.text || r.reply) continue;
    // Try to extract slug from embed external URL
    let slug: string | undefined;
    const embed = (p.embed as any)?.external?.uri || (r.embed as any)?.external?.uri;
    if (embed) {
      const m = embed.match(/\/news\/([^?]+)/);
      if (m) slug = m[1];
    }
    recentEngagement.push({
      createdAt: r.createdAt,
      text: r.text.slice(0, 180),
      likes: p.likeCount || 0,
      reposts: p.repostCount || 0,
      replies: p.replyCount || 0,
      slug,
    });
  }
  const followers = await agent.getFollowers({ actor: did, limit: 30 });
  return {
    followers: profile.data.followersCount || 0,
    following: profile.data.followsCount || 0,
    posts: profile.data.postsCount || 0,
    recentEngagement,
    recentFollowers: followers.data.followers.map((f) => `@${f.handle}`),
  };
}

// ── X (Twitter) via API v2 ───────────────────────────────────────────
async function pullX(): Promise<XSnap> {
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET } = process.env;
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_TOKEN_SECRET) {
    return {
      followers: null,
      following: null,
      postsCount: null,
      recentEngagement: [],
      error: 'X API credentials missing in .env',
    };
  }
  try {
    const client = new TwitterApi({
      appKey: X_API_KEY,
      appSecret: X_API_SECRET,
      accessToken: X_ACCESS_TOKEN,
      accessSecret: X_ACCESS_TOKEN_SECRET,
    });
    const v2 = client.v2;
    // Self profile + public metrics
    const me = await v2.me({
      'user.fields': ['public_metrics', 'created_at', 'description'],
    });
    const followers = me.data.public_metrics?.followers_count ?? null;
    const following = me.data.public_metrics?.following_count ?? null;
    const postsCount = me.data.public_metrics?.tweet_count ?? null;
    // Recent tweets with metrics
    const tweets = await v2.userTimeline(me.data.id, {
      max_results: 10,
      'tweet.fields': ['public_metrics', 'created_at'],
      exclude: ['replies', 'retweets'],
    });
    const recentEngagement: XSnap['recentEngagement'] = [];
    for (const t of tweets.tweets) {
      const m = t.public_metrics;
      recentEngagement.push({
        id: t.id,
        createdAt: t.created_at || '',
        text: (t.text || '').slice(0, 180),
        likes: m?.like_count ?? 0,
        retweets: m?.retweet_count ?? 0,
        replies: m?.reply_count ?? 0,
        impressions: (m as any)?.impression_count ?? 0,
        quotes: m?.quote_count ?? 0,
        bookmarks: (m as any)?.bookmark_count ?? 0,
      });
    }
    return { followers, following, postsCount, recentEngagement };
  } catch (e: any) {
    return {
      followers: null,
      following: null,
      postsCount: null,
      recentEngagement: [],
      error: (e?.message || String(e)).slice(0, 200),
    };
  }
}

// ── Mastodon ─────────────────────────────────────────────────────────
//
// We treat an upstream Mastodon API failure as missing-data (followers
// reported as null) rather than zero. The previous version coerced any
// missing `me.followers_count` to 0 via `me.followers_count || 0`, which
// silently corrupted the follower-growth ledger when verify_credentials
// returned a transient error object (no id, no count). The ledger writer
// downstream now carries forward the prior day's value when this returns
// null, so a one-off API blip doesn't show up as a 100% drop in the chart.
async function pullMastodon(): Promise<MastodonSnap> {
  const url = process.env.MASTODON_INSTANCE_URL;
  const token = process.env.MASTODON_ACCESS_TOKEN;
  if (!url || !token)
    return {
      followers: null,
      following: null,
      statuses: null,
      recentStatuses: [],
      recentFollowers: [],
      error: 'no MASTODON_INSTANCE_URL or MASTODON_ACCESS_TOKEN',
    };
  const base = url.replace(/\/+$/, '');
  const headers = { authorization: `Bearer ${token}` };

  let me: any;
  try {
    const res = await fetch(`${base}/api/v1/accounts/verify_credentials`, { headers });
    if (!res.ok) {
      return {
        followers: null,
        following: null,
        statuses: null,
        recentStatuses: [],
        recentFollowers: [],
        error: `verify_credentials HTTP ${res.status}`,
      };
    }
    me = await res.json();
  } catch (e: any) {
    return {
      followers: null,
      following: null,
      statuses: null,
      recentStatuses: [],
      recentFollowers: [],
      error: `verify_credentials fetch: ${e?.message || String(e)}`.slice(0, 200),
    };
  }

  // Defensive: Mastodon error responses look like `{ error: '...' }` —
  // they parse cleanly as JSON but have no `id` field. If we get one of
  // those (or any response missing the load-bearing `id`/`followers_count`
  // fields), report failure rather than emitting a zeroed-out snapshot.
  if (!me || typeof me !== 'object' || typeof me.id !== 'string' || typeof me.followers_count !== 'number') {
    return {
      followers: null,
      following: null,
      statuses: null,
      recentStatuses: [],
      recentFollowers: [],
      error: `verify_credentials returned malformed body: ${me?.error || JSON.stringify(me).slice(0, 120)}`,
    };
  }

  const id = me.id;
  let statusesRes: any[] = [];
  let followersRes: any[] = [];
  try {
    statusesRes = await fetch(
      `${base}/api/v1/accounts/${id}/statuses?limit=10&exclude_replies=true&exclude_reblogs=true`,
      { headers },
    ).then((r) => r.json());
    if (!Array.isArray(statusesRes)) statusesRes = [];
  } catch { /* statuses are non-load-bearing — keep going */ }
  try {
    followersRes = await fetch(
      `${base}/api/v1/accounts/${id}/followers?limit=20`,
      { headers },
    ).then((r) => r.json());
    if (!Array.isArray(followersRes)) followersRes = [];
  } catch { /* followers list is non-load-bearing too */ }

  return {
    followers: me.followers_count,
    following: me.following_count || 0,
    statuses: me.statuses_count || 0,
    recentStatuses: statusesRes.map((s) => ({
      createdAt: s.created_at,
      text: s.content.replace(/<[^>]+>/g, '').slice(0, 180),
      favourites: s.favourites_count || 0,
      reblogs: s.reblogs_count || 0,
      replies: s.replies_count || 0,
    })),
    recentFollowers: followersRes.map((f) => `@${f.acct}`),
  };
}

// ── Umami ────────────────────────────────────────────────────────────
async function pullUmami(): Promise<UmamiSnap> {
  const credsPath = resolve(ROOT, '.umami-creds.json');
  const empty: UmamiSnap = {
    last24h: { pageviews: 0, visitors: 0, bounces: 0, totaltime: 0 },
    prior24h: { pageviews: 0, visitors: 0, bounces: 0, totaltime: 0 },
    last7d: { pageviews: 0, visitors: 0, bounces: 0, totaltime: 0 },
    topPaths: [],
    topReferrers: [],
    events: [],
    active: 0,
  };
  if (!existsSync(credsPath)) return empty;
  const creds = JSON.parse(readFileSync(credsPath, 'utf8'));
  const UMAMI = 'https://umami-production-d170.up.railway.app';
  const login = await fetch(`${UMAMI}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: creds.adminUsername || 'admin',
      password: creds.adminPassword,
    }),
  });
  if (!login.ok) return empty;
  const { token } = await login.json();
  const headers = { authorization: `Bearer ${token}` };
  const wid = creds.websiteId;
  const now = Date.now();
  const w24 = now - 24 * 3600 * 1000;
  const w7d = now - 7 * 24 * 3600 * 1000;
  // 24h stats with comparison vs prior 24h
  const s24 = await fetch(
    `${UMAMI}/api/websites/${wid}/stats?startAt=${w24}&endAt=${now}`,
    { headers },
  ).then((r) => r.json());
  const s7d = await fetch(
    `${UMAMI}/api/websites/${wid}/stats?startAt=${w7d}&endAt=${now}`,
    { headers },
  ).then((r) => r.json());
  // Top paths (last 7d for richer signal)
  const topPathsRes: any[] = await fetch(
    `${UMAMI}/api/websites/${wid}/metrics?startAt=${w7d}&endAt=${now}&unit=hour&timezone=America%2FEdmonton&type=path&limit=15`,
    { headers },
  ).then((r) => r.json());
  // Top referrers (24h)
  const topRefRes: any[] = await fetch(
    `${UMAMI}/api/websites/${wid}/metrics?startAt=${w24}&endAt=${now}&unit=hour&timezone=America%2FEdmonton&type=referrer&limit=10`,
    { headers },
  ).then((r) => r.json());
  // Events (7d)
  const eventsRes: any[] = await fetch(
    `${UMAMI}/api/websites/${wid}/metrics?startAt=${w7d}&endAt=${now}&unit=hour&timezone=America%2FEdmonton&type=event&limit=15`,
    { headers },
  ).then((r) => r.json());
  // Active
  const active: any = await fetch(`${UMAMI}/api/websites/${wid}/active`, { headers }).then((r) =>
    r.json(),
  );
  // UTM breakdown via referrers (those carrying utm_source show up as full URL)
  const utmBreakdown: Record<string, number> = {};
  for (const r of topRefRes) {
    const src = String(r.x || '').toLowerCase();
    if (src.includes('bsky') || src.includes('bluesky')) utmBreakdown['bluesky'] = (utmBreakdown['bluesky'] || 0) + r.y;
    else if (src.includes('t.co') || src.includes('x.com') || src.includes('twitter')) utmBreakdown['x'] = (utmBreakdown['x'] || 0) + r.y;
    else if (src.includes('mas.to') || src.includes('mstdn') || src.includes('mastodon') || src.includes('humanwords') || src.includes('vivaldi'))
      utmBreakdown['mastodon'] = (utmBreakdown['mastodon'] || 0) + r.y;
    else if (src.includes('google') || src.includes('bing') || src.includes('duckduckgo'))
      utmBreakdown['search'] = (utmBreakdown['search'] || 0) + r.y;
    else utmBreakdown['other'] = (utmBreakdown['other'] || 0) + r.y;
  }
  // ── UTM campaign breakdown (landing-page query strings) ─
  // UTM params live on OUR landing URL's query string (?utm_source=…),
  // not on the visitor's referrer (which is just bsky.app etc.). Umami
  // exposes landing-page query strings via metrics type=query. We parse
  // utm_campaign/utm_source out of each query-string row and aggregate.
  //
  // (Previous implementation parsed session referrer URLs for utm_ —
  // which never matches, since the referrer is the page the visitor
  // came FROM, not the page they landed ON. It reported zero campaigns
  // forever. Fixed 2026-06-10.)
  const utmCampaignsMap: Record<string, { campaign: string; source: string; visits: number }> = {};
  try {
    const queryRes: any = await fetch(
      `${UMAMI}/api/websites/${wid}/metrics?startAt=${w7d}&endAt=${now}&type=query&limit=100`,
      { headers },
    ).then((r) => r.json());
    const rows: any[] = Array.isArray(queryRes) ? queryRes : Array.isArray(queryRes?.data) ? queryRes.data : [];
    for (const row of rows) {
      const qs = String(row.x || '');
      if (!qs.includes('utm_')) continue;
      const params = new URLSearchParams(qs);
      const camp = params.get('utm_campaign');
      // Some sources (e.g. ChatGPT) tag only utm_source with no campaign —
      // still worth surfacing, under campaign "(none)".
      const src = params.get('utm_source') || 'unknown';
      if (!camp && src === 'unknown') continue;
      const campaign = camp || '(none)';
      const key = `${src}::${campaign}`;
      if (!utmCampaignsMap[key]) {
        utmCampaignsMap[key] = { campaign, source: src, visits: 0 };
      }
      utmCampaignsMap[key].visits += Number(row.y) || 1;
    }
  } catch {
    /* query-metrics failure is non-fatal */
  }
  const utmCampaigns = Object.values(utmCampaignsMap).sort((a, b) => b.visits - a.visits);

  return {
    last24h: {
      pageviews: s24.pageviews || 0,
      visitors: s24.visitors || 0,
      bounces: s24.bounces || 0,
      totaltime: s24.totaltime || 0,
    },
    prior24h: {
      pageviews: s24.comparison?.pageviews || 0,
      visitors: s24.comparison?.visitors || 0,
      bounces: s24.comparison?.bounces || 0,
      totaltime: s24.comparison?.totaltime || 0,
    },
    last7d: {
      pageviews: s7d.pageviews || 0,
      visitors: s7d.visitors || 0,
      bounces: s7d.bounces || 0,
      totaltime: s7d.totaltime || 0,
    },
    topPaths: (Array.isArray(topPathsRes) ? topPathsRes : []).map((r) => ({ path: r.x, views: r.y })),
    topReferrers: (Array.isArray(topRefRes) ? topRefRes : []).map((r) => ({ source: r.x, visits: r.y })),
    events: (Array.isArray(eventsRes) ? eventsRes : []).map((r) => ({ event: r.x, count: r.y })),
    active: active?.visitors || 0,
    utmBreakdown,
    utmCampaigns,
  };
}

// ── Newsletter subscribers ───────────────────────────────────────────
//
// Connects to Postgres to count the `subscribers` table. The database
// URL is resolved in this priority order:
//   1. DATABASE_URL_PROD — explicit "use the production DB here" override.
//      Use this when DATABASE_URL points at a local dev Postgres but you
//      want the analytics snapshot to read from the Railway production DB.
//   2. DATABASE_URL — the default.
//
// When the connection fails, we unwrap the postgres-js AggregateError
// (which is what bubbles up when every connection attempt to a host:port
// fails — usually because there's no Postgres listening at that address)
// so the operator sees a useful message instead of the bare class name.
async function pullSubscribers(): Promise<SubscribersSnap> {
  const dbUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL;
  if (!dbUrl)
    return { total: null, confirmed: null, unsubscribed: null, error: 'no DATABASE_URL or DATABASE_URL_PROD' };

  // Surface the host being probed so the error message is actionable.
  let probeHost = '?';
  try {
    const u = new URL(dbUrl);
    probeHost = `${u.hostname}:${u.port || '5432'}`;
  } catch {
    /* malformed URL — let postgres-js complain about it */
  }

  try {
    // Use postgres-js (the same driver packages/db/src/client.ts uses).
    // Local Postgres won't need SSL; Railway production URL provides
    // sslmode in the connection string so this is robust to both.
    const postgres = (await import('postgres')).default;
    const sql = postgres(dbUrl, { max: 1, idle_timeout: 3, connect_timeout: 5 });
    let total = 0;
    let confirmed = 0;
    let unsubscribed = 0;
    try {
      const totalRows = await sql<Array<{ n: number }>>`SELECT COUNT(*)::int AS n FROM subscribers`;
      total = totalRows[0]?.n || 0;
      const confirmedRows = await sql<Array<{ n: number }>>`SELECT COUNT(*)::int AS n FROM subscribers WHERE confirmed_at IS NOT NULL`;
      confirmed = confirmedRows[0]?.n || 0;
      const unsubRows = await sql<Array<{ n: number }>>`SELECT COUNT(*)::int AS n FROM subscribers WHERE unsubscribed_at IS NOT NULL`;
      unsubscribed = unsubRows[0]?.n || 0;
    } finally {
      await sql.end({ timeout: 2 });
    }
    return { total, confirmed, unsubscribed };
  } catch (e: any) {
    // Unwrap AggregateError (postgres-js wraps every-attempt-failed in this).
    // Surface the inner cause so the operator sees the real reason instead
    // of the bare "AggregateError" class name.
    let detail = e?.message || String(e);
    if (e?.name === 'AggregateError' && Array.isArray(e?.errors) && e.errors.length > 0) {
      const innerMessages = e.errors
        .map((inner: any) => inner?.code ? `${inner.code} ${inner.message || ''}`.trim() : (inner?.message || String(inner)))
        .filter(Boolean);
      const unique = Array.from(new Set(innerMessages));
      detail = `connection to ${probeHost} failed — ${unique.join('; ')}`;
      // The classic case: DATABASE_URL points at localhost with no
      // Postgres running there. Give the operator the actionable fix.
      if (probeHost.startsWith('localhost') || probeHost.startsWith('127.0.0.1')) {
        detail += ` (DATABASE_URL points at local Postgres — set DATABASE_URL_PROD to your Railway DB URL to read subscriber counts here)`;
      }
    }
    return {
      total: null,
      confirmed: null,
      unsubscribed: null,
      error: detail.slice(0, 400),
    };
  }
}

// ── Ledger ───────────────────────────────────────────────────────────
interface LedgerEntry {
  date: string;
  bluesky_followers: number;
  bluesky_following: number;
  bluesky_posts: number;
  x_followers: number | null;
  x_posts: number | null;
  // Mastodon counts are nullable so a transient API blip doesn't write a
  // bogus 0 into the historical ledger. When the API fails on a given run
  // we carry forward the previous day's value (see appendOrReplaceTodaysEntry).
  mastodon_followers: number | null;
  mastodon_following: number | null;
  mastodon_statuses: number | null;
  newsletter_total: number | null;
  newsletter_confirmed: number | null;
  umami_pv_24h: number;
  umami_visitors_24h: number;
  umami_pv_7d: number;
  umami_visitors_7d: number;
}
function loadLedger(): LedgerEntry[] {
  if (!existsSync(LEDGER_PATH)) return [];
  try {
    return JSON.parse(readFileSync(LEDGER_PATH, 'utf8'));
  } catch {
    return [];
  }
}
function saveLedger(entries: LedgerEntry[]) {
  writeFileSync(LEDGER_PATH, JSON.stringify(entries, null, 2));
}
function appendOrReplaceTodaysEntry(snap: Snapshot, ledger: LedgerEntry[]): LedgerEntry[] {
  // Find the most-recent prior entry so we can carry forward when an
  // upstream probe fails. Without this, a one-off transient API error
  // becomes a permanent zero in the historical record (which is what
  // produced the bogus May-26 Mastodon=0 row).
  const sortedPrior = ledger
    .filter((e) => e.date !== todayISO)
    .sort((a, b) => a.date.localeCompare(b.date));
  const prior = sortedPrior[sortedPrior.length - 1];

  const carry = <T>(current: T | null | undefined, last: T | null | undefined): T | null =>
    (current === null || current === undefined ? (last ?? null) : current) as T | null;

  const entry: LedgerEntry = {
    date: todayISO,
    bluesky_followers: snap.bluesky.followers,
    bluesky_following: snap.bluesky.following,
    bluesky_posts: snap.bluesky.posts,
    x_followers: snap.x.followers,
    x_posts: snap.x.postsCount,
    mastodon_followers: carry(snap.mastodon.followers, prior?.mastodon_followers),
    mastodon_following: carry(snap.mastodon.following, prior?.mastodon_following),
    mastodon_statuses: carry(snap.mastodon.statuses, prior?.mastodon_statuses),
    newsletter_total: carry(snap.newsletter.total, prior?.newsletter_total),
    newsletter_confirmed: carry(snap.newsletter.confirmed, prior?.newsletter_confirmed),
    umami_pv_24h: snap.umami.last24h.pageviews,
    umami_visitors_24h: snap.umami.last24h.visitors,
    umami_pv_7d: snap.umami.last7d.pageviews,
    umami_visitors_7d: snap.umami.last7d.visitors,
  };
  const idx = ledger.findIndex((e) => e.date === todayISO);
  if (idx >= 0) ledger[idx] = entry;
  else ledger.push(entry);
  ledger.sort((a, b) => a.date.localeCompare(b.date));
  return ledger;
}

// ── Topic-level engagement aggregator (Bluesky) ──────────────────────
interface TopicRollup {
  category: string;
  posts: number;
  likes: number;
  reposts: number;
  replies: number;
  engagementPerPost: number;
}
function aggregateByCategory(bsky: BlueskySnap): TopicRollup[] {
  // Try to load article categories from news-articles.ts (string-grep)
  const articlesPath = resolve(ROOT, 'apps/web/src/content/news-articles.ts');
  let articlesContent = '';
  try {
    articlesContent = readFileSync(articlesPath, 'utf8');
  } catch {
    return [];
  }
  const slugToCategory: Record<string, string> = {};
  // Parse: { slug: 'foo', ... category: 'Bar' } — multi-line, so capture pairs
  const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
  const categoryRegex = /category:\s*['"]([^'"]+)['"]/g;
  // Walk in lockstep — these appear in the same article object literal
  const slugMatches: Array<{ slug: string; idx: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = slugRegex.exec(articlesContent)) !== null) {
    slugMatches.push({ slug: m[1], idx: m.index });
  }
  const catMatches: Array<{ category: string; idx: number }> = [];
  while ((m = categoryRegex.exec(articlesContent)) !== null) {
    catMatches.push({ category: m[1], idx: m.index });
  }
  // For each slug, find the next category after it
  for (const s of slugMatches) {
    const nextCat = catMatches.find((c) => c.idx > s.idx);
    if (nextCat) slugToCategory[s.slug] = nextCat.category;
  }
  const rollup: Record<string, TopicRollup> = {};
  for (const post of bsky.recentEngagement) {
    if (!post.slug) continue;
    const cat = slugToCategory[post.slug] || 'Uncategorized';
    if (!rollup[cat]) {
      rollup[cat] = { category: cat, posts: 0, likes: 0, reposts: 0, replies: 0, engagementPerPost: 0 };
    }
    rollup[cat].posts++;
    rollup[cat].likes += post.likes;
    rollup[cat].reposts += post.reposts;
    rollup[cat].replies += post.replies;
  }
  for (const r of Object.values(rollup)) {
    r.engagementPerPost = r.posts > 0 ? (r.likes + r.reposts + r.replies) / r.posts : 0;
  }
  return Object.values(rollup).sort((a, b) => b.engagementPerPost - a.engagementPerPost);
}

// ── Render ───────────────────────────────────────────────────────────
function fmtDelta(a: number, b: number): string {
  if (b === 0) return a > 0 ? '+∞%' : '—';
  const pct = ((a - b) / b) * 100;
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(0)}%`;
}

function render(snap: Snapshot, ledger: LedgerEntry[], topicRollup: TopicRollup[]) {
  const lines: string[] = [];
  lines.push(`# Parliament Audit — Analytics Snapshot · ${snap.date}`);
  lines.push('');
  lines.push(`Generated ${new Date().toISOString()}`);
  lines.push('');

  // Bluesky
  lines.push('## 🦋 Bluesky');
  const prevBsky = ledger.length >= 2 ? ledger[ledger.length - 2] : undefined;
  const bskyDelta = prevBsky
    ? ` (was ${prevBsky.bluesky_followers}; ${fmtDelta(snap.bluesky.followers, prevBsky.bluesky_followers)})`
    : '';
  lines.push(`- Followers: **${snap.bluesky.followers}**${bskyDelta}`);
  lines.push(`- Following: ${snap.bluesky.following}`);
  lines.push(`- Posts:     ${snap.bluesky.posts}`);
  lines.push('');
  lines.push('### Recent post engagement (last 15 originals)');
  for (const p of snap.bluesky.recentEngagement) {
    lines.push(`- \`${p.createdAt.slice(5, 16)}\` ♥${p.likes} ↻${p.reposts} 💬${p.replies} — ${p.text.replace(/\n/g, ' ').slice(0, 80)}`);
  }
  lines.push('');

  // X
  lines.push('## 🐦 X');
  if (snap.x.error) {
    lines.push(`- ⚠ ${snap.x.error}`);
  } else {
    const prevX = ledger.length >= 2 ? ledger[ledger.length - 2] : undefined;
    const xDelta = prevX?.x_followers != null && snap.x.followers != null
      ? ` (was ${prevX.x_followers}; ${fmtDelta(snap.x.followers, prevX.x_followers)})`
      : '';
    lines.push(`- Followers: **${snap.x.followers ?? '?'}**${xDelta}`);
    lines.push(`- Following: ${snap.x.following ?? '?'}`);
    lines.push(`- Posts:     ${snap.x.postsCount ?? '?'}`);
    lines.push('');
    lines.push('### Recent post engagement');
    for (const t of snap.x.recentEngagement) {
      lines.push(`- \`${t.createdAt.slice(5, 16)}\` ♥${t.likes} ↻${t.retweets} 💬${t.replies} 👁${t.impressions} 🔖${t.bookmarks} — ${t.text.replace(/\n/g, ' ').slice(0, 80)}`);
    }
  }
  lines.push('');

  // Mastodon
  lines.push('## 🐘 Mastodon');
  if (snap.mastodon.error) {
    lines.push(`- ⚠ probe error: ${snap.mastodon.error}`);
  }
  const prevMasto = ledger.length >= 2 ? ledger[ledger.length - 2] : undefined;
  const mDelta =
    prevMasto && snap.mastodon.followers !== null && prevMasto.mastodon_followers !== null
      ? ` (was ${prevMasto.mastodon_followers}; ${fmtDelta(snap.mastodon.followers, prevMasto.mastodon_followers)})`
      : '';
  const mastoFollowersStr = snap.mastodon.followers === null ? '?' : String(snap.mastodon.followers);
  const mastoFollowingStr = snap.mastodon.following === null ? '?' : String(snap.mastodon.following);
  const mastoStatusesStr = snap.mastodon.statuses === null ? '?' : String(snap.mastodon.statuses);
  lines.push(`- Followers: **${mastoFollowersStr}**${mDelta}`);
  lines.push(`- Following: ${mastoFollowingStr}`);
  lines.push(`- Statuses:  ${mastoStatusesStr}`);
  lines.push('### Recent statuses');
  for (const s of snap.mastodon.recentStatuses) {
    lines.push(`- \`${s.createdAt.slice(5, 16)}\` ♥${s.favourites} 🔁${s.reblogs} 💬${s.replies} — ${s.text.replace(/\n/g, ' ').slice(0, 80)}`);
  }
  lines.push('');

  // Newsletter
  lines.push('## ✉️  Newsletter subscribers');
  if (snap.newsletter.error) {
    lines.push(`- ⚠ ${snap.newsletter.error}`);
  } else {
    lines.push(`- Total: **${snap.newsletter.total ?? '?'}**, confirmed ${snap.newsletter.confirmed ?? '?'}, unsubscribed ${snap.newsletter.unsubscribed ?? '?'}`);
  }
  lines.push('');

  // Umami
  lines.push('## 📈 Umami');
  const u = snap.umami;
  lines.push(`- Last 24h:  **${u.last24h.pageviews}** pageviews · ${u.last24h.visitors} visitors · ${u.last24h.bounces} bounces · ${u.last24h.totaltime}s on-site`);
  lines.push(`- Prior 24h: ${u.prior24h.pageviews} pv · ${u.prior24h.visitors} visitors  (Δ pv: ${fmtDelta(u.last24h.pageviews, u.prior24h.pageviews)})`);
  lines.push(`- Last 7d:   **${u.last7d.pageviews}** pv · ${u.last7d.visitors} visitors · ${u.last7d.totaltime}s on-site`);
  lines.push(`- Active right now: ${u.active}`);
  lines.push('');
  lines.push('### Top paths (last 7d)');
  for (const p of u.topPaths.slice(0, 10)) {
    lines.push(`- ${p.views}× \`${p.path}\``);
  }
  lines.push('### Top referrers (last 24h)');
  for (const r of u.topReferrers.slice(0, 10)) {
    lines.push(`- ${r.visits}× ${r.source}`);
  }
  lines.push('### Engagement events (last 7d)');
  for (const e of u.events) {
    lines.push(`- ${e.count}× \`${e.event}\``);
  }
  lines.push('### Channel breakdown (referrers grouped, last 24h)');
  for (const [src, n] of Object.entries(u.utmBreakdown || {})) {
    lines.push(`- ${n}× ${src}`);
  }
  lines.push('### UTM campaigns (last 7d, landing-page query strings)');
  if (!u.utmCampaigns || u.utmCampaigns.length === 0) {
    lines.push('- (no campaign-tagged referrals captured yet — needs a few days of post-traffic to fill in)');
  } else {
    for (const c of u.utmCampaigns.slice(0, 12)) {
      lines.push(`- ${c.visits}× \`${c.source}\` · campaign=\`${c.campaign}\``);
    }
  }
  lines.push('');

  // Topic rollup
  if (topicRollup.length) {
    lines.push('## 📚 Bluesky engagement by article category');
    lines.push('| Category | Posts | Likes | Reposts | Replies | Engagement/post |');
    lines.push('|---|---|---|---|---|---|');
    for (const r of topicRollup) {
      lines.push(
        `| ${r.category} | ${r.posts} | ${r.likes} | ${r.reposts} | ${r.replies} | ${r.engagementPerPost.toFixed(2)} |`,
      );
    }
    lines.push('');
  }

  // Ledger trend
  if (ledger.length >= 2) {
    lines.push('## 📅 Follower-growth ledger (last 7 days)');
    lines.push('| Date | Bluesky | X | Mastodon | Newsletter | PV 24h | PV 7d |');
    lines.push('|---|---|---|---|---|---|---|');
    for (const e of ledger.slice(-7)) {
      lines.push(
        `| ${e.date} | ${e.bluesky_followers} | ${e.x_followers ?? '?'} | ${e.mastodon_followers ?? '?'} | ${e.newsletter_total ?? '?'} | ${e.umami_pv_24h} | ${e.umami_pv_7d} |`,
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ── Main ─────────────────────────────────────────────────────────────
async function main() {
  console.log('[analytics-snapshot] pulling all channels…');
  const [bluesky, x, mastodon, umami, newsletter] = await Promise.all([
    pullBluesky().catch((e) => ({
      followers: 0,
      following: 0,
      posts: 0,
      recentEngagement: [],
      recentFollowers: [],
      error: e?.message,
    } as any)),
    pullX(),
    pullMastodon().catch((e) => ({
      followers: 0,
      following: 0,
      statuses: 0,
      recentStatuses: [],
      recentFollowers: [],
      error: e?.message,
    } as any)),
    pullUmami(),
    pullSubscribers(),
  ]);
  const snap: Snapshot = { date: todayISO, bluesky, x, mastodon, umami, newsletter };
  const ledger = loadLedger();
  const updatedLedger = appendOrReplaceTodaysEntry(snap, ledger);
  const topicRollup = aggregateByCategory(bluesky);
  const report = render(snap, updatedLedger, topicRollup);
  console.log('\n' + report);
  if (NO_WRITE) {
    console.log('\n[analytics-snapshot] --no-write set; skipping file writes');
    return;
  }
  saveLedger(updatedLedger);
  const snapPath = join(ANALYTICS_DIR, `snapshot-${todayISO}.json`);
  writeFileSync(snapPath, JSON.stringify(snap, null, 2));
  console.log(`\n[analytics-snapshot] wrote ${LEDGER_PATH}`);
  console.log(`[analytics-snapshot] wrote ${snapPath}`);
}

main().catch((e) => {
  console.error('[analytics-snapshot] fatal:', e?.message || e);
  process.exit(1);
});
