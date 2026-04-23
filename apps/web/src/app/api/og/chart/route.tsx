/**
 * Parliament Audit — Standalone Chart Images for Social Media
 *
 * Generates branded chart images for use as tweet attachments.
 * Usage: /api/og/chart?type=vote-split&title=...
 *
 * Chart types:
 *   - vote-split: horizontal bar showing Yea vs Nay by party
 *   - budget-bar: horizontal bar chart for spending/cuts
 *   - poll: vertical bar chart for polling data
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const PARTY_COLORS: Record<string, string> = {
  LPC: '#D71920',
  CPC: '#1A4782',
  NDP: '#F58220',
  BQ: '#33B2CC',
  GPC: '#3D9B35',
};

/**
 * Standardized source-attribution band — Visual Capitalist pattern.
 * Appears at the bottom of every chart image: explicit source, origin URL,
 * retrieval date, and Parliament Audit brand + URL so the image stays
 * traceable if detached from the post.
 */
function SourceFooter({
  source,
  sourceUrl,
  retrieved,
}: {
  source: string;
  sourceUrl?: string;
  retrieved: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        marginTop: '20px',
        paddingTop: '14px',
        borderTop: '1px solid #1F2A3A',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            color: '#94A3B8',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '0.12em',
            display: 'flex',
          }}
        >
          SOURCE
        </span>
        <span style={{ color: '#E2E8F0', fontSize: '14px', display: 'flex' }}>
          {source}
        </span>
        {sourceUrl && (
          <span style={{ color: '#475569', fontSize: '12px', display: 'flex' }}>
            {sourceUrl}
          </span>
        )}
        <span style={{ color: '#475569', fontSize: '11px', display: 'flex' }}>
          Retrieved {retrieved}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <span
          style={{
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '800',
            display: 'flex',
          }}
        >
          Parliament
          <span style={{ color: '#D71920', marginLeft: '4px', display: 'flex' }}>Audit</span>
        </span>
        <span
          style={{
            color: '#64748B',
            fontSize: '11px',
            letterSpacing: '0.08em',
            display: 'flex',
          }}
        >
          PARLIAMENTAUDIT.CA
        </span>
      </div>
    </div>
  );
}

function VoteSplitChart({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  // Bill C-9 vote data
  const parties = [
    { name: 'Liberal', short: 'LPC', yea: 153, nay: 0 },
    { name: 'Conservative', short: 'CPC', yea: 0, nay: 119 },
    { name: 'Bloc', short: 'BQ', yea: 33, nay: 0 },
    { name: 'NDP', short: 'NDP', yea: 0, nay: 15 },
    { name: 'Green', short: 'GPC', yea: 0, nay: 3 },
  ];

  const maxVotes = Math.max(...parties.map((p) => Math.max(p.yea, p.nay)));

  return (
    <div
      style={{
        width: '1200px',
        height: '675px',
        display: 'flex',
        flexDirection: 'column',
        background: '#0D1117',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '48px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#F1F5F9', fontSize: '32px', fontWeight: '800', display: 'flex' }}>
            {title}
          </div>
          <div style={{ color: '#94A3B8', fontSize: '18px', marginTop: '8px', display: 'flex' }}>
            {subtitle}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '800', display: 'flex' }}>
            Parliament<span style={{ color: '#D71920', marginLeft: '5px', display: 'flex' }}>Audit</span>
          </div>
          <div style={{ color: '#64748B', fontSize: '11px', letterSpacing: '0.08em', display: 'flex' }}>
            PARLIAMENTAUDIT.CA
          </div>
        </div>
      </div>

      {/* Red line */}
      <div style={{ height: '3px', background: 'linear-gradient(to right, #D71920, transparent)', marginBottom: '32px', display: 'flex' }} />

      {/* Result badges */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#22C55E', borderRadius: '6px', padding: '6px 16px', color: 'white', fontSize: '20px', fontWeight: '800', display: 'flex' }}>
            PASSED
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ color: '#22C55E', fontSize: '28px', fontWeight: '800', display: 'flex' }}>186</span>
            <span style={{ color: '#475569', fontSize: '28px', display: 'flex' }}>/</span>
            <span style={{ color: '#EF4444', fontSize: '28px', fontWeight: '800', display: 'flex' }}>137</span>
          </div>
        </div>
      </div>

      {/* Party bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {parties.map((party) => {
          const color = PARTY_COLORS[party.short] ?? '#888';
          const yeaWidth = Math.round((party.yea / maxVotes) * 500);
          const nayWidth = Math.round((party.nay / maxVotes) * 500);

          return (
            <div key={party.short} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Party label */}
              <div style={{ width: '140px', color, fontSize: '18px', fontWeight: '700', display: 'flex', justifyContent: 'flex-end' }}>
                {party.name}
              </div>

              {/* YEA bar */}
              <div style={{ display: 'flex', width: '520px', justifyContent: 'flex-end' }}>
                {party.yea > 0 && (
                  <div style={{
                    height: '36px',
                    width: `${yeaWidth}px`,
                    background: '#22C55E',
                    borderRadius: '4px 0 0 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '40px',
                  }}>
                    <span style={{ color: 'white', fontSize: '16px', fontWeight: '700', display: 'flex' }}>
                      {party.yea} YEA
                    </span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{ width: '2px', height: '40px', background: '#334155', display: 'flex' }} />

              {/* NAY bar */}
              <div style={{ display: 'flex', width: '520px' }}>
                {party.nay > 0 && (
                  <div style={{
                    height: '36px',
                    width: `${nayWidth}px`,
                    background: '#EF4444',
                    borderRadius: '0 4px 4px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '40px',
                  }}>
                    <span style={{ color: 'white', fontSize: '16px', fontWeight: '700', display: 'flex' }}>
                      {party.nay} NAY
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', background: '#22C55E', borderRadius: '2px', display: 'flex' }} />
          <span style={{ color: '#94A3B8', fontSize: '14px', display: 'flex' }}>Voted Yea (In Favour)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', background: '#EF4444', borderRadius: '2px', display: 'flex' }} />
          <span style={{ color: '#94A3B8', fontSize: '14px', display: 'flex' }}>Voted Nay (Against)</span>
        </div>
      </div>
      <SourceFooter
        source="House of Commons — 45th Parliament, 2nd Session, Recorded Division on Bill C-9"
        sourceUrl="ourcommons.ca/Members/en/Votes"
        retrieved="April 2026"
      />
    </div>
  );
}

function BudgetCutsChart() {
  const departments = [
    { name: 'Canada Revenue Agency', cuts: 2620, color: '#EF4444' },
    { name: 'Public Services & Procurement', cuts: 1793, color: '#F97316' },
    { name: 'Employment & Social Dev.', cuts: 1500, color: '#F59E0B' },
    { name: 'Global Affairs', cuts: 1240, color: '#EAB308' },
    { name: 'Health Canada', cuts: 942, color: '#84CC16' },
    { name: 'Statistics Canada', cuts: 900, color: '#22C55E' },
    { name: 'Environment & Climate', cuts: 837, color: '#14B8A6' },
  ];

  const maxCuts = Math.max(...departments.map((d) => d.cuts));

  return (
    <div
      style={{
        width: '1200px',
        height: '675px',
        display: 'flex',
        flexDirection: 'column',
        background: '#0D1117',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '48px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#F1F5F9', fontSize: '30px', fontWeight: '800', display: 'flex' }}>
            Federal Job Cuts by Department
          </div>
          <div style={{ color: '#94A3B8', fontSize: '18px', marginTop: '6px', display: 'flex' }}>
            Estimated positions eliminated · Budget 2026
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '800', display: 'flex' }}>
            Parliament<span style={{ color: '#D71920', marginLeft: '5px', display: 'flex' }}>Audit</span>
          </div>
          <div style={{ color: '#64748B', fontSize: '11px', letterSpacing: '0.08em', display: 'flex' }}>
            PARLIAMENTAUDIT.CA
          </div>
        </div>
      </div>

      {/* Red line */}
      <div style={{ height: '3px', background: 'linear-gradient(to right, #D71920, transparent)', marginBottom: '20px', display: 'flex' }} />

      {/* Total stat */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '28px' }}>
        <span style={{ color: '#EF4444', fontSize: '42px', fontWeight: '900', display: 'flex' }}>~10,000</span>
        <span style={{ color: '#94A3B8', fontSize: '20px', display: 'flex' }}>total positions across government</span>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {departments.map((dept) => {
          const barWidth = Math.round((dept.cuts / maxCuts) * 650);

          return (
            <div key={dept.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '260px', color: '#CBD5E1', fontSize: '16px', fontWeight: '500', display: 'flex', justifyContent: 'flex-end' }}>
                {dept.name}
              </div>
              <div style={{
                height: '32px',
                width: `${barWidth}px`,
                background: dept.color,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '12px',
                minWidth: '80px',
              }}>
                <span style={{ color: 'white', fontSize: '15px', fontWeight: '700', display: 'flex' }}>
                  {dept.cuts.toLocaleString()} positions
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary line */}
      <span style={{ color: '#64748B', fontSize: '13px', marginTop: '12px', display: 'flex' }}>
        $60.6 billion in total spending reductions over 4 years
      </span>
      <SourceFooter
        source="Treasury Board Secretariat & departmental Main Estimates 2026-27"
        sourceUrl="canada.ca/en/treasury-board-secretariat"
        retrieved="April 2026"
      />
    </div>
  );
}

function FloorCrossingPollChart() {
  const pollData = [
    { label: 'Should face\nbyelection', value: 74, color: '#EF4444' },
    { label: 'Can serve\nout term', value: 26, color: '#3B82F6' },
  ];

  const partyData = [
    { party: 'CPC voters', value: 81, color: '#1A4782' },
    { party: 'NDP voters', value: 77, color: '#F58220' },
    { party: 'LPC voters', value: 68, color: '#D71920' },
  ];

  return (
    <div
      style={{
        width: '1200px',
        height: '675px',
        display: 'flex',
        flexDirection: 'column',
        background: '#0D1117',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '48px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#F1F5F9', fontSize: '30px', fontWeight: '800', display: 'flex' }}>
            Should Floor-Crossing MPs Face a Byelection?
          </div>
          <div style={{ color: '#94A3B8', fontSize: '18px', marginTop: '6px', display: 'flex' }}>
            Angus Reid Institute · April 10–12, 2026
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '800', display: 'flex' }}>
            Parliament<span style={{ color: '#D71920', marginLeft: '5px', display: 'flex' }}>Audit</span>
          </div>
          <div style={{ color: '#64748B', fontSize: '11px', letterSpacing: '0.08em', display: 'flex' }}>
            PARLIAMENTAUDIT.CA
          </div>
        </div>
      </div>

      {/* Red line */}
      <div style={{ height: '3px', background: 'linear-gradient(to right, #D71920, transparent)', marginBottom: '36px', display: 'flex' }} />

      {/* Main content: two columns */}
      <div style={{ display: 'flex', gap: '60px', flex: 1 }}>
        {/* Left: Big number */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '0 0 400px' }}>
          <div style={{ color: '#EF4444', fontSize: '120px', fontWeight: '900', lineHeight: '1', display: 'flex' }}>
            74%
          </div>
          <div style={{ color: '#CBD5E1', fontSize: '22px', fontWeight: '600', marginTop: '12px', textAlign: 'center', display: 'flex' }}>
            say MPs should face a byelection
          </div>
          <div style={{ color: '#64748B', fontSize: '16px', marginTop: '8px', display: 'flex' }}>
            vs. 26% who say they can serve out their term
          </div>
        </div>

        {/* Right: Party breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          <div style={{ color: '#94A3B8', fontSize: '14px', letterSpacing: '0.1em', marginBottom: '20px', display: 'flex' }}>
            SUPPORT BY PARTY AFFILIATION
          </div>

          {partyData.map((item) => (
            <div key={item.party} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '120px', color: '#CBD5E1', fontSize: '16px', fontWeight: '600', display: 'flex' }}>
                {item.party}
              </div>
              <div style={{ display: 'flex', flex: 1, background: '#1C2A3A', borderRadius: '6px', height: '36px', overflow: 'hidden' }}>
                <div style={{
                  width: `${item.value}%`,
                  background: item.color,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '12px',
                }}>
                  <span style={{ color: 'white', fontSize: '16px', fontWeight: '700', display: 'flex' }}>
                    {item.value}%
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div style={{ color: '#475569', fontSize: '13px', marginTop: '12px', display: 'flex' }}>
            {'"Should an MP who crosses the floor be required to resign and run in a byelection?"'}
          </div>
        </div>
      </div>

      <SourceFooter
        source="Angus Reid Institute public opinion survey, n=1,607 Canadian adults"
        sourceUrl="angusreid.org"
        retrieved="April 2026"
      />
    </div>
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') ?? 'vote-split';

  let element: React.ReactElement;

  switch (type) {
    case 'budget-cuts':
      element = <BudgetCutsChart />;
      break;
    case 'floor-crossing-poll':
      element = <FloorCrossingPollChart />;
      break;
    case 'vote-split':
    default:
      element = (
        <VoteSplitChart
          title={searchParams.get('title') ?? 'Bill C-9: How Each Party Voted'}
          subtitle={searchParams.get('subtitle') ?? 'Combatting Hate Act · Third Reading · March 25, 2026'}
        />
      );
      break;
  }

  return new ImageResponse(element, { width: 1200, height: 675 });
}
