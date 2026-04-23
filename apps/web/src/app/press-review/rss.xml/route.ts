import { newsArticles } from '@/content/news-articles';

export const runtime = 'nodejs';
export const revalidate = 3600;

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
 * Per-category RSS feed for just the Press Review column. Lets
 * readers subscribe to only the media-criticism output without the
 * rest of our news. Journalism outlets (NYT, ProPublica, WaPo) all
 * offer per-section feeds.
 */
export async function GET() {
  const filtered = newsArticles
    .filter((a) => a.category === 'Press Review')
    .slice()
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  const lastBuildDate = filtered.length
    ? new Date(filtered[0].updatedAt ?? filtered[0].publishedAt).toUTCString()
    : new Date().toUTCString();

  const items = filtered
    .map((a) => {
      const url = `${SITE}/news/${a.slug}`;
      return `    <item>
      <title>${escapeXml(a.headline)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <category>Press Review</category>
      <description>${escapeXml(a.summary)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Parliament Audit — Press Review</title>
    <link>${SITE}/press-review</link>
    <description>A weekly column from Parliament Audit examining how Canadian media outlets covered the week's parliamentary stories. Non-partisan, evidence-first media criticism.</description>
    <language>en-ca</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE}/press-review/rss.xml" rel="self" type="application/rss+xml" />
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
