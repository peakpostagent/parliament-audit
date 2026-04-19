import { chromium } from 'playwright';
const PROFILE = 'C:/Users/colet/Documents/claude-browser-mcp/profile';
(async () => {
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    headless: true, // headless test - just check login state
    channel: 'chrome',
  });
  const page = ctx.pages()[0] ?? await ctx.newPage();
  await page.goto('https://bsky.app/profile/parliamentaudit.bsky.social', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  // Look for "Edit Profile" button (only visible if logged in as this user)
  const editBtn = await page.locator('text=Edit Profile').count();
  // Also check for sign-in form presence (means logged out)
  const signInForm = await page.locator('text=Sign in').count();
  console.log(JSON.stringify({ editBtn, signInForm, url: page.url() }));
  await page.screenshot({ path: '/tmp/bsky-check.png' });
  await ctx.close();
})().catch(e => { console.error(e.message); process.exit(1); });
