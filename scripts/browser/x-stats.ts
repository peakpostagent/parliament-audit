/**
 * X profile stats via the logged-in .browser-profile/ session.
 * Pulls: follower/following count, post count, recent post engagement.
 */
import { openBrowser, isLoggedIn } from './context.js';

async function main() {
  const { ctx, page } = await openBrowser({ headless: true });
  try {
    if (!(await isLoggedIn(page, 'x'))) {
      console.error('Not logged into X. Run scripts/browser/login-x.ts first.');
      return;
    }
    await page.goto('https://x.com/ParliamentAudit', { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(4000);
    // Scroll to trigger virtual list rendering
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(2000);

    // Note: pass page.evaluate a plain function-string to avoid tsx
    // injecting helper polyfills (__name etc.) that don't exist in the
    // browser context.
    const data = await page.evaluate(`(() => {
      const statLinks = Array.from(document.querySelectorAll('a[href$="/following"], a[href$="/verified_followers"], a[href$="/followers"]'));
      const stats = {};
      for (const l of statLinks) {
        const href = l.getAttribute('href') || '';
        const lbl = (l.textContent || '').trim();
        if (/following/.test(href)) stats.following = lbl;
        else if (/followers/.test(href)) stats.followers = lbl;
      }
      const articles = Array.from(document.querySelectorAll('article')).slice(0, 12);
      const posts = articles.map((a) => {
        const time = a.querySelector('time') ? a.querySelector('time').getAttribute('datetime') : null;
        const text = (a.querySelector('[data-testid="tweetText"]') ? a.querySelector('[data-testid="tweetText"]').textContent : '').slice(0, 120);
        const linkEl = a.querySelector('a[href*="/status/"]');
        const link = linkEl ? linkEl.getAttribute('href') : '';
        const buttons = Array.from(a.querySelectorAll('[role="button"], a[role="link"]'));
        const out = {};
        for (const b of buttons) {
          const label = b.getAttribute('aria-label') || '';
          let m;
          if ((m = label.match(/(\\d[\\d,]*)\\s+repl/i))) out.replies = m[1];
          else if ((m = label.match(/(\\d[\\d,]*)\\s+repost/i))) out.reposts = m[1];
          else if ((m = label.match(/(\\d[\\d,]*)\\s+like/i))) out.likes = m[1];
          else if ((m = label.match(/(\\d[\\d,]*)\\s+view/i))) out.views = m[1];
        }
        return Object.assign({ time, text, link }, out);
      });
      return { stats, posts };
    })()`) as any;

    console.log('@ParliamentAudit on X');
    console.log(`  followers:  ${data.stats.followers ?? '?'}`);
    console.log(`  following:  ${data.stats.following ?? '?'}`);
    console.log('');
    console.log(`Last ${data.posts.length} posts:`);
    let sumViews = 0,
      sumLikes = 0,
      sumReposts = 0,
      sumReplies = 0;
    for (const p of data.posts) {
      const views = parseInt((p.views ?? '0').replace(/,/g, ''), 10) || 0;
      const likes = parseInt((p.likes ?? '0').replace(/,/g, ''), 10) || 0;
      const reposts = parseInt((p.reposts ?? '0').replace(/,/g, ''), 10) || 0;
      const replies = parseInt((p.replies ?? '0').replace(/,/g, ''), 10) || 0;
      sumViews += views;
      sumLikes += likes;
      sumReposts += reposts;
      sumReplies += replies;
      console.log(`  ${p.time ?? '?'}  views=${views} ♥${likes} ↻${reposts} 💬${replies}`);
      console.log(`     "${p.text.replace(/\n/g, ' ')}…"`);
    }
    console.log('');
    console.log(`Totals across last ${data.posts.length} posts:`);
    console.log(`  views=${sumViews}  likes=${sumLikes}  reposts=${sumReposts}  replies=${sumReplies}`);
    console.log(`  avg views/post: ${(sumViews / Math.max(1, data.posts.length)).toFixed(1)}`);
  } finally {
    await ctx.close();
  }
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
