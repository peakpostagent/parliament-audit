/**
 * Delete the most recent post on @ParliamentAudit (X / Twitter).
 *
 * Use after a misleading post went out (e.g. wrong image attachment)
 * and the cleanest recovery is delete + repost rather than
 * quote-correct. Always confirm via --apply; defaults to dry-run.
 *
 * Steps:
 *   1. Open the .browser-profile/ session (must be logged in to X).
 *   2. Navigate to https://x.com/ParliamentAudit.
 *   3. Locate the first article in the timeline that is NOT a pinned
 *      post (pinned posts have a "Pinned" header on the article).
 *   4. Click its caret ("..." menu).
 *   5. Click "Delete".
 *   6. Click the confirmation "Delete" in the dialog.
 *
 * Usage:
 *   npx tsx scripts/browser/delete-latest-x.ts            # dry-run, screenshot only
 *   npx tsx scripts/browser/delete-latest-x.ts --apply    # actually delete
 *   npx tsx scripts/browser/delete-latest-x.ts --apply --visible
 */
import 'dotenv/config';
import { openBrowser, isLoggedIn } from './context.js';
import { resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

const APPLY = process.argv.includes('--apply');
const VISIBLE = process.argv.includes('--visible');

async function main() {
  const screenshotsDir = resolve(process.cwd(), 'screenshots');
  mkdirSync(screenshotsDir, { recursive: true });

  const { ctx, page } = await openBrowser({ headless: !VISIBLE });
  try {
    const loggedIn = await isLoggedIn(page, 'x');
    if (!loggedIn) {
      throw new Error('Not logged into X in .browser-profile/. Re-auth required.');
    }

    await page.goto('https://x.com/ParliamentAudit', {
      waitUntil: 'domcontentloaded',
      timeout: 25000,
    });
    await page.waitForTimeout(3000);

    // X timeline structure: <article data-testid="tweet">. The first one
    // is at the top. Pinned posts carry a "Pinned" badge in the
    // socialContext socket. We want the topmost non-pinned article.
    const articles = page.locator('article[data-testid="tweet"]');
    const count = await articles.count();
    if (count === 0) {
      throw new Error('No tweets visible on profile timeline.');
    }
    console.log(`[delete-latest] found ${count} articles in viewport`);

    let targetIdx = -1;
    for (let i = 0; i < count; i++) {
      const art = articles.nth(i);
      const pinnedBadge = await art
        .locator('div[data-testid="socialContext"]')
        .filter({ hasText: /Pinned/i })
        .count();
      if (pinnedBadge === 0) {
        targetIdx = i;
        break;
      }
      console.log(`  - article #${i} is pinned, skipping`);
    }
    if (targetIdx === -1) {
      throw new Error('Could not find any non-pinned article in timeline.');
    }
    console.log(`[delete-latest] target = article #${targetIdx}`);

    const target = articles.nth(targetIdx);
    await target.scrollIntoViewIfNeeded();

    // Snapshot the target's text so we log what we're about to delete
    const previewText = (await target.innerText()).slice(0, 240).replace(/\n+/g, ' | ');
    console.log(`[delete-latest] preview: "${previewText}"`);

    // Pre-screenshot for the record
    await page.screenshot({
      path: resolve(screenshotsDir, `x-pre-delete-${Date.now()}.png`),
    });

    if (!APPLY) {
      console.log('[delete-latest] DRY-RUN — pass --apply to actually delete.');
      return;
    }

    // Click the caret ("...") within the target article
    const caret = target.locator('button[data-testid="caret"]').first();
    await caret.waitFor({ state: 'visible', timeout: 8000 });
    await caret.click();

    // Wait for the dropdown menu, click "Delete"
    const deleteItem = page
      .locator('div[role="menuitem"]')
      .filter({ hasText: /^Delete$/ })
      .first();
    await deleteItem.waitFor({ state: 'visible', timeout: 8000 });
    await deleteItem.click();

    // Confirmation dialog — second "Delete" button
    const confirm = page
      .locator('button[data-testid="confirmationSheetConfirm"]')
      .first();
    await confirm.waitFor({ state: 'visible', timeout: 8000 });
    await confirm.click();

    // Wait for the toast / reload
    await page.waitForTimeout(3500);

    await page.screenshot({
      path: resolve(screenshotsDir, `x-post-delete-${Date.now()}.png`),
    });
    console.log('[delete-latest] ✓ confirmed delete sent. Verify on x.com manually.');
  } finally {
    await ctx.close();
  }
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
