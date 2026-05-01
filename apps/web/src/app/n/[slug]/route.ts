/**
 * Short-URL redirect: /n/<slug> → /news/<slug>?utm_source=...
 *
 * Built so image-attached social posts can keep UTM tracking without
 * blowing through character budgets. A full UTM URL is ~140 chars; the
 * /n/<slug> form is ~60 chars. The redirect re-attaches UTM server-side
 * based on the inbound user-agent or an explicit ?s= query param.
 *
 * Usage:
 *   /n/prescribeit-298m-axe-the-fax-shutdown?s=bsky
 *   → 302 → /news/prescribeit-298m-axe-the-fax-shutdown?utm_source=bluesky&utm_medium=social&utm_campaign=img-2026-04-30
 *
 * If ?s= is omitted, we sniff the user-agent. Bluesky's link bot
 * identifies as "Bluesky"; X's identifies as "Twitterbot". For real
 * users the redirect still works — they just don't get UTM tagged
 * (acceptable; we want the click tracking, not the user-tracking).
 *
 * The redirect uses 302 (temporary) so search engines don't merge the
 * /n/<slug> path into search rankings — those should stay on /news/<slug>.
 */

import { NextRequest, NextResponse } from 'next/server';

const SOURCE_ALIASES: Record<string, string> = {
  bsky: 'bluesky',
  bluesky: 'bluesky',
  x: 'x',
  twitter: 'x',
  ig: 'instagram',
  fb: 'facebook',
  email: 'email',
  rss: 'rss',
  ln: 'linkedin',
};

function inferSourceFromUserAgent(ua: string): string | null {
  const lower = ua.toLowerCase();
  if (/bluesky|bskybot|atproto/.test(lower)) return 'bluesky';
  if (/twitterbot|tweetdeck/.test(lower)) return 'x';
  if (/facebookexternalhit|facebookcatalog/.test(lower)) return 'facebook';
  if (/linkedinbot/.test(lower)) return 'linkedin';
  return null;
}

function isoWeekCampaign(d = new Date()): string {
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNum =
    Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${target.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const sParam = url.searchParams.get('s') || '';
  const cParam = url.searchParams.get('c'); // explicit campaign override
  const ua = request.headers.get('user-agent') || '';

  const source =
    SOURCE_ALIASES[sParam.toLowerCase()] ||
    inferSourceFromUserAgent(ua) ||
    'short-url';
  const campaign = cParam || `img-${isoWeekCampaign()}`;

  const target = new URL(`https://parliamentaudit.ca/news/${slug}`);
  target.searchParams.set('utm_source', source);
  target.searchParams.set('utm_medium', source === 'email' ? 'email' : 'social');
  target.searchParams.set('utm_campaign', campaign);

  return NextResponse.redirect(target.toString(), 302);
}
