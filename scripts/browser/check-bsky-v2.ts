/**
 * Better Bluesky login detection. The existing isLoggedIn() heuristic
 * looks for a "New post" button that's only on desktop layout. We
 * triangulate instead — check localStorage for an AT Protocol session,
 * check cookies, and check URL after hitting /home (which redirects
 * unauthenticated users to /login).
 */
import { chromium } from 'playwright';
import { resolve } from 'node:path';

const PROFILE_DIR = resolve(process.cwd(), '.browser-profile');

async function main() {
  const ctx = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: true,
    channel: 'chrome',
    viewport: { width: 1280, height: 800 },
  });
  const page = ctx.pages()[0] ?? (await ctx.newPage());

  try {
    // Check 1: cookies
    const cookies = await ctx.cookies(['https://bsky.app']);
    const cookieNames = cookies.map((c) => c.name).sort();

    // Check 2: navigate to /profile — unauthenticated would still load public profile
    // but /home redirects to /login when not logged in.
    await page.goto('https://bsky.app/', { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(2500);
    const rootUrl = page.url();

    // Check 3: inspect localStorage for AT Proto session
    const storageInfo = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      const atpKeys = keys.filter((k) => /atp|bsky|session|agent/i.test(k));
      const agentStorage = localStorage.getItem('BSKY_STORAGE') || localStorage.getItem('agent-storage') || null;
      return {
        localStorageKeys: keys.length,
        atpKeyNames: atpKeys,
        hasAgentStorage: !!agentStorage,
        agentStorageSnippet: agentStorage ? agentStorage.slice(0, 200) : null,
      };
    });

    // Check 4: dom markers
    const domInfo = await page.evaluate(() => {
      return {
        url: location.href,
        hasComposeBtn: !!document.querySelector(
          '[aria-label*="compose" i], [data-testid="composeFAB"], button[data-testid="composePostButton"]',
        ),
        hasSignInBtn: !!document.querySelector('[href="/signin"], a[href="/signup"]'),
        bodyTextSnippet: document.body.innerText.slice(0, 200),
      };
    });

    // Check 5: navigate to /home and see if we stay there
    await page.goto('https://bsky.app/messages', { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(2000);
    const messagesUrl = page.url();

    console.log(JSON.stringify({
      cookieCount: cookies.length,
      cookieNames,
      rootUrl,
      messagesUrl,
      messagesWouldRequireLogin: /login|signin/i.test(messagesUrl),
      ...storageInfo,
      ...domInfo,
    }, null, 2));
  } finally {
    await ctx.close();
  }
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
