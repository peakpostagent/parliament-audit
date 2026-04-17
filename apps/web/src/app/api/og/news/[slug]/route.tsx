/**
 * Parliament Audit — Dynamic OG Image for News Articles
 *
 * Generates a branded social card for editorial /news/ articles.
 * Served at: /api/og/news/[slug]
 *
 * Design: dark background, category badge, headline, summary excerpt,
 * reading time, Parliament Audit branding. 1200x630 for X/Twitter & Facebook.
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

  // Truncate headline and summary for the card
  const headline =
    article.headline.length > 80
      ? article.headline.slice(0, 78) + '\u2026'
      : article.headline;

  const summary =
    article.summary.length > 160
      ? article.summary.slice(0, 158) + '\u2026'
      : article.summary;

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
        {/* Background accent */}
        <div
          style={{
            position: 'absolute',
            right: '-60px',
            bottom: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(215,25,32,0.08) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top bar: branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '32px 48px 0',
          }}
        >
          {/* Left: NEWS badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                background: '#D71920',
                borderRadius: '6px',
                padding: '6px 16px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '800',
                letterSpacing: '0.1em',
                display: 'flex',
              }}
            >
              NEWS
            </div>
            <div
              style={{
                background: categoryColor,
                borderRadius: '6px',
                padding: '6px 14px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '700',
                letterSpacing: '0.06em',
                display: 'flex',
              }}
            >
              {article.category.toUpperCase()}
            </div>
          </div>

          {/* Right: Parliament Audit brand */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                display: 'flex',
              }}
            >
              Parliament
              <span
                style={{
                  color: '#D71920',
                  marginLeft: '6px',
                  display: 'flex',
                }}
              >
                Audit
              </span>
            </div>
            <div
              style={{
                color: '#64748B',
                fontSize: '12px',
                letterSpacing: '0.08em',
                display: 'flex',
              }}
            >
              PARLIAMENTAUDIT.CA
            </div>
          </div>
        </div>

        {/* Red accent line */}
        <div
          style={{
            height: '3px',
            background: 'linear-gradient(to right, #D71920, transparent)',
            margin: '24px 48px 0',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '32px 48px',
            justifyContent: 'center',
          }}
        >
          {/* Headline */}
          <div
            style={{
              color: '#F1F5F9',
              fontSize: '42px',
              fontWeight: '800',
              lineHeight: '1.2',
              display: 'flex',
              flexWrap: 'wrap',
              marginBottom: '20px',
            }}
          >
            {headline}
          </div>

          {/* Summary */}
          <div
            style={{
              color: '#94A3B8',
              fontSize: '20px',
              lineHeight: '1.5',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {summary}
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 48px 28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                color: '#64748B',
                fontSize: '14px',
                display: 'flex',
              }}
            >
              {date}
            </div>
            <div
              style={{
                color: '#475569',
                fontSize: '14px',
                display: 'flex',
              }}
            >
              {article.readingTimeMinutes} min read
            </div>
          </div>
          <div
            style={{
              color: '#475569',
              fontSize: '13px',
              display: 'flex',
            }}
          >
            {'Non-partisan \u00b7 Factual \u00b7 Transparent'}
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
