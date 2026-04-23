import { newsArticles } from '@/content/news-articles';

export const runtime = 'nodejs';
export const revalidate = 3600; // 1h

const SITE = 'https://parliamentaudit.ca';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * RSS 2.0 feed for the /news section.
 *
 * Lets readers, Feedly/Inoreader subscribers, Substack importers, and
 * LLM ingestion agents track Parliament Audit without scraping. Feed
 * URL is discoverable via <link rel="alternate" type="application/rss+xml">
 * in the site's <head> (wired in layout.tsx).
 */
export async function GET() {
  const lastBuildDate = newsArticles
    .map((a) => new Date(a.updatedAt ?? a.publishedAt).getTime())
    .reduce((a, b) => Math.max(a, b), 0);

  const items = newsArticles
    .slice()
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 50)
    .map((a) => {
      const url = `${SITE}/news/${a.slug}`;
      return `    <item>
      <title>${escapeXml(a.headline)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(a.category)}</category>
      <description>${escapeXml(a.summary)}</description>
      <content:encoded><![CDATA[
        <p><strong>${escapeXml(a.summary)}</strong></p>
        ${a.keyTakeaways && a.keyTakeaways.length > 0
          ? `<ul>${a.keyTakeaways.map((t) => `<li>${escapeXml(t)}</li>`).join('')}</ul>`
          : ''}
        ${a.sections
          .map(
            (s) =>
              `<h2>${escapeXml(s.title)}</h2>${s.body
                .split('\n\n')
                .map((p) => `<p>${escapeXml(p.trim())}</p>`)
                .join('')}`,
          )
          .join('')}
        <p><em>Originally published by <a href="${url}">Parliament Audit</a>. Republish under CC BY-ND 4.0.</em></p>
      ]]></content:encoded>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Parliament Audit</title>
    <link>${SITE}</link>
    <description>Canadian parliamentary votes, legislation, and accountability — tracked and explained. Non-partisan. Factual. Transparent.</description>
    <language>en-ca</language>
    <lastBuildDate>${new Date(lastBuildDate || Date.now()).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE}/opengraph-image</url>
      <title>Parliament Audit</title>
      <link>${SITE}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=7200',
    },
  });
}
