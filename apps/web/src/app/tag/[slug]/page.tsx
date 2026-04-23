import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getAllTags,
  getArticlesByTagSlug,
  getTagLabel,
} from '@/content/news-articles';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const label = getTagLabel(slug);
  if (!label) return { title: 'Tag Not Found — Parliament Audit' };

  const count = getArticlesByTagSlug(slug).length;
  const title = `${label} — Parliament Audit`;
  const description = `${count} article${count === 1 ? '' : 's'} on Parliament Audit tagged "${label}". In-depth Canadian parliamentary coverage.`;
  return {
    title,
    description,
    alternates: { canonical: `/tag/${slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const label = getTagLabel(slug);
  if (!label) return notFound();

  const articles = getArticlesByTagSlug(slug);
  const allTags = getAllTags();

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
        <Link href="/tags" className="hover:text-red-600">
          Tags
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span aria-current="page" className="text-gray-700">
          {label}
        </span>
      </nav>

      <header className="border-b border-gray-200 pb-4 mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
          Tag
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-1">
          {label}
        </h1>
        <p className="text-sm text-gray-600">
          {articles.length} article{articles.length === 1 ? '' : 's'}
        </p>
      </header>

      {articles.length === 0 ? (
        <p className="text-gray-600">Nothing here yet.</p>
      ) : (
        <ul className="space-y-6 mb-12">
          {articles.map((a) => (
            <li key={a.slug} className="border-b border-gray-100 pb-6">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span className="uppercase tracking-wider font-semibold">
                  {a.category}
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={a.publishedAt}>
                  {new Date(a.publishedAt).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span aria-hidden="true">·</span>
                <span>{a.readingTimeMinutes} min read</span>
              </div>
              <h2 className="text-xl font-bold mb-1">
                <Link
                  href={`/news/${a.slug}`}
                  className="text-[#1a1a2e] hover:text-red-700 transition-colors"
                >
                  {a.headline}
                </Link>
              </h2>
              <p className="text-gray-700 text-sm line-clamp-2">{a.summary}</p>
            </li>
          ))}
        </ul>
      )}

      <aside className="bg-gray-50 border border-gray-200 rounded p-4">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
          Other topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {allTags
            .filter((t) => t.slug !== slug)
            .slice(0, 20)
            .map((t) => (
              <Link
                key={t.slug}
                href={`/tag/${t.slug}`}
                className="bg-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded hover:border-red-600 hover:text-red-700 transition-colors"
              >
                {t.tag}
                <span className="text-gray-400 ml-1">({t.count})</span>
              </Link>
            ))}
        </div>
      </aside>
    </div>
  );
}
