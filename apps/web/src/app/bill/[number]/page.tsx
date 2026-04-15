import { db, schema } from '@parliament-audit/db';
import { desc, eq, asc } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

interface PageProps {
  params: Promise<{ number: string }>;
}

// Normalize bill numbers like "c-5" or "C 5" into the canonical "C-5" form.
function normalizeBillNumber(raw: string): string {
  const trimmed = decodeURIComponent(raw).trim().toUpperCase();
  // Collapse any separator between letter and digits into a hyphen
  return trimmed.replace(/^([A-Z]+)[^A-Z0-9]*([0-9]+)$/, '$1-$2');
}

async function findBillVotes(billNumber: string) {
  return db
    .select({
      voteId: schema.votes.id,
      voteNumber: schema.votes.voteNumber,
      voteDate: schema.votes.voteDate,
      chamber: schema.votes.chamber,
      subjectText: schema.votes.subjectText,
      billTitle: schema.votes.billTitle,
      billStage: schema.votes.billStage,
      billUrl: schema.votes.billUrl,
      legisinfoUrl: schema.votes.legisinfoUrl,
      sponsorName: schema.votes.sponsorName,
      sponsorParty: schema.votes.sponsorParty,
      result: schema.votes.result,
      yeasTotal: schema.votes.yeasTotal,
      naysTotal: schema.votes.naysTotal,
      voteType: schema.votes.voteType,
      articleSlug: schema.articles.slug,
      articleHeadline: schema.articles.headline,
      articleSummary: schema.articles.summary,
      articleStatus: schema.articles.status,
    })
    .from(schema.votes)
    .leftJoin(schema.articles, eq(schema.articles.voteId, schema.votes.id))
    .where(eq(schema.votes.billNumber, billNumber))
    .orderBy(asc(schema.votes.voteDate));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { number } = await params;
  const billNumber = normalizeBillNumber(number);
  const votes = await findBillVotes(billNumber);
  const first = votes[0];
  if (!first) {
    return { title: `Bill ${billNumber} — Not Found` };
  }
  const title = first.billTitle || `Bill ${billNumber}`;
  return {
    title: `${billNumber} — ${title}`,
    description: `Every recorded vote on ${billNumber}${first.billTitle ? ` (${first.billTitle})` : ''} in Canada's Parliament.`,
    alternates: { canonical: `/bill/${billNumber}` },
  };
}

export default async function BillPage({ params }: PageProps) {
  const { number } = await params;
  const billNumber = normalizeBillNumber(number);
  const votes = await findBillVotes(billNumber);

  if (votes.length === 0) {
    notFound();
  }

  const billTitle = votes.find((v) => v.billTitle)?.billTitle || null;
  const sponsor = votes.find((v) => v.sponsorName);
  const legisinfoUrl = votes.find((v) => v.legisinfoUrl)?.legisinfoUrl;
  const billUrl = votes.find((v) => v.billUrl)?.billUrl;

  // Latest stage reached = last vote in chronological order
  const latest = votes[votes.length - 1];
  const passedCount = votes.filter((v) => v.result === 'passed').length;
  const failedCount = votes.filter((v) => v.result === 'failed').length;

  const isSenate = billNumber.startsWith('S-');
  const originChamber = isSenate ? 'Senate' : 'House of Commons';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <a href="/" className="hover:text-red-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/archive" className="hover:text-red-600">Archive</a>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Bill {billNumber}</span>
      </nav>

      {/* Header */}
      <div className="bg-[#1a1a2e] text-white rounded-lg p-6 mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
          {originChamber} Bill
        </p>
        <h1 className="text-3xl font-bold mb-2">Bill {billNumber}</h1>
        {billTitle && (
          <p className="text-lg text-gray-200">{billTitle}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-300">
          {sponsor?.sponsorName && (
            <span>
              Sponsored by <span className="font-medium text-white">{sponsor.sponsorName}</span>
              {sponsor.sponsorParty && ` (${sponsor.sponsorParty})`}
            </span>
          )}
          {latest.billStage && (
            <>
              <span aria-hidden="true">·</span>
              <span>Latest stage: {latest.billStage}</span>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Recorded votes" value={votes.length.toString()} />
        <StatCard label="Passed" value={passedCount.toString()} accent="text-green-700" />
        <StatCard label="Failed" value={failedCount.toString()} accent="text-red-700" />
        <StatCard label="Latest result" value={capitalize(latest.result)} />
      </div>

      {/* Timeline */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Vote Timeline</h2>
        <ol className="relative border-l-2 border-gray-200 ml-2">
          {votes.map((v) => (
            <li key={v.voteId} className="mb-6 ml-6">
              <span className="absolute -left-[9px] flex items-center justify-center w-4 h-4 bg-white border-2 border-red-600 rounded-full" />
              <div className="bg-white border rounded-lg p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    {v.chamber === 'house' ? 'House' : 'Senate'} · Vote #{v.voteNumber} · {v.voteDate}
                  </div>
                  <ResultPill result={v.result} />
                </div>
                <p className="font-medium text-sm mb-1">
                  {v.articleSlug && v.articleStatus === 'published' ? (
                    <a href={`/vote/${v.articleSlug}`} className="hover:text-red-600">
                      {v.articleHeadline || v.subjectText}
                    </a>
                  ) : (
                    v.articleHeadline || v.subjectText
                  )}
                </p>
                {v.billStage && (
                  <p className="text-xs text-gray-500 mb-1">Stage: {v.billStage}</p>
                )}
                <p className="text-xs text-gray-500">
                  Yeas: <span className="font-medium text-gray-700">{v.yeasTotal}</span>
                  {' · '}
                  Nays: <span className="font-medium text-gray-700">{v.naysTotal}</span>
                </p>
                {v.articleSummary && v.articleStatus === 'published' && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{v.articleSummary}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Official links */}
      {(legisinfoUrl || billUrl) && (
        <section className="mb-8 bg-gray-50 border rounded-lg p-4">
          <h3 className="font-bold mb-2 text-sm uppercase tracking-wide text-gray-600">
            Official Sources
          </h3>
          <ul className="space-y-1 text-sm">
            {legisinfoUrl && (
              <li>
                <a
                  href={legisinfoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  LEGISinfo — full legislative history
                </a>
              </li>
            )}
            {billUrl && (
              <li>
                <a
                  href={billUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Bill text
                </a>
              </li>
            )}
          </ul>
        </section>
      )}

      {/* CTA */}
      <div className="bg-red-600 text-white rounded-lg p-6">
        <h3 className="font-bold text-lg mb-1">Follow {billNumber}</h3>
        <p className="text-red-100 text-sm mb-3">
          Get notified every time Parliament holds another vote on this bill.
        </p>
        <a
          href="/subscribe"
          className="inline-block bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded font-medium text-sm transition-colors"
        >
          Subscribe for Vote Alerts
        </a>
      </div>
    </div>
  );
}

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent || 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function ResultPill({ result }: { result: string }) {
  const config: Record<string, string> = {
    passed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    tied: 'bg-amber-100 text-amber-800',
  };
  const cls = config[result] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${cls} whitespace-nowrap`}>
      {capitalize(result)}
    </span>
  );
}
