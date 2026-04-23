import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Become a Parliament Audit Builder — support independent Canadian civic journalism.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Social card for /support. Leads with the brand commitment (non-partisan,
 * reader-funded, no political-party money) — the decision frame matters
 * more than "buy our tier."
 */
export default async function Image() {
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
          padding: '64px',
          position: 'relative',
        }}
      >
        {/* Top red band */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: '#D71920',
            display: 'flex',
          }}
        />

        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: '800',
              display: 'flex',
            }}
          >
            Parliament
            <span style={{ color: '#D71920', marginLeft: '6px', display: 'flex' }}>Audit</span>
          </span>
          <span
            style={{
              color: '#94A3B8',
              fontSize: '14px',
              letterSpacing: '0.14em',
              display: 'flex',
              paddingLeft: '12px',
              borderLeft: '1px solid #1F2A3A',
              marginLeft: '4px',
            }}
          >
            BUILDERS · 2026
          </span>
        </div>

        {/* Hero */}
        <div
          style={{
            color: '#F1F5F9',
            fontSize: '64px',
            fontWeight: '900',
            lineHeight: '1.05',
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '32px',
          }}
        >
          <span style={{ display: 'flex' }}>Keep the record</span>
          <span style={{ display: 'flex', color: '#D71920' }}>public.</span>
        </div>

        <p
          style={{
            color: '#CBD5E1',
            fontSize: '24px',
            lineHeight: '1.45',
            maxWidth: '900px',
            display: 'flex',
          }}
        >
          Reader-funded. Non-partisan. No political-party money. Three tiers,
          starting at $7/month. Cancel any time.
        </p>

        {/* Bottom band */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px 64px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #1F2A3A',
            background: 'rgba(13, 17, 23, 0.95)',
          }}
        >
          <span
            style={{
              color: '#94A3B8',
              fontSize: '16px',
              fontWeight: '600',
              letterSpacing: '0.06em',
              display: 'flex',
            }}
          >
            PARLIAMENTAUDIT.CA/SUPPORT
          </span>
          <span
            style={{
              color: '#64748B',
              fontSize: '14px',
              display: 'flex',
            }}
          >
            Non-partisan · Factual · Transparent
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
