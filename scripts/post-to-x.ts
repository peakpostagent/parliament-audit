/**
 * Parliament Audit — X (Twitter) Social Post Publisher
 *
 * Posts queued draft social posts to X (Twitter) using the X API v2.
 *
 * Usage:
 *   npx tsx scripts/post-to-x.ts                    # Post all ready X posts (up to --limit)
 *   npx tsx scripts/post-to-x.ts --limit 5          # Post at most 5 tweets
 *   npx tsx scripts/post-to-x.ts --dry-run          # Preview what would be posted, don't send
 *   npx tsx scripts/post-to-x.ts --article <slug>   # Post only for a specific article
 *
 * Requirements:
 *   - X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET in .env
 *   - App must have "Read and Write" OAuth 1.0a permissions (developer.x.com)
 *
 * Called automatically by auto-poll.ts after each newly published article.
 */

import 'dotenv/config';
import { TwitterApi } from 'twitter-api-v2';
import { db, schema } from '../packages/db/src/client.js';
import { eq, and, isNull } from 'drizzle-orm';

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const postLimit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : 3; // Default: 3 per run
const articleIdx = args.indexOf('--article');
const articleSlug = articleIdx !== -1 ? args[articleIdx + 1] : null;

// ─── X Client ─────────────────────────────────────────────────────────────────
function createXClient(): TwitterApi {
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET } = process.env;

  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_TOKEN_SECRET) {
    console.error('❌ Missing X API credentials in .env');
    console.error('   Set: X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET');
    console.error('   Get them at: developer.x.com → Projects & Apps → Keys and Tokens');
    process.exit(1);
  }

  return new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_TOKEN_SECRET,
  });
}

// ─── Build tweet text ─────────────────────────────────────────────────────────
function buildTweetText(post: {
  captionText: string;
  hashtags: string[] | null;
  linkUrl: string | null;
}): string {
  let text = post.captionText.trim();

  // Append hashtags if not already in caption
  const hashtags = (post.hashtags ?? [])
    .map(h => (h.startsWith('#') ? h : `#${h}`))
    .filter(h => !text.includes(h));

  if (hashtags.length > 0) {
    text = `${text}\n\n${hashtags.join(' ')}`;
  }

  // Append link if not already in caption
  if (post.linkUrl && !text.includes(post.linkUrl)) {
    text = `${text}\n\n${post.linkUrl}`;
  }

  // X truncates at 280 chars. The link counts as 23 chars (t.co).
  // We stay under by trimming caption if needed.
  const LINK_LENGTH = 23;
  const hashtagPart = hashtags.length > 0 ? `\n\n${hashtags.join(' ')}` : '';
  const linkPart = post.linkUrl ? `\n\n${'x'.repeat(LINK_LENGTH)}` : '';
  const maxCaption = 280 - hashtagPart.length - linkPart.length;

  if (post.captionText.length > maxCaption) {
    text = post.captionText.substring(0, maxCaption - 1) + '…';
    if (hashtags.length > 0) text += hashtagPart;
    if (post.linkUrl) text += `\n\n${post.linkUrl}`;
  }

  return text;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n[post-to-x] Parliament Audit — X Publisher`);
  if (isDryRun) console.log('[post-to-x] DRY RUN — previewing only, not posting');

  // Fetch pending X posts
  const pendingPosts = await db.query.socialPosts.findMany({
    where: and(
      eq(schema.socialPosts.platform, 'x'),
      eq(schema.socialPosts.status, 'draft'),
      isNull(schema.socialPosts.postedAt),
    ),
    with: {
      article: {
        columns: {
          slug: true,
          headline: true,
          status: true,
        },
      },
    },
    limit: postLimit * 3, // Fetch extra so we can filter by published status
    orderBy: schema.socialPosts.createdAt,
  });

  // Only post for published articles
  let eligible = pendingPosts.filter(p => p.article?.status === 'published');

  // Filter by article slug if requested
  if (articleSlug) {
    eligible = eligible.filter(p => p.article?.slug === articleSlug);
  }

  // Apply limit
  const toPost = eligible.slice(0, postLimit);

  if (toPost.length === 0) {
    console.log('[post-to-x] No pending X posts found. Exiting.\n');
    process.exit(0);
  }

  console.log(`[post-to-x] ${eligible.length} pending post(s), posting up to ${postLimit}`);

  if (isDryRun) {
    console.log('\n── PREVIEW ─────────────────────────────────────────────\n');
    for (const post of toPost) {
      const tweetText = buildTweetText(post);
      console.log(`Article: ${post.article?.headline}`);
      console.log(`Tweet (${tweetText.length} chars):\n`);
      console.log(tweetText);
      console.log('\n─────────────────────────────────────────────────────\n');
    }
    process.exit(0);
  }

  const client = createXClient();
  const rwClient = client.readWrite;

  let posted = 0;
  let failed = 0;

  for (const post of toPost) {
    const tweetText = buildTweetText(post);

    try {
      console.log(`[post-to-x] Posting: "${post.article?.headline?.substring(0, 60)}..."`);

      const { data: tweet } = await rwClient.v2.tweet(tweetText);

      // Mark as posted in DB
      await db
        .update(schema.socialPosts)
        .set({
          status: 'posted',
          postedAt: new Date(),
          platformPostId: tweet.id,
        })
        .where(eq(schema.socialPosts.id, post.id));

      console.log(`[post-to-x] ✓ Posted — tweet ID: ${tweet.id}`);
      console.log(`[post-to-x]   https://x.com/parliamentaudit/status/${tweet.id}`);
      posted++;

      // X API rate limit: 17 tweets per 15min on Basic tier, 100/24h free tier
      // 30s pause keeps us well within limits
      if (toPost.indexOf(post) < toPost.length - 1) {
        await new Promise(r => setTimeout(r, 30_000));
      }
    } catch (err: any) {
      const errMsg = err?.data?.detail || err?.message || String(err);
      console.error(`[post-to-x] ❌ Failed to post for "${post.article?.slug}": ${errMsg}`);

      // Mark as failed so we can retry later
      await db
        .update(schema.socialPosts)
        .set({ status: 'failed' })
        .where(eq(schema.socialPosts.id, post.id));

      failed++;

      // Stop on rate limit errors
      if (errMsg.includes('429') || errMsg.toLowerCase().includes('rate limit')) {
        console.error('[post-to-x] Rate limit hit — stopping. Will retry next run.');
        break;
      }
    }
  }

  console.log(`\n[post-to-x] Done — posted: ${posted}, failed: ${failed}, remaining: ${eligible.length - posted}\n`);
  process.exit(0);
}

main().catch(err => {
  console.error('[post-to-x] Fatal:', err);
  process.exit(1);
});
