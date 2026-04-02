/**
 * RecentVotesSidebar
 *
 * A persistent left sidebar showing the most recent published vote articles.
 * Helps users coming from social media quickly find the article they were
 * linked to, and discover other votes at a glance.
 *
 * Server component — fetches data at render time.
 */

import { db, schema } from '@parliament-audit/db';
import { eq, desc, and } from 'drizzle-orm';
import Link from 'next/link';

interface SidebarArticle {
  id: string;
  slug: string;
  headline: string;
  publishedAt: Date | null;
  vote: {
    voteNumber: number;
    voteDate: string;
    result: string;
    billNumber: string | null;
    chamber: string;
  };
}

async function getRecentArticles(limit = 15): Promise<SidebarArticle[]> {
  const rows = await db.query.articles.findMany({
    where: eq(schema.articles.status, 'published'),
    orderBy: [desc(schema.articles.publishedAt)],
    limit,
    with: {
      vote: {
        columns: {
          voteNumber: true,
          voteDate: true,
          result: true,
          billNumber: true,
          chamber: true,
        },
      },
    },
    columns: {
      id: true,
      slug: true,
      headline: true,
      publishedAt: true,
    },
  });
  return rows as SidebarArticle[];
}

function ResultPill({ result }: { result: string }) {
  const isPass = result === 'passed';
  const isTie = result === 'tied';
  return (
    <span
      className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded uppercase leading-none ${
        isTie
          ? 'bg-yellow-100 text-yellow-700'
          : isPass
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {isTie ? 'TIE' : isPass ? 'PASS' : 'FAIL'}
    </span>
  );
}

interface Props {
  currentSlug?: string;
}

export async function RecentVotesSidebar({ currentSlug }: Props) {
  const articles = await getRecentArticles(15);

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-24">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">
          Latest Votes
        </h2>
        <nav aria-label="Recent votes">
          <ul className="space-y-0.5">
            {articles.map((article) => {
              const isActive = article.slug === currentSlug;
              const date = article.vote.voteDate
                ? new Date(article.vote.voteDate + 'T12:00:00').toLocaleDateString('en-CA', {
                    month: 'short',
                    day: 'numeric',
                  })
                : null;

              return (
                <li key={article.id}>
                  <Link
                    href={`/vote/${article.slug}`}
                    className={`group block rounded-lg px-3 py-2.5 transition-colors ${
                      isActive
                        ? 'bg-red-50 border-l-2 border-red-600'
                        : 'hover:bg-gray-50 border-l-2 border-transparent hover:border-gray-200'
                    }`}
                  >
                    {/* Top row: vote number + result pill + date */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono text-gray-400 uppercase">
                        {article.vote.chamber === 'house' ? 'HoC' : 'Sen'} #{article.vote.voteNumber}
                      </span>
                      {article.vote.billNumber && (
                        <>
                          <span className="text-[10px] text-gray-300">·</span>
                          <span className="text-[10px] font-medium text-gray-500">
                            {article.vote.billNumber}
                          </span>
                        </>
                      )}
                      <span className="ml-auto">
                        <ResultPill result={article.vote.result} />
                      </span>
                    </div>

                    {/* Headline */}
                    <p
                      className={`text-xs leading-snug line-clamp-2 ${
                        isActive
                          ? 'text-red-900 font-medium'
                          : 'text-gray-700 group-hover:text-gray-900'
                      }`}
                    >
                      {article.headline}
                    </p>

                    {/* Date */}
                    {date && (
                      <p className="text-[10px] text-gray-400 mt-1">{date}</p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Archive link */}
        <div className="mt-4 pt-3 border-t border-gray-100 px-3">
          <Link
            href="/archive"
            className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
          >
            View full archive
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
}
