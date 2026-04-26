/**
 * Cross-post the four floor-crossing pieces to X. Same wire-reporter
 * voice as the Bluesky batch, UTM-tagged URLs (utm_source=x), 30-second
 * spacing so X's link-card scraper resolves the comparison OG image
 * cleanly per post. ntfy ping per post + run summary.
 *
 * Mirrors scripts/post-floor-crossing-with-images.ts but for X.
 */

import 'dotenv/config';
import { TwitterApi } from 'twitter-api-v2';
import { withUtm } from './utm.js';

const POSTS: Array<{ slug: string; text: string }> = [
  {
    slug: 'marilyn-gladu-byelection-pledge-then-floor-cross',
    text:
      'On January 11, Marilyn Gladu told a local paper that floor-crossing MPs should face automatic byelections — "we deserve a chance to have a redo."\n\nOn April 8, she crossed the floor to the Liberals.\n\nNo byelection.',
  },
  {
    slug: 'matt-jeneroux-resigned-then-crossed-floor',
    text:
      'Nov 6, 2025: Matt Jeneroux announced his resignation from Parliament, citing family.\n\nFeb 18, 2026: he kept the seat and crossed to the Liberals.\n\nWithin weeks: Special Advisor to the PM, foreign trips with Carney.',
  },
  {
    slug: 'michael-ma-team-feudalism-then-team-liberal',
    text:
      'Dec 2, 2025 — in Hansard, Conservative MP Michael Ma called the Liberals "team feudalism."\n\nNine days later he joined them.\n\nHe has admitted he was "truly a Conservative" the night before he crossed.',
  },
  {
    slug: 'chris-dentremont-deputy-speaker-ethics-complaint',
    text:
      'Chris d’Entremont won Acadie–Annapolis by 533 votes as a Conservative in April 2025.\n\nSix months later, on budget day, he was the first Conservative to join Carney’s Liberals.\n\nDemocracy Watch filed an ethics complaint. The Commissioner declined.',
  },
];

const NTFY_TOPIC = process.env.NTFY_TOPIC || 'parliamentaudit-posts';

async function notify(title: string, message: string, click?: string) {
  try {
    const headers: Record<string, string> = {
      Title: title,
      Tags: 'x_twitter,floor_crossing',
      Priority: '3',
    };
    if (click) headers.Click = click;
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers,
      body: message,
    });
  } catch {
    /* never break the run */
  }
}

async function main() {
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET } = process.env;
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_TOKEN_SECRET) {
    throw new Error('X API creds missing in .env');
  }
  const client = new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_TOKEN_SECRET,
  });
  const rwClient = client.readWrite;

  // Verify creds with a whoami first — fail fast if the keys are dead
  try {
    const me = await rwClient.v2.me();
    console.log(`[posts] X auth OK → @${me.data.username} (${me.data.id})`);
  } catch (e: any) {
    console.error('[posts] X auth failed:', e?.message || e);
    console.error('  Check X_API_KEY / X_API_SECRET / X_ACCESS_TOKEN / X_ACCESS_TOKEN_SECRET in .env');
    process.exit(1);
  }

  const liveUrls: string[] = [];

  for (const [i, p] of POSTS.entries()) {
    const articleUrl = `https://parliamentaudit.ca/news/${p.slug}`;
    const taggedUrl = withUtm(articleUrl, {
      source: 'x',
      medium: 'social',
      campaign: 'floor-crossings-comparison-2026-04-26',
    });

    // X counts the URL as 23 chars (t.co wrapping). Build text + URL inline.
    const fullText = `${p.text}\n\n${taggedUrl}`;
    const xCharCount = p.text.length + 2 + 23; // text + "\n\n" + 23-char wrapped URL
    if (xCharCount > 280) {
      console.warn(`[posts] #${i + 1} would exceed 280 chars on X (${xCharCount}). Skipping.`);
      continue;
    }

    console.log(
      `\n[posts] ${i + 1}/4 — ${p.slug}\n  estimated X chars: ${xCharCount}\n  url: ${taggedUrl}`,
    );

    try {
      const { data: tweet } = await rwClient.v2.tweet(fullText);
      const tweetUrl = `https://x.com/ParliamentAudit/status/${tweet.id}`;
      console.log(`  [ok] ${tweetUrl}`);
      liveUrls.push(tweetUrl);

      await notify(
        `Posted to X: ${p.slug.split('-').slice(0, 3).join(' ')}`,
        p.text.split('\n\n')[0].slice(0, 140),
        tweetUrl,
      );
    } catch (e: any) {
      console.error(`  [fail] ${e?.message || e}`);
      await notify(
        `X post failed: ${p.slug}`,
        e?.message?.slice(0, 200) || 'Unknown error',
      );
    }

    if (i < POSTS.length - 1) {
      console.log('  [wait] 30s before next…');
      await new Promise((r) => setTimeout(r, 30_000));
    }
  }

  await notify(
    `X batch complete: ${liveUrls.length}/${POSTS.length} posted`,
    liveUrls.join('\n'),
    'https://x.com/ParliamentAudit',
  );

  console.log(`\n[posts] Done. Posted ${liveUrls.length} of ${POSTS.length} to X.`);
}

main().catch((e) => {
  console.error('[posts] Fatal:', e?.message || e);
  if (e?.stack) console.error(e.stack.slice(0, 800));
  process.exit(1);
});
