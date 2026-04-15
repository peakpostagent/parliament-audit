import type { MetadataRoute } from 'next';
import { db, schema } from '@parliament-audit/db';
import { eq, desc, isNotNull } from 'drizzle-orm';

function slugifyMemberName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://parliamentaudit.ca';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${baseUrl}/archive`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/find-your-mp`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/methodology`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/glossary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/corrections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/subscribe`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Dynamic vote article pages
  let articlePages: MetadataRoute.Sitemap = [];
  let billPages: MetadataRoute.Sitemap = [];
  let mpPages: MetadataRoute.Sitemap = [];

  try {
    const articles = await db.query.articles.findMany({
      where: eq(schema.articles.status, 'published'),
      orderBy: desc(schema.articles.publishedAt),
      columns: { slug: true, publishedAt: true, updatedAt: true },
    });

    articlePages = articles.map((article) => ({
      url: `${baseUrl}/vote/${article.slug}`,
      lastModified: article.updatedAt || article.publishedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Distinct bill numbers that actually have votes
    const bills = await db
      .selectDistinct({ billNumber: schema.votes.billNumber })
      .from(schema.votes)
      .where(isNotNull(schema.votes.billNumber));

    billPages = bills
      .filter((b) => b.billNumber)
      .map((b) => ({
        url: `${baseUrl}/bill/${encodeURIComponent(b.billNumber as string)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    // Distinct MP names for /mp/[slug]
    const members = await db
      .selectDistinct({ memberName: schema.voteMemberResults.memberName })
      .from(schema.voteMemberResults);

    mpPages = members.map((m) => ({
      url: `${baseUrl}/mp/${slugifyMemberName(m.memberName)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {
    // Database may not be available during build
  }

  return [...staticPages, ...articlePages, ...billPages, ...mpPages];
}
