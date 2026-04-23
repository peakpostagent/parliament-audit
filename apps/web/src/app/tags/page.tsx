import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags } from '@/content/news-articles';

export const metadata: Metadata = {
  title: 'All Topics — Parliament Audit',
  description:
    'Browse every topic Parliament Audit has covered — bills, MPs, votes, accountability stories, and more.',
  alternates: { canonical: '/tags' },
};

export default function TagsIndexPage() {
  const tags = getAllTags();

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-red-600">
          Home
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <Link href="/news" className="hover:text-red-600">
          News
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span aria-current="page" className="text-gray-700">
          Tags
        </span>
      </nav>

      <header className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-1">
          All topics
        </h1>
        <p className="text-sm text-gray-600">
          {tags.length} topic{tags.length === 1 ? '' : 's'} across{' '}
          {tags.reduce((sum, t) => sum + t.count, 0)} article references.
        </p>
      </header>

      {tags.length === 0 ? (
        <p className="text-gray-600">No tags yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-12">
          {tags.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tag/${t.slug}`}
                className="flex items-baseline justify-between py-1.5 border-b border-gray-100 hover:border-red-600 group"
              >
                <span className="text-[#1a1a2e] group-hover:text-red-700 transition-colors">
                  {t.tag}
                </span>
                <span className="text-xs text-gray-500 ml-2">{t.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
