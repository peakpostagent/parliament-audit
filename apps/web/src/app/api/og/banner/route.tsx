/**
 * Parliament Audit — X / social profile banner
 *
 * Generates a 1500x500 banner suitable for X profile headers.
 *
 * Avatar safe zone: the profile circle sits bottom-left, roughly 240px
 * from left edge, 370px from top, ~200px diameter. Design keeps the
 * lower-left quadrant clear and puts the typographic weight on the right.
 */

import { ImageResponse } from '@vercel/og';

export const runtime = 'nodejs';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1500px',
          height: '500px',
          display: 'flex',
          flexDirection: 'row',
          background: '#0D1117',
          position: 'relative',
          fontFamily: '"SF Pro", system-ui, sans-serif',
        }}
      >
        {/* Subtle red vertical accent on far left edge */}
        <div
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            bottom: '0',
            width: '8px',
            background: '#D71920',
            display: 'flex',
          }}
        />

        {/* Ghost maple leaf, far-left, washed into bg — sits behind where the avatar will be */}
        <div
          style={{
            position: 'absolute',
            left: '60px',
            bottom: '-20px',
            width: '240px',
            height: '240px',
            opacity: '0.06',
            display: 'flex',
          }}
        >
          <svg
            width="240"
            height="240"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 5 L55 25 L70 20 L63 38 L85 35 L72 50 L88 58 L68 62 L75 82 L55 70 L50 95 L45 70 L25 82 L32 62 L12 58 L28 50 L15 35 L37 38 L30 20 L45 25 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>

        {/* Right-side content block */}
        <div
          style={{
            position: 'absolute',
            left: '560px',
            top: '0',
            right: '0',
            bottom: '0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '40px',
            paddingRight: '80px',
          }}
        >
          {/* Category pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                background: '#D71920',
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                padding: '6px 14px',
                borderRadius: '3px',
                display: 'flex',
              }}
            >
              CANADIAN CIVIC JOURNALISM
            </div>
          </div>

          {/* Wordmark */}
          <div
            style={{
              fontSize: '108px',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              display: 'flex',
            }}
          >
            PARLIAMENT
          </div>
          <div
            style={{
              fontSize: '108px',
              fontWeight: 900,
              color: '#D71920',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginTop: '4px',
              display: 'flex',
            }}
          >
            AUDIT
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '24px',
              color: '#9CA3AF',
              marginTop: '24px',
              letterSpacing: '0.02em',
              display: 'flex',
            }}
          >
            Every vote. Every bill. Every MP. Non-partisan. Factual.
          </div>
        </div>

        {/* Bottom red rule */}
        <div
          style={{
            position: 'absolute',
            left: '0',
            right: '0',
            bottom: '0',
            height: '6px',
            background: '#D71920',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      width: 1500,
      height: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    },
  );
}
