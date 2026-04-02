import { db, schema } from '@parliament-audit/db';
import { desc, eq } from 'drizzle-orm';
import { VoteCard } from '@/components/VoteCard';

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

  return (
    <div>
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

      {/* Vote feed */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          Latest Votes
        </h2>

        {latestArticles.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">No votes published yet.</p>
            <p className="text-sm">Check back soon — we're monitoring Parliament for new recorded divisions.</p>
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
        <a
          href="/subscribe"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors"
        >
          Subscribe for Vote Alerts
        </a>
      </section>
    </div>
  );
}
