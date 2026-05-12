/**
 * One-shot probe: show what the auto-amplify trusted handles have
 * actually posted in the last 24h, so we can debug why
 * `auto-amplify --apply` finds 0 candidates. NOT meant to be a
 * cron — adhoc only.
 */
import 'dotenv/config';
import { AtpAgent } from '@atproto/api';

async function main() {
  const handles = [
    '338canada.bsky.social',
    'ourcommons.bsky.social',
    'aaronwherry.bsky.social',
    'althiaraj.bsky.social',
    'rosiebarton.bsky.social',
    'chebert18.bsky.social',
    'stephenmaher.bsky.social',
    'davidakin.bsky.social',
  ];
  const sinceMs = Date.now() - 24 * 3600 * 1000;
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: process.env.BLUESKY_HANDLE!,
    password: process.env.BLUESKY_APP_PASSWORD!,
  });
  for (const h of handles) {
    try {
      const feed = await agent.getAuthorFeed({ actor: h, limit: 8, filter: 'posts_no_replies' });
      const recent = (feed.data.feed || []).filter((it: any) => {
        if ((it.reason as any)?.$type === 'app.bsky.feed.defs#reasonRepost') return false;
        const r = (it.post as any).record;
        if (!r?.text || r.reply) return false;
        return new Date(r.createdAt).getTime() > sinceMs;
      });
      console.log(`\n@${h} — ${recent.length} posts in last 24h`);
      for (const it of recent.slice(0, 3)) {
        const r = (it.post as any).record;
        console.log(`  ${r.createdAt} :: ${r.text.replace(/\n/g, ' ').slice(0, 200)}`);
      }
    } catch (e: any) {
      console.log(`@${h} — error: ${e.message?.slice(0, 100)}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
