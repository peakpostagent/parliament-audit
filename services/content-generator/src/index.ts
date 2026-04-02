/**
 * Content Generator Service — Entry Point
 *
 * BullMQ worker that processes vote.ready events.
 * Generates articles and social posts using AI, runs fact-checks,
 * and routes to review queue or auto-publishes based on confidence.
 */

import { Worker } from 'bullmq';
import { db, schema } from '@parliament-audit/db';
import {
  createRedisConnection,
  contentReviewQueue,
  contentApprovedQueue,
  type VoteReadyJob,
} from '@parliament-audit/queue';
import { eq } from 'drizzle-orm';
import { generateArticle } from './chains/article-chain.js';
import { shouldAutoPublish } from './confidence.js';
import type { NormalizedVote, PartyResult, MemberResult, SourceRef } from '@parliament-audit/shared';
import { CHAMBERS } from '@parliament-audit/shared';
import { formatDateTimeET } from '@parliament-audit/shared';

const connection = createRedisConnection();

const worker = new Worker<VoteReadyJob>(
  'vote.ready',
  async (job) => {
    const { voteId } = job.data;
    console.log(`[content-gen] Generating content for vote ${voteId}...`);

    // Load vote data from database
    const vote = await db.query.votes.findFirst({
      where: eq(schema.votes.id, voteId),
      with: {
        partyResults: true,
        memberResults: true,
      },
    });

    if (!vote) {
      throw new Error(`Vote ${voteId} not found in database`);
    }

    // Convert to NormalizedVote format for the generation chain
    const normalizedVote: NormalizedVote = {
      chamber: vote.chamber as 'house' | 'senate',
      parliament: vote.parliament,
      session: vote.session,
      voteNumber: vote.voteNumber,
      voteDate: vote.voteDate,
      voteTime: vote.voteTime,
      subjectText: vote.subjectText,
      billNumber: vote.billNumber,
      billTitle: vote.billTitle,
      billStage: vote.billStage as any,
      voteType: vote.voteType as any,
      motionText: vote.motionText,
      sponsorName: vote.sponsorName,
      sponsorParty: vote.sponsorParty,
      result: vote.result as any,
      yeasTotal: vote.yeasTotal,
      naysTotal: vote.naysTotal,
      pairedTotal: vote.pairedTotal || 0,
      abstentionsTotal: vote.abstentionsTotal || 0,
      partyResults: vote.partyResults as PartyResult[],
      memberResults: vote.memberResults as MemberResult[],
      recordStatus: vote.recordStatus as any,
      sources: [],
      sourceUrl: vote.sourceUrl,
      billUrl: vote.billUrl,
      hansardUrl: vote.hansardUrl,
      journalsUrl: vote.journalsUrl,
      legisinfoUrl: vote.legisinfoUrl,
      sittingNumber: vote.sittingNumber,
      rawXml: null,
    };

    // Run the generation chain
    const result = await generateArticle(normalizedVote);

    // Build sources list
    const sourcesJson = {
      sources: [
        { label: `Official ${CHAMBERS[normalizedVote.chamber].name} recorded division`, url: vote.sourceUrl },
        ...(vote.billUrl ? [{ label: `Bill ${vote.billNumber} page`, url: vote.billUrl }] : []),
        ...(vote.legisinfoUrl ? [{ label: `LEGISinfo — Bill ${vote.billNumber}`, url: vote.legisinfoUrl }] : []),
        ...(vote.hansardUrl ? [{ label: 'Hansard transcript', url: vote.hansardUrl }] : []),
      ],
    };

    // Build verification text
    const verificationText = buildVerificationText(normalizedVote, result.factCheck.passed);

    // Determine status
    const autoPublish = shouldAutoPublish(result.confidence, vote.recordStatus);
    const status = autoPublish ? 'approved' : 'in_review';

    // Store article
    const [article] = await db.insert(schema.articles).values({
      voteId,
      slug: result.article.slug,
      headline: result.article.headline,
      subheadline: result.article.subheadline,
      summary: result.article.summary,
      whatHappened: result.article.whatHappened,
      partyBreakdown: result.article.partyBreakdown,
      whyItMatters: result.article.whyItMatters,
      whatNext: result.article.whatNext,
      factBoxJson: result.article.factBox,
      sourcesJson,
      verificationText,
      status,
      confidenceScore: result.confidence.overall,
      generationModel: result.model,
      generationPromptVersion: result.promptVersion,
      factCheckPassed: result.factCheck.passed,
      factCheckDetails: result.factCheck,
    }).returning();

    // Store social post drafts
    const platforms = ['x', 'facebook', 'instagram', 'threads'] as const;
    for (const platform of platforms) {
      const content = result.social[platform];
      if (!content) continue;

      await db.insert(schema.socialPosts).values({
        articleId: article.id,
        voteId,
        platform,
        captionText: 'text' in content ? content.text : content.caption,
        hashtags: 'hashtags' in content ? content.hashtags : content.firstCommentHashtags,
        linkUrl: `https://parliamentaudit.ca/vote/${result.article.slug}`,
        status: 'draft',
      });
    }

    // Audit log
    await db.insert(schema.auditLog).values({
      entityType: 'article',
      entityId: article.id,
      action: 'created',
      actor: `system:content-gen:${result.model}`,
      details: {
        confidence: result.confidence.overall,
        factCheckPassed: result.factCheck.passed,
        flags: result.confidence.flags,
        autoPublish,
      },
    });

    // Route to appropriate queue
    if (autoPublish) {
      await contentApprovedQueue.add(
        `publish-${article.id}`,
        { articleId: article.id },
        { jobId: `publish-${article.id}` }
      );
      console.log(`[content-gen] Article auto-approved (confidence: ${result.confidence.overall})`);
    } else {
      await contentReviewQueue.add(
        `review-${article.id}`,
        { articleId: article.id, confidence: result.confidence.overall },
        { jobId: `review-${article.id}` }
      );
      console.log(`[content-gen] Article sent to review queue (confidence: ${result.confidence.overall})`);
    }
  },
  {
    connection,
    concurrency: 3,
    limiter: {
      max: 10,
      duration: 60000, // Max 10 AI calls per minute
    },
  }
);

function buildVerificationText(vote: NormalizedVote, factCheckPassed: boolean): string {
  const chamberName = CHAMBERS[vote.chamber].name;
  const now = formatDateTimeET(new Date());

  return `Vote data sourced from the official ${chamberName} recorded division (ourcommons.ca). ` +
    (vote.billNumber ? `Bill information from LEGISinfo (parl.ca). ` : '') +
    `Party breakdown computed from individual member vote records and cross-checked against published totals. ` +
    `Automated fact-check: ${factCheckPassed ? 'Passed' : 'Flagged for review'}. ` +
    `Record status: ${vote.recordStatus === 'official' ? 'Official' : 'Preliminary'}. ` +
    `Last verified: ${now}.`;
}

worker.on('completed', (job) => {
  console.log(`[content-gen] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[content-gen] Job ${job?.id} failed:`, err.message);
});

console.log('════════════════════════════════════════════');
console.log('  Parliament Audit — Content Generator');
console.log('════════════════════════════════════════════');
console.log('[content-gen] Worker started, waiting for jobs...');
