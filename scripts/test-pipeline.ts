/**
 * Manual pipeline test — runs a single vote through the full pipeline:
 * fetch → normalize → generate article → store
 *
 * Usage: npx tsx scripts/test-pipeline.ts [voteNumber]
 * Default vote: 93 (Bill C-9, third reading, March 25 2026)
 */

import { db, schema } from '../packages/db/src/client.js';
import { normalizeHouseVote } from '../services/vote-normalizer/src/normalize.js';
import { generateArticle } from '../services/content-generator/src/chains/article-chain.js';
import { shouldAutoPublish } from '../services/content-generator/src/confidence.js';
import { eq, and } from 'drizzle-orm';
import type { NormalizedVote, PartyResult, MemberResult } from '../packages/shared/src/index.js';

const PARLIAMENT = 45;
const SESSION = 1;
const TARGET_VOTE = parseInt(process.argv[2] || '93', 10);

async function run() {
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Parliament Pulse — Pipeline Test (Vote #${TARGET_VOTE})`);
  console.log('═══════════════════════════════════════════════════\n');

  // STEP 1+2: Fetch and normalize via OpenParliament API
  console.log(`[1/5] Fetching vote #${TARGET_VOTE} from OpenParliament API...`);
  console.log('[2/5] Normalizing vote data...');
  const normalized = await normalizeHouseVote({ voteNumber: TARGET_VOTE });
  console.log(`      ✓ Normalized: "${normalized.subjectText.substring(0, 70)}..."`);
  console.log(`      ✓ Result: ${normalized.result.toUpperCase()} (${normalized.yeasTotal} yea / ${normalized.naysTotal} nay)`);
  console.log(`      ✓ Type: ${normalized.voteType}`);
  console.log(`      ✓ Parties: ${normalized.partyResults.map(p => `${p.partyShort}(${p.yeas}Y/${p.nays}N)`).join(', ')}\n`);

  // STEP 3: Store in DB (upsert)
  console.log('[3/5] Storing vote in database...');
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

  for (const party of normalized.partyResults) {
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
    }).onConflictDoUpdate({
      target: [schema.votePartyResults.voteId, schema.votePartyResults.partyShort],
      set: { yeas: party.yeas, nays: party.nays, absent: party.absent },
    });
  }

  for (const member of normalized.memberResults) {
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

  console.log(`      ✓ Vote stored: ${voteRecord.id}`);
  console.log(`      ✓ ${normalized.partyResults.length} party results stored`);
  console.log(`      ✓ ${normalized.memberResults.length} member results stored\n`);

  // STEP 4: Generate article
  console.log('[4/5] Generating article with Claude AI...');
  const normalizedFull: NormalizedVote = {
    ...normalized,
    partyResults: normalized.partyResults as PartyResult[],
    memberResults: normalized.memberResults as MemberResult[],
    sources: [],
    rawXml: null,
  };

  const result = await generateArticle(normalizedFull);
  console.log(`      ✓ Article generated`);
  console.log(`      ✓ Headline: "${result.article.headline}"`);
  console.log(`      ✓ Confidence: ${Math.round(result.confidence.overall * 100)}%`);
  console.log(`      ✓ Fact-check: ${result.factCheck.passed ? 'PASSED' : 'FLAGGED'}`);
  console.log(`      ✓ Slug: ${result.article.slug}`);
  if (result.confidence.flags.length > 0) {
    console.log(`      ⚠ Flags: ${result.confidence.flags.join(', ')}`);
  }
  console.log();

  // STEP 5: Store article
  console.log('[5/5] Storing article...');
  const autoPublish = shouldAutoPublish(result.confidence, voteRecord.recordStatus);

  // Check if article already exists for this vote
  const existing = await db.query.articles.findFirst({
    where: eq(schema.articles.voteId, voteRecord.id),
  });

  let article;
  if (existing) {
    [article] = await db.update(schema.articles).set({
      slug: result.article.slug,
      headline: result.article.headline,
      subheadline: result.article.subheadline,
      summary: result.article.summary,
      whatHappened: result.article.whatHappened,
      partyBreakdown: result.article.partyBreakdown,
      whyItMatters: result.article.whyItMatters,
      whatNext: result.article.whatNext,
      factBoxJson: result.article.factBox,
      sourcesJson: { sources: [{ label: 'Official vote', url: voteRecord.sourceUrl }] },
      verificationText: `Data from ourcommons.ca. Fact-check: ${result.factCheck.passed ? 'Passed' : 'Flagged'}.`,
      status: autoPublish ? 'published' : 'in_review',
      confidenceScore: result.confidence.overall,
      generationModel: result.model,
      generationPromptVersion: result.promptVersion,
      factCheckPassed: result.factCheck.passed,
      factCheckDetails: result.factCheck,
      publishedAt: autoPublish ? new Date() : null,
      updatedAt: new Date(),
    }).where(eq(schema.articles.id, existing.id)).returning();
  } else {
    [article] = await db.insert(schema.articles).values({
      voteId: voteRecord.id,
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
      verificationText: `Vote data sourced from the official House of Commons recorded division. Fact-check: ${result.factCheck.passed ? 'Passed' : 'Flagged'}.`,
      status: autoPublish ? 'published' : 'in_review',
      confidenceScore: result.confidence.overall,
      generationModel: result.model,
      generationPromptVersion: result.promptVersion,
      factCheckPassed: result.factCheck.passed,
      factCheckDetails: result.factCheck,
      publishedAt: autoPublish ? new Date() : null,
    }).returning();
  }

  // Store social posts
  const platforms = ['x', 'facebook', 'instagram', 'threads'] as const;
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
      status: 'draft',
    }).onConflictDoNothing();
  }

  console.log(`      ✓ Article stored: ${article.id}`);
  console.log(`      ✓ Status: ${article.status}`);
  console.log(`      ✓ Social posts stored for: ${platforms.join(', ')}`);
  console.log();

  console.log('═══════════════════════════════════════════════════');
  console.log('  PIPELINE COMPLETE');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Vote:      House Vote #${TARGET_VOTE}`);
  console.log(`  Headline:  ${result.article.headline}`);
  console.log(`  Result:    ${normalized.result.toUpperCase()} (${normalized.yeasTotal}–${normalized.naysTotal})`);
  console.log(`  Confidence:${Math.round(result.confidence.overall * 100)}%`);
  console.log(`  Status:    ${article.status}`);
  if (article.status === 'published') {
    console.log(`  URL:       http://localhost:3333/vote/${result.article.slug}`);
  } else {
    console.log(`  Review at: http://localhost:3001/review/${article.id}`);
  }
  console.log('═══════════════════════════════════════════════════');

  process.exit(0);
}

run().catch((err) => {
  console.error('\n❌ Pipeline failed:', err);
  process.exit(1);
});
