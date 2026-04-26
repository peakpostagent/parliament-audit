/**
 * CLI wrapper around postToX() — post one tweet via the browser path.
 *
 * Usage:
 *   npx tsx scripts/browser/post-one-x.ts \
 *     --text "the post body" \
 *     --slug bill-c225-baileys-law-intimate-partner-violence
 *
 *   --text   required, the body
 *   --slug   optional. Appends a UTM-tagged link to that article.
 *   --url    optional. Override the URL entirely (use instead of --slug).
 */

import 'dotenv/config';
import { postToX } from './post-x-lib.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

const TEXT = arg('text');
const SLUG = arg('slug');
const URL_OVERRIDE = arg('url');

if (!TEXT) {
  console.error('Usage: --text "<body>" [--slug <article-slug> | --url <full-url>]');
  process.exit(1);
}

const NTFY_TOPIC = process.env.NTFY_TOPIC || 'parliamentaudit-posts';

async function notify(title: string, message: string, click?: string) {
  try {
    const headers: Record<string, string> = { Title: title, Tags: 'x_twitter', Priority: '3' };
    if (click) headers.Click = click;
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, { method: 'POST', headers, body: message });
  } catch {
    /* ignore */
  }
}

async function main() {
  const url = URL_OVERRIDE
    ? URL_OVERRIDE
    : SLUG
      ? `https://parliamentaudit.ca/news/${SLUG}`
      : undefined;

  console.log('--- preparing post ---');
  console.log(TEXT);
  if (url) console.log(`URL: ${url}`);
  console.log('---------------------');

  try {
    const res = await postToX({ text: TEXT!, url, utmCampaign: 'one-off-2026-04-26' });
    console.log(`[post] [ok] posted, verify at ${res.profileUrl}`);
    await notify(
      `Test post to X (${SLUG || 'manual'})`,
      TEXT!.split('\n\n')[0].slice(0, 140),
      res.profileUrl,
    );
  } catch (e: any) {
    const msg = (e?.message || String(e)).slice(0, 280);
    console.error(`[post] [fail] ${msg}`);
    await notify('X post FAILED', msg);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
