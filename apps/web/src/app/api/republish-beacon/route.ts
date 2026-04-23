import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 1x1 transparent GIF used as a republish tracking pixel.
 * When a republishing outlet's readers load the article, this pixel
 * pings us — we log the slug + referrer so we can count republications.
 * No cookies. No reader-identifying data.
 */
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64',
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') ?? 'unknown';
  const referrer = req.headers.get('referer') ?? 'direct';

  // Minimal telemetry via console — Railway log tail captures these.
  // When we wire Umami server-side events in a later sprint, replace
  // with a structured track() call.
  console.log(
    JSON.stringify({
      evt: 'republish-beacon',
      slug,
      referrer,
      ua: req.headers.get('user-agent') ?? 'unknown',
      ts: new Date().toISOString(),
    }),
  );

  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      'content-type': 'image/gif',
      'content-length': String(PIXEL.length),
      'cache-control': 'no-store, max-age=0',
    },
  });
}
