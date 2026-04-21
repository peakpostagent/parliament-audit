import { openBrowser } from './context.js';

(async () => {
  const { ctx, page } = await openBrowser({ headless: true });
  try {
    await page.goto('https://x.com/ParliamentAudit', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    const data = await page.evaluate(() => {
      const articles = document.querySelectorAll('article');
      const out: Array<{ time: string; text: string }> = [];
      articles.forEach((a) => {
        const t = a.querySelector('time')?.getAttribute('datetime') || '';
        const text = (a as HTMLElement).innerText.replace(/\s+/g, ' ').slice(0, 200);
        out.push({ time: t, text });
      });
      return { count: articles.length, out };
    });

    console.log(`Articles rendered: ${data.count}`);
    for (const a of data.out.slice(0, 12)) {
      console.log(`  ${a.time}  ${a.text.slice(0, 140)}`);
    }

    // Also check scheduled queue
    await page.goto('https://x.com/compose/post/unsent/scheduled', { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    const scheduled = await page.evaluate(() => {
      const rows = document.querySelectorAll('[data-testid="Bookmark"], div[role="article"], div[aria-label*="scheduled" i]');
      return { rowCount: rows.length, bodyHead: document.body.innerText.replace(/\s+/g, ' ').slice(0, 800) };
    });
    console.log(`\nScheduled-queue body head:\n${scheduled.bodyHead}`);
  } finally {
    await ctx.close();
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
