import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getNewsArticle, getAllNewsSlugs } from '@/content/news-articles';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsArticle(slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.headline} — Parliament Audit`,
    description: article.summary,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      title: article.headline,
      description: article.summary,
      type: 'article',
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.headline,
      description: article.summary,
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getNewsArticle(slug);

  if (!article) {
    notFound();
  }

  const publishDate = new Date(article.publishedAt);
  const formattedDate = publishDate.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumbs */}
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
        <span className="text-gray-700 truncate">{article.headline}</span>
      </nav>

      {/* Meta bar */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
        <span className="font-medium uppercase text-red-600">
          {article.category}
        </span>
        <span aria-hidden="true">|</span>
        <time dateTime={article.publishedAt}>{formattedDate}</time>
        <span aria-hidden="true">|</span>
        <span>{article.readingTimeMinutes} min read</span>
      </div>

      {/* Headline */}
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {article.headline}
      </h1>
      {article.subheadline && (
        <p className="text-lg text-gray-600 mb-6">{article.subheadline}</p>
      )}

      {/* Summary box */}
      <div className="bg-gray-50 border-l-4 border-red-600 p-4 rounded-r-lg mb-8">
        <p className="font-medium text-gray-800">{article.summary}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Article body */}
      {article.sections.map((section, i) => (
        <section key={i} className="mb-8">
          <h2 className="text-xl font-bold mb-3">{section.title}</h2>
          <div className="prose prose-gray max-w-none">
            {section.body.split('\n\n').map((p, j) => (
              <p key={j} className="mb-3 text-gray-700 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>
      ))}

      {/* Sources */}
      {article.sources.length > 0 && (
        <section className="mb-8 bg-gray-50 border rounded-lg p-5">
          <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-gray-600">
            Sources &amp; Official Documents
          </h3>
          <ul className="space-y-2 text-sm">
            {article.sources.map((source, i) => (
              <li key={i}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Verification notice */}
      <div className="bg-[#1a1a2e] text-white rounded-lg p-5 mb-8">
        <p className="text-sm font-medium mb-1">About this article</p>
        <p className="text-gray-300 text-sm">
          This article is based on publicly available legislative documents,
          government backgrounders, and expert analysis. Parliament Audit is
          non-partisan and does not endorse or oppose any legislation. All
          sources are linked above.
        </p>
      </div>

      {/* Share + CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500">Share:</span>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://parliamentaudit.ca/news/${article.slug}`)}&text=${encodeURIComponent(article.headline)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            X / Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://parliamentaudit.ca/news/${article.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Facebook
          </a>
        </div>
        <Link
          href="/subscribe"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Get Vote Alerts
        </Link>
      </div>
    </div>
  );
}
