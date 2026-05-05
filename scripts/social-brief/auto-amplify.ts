/**
 * Auto-amplification: pick up to N candidates from the trusted amplification
 * queue and repost them on Bluesky. Designed to be called by daily-ops
 * after the mirror-queue gate.
 *
 * Per content/editorial-autonomy.md §2:
 *   - Only reposts (not quote-skeets) — we add no commentary
 *   - Candidate must be < 24 hours old
 *   - Must match at least one keywords_positive
 *   - Must NOT match any keywords_skip
 *   - Max 2 amplifications/day (cross-platform)
 *   - Max 1 amplification per source account per week
 *   - Min 90 minutes between auto-posts
 *
 * State: content/social-briefs/.amplify-state.json (git-ignored).
 *
 * Usage:
 *   npx tsx scripts/social-brief/auto-amplify.ts --dry-run
 *   npx tsx scripts/social-brief/auto-amplify.ts --apply
 *   npx tsx scripts/social-brief/auto-amplify.ts --apply --max 1
 */

import 'dotenv/config';
import { AtpAgent } from '@atproto/api';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const APPLY = process.argv.includes('--apply');
const MAX = parseInt(
  ((): string => {
    const i = process.argv.indexOf('--max');
    return i !== -1 ? process.argv[i + 1] : '2';
  })(),
  10,
);

const ROOT = process.cwd();
const QUEUE_PATH = resolve(ROOT, 'content/amplification-queue.json');
const WATCHLIST_PATH = resolve(ROOT, 'scripts/social-brief/watchlist.json');
const STATE_DIR = resolve(ROOT, 'content/social-briefs');
const STATE_PATH = join(STATE_DIR, '.amplify-state.json');
mkdirSync(STATE_DIR, { recursive: true });

interface AmpState {
  /** All amplifications we've ever made: bskyUri -> { handle, repostedAt } */
  amplified: Record<string, { handle: string; repostedAt: string; sourceText: string }>;
  /** Daily counter — rolls over at UTC midnight */
  todayCount: number;
  todayDate: string;
  /** Last successful repost ISO ts (for spacing) */
  lastRepostAt: string | null;
}

function todayStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadState(): AmpState {
  const empty: AmpState = {
    amplified: {},
    todayCount: 0,
    todayDate: todayStamp(),
    lastRepostAt: null,
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

function saveState(s: AmpState) {
  writeFileSync(STATE_PATH, JSON.stringify(s, null, 2));
}

interface QueueEntry {
  handle: string;
  name: string;
  weight: number;
  rationale?: string;
}

interface Watchlist {
  keywords_positive: string[];
  keywords_skip: string[];
}

interface Candidate {
  uri: string;
  cid: string;
  handle: string;
  name: string;
  text: string;
  createdAt: string;
  weight: number;
  matchedKeywords: string[];
}

const NTFY_TOPIC = process.env.NTFY_TOPIC || 'parliamentaudit-posts';
async function notify(title: string, body: string, click?: string) {
  try {
    const headers: Record<string, string> = {
      Title: title,
      Tags: 'bluesky,amplify',
      Priority: '3',
    };
    if (click) headers.Click = click;
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, { method: 'POST', headers, body });
  } catch {}
}

function matchAny(text: string, list: string[]): string[] {
  const lower = text.toLowerCase();
  return list.filter((k) => lower.includes(k.toLowerCase()));
}

async function main() {
  if (!existsSync(QUEUE_PATH)) {
    console.error(`Missing ${QUEUE_PATH}`);
    process.exit(1);
  }
  const queueFile = JSON.parse(readFileSync(QUEUE_PATH, 'utf8'));
  const watchlist: Watchlist = JSON.parse(readFileSync(WATCHLIST_PATH, 'utf8'));
  const settings = queueFile.auto_amplification_settings || {};
  const trusted: QueueEntry[] = queueFile.platforms?.bluesky?.trusted || [];

  const dailyMax = settings.max_per_day ?? 2;
  const perAccountWeekly = settings.max_per_account_per_week ?? 2;
  const minSpacingMin = settings.min_minutes_between_posts ?? 90;
  const candidateAgeMaxH = settings.candidate_age_max_hours ?? 24;

  console.log(
    `[amplify] settings: dailyMax=${dailyMax} perAccountWeekly=${perAccountWeekly} spacing=${minSpacingMin}m maxAge=${candidateAgeMaxH}h trustedAccounts=${trusted.length}`,
  );

  const state = loadState();
  console.log(
    `[amplify] state: todayCount=${state.todayCount} lastRepostAt=${state.lastRepostAt ?? 'never'}`,
  );

  if (state.todayCount >= dailyMax) {
    console.log(`[amplify] Daily cap hit (${state.todayCount}/${dailyMax}). Nothing to do.`);
    return;
  }

  // Spacing check
  if (state.lastRepostAt) {
    const minsSince = (Date.now() - new Date(state.lastRepostAt).getTime()) / 60000;
    if (minsSince < minSpacingMin) {
      console.log(
        `[amplify] Last repost ${minsSince.toFixed(0)}m ago — need ${minSpacingMin}m spacing. Skipping.`,
      );
      return;
    }
  }

  // Auth
  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) throw new Error('Bluesky creds missing');
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD });
  console.log(`[amplify] auth ok as @${agent.session?.handle}`);

  // Build a per-account "this week" check from state
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const accountUseThisWeek: Record<string, number> = {};
  for (const entry of Object.values(state.amplified)) {
    if (new Date(entry.repostedAt).getTime() > weekAgo) {
      accountUseThisWeek[entry.handle] = (accountUseThisWeek[entry.handle] || 0) + 1;
    }
  }

  // Pull candidates from trusted feeds
  const sinceMs = Date.now() - candidateAgeMaxH * 3600 * 1000;
  const allCandidates: Candidate[] = [];
  for (const entry of trusted) {
    const used = accountUseThisWeek[entry.handle] || 0;
    if (used >= perAccountWeekly) {
      console.log(
        `  [skip-account] @${entry.handle} hit weekly cap (${used}/${perAccountWeekly})`,
      );
      continue;
    }
    try {
      const feed = await agent.getAuthorFeed({
        actor: entry.handle,
        limit: 10,
        filter: 'posts_no_replies',
      });
      for (const item of feed.data.feed || []) {
        if ((item.reason as any)?.$type === 'app.bsky.feed.defs#reasonRepost') continue;
        const post = item.post;
        const r = post.record as any;
        if (!r?.text || r.reply) continue;
        const ts = new Date(r.createdAt).getTime();
        if (ts < sinceMs) continue;
        if (state.amplified[post.uri]) continue;

        const text: string = r.text;
        if (matchAny(text, watchlist.keywords_skip).length > 0) continue;
        const matched = matchAny(text, watchlist.keywords_positive);
        if (matched.length === 0) continue;

        allCandidates.push({
          uri: post.uri,
          cid: post.cid,
          handle: entry.handle,
          name: entry.name,
          text,
          createdAt: r.createdAt,
          weight: entry.weight,
          matchedKeywords: matched,
        });
      }
    } catch (e: any) {
      console.warn(`  [feed-fetch] @${entry.handle}: ${(e?.message || String(e)).slice(0, 100)}`);
    }
  }

  // Rank: weight + keyword-match count + recency tiebreak
  allCandidates.sort((a, b) => {
    const scoreA = a.weight + a.matchedKeywords.length * 0.5;
    const scoreB = b.weight + b.matchedKeywords.length * 0.5;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const remainingToday = dailyMax - state.todayCount;
  const limit = Math.min(MAX, remainingToday, allCandidates.length);
  const toShip = allCandidates.slice(0, limit);

  console.log(`\n[amplify] Found ${allCandidates.length} candidates; would ship ${toShip.length}:`);
  for (const c of toShip) {
    console.log(`  @${c.handle} · ${c.createdAt}`);
    console.log(`     match: ${c.matchedKeywords.join(', ')}`);
    console.log(`     "${c.text.slice(0, 110).replace(/\n/g, ' ')}…"`);
  }

  if (!APPLY) {
    console.log('\n[amplify] Dry-run. Pass --apply to actually repost.');
    return;
  }

  let posted = 0;
  for (const c of toShip) {
    try {
      console.log(`[amplify] reposting @${c.handle} ${c.uri}`);
      await agent.repost(c.uri, c.cid);
      state.amplified[c.uri] = {
        handle: c.handle,
        repostedAt: new Date().toISOString(),
        sourceText: c.text.slice(0, 200),
      };
      state.todayCount += 1;
      state.lastRepostAt = new Date().toISOString();
      saveState(state);
      posted++;
      const liveUrl = `https://bsky.app/profile/${c.handle}/post/${c.uri.split('/').pop()}`;
      await notify(
        `Amplified @${c.handle}`,
        c.text.slice(0, 140),
        liveUrl,
      );
      // Spacing only matters if we're shipping more than one in this run
      if (posted < toShip.length) {
        const wait = minSpacingMin * 60 * 1000;
        console.log(`[amplify] spacing — wait ${minSpacingMin}m before next`);
        await new Promise((r) => setTimeout(r, wait));
      }
    } catch (e: any) {
      console.error(`[amplify] [fail] ${(e?.message || String(e)).slice(0, 200)}`);
      await notify(
        'Amplification FAILED',
        `@${c.handle} — ${(e?.message || String(e)).slice(0, 140)}`,
      );
      break;
    }
  }

  console.log(`\n[amplify] Done. Reposted ${posted}/${toShip.length}.`);
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
