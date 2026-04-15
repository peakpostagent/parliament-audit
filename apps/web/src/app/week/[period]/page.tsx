import { db, schema } from '@parliament-audit/db';
import { and, eq, gte, lte, desc } from 'drizzle-orm';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

interface PageProps {
  params: Promise<{ period: string }>;
}

// Parse YYYY-Www (e.g. "2026-W15") into { start, end } ISO dates (Mon-Sun).
function parseIsoWeek(period: string): { year: number; week: number; start: Date; end: Date } | null {
  const match = period.match(/^(\d{4})-W(\d{1,2})$/i);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const week = parseInt(match[2], 10);
  if (week < 1 || week > 53) return null;

  // ISO 8601: week 1 contains Jan 4.
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4DayOfWeek = jan4.getUTCDay() || 7; // Mon=1..Sun=7
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setUTCDate(jan4.getUTCDate() - (jan4DayOfWeek - 1));

  const start = new Date(mondayOfWeek1);
  start.setUTCDate(mondayOfWeek1.getUTCDate() + (week - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  return { year, week, start, end };
}

function formatIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatLongDate(d: Date): string {
  return d.toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

async function getWeekVotes(startIso: string, endIso: string) {
  return db
    .select({
      voteId: schema.votes.id,
      voteNumber: schema.votes.voteNumber,
      voteDate: schema.votes.voteDate,
      chamber: schema.votes.chamber,
      subjectText: schema.votes.subjectText,
      billNumber: schema.votes.billNumber,
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
    .where(
      and(
        gte(schema.votes.voteDate, startIso),
        lte(schema.votes.voteDate, endIso),
      ),
    )
    .orderBy(desc(schema.votes.voteDate));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { period } = await params;
  const parsed = parseIsoWeek(period);
  if (!parsed) return { title: 'Invalid week' };
  const label = `Week ${parsed.week}, ${parsed.year}`;
  return {
    title: `${label} in Parliament`,
    description: `Every recorded House and Senate vote from ${formatLongDate(parsed.start)} to ${formatLongDate(parsed.end)}.`,
    alternates: { canonical: `/week/${period.toUpperCase()}` },
  };
}

export default async function WeekPage({ params }: PageProps) {
  const { period } = await params;
  const parsed = parseIsoWeek(period);
  if (!parsed) notFound();

  const startIso = formatIsoDate(parsed.start);
  const endIso = formatIsoDate(parsed.end);
  const rows = await getWeekVotes(startIso, endIso);

  const houseCount = rows.filter((r) => r.chamber === 'house').length;
  const senateCount = rows.filter((r) => r.chamber === 'senate').length;
  const passedCount = rows.filter((r) => r.result === 'passed').length;

  // Group by day
  const byDay = new Map<string, typeof rows>();
  for (const r of rows) {
    const key = r.voteDate;
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(r);
  }
  const sortedDays = Array.from(byDay.keys()).sort().reverse();

  // Prev/next week nav
  const prevStart = new Date(parsed.start);
  prevStart.setUTCDate(prevStart.getUTCDate() - 7);
  const nextStart = new Date(parsed.start);
  nextStart.setUTCDate(nextStart.getUTCDate() + 7);
  const prevPeriod = isoWeekString(prevStart);
  const nextPeriod = isoWeekString(nextStart);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-red-600">Home</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <Link href="/archive" className="hover:text-red-600">Archive</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span className="text-gray-700">Week {parsed.week}, {parsed.year}</span>
      </nav>

      {/* Header */}
      <div className="bg-[#1a1a2e] text-white rounded-lg p-6 mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Weekly Roundup</p>
        <h1 className="text-3xl font-bold mb-1">Week {parsed.week}, {parsed.year}</h1>
        <p className="text-gray-300 text-sm">
          {formatLongDate(parsed.start)} — {formatLongDate(parsed.end)}
        </p>
      </div>

      {/* Stats */}
      {rows.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total votes" value={rows.length.toString()} />
          <StatCard label="House" value={houseCount.toString()} />
          <StatCard label="Senate" value={senateCount.toString()} />
          <StatCard label="Passed" value={passedCount.toString()} accent="text-green-700" />
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-8">
          <p className="text-gray-600 mb-2">
            No recorded votes tracked for this week.
          </p>
          <p className="text-sm text-gray-500">
            Parliament may have been in recess, or we haven&apos;t ingested this period yet.
          </p>
        </div>
      )}

      {/* By day */}
      {sortedDays.length > 0 && (
        <section className="mb-8">
          {sortedDays.map((day) => (
            <div key={day} className="mb-8">
              <h2 className="text-lg font-bold mb-3 text-gray-800 border-b pb-1">
                {formatLongDate(new Date(day + 'T00:00:00Z'))}
              </h2>
              <div className="space-y-2">
                {byDay.get(day)!.map((v) => (
                  <div
                    key={v.voteId}
                    className="flex items-start justify-between bg-white border rounded-lg p-3 hover:border-gray-300 transition-colors gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {v.articleSlug && v.articleStatus === 'published' ? (
                          <a href={`/vote/${v.articleSlug}`} className="hover:text-red-600">
                            {v.articleHeadline || v.subjectText}
                          </a>
                        ) : (
                          v.articleHeadline || v.subjectText
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {v.chamber === 'house' ? 'House' : 'Senate'} · Vote #{v.voteNumber}
                        {v.billNumber && (
                          <>
                            {' · '}
                            <a href={`/bill/${v.billNumber}`} className="hover:text-red-600 underline">
                              {v.billNumber}
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                    <ResultPill result={v.result} yeas={v.yeasTotal} nays={v.naysTotal} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Week nav */}
      <nav className="flex items-center justify-between border-t pt-4" aria-label="Week navigation">
        <Link
          href={`/week/${prevPeriod}`}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← Previous week
        </Link>
        <Link
          href="/archive"
          className="text-sm text-gray-500 hover:text-red-600"
        >
          All weeks
        </Link>
        <Link
          href={`/week/${nextPeriod}`}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Next week →
        </Link>
      </nav>
    </div>
  );
}

function isoWeekString(d: Date): string {
  // ISO week number calculation for a given UTC date
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${target.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent || 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function ResultPill({ result, yeas, nays }: { result: string; yeas: number; nays: number }) {
  const config: Record<string, string> = {
    passed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    tied: 'bg-amber-100 text-amber-800',
  };
  const cls = config[result] || 'bg-gray-100 text-gray-700';
  const label = result.charAt(0).toUpperCase() + result.slice(1);
  return (
    <div className="flex flex-col items-end gap-1 shrink-0">
      <span className={`text-xs font-medium px-2 py-0.5 rounded ${cls} whitespace-nowrap`}>
        {label}
      </span>
      <span className="text-xs text-gray-500 whitespace-nowrap">
        {yeas}–{nays}
      </span>
    </div>
  );
}
