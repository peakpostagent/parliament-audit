/**
 * Parliament Audit — Dynamic OG Image for News Articles
 *
 * Generates a branded social card for editorial /news/ articles.
 * Served at: /api/og/news/[slug]
 *
 * Design: dark background, category badge, dominant headline, key stat
 * extraction, branded footer band. 1200x630 for X/Twitter & Facebook.
 *
 * Layout philosophy: fill the canvas. Headlines dominate. A "key stat"
 * (largest number found in the summary) gets pulled out as a hero
 * element so the image works at thumbnail sizes.
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getNewsArticle } from '@/content/news-articles';

export const runtime = 'nodejs';

const CATEGORY_COLORS: Record<string, string> = {
  Legislation: '#3B82F6',
  Budget: '#F59E0B',
  Accountability: '#EF4444',
  Policy: '#8B5CF6',
  Defence: '#06B6D4',
};

/**
 * Pull a hero stat from the article summary or headline.
 * Looks for currency, percentages, vote tallies, large counts.
 * Returns { value, label } or null.
 */
function extractKeyStat(
  text: string,
  fallback: string,
): { value: string; label: string } | null {
  // Currency: $60.6B, $1.2 billion, $500 million
  const currencyMatch = text.match(
    /\$\s?(\d+(?:\.\d+)?)\s?(B\b|billion|M\b|million|K\b|thousand)/i,
  );
  if (currencyMatch) {
    const num = currencyMatch[1];
    const unit = currencyMatch[2].toLowerCase();
    const short = unit.startsWith('b')
      ? 'B'
      : unit.startsWith('m')
        ? 'M'
        : unit.startsWith('k')
          ? 'K'
          : '';
    return { value: `$${num}${short}`, label: fallback };
  }

  // Vote tallies: 186-137 or 186–137 or 186 to 137
  const voteMatch = text.match(/(\d{2,3})[–\-to ]+(\d{2,3})\s*(?:vote|division|in favour)/i);
  if (voteMatch) {
    return { value: `${voteMatch[1]}–${voteMatch[2]}`, label: 'Recorded vote' };
  }

  // Percentages
  const pctMatch = text.match(/(\d{1,3}(?:\.\d+)?)\s?%/);
  if (pctMatch) {
    return { value: `${pctMatch[1]}%`, label: fallback };
  }

  // Large counts: 30,000 / 10,000 / 2,620
  const countMatch = text.match(/(\d{1,3}(?:,\d{3})+)/);
  if (countMatch) {
    return { value: countMatch[1], label: fallback };
  }

  return null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const article = getNewsArticle(slug);

  if (!article) {
    return new Response('Not found', { status: 404 });
  }

  const categoryColor = CATEGORY_COLORS[article.category] ?? '#6B7280';

  const headline =
    article.headline.length > 90
      ? article.headline.slice(0, 88) + '\u2026'
      : article.headline;

  const summary =
    article.summary.length > 200
      ? article.summary.slice(0, 198) + '\u2026'
      : article.summary;

  // Pull a hero stat from headline+summary
  const keyStat = extractKeyStat(
    `${article.headline} ${article.summary}`,
    article.category,
  );

  const date = new Date(article.publishedAt).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
        {/* Background accent — large category-colored circle, top right */}
        <div
          style={{
            position: 'absolute',
            right: '-180px',
            top: '-180px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${categoryColor}22 0%, transparent 65%)`,
            display: 'flex',
          }}
        />
        {/* Background accent — bottom-left red glow */}
        <div
          style={{
            position: 'absolute',
            left: '-120px',
            bottom: '-180px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(215,25,32,0.10) 0%, transparent 65%)',
            display: 'flex',
          }}
        />

        {/* Top bar: brand left, badges right */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '36px 56px 0',
          }}
        >
          {/* Wordmark */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                color: '#FFFFFF',
                fontSize: '26px',
                fontWeight: '900',
                letterSpacing: '-0.02em',
                display: 'flex',
              }}
            >
              Parliament
              <span
                style={{
                  color: '#D71920',
                  marginLeft: '8px',
                  display: 'flex',
                }}
              >
                Audit
              </span>
            </div>
            <div
              style={{
                color: '#64748B',
                fontSize: '13px',
                letterSpacing: '0.16em',
                display: 'flex',
                marginTop: '2px',
              }}
            >
              PARLIAMENTAUDIT.CA
            </div>
          </div>

          {/* Right: badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                background: '#D71920',
                borderRadius: '4px',
                padding: '8px 18px',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '800',
                letterSpacing: '0.14em',
                display: 'flex',
              }}
            >
              NEWS
            </div>
            <div
              style={{
                background: categoryColor,
                borderRadius: '4px',
                padding: '8px 16px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '0.10em',
                display: 'flex',
              }}
            >
              {article.category.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Red rule */}
        <div
          style={{
            height: '4px',
            background: `linear-gradient(to right, #D71920, ${categoryColor}, transparent)`,
            margin: '20px 56px 0',
            display: 'flex',
          }}
        />

        {/* Main content: headline left, hero stat right */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: '36px 56px 24px',
            gap: '40px',
          }}
        >
          {/* Left column — headline + summary */}
          <div
            style={{
              flex: keyStat ? 7 : 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                color: '#F8FAFC',
                fontSize: headline.length > 60 ? '54px' : '64px',
                fontWeight: '800',
                lineHeight: '1.08',
                letterSpacing: '-0.02em',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {headline}
            </div>
            <div
              style={{
                color: '#94A3B8',
                fontSize: '22px',
                lineHeight: '1.4',
                display: 'flex',
                flexWrap: 'wrap',
                marginTop: '24px',
              }}
            >
              {summary}
            </div>
          </div>

          {/* Right column — hero stat (only if extracted) */}
          {keyStat && (
            <div
              style={{
                flex: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'center',
                borderLeft: `1px solid ${categoryColor}33`,
                paddingLeft: '36px',
              }}
            >
              <div
                style={{
                  color: categoryColor,
                  fontSize: keyStat.value.length > 6 ? '92px' : '128px',
                  fontWeight: '900',
                  lineHeight: '0.95',
                  letterSpacing: '-0.04em',
                  display: 'flex',
                  textAlign: 'right',
                }}
              >
                {keyStat.value}
              </div>
              <div
                style={{
                  color: '#94A3B8',
                  fontSize: '18px',
                  fontWeight: '600',
                  letterSpacing: '0.04em',
                  marginTop: '12px',
                  display: 'flex',
                  textAlign: 'right',
                  textTransform: 'uppercase',
                }}
              >
                {keyStat.label}
              </div>
            </div>
          )}
        </div>

        {/* Bottom branded band */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 56px',
            borderTop: '1px solid rgba(148, 163, 184, 0.10)',
            background: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
          >
            <div
              style={{
                color: '#94A3B8',
                fontSize: '15px',
                fontWeight: '600',
                display: 'flex',
              }}
            >
              {date}
            </div>
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#475569',
                display: 'flex',
              }}
            />
            <div
              style={{
                color: '#64748B',
                fontSize: '15px',
                display: 'flex',
              }}
            >
              {article.readingTimeMinutes} min read
            </div>
          </div>
          <div
            style={{
              color: '#94A3B8',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '0.06em',
              display: 'flex',
            }}
          >
            {'NON-PARTISAN \u00b7 FACTUAL \u00b7 TRANSPARENT'}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    },
  );
}
