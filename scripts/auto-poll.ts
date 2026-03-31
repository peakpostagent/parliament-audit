/**
 * Parliament Pulse — Automated Vote Poller
 *
 * Polls ourcommons.ca for new recorded divisions, runs each new vote through
 * the full pipeline (scrape → normalize → AI article → store), and publishes.
 *
 * Designed to be called by a scheduler every 15 min during sitting hours.
 * Safe to call multiple times — skips votes already in the database.
 *
 * Usage:
 *   npx tsx scripts/auto-poll.ts
 *   npx tsx scripts/auto-poll.ts --force 143    # force re-process a specific vote
 *   npx tsx scripts/auto-poll.ts --dry-run      # detect new votes but don't process
 */

import 'dotenv/config';
import { db, schema } from '../packages/db/src/client.js';
import { normalizeHouseVote } from '../services/vote-normalizer/src/normalize.js';
import { generateArticle } from '../services/content-generator/src/chains/article-chain.js';
import { shouldAutoPublish } from '../services/content-generator/src/confidence.js';
import { eq, and, desc } from 'drizzle-orm';
import { XMLParser } from 'fast-xml-parser';
import { TwitterApi } from 'twitter-api-v2';
import type { NormalizedVote, PartyResult, MemberResult } from '../packages/shared/src/index.js';

const PARLIAMENT = 45;
const SESSION = 1;
const VOTE_LIST_URL = `https://www.ourcommons.ca/Members/en/Votes/XML?parlSession=${PARLIAMENT}-${SESSION}`;

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const forceIdx = args.indexOf('--force');
const forceVote = forceIdx !== -1 ? parseInt(args[forceIdx + 1], 10) : null;

// ─── XML parser ───────────────────────────────────────────────────────────────
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
});

function sanitizeXml(xml: string): string {
  return xml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!--[\s\S]*/g, '')
    .replace(/\r\n/g, '\n')
    .trim();
}

// ─── Fetch vote list from ourcommons.ca XML feed ─────────────────────────────
async function fetchVoteList(): Promise<number[]> {
  const resp = await fetch(VOTE_LIST_URL, {
    headers: {
      'User-Agent': 'ParliamentPulse/1.0 (civic media; contact@parliamentpulse.ca)',
      'Accept': 'application/xml, text/xml',
    },
  });

  if (!resp.ok) throw new Error(`Vote list fetch failed: HTTP ${resp.status}`);

  const raw = await resp.text();
  const xml = sanitizeXml(raw);
  const parsed = xmlParser.parse(xml);

  // Real feed: <ArrayOfVote><Vote><DecisionDivisionNumber>94</DecisionDivisionNumber>...
  const votesNode = parsed?.ArrayOfVote?.Vote
    ?? parsed?.ArrayOfVoteDetails?.VoteDetails
    ?? parsed?.VoteDetails
    ?? [];

  const votesList = Array.isArray(votesNode) ? votesNode : [votesNode];

  return votesList
    .filter((v: any) => v && (v.DecisionDivisionNumber ?? v.VoteNumber))
    .map((v: any) => parseInt(v.DecisionDivisionNumber ?? v.VoteNumber, 10))
    .filter((n: number) => !isNaN(n))
    .sort((a: number, b: number) => a - b);
}

// ─── Get vote numbers already in DB ──────────────────────────────────────────
async function getKnownVoteNumbers(): Promise<Set<number>> {
  const rows = await db
    .select({ voteNumber: schema.votes.voteNumber })
    .from(schema.votes)
    .where(and(
      eq(schema.votes.chamber, 'house'),
      eq(schema.votes.parliament, PARLIAMENT),
      eq(schema.votes.session, SESSION),
    ));
  return new Set(rows.map(r => r.voteNumber));
}

// ─── Full pipeline for one vote ───────────────────────────────────────────────
async function processVote(voteNumber: number): Promise<'published' | 'review' | 'error'> {
  try {
    // 1. Normalize (scrape + classify)
    const normalized = await normalizeHouseVote({ voteNumber });

    // 2. Upsert vote record
    const [voteRecord] = await db
      .insert(schema.votes)
      .values({
        chamber: normalized.chamber,
        parliament: normalized.parliament,
        session: normalized.session,
        voteNumber: normalized.voteNumber,
        voteDate: normalized.voteDate,
        voteTime: normalized.voteTime,
        subjectText: normalized.subjectText,
        billNumber: normalized.billNumber,
        billTitle: normalized.billTitle,
        billStage: normalized.billStage,
        voteType: normalized.voteType,
        motionText: normalized.motionText,
        sponsorName: normalized.sponsorName,
        sponsorParty: normalized.sponsorParty,
        result: normalized.result,
        yeasTotal: normalized.yeasTotal,
        naysTotal: normalized.naysTotal,
        pairedTotal: normalized.pairedTotal,
        abstentionsTotal: normalized.abstentionsTotal,
        recordStatus: normalized.recordStatus,
        sourceUrl: normalized.sourceUrl,
        billUrl: normalized.billUrl,
        hansardUrl: normalized.hansardUrl,
        legisinfoUrl: normalized.legisinfoUrl,
        sittingNumber: normalized.sittingNumber,
        rawXml: null,
      })
      .onConflictDoUpdate({
        target: [schema.votes.chamber, schema.votes.parliament, schema.votes.session, schema.votes.voteNumber],
        set: {
          subjectText: normalized.subjectText,
          result: normalized.result,
          yeasTotal: normalized.yeasTotal,
          naysTotal: normalized.naysTotal,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Delete + reinsert party results (prevents stale party code duplicates)
    await db.delete(schema.votePartyResults)
      .where(eq(schema.votePartyResults.voteId, voteRecord.id));

    for (const party of normalized.partyResults as PartyResult[]) {
      await db.insert(schema.votePartyResults).values({
        voteId: voteRecord.id,
        partyShort: party.partyShort,
        partyName: party.partyName,
        yeas: party.yeas,
        nays: party.nays,
        paired: party.paired,
        abstentions: party.abstentions,
        absent: party.absent,
        caucusSize: party.caucusSize,
      });
    }

    for (const member of normalized.memberResults as MemberResult[]) {
      await db.insert(schema.voteMemberResults).values({
        voteId: voteRecord.id,
        memberName: member.memberName,
        memberId: member.memberId,
        partyShort: member.partyShort,
        constituency: member.constituency,
        province: member.province,
        voteCast: member.voteCast,
      }).onConflictDoNothing();
    }

    // 3. Generate article
    const normalizedFull: NormalizedVote = {
      ...normalized,
      partyResults: normalized.partyResults as PartyResult[],
      memberResults: normalized.memberResults as MemberResult[],
      sources: normalized.sources ?? [],
      rawXml: null,
    };

    const result = await generateArticle(normalizedFull);

    // 4. Determine publication status
    const autoOk = shouldAutoPublish(result.confidence, voteRecord.recordStatus);
    const status = autoOk ? 'published' : 'in_review';
    const publishedAt = autoOk ? new Date() : null;

    // 5. Upsert article
    const existing = await db.query.articles.findFirst({
      where: eq(schema.articles.voteId, voteRecord.id),
    });

    let article;
    const articleData = {
      slug: result.article.slug,
      headline: result.article.headline,
      subheadline: result.article.subheadline,
      summary: result.article.summary,
      whatHappened: result.article.whatHappened,
      partyBreakdown: result.article.partyBreakdown,
      whyItMatters: result.article.whyItMatters,
      whatNext: result.article.whatNext,
      factBoxJson: result.article.factBox,
      sourcesJson: { sources: [{ label: 'Official vote record', url: voteRecord.sourceUrl }] },
      verificationText: `Vote data sourced directly from ourcommons.ca. Fact-check: ${result.factCheck.passed ? 'Passed' : 'Flagged'}.`,
      status,
      confidenceScore: result.confidence.overall,
      generationModel: result.model,
      generationPromptVersion: result.promptVersion,
      factCheckPassed: result.factCheck.passed,
      factCheckDetails: result.factCheck,
      publishedAt,
      updatedAt: new Date(),
    };

    if (existing) {
      [article] = await db.update(schema.articles)
        .set(articleData)
        .where(eq(schema.articles.id, existing.id))
        .returning();
    } else {
      [article] = await db.insert(schema.articles)
        .values({ voteId: voteRecord.id, ...articleData })
        .returning();
    }

    // 6. Upsert social posts
    const platforms = ['x', 'facebook', 'instagram', 'threads'] as const;
    const imageUrl = `https://parliamentpulse.ca/api/og/vote/${result.article.slug}`;
    for (const platform of platforms) {
      const content = result.social[platform];
      if (!content) continue;
      await db.insert(schema.socialPosts).values({
        articleId: article.id,
        voteId: voteRecord.id,
        platform,
        captionText: 'text' in content ? content.text : content.caption,
        hashtags: 'hashtags' in content ? content.hashtags : [],
        linkUrl: `https://parliamentpulse.ca/vote/${result.article.slug}`,
        imageUrl,
        status: 'draft',
      }).onConflictDoNothing();
    }

    // 7. Post to X if auto-published
    if (status === 'published') {
      await postToX(article.id, result.article.slug);
    }

    return status === 'published' ? 'published' : 'review';
  } catch (err: any) {
    console.error(`  ❌ Vote #${voteNumber} error: ${err.message}`);
    return 'error';
  }
}

// ─── X (Twitter) poster ───────────────────────────────────────────────────────
function getXClient(): TwitterApi | null {
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET } = process.env;
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_TOKEN_SECRET) return null;
  return new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_TOKEN_SECRET,
  });
}

async function postToX(articleId: string, articleSlug: string): Promise<void> {
  const xClient = getXClient();
  if (!xClient) {
    console.log('  [x] X credentials not configured — skipping social post');
    return;
  }

  const post = await db.query.socialPosts.findFirst({
    where: and(
      eq(schema.socialPosts.articleId, articleId),
      eq(schema.socialPosts.platform, 'x'),
      eq(schema.socialPosts.status, 'draft'),
    ),
  });

  if (!post) {
    console.log('  [x] No draft X post found for this article');
    return;
  }

  try {
    let tweetText = post.captionText.trim();

    // Append hashtags if not already present
    const hashtags = (post.hashtags ?? [])
      .map((h: string) => (h.startsWith('#') ? h : `#${h}`))
      .filter((h: string) => !tweetText.includes(h));
    if (hashtags.length > 0) tweetText += `\n\n${hashtags.join(' ')}`;

    // Append link if not already present
    const link = post.linkUrl ?? `https://parliamentpulse.ca/vote/${articleSlug}`;
    if (!tweetText.includes(link)) tweetText += `\n\n${link}`;

    const { data: tweet } = await xClient.readWrite.v2.tweet(tweetText);

    await db
      .update(schema.socialPosts)
      .set({ status: 'posted', postedAt: new Date(), platformPostId: tweet.id })
      .where(eq(schema.socialPosts.id, post.id));

    console.log(`  [x] ✓ Posted https://x.com/parliamentpulse/status/${tweet.id}`);
  } catch (err: any) {
    const msg = err?.data?.detail || err?.message || String(err);
    console.error(`  [x] ❌ Post failed: ${msg}`);
    // Mark failed so manual retry is possible
    await db
      .update(schema.socialPosts)
      .set({ status: 'failed' })
      .where(eq(schema.socialPosts.id, post.id));
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const startedAt = new Date();
  console.log(`\n[auto-poll] ${startedAt.toISOString()} — Parliament Pulse vote poller`);

  if (isDryRun) console.log('[auto-poll] DRY RUN — detecting only, no processing');

  // Handle --force mode: re-process a specific vote
  if (forceVote && !isNaN(forceVote)) {
    console.log(`[auto-poll] Force processing vote #${forceVote}...`);
    if (!isDryRun) {
      const outcome = await processVote(forceVote);
      console.log(`[auto-poll] Done: ${outcome}`);
    }
    process.exit(0);
  }

  // Normal mode: detect and process new votes
  let allVoteNumbers: number[];
  try {
    allVoteNumbers = await fetchVoteList();
    console.log(`[auto-poll] ourcommons.ca reports ${allVoteNumbers.length} votes for ${PARLIAMENT}-${SESSION}`);
  } catch (err: any) {
    console.error(`[auto-poll] Failed to fetch vote list: ${err.message}`);
    process.exit(1);
  }

  const knownNumbers = await getKnownVoteNumbers();
  const newNumbers = allVoteNumbers.filter(n => !knownNumbers.has(n));

  console.log(`[auto-poll] DB has ${knownNumbers.size} known votes`);
  console.log(`[auto-poll] ${newNumbers.length} new vote(s) found: ${newNumbers.length > 0 ? newNumbers.join(', ') : 'none'}`);

  if (newNumbers.length === 0) {
    console.log('[auto-poll] Nothing to do. Exiting.\n');
    process.exit(0);
  }

  if (isDryRun) {
    console.log('[auto-poll] Dry run — skipping processing. Exiting.\n');
    process.exit(0);
  }

  // Process new votes oldest-first
  const results = { published: 0, review: 0, error: 0 };

  for (const voteNumber of newNumbers) {
    console.log(`[auto-poll] Processing vote #${voteNumber}...`);
    const outcome = await processVote(voteNumber);
    results[outcome]++;
    console.log(`[auto-poll] Vote #${voteNumber} → ${outcome}`);

    // Brief pause between votes to respect API rate limits
    if (newNumbers.indexOf(voteNumber) < newNumbers.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  const elapsed = ((Date.now() - startedAt.getTime()) / 1000).toFixed(1);
  console.log(`\n[auto-poll] Complete in ${elapsed}s — published: ${results.published}, in_review: ${results.review}, errors: ${results.error}\n`);

  process.exit(0);
}

main().catch(err => {
  console.error('[auto-poll] Fatal:', err);
  process.exit(1);
});
