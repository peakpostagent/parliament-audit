'use server';

import { db, schema } from '@parliament-pulse/db';
import { eq } from 'drizzle-orm';

export async function approveArticle(articleId: string, reviewNotes: string) {
  const now = new Date();

  await db
    .update(schema.articles)
    .set({
      status: 'published',
      reviewedBy: 'editor', // TODO: replace with Clerk user ID when auth is added
      reviewedAt: now,
      reviewNotes: reviewNotes || null,
      publishedAt: now,
      lastVerifiedAt: now,
      updatedAt: now,
    })
    .where(eq(schema.articles.id, articleId));

  // Update associated social posts to ready
  await db
    .update(schema.socialPosts)
    .set({ status: 'ready' })
    .where(eq(schema.socialPosts.articleId, articleId));

  // Audit log
  await db.insert(schema.auditLog).values({
    entityType: 'article',
    entityId: articleId,
    action: 'approved_and_published',
    actor: 'editor',
    details: { reviewNotes },
  });

  return { success: true };
}

export async function requestEdits(articleId: string, reviewNotes: string) {
  await db
    .update(schema.articles)
    .set({
      status: 'draft',
      reviewedBy: 'editor',
      reviewedAt: new Date(),
      reviewNotes,
      updatedAt: new Date(),
    })
    .where(eq(schema.articles.id, articleId));

  await db.insert(schema.auditLog).values({
    entityType: 'article',
    entityId: articleId,
    action: 'edits_requested',
    actor: 'editor',
    details: { reviewNotes },
  });

  return { success: true };
}

export async function rejectArticle(articleId: string, reviewNotes: string) {
  await db
    .update(schema.articles)
    .set({
      status: 'rejected',
      reviewedBy: 'editor',
      reviewedAt: new Date(),
      reviewNotes,
      updatedAt: new Date(),
    })
    .where(eq(schema.articles.id, articleId));

  await db.insert(schema.auditLog).values({
    entityType: 'article',
    entityId: articleId,
    action: 'rejected',
    actor: 'editor',
    details: { reviewNotes },
  });

  return { success: true };
}
