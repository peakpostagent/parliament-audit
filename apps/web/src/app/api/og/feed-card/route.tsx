/**
 * Parliament Audit — Feed Card (1200×1200 square)
 *
 * Designed to be ATTACHED directly to social posts (not served as the
 * og:image link card). Square 1:1 plays large in mobile feeds on X
 * and Bluesky alike, and suppresses the link card so the image is the
 * dominant visual unit.
 *
 * Auto-routes layout based on the article's content:
 *   - subjects[] >= 2  →  comparison-style split portrait
 *   - else if a hero stat can be extracted (vote tally, $ amount, %, big number)
 *                      →  hero-stat-dominant layout
 *   - else             →  headline-dominant layout
 *
 * Optional ?mode= override forces a specific layout:
 *   ?mode=comparison | stat | headline | quote
 *
 * Quote mode (?mode=quote&q=<text>&attrib=<who>) renders a pull-quote
 * treatment — best for "they said X, then did Y" stories. Falls back
 * to headline mode if q is missing.
 *
 * Photos: ourcommons.ca portraits (Crown copyright; non-commercial
 * editorial reproduction permitted with attribution).
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
  BQ: 'Bloc',
  GPC: 'Green',
  IND: 'Independent',
};

const CATEGORY_COLORS: Record<string, string> = {
  Legislation: '#3B82F6',
  Budget: '#F59E0B',
  Accountability: '#EF4444',
  Policy: '#8B5CF6',
  Defence: '#06B6D4',
  'Press Review': '#A855F7',
};

const SIZE = { width: 1200, height: 1200 };

// ── Hero-stat extraction (same heuristics as /api/og/news) ──────────────

function extractHeroStat(text: string): { value: string; label: string } | null {
  // Currency: $60.6B, $1.2 billion
  const cur = text.match(/\$\s?(\d+(?:\.\d+)?)\s?(B\b|billion|M\b|million|K\b|thousand)/i);
  if (cur) {
    const unit = cur[2].toLowerCase().startsWith('b')
      ? 'B'
      : cur[2].toLowerCase().startsWith('m')
        ? 'M'
        : cur[2].toLowerCase().startsWith('k')
          ? 'K'
          : '';
    return { value: `$${cur[1]}${unit}`, label: 'In play' };
  }
  // Vote tallies
  const v = text.match(/(\d{2,3})\s*[–\-to]+\s*(\d{2,3})\s*(?:vote|division|in favour|in favor|—|\.)/i);
  if (v) return { value: `${v[1]}–${v[2]}`, label: 'Vote split' };
  // Percentages — default label changed from 'Of Canadians' (2026-05-13)
  // to the neutral 'Headline figure'. A percentage with no context
  // gets mis-read when paired with 'Of Canadians' — for example, a
  // procedural-threshold piece could imply "10% of Canadians" support
  // a thing they have not been polled on. Authors who want a precise
  // label should set article.heroStat = { value, label } explicitly.
  const p = text.match(/(\d{1,3})\s?%/);
  if (p) {
    const n = parseInt(p[1], 10);
    if (n >= 5 && n <= 99) return { value: `${n}%`, label: 'Headline figure' };
  }
  // Big counts (5-figure or up)
  const big = text.match(/\b(\d{1,3}(?:,\d{3})+|\d{4,})\b/);
  if (big) return { value: big[1], label: 'In the record' };
  return null;
}

// ── Components ──────────────────────────────────────────────────────────

function BrandTop({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] || '#D71920';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '32px 48px',
        borderBottom: '1px solid #1F2A3A',
      }}
    >
      <span
        style={{
          color: '#FFFFFF',
          fontSize: '28px',
          fontWeight: 800,
          display: 'flex',
        }}
      >
        Parliament
        <span style={{ color: '#D71920', marginLeft: '8px', display: 'flex' }}>
          Audit
        </span>
      </span>
      <span
        style={{
          color: color,
          fontSize: '15px',
          fontWeight: 700,
          letterSpacing: '0.18em',
          padding: '8px 14px',
          background: `${color}1F`,
          border: `1px solid ${color}66`,
          borderRadius: '4px',
          display: 'flex',
          textTransform: 'uppercase',
        }}
      >
        #{category}
      </span>
    </div>
  );
}

function BrandBottom() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px 48px',
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
          fontSize: '18px',
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
          fontSize: '14px',
          display: 'flex',
        }}
      >
        Photos: House of Commons of Canada
      </span>
    </div>
  );
}

function StatLayout({
  category,
  hero,
  headline,
  summary,
}: {
  category: string;
  hero: { value: string; label: string };
  headline: string;
  summary: string;
}) {
  return (
    <div
      style={{
        width: '1200px',
        height: '1200px',
        display: 'flex',
        flexDirection: 'column',
        background: '#0D1117',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
      }}
    >
      <BrandTop category={category} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 64px 80px 64px',
        }}
      >
        <span
          style={{
            color: '#94A3B8',
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '12px',
            display: 'flex',
          }}
        >
          {hero.label}
        </span>
        <span
          style={{
            color: '#D71920',
            fontSize: '220px',
            fontWeight: 900,
            lineHeight: 0.95,
            marginBottom: '24px',
            display: 'flex',
          }}
        >
          {hero.value}
        </span>
        <span
          style={{
            color: '#F1F5F9',
            fontSize: '52px',
            fontWeight: 900,
            lineHeight: 1.08,
            marginBottom: '20px',
            display: 'flex',
          }}
        >
          {headline.length > 90 ? headline.slice(0, 87).trim() + '…' : headline}
        </span>
        <span
          style={{
            color: '#CBD5E1',
            fontSize: '24px',
            lineHeight: 1.42,
            display: 'flex',
          }}
        >
          {summary.length > 220 ? summary.slice(0, 217).trim() + '…' : summary}
        </span>
      </div>
      <BrandBottom />
    </div>
  );
}

function HeadlineLayout({
  category,
  headline,
  summary,
}: {
  category: string;
  headline: string;
  summary: string;
}) {
  return (
    <div
      style={{
        width: '1200px',
        height: '1200px',
        display: 'flex',
        flexDirection: 'column',
        background: '#0D1117',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
      }}
    >
      <BrandTop category={category} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 64px 80px 64px',
        }}
      >
        <span
          style={{
            color: '#F1F5F9',
            fontSize: '78px',
            fontWeight: 900,
            lineHeight: 1.06,
            marginBottom: '32px',
            display: 'flex',
          }}
        >
          {headline.length > 130 ? headline.slice(0, 127).trim() + '…' : headline}
        </span>
        <span
          style={{
            color: '#CBD5E1',
            fontSize: '30px',
            lineHeight: 1.4,
            display: 'flex',
          }}
        >
          {summary.length > 280 ? summary.slice(0, 277).trim() + '…' : summary}
        </span>
      </div>
      <BrandBottom />
    </div>
  );
}

function QuoteLayout({
  category,
  quote,
  attrib,
  context,
}: {
  category: string;
  quote: string;
  attrib: string;
  context: string;
}) {
  return (
    <div
      style={{
        width: '1200px',
        height: '1200px',
        display: 'flex',
        flexDirection: 'column',
        background: '#0D1117',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
      }}
    >
      <BrandTop category={category} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px 90px 80px',
        }}
      >
        <span
          style={{
            color: '#D71920',
            fontSize: '180px',
            fontWeight: 900,
            lineHeight: 0.6,
            marginBottom: '0',
            display: 'flex',
          }}
        >
          “
        </span>
        <span
          style={{
            color: '#F1F5F9',
            fontSize: '54px',
            fontWeight: 800,
            lineHeight: 1.18,
            marginTop: '-20px',
            marginBottom: '32px',
            fontStyle: 'italic',
            display: 'flex',
          }}
        >
          {quote.length > 220 ? quote.slice(0, 217).trim() + '…' : quote}
        </span>
        <span
          style={{
            color: '#94A3B8',
            fontSize: '26px',
            fontWeight: 600,
            display: 'flex',
            marginBottom: '8px',
          }}
        >
          — {attrib}
        </span>
        {context && (
          <span
            style={{
              color: '#64748B',
              fontSize: '22px',
              lineHeight: 1.4,
              display: 'flex',
            }}
          >
            {context.length > 180 ? context.slice(0, 177).trim() + '…' : context}
          </span>
        )}
      </div>
      <BrandBottom />
    </div>
  );
}

function ComparisonLayout({
  category,
  headline,
  subjects,
}: {
  category: string;
  headline: string;
  subjects: Array<{ name: string; role: string; portraitUrl?: string; party?: string; caption?: string }>;
}) {
  const [a, b] = subjects;
  const aColor = PARTY_COLORS[a.party || ''] || '#D71920';
  const bColor = PARTY_COLORS[b.party || ''] || '#1E3A8A';

  function Tile({ s, accent }: { s: typeof a; accent: string }) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#111827',
          border: `3px solid ${accent}`,
          borderRadius: '16px',
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
            position: 'relative',
            minHeight: '380px',
          }}
        >
          {s.portraitUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.portraitUrl}
              alt={s.name}
              width={520}
              height={420}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                color: '#475569',
                fontSize: '160px',
                fontWeight: 900,
                display: 'flex',
              }}
            >
              {(s.name.split(' ').map((w) => w[0]).join('') || '?').slice(0, 2).toUpperCase()}
            </div>
          )}
          {s.caption && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                padding: '6px 12px',
                background: '#0D1117',
                border: `2px solid ${accent}`,
                borderRadius: '6px',
                color: '#F1F5F9',
                fontSize: '17px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              {s.caption}
            </div>
          )}
        </div>
        <div
          style={{
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            background: '#0F172A',
          }}
        >
          <span
            style={{
              color: '#F1F5F9',
              fontSize: '28px',
              fontWeight: 800,
              marginBottom: '4px',
              display: 'flex',
            }}
          >
            {s.name}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ color: '#94A3B8', fontSize: '16px', display: 'flex' }}>
              {s.role}
            </span>
            {s.party && (
              <span
                style={{
                  color: '#FFFFFF',
                  background: accent,
                  fontSize: '13px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '4px',
                  letterSpacing: '0.08em',
                  display: 'flex',
                }}
              >
                {PARTY_LABELS[s.party || ''] || s.party}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '1200px',
        height: '1200px',
        display: 'flex',
        flexDirection: 'column',
        background: '#0D1117',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
      }}
    >
      <BrandTop category={category} />
      <div
        style={{
          padding: '32px 48px 12px 48px',
          color: '#F1F5F9',
          fontSize: '46px',
          fontWeight: 900,
          lineHeight: 1.1,
          display: 'flex',
        }}
      >
        {headline.length > 110 ? headline.slice(0, 107).trim() + '…' : headline}
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          padding: '12px 36px 80px 36px',
          gap: '20px',
        }}
      >
        <Tile s={a} accent={aColor} />
        <Tile s={b} accent={bColor} />
      </div>
      <BrandBottom />
    </div>
  );
}

// ── Route ───────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  const modeParam = url.searchParams.get('mode'); // stat | comparison | quote | headline

  let headline = url.searchParams.get('headline') || '';
  let summary = url.searchParams.get('summary') || '';
  let category = url.searchParams.get('category') || 'NEWS';
  let subjects: any[] | undefined;
  let heroOverride: { value: string; label: string } | undefined;

  if (slug) {
    const article = getNewsArticle(slug);
    if (article) {
      headline = article.headline;
      summary = article.summary;
      category = article.category;
      subjects = article.subjects;
      heroOverride = article.heroStat;
    }
  }

  // Mode resolution
  let mode = modeParam ?? '';
  if (!mode) {
    if (subjects && subjects.length >= 2) mode = 'comparison';
    else {
      const stat = heroOverride ?? extractHeroStat(summary);
      mode = stat ? 'stat' : 'headline';
    }
  }

  if (mode === 'comparison' && subjects && subjects.length >= 2) {
    return new ImageResponse(
      <ComparisonLayout category={category} headline={headline} subjects={subjects} />,
      { ...SIZE },
    );
  }

  if (mode === 'quote') {
    const q = url.searchParams.get('q') || '';
    const attrib = url.searchParams.get('attrib') || '';
    const context = url.searchParams.get('context') || '';
    if (q) {
      return new ImageResponse(
        <QuoteLayout category={category} quote={q} attrib={attrib} context={context} />,
        { ...SIZE },
      );
    }
    // Fall through to headline if quote args missing
    mode = 'headline';
  }

  if (mode === 'stat') {
    // heroOverride (article.heroStat) always wins, then summary
    // extractor, then headline extractor.
    const hero = heroOverride ?? extractHeroStat(summary) ?? extractHeroStat(headline);
    if (hero) {
      return new ImageResponse(
        <StatLayout category={category} hero={hero} headline={headline} summary={summary} />,
        { ...SIZE },
      );
    }
    mode = 'headline';
  }

  return new ImageResponse(
    <HeadlineLayout category={category} headline={headline} summary={summary} />,
    { ...SIZE },
  );
}
