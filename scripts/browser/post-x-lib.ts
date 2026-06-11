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
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

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
  /**
   * Optional URL of an image to attach to the post (e.g. our 1200×1200
   * /api/og/feed-card render). When set:
   *   - we download the image to a temp file
   *   - the file gets attached via X compose's hidden file input
   *   - X suppresses the link card so the attached image is the dominant visual
   * If missing/unfetchable, we still post (just text + link card as usual).
   */
  attachImage?: string;
  /**
   * "Sources + full breakdown →" CTA inserted between the body and the URL.
   * Reinforces our transparency brand pillar (every claim has a source).
   * Defaults to true; pass false to skip. Override the text with ctaText.
   * Only added when a URL is also being posted (CTA without a link is just noise).
   */
  appendCta?: boolean;
  ctaText?: string;
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

  // Brand-CTA insertion. Inserted between body and URL when both are
  // present + appendCta isn't explicitly false. Reinforces our "every
  // claim has a source" pillar; nudges click-through to the article
  // where the receipts live.
  const ctaText = opts.ctaText ?? 'Sources + full breakdown →';
  const includeCta = (opts.appendCta ?? true) && !!taggedUrl;
  const finalText = taggedUrl
    ? includeCta
      ? `${opts.text}\n\n${ctaText}\n${taggedUrl}`
      : `${opts.text}\n\n${taggedUrl}`
    : opts.text;

  // Pre-warm OG image — X's link-card crawler gives the OG endpoint
  // ~5 sec to respond. Our /api/og/* routes are lazy-rendered, so a
  // cold-start can return after X's deadline (yields the grey-box card
  // we saw on the Bailey's Law post). We curl the article first to get
  // its og:image, then curl the og:image, both with a short timeout.
  // Failure here is non-fatal; we still post.
  if (taggedUrl) {
    try {
      const articleHtml = await fetch(taggedUrl, {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; ParliamentAuditBot/1.0)',
        },
        signal: AbortSignal.timeout(8000),
      }).then((r) => (r.ok ? r.text() : ''));
      const ogImg = articleHtml.match(/property="og:image"\s+content="([^"]+)"/)?.[1];
      if (ogImg) {
        const ogUrl = ogImg.startsWith('http')
          ? ogImg
          : new URL(ogImg, taggedUrl).toString();
        await fetch(ogUrl, {
          headers: {
            'user-agent': 'Mozilla/5.0 (compatible; ParliamentAuditBot/1.0)',
          },
          signal: AbortSignal.timeout(15000),
        });
        // 800ms settle so the edge cache propagates before X scrapes
        await new Promise((r) => setTimeout(r, 800));
      }
    } catch {
      // Best-effort — don't block the post on a warm-up failure.
    }
  }

  // X counts URL as 23 chars regardless of length (t.co wrapping).
  // CTA adds its full length (no shortening) plus a single newline.
  const ctaOverhead = includeCta ? 1 + ctaText.length : 0;
  const effectiveLen = taggedUrl
    ? opts.text.length + 2 + ctaOverhead + 23
    : opts.text.length;

  if ((opts.enforceCharLimit ?? true) && effectiveLen > 280) {
    throw new Error(
      `postToX: post would be ${effectiveLen} chars effective (X limit 280). Trim text first.`,
    );
  }

  // Pre-fetch the attached image to a temp file (before opening browser
  // so a fetch failure doesn't waste a Chromium spin-up).
  //
  // Accepts either a URL (http/https) OR a local filesystem path. Local
  // paths are useful when a chart PNG exists in apps/web/public/charts/
  // but Railway hasn't deployed it yet — we can still post the X mirror
  // without depending on a public URL.
  let attachPath: string | undefined;
  if (opts.attachImage) {
    try {
      if (!/^https?:\/\//i.test(opts.attachImage)) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const fs = require('node:fs');
        const localResolved = resolve(process.cwd(), opts.attachImage);
        if (!fs.existsSync(localResolved)) {
          throw new Error(`local file not found: ${localResolved}`);
        }
        attachPath = localResolved;
      } else {
        const res = await fetch(opts.attachImage, {
          headers: { 'user-agent': 'ParliamentAuditBot/1.0' },
          signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        const ct = res.headers.get('content-type') || '';
        const ext = /jpeg/.test(ct) ? '.jpg' : /webp/.test(ct) ? '.webp' : '.png';
        const dir = join(tmpdir(), 'parliament-audit-x');
        mkdirSync(dir, { recursive: true });
        attachPath = resolve(dir, `attach-${Date.now()}${ext}`);
        writeFileSync(attachPath, buf);
      }
    } catch (e: any) {
      console.warn(
        `[postToX] attachImage fetch failed (${e?.message || e}); proceeding without attachment.`,
      );
      attachPath = undefined;
    }
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

    // Attach image if requested (after typing so we can see the preview render in tests)
    if (attachPath && existsSync(attachPath)) {
      try {
        // X's compose modal contains a hidden file input. The "Add photos
        // or video" button maps to that input. setInputFiles bypasses the
        // click and shoves the file straight into the input.
        const fileInput = page
          .locator('div[role="dialog"] input[data-testid="fileInput"], input[data-testid="fileInput"]')
          .first();
        await fileInput.setInputFiles(attachPath);
        // X uploads + previews the image. Wait for the preview node to appear.
        await page
          .locator('[data-testid="attachments"] img, div[aria-label*="Image"][role="group"] img')
          .first()
          .waitFor({ state: 'visible', timeout: 25000 });
        // Settle delay so the upload completes server-side before we click Post
        await page.waitForTimeout(2500);
      } catch (e: any) {
        console.warn(
          `[postToX] attach step failed (${e?.message || e}); posting without attachment.`,
        );
        // Continue — post still goes out as text + link card
      }
    }

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
