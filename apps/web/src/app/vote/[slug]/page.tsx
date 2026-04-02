import { db, schema } from '@parliament-audit/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PartyBreakdown } from '@/components/PartyBreakdownBar';
import { StatusBadge, ResultBadge } from '@/components/StatusBadge';
import { VerificationBox } from '@/components/VerificationBox';
import { FactBox } from '@/components/FactBox';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { RecentVotesSidebar } from '@/components/RecentVotesSidebar';
import { VOTE_TYPE_LABELS } from '@parliament-audit/shared';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  return db.query.articles.findFirst({
    where: eq(schema.articles.slug, slug),
    with: {
      vote: {
        with: {
          partyResults: true,
        },
      },
      corrections: true,
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Vote Not Found — Parliament Audit' };

  const ogImageUrl = `https://parliamentaudit.ca/api/og/vote/${slug}`;

  return {
    title: `${article.headline} — Parliament Audit`,
    description: article.summary,
    openGraph: {
      title: article.headline,
      description: article.summary,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: article.headline }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.headline,
      description: article.summary,
      images: [ogImageUrl],
    },
  };
}

export default async function VoteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const vote = article.vote;
  const chamberLabel = vote.chamber === 'house' ? 'House of Commons' : 'Senate';
  const typeLabel = VOTE_TYPE_LABELS[vote.voteType as keyof typeof VOTE_TYPE_LABELS] || vote.voteType;
  const factBox = article.factBoxJson as any;
  const sources = (article.sourcesJson as any)?.sources || [];
  const hasCorrections = article.corrections && article.corrections.length > 0;

  return (
    <div className="flex gap-8 max-w-6xl mx-auto">
      {/* Left sidebar — recent votes list */}
      <RecentVotesSidebar currentSlug={slug} />

    <article className="flex-1 min-w-0">
      {/* Correction banner */}
      {hasCorrections && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 font-medium">
            This article has been updated since initial publication.
          </p>
          {article.corrections.map((c: any) => (
            <p key={c.id} className="text-sm text-blue-700 mt-1">{c.description}</p>
          ))}
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
        <span className="font-medium uppercase">{vote.chamber === 'house' ? 'House' : 'Senate'} Vote #{vote.voteNumber}</span>
        <span>|</span>
        <span>{vote.voteDate}</span>
        <span>|</span>
        <span>{typeLabel}</span>
        <StatusBadge status={vote.recordStatus} />
      </div>

      {/* Headline */}
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{article.headline}</h1>
      {article.subheadline && (
        <p className="text-lg text-gray-600 mb-6">{article.subheadline}</p>
      )}

      {/* Summary box */}
      <div className="bg-gray-50 border-l-4 border-red-600 p-4 rounded-r-lg mb-8">
        <p className="font-medium">{article.summary}</p>
      </div>

      {/* What Happened */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">What Happened</h2>
        <div className="prose prose-gray max-w-none">
          {article.whatHappened.split('\n\n').map((p: string, i: number) => (
            <p key={i} className="mb-3 text-gray-700 leading-relaxed">{p}</p>
          ))}
        </div>
      </section>

      {/* Party Breakdown */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">How Each Party Voted</h2>
        <PartyBreakdown partyResults={vote.partyResults} />
        <div className="mt-3">
          <ResultBadge result={vote.result} yeas={vote.yeasTotal} nays={vote.naysTotal} />
        </div>
        <div className="mt-4 prose prose-gray max-w-none text-sm">
          {article.partyBreakdown.split('\n').map((line: string, i: number) => (
            <p key={i} className="mb-1 text-gray-700">{line}</p>
          ))}
        </div>
      </section>

      {/* Why It Matters */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Why This Matters</h2>
        <div className="prose prose-gray max-w-none">
          {article.whyItMatters.split('\n\n').map((p: string, i: number) => (
            <p key={i} className="mb-3 text-gray-700 leading-relaxed">{p}</p>
          ))}
        </div>
      </section>

      {/* What Happens Next */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">What Happens Next</h2>
        <div className="prose prose-gray max-w-none">
          {article.whatNext.split('\n\n').map((p: string, i: number) => (
            <p key={i} className="mb-3 text-gray-700 leading-relaxed">{p}</p>
          ))}
        </div>
      </section>

      {/* Fact Box */}
      {factBox && (
        <FactBox {...factBox} />
      )}

      {/* Verification Box */}
      <VerificationBox
        verificationText={article.verificationText}
        sources={sources}
        recordStatus={vote.recordStatus}
        lastVerifiedAt={article.lastVerifiedAt?.toISOString() || null}
      />

      {/* Share */}
      <div className="mt-8 pt-6 border-t flex items-center gap-4">
        <span className="text-sm font-medium text-gray-500">Share:</span>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://parliamentaudit.ca/vote/${article.slug}`)}&text=${encodeURIComponent(article.headline)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          X / Twitter
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://parliamentaudit.ca/vote/${article.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Facebook
        </a>
        <CopyLinkButton url={`https://parliamentaudit.ca/vote/${article.slug}`} />
      </div>
    </article>
    </div>
  );
}
