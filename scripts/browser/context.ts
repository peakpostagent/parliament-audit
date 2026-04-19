/**
 * Shared Playwright context for Parliament Audit browser automation.
 *
 * Uses an isolated profile dir at ./.browser-profile/ so this session
 * doesn't conflict with the claude-browser-mcp dev session sharing
 * its own profile dir. Logins persist across runs.
 *
 * First-run cost: ~30 sec to log into X / Bluesky in the visible window.
 * After that, fully automated.
 */

import { chromium, type BrowserContext, type Page } from 'playwright';
import { resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

export const PROFILE_DIR = resolve(process.cwd(), '.browser-profile');

mkdirSync(PROFILE_DIR, { recursive: true });

export type LaunchOpts = {
  /** Set false for visible window (login flows). Default true. */
  headless?: boolean;
  /** Force a specific channel. Default: 'chrome'. */
  channel?: 'chrome' | 'msedge' | 'chromium';
};

/**
 * Open the persistent browser context. Caller is responsible for `await ctx.close()`.
 */
export async function openBrowser(opts: LaunchOpts = {}): Promise<{
  ctx: BrowserContext;
  page: Page;
}> {
  const ctx = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: opts.headless ?? true,
    channel: opts.channel ?? 'chrome',
    viewport: { width: 1280, height: 800 },
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  return { ctx, page };
}

/**
 * Quick liveness check: are we logged into the given site?
 * Returns true/false based on simple heuristics per host.
 */
export async function isLoggedIn(
  page: Page,
  host: 'x' | 'bluesky',
): Promise<boolean> {
  if (host === 'x') {
    await page.goto('https://x.com/home', { waitUntil: 'load', timeout: 15000 });
    await page.waitForTimeout(2000);
    // Logged-in indicators: "What's happening?" composer or Post sidebar button
    // Logged-out indicators: "Sign up" header, "Log in" button visible
    const composerCount = await page
      .locator('div[aria-label="Post text"], a[data-testid="SideNav_NewTweet_Button"]')
      .count();
    const signupHeader = await page
      .locator('text=/Sign up with Google|New to X\\?/i')
      .count();
    return composerCount > 0 && signupHeader === 0;
  }
  if (host === 'bluesky') {
    await page.goto('https://bsky.app/', { waitUntil: 'load', timeout: 15000 });
    await page.waitForTimeout(2000);
    // Logged-in: "New post" button in sidebar OR avatar in top right
    const newPostBtn = await page
      .locator('button:has-text("New post"), a[aria-label="New post"]')
      .count();
    const signInBtn = await page.locator('a[href="/signin"], text=/Sign in$/i').count();
    return newPostBtn > 0 && signInBtn === 0;
  }
  return false;
}
