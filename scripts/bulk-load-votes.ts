/**
 * Bulk Vote Loader
 *
 * Runs multiple votes through the full pipeline (fetch → normalize → generate → store).
 * Articles are stored as in_review. Use the admin UI or --approve flag to publish.
 *
 * Usage:
 *   npx tsx scripts/bulk-load-votes.ts 85 90 95 100 105 110
 *   npx tsx scripts/bulk-load-votes.ts --range 80 143
 *   npx tsx scripts/bulk-load-votes.ts --range 80 143 --approve
 */

import { db, schema } from '../packages/db/src/client.js';
import { normalizeHouseVote } from '../services/vote-normalizer/src/normalize.js';
import { generateArticle } from '../services/content-generator/src/chains/article-chain.js';
import { shouldAutoPublish } from '../services/content-generator/src/confidence.js';
import { eq } from 'drizzle-orm';
import type { NormalizedVote, PartyResult, MemberResult } from '../packages/shared/src/index.js';

const args = process.argv.slice(2);

// Parse arguments
let voteNumbers: number[] = [];
let autoApprove = args.includes('--approve');

const rangeIdx = args.indexOf('--range');
if (rangeIdx !== -1) {
  const from = parseInt(args[rangeIdx + 1], 10);
  const to = parseInt(args[rangeIdx + 2], 10);
  for (let i = from; i <= to; i++) voteNumbers.push(i);
} else {
  voteNumbers = args
    .filter(a => !a.startsWith('--'))
    .map(a => parseInt(a, 10))
    .filter(n => !isNaN(n));
}

if (voteNumbers.length === 0) {
  console.error('Usage: npx tsx scripts/bulk-load-votes.ts [voteNumbers...] [--approve]');
  console.error('       npx tsx scripts/bulk-load-votes.ts --range <from> <to> [--approve]');
  process.exit(1);
}

async function processVote(voteNumber: number): Promise<'ok' | 'skip' | 'error'> {
  try {
    // Fetch and normalize
    const normalized = await normalizeHouseVote({ voteNumber });

    // Upsert vote
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

    // Delete ALL existing party results first — avoids stale rows with old party codes (e.g. "BLO" vs "BQ")
    await db.delete(schema.votePartyResults).where(eq(schema.votePartyResults.voteId, voteRecord.id));

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

    // Generate article
    const normalizedFull: NormalizedVote = {
      ...normalized,
      partyResults: normalized.partyResults as PartyResult[],
      memberResults: normalized.memberResults as MemberResult[],
      sources: [],
      rawXml: null,
    };

    const result = await generateArticle(normalizedFull);

    // Determine status: auto-approve flag bypasses normal review routing
    const normalStatus = shouldAutoPublish(result.confidence, voteRecord.recordStatus)
      ? 'published'
      : 'in_review';
    const status = autoApprove ? 'published' : normalStatus;
    const publishedAt = status === 'published' ? new Date() : null;

    // Upsert article
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
        sourcesJson: { sources: [{ label: 'Official vote record', url: voteRecord.sourceUrl }] },
        verificationText: `Vote data sourced from the official House of Commons recorded division. Fact-check: ${result.factCheck.passed ? 'Passed' : 'Flagged'}.`,
        status,
        confidenceScore: result.confidence.overall,
        generationModel: result.model,
        generationPromptVersion: result.promptVersion,
        factCheckPassed: result.factCheck.passed,
        factCheckDetails: result.factCheck,
        publishedAt,
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
        status,
        confidenceScore: result.confidence.overall,
        generationModel: result.model,
        generationPromptVersion: result.promptVersion,
        factCheckPassed: result.factCheck.passed,
        factCheckDetails: result.factCheck,
        publishedAt,
      }).returning();
    }

    // Social posts
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

    return 'ok';
  } catch (err: any) {
    // 404 means vote doesn't exist yet — skip silently
    if (err?.message?.includes('404') || err?.message?.includes('not found')) {
      return 'skip';
    }
    console.error(`  ❌ Vote #${voteNumber} failed: ${err.message}`);
    return 'error';
  }
}

async function run() {
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Parliament Pulse — Bulk Vote Loader`);
  console.log(`  Votes: ${voteNumbers.join(', ')}`);
  console.log(`  Auto-approve: ${autoApprove ? 'YES (will publish immediately)' : 'NO (in_review)'}`);
  console.log('═══════════════════════════════════════════════════════\n');

  const results = { ok: 0, skip: 0, error: 0 };

  for (const voteNumber of voteNumbers) {
    process.stdout.write(`[${voteNumber}] Processing... `);
    const status = await processVote(voteNumber);
    if (status === 'ok') {
      console.log(`✓ done`);
      results.ok++;
    } else if (status === 'skip') {
      console.log(`⊘ skipped (not found)`);
      results.skip++;
    } else {
      results.error++;
    }
    // Brief pause to respect API rate limits
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`  COMPLETE: ${results.ok} loaded, ${results.skip} skipped, ${results.error} errors`);
  console.log(`  Status: ${autoApprove ? 'published' : 'in_review — approve at http://localhost:3001'}`);
  console.log('═══════════════════════════════════════════════════════');

  process.exit(0);
}

run().catch((err) => {
  console.error('\n❌ Bulk load failed:', err);
  process.exit(1);
});
