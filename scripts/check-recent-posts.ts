/**
 * Diagnostic: pull recent posts from @parliamentaudit.bsky.social to figure
 * out whether posts actually shipped vs. only landed in our local logs.
 */

import 'dotenv/config';
import { AtpAgent } from '@atproto/api';

async function main() {
  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) {
    throw new Error('BLUESKY_HANDLE / BLUESKY_APP_PASSWORD missing');
  }
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD });

  console.log(`[check] Authenticated as @${agent.session?.handle}`);
  console.log(`[check] DID: ${agent.session?.did}`);

  // Fetch our own author feed — last 30 posts
  const res = await agent.getAuthorFeed({
    actor: agent.session!.did,
    limit: 30,
    filter: 'posts_and_author_threads',
  });

  console.log(`\n[check] Last ${res.data.feed.length} posts/reposts:`);
  for (const item of res.data.feed) {
    const post = item.post;
    const reason = item.reason;
    const isRepost = reason?.$type === 'app.bsky.feed.defs#reasonRepost';
    const createdAt = (post.record as any)?.createdAt || 'unknown';
    const text = ((post.record as any)?.text || '').slice(0, 100).replace(/\n/g, ' ');
    const indexedAt = post.indexedAt;
    const tag = isRepost ? '↻ REPOST' : (post.author.handle === agent.session?.handle ? '✎ ORIGINAL' : '? OTHER');
    console.log(`  ${createdAt}  ${tag}  by @${post.author.handle}`);
    if (text) console.log(`      "${text}"`);
    if (isRepost) console.log(`      reposted at ${indexedAt}`);
  }

  // Also count by date to see the gap
  const byDay = new Map<string, number>();
  for (const item of res.data.feed) {
    const post = item.post;
    const createdAt = (post.record as any)?.createdAt || item.reason?.indexedAt || post.indexedAt;
    const day = createdAt.slice(0, 10);
    byDay.set(day, (byDay.get(day) || 0) + 1);
  }
  console.log('\n[check] Posts per day:');
  for (const [day, count] of [...byDay.entries()].sort()) {
    console.log(`  ${day}  ${count}`);
  }
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
