import type { Metadata } from 'next';
import { db, schema } from '@parliament-audit/db';
import { desc, eq, and, ilike, sql } from 'drizzle-orm';
import { VoteCard } from '@/components/VoteCard';
import { PARTY_SHORT_NAMES, VOTE_TYPE_LABELS } from '@parliament-audit/shared';

export const metadata: Metadata = {
  title: 'Vote Archive',
  description: 'Search and filter every recorded vote in Canada\'s House of Commons and Senate. Browse by party, result, vote type, and more.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 300;

interface ArchivePageProps {
  searchParams: Promise<{
    q?: string;
    party?: string;
    chamber?: string;
    result?: string;
    type?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 20;

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10));
  const offset = (page - 1) * PAGE_SIZE;

  // Build filter conditions
  const conditions = [eq(schema.articles.status, 'published')];

  if (params.q) {
    conditions.push(ilike(schema.articles.headline, `%${params.q}%`));
  }

  // Fetch articles with vote data
  let articles = await db.query.articles.findMany({
    where: and(...conditions),
    orderBy: desc(schema.articles.publishedAt),
    limit: PAGE_SIZE + 1, // +1 to check if there's a next page
    offset,
    with: {
      vote: {
        with: {
          partyResults: true,
        },
      },
    },
  });

  // Apply vote-level filters in JS (since they're on the related table)
  if (params.chamber) {
    articles = articles.filter((a) => a.vote.chamber === params.chamber);
  }
  if (params.result) {
    articles = articles.filter((a) => a.vote.result === params.result);
  }
  if (params.type) {
    articles = articles.filter((a) => a.vote.voteType === params.type);
  }
  if (params.party) {
    articles = articles.filter((a) =>
      a.vote.partyResults.some(
        (p) => p.partyShort === params.party && p.yeas > 0
      )
    );
  }

  const hasNextPage = articles.length > PAGE_SIZE;
  if (hasNextPage) articles = articles.slice(0, PAGE_SIZE);

  // Build query string helper
  function buildUrl(overrides: Record<string, string | undefined>) {
    const merged = { ...params, ...overrides };
    const qs = Object.entries(merged)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join('&');
    return `/archive${qs ? `?${qs}` : ''}`;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vote Archive</h1>

      {/* Search and filters */}
      <div className="bg-gray-50 border rounded-lg p-4 mb-6">
        <form method="GET" action="/archive" className="space-y-3">
          {/* Search bar */}
          <div>
            <input
              type="text"
              name="q"
              defaultValue={params.q || ''}
              placeholder="Search votes by keyword..."
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap gap-3">
            <select name="chamber" defaultValue={params.chamber || ''} className="border rounded px-2 py-1.5 text-sm">
              <option value="">All Chambers</option>
              <option value="house">House of Commons</option>
              <option value="senate">Senate</option>
            </select>

            <select name="result" defaultValue={params.result || ''} className="border rounded px-2 py-1.5 text-sm">
              <option value="">All Results</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="tied">Tied</option>
            </select>

            <select name="type" defaultValue={params.type || ''} className="border rounded px-2 py-1.5 text-sm">
              <option value="">All Types</option>
              {Object.entries(VOTE_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <select name="party" defaultValue={params.party || ''} className="border rounded px-2 py-1.5 text-sm">
              <option value="">All Parties</option>
              {Object.entries(PARTY_SHORT_NAMES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-[#1a1a2e] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-[#2a2a4e] transition-colors"
            >
              Search
            </button>

            <a
              href="/archive"
              className="text-sm text-gray-500 hover:text-red-600 self-center"
            >
              Clear filters
            </a>
          </div>
        </form>
      </div>

      {/* Active filters display */}
      {(params.q || params.chamber || params.result || params.type || params.party) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {params.q && (
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
              Search: &ldquo;{params.q}&rdquo;
            </span>
          )}
          {params.chamber && (
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
              Chamber: {params.chamber === 'house' ? 'House' : 'Senate'}
            </span>
          )}
          {params.result && (
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
              Result: {params.result}
            </span>
          )}
          {params.type && (
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
              Type: {VOTE_TYPE_LABELS[params.type as keyof typeof VOTE_TYPE_LABELS] || params.type}
            </span>
          )}
          {params.party && (
            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
              Party: {PARTY_SHORT_NAMES[params.party] || params.party}
            </span>
          )}
        </div>
      )}

      {/* Results */}
      {articles.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No votes found.</p>
          <p className="text-sm">Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-8">
        {page > 1 ? (
          <a
            href={buildUrl({ page: String(page - 1) })}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            &larr; Previous
          </a>
        ) : (
          <span />
        )}
        <span className="text-sm text-gray-500">Page {page}</span>
        {hasNextPage ? (
          <a
            href={buildUrl({ page: String(page + 1) })}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Next &rarr;
          </a>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
