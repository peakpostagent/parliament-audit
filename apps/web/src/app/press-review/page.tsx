import type { Metadata } from 'next';
import Link from 'next/link';
import { newsArticles, slugifyTag } from '@/content/news-articles';

export const metadata: Metadata = {
  title: 'Press Review — Parliament Audit',
  description:
    'How Canadian press outlets framed the week\u2019s parliamentary stories. A weekly column: what the wire desks led with, what the op-ed pages argued, and who did not cover it at all.',
  alternates: { canonical: '/press-review' },
};

/**
 * Dedicated landing page for the Press Review column — a pretty-URL
 * alternative to /tag/press-review. Same underlying filter, different
 * framing: this page sells the column to a new reader before showing
 * the archive.
 */
export default function PressReviewPage() {
  const articles = newsArticles
    .filter((a) => a.category === 'Press Review')
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-red-600">
          Home
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-gray-700">Press Review</span>
      </nav>

      <header className="border-b border-gray-200 pb-6 mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-red-700 mb-2">
          A weekly column
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-3">
          How the press covered this week
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Canadian parliamentary stories get told in a hundred places. We
          read all of them, line the coverage up side-by-side, and report on
          what emerges when one news cycle produces two incompatible stories.
          Non-partisan media criticism, evidence first.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
          Recent columns
        </h2>
        {articles.length === 0 ? (
          <p className="text-gray-600">No columns published yet.</p>
        ) : (
          <ul className="space-y-6">
            {articles.map((a) => {
              const date = new Date(a.publishedAt).toLocaleDateString('en-CA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              return (
                <li key={a.slug} className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <time dateTime={a.publishedAt}>{date}</time>
                    <span aria-hidden="true">·</span>
                    <span>{a.readingTimeMinutes} min read</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">
                    <Link
                      href={`/news/${a.slug}`}
                      className="text-[#1a1a2e] hover:text-red-700 transition-colors"
                    >
                      {a.headline}
                    </Link>
                  </h3>
                  {a.subheadline && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {a.subheadline}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {a.tags
                      .filter((t) => t !== 'press review')
                      .slice(0, 4)
                      .map((tag) => (
                        <Link
                          key={tag}
                          href={`/tag/${slugifyTag(tag)}`}
                          className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded hover:bg-gray-200 hover:text-[#1a1a2e] transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">
          What we are (and are not) doing
        </h2>
        <div className="space-y-2 text-sm text-gray-800 leading-relaxed">
          <p>
            <strong>We are:</strong> lining up evidence from multiple outlets,
            identifying where coverage converges and where it splits, and
            flagging the gaps where a story went unreported.
          </p>
          <p>
            <strong>We are not:</strong> telling you which outlet is &ldquo;right.&rdquo;
            We do not rate outlets on a scale. We do not call stories &ldquo;biased&rdquo; in
            the abstract. The framing choice each paper made on a specific
            story is the data. The pattern is what we report.
          </p>
          <p>
            <strong>Cadence:</strong> planned weekly, usually Fridays. If a
            week is quiet we skip — we will not manufacture columns to fill
            the schedule.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">Methodology</h2>
        <p className="text-gray-800 leading-relaxed text-sm">
          Each column reviews at least 8 Canadian outlets with a confirmable
          piece on the subject story. We quote headlines verbatim, link to
          the original article, and do not characterize framing we cannot
          support with a specific quote or lead paragraph. Research notes are
          saved alongside each column. When an outlet is paywalled, we flag
          it as such rather than infer framing from the headline alone.
        </p>
      </section>

      <section className="mb-8 text-sm text-gray-600">
        <span>
          Subscribe to just this column:{' '}
          <a
            href="/press-review/rss.xml"
            className="text-red-700 hover:underline"
          >
            RSS feed →
          </a>
        </span>
      </section>

      <section className="bg-[#1a1a2e] text-white rounded-lg p-6">
        <h2 className="text-lg font-bold mb-2">Tip us a story</h2>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          See a parliamentary story that got covered very differently by
          two outlets? Email{' '}
          <a
            href="mailto:hello@parliamentaudit.ca"
            className="text-red-300 hover:underline"
          >
            hello@parliamentaudit.ca
          </a>{' '}
          with both links. We&apos;ll take a look.
        </p>
      </section>
    </div>
  );
}
