/**
 * One-shot Playwright script to upload the Parliament Audit banner
 * to both X and Bluesky. Bypasses the MCP because the MCP server is
 * currently wedged (see claude-browser-mcp/bugs/INBOX.md).
 *
 * Reuses the MCP's persistent profile dir so logins are intact:
 *   C:/Users/colet/Documents/claude-browser-mcp/profile/
 *
 * Usage:
 *   npx tsx scripts/upload-banners.ts                # both platforms
 *   npx tsx scripts/upload-banners.ts --x            # X only
 *   npx tsx scripts/upload-banners.ts --bluesky      # Bluesky only
 */

import { chromium, type Page } from 'playwright';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const PROFILE_DIR = 'C:/Users/colet/Documents/claude-browser-mcp/profile';
const BANNER_PATH = resolve(
  process.cwd(),
  'docs/banner.png',
);

const args = process.argv.slice(2);
const onlyX = args.includes('--x');
const onlyBluesky = args.includes('--bluesky');
const doX = onlyBluesky ? false : true;
const doBluesky = onlyX ? false : true;

if (!existsSync(BANNER_PATH)) {
  console.error(`❌ Banner file not found at ${BANNER_PATH}`);
  process.exit(1);
}

async function uploadXBanner(page: Page): Promise<void> {
  console.log('\n[X] Uploading banner to @ParliamentAudit...');
  await page.goto('https://x.com/ParliamentAudit', { waitUntil: 'load' });

  // Click Edit profile
  console.log('[X] Clicking Edit profile...');
  await page.locator('a[href="/settings/profile"]').first().click();
  await page.waitForURL('**/settings/profile', { timeout: 10000 });
  await page.waitForTimeout(1500);

  // The banner file input is the FIRST input[type=file] inside the dialog
  console.log('[X] Setting banner file input...');
  const dialogFileInputs = page.locator(
    '[role="dialog"] input[type="file"][data-testid="fileInput"]',
  );
  await dialogFileInputs.first().setInputFiles(BANNER_PATH);
  await page.waitForTimeout(1500);

  // X opens an "Edit media" cropper modal. Click Apply.
  console.log('[X] Clicking Apply on cropper...');
  const applyButton = page.locator('[role="dialog"] [data-testid="applyButton"]');
  if (await applyButton.count()) {
    await applyButton.click();
    await page.waitForTimeout(1000);
  }

  // Click Save in the Edit profile dialog
  console.log('[X] Clicking Save...');
  await page
    .locator('[role="dialog"] [data-testid="Profile_Save_Button"]')
    .click();
  await page.waitForTimeout(2000);

  console.log('[X] ✓ Banner uploaded.');
  await page.screenshot({ path: 'screenshots/x-banner-after.png' });
}

async function uploadBlueskyBanner(page: Page): Promise<void> {
  console.log('\n[Bluesky] Uploading banner to @parliamentaudit.bsky.social...');
  await page.goto('https://bsky.app/profile/parliamentaudit.bsky.social', {
    waitUntil: 'load',
  });
  await page.waitForTimeout(2000);

  console.log('[Bluesky] Clicking Edit Profile...');
  await page.getByRole('button', { name: /edit profile/i }).click();
  await page.waitForTimeout(1500);

  // Bluesky's profile-edit dialog has an "Add a banner" button that triggers
  // a hidden file input. Find any input[type=file] inside the dialog.
  console.log('[Bluesky] Setting banner file input...');
  const fileInput = page
    .locator('input[type="file"]')
    .filter({ hasNot: page.locator('text=avatar') })
    .first();
  await fileInput.setInputFiles(BANNER_PATH);
  await page.waitForTimeout(2000);

  // Bluesky's cropper has a Done/Save button
  console.log('[Bluesky] Clicking Done on cropper...');
  const doneBtn = page.getByRole('button', { name: /done|save/i }).first();
  if (await doneBtn.count()) {
    await doneBtn.click();
    await page.waitForTimeout(1000);
  }

  // Final Save Changes
  console.log('[Bluesky] Clicking Save Changes...');
  await page.getByRole('button', { name: /save changes/i }).click();
  await page.waitForTimeout(2000);

  console.log('[Bluesky] ✓ Banner uploaded.');
  await page.screenshot({ path: 'screenshots/bluesky-banner-after.png' });
}

async function main() {
  console.log(`Banner: ${BANNER_PATH}`);
  console.log(`Profile: ${PROFILE_DIR}`);

  const ctx = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1280, height: 800 },
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const page = ctx.pages()[0] ?? (await ctx.newPage());

  try {
    if (doX) {
      try {
        await uploadXBanner(page);
      } catch (e: any) {
        console.error(`[X] ❌ Failed: ${e?.message || e}`);
        await page.screenshot({ path: 'screenshots/x-banner-error.png' });
      }
    }

    if (doBluesky) {
      try {
        await uploadBlueskyBanner(page);
      } catch (e: any) {
        console.error(`[Bluesky] ❌ Failed: ${e?.message || e}`);
        await page.screenshot({ path: 'screenshots/bluesky-banner-error.png' });
      }
    }
  } finally {
    console.log('\nDone. Closing browser in 3s...');
    await page.waitForTimeout(3000);
    await ctx.close();
  }
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
