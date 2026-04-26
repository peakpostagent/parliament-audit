/**
 * Reusable browser-based X poster.
 *
 * Single function: postToX({ text, url? }) — composes a tweet via the
 * .browser-profile/ Chrome session and posts it. Returns success or
 * throws with the X error if posting fails.
 *
 * The CLI wrappers (post-one-x.ts, post-floor-crossing-x.ts,
 * mirror-to-x.ts, etc.) all call into this.
 */

import 'dotenv/config';
import { openBrowser, isLoggedIn } from './context.js';
import { withUtm } from '../utm.js';

export interface PostToXOpts {
  /** The body of the tweet. URL gets appended separately. */
  text: string;
  /**
   * Optional URL. If a parliamentaudit.ca URL is passed, it's auto-UTM-tagged
   * with utm_source=x. Other hosts are left alone. Pass undefined for
   * text-only posts.
   */
  url?: string;
  /** UTM campaign override; default uses ISO week. */
  utmCampaign?: string;
  /** If true (default), enforce X's 280-char effective limit before posting. */
  enforceCharLimit?: boolean;
  /**
   * Optional headless override. Defaults true. Set false if you want to
   * watch the post happen in a visible window for debugging.
   */
  headless?: boolean;
}

export interface PostToXResult {
  ok: true;
  /** Best-guess URL where the post will appear (we can't reliably extract the tweet ID from the UI). */
  profileUrl: string;
  /** The exact text that was sent, including any appended URL. */
  finalText: string;
}

const PROFILE_URL = 'https://x.com/ParliamentAudit';

export async function postToX(opts: PostToXOpts): Promise<PostToXResult> {
  if (!opts.text || !opts.text.trim()) {
    throw new Error('postToX: text is required');
  }

  const taggedUrl = opts.url
    ? withUtm(opts.url, {
        source: 'x',
        medium: 'social',
        campaign: opts.utmCampaign,
      })
    : undefined;

  const finalText = taggedUrl ? `${opts.text}\n\n${taggedUrl}` : opts.text;

  // X counts URL as 23 chars regardless of length (t.co wrapping).
  const effectiveLen = taggedUrl
    ? opts.text.length + 2 + 23
    : opts.text.length;

  if ((opts.enforceCharLimit ?? true) && effectiveLen > 280) {
    throw new Error(
      `postToX: post would be ${effectiveLen} chars effective (X limit 280). Trim text first.`,
    );
  }

  const { ctx, page } = await openBrowser({ headless: opts.headless ?? true });

  try {
    const loggedIn = await isLoggedIn(page, 'x');
    if (!loggedIn) {
      throw new Error(
        'Not logged into X in .browser-profile/. Run scripts/browser/login-x.ts first.',
      );
    }

    await page.goto('https://x.com/compose/post', {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });
    await page.waitForTimeout(1500);

    const textarea = page
      .locator(
        'div[role="dialog"] div[role="textbox"], div[data-testid="tweetTextarea_0"]',
      )
      .first();
    await textarea.waitFor({ state: 'visible', timeout: 10000 });
    await textarea.click();
    await page.waitForTimeout(300);
    await page.keyboard.type(finalText, { delay: 4 });
    await page.waitForTimeout(1500); // let link card scrape

    const postBtn = page
      .locator(
        'div[role="dialog"] button[data-testid="tweetButton"], button[data-testid="tweetButtonInline"]',
      )
      .first();
    await postBtn.waitFor({ state: 'visible', timeout: 8000 });

    // Wait for it to enable (X disables briefly after typing)
    const start = Date.now();
    while (Date.now() - start < 8000) {
      const disabled = await postBtn.getAttribute('aria-disabled');
      if (disabled !== 'true') break;
      await page.waitForTimeout(200);
    }

    await postBtn.click();
    await page.waitForTimeout(3500);

    const after = page.url();
    if (/\/compose\/post/.test(after)) {
      const errBanner = await page
        .locator('[role="dialog"] [role="alert"], [data-testid="toast"]')
        .first()
        .textContent()
        .catch(() => null);
      const sawError = errBanner ? errBanner.slice(0, 200) : 'no error banner found';
      throw new Error(
        `Post button click did not transition page. URL still ${after}. ${sawError}`,
      );
    }

    return { ok: true, profileUrl: PROFILE_URL, finalText };
  } finally {
    await ctx.close();
  }
}
