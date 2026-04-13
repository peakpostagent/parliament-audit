import { ImageResponse } from 'next/og';

export const alt = 'Parliament Audit — Canada deserves to know.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: 60,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              background: '#D71920',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 32,
              fontWeight: 700,
              marginRight: 16,
            }}
          >
            PA
          </div>
          <span
            style={{
              color: 'white',
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            Parliament Audit
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            color: '#e2e8f0',
            fontSize: 28,
            marginTop: 8,
            textAlign: 'center',
          }}
        >
          Every Vote. Every Party. Every Time.
        </p>

        {/* Description */}
        <p
          style={{
            color: '#94a3b8',
            fontSize: 20,
            marginTop: 16,
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          Non-partisan tracking of every recorded vote in Canada's House of Commons and Senate.
        </p>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: '#64748b', fontSize: 18 }}>parliamentaudit.ca</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
