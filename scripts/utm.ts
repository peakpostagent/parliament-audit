/**
 * Append UTM query parameters to a parliamentaudit.ca URL so Umami can
 * attribute clicks by platform and campaign, even when the referer
 * header is stripped (X in particular strips it).
 *
 * Usage:
 *   withUtm('https://parliamentaudit.ca/news/...', { source: 'bluesky' })
 *     -> https://parliamentaudit.ca/news/...?utm_source=bluesky&utm_medium=social&utm_campaign=daily-brief
 *
 * Only appends UTMs to URLs under parliamentaudit.ca. Other hosts pass
 * through unchanged.
 */

export interface UtmOpts {
  /** Platform: 'x', 'bluesky', 'linkedin', 'email', etc. */
  source: string;
  /** Medium: defaults to 'social' for platforms, 'email' for email. */
  medium?: string;
  /** Campaign name: defaults to YYYY-Www (ISO week). */
  campaign?: string;
}

export function isoWeekCampaign(d = new Date()): string {
  // Returns e.g. "2026-W17"
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNum =
    Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${target.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

export function withUtm(url: string, opts: UtmOpts): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  // Only tag our own URLs — never third-party links.
  const host = parsed.hostname.replace(/^www\./, '');
  if (host !== 'parliamentaudit.ca') return url;

  // Don't clobber existing UTM tags if the caller already set them.
  if (parsed.searchParams.has('utm_source')) return url;

  const medium = opts.medium ?? (opts.source === 'email' ? 'email' : 'social');
  const campaign = opts.campaign ?? isoWeekCampaign();
  parsed.searchParams.set('utm_source', opts.source);
  parsed.searchParams.set('utm_medium', medium);
  parsed.searchParams.set('utm_campaign', campaign);
  return parsed.toString();
}
