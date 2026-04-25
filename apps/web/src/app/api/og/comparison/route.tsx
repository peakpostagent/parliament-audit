/**
 * Parliament Audit — Comparison-style OG Image
 *
 * Generates a 1200x630 split-portrait social card. Used for stories where
 * the juxtaposition of two figures (or one figure at two moments) IS the
 * story — floor-crossings, contradictions, before/after.
 *
 * Inspired by the @401_da_sarpanch X-screenshot format (split faces +
 * bold caption) but rendered server-side from our brand system using
 * portrait photos sourced from ourcommons.ca (Crown copyright; non-
 * commercial editorial reproduction permitted with attribution) or
 * Wikimedia Commons.
 *
 * Two ways to invoke:
 *
 *   /api/og/comparison?slug=marilyn-gladu-byelection-pledge-then-floor-cross
 *     — pulls subjects[] from the article. Standard usage.
 *
 *   /api/og/comparison?headline=...&l_name=...&l_role=...&l_party=...&r_name=...&r_role=...&r_party=...
 *     — fully manual override. For ad-hoc graphics outside an article.
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getNewsArticle } from '@/content/news-articles';

export const runtime = 'nodejs';

const PARTY_COLORS: Record<string, string> = {
  LPC: '#D71920',
  CPC: '#1E3A8A',
  NDP: '#F58220',
  BQ: '#0E97D5',
  GPC: '#3D9B35',
  IND: '#6B7280',
};

const PARTY_LABELS: Record<string, string> = {
  LPC: 'Liberal',
  CPC: 'Conservative',
  NDP: 'NDP',
  BQ: 'Bloc Québécois',
  GPC: 'Green',
  IND: 'Independent',
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');

  let headline = '';
  let leftName = url.searchParams.get('l_name') || '';
  let leftRole = url.searchParams.get('l_role') || '';
  let leftParty = url.searchParams.get('l_party') || '';
  let leftPortrait = url.searchParams.get('l_portrait') || '';
  let leftCaption = url.searchParams.get('l_caption') || '';
  let rightName = url.searchParams.get('r_name') || '';
  let rightRole = url.searchParams.get('r_role') || '';
  let rightParty = url.searchParams.get('r_party') || '';
  let rightPortrait = url.searchParams.get('r_portrait') || '';
  let rightCaption = url.searchParams.get('r_caption') || '';
  let category = url.searchParams.get('category') || 'ACCOUNTABILITY';

  if (slug) {
    const article = getNewsArticle(slug);
    if (article && article.subjects && article.subjects.length >= 2) {
      headline = article.headline;
      category = article.category.toUpperCase();
      const [a, b] = article.subjects;
      leftName = a.name;
      leftRole = a.role;
      leftParty = a.party || '';
      leftPortrait = a.portraitUrl || '';
      leftCaption = a.caption || '';
      rightName = b.name;
      rightRole = b.role;
      rightParty = b.party || '';
      rightPortrait = b.portraitUrl || '';
      rightCaption = b.caption || '';
    }
  }

  if (!headline) {
    headline = url.searchParams.get('headline') || 'Parliament Audit';
  }

  const leftAccent = PARTY_COLORS[leftParty] || '#D71920';
  const rightAccent = PARTY_COLORS[rightParty] || '#1E3A8A';

  // Truncate headline so it fits without breaking layout
  const trimmedHeadline =
    headline.length > 110 ? headline.slice(0, 107).trim() + '…' : headline;

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
        }}
      >
        {/* Top brand band */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 56px',
            borderBottom: '1px solid #1F2A3A',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                color: '#FFFFFF',
                fontSize: '22px',
                fontWeight: 800,
                display: 'flex',
              }}
            >
              Parliament
              <span style={{ color: '#D71920', marginLeft: '6px', display: 'flex' }}>
                Audit
              </span>
            </span>
          </div>
          <span
            style={{
              color: '#D71920',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              padding: '6px 12px',
              background: 'rgba(215, 25, 32, 0.12)',
              border: '1px solid rgba(215, 25, 32, 0.4)',
              borderRadius: '4px',
              display: 'flex',
            }}
          >
            #{category}
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            padding: '24px 56px 16px 56px',
            color: '#F1F5F9',
            fontSize: '40px',
            fontWeight: 900,
            lineHeight: 1.12,
            display: 'flex',
          }}
        >
          {trimmedHeadline}
        </div>

        {/* Split portraits */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: '12px 40px 0 40px',
            gap: '16px',
          }}
        >
          {/* Left card */}
          <Subject
            name={leftName}
            role={leftRole}
            party={leftParty}
            portraitUrl={leftPortrait}
            caption={leftCaption}
            accent={leftAccent}
          />
          {/* Right card */}
          <Subject
            name={rightName}
            role={rightRole}
            party={rightParty}
            portraitUrl={rightPortrait}
            caption={rightCaption}
            accent={rightAccent}
          />
        </div>

        {/* Bottom band */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '14px 56px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(13, 17, 23, 0.96)',
            borderTop: '1px solid #1F2A3A',
          }}
        >
          <span
            style={{
              color: '#94A3B8',
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              display: 'flex',
            }}
          >
            PARLIAMENTAUDIT.CA
          </span>
          <span
            style={{
              color: '#64748B',
              fontSize: '12px',
              display: 'flex',
            }}
          >
            Photos: House of Commons of Canada
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

// ── Subject card (server component returning JSX for satori) ────────────

function Subject({
  name,
  role,
  party,
  portraitUrl,
  caption,
  accent,
}: {
  name: string;
  role: string;
  party: string;
  portraitUrl: string;
  caption: string;
  accent: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#111827',
        border: `2px solid ${accent}`,
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1F2937',
          minHeight: '260px',
          position: 'relative',
        }}
      >
        {portraitUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={portraitUrl}
            alt={name}
            width={520}
            height={300}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          // Fallback: placeholder silhouette
          <div
            style={{
              color: '#475569',
              fontSize: '110px',
              fontWeight: 900,
              display: 'flex',
            }}
          >
            {name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?'}
          </div>
        )}
        {caption && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              padding: '4px 10px',
              background: '#0D1117',
              border: `1px solid ${accent}`,
              borderRadius: '4px',
              color: '#F1F5F9',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            {caption}
          </div>
        )}
      </div>
      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          background: '#0F172A',
        }}
      >
        <span
          style={{
            color: '#F1F5F9',
            fontSize: '22px',
            fontWeight: 800,
            display: 'flex',
            marginBottom: '2px',
          }}
        >
          {name || ' '}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              color: '#94A3B8',
              fontSize: '14px',
              display: 'flex',
            }}
          >
            {role}
          </span>
          {party && (
            <span
              style={{
                color: '#FFFFFF',
                background: accent,
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '3px',
                letterSpacing: '0.08em',
                display: 'flex',
              }}
            >
              {PARTY_LABELS[party] || party}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
