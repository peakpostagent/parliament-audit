/**
 * Publisher service — handles the content.approved queue.
 *
 * When an article is approved (either by auto-publish or editor review),
 * this service:
 *   1. Sets article status to 'published'
 *   2. Sets publishedAt timestamp
 *   3. Enqueues social post jobs
 *   4. Creates an audit log entry
 */
import { Worker } from 'bullmq';
import { db, schema } from '@parliament-audit/db';
import { eq } from 'drizzle-orm';
import { createRedisConnection } from '@parliament-audit/queue';
import type { ContentApprovedJob } from '@parliament-audit/queue';

const connection = createRedisConnection();

const worker = new Worker<ContentApprovedJob>(
  'content.approved',
  async (job) => {
    const { articleId } = job.data;
    console.log(`[publisher] Publishing article ${articleId}`);

    const now = new Date();

    // Update article to published
    const [updated] = await db
      .update(schema.articles)
      .set({
        status: 'published',
        publishedAt: now,
        lastVerifiedAt: now,
        updatedAt: now,
      })
      .where(eq(schema.articles.id, articleId))
      .returning();

    if (!updated) {
      throw new Error(`Article ${articleId} not found`);
    }

    // Update social posts to 'ready' for posting
    await db
      .update(schema.socialPosts)
      .set({ status: 'ready' })
      .where(eq(schema.socialPosts.articleId, articleId));

    // Audit log
    await db.insert(schema.auditLog).values({
      entityType: 'article',
      entityId: articleId,
      action: 'published',
      actor: 'publisher-service',
      details: {
        slug: updated.slug,
        publishedAt: now.toISOString(),
        autoPublished: !updated.reviewedBy,
      },
    });

    console.log(`[publisher] Article published: ${updated.slug}`);

    // TODO: Phase 2 — enqueue social post jobs to social.post queue
    // const socialPosts = await db.query.socialPosts.findMany({
    //   where: eq(schema.socialPosts.articleId, articleId),
    // });
    // for (const post of socialPosts) {
    //   await socialPostQueue.add('post', { postId: post.id, platform: post.platform });
    // }
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on('completed', (job) => {
  console.log(`[publisher] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[publisher] Job ${job?.id} failed:`, err.message);
});

console.log('[publisher] Publisher service started, listening on content.approved queue');
