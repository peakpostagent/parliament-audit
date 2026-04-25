/**
 * Post the four floor-crossing accountability pieces to Bluesky in sequence
 * so each one's link card surfaces the new comparison-style OG image.
 *
 * 30-second spacing so each post's link card is generated cleanly without
 * upstream OG-fetcher race conditions, and so the timeline doesn't burn
 * the whole batch in one second.
 *
 * Each post: ≤280 chars, wire-reporter voice, UTM-tagged URL, ntfy ping.
 */

import 'dotenv/config';
import { AtpAgent, RichText } from '@atproto/api';
import { withUtm } from './utm.js';

const POSTS: Array<{ slug: string; text: string }> = [
  {
    slug: 'marilyn-gladu-byelection-pledge-then-floor-cross',
    // 277 chars without URL; URL counts as a facet, not character total
    text:
      'On January 11, Marilyn Gladu told a local paper that floor-crossing MPs should face automatic byelections — "we deserve a chance to have a redo."\n\nOn April 8, she crossed the floor to the Liberals.\n\nNo byelection.',
  },
  {
    slug: 'matt-jeneroux-resigned-then-crossed-floor',
    text:
      'November 6, 2025: Matt Jeneroux announced his resignation from Parliament, citing family.\n\nFebruary 18, 2026: he kept the seat and crossed to the Liberals.\n\nWithin weeks: Special Advisor to the PM, foreign trips with Carney.',
  },
  {
    slug: 'michael-ma-team-feudalism-then-team-liberal',
    text:
      'December 2, 2025 — in Hansard, Conservative MP Michael Ma called the Liberals "team feudalism."\n\nNine days later he joined them.\n\nHe has admitted he was "truly a Conservative" the night before he crossed.',
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
      Tags: 'floor_crossing,parliament_audit',
      Priority: '3',
    };
    if (click) headers.Click = click;
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers,
      body: message,
    });
  } catch {
    // Telemetry must never break the run.
  }
}

async function fetchOgCard(
  agent: AtpAgent,
  url: string,
): Promise<any | undefined> {
  // Bluesky's link card fetcher uses the page's OG tags. We do nothing here —
  // the embed is built from the URL on Bluesky's end. But we DO upload a
  // thumbnail blob so the card renders quickly.
  try {
    const cardUrl = new URL(url);
    // Get OG image from page
    const html = await fetch(cardUrl).then((r) => r.text());
    const ogImg = html.match(/<meta property="og:image"[^>]*content="([^"]+)"/)?.[1];
    const ogTitle = html.match(/<meta property="og:title"[^>]*content="([^"]+)"/)?.[1] ||
                    html.match(/<title>([^<]+)<\/title>/)?.[1] ||
                    cardUrl.toString();
    const ogDesc = html.match(/<meta property="og:description"[^>]*content="([^"]+)"/)?.[1] || '';
    const decode = (s: string) => s
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    let thumbBlob: any = undefined;
    if (ogImg) {
      // Resolve relative URL against page
      const imgAbs = new URL(ogImg, cardUrl).toString();
      const imgRes = await fetch(imgAbs);
      if (imgRes.ok) {
        const buf = Buffer.from(await imgRes.arrayBuffer());
        const upload = await agent.uploadBlob(buf, {
          encoding: imgRes.headers.get('content-type') || 'image/png',
        });
        thumbBlob = upload.data.blob;
      }
    }

    return {
      $type: 'app.bsky.embed.external',
      external: {
        uri: cardUrl.toString(),
        title: decode(ogTitle).slice(0, 300),
        description: decode(ogDesc).slice(0, 1000),
        ...(thumbBlob ? { thumb: thumbBlob } : {}),
      },
    };
  } catch (e: any) {
    console.warn(`  [og-fetch] ${url}: ${e?.message?.slice(0, 100) || 'err'}`);
    return undefined;
  }
}

async function main() {
  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) {
    throw new Error('BLUESKY_HANDLE / BLUESKY_APP_PASSWORD missing');
  }
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD });
  console.log(`[posts] Authenticated as @${agent.session?.handle}`);

  for (const [i, p] of POSTS.entries()) {
    const articleUrl = `https://parliamentaudit.ca/news/${p.slug}`;
    const taggedUrl = withUtm(articleUrl, {
      source: 'bluesky',
      medium: 'social',
      campaign: 'floor-crossings-comparison-2026-04-24',
    });
    // Bluesky counts URL chars in the 300 limit (no t.co-style shortening).
    // The embed link card carries the navigation, so we omit the URL from
    // the post body and just append the hashtag.
    const fullText = `${p.text}\n\n#cdnpoli`;
    if (fullText.length > 300) {
      console.warn(`[posts] #${i + 1} exceeds 300 chars (${fullText.length}). Aborting this post.`);
      continue;
    }

    console.log(
      `\n[posts] ${i + 1}/4 — ${p.slug}\n  text length: ${fullText.length}\n  embed url: ${taggedUrl}`,
    );
    const rt = new RichText({ text: fullText });
    await rt.detectFacets(agent);

    const embed = await fetchOgCard(agent, taggedUrl);

    const res = await agent.post({
      text: rt.text,
      facets: rt.facets,
      ...(embed ? { embed } : {}),
    });
    console.log(`  [ok] uri: ${res.uri}`);

    // Notify
    const ourHandle = BLUESKY_HANDLE.replace(/^@/, '');
    const rkey = res.uri.split('/').pop();
    const liveUrl = `https://bsky.app/profile/${ourHandle}/post/${rkey}`;
    await notify(
      `Posted: ${p.slug.split('-').slice(0, 2).join(' ')}`,
      p.text.split('\n\n')[0].slice(0, 140),
      liveUrl,
    );

    // 30 sec spacing — except after the last
    if (i < POSTS.length - 1) {
      console.log('  [wait] 30s before next…');
      await new Promise((r) => setTimeout(r, 30_000));
    }
  }

  await notify(
    'Floor-crossings batch complete',
    `4 posts shipped with comparison OG cards.`,
    `https://bsky.app/profile/${BLUESKY_HANDLE.replace(/^@/, '')}`,
  );
  console.log('\n[posts] Done. 4 posts shipped.');
}

main().catch((e) => {
  console.error('[posts] Fatal:', e?.message || e);
  if (e?.stack) console.error(e.stack.slice(0, 800));
  process.exit(1);
});
