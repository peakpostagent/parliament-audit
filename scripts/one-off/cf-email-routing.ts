/**
 * One-off driver — Cloudflare Email Routing setup for parliamentaudit.ca
 * via the .browser-profile dashboard session. Stepwise: pass a --step
 * so the operator agent can react to screenshots between steps.
 *
 *   --step check     open dash.cloudflare.com, report login state
 *   --step open      navigate to the zone's Email Routing page
 *   --step goto --url <u>   navigate anywhere + screenshot (generic)
 */
import { openBrowser } from '../browser/context.js';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}
const STEP = arg('step') || 'check';
const URL = arg('url');
const HEADED = process.argv.includes('--headed');

/** Wait out a Cloudflare bot-verification interstitial if present. */
async function settleChallenge(page: any) {
  for (let i = 0; i < 10; i++) {
    const t = await page.evaluate(() => document.body.innerText.slice(0, 300));
    if (!/security verification|verify you are not a bot|Just a moment/i.test(t)) return true;
    await page.waitForTimeout(3000);
  }
  return false;
}

async function main() {
  const { ctx, page } = await openBrowser({ headless: !HEADED });
  try {
    if (STEP === 'check') {
      await page.goto('https://dash.cloudflare.com/', { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForTimeout(6000);
      await settleChallenge(page);
      console.log('[cf] url:', page.url());
      const text = await page.evaluate(() => document.body.innerText.slice(0, 1200));
      console.log('[cf] page text head:', text.replace(/\n+/g, ' | ').slice(0, 500));
      await page.screenshot({ path: 'screenshots/cf-dash.png' });
      console.log('[cf] screenshot: screenshots/cf-dash.png');
    } else if (STEP === 'google-sso') {
      await page.goto('https://dash.cloudflare.com/login', { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForTimeout(5000);
      await settleChallenge(page);
      // Click the "Google" SSO button.
      const googleBtn = page.locator('button:has-text("Google"), a:has-text("Google")').first();
      await googleBtn.click({ timeout: 10_000 });
      await page.waitForTimeout(8000);
      // If Google shows an account chooser, pick the first account.
      if (page.url().includes('accounts.google.com')) {
        const acct = page.locator('[data-identifier], li [role="link"]').first();
        try { await acct.click({ timeout: 8000 }); } catch { /* maybe auto-continues */ }
        await page.waitForTimeout(10_000);
      }
      console.log('[cf] url after sso:', page.url());
      const text = await page.evaluate(() => document.body.innerText.slice(0, 800));
      console.log('[cf] page text head:', text.replace(/\n+/g, ' | ').slice(0, 500));
      await page.screenshot({ path: 'screenshots/cf-sso.png' });
      console.log('[cf] screenshot: screenshots/cf-sso.png');
    } else if (STEP === 'sso-continue') {
      // Re-run the SSO flow and click through the Google consent screen.
      await page.goto('https://dash.cloudflare.com/login', { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForTimeout(5000);
      await settleChallenge(page);
      await page.locator('button:has-text("Google"), a:has-text("Google")').first().click({ timeout: 10_000 });
      await page.waitForTimeout(8000);
      if (page.url().includes('accounts.google.com')) {
        const cont = page.locator('button:has-text("Continue"), [role="button"]:has-text("Continue")').first();
        try { await cont.click({ timeout: 10_000 }); } catch { console.log('[cf] no Continue button found'); }
        await page.waitForTimeout(12_000);
      }
      console.log('[cf] url after consent:', page.url());
      const text = await page.evaluate(() => document.body.innerText.slice(0, 1500));
      console.log('[cf] page text head:', text.replace(/\n+/g, ' | ').slice(0, 700));
      await page.screenshot({ path: 'screenshots/cf-after-consent.png' });
      console.log('[cf] screenshot: screenshots/cf-after-consent.png');
    } else if (STEP === 'nav-email') {
      await page.goto('https://dash.cloudflare.com/f05bcfa54fa48e06e3f5ef2cc9ee649b/parliamentaudit.ca', { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForTimeout(6000);
      await settleChallenge(page);
      // Expand the Email section in the zone sidebar, then click Email Routing if present.
      try { await page.locator('nav >> text=Email').first().click({ timeout: 8000 }); } catch {}
      await page.waitForTimeout(2500);
      const routingLink = page.locator('a:has-text("Email Routing")').first();
      const hasRouting = await routingLink.count();
      if (hasRouting) {
        await routingLink.click();
        await page.waitForTimeout(6000);
      }
      console.log('[cf] url:', page.url());
      const text = await page.evaluate(() => document.body.innerText.slice(0, 2500));
      console.log('[cf] page text:', text.replace(/\n+/g, ' | ').slice(0, 1200));
      await page.screenshot({ path: 'screenshots/cf-email-nav.png' });
      console.log('[cf] screenshot: screenshots/cf-email-nav.png');
    } else if (STEP === 'onboard') {
      await page.goto('https://dash.cloudflare.com/f05bcfa54fa48e06e3f5ef2cc9ee649b/email-service/routing', { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForTimeout(6000);
      await settleChallenge(page);
      await page.locator('button:has-text("Onboard Domain"), a:has-text("Onboard Domain")').first().click({ timeout: 15_000 });
      await page.waitForTimeout(5000);
      await page.screenshot({ path: 'screenshots/cf-onboard-1.png' });
      console.log('[cf] after Onboard click — url:', page.url());
      const text1 = await page.evaluate(() => document.body.innerText.slice(0, 2000));
      console.log('[cf] text:', text1.replace(/\n+/g, ' | ').slice(0, 800));
      // If a domain picker appears, choose parliamentaudit.ca.
      const domainOption = page.locator('text=parliamentaudit.ca').first();
      if (await domainOption.count()) {
        await domainOption.click({ timeout: 8000 }).catch(() => {});
        await page.waitForTimeout(3000);
        // Common continue buttons
        for (const label of ['Continue', 'Next', 'Select']) {
          const b = page.locator(`button:has-text("${label}")`).first();
          if (await b.count()) { await b.click({ timeout: 5000 }).catch(() => {}); await page.waitForTimeout(4000); break; }
        }
      }
      await page.screenshot({ path: 'screenshots/cf-onboard-2.png' });
      const text2 = await page.evaluate(() => document.body.innerText.slice(0, 2000));
      console.log('[cf] stage2 url:', page.url());
      console.log('[cf] stage2 text:', text2.replace(/\n+/g, ' | ').slice(0, 800));
    } else if (STEP === 'goto' && URL) {
      await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForTimeout(6000);
      console.log('[cf] url:', page.url());
      const text = await page.evaluate(() => document.body.innerText.slice(0, 1500));
      console.log('[cf] page text head:', text.replace(/\n+/g, ' | ').slice(0, 700));
      await page.screenshot({ path: 'screenshots/cf-step.png' });
      console.log('[cf] screenshot: screenshots/cf-step.png');
    }
  } finally {
    await ctx.close();
  }
}

main().catch((e) => {
  console.error('err:', e?.message || e);
  process.exit(1);
});
