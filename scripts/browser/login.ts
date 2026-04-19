/**
 * One-time login helper. Opens a visible Chrome window, navigates to
 * X (and/or Bluesky), and waits for you to sign in. Detects success
 * automatically and closes the browser.
 *
 * Usage:
 *   npx tsx scripts/browser/login.ts            # both X and Bluesky
 *   npx tsx scripts/browser/login.ts --x        # X only
 *   npx tsx scripts/browser/login.ts --bluesky  # Bluesky only
 *
 * After this runs once, the session persists in .browser-profile/ and
 * subsequent automation runs (upload-x-banner.ts, etc.) work headlessly.
 */

import { openBrowser, isLoggedIn } from './context.js';

const args = process.argv.slice(2);
const onlyX = args.includes('--x');
const onlyBluesky = args.includes('--bluesky');
const doX = onlyBluesky ? false : true;
const doBluesky = onlyX ? false : true;

const MAX_WAIT_MIN = 5;

async function waitUntilLoggedIn(
  page: any,
  host: 'x' | 'bluesky',
  url: string,
  loggedInUrlPattern: RegExp,
): Promise<boolean> {
  console.log(`\n[login] Opening ${host}. Sign in if not already, then this will detect and continue.`);
  await page.goto(url, { waitUntil: 'load' });
  const start = Date.now();
  const maxMs = MAX_WAIT_MIN * 60_000;

  while (Date.now() - start < maxMs) {
    await page.waitForTimeout(2000);
    const u = page.url();
    if (loggedInUrlPattern.test(u)) {
      console.log(`[login] ✓ ${host} logged in (${u}).`);
      return true;
    }
    if (Math.floor((Date.now() - start) / 10_000) % 3 === 0) {
      const remaining = Math.ceil((maxMs - (Date.now() - start)) / 60_000);
      console.log(`[login]   …waiting for ${host} login (${remaining} min remaining). Current URL: ${u}`);
    }
  }
  console.log(`[login] ✗ Timed out waiting for ${host} login.`);
  return false;
}

async function main() {
  const { ctx, page } = await openBrowser({ headless: false });

  try {
    if (doX) {
      const xOk = await isLoggedIn(page, 'x');
      if (xOk) {
        console.log('[login] ✓ X already logged in. Skipping.');
      } else {
        await waitUntilLoggedIn(
          page,
          'x',
          'https://x.com/home',
          /^https:\/\/x\.com\/home(\?|$)/,
        );
      }
    }

    if (doBluesky) {
      const bsOk = await isLoggedIn(page, 'bluesky');
      if (bsOk) {
        console.log('[login] ✓ Bluesky already logged in. Skipping.');
      } else {
        await waitUntilLoggedIn(
          page,
          'bluesky',
          'https://bsky.app/',
          /^https:\/\/bsky\.app\/(?!login|signup)/,
        );
      }
    }

    console.log('\n[login] Done. Profile saved at .browser-profile/');
    console.log('[login] You can now run upload-x-banner.ts, etc. without seeing a window.');
  } finally {
    await page.waitForTimeout(2000);
    await ctx.close();
  }
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
