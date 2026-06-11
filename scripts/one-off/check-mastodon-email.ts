/**
 * One-off — check whether the .browser-profile Chrome session is
 * logged into mstdn.ca, and if so, read the account email from the
 * account-settings page. Helps the operator recover the login email
 * (signup may have used a +mastodon gmail alias per
 * scripts/social-brief/mastodon-setup.md step 2).
 *
 * Prints the email to console only — never writes it to a file.
 */
import { openBrowser } from '../browser/context.js';

async function main() {
  const { ctx, page } = await openBrowser({ headless: true });
  try {
    await page.goto('https://mstdn.ca/auth/edit', { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForTimeout(2500);
    const url = page.url();
    if (url.includes('/auth/sign_in')) {
      console.log('[mastodon-email] NOT logged in on mstdn.ca in .browser-profile — redirected to sign-in.');
      await page.screenshot({ path: 'screenshots/mastodon-login-check.png' });
      console.log('[mastodon-email] screenshot: screenshots/mastodon-login-check.png');
      return;
    }
    // Account settings page shows the current email in a labelled field.
    const text = await page.evaluate(() => document.body.innerText.slice(0, 4000));
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    console.log(`[mastodon-email] logged in. Page: ${url}`);
    console.log(`[mastodon-email] first email-looking string on the page: ${emailMatch?.[0] ?? '(none found — check screenshot)'}`);
    await page.screenshot({ path: 'screenshots/mastodon-settings.png' });
    console.log('[mastodon-email] screenshot: screenshots/mastodon-settings.png');
  } finally {
    await ctx.close();
  }
}

main().catch((e) => {
  console.error('err:', e?.message || e);
  process.exit(1);
});
