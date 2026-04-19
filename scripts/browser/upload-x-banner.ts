/**
 * Upload the Parliament Audit banner to X.
 *
 * Requires: scripts/browser/login.ts run once first to establish session.
 *
 * Usage:
 *   npx tsx scripts/browser/upload-x-banner.ts                 # uses docs/banner.png
 *   npx tsx scripts/browser/upload-x-banner.ts --file ./b.png  # custom file
 *   npx tsx scripts/browser/upload-x-banner.ts --headed        # show window
 */

import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { openBrowser, isLoggedIn } from './context.js';

const args = process.argv.slice(2);
const headed = args.includes('--headed');
const fileIdx = args.indexOf('--file');
const filePath = resolve(
  process.cwd(),
  fileIdx !== -1 ? args[fileIdx + 1] : 'docs/banner.png',
);

if (!existsSync(filePath)) {
  console.error(`❌ Banner file not found at ${filePath}`);
  process.exit(1);
}

async function main() {
  console.log(`[x-banner] Banner: ${filePath}`);

  const { ctx, page } = await openBrowser({ headless: !headed });

  try {
    if (!(await isLoggedIn(page, 'x'))) {
      console.error('❌ X is not logged in. Run: npx tsx scripts/browser/login.ts --x');
      process.exit(1);
    }

    console.log('[x-banner] Navigating to ParliamentAudit profile...');
    await page.goto('https://x.com/ParliamentAudit', { waitUntil: 'load' });

    console.log('[x-banner] Clicking Edit profile...');
    await page.locator('a[href="/settings/profile"]').first().click();
    await page.waitForURL('**/settings/profile', { timeout: 15000 });
    await page.waitForTimeout(2000);

    console.log('[x-banner] Setting banner file input...');
    const fileInputs = page.locator('input[type="file"][data-testid="fileInput"]');
    await fileInputs.first().setInputFiles(filePath);

    console.log('[x-banner] Waiting for cropper modal...');
    const applyBtn = page.locator('[data-testid="applyButton"]');
    await applyBtn.waitFor({ state: 'visible', timeout: 10000 });
    await applyBtn.click();
    console.log('[x-banner] Applied crop.');
    await page.waitForTimeout(1500);

    console.log('[x-banner] Saving profile...');
    const saveBtn = page.locator('[data-testid="Profile_Save_Button"]');
    await saveBtn.click();
    await page.waitForTimeout(3000);

    console.log('[x-banner] ✓ Banner uploaded.');
    await page.screenshot({ path: 'screenshots/x-banner-after.png' });
    console.log('[x-banner] Verification screenshot: screenshots/x-banner-after.png');
  } catch (e: any) {
    console.error('[x-banner] ❌ Failed:', e?.message || e);
    try {
      await page.screenshot({ path: 'screenshots/x-banner-error.png' });
      console.error('[x-banner] Error screenshot: screenshots/x-banner-error.png');
    } catch {}
    process.exit(1);
  } finally {
    await page.waitForTimeout(1000);
    await ctx.close();
  }
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
