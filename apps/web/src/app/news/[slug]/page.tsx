import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getNewsArticle, getAllNewsSlugs, getRelatedArticles, slugifyTag, type NewsArticle } from '@/content/news-articles';
import RepublishBlock from '@/components/RepublishBlock';
import { SourceLink } from '@/components/SourceLink';
import { ArticleEngagementTracker } from '@/components/ArticleEngagementTracker';
import { ShareLink } from '@/components/ShareLink';

/** Build a plain-HTML version of the article body for CMS copy-paste. */
function buildRepublishBodyHtml(sections: NewsArticle['sections']): string {
  return sections
    .map((section) => {
      const paragraphs = section.body
        .split('\n\n')
        .map((p) => `  <p>${escapeHtmlInline(p.trim())}</p>`)
        .join('\n');
      return `  <h2>${escapeHtmlInline(section.title)}</h2>\n${paragraphs}`;
    })
    .join('\n');
}

function escapeHtmlInline(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

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

  // Articles with two named subjects (floor-crossings, contradictions, before/
  // after stories) get the split-portrait comparison card; others get the
  // default headline-stat card.
  const ogPath =
    article.subjects && article.subjects.length >= 2
      ? `/api/og/comparison?slug=${encodeURIComponent(article.slug)}`
      : `/api/og/news/${article.slug}`;

  return {
    title: `${article.headline} — Parliament Audit`,
    description: article.summary,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      title: article.headline,
      description: article.summary,
      type: 'article',
      publishedTime: article.publishedAt,
      images: [
        {
          url: ogPath,
          width: 1200,
          height: 630,
          alt: article.headline,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.headline,
      description: article.summary,
      images: [ogPath],
    },
  };
}

const SITE_URL = 'https://parliamentaudit.ca';

/**
 * Build JSON-LD structured data so AI search engines (ChatGPT, Perplexity,
 * Google AI Overviews) and traditional crawlers (Google, Bing) can ingest
 * our articles cleanly. Emits Article + (when applicable) Dataset for
 * structured vote data + BreadcrumbList for navigation.
 */
function buildJsonLd(article: NewsArticle): unknown {
  const articleUrl = `${SITE_URL}/news/${article.slug}`;
  const ogImage = `${SITE_URL}/api/og/news/${article.slug}`;

  const articleSchema: Record<string, unknown> = {
    '@type': 'NewsArticle',
    headline: article.headline,
    description: article.summary,
    image: [ogImage],
    datePublished: article.publishedAt,
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    author: {
      '@type': 'Organization',
      name: 'Parliament Audit',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Parliament Audit',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon-512.png`,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    articleSection: article.category,
    keywords: article.tags.join(', '),
    isAccessibleForFree: true,
    inLanguage: 'en-CA',
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE_URL}/news` },
      { '@type': 'ListItem', position: 3, name: article.headline, item: articleUrl },
    ],
  };

  const graph: unknown[] = [articleSchema, breadcrumb];

  // Dataset schema for structured vote data — parseable by AI agents
  // answering "how did party X vote on bill Y?"
  if (article.voteBreakdown) {
    const v = article.voteBreakdown;
    graph.push({
      '@type': 'Dataset',
      name: `Bill ${v.billNumber} vote breakdown — ${v.stage}`,
      description: `Recorded division on Bill ${v.billNumber} (${v.stage}, ${v.voteDate}). Result: ${v.result.toUpperCase()} ${v.totals.yea}–${v.totals.nay}.`,
      url: articleUrl,
      datePublished: v.voteDate,
      creator: { '@type': 'Organization', name: 'House of Commons of Canada' },
      isAccessibleForFree: true,
      license: 'https://www.ourcommons.ca/en/important-notices',
      variableMeasured: ['party', 'yea', 'nay', 'abstain', 'absent'],
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'text/html',
        contentUrl: articleUrl,
      },
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

const PARTY_COLORS: Record<string, string> = {
  LPC: 'bg-red-600',
  CPC: 'bg-blue-700',
  NDP: 'bg-orange-500',
  BQ: 'bg-cyan-500',
  GPC: 'bg-green-600',
  IND: 'bg-gray-500',
};

function VoteTable({ vote }: { vote: NonNullable<NewsArticle['voteBreakdown']> }) {
  const showAbstain = vote.byParty.some((p) => (p.abstain ?? 0) > 0);
  const showAbsent = vote.byParty.some((p) => (p.absent ?? 0) > 0);
  const resultColor =
    vote.result === 'passed'
      ? 'text-green-700'
      : vote.result === 'failed'
        ? 'text-red-700'
        : 'text-gray-700';
  return (
    <figure className="my-8 border border-gray-200 rounded-lg overflow-hidden bg-white">
      <figcaption className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <span className="font-bold text-gray-900">
              Bill {vote.billNumber} — {vote.stage}
            </span>
            <span className="ml-2 text-sm text-gray-500">{vote.voteDate}</span>
          </div>
          <div className={`text-sm font-bold uppercase tracking-wide ${resultColor}`}>
            {vote.result} {vote.totals.yea}–{vote.totals.nay}
          </div>
        </div>
      </figcaption>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-2">Party</th>
            <th className="text-right px-4 py-2">Yea</th>
            <th className="text-right px-4 py-2">Nay</th>
            {showAbstain && <th className="text-right px-4 py-2">Abstain</th>}
            {showAbsent && <th className="text-right px-4 py-2">Absent</th>}
          </tr>
        </thead>
        <tbody>
          {vote.byParty.map((p) => (
            <tr key={p.party} className="border-t border-gray-100">
              <td className="px-4 py-2 flex items-center gap-2">
                <span
                  className={`inline-block w-3 h-3 rounded-sm ${PARTY_COLORS[p.party] ?? 'bg-gray-400'}`}
                  aria-hidden="true"
                />
                <span className="font-medium text-gray-800">
                  {p.partyFullName ?? p.party}
                </span>
                <span className="text-gray-400 text-xs">({p.party})</span>
              </td>
              <td className="text-right px-4 py-2 font-mono text-gray-700">{p.yea || '—'}</td>
              <td className="text-right px-4 py-2 font-mono text-gray-700">{p.nay || '—'}</td>
              {showAbstain && (
                <td className="text-right px-4 py-2 font-mono text-gray-700">
                  {p.abstain || '—'}
                </td>
              )}
              {showAbsent && (
                <td className="text-right px-4 py-2 font-mono text-gray-700">
                  {p.absent || '—'}
                </td>
              )}
            </tr>
          ))}
          <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
            <td className="px-4 py-2 text-gray-900">Total</td>
            <td className="text-right px-4 py-2 font-mono text-gray-900">
              {vote.totals.yea}
            </td>
            <td className="text-right px-4 py-2 font-mono text-gray-900">
              {vote.totals.nay}
            </td>
            {showAbstain && (
              <td className="text-right px-4 py-2 font-mono text-gray-900">
                {vote.totals.abstain ?? '—'}
              </td>
            )}
            {showAbsent && (
              <td className="text-right px-4 py-2 font-mono text-gray-900">
                {vote.totals.absent ?? '—'}
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </figure>
  );
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
  const updatedDate = article.updatedAt
    ? new Date(article.updatedAt).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const jsonLd = buildJsonLd(article);
  const related = getRelatedArticles(article.slug, 3);

  return (
    <div className="max-w-3xl mx-auto">
      {/* JSON-LD: Article + (Dataset) + BreadcrumbList for AEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
        {updatedDate && (
          <>
            <span aria-hidden="true">|</span>
            <time dateTime={article.updatedAt} className="italic">
              Updated {updatedDate}
            </time>
          </>
        )}
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

      {/* Editor's note — for corrections, substantive post-publish edits */}
      {article.editorsNote && (
        <aside
          className="mb-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4"
          aria-label="Editor's note"
        >
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-900">
              Editor&apos;s note
            </span>
            <time
              dateTime={article.editorsNote.date}
              className="text-xs text-amber-800"
            >
              {new Date(article.editorsNote.date).toLocaleDateString('en-CA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <p className="text-sm text-amber-950 leading-relaxed">
            {article.editorsNote.body}
          </p>
        </aside>
      )}

      {/* Smart Brevity header (Axios pattern) — news-hook scannable summary */}
      {article.smartBrevity && (
        <aside
          className="mb-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          aria-label="Smart-brevity summary"
        >
          <div className="mb-4">
            <span className="block text-xs font-bold uppercase tracking-widest text-red-700 mb-1">
              The big thing
            </span>
            <p className="text-lg font-semibold text-[#1a1a2e] leading-snug">
              {article.smartBrevity.bigThing}
            </p>
          </div>
          <div className="mb-4">
            <span className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
              Why it matters
            </span>
            <p className="text-gray-800 leading-relaxed">
              {article.smartBrevity.whyItMatters}
            </p>
          </div>
          {article.smartBrevity.goDeeper.length > 0 && (
            <div className="mb-4">
              <span className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                Go deeper
              </span>
              <ul className="space-y-1.5">
                {article.smartBrevity.goDeeper.map((point, i) => (
                  <li key={i} className="flex gap-2 text-gray-800 leading-relaxed">
                    <span className="text-red-700 font-bold mt-0.5" aria-hidden="true">
                      •
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {article.smartBrevity.yesBut && (
            <div className="mb-4">
              <span className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                Yes, but
              </span>
              <p className="text-gray-800 leading-relaxed">{article.smartBrevity.yesBut}</p>
            </div>
          )}
          {article.smartBrevity.bottomLine && (
            <div className="pt-3 border-t border-gray-100">
              <span className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                The bottom line
              </span>
              <p className="text-gray-800 font-medium leading-relaxed">
                {article.smartBrevity.bottomLine}
              </p>
            </div>
          )}
        </aside>
      )}

      {/* TLDR / Key Takeaways box */}
      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
        <aside
          className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-5"
          aria-labelledby="key-takeaways-heading"
        >
          <h2
            id="key-takeaways-heading"
            className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-3 flex items-center gap-2"
          >
            <span aria-hidden="true">⚡</span> Key Takeaways
          </h2>
          <ul className="space-y-2">
            {article.keyTakeaways.map((point, i) => (
              <li
                key={i}
                className="text-gray-800 leading-relaxed flex gap-2"
              >
                <span className="text-amber-700 font-bold mt-0.5" aria-hidden="true">
                  →
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* How we reported this — per-article methodology (The Markup pattern) */}
      {article.methodology && (
        <details className="mb-8 border border-gray-200 rounded-lg bg-gray-50 group">
          <summary className="cursor-pointer p-4 text-sm font-semibold text-gray-700 hover:bg-gray-100 select-none flex items-center gap-2">
            <span
              className="inline-block transition-transform group-open:rotate-90 text-gray-400"
              aria-hidden="true"
            >
              ▸
            </span>
            How we reported this
          </summary>
          <div className="px-4 pb-4 pt-1 text-gray-700 text-sm leading-relaxed">
            {article.methodology}
          </div>
        </details>
      )}

      {/* Summary box */}
      <div className="bg-gray-50 border-l-4 border-red-600 p-4 rounded-r-lg mb-8">
        <p className="font-medium text-gray-800">{article.summary}</p>
      </div>

      {/* Vote breakdown table (when present) */}
      {article.voteBreakdown && <VoteTable vote={article.voteBreakdown} />}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {article.tags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${slugifyTag(tag)}`}
            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-200 hover:text-[#1a1a2e] transition-colors"
          >
            {tag}
          </Link>
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
                <SourceLink url={source.url} label={source.label} slug={article.slug} kind="source" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related reporting */}
      {related.length > 0 && (
        <section className="mb-8" aria-labelledby="related-heading">
          <h3
            id="related-heading"
            className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-600"
          >
            More reporting on this
          </h3>
          <ul className="grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <li
                key={r.slug}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors flex flex-col"
              >
                <span className="text-xs font-semibold uppercase text-red-700 mb-1">
                  {r.category}
                </span>
                <Link
                  href={`/news/${r.slug}`}
                  className="font-semibold text-[#1a1a2e] hover:text-red-700 transition-colors leading-snug text-sm mb-2"
                >
                  {r.headline}
                </Link>
                <p className="text-xs text-gray-600 line-clamp-2 mt-auto">
                  {r.subheadline || r.summary}
                </p>
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
          <ShareLink
            url={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://parliamentaudit.ca/news/${article.slug}`)}&text=${encodeURIComponent(article.headline)}`}
            label="X / Twitter"
            slug={article.slug}
            platform="x"
          />
          <ShareLink
            url={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${article.headline} https://parliamentaudit.ca/news/${article.slug}`)}`}
            label="Bluesky"
            slug={article.slug}
            platform="bluesky"
          />
          <ShareLink
            url={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://parliamentaudit.ca/news/${article.slug}`)}`}
            label="Facebook"
            slug={article.slug}
            platform="facebook"
          />
        </div>
        <Link
          href="/subscribe"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Get Vote Alerts
        </Link>
      </div>

      {/* Engagement tracker (fires article-engaged + article-finished) */}
      <ArticleEngagementTracker
        slug={article.slug}
        readingTimeMinutes={article.readingTimeMinutes}
      />

      {/* Steal Our Stories — per-article republish block (ProPublica pattern) */}
      <RepublishBlock
        articleSlug={article.slug}
        headline={article.headline}
        summary={article.summary}
        publishedAt={article.publishedAt}
        readingTimeMinutes={article.readingTimeMinutes}
        bodyHtml={buildRepublishBodyHtml(article.sections)}
      />
    </div>
  );
}
