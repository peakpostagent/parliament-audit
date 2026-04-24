/**
 * Daily Social Brief — Generator
 *
 * Fetches recent Bluesky posts from our watchlist + #cdnpoli feed, filters
 * by our editorial guardrails, ranks candidates, drafts replies and
 * amplifications in our wire-reporter voice, and writes the day's brief
 * to content/social-briefs/<YYYY-MM-DD>.md.
 *
 * Usage:
 *   npx tsx scripts/social-brief/generate.ts
 *   npx tsx scripts/social-brief/generate.ts --limit 20
 *   npx tsx scripts/social-brief/generate.ts --hours 48
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

const args = process.argv.slice(2);
const LIMIT = parseInt(
  args[args.indexOf('--limit') + 1] ?? '',
  10,
) || 15;
const HOURS = parseInt(args[args.indexOf('--hours') + 1] ?? '', 10) || 24;

const ROOT = process.cwd();
const WATCHLIST_PATH = resolve(
  ROOT,
  'scripts/social-brief/watchlist.json',
);
const BRIEFS_DIR = resolve(ROOT, 'content/social-briefs');
const STATE_PATH = join(BRIEFS_DIR, '.state.json');

mkdirSync(BRIEFS_DIR, { recursive: true });

// ─── Types ────────────────────────────────────────────────────────────────

interface WatchlistEntry {
  handle: string;
  name: string;
  outlet?: string;
  party?: string;
  weight: number;
  notes?: string;
  resolveable?: boolean;
}

interface Watchlist {
  journalists: WatchlistEntry[];
  mps_leaders: WatchlistEntry[];
  parties: WatchlistEntry[];
  advocacy_watchdogs: WatchlistEntry[];
  primary_sources: WatchlistEntry[];
  hashtags: string[];
  keywords_positive: string[];
  keywords_skip: string[];
}

interface State {
  lastRun?: string;
  processedPostUris: string[]; // IDs we've already drafted against
  executedPostUris: string[]; // IDs we've already posted replies to / amped
}

interface Candidate {
  uri: string; // the post's AT URI
  cid: string;
  authorHandle: string;
  authorName: string;
  authorWeight: number;
  authorRole: string; // 'journalist' / 'mp' / 'party' / etc.
  text: string;
  createdAt: string;
  likeCount?: number;
  repostCount?: number;
  replyCount?: number;
  url: string; // human URL for the post
  matchedKeywords: string[];
  score: number;
}

interface Draft {
  action: 'reply' | 'repost' | 'quote-tweet';
  text?: string; // for reply or quote-tweet — the text we'd post
  rationale: string; // why we're drafting this
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

function saveState(state: State) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

// ─── Bluesky auth ─────────────────────────────────────────────────────────

async function createAgent(): Promise<AtpAgent> {
  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) {
    throw new Error(
      'BLUESKY_HANDLE and BLUESKY_APP_PASSWORD must be set in .env',
    );
  }
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: BLUESKY_HANDLE,
    password: BLUESKY_APP_PASSWORD,
  });
  return agent;
}

// ─── Candidate fetching ───────────────────────────────────────────────────

async function resolveHandleToDid(
  agent: AtpAgent,
  handle: string,
): Promise<string | null> {
  try {
    const res = await agent.com.atproto.identity.resolveHandle({ handle });
    return res.data.did;
  } catch {
    return null;
  }
}

async function fetchAuthorRecent(
  agent: AtpAgent,
  handle: string,
  sinceMs: number,
  limit = 30,
): Promise<any[]> {
  try {
    const res = await agent.getAuthorFeed({ actor: handle, limit });
    const items = res.data.feed || [];
    return items.filter((item: any) => {
      const createdAt = item.post?.record?.createdAt;
      if (!createdAt) return false;
      return new Date(createdAt).getTime() >= sinceMs;
    });
  } catch (e: any) {
    const msg = e?.message || String(e);
    // Only noisy for unexpected errors; expected ones (NotFound, rate limit) are silent
    if (!/not.*found|rate|resolve/i.test(msg)) {
      console.warn(`  [fetch] @${handle}: ${msg.slice(0, 100)}`);
    }
    return [];
  }
}

async function fetchHashtagFeed(
  agent: AtpAgent,
  tag: string,
  sinceMs: number,
  limit = 40,
): Promise<any[]> {
  // AT Protocol search for hashtag
  try {
    const res = await agent.app.bsky.feed.searchPosts({
      q: `#${tag}`,
      limit,
      sort: 'latest',
    });
    return (res.data.posts || []).filter((post: any) => {
      const createdAt = post?.record?.createdAt;
      if (!createdAt) return false;
      return new Date(createdAt).getTime() >= sinceMs;
    });
  } catch (e: any) {
    console.warn(
      `  [fetch] hashtag #${tag}: ${(e?.message || String(e)).slice(0, 100)}`,
    );
    return [];
  }
}

// ─── Scoring + filtering ──────────────────────────────────────────────────

function matchAnyKeyword(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  return keywords.filter((k) => lower.includes(k.toLowerCase()));
}

function hasSkipKeyword(text: string, skipKeywords: string[]): boolean {
  const lower = text.toLowerCase();
  return skipKeywords.some((k) => lower.includes(k.toLowerCase()));
}

function scoreCandidate(
  c: Partial<Candidate> & { text: string; authorWeight: number; matchedKeywords: string[] },
): number {
  // Author weight dominates; keyword matches give a smaller boost; engagement
  // gives a third smaller boost (we don't want to only reply to viral posts).
  const keywordBonus = c.matchedKeywords.length * 2;
  const engagementBonus = Math.min(
    Math.log2((c.likeCount ?? 0) + (c.repostCount ?? 0) + 1) * 0.5,
    5,
  );
  return c.authorWeight + keywordBonus + engagementBonus;
}

// ─── Draft generation ─────────────────────────────────────────────────────

function extractFacts(
  text: string,
  keywords: string[],
): { billMentions: string[]; mpMentions: string[]; voteMentions: string[] } {
  const billMatches = Array.from(
    text.matchAll(/\bbill\s+([CSBc][-\s]?\d{1,3}[A-Za-z]?)\b/gi),
  );
  const bills = [...new Set(billMatches.map((m) => `C-${m[1].replace(/^[CSBc][-\s]?/, '')}`))];
  const voteMatches = text.match(/\b\d+[–-]\d+\b/g) || [];
  const mps: string[] = []; // a future pass can cross-reference our news-articles tags
  return { billMentions: bills, mpMentions: mps, voteMentions: voteMatches };
}

function draftReply(c: Candidate, facts: ReturnType<typeof extractFacts>): Draft {
  // Very conservative template. Human review is expected to rewrite or reject.
  // The goal: give the reviewer a starting point, not a publishable tweet.
  const facts_parts: string[] = [];
  if (facts.billMentions.length > 0) {
    facts_parts.push(`Hansard record for ${facts.billMentions[0]}`);
  }
  if (facts.voteMentions.length > 0) {
    facts_parts.push(`vote split of ${facts.voteMentions[0]}`);
  }

  // If we can't anchor on a specific fact, recommend a repost over a reply.
  if (facts_parts.length === 0) {
    return {
      action: 'repost',
      rationale: `Fact-based post from @${c.authorHandle} (${c.authorRole}) — no specific fact to augment. Consider reposting to amplify the primary source.`,
    };
  }

  return {
    action: 'reply',
    text: `The record on ${facts_parts.join(' + ')}: [ADD FACTUAL NOTE — e.g. who voted how, Hansard date, direct quote].\n\nOur fuller breakdown: parliamentaudit.ca/news/[SLUG]?utm_source=bluesky&utm_medium=social&utm_campaign=reply`,
    rationale: `Mentions ${facts_parts.join(', ')}. Reviewer: pick the specific Hansard / vote fact to add, and choose the article slug that best matches.`,
  };
}

function draftAmplification(c: Candidate, facts: ReturnType<typeof extractFacts>): Draft {
  return {
    action: 'repost',
    rationale: `${c.authorRole === 'primary_source' ? 'Primary source' : 'Trusted observer'} (@${c.authorHandle}) with a fact-based post. Safe to repost as-is.`,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('[social-brief] Loading watchlist + state…');
  const watchlist: Watchlist = JSON.parse(readFileSync(WATCHLIST_PATH, 'utf8'));
  const state = loadState();
  const alreadyDrafted = new Set(state.processedPostUris);
  const alreadyExecuted = new Set(state.executedPostUris);

  const sinceMs = Date.now() - HOURS * 3600 * 1000;

  console.log('[social-brief] Authenticating to Bluesky…');
  const agent = await createAgent();

  // Build a flat list of watched entries with their role for labelling
  const watchedEntries: Array<WatchlistEntry & { role: string }> = [
    ...watchlist.journalists.map((e) => ({ ...e, role: 'journalist' })),
    ...watchlist.mps_leaders.map((e) => ({ ...e, role: 'mp_leader' })),
    ...watchlist.parties.map((e) => ({ ...e, role: 'party' })),
    ...watchlist.advocacy_watchdogs.map((e) => ({ ...e, role: 'watchdog' })),
    ...watchlist.primary_sources.map((e) => ({ ...e, role: 'primary_source' })),
  ];

  console.log(
    `[social-brief] Fetching last ${HOURS}h of posts from ${watchedEntries.length} watched accounts…`,
  );

  const allCandidates: Candidate[] = [];
  let resolveFailures = 0;

  for (const entry of watchedEntries) {
    const items = await fetchAuthorRecent(agent, entry.handle, sinceMs, 15);
    if (items.length === 0 && entry.resolveable) {
      const did = await resolveHandleToDid(agent, entry.handle);
      if (!did) {
        resolveFailures += 1;
        continue;
      }
    }
    for (const item of items) {
      const post = item.post;
      if (!post?.record?.text) continue;
      const text: string = post.record.text;
      if (hasSkipKeyword(text, watchlist.keywords_skip)) continue;
      if (text.length < 20) continue; // too short to anchor a meaningful reply
      if (alreadyDrafted.has(post.uri) || alreadyExecuted.has(post.uri)) continue;

      const matched = matchAnyKeyword(text, watchlist.keywords_positive);
      const candidate: Candidate = {
        uri: post.uri,
        cid: post.cid,
        authorHandle: entry.handle,
        authorName: entry.name,
        authorWeight: entry.weight,
        authorRole: entry.role,
        text,
        createdAt: post.record.createdAt,
        likeCount: post.likeCount,
        repostCount: post.repostCount,
        replyCount: post.replyCount,
        url: `https://bsky.app/profile/${entry.handle}/post/${post.uri
          .split('/')
          .pop()}`,
        matchedKeywords: matched,
        score: 0,
      };
      candidate.score = scoreCandidate(candidate);
      allCandidates.push(candidate);
    }
  }

  // Also pull the hashtag feed
  console.log(`[social-brief] Fetching #${watchlist.hashtags[0]} feed…`);
  for (const tag of watchlist.hashtags.slice(0, 2)) {
    const items = await fetchHashtagFeed(agent, tag, sinceMs, 30);
    for (const post of items) {
      if (!post?.record?.text) continue;
      const text: string = post.record.text;
      if (hasSkipKeyword(text, watchlist.keywords_skip)) continue;
      if (text.length < 20) continue;
      if (alreadyDrafted.has(post.uri) || alreadyExecuted.has(post.uri)) continue;
      if (allCandidates.some((c) => c.uri === post.uri)) continue; // dedupe

      // Skip if author is self
      if (post.author?.handle === process.env.BLUESKY_HANDLE?.replace('@', '')) continue;

      const matched = matchAnyKeyword(text, watchlist.keywords_positive);
      if (matched.length === 0) continue; // no parliamentary signal — drop

      const candidate: Candidate = {
        uri: post.uri,
        cid: post.cid,
        authorHandle: post.author?.handle ?? 'unknown',
        authorName: post.author?.displayName ?? post.author?.handle ?? 'Unknown',
        authorWeight: 4, // unknown authors get a modest baseline
        authorRole: `hashtag:#${tag}`,
        text,
        createdAt: post.record.createdAt,
        likeCount: post.likeCount,
        repostCount: post.repostCount,
        replyCount: post.replyCount,
        url: `https://bsky.app/profile/${post.author?.handle}/post/${post.uri.split('/').pop()}`,
        matchedKeywords: matched,
        score: 0,
      };
      candidate.score = scoreCandidate(candidate);
      allCandidates.push(candidate);
    }
  }

  // Rank and slice
  allCandidates.sort((a, b) => b.score - a.score);
  const selected = allCandidates.slice(0, LIMIT);

  // Generate drafts
  const drafts = selected.map((c) => {
    const facts = extractFacts(c.text, watchlist.keywords_positive);
    if (c.authorRole === 'primary_source' || c.authorRole === 'watchdog') {
      return { candidate: c, draft: draftAmplification(c, facts), facts };
    }
    return { candidate: c, draft: draftReply(c, facts), facts };
  });

  // Write brief
  const today = new Date().toISOString().slice(0, 10);
  const briefPath = join(BRIEFS_DIR, `${today}.md`);
  const lines: string[] = [];
  lines.push(`# Social Brief — ${today}`);
  lines.push('');
  lines.push(
    `_Generated ${new Date().toISOString()} from ${watchedEntries.length} watched accounts + #${watchlist.hashtags[0]}. Window: last ${HOURS}h. Candidates: ${allCandidates.length} pre-rank → ${selected.length} selected._`,
  );
  if (resolveFailures > 0) {
    lines.push('');
    lines.push(
      `> ${resolveFailures} watchlist handles did not resolve on Bluesky (marked \`resolveable: true\` in watchlist.json — confirm and correct).`,
    );
  }
  lines.push('');
  lines.push('**Editorial rules (from `content/voice-playbook.md`):** wire-reporter voice, factual additions only, no BREAKING / exclamations / loaded verbs / rhetorical questions. Every parliamentaudit.ca link carries a UTM tag.');
  lines.push('');
  lines.push('**Process:** for each candidate, check one box. Edit the draft text inline when APPROVE WITH EDITS. Then run `npx tsx scripts/social-brief/execute.ts`.');
  lines.push('');
  lines.push('---');
  lines.push('');

  if (drafts.length === 0) {
    lines.push('_No candidates today. Either the window was quiet or our watchlist needs a refresh._');
  }

  for (const [i, { candidate: c, draft, facts }] of drafts.entries()) {
    lines.push(`## ${i + 1}. [${draft.action.toUpperCase()}] — @${c.authorHandle} (${c.authorName})`);
    lines.push('');
    lines.push(`**Role:** ${c.authorRole} · **Score:** ${c.score.toFixed(1)} · **Engagement:** ${c.likeCount ?? 0}♥ ${c.repostCount ?? 0}↻ ${c.replyCount ?? 0}💬`);
    lines.push('');
    lines.push(`**Posted:** ${c.createdAt} · **Link:** ${c.url}`);
    lines.push('');
    if (c.matchedKeywords.length > 0) {
      lines.push(`**Keywords matched:** ${c.matchedKeywords.join(', ')}`);
      lines.push('');
    }
    if (facts.billMentions.length > 0) lines.push(`**Bills mentioned:** ${facts.billMentions.join(', ')}`);
    if (facts.voteMentions.length > 0) lines.push(`**Vote splits mentioned:** ${facts.voteMentions.join(', ')}`);
    lines.push('');
    lines.push('> ' + c.text.split('\n').join('\n> '));
    lines.push('');
    lines.push(`**Why this is a candidate:** ${draft.rationale}`);
    lines.push('');
    if (draft.action === 'reply' || draft.action === 'quote-tweet') {
      lines.push('**Draft text** (edit in place — the executor reads the text in this code block):');
      lines.push('```');
      lines.push(draft.text || '');
      lines.push('```');
      lines.push('');
    }
    lines.push('- [ ] APPROVE');
    lines.push('- [ ] APPROVE WITH EDITS');
    lines.push('- [ ] REJECT');
    lines.push('');
    lines.push(`<!-- uri: ${c.uri} cid: ${c.cid} -->`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  writeFileSync(briefPath, lines.join('\n'), 'utf8');

  // Mark all these candidates as drafted so we don't redraft tomorrow
  state.lastRun = new Date().toISOString();
  for (const { candidate: c } of drafts) {
    if (!state.processedPostUris.includes(c.uri)) {
      state.processedPostUris.push(c.uri);
    }
  }
  // Keep the state file tidy — trim to last 500 URIs
  if (state.processedPostUris.length > 500) {
    state.processedPostUris = state.processedPostUris.slice(-500);
  }
  saveState(state);

  console.log(`\n[social-brief] Wrote ${briefPath}`);
  console.log(`[social-brief] ${drafts.length} candidates drafted.`);
  console.log('[social-brief] Review the file, mark approvals, then run:');
  console.log('                npx tsx scripts/social-brief/execute.ts');
}

main().catch((e) => {
  console.error('[social-brief] Fatal:', e?.message || e);
  if (e?.stack) console.error(e.stack.slice(0, 1200));
  process.exit(1);
});
