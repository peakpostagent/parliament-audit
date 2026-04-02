/**
 * Parliament Audit — Dynamic OG Image Generator
 *
 * Generates a branded social card for every vote article.
 * Served at: /api/og/vote/[slug]
 *
 * Design principles (from research):
 *   • Dark background + high-contrast text — readable as a small thumbnail
 *   • PASSED / FAILED verdict is the dominant visual element
 *   • Party breakdown as horizontal bars using official party colours
 *   • Parliament Audit brand identity top-right
 *   • 1200×630 (16:9) — optimal for X/Twitter feed and Facebook
 *
 * The same image URL is referenced in article page <meta og:image> tags,
 * and stored on social post records so the auto-poster can attach it.
 */

import { ImageResponse } from '@vercel/og';
import { db, schema } from '@parliament-audit/db';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── Party colors (matches constants/parties.ts) ──────────────────────────────
// Brightened from official brand colors for legibility on dark backgrounds
const PARTY_COLORS: Record<string, string> = {
  LPC: '#F04046',   // Liberal red — brightened from #D71920
  CPC: '#5B8DD9',   // Conservative blue — brightened from #1A4782
  NDP: '#F58220',   // NDP orange — unchanged
  BQ: '#33B2CC',    // Bloc teal — unchanged
  GPC: '#4DC940',   // Green — brightened from #3D9B35
  IND: '#AAAAAA',   // Independent — lightened
};

const PARTY_LABELS: Record<string, string> = {
  LPC: 'Liberal',
  CPC: 'Conservative',
  NDP: 'NDP',
  BQ: 'Bloc',
  GPC: 'Green',
  IND: 'Independent',
};

// ─── Route handler ────────────────────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // Fetch article + vote + party results
  const article = await db.query.articles.findFirst({
    where: eq(schema.articles.slug, slug),
    with: {
      vote: {
        with: { partyResults: true },
      },
    },
  });

  if (!article) {
    return new Response('Not found', { status: 404 });
  }

  const vote = article.vote;
  const passed = vote.result?.toLowerCase().includes('agreed') || vote.result?.toLowerCase().includes('passed');
  const tied   = vote.result?.toLowerCase().includes('tie');
  const verdict = tied ? 'TIE' : passed ? 'PASSED' : 'FAILED';
  const verdictColor = tied ? '#FBBF24' : passed ? '#22C55E' : '#EF4444';

  // Sort party results: biggest caucus first
  const parties = [...(vote.partyResults ?? [])]
    .filter(p => p.yeas + p.nays > 0)
    .sort((a, b) => (b.yeas + b.nays) - (a.yeas + a.nays))
    .slice(0, 5); // max 5 parties fit cleanly

  const maxVotes = Math.max(...parties.map(p => p.yeas + p.nays), 1);
  const yeasTotal = vote.yeasTotal ?? 0;
  const naysTotal = vote.naysTotal ?? 0;

  // Truncate headline so it fits on two lines max
  const headline = article.headline.length > 90
    ? article.headline.slice(0, 88) + '…'
    : article.headline;

  const billLabel = vote.billNumber ? `${vote.billNumber}  ·  ` : '';
  const chamberLabel = vote.chamber === 'house' ? 'House of Commons' : 'Senate';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: '#0D1117',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── Background: subtle Parliament dome watermark ─────────────────── */}
        <div style={{
          position: 'absolute',
          right: '-30px',
          bottom: '-60px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(215,25,32,0.06) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* ── Top bar: branding ────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 48px 0',
        }}>
          {/* Left: chamber + vote number */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              background: '#1C2A3A',
              border: '1px solid #2D3F52',
              borderRadius: '6px',
              padding: '6px 14px',
              color: '#94A3B8',
              fontSize: '16px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              display: 'flex',
            }}>
              {chamberLabel.toUpperCase()}  ·  VOTE #{vote.voteNumber}
            </div>
            <div style={{
              color: '#64748B',
              fontSize: '15px',
              display: 'flex',
            }}>
              {vote.voteDate}
            </div>
          </div>

          {/* Right: Parliament Audit brand */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}>
            <div style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              display: 'flex',
            }}>
              Parliament<span style={{ color: '#D71920', marginLeft: '6px', display: 'flex' }}>Pulse</span>
            </div>
            <div style={{
              color: '#64748B',
              fontSize: '12px',
              letterSpacing: '0.08em',
              display: 'flex',
            }}>
              PARLIAMENTAUDIT.CA
            </div>
          </div>
        </div>

        {/* ── Red accent line ──────────────────────────────────────────────── */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(to right, #D71920, transparent)',
          margin: '20px 48px 0',
          display: 'flex',
        }} />

        {/* ── Main content area ────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          flex: 1,
          padding: '28px 48px',
          gap: '48px',
        }}>
          {/* Left column: verdict + headline + totals */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: '0 0 520px',
          }}>
            {/* Verdict badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '18px',
            }}>
              <div style={{
                background: verdictColor,
                borderRadius: '8px',
                padding: '8px 22px',
                color: '#FFFFFF',
                fontSize: '26px',
                fontWeight: '900',
                letterSpacing: '0.08em',
                display: 'flex',
              }}>
                {verdict}
              </div>
              {/* Yea / Nay totals */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <span style={{ color: '#22C55E', fontSize: '28px', fontWeight: '800', lineHeight: '1', display: 'flex' }}>
                    {yeasTotal}
                  </span>
                  <span style={{ color: '#4ADE80', fontSize: '12px', letterSpacing: '0.1em', display: 'flex' }}>YEA</span>
                </div>
                <div style={{
                  color: '#334155',
                  fontSize: '28px',
                  fontWeight: '300',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  /
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <span style={{ color: '#EF4444', fontSize: '28px', fontWeight: '800', lineHeight: '1', display: 'flex' }}>
                    {naysTotal}
                  </span>
                  <span style={{ color: '#FCA5A5', fontSize: '12px', letterSpacing: '0.1em', display: 'flex' }}>NAY</span>
                </div>
              </div>
            </div>

            {/* Headline */}
            {billLabel && (
              <div style={{
                color: '#94A3B8',
                fontSize: '15px',
                fontWeight: '600',
                letterSpacing: '0.05em',
                marginBottom: '8px',
                display: 'flex',
              }}>
                {billLabel}
              </div>
            )}
            <div style={{
              color: '#F1F5F9',
              fontSize: '26px',
              fontWeight: '700',
              lineHeight: '1.3',
              display: 'flex',
              flexWrap: 'wrap',
            }}>
              {headline}
            </div>
          </div>

          {/* Right column: party breakdown bars */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            gap: '4px',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}>
              <span style={{ color: '#64748B', fontSize: '12px', letterSpacing: '0.1em', display: 'flex' }}>
                HOW EACH PARTY VOTED
              </span>
            </div>

            {parties.map(party => {
              const color = PARTY_COLORS[party.partyShort] ?? '#888';
              const label = PARTY_LABELS[party.partyShort] ?? party.partyShort;
              const total = party.yeas + party.nays;
              const yeaWidth = total > 0 ? Math.round((party.yeas / maxVotes) * 124) : 0;
              const nayWidth = total > 0 ? Math.round((party.nays / maxVotes) * 124) : 0;
              const isYeaParty = party.yeas >= party.nays;

              return (
                <div key={party.partyShort} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '5px 0',
                }}>
                  {/* Party name */}
                  <div style={{
                    width: '100px',
                    color,
                    fontSize: '14px',
                    fontWeight: '700',
                    textAlign: 'right',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}>
                    {label}
                  </div>

                  {/* Diverging bar: YEA left, NAY right */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {/* YEA bar (grows left from center) */}
                    <div style={{
                      display: 'flex',
                      width: '130px',
                      justifyContent: 'flex-end',
                    }}>
                      {party.yeas > 0 && (
                        <div style={{
                          height: '22px',
                          width: `${yeaWidth}px`,
                          background: '#22C55E',
                          borderRadius: '3px 0 0 3px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          paddingLeft: '6px',
                          minWidth: '22px',
                        }}>
                          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700', display: 'flex' }}>
                            {party.yeas}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Centre divider */}
                    <div style={{
                      width: '2px',
                      height: '26px',
                      background: '#2D3748',
                      display: 'flex',
                    }} />

                    {/* NAY bar (grows right from center) */}
                    <div style={{
                      display: 'flex',
                      width: '130px',
                    }}>
                      {party.nays > 0 && (
                        <div style={{
                          height: '22px',
                          width: `${nayWidth}px`,
                          background: '#EF4444',
                          borderRadius: '0 3px 3px 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '6px',
                          minWidth: '22px',
                        }}>
                          <span style={{ color: 'white', fontSize: '11px', fontWeight: '700', display: 'flex' }}>
                            {party.nays}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Party split indicator */}
                  {party.yeas > 0 && party.nays > 0 && (
                    <div style={{
                      color: '#FBBF24',
                      fontSize: '11px',
                      display: 'flex',
                    }}>SPLIT</div>
                  )}
                </div>
              );
            })}

            {/* Legend */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', background: '#22C55E', borderRadius: '2px', display: 'flex' }} />
                <span style={{ color: '#64748B', fontSize: '11px', display: 'flex' }}>Voted Yea</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', background: '#EF4444', borderRadius: '2px', display: 'flex' }} />
                <span style={{ color: '#64748B', fontSize: '11px', display: 'flex' }}>Voted Nay</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom strip ─────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 48px 22px',
        }}>
          <div style={{
            color: '#475569',
            fontSize: '13px',
            display: 'flex',
          }}>
            Non-partisan · Factual · Transparent · Canada deserves to know.
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              background: '#D71920',
              borderRadius: '50%',
              display: 'flex',
            }} />
            <span style={{ color: '#64748B', fontSize: '13px', display: 'flex' }}>parliamentaudit.ca</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
