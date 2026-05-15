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

// --text-file <path> reads the post body from disk (preferred for
// multi-line content where shell quoting is unreliable).
const TEXT_FILE = arg('text-file');
let TEXT = arg('text');
if (TEXT_FILE) {
  // Local-only require — no need to add a top-level fs import.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  TEXT = require('node:fs').readFileSync(TEXT_FILE, 'utf8').trim();
}
const SLUG = arg('slug');
const URL_OVERRIDE = arg('url');
const CAMPAIGN = arg('campaign');
const DRY = process.argv.includes('--dry-run');

// Brand CTA: inserted between body and the embed/hashtag. On Bluesky the
// link card sits *below* the post body, so "Sources + full breakdown →"
// reads as a directive to look at the link card. Configurable via --cta;
// disable with --no-cta. Only added when a URL is present (a CTA without
// a link is just noise).
const CTA_TEXT = arg('cta') ?? 'Sources + full breakdown →';
const SKIP_CTA = process.argv.includes('--no-cta');

// --image <url> attaches an image directly to the post (replaces the
// link card with a 1:1 visual). When set, the URL goes inline in the
// body since Bluesky only allows one embed type at a time. Use this
// for visually-driven angles (per-post variety per voice-playbook §8).
const IMAGE_URL = arg('image');

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

/**
 * Upload an image to Bluesky and return an embed.images structure.
 * Used when --image is set — replaces the link-card embed.
 */
async function fetchImageEmbed(
  agent: AtpAgent,
  imageUrl: string,
  altText: string,
): Promise<any | undefined> {
  try {
    const res = await fetch(imageUrl, {
      headers: { 'user-agent': 'ParliamentAuditBot/1.0' },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) {
      console.warn(`  [image-fetch] ${imageUrl}: HTTP ${res.status}`);
      return undefined;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const upload = await agent.uploadBlob(buf, {
      encoding: res.headers.get('content-type') || 'image/png',
    });
    return {
      $type: 'app.bsky.embed.images',
      images: [
        {
          image: upload.data.blob,
          alt: altText.slice(0, 1000),
        },
      ],
    };
  } catch (e: any) {
    console.warn(`  [image-fetch] ${imageUrl}: ${e?.message?.slice(0, 100) || 'err'}`);
    return undefined;
  }
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
  // URL form depends on attachment mode:
  //   default (link-card)  → full /news/<slug>?utm_... URL inside embed.external
  //                          (URL doesn't count against the 300-char body limit
  //                          since it lives in the embed, not the body)
  //   --image (attached)   → short /n/<slug>?s=bsky URL inlined in the body
  //                          (the redirect server-side re-attaches the
  //                          full UTM tags). Saves ~80 chars.
  let articleUrl: string | undefined;
  let taggedUrl: string | undefined;
  if (URL_OVERRIDE) {
    articleUrl = URL_OVERRIDE;
    taggedUrl = withUtm(URL_OVERRIDE, {
      source: 'bluesky',
      medium: 'social',
      campaign: CAMPAIGN,
    });
  } else if (SLUG) {
    if (IMAGE_URL) {
      // Short form: /n/<slug>?s=bsky. Redirect re-attaches full UTM with
      // a default img-<ISO-week> campaign. Pass --campaign to override
      // via &c= when needed (rarely needed; eats ~10 chars).
      const shortParams = new URLSearchParams({ s: 'bsky' });
      if (CAMPAIGN) shortParams.set('c', CAMPAIGN);
      articleUrl = `https://parliamentaudit.ca/n/${SLUG}?${shortParams.toString()}`;
      taggedUrl = articleUrl;
    } else {
      articleUrl = `https://parliamentaudit.ca/news/${SLUG}`;
      taggedUrl = withUtm(articleUrl, {
        source: 'bluesky',
        medium: 'social',
        campaign: CAMPAIGN,
      });
    }
  }

  // Bluesky 300-char limit. Two modes:
  //   1. Default: embed.external (link card). URL is in the embed, NOT in body.
  //   2. --image: embed.images (attached visual). URL must go inline in body
  //      so readers can click through (no link card to click).
  //
  // CTA insertion logic:
  //   Default mode → CTA before any trailing hashtag (link card sits below).
  //   --image mode → CTA + URL appended at end (mirrors X structure).
  //   --no-cta     → no CTA either way.
  const includeCta = !SKIP_CTA && !!taggedUrl;
  let fullText = TEXT!;

  if (IMAGE_URL && taggedUrl) {
    // --image mode: append CTA + URL inline so the link is clickable
    const hashtagMatch = fullText.match(/(\n+)(#\w[\w\s#]*)$/);
    if (hashtagMatch) {
      const tagPart = hashtagMatch[0];
      const bodyPart = fullText.slice(0, fullText.length - tagPart.length).trimEnd();
      const ctaBlock = includeCta ? `\n\n${CTA_TEXT}\n${taggedUrl}` : `\n\n${taggedUrl}`;
      fullText = `${bodyPart}${ctaBlock}\n\n${tagPart.trimStart()}`;
    } else {
      const ctaBlock = includeCta ? `\n\n${CTA_TEXT}\n${taggedUrl}` : `\n\n${taggedUrl}`;
      fullText = `${fullText.trimEnd()}${ctaBlock}`;
    }
  } else if (includeCta) {
    // Default mode: CTA only (URL handled by link card)
    const hashtagMatch = fullText.match(/(\n+)(#\w[\w\s#]*)$/);
    if (hashtagMatch) {
      const tagPart = hashtagMatch[0];
      const bodyPart = fullText.slice(0, fullText.length - tagPart.length).trimEnd();
      fullText = `${bodyPart}\n\n${CTA_TEXT}\n\n${tagPart.trimStart()}`;
    } else {
      fullText = `${fullText.trimEnd()}\n\n${CTA_TEXT}`;
    }
  }
  console.log(`text length: ${fullText.length} / 300`);
  if (fullText.length > 300) {
    console.error('Aborting: post would exceed 300-char Bluesky limit.');
    process.exit(1);
  }
  if (taggedUrl) console.log(`will link to: ${taggedUrl}`);
  if (IMAGE_URL) console.log(`will attach image: ${IMAGE_URL}`);
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

  // Pick the embed: image attach if --image is set, otherwise link card.
  // Bluesky only allows one embed type per post.
  const embed = IMAGE_URL
    ? await fetchImageEmbed(
        agent,
        IMAGE_URL,
        TEXT!.split('\n\n')[0].slice(0, 200), // first paragraph as alt text
      )
    : taggedUrl
      ? await fetchOgCard(agent, taggedUrl)
      : undefined;

  const res = await agent.post({
    text: rt.text,
    facets: rt.facets,
    ...(embed ? { embed } : {}),
  });

  const ourHandle = (BLUESKY_HANDLE as string).replace(/^@/, '');
  const rkey = res.uri.split('/').pop();
  const liveUrl = `https://bsky.app/profile/${ourHandle}/post/${rkey}`;
  console.log(`[bsky] [submit] returned ok. uri=${res.uri}`);

  // ── Verify-your-work step ───────────────────────────────────────────
  // Bluesky's AT Proto returns a URI on agent.post() success — usually
  // authoritative. But occasional indexing lag, AppView replication, or
  // (rare) silent server rejection means we shouldn't fully trust it.
  // Call getPost on the URI we just got back: if the AppView can serve
  // it, the post is genuinely live. Retry briefly to tolerate ~5s lag.
  let verified = false;
  let lastErr = '';
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const got = await agent.getPostThread({ uri: res.uri, depth: 0 });
      if ((got.data?.thread as any)?.post?.uri === res.uri) {
        verified = true;
        break;
      }
      lastErr = 'getPostThread did not return our post';
    } catch (e: any) {
      lastErr = (e?.message || String(e)).slice(0, 120);
    }
    await new Promise((r) => setTimeout(r, 2500));
  }

  if (verified) {
    console.log(`[bsky] ✓ verified live: ${liveUrl}`);
  } else {
    console.error(
      `[bsky] ⚠ post submitted but NOT verifiable on AppView after 4 attempts. last error: ${lastErr}.`,
    );
    console.error(`[bsky] URI was: ${res.uri} — likely still propagating; check ${liveUrl} manually.`);
  }

  await notify(
    verified ? 'Bluesky posted (verified)' : 'Bluesky posted (verify lag)',
    fullText.split('\n\n')[0].slice(0, 140),
    liveUrl,
  );
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
