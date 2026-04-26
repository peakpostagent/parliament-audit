import { openBrowser } from './context.js';

(async () => {
  const { ctx, page } = await openBrowser({ headless: true });
  try {
    await page.goto('https://x.com/ParliamentAudit', { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(3500);
    const posts = await page.locator('article').all();
    console.log(`[verify] Found ${posts.length} <article> elements on profile`);
    for (let i = 0; i < Math.min(5, posts.length); i++) {
      const text = await posts[i].innerText().catch(() => '<error>');
      const first200 = text.slice(0, 220).replace(/\n+/g, ' | ');
      console.log(`\n--- Article ${i + 1} ---`);
      console.log(first200);
    }
  } finally {
    await ctx.close();
  }
})().catch(e => { console.error(e.message); process.exit(1); });
