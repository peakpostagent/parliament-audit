import { db, schema } from '@parliament-audit/db';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import { VoteCard } from '@/components/VoteCard';
import { newsArticles } from '@/content/news-articles';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

export default async function HomePage() {
  // Fetch latest published articles with their vote and party data
  const latestArticles = await db.query.articles.findMany({
    where: eq(schema.articles.status, 'published'),
    orderBy: desc(schema.articles.publishedAt),
    limit: 20,
    with: {
      vote: {
        with: {
          partyResults: true,
        },
      },
    },
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Parliament Audit',
    url: 'https://parliamentaudit.ca',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://parliamentaudit.ca/archive?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero section */}
      <section className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Every Vote. Every Party. Every Time.
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Parliament Audit tracks every recorded vote in Canada's House of Commons and Senate.
          Non-partisan. Factual. Transparent. Because Canada deserves to know.
        </p>
      </section>

      {/* Latest News */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-red-600 rounded-full" />
            Latest News
          </h2>
          <Link
            href="/news"
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            View all news &rarr;
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[...newsArticles]
            .sort(
              (a, b) =>
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime()
            )
            .slice(0, 3)
            .map((article) => {
              const date = new Date(article.publishedAt).toLocaleDateString(
                'en-CA',
                { year: 'numeric', month: 'long', day: 'numeric' }
              );
              return (
                <article
                  key={article.slug}
                  className="border border-gray-200 rounded-lg p-5 hover:border-gray-400 transition-colors flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-red-600">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400">{date}</span>
                  </div>
                  <h3 className="font-bold text-base mb-2 leading-snug">
                    <Link
                      href={`/news/${article.slug}`}
                      className="hover:text-red-600 transition-colors"
                    >
                      {article.headline}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                    {article.summary}
                  </p>
                  <Link
                    href={`/news/${article.slug}`}
                    className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    Read more &rarr;
                  </Link>
                </article>
              );
            })}
        </div>
      </section>

      {/* Vote feed */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          Latest Votes
        </h2>

        {latestArticles.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">No votes published yet.</p>
            <p className="text-sm mb-6">Check back soon — we're monitoring Parliament for new recorded divisions.</p>
            <div className="max-w-md mx-auto text-left bg-gray-50 rounded-lg p-6 text-sm">
              <p className="font-semibold text-gray-700 mb-3">While you wait:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex gap-2"><span className="text-red-600 font-bold">1.</span> <Link href="/about" className="hover:text-red-600 underline">Learn about the project</Link> and why we built it</li>
                <li className="flex gap-2"><span className="text-red-600 font-bold">2.</span> <Link href="/methodology" className="hover:text-red-600 underline">Read our methodology</Link> — how we collect and verify data</li>
                <li className="flex gap-2"><span className="text-red-600 font-bold">3.</span> <Link href="/find-your-mp" className="hover:text-red-600 underline">Find your MP</Link> and see who represents you</li>
                <li className="flex gap-2"><span className="text-red-600 font-bold">4.</span> <Link href="/subscribe" className="hover:text-red-600 underline">Subscribe for alerts</Link> so you never miss a vote</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {latestArticles.map((article) => (
              <VoteCard
                key={article.id}
                slug={article.slug}
                chamber={article.vote.chamber}
                voteNumber={article.vote.voteNumber}
                voteDate={article.vote.voteDate}
                headline={article.headline}
                summary={article.summary}
                result={article.vote.result}
                yeasTotal={article.vote.yeasTotal}
                naysTotal={article.vote.naysTotal}
                voteType={article.vote.voteType}
                recordStatus={article.vote.recordStatus}
                billNumber={article.vote.billNumber}
                partyResults={article.vote.partyResults}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mt-12 text-center bg-[#1a1a2e] text-white rounded-lg p-8">
        <h2 className="text-xl font-bold mb-2">Stay Informed</h2>
        <p className="text-gray-300 mb-4">
          Get notified when Parliament votes on the issues that matter to you.
        </p>
        <Link
          href="/subscribe"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors"
        >
          Subscribe for Vote Alerts
        </Link>
      </section>
    </div>
  );
}
