import { db, schema } from '@parliament-pulse/db';
import { desc, eq, or } from 'drizzle-orm';

export const revalidate = 30;

export default async function ReviewQueuePage() {
  // Fetch articles awaiting review
  const reviewQueue = await db.query.articles.findMany({
    where: or(
      eq(schema.articles.status, 'in_review'),
      eq(schema.articles.status, 'draft'),
      eq(schema.articles.status, 'correction_pending'),
    ),
    orderBy: desc(schema.articles.createdAt),
    with: {
      vote: true,
    },
  });

  // Fetch recently published for reference
  const recentlyPublished = await db.query.articles.findMany({
    where: eq(schema.articles.status, 'published'),
    orderBy: desc(schema.articles.publishedAt),
    limit: 5,
    with: {
      vote: true,
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Review Queue</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Awaiting Review" value={reviewQueue.filter(a => a.status === 'in_review').length} color="amber" />
        <StatCard label="Drafts" value={reviewQueue.filter(a => a.status === 'draft').length} color="gray" />
        <StatCard label="Corrections Pending" value={reviewQueue.filter(a => a.status === 'correction_pending').length} color="blue" />
        <StatCard label="Published Today" value={recentlyPublished.filter(a => {
          if (!a.publishedAt) return false;
          return a.publishedAt.toDateString() === new Date().toDateString();
        }).length} color="green" />
      </div>

      {/* Queue */}
      {reviewQueue.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
          <p className="text-lg">Queue is empty</p>
          <p className="text-sm mt-1">All articles have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviewQueue.map((article) => (
            <a
              key={article.id}
              href={`/review/${article.id}`}
              className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusPill status={article.status} />
                  <span className="text-xs text-gray-500">
                    {article.vote.chamber === 'house' ? 'House' : 'Senate'} Vote #{article.vote.voteNumber}
                  </span>
                  <span className="text-xs text-gray-400">
                    {article.vote.voteDate}
                  </span>
                </div>
                <ConfidenceMeter score={article.confidenceScore || 0} />
              </div>
              <h3 className="font-bold">{article.headline}</h3>
              <p className="text-sm text-gray-600 mt-1">{article.summary}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                <span>Created: {article.createdAt.toLocaleString()}</span>
                {article.factCheckPassed ? (
                  <span className="text-green-600">Fact-check passed</span>
                ) : (
                  <span className="text-red-600">Fact-check flagged</span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Recently published */}
      {recentlyPublished.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-3 text-gray-600">Recently Published</h2>
          <div className="space-y-2">
            {recentlyPublished.map((article) => (
              <div key={article.id} className="bg-white border rounded p-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{article.headline}</span>
                  <span className="text-xs text-gray-400 ml-3">
                    Published: {article.publishedAt?.toLocaleString()}
                  </span>
                </div>
                <a
                  href={`https://parliamentpulse.ca/vote/${article.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View live
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    gray: 'bg-gray-50 border-gray-200 text-gray-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
  };
  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs mt-1">{label}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    in_review: 'bg-amber-100 text-amber-800',
    correction_pending: 'bg-blue-100 text-blue-800',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[status] || styles.draft}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function ConfidenceMeter({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 85 ? 'bg-green-500' : pct >= 70 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500">{pct}%</span>
    </div>
  );
}
