/**
 * Post arbitrary text + link card to Bluesky via AT Protocol.
 * Used by the social-brief auto-pipeline AND for one-off article shipments
 * (e.g. a freshly-published news article that isn't in tweet-drafts.md).
 *
 * Usage:
 *   npx tsx scripts/post-arbitrary-bluesky.ts \
 *     --text "Body of the post (no URL — will append a UTM-tagged link)" \
 *     --slug prescribeit-298m-axe-the-fax-shutdown \
 *     --campaign prescribeit-launch-2026-04-29
 *
 *   --text     required
 *   --slug     required if you want a parliamentaudit.ca link card
 *   --url      override slug — paste a full URL
 *   --campaign UTM campaign override (default: ISO week)
 *   --dry-run  preview without posting
 */

import 'dotenv/config';
import { AtpAgent, RichText } from '@atproto/api';
import { withUtm } from './utm.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

const TEXT = arg('text');
const SLUG = arg('slug');
const URL_OVERRIDE = arg('url');
const CAMPAIGN = arg('campaign');
const DRY = process.argv.includes('--dry-run');

if (!TEXT) {
  console.error('Usage: --text "<body>" [--slug <article-slug> | --url <full-url>] [--campaign <name>] [--dry-run]');
  process.exit(1);
}

const NTFY_TOPIC = process.env.NTFY_TOPIC || 'parliamentaudit-posts';
async function notify(title: string, body: string, click?: string) {
  try {
    const headers: Record<string, string> = { Title: title, Tags: 'bluesky', Priority: '3' };
    if (click) headers.Click = click;
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, { method: 'POST', headers, body });
  } catch {}
}

async function fetchOgCard(agent: AtpAgent, url: string): Promise<any | undefined> {
  try {
    const html = await fetch(url, {
      headers: { 'user-agent': 'ParliamentAuditBot/1.0' },
      signal: AbortSignal.timeout(10000),
    }).then((r) => (r.ok ? r.text() : ''));
    const ogImg = html.match(/<meta property="og:image"[^>]*content="([^"]+)"/)?.[1];
    const ogTitle = html.match(/<meta property="og:title"[^>]*content="([^"]+)"/)?.[1] ||
      html.match(/<title>([^<]+)<\/title>/)?.[1] ||
      url;
    const ogDesc = html.match(/<meta property="og:description"[^>]*content="([^"]+)"/)?.[1] || '';
    const decode = (s: string) =>
      s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

    let thumbBlob: any = undefined;
    if (ogImg) {
      const imgAbs = new URL(ogImg, url).toString();
      const imgRes = await fetch(imgAbs, { signal: AbortSignal.timeout(20000) });
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
        uri: url,
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
  const articleUrl = URL_OVERRIDE
    ? URL_OVERRIDE
    : SLUG
      ? `https://parliamentaudit.ca/news/${SLUG}`
      : undefined;
  const taggedUrl = articleUrl
    ? withUtm(articleUrl, {
        source: 'bluesky',
        medium: 'social',
        campaign: CAMPAIGN,
      })
    : undefined;

  // Bluesky 300-char limit. Embed link card carries the URL.
  const fullText = TEXT!;
  console.log(`text length: ${fullText.length} / 300`);
  if (fullText.length > 300) {
    console.error('Aborting: post would exceed 300-char Bluesky limit.');
    process.exit(1);
  }
  if (taggedUrl) console.log(`will attach embed for: ${taggedUrl}`);
  if (DRY) {
    console.log('--- dry run ---');
    console.log(fullText);
    console.log('---');
    return;
  }

  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) throw new Error('Bluesky creds missing');
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD });
  console.log(`[bsky] auth ok as @${agent.session?.handle}`);

  const rt = new RichText({ text: fullText });
  await rt.detectFacets(agent);

  const embed = taggedUrl ? await fetchOgCard(agent, taggedUrl) : undefined;

  const res = await agent.post({
    text: rt.text,
    facets: rt.facets,
    ...(embed ? { embed } : {}),
  });

  const ourHandle = (BLUESKY_HANDLE as string).replace(/^@/, '');
  const rkey = res.uri.split('/').pop();
  const liveUrl = `https://bsky.app/profile/${ourHandle}/post/${rkey}`;
  console.log(`[bsky] [ok] posted: ${liveUrl}`);

  await notify(
    'Bluesky posted',
    fullText.split('\n\n')[0].slice(0, 140),
    liveUrl,
  );
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
