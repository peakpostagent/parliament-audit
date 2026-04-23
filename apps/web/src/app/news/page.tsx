import type { Metadata } from 'next';
import Link from 'next/link';
import { newsArticles, slugifyTag } from '@/content/news-articles';

export const metadata: Metadata = {
  title: 'News — Parliament Audit',
  description:
    'In-depth coverage of Canadian legislation, government spending, and parliamentary accountability.',
};

export default function NewsIndexPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-red-600">
          Home
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-gray-700">News</span>
      </nav>

      <div className="flex items-baseline justify-between mb-2">
        <h1 className="text-3xl font-bold">News</h1>
        <Link
          href="/tags"
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Browse by topic →
        </Link>
      </div>
      <p className="text-gray-600 mb-8">
        In-depth coverage of Canadian legislation, government spending, and
        parliamentary accountability.
      </p>

      <div className="space-y-6">
        {newsArticles.map((article) => {
          const date = new Date(article.publishedAt).toLocaleDateString(
            'en-CA',
            { year: 'numeric', month: 'long', day: 'numeric' }
          );
          return (
            <article
              key={article.slug}
              className="border rounded-lg p-5 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                <span className="font-medium uppercase text-red-600">
                  {article.category}
                </span>
                <span aria-hidden="true">|</span>
                <time dateTime={article.publishedAt}>{date}</time>
                <span aria-hidden="true">|</span>
                <span>{article.readingTimeMinutes} min read</span>
              </div>
              <Link
                href={`/news/${article.slug}`}
                className="block group"
              >
                <h2 className="text-xl font-bold group-hover:text-red-600 transition-colors mb-1">
                  {article.headline}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {article.summary}
                </p>
              </Link>
              <div className="flex flex-wrap gap-2 mt-3">
                {article.tags.slice(0, 4).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${slugifyTag(tag)}`}
                    className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded hover:bg-gray-200 hover:text-[#1a1a2e] transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      {newsArticles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No articles published yet. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
