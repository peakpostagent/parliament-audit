import 'dotenv/config';
import { AtpAgent } from '@atproto/api';

async function main() {
  const a = new AtpAgent({ service: 'https://bsky.social' });
  await a.login({
    identifier: process.env.BLUESKY_HANDLE!,
    password: process.env.BLUESKY_APP_PASSWORD!,
  });
  const res = await a.getAuthorFeed({
    actor: a.session!.did,
    limit: 15,
    filter: 'posts_no_replies',
  });
  for (const it of res.data.feed || []) {
    if ((it.reason as any)?.$type === 'app.bsky.feed.defs#reasonRepost') continue;
    const r = it.post.record as any;
    console.log(
      `${r.createdAt}  ♥${it.post.likeCount ?? 0} ↻${it.post.repostCount ?? 0}  "${(r.text || '').slice(0, 110).replace(/\n/g, ' | ')}"`,
    );
  }
}
main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
