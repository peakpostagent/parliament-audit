/**
 * Post the four floor-crossing pieces to X via the logged-in browser
 * session at .browser-profile/. Used because we don't have working X API
 * credentials yet — this is the same approach that worked for the
 * original 12 scheduled tweets in April.
 *
 * Replaces nothing — this is a one-off cross-post to bring X parity with
 * the Bluesky activity that's been live since the comparison-card batch
 * shipped.
 *
 * 30-second spacing so X's link-card scraper resolves the OG image
 * cleanly per post. ntfy ping per post + run summary.
 */

import 'dotenv/config';
import { openBrowser, isLoggedIn } from './context.js';
import { withUtm } from '../utm.js';

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
    /* never break run */
  }
}

async function main() {
  const { ctx, page } = await openBrowser({ headless: true });

  // Confirm login first — fail fast if profile expired
  const loggedIn = await isLoggedIn(page, 'x');
  if (!loggedIn) {
    console.error(
      '[posts] Not logged into X in .browser-profile/. Run scripts/browser/login-x.ts first.',
    );
    await ctx.close();
    process.exit(1);
  }
  console.log('[posts] X session OK in .browser-profile/');

  let posted = 0;
  let failed = 0;
  const liveUrls: string[] = [];

  for (const [i, p] of POSTS.entries()) {
    const articleUrl = `https://parliamentaudit.ca/news/${p.slug}`;
    const taggedUrl = withUtm(articleUrl, {
      source: 'x',
      medium: 'social',
      campaign: 'floor-crossings-comparison-2026-04-26',
    });
    const fullText = `${p.text}\n\n${taggedUrl}`;

    console.log(`\n[posts] ${i + 1}/4 — ${p.slug}`);
    console.log(`  text length: ${fullText.length} (X counts URL as 23 — effective ~${p.text.length + 25})`);

    try {
      // Open the compose modal
      await page.goto('https://x.com/compose/post', {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
      });
      await page.waitForTimeout(1500);

      // X's compose textarea
      const textarea = page.locator('div[role="dialog"] div[role="textbox"], div[data-testid="tweetTextarea_0"]').first();
      await textarea.waitFor({ state: 'visible', timeout: 10000 });
      await textarea.click();
      await page.waitForTimeout(300);

      // Use keyboard to type — paste-via-clipboard would need permissions
      await page.keyboard.type(fullText, { delay: 4 });
      await page.waitForTimeout(1500); // let link card scrape

      // Find and click the Post button — within the dialog
      const postBtn = page
        .locator('div[role="dialog"] button[data-testid="tweetButton"], button[data-testid="tweetButtonInline"]')
        .first();
      await postBtn.waitFor({ state: 'visible', timeout: 8000 });

      // Wait for it to be enabled (X disables it briefly after typing)
      const start = Date.now();
      while (Date.now() - start < 8000) {
        const disabled = await postBtn.getAttribute('aria-disabled');
        if (disabled !== 'true') break;
        await page.waitForTimeout(200);
      }

      await postBtn.click();
      await page.waitForTimeout(3000);

      // Verify by checking the URL changed away from /compose/post
      // (it goes to /home or back to the page we were on)
      const url = page.url();
      if (/\/compose\/post/.test(url)) {
        // Maybe a confirmation dialog or error — pause then retry close
        const errorBanner = await page.locator('text=/something went wrong/i').count();
        if (errorBanner > 0) throw new Error('X reported "something went wrong"');
        throw new Error(`Post button click did not transition page. Still on ${url}`);
      }

      // We don't easily get the tweet URL from the UI without scraping
      // the user's profile. Use a "we just posted" landing URL.
      const profileUrl = 'https://x.com/ParliamentAudit';
      console.log(`  [ok] posted (verify at ${profileUrl})`);
      posted++;
      liveUrls.push(profileUrl);

      await notify(
        `Posted to X: ${p.slug.split('-').slice(0, 3).join(' ')}`,
        p.text.split('\n\n')[0].slice(0, 140),
        profileUrl,
      );
    } catch (e: any) {
      const msg = e?.message?.slice(0, 200) || String(e).slice(0, 200);
      console.error(`  [fail] ${msg}`);
      failed++;
      await notify(`X post FAILED: ${p.slug}`, msg);
    }

    if (i < POSTS.length - 1) {
      console.log('  [wait] 30s before next…');
      await page.waitForTimeout(30_000);
    }
  }

  await ctx.close();

  await notify(
    `X batch: ${posted}/${POSTS.length} posted`,
    failed > 0
      ? `${failed} failed — check the run log.`
      : 'All four floor-crossing pieces shipped to X with comparison cards.',
    'https://x.com/ParliamentAudit',
  );

  console.log(`\n[posts] Done. Posted ${posted}/${POSTS.length}.`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error('[posts] Fatal:', e?.message || e);
  if (e?.stack) console.error(e.stack.slice(0, 800));
  process.exit(1);
});
