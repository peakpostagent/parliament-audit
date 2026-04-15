import { db, schema } from '@parliament-audit/db';
import { desc, eq, sql } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function findMemberBySlug(slug: string) {
  // Query all distinct member names, then match by slugified name.
  // Once we have more MPs, we'll index this. For now, the set is small.
  const rows = await db
    .selectDistinct({
      memberName: schema.voteMemberResults.memberName,
      memberId: schema.voteMemberResults.memberId,
      partyShort: schema.voteMemberResults.partyShort,
      constituency: schema.voteMemberResults.constituency,
      province: schema.voteMemberResults.province,
    })
    .from(schema.voteMemberResults);

  return rows.find((r) => slugify(r.memberName) === slug) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await findMemberBySlug(slug);
  if (!member) {
    return { title: 'MP Not Found' };
  }
  return {
    title: `${member.memberName} — Voting Record`,
    description: `See how ${member.memberName} (${member.partyShort}, ${member.constituency}) has voted in Canada's Parliament.`,
  };
}

const PARTY_NAMES: Record<string, string> = {
  LPC: 'Liberal',
  CPC: 'Conservative',
  NDP: 'NDP',
  BQ: 'Bloc Québécois',
  GPC: 'Green',
  IND: 'Independent',
};

const PARTY_COLORS: Record<string, string> = {
  LPC: 'bg-red-600',
  CPC: 'bg-blue-700',
  NDP: 'bg-orange-500',
  BQ: 'bg-cyan-600',
  GPC: 'bg-green-600',
  IND: 'bg-gray-500',
};

export default async function MPPage({ params }: PageProps) {
  const { slug } = await params;
  const member = await findMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  // Fetch recent votes for this MP
  const memberVotes = await db
    .select({
      voteCast: schema.voteMemberResults.voteCast,
      voteNumber: schema.votes.voteNumber,
      voteDate: schema.votes.voteDate,
      chamber: schema.votes.chamber,
      billNumber: schema.votes.billNumber,
      subjectText: schema.votes.subjectText,
      result: schema.votes.result,
      articleSlug: schema.articles.slug,
      articleHeadline: schema.articles.headline,
    })
    .from(schema.voteMemberResults)
    .innerJoin(schema.votes, eq(schema.voteMemberResults.voteId, schema.votes.id))
    .leftJoin(schema.articles, eq(schema.articles.voteId, schema.votes.id))
    .where(eq(schema.voteMemberResults.memberName, member.memberName))
    .orderBy(desc(schema.votes.voteDate))
    .limit(50);

  // Calculate voting stats
  const stats = memberVotes.reduce(
    (acc, v) => {
      acc[v.voteCast] = (acc[v.voteCast] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const totalVotes = memberVotes.length;
  const participation =
    totalVotes > 0
      ? Math.round(((totalVotes - (stats.absent || 0)) / totalVotes) * 100)
      : 0;

  const partyName = PARTY_NAMES[member.partyShort] || member.partyShort;
  const partyColor = PARTY_COLORS[member.partyShort] || 'bg-gray-500';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <a href="/" className="hover:text-red-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/find-your-mp" className="hover:text-red-600">MPs</a>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{member.memberName}</span>
      </nav>

      {/* Header */}
      <div className="bg-[#1a1a2e] text-white rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Member of Parliament</p>
            <h1 className="text-3xl font-bold">{member.memberName}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`${partyColor} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                {partyName}
              </span>
              {member.constituency && (
                <span className="text-sm text-gray-300">{member.constituency}</span>
              )}
              {member.province && (
                <span className="text-sm text-gray-400">· {member.province}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {totalVotes > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard label="Recorded votes" value={totalVotes.toString()} />
          <StatCard label="Yea" value={(stats.yea || 0).toString()} accent="text-green-700" />
          <StatCard label="Nay" value={(stats.nay || 0).toString()} accent="text-red-700" />
          <StatCard label="Participation" value={`${participation}%`} />
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-8">
          <p className="text-gray-600">
            No recorded votes tracked for {member.memberName} yet. Check back soon — we&apos;re monitoring Parliament daily.
          </p>
        </div>
      )}

      {/* Voting record */}
      {memberVotes.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Recent Voting Record</h2>
          <div className="space-y-2">
            {memberVotes.map((v, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white border rounded-lg p-3 hover:border-gray-300 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {v.articleSlug ? (
                      <a href={`/vote/${v.articleSlug}`} className="hover:text-red-600">
                        {v.articleHeadline || v.subjectText}
                      </a>
                    ) : (
                      v.subjectText
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {v.chamber === 'house' ? 'House' : 'Senate'} · Vote #{v.voteNumber} · {v.voteDate}
                    {v.billNumber && ` · ${v.billNumber}`}
                  </p>
                </div>
                <VoteCastBadge cast={v.voteCast} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="mt-8 bg-red-600 text-white rounded-lg p-6">
        <h3 className="font-bold text-lg mb-1">Track {member.memberName.split(' ').slice(-1)[0]}&apos;s votes</h3>
        <p className="text-red-100 text-sm mb-3">
          Get notified every time Parliament holds a recorded vote.
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

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent || 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function VoteCastBadge({ cast }: { cast: string }) {
  const config: Record<string, { label: string; className: string }> = {
    yea: { label: 'Yea', className: 'bg-green-100 text-green-800' },
    nay: { label: 'Nay', className: 'bg-red-100 text-red-800' },
    paired: { label: 'Paired', className: 'bg-gray-100 text-gray-700' },
    abstention: { label: 'Abstained', className: 'bg-amber-100 text-amber-800' },
    absent: { label: 'Absent', className: 'bg-gray-100 text-gray-500' },
  };
  const { label, className } = config[cast] || { label: cast, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded ${className} whitespace-nowrap ml-3`}>
      {label}
    </span>
  );
}
