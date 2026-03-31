/**
 * Correction worker — handles the correction.needed queue.
 *
 * When official vote data is updated (e.g., preliminary record replaced
 * by official record, or a correction is published), this service:
 *   1. Compares old and new vote data
 *   2. Creates a correction record
 *   3. Updates the article status to 'correction_pending'
 *   4. Flags the article for re-review
 *   5. Creates an audit trail
 */
import { Worker } from 'bullmq';
import { db, schema } from '@parliament-pulse/db';
import { eq } from 'drizzle-orm';
import { createRedisConnection } from '@parliament-pulse/queue';
import type { CorrectionJob } from '@parliament-pulse/queue';

const connection = createRedisConnection();

const worker = new Worker<CorrectionJob>(
  'correction.needed',
  async (job) => {
    const { voteId, previousDataHash, newDataHash } = job.data;
    console.log(`[correction-worker] Processing correction for vote ${voteId}`);

    // Find the vote
    const vote = await db.query.votes.findFirst({
      where: eq(schema.votes.id, voteId),
    });

    if (!vote) {
      console.warn(`[correction-worker] Vote ${voteId} not found, skipping`);
      return;
    }

    // Find associated published article
    const article = await db.query.articles.findFirst({
      where: eq(schema.articles.voteId, voteId),
    });

    // Create correction record
    const [correction] = await db.insert(schema.corrections).values({
      voteId,
      articleId: article?.id ?? null,
      correctionType: 'data_update',
      description: `Vote data updated. Record status: ${vote.recordStatus}. Previous data hash: ${previousDataHash}, new hash: ${newDataHash}.`,
      oldValues: { hash: previousDataHash },
      newValues: { hash: newDataHash },
      correctedBy: 'system',
      visibleToPublic: true,
    }).returning();

    // If there's a published article, flag it for re-review
    if (article && article.status === 'published') {
      await db
        .update(schema.articles)
        .set({
          status: 'correction_pending',
          updatedAt: new Date(),
        })
        .where(eq(schema.articles.id, article.id));

      console.log(`[correction-worker] Article ${article.id} flagged for correction review`);
    }

    // Audit log
    await db.insert(schema.auditLog).values({
      entityType: 'correction',
      entityId: correction.id,
      action: 'correction_created',
      actor: 'correction-worker',
      details: {
        voteId,
        articleId: article?.id,
        previousDataHash,
        newDataHash,
      },
    });

    console.log(`[correction-worker] Correction ${correction.id} created for vote ${voteId}`);
  },
  {
    connection,
    concurrency: 3,
  }
);

worker.on('completed', (job) => {
  console.log(`[correction-worker] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[correction-worker] Job ${job?.id} failed:`, err.message);
});

console.log('[correction-worker] Correction worker started, listening on correction.needed queue');
