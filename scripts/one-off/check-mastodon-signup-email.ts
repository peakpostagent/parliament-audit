/**
 * One-off — open a mstdn.ca notification email in the logged-in
 * webmail session and expand the recipient details to read the FULL
 * registered address. Prints to console only.
 */
import { openBrowser } from '../browser/context.js';

async function main() {
  const { ctx, page } = await openBrowser({ headless: true });
  try {
    await page.goto('https://mail.google.com/mail/u/0/#search/from%3Amstdn.ca', {
      waitUntil: 'domcontentloaded',
      timeout: 45_000,
    });
    await page.waitForTimeout(6000);
    const rows = page.locator('tr.zA');
    if ((await rows.count()) === 0) {
      console.log('[gmail-probe] no rows');
      return;
    }
    await rows.first().click();
    await page.waitForTimeout(4000);
    // Expand the recipient details dropdown ("to parliamentaudit ▾").
    const caret = page.locator('[aria-label="Show details"], .ajz').first();
    try { await caret.click({ timeout: 5000 }); } catch { /* try alternate */ }
    await page.waitForTimeout(2000);
    const text = await page.evaluate(() => document.body.innerText);
    const addrs = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    const interesting = Array.from(new Set(addrs)).filter(a => !a.includes('mstdn') && !a.includes('google'));
    console.log('[gmail-probe] addresses in expanded details:', interesting.join(' | ') || '(none)');
    await page.screenshot({ path: 'screenshots/gmail-mstdn-details.png' });
    console.log('[gmail-probe] screenshot: screenshots/gmail-mstdn-details.png');
  } finally {
    await ctx.close();
  }
}

main().catch((e) => {
  console.error('err:', e?.message || e);
  process.exit(1);
});
