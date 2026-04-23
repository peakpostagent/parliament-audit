'use client';

import { track } from '@/lib/analytics';

interface Props {
  url: string;
  label: string;
  slug?: string;
  /** Differentiate source citations from other outbound link treatments. */
  kind?: 'source' | 'social' | 'external';
}

/**
 * Client-side outbound link that fires an `outbound-source` / `outbound-social`
 * event before navigating. Used in article-footer source lists, share buttons,
 * and the "Follow us" footer links.
 *
 * We don't `preventDefault` — the click flows through normally and the beacon
 * either lands via sendBeacon (Umami's default) or is best-effort fired before
 * unload. If it doesn't make it, we lose a data point but the user gets to the
 * target page — which is the correct priority for telemetry.
 */
export function SourceLink({ url, label, slug, kind = 'source' }: Props) {
  const event =
    kind === 'social'
      ? 'outbound-social'
      : kind === 'external'
        ? 'read-more-at-source'
        : 'outbound-source';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 underline"
      onClick={() => {
        try {
          const host = new URL(url).hostname.replace(/^www\./, '');
          track(event, { host, slug: slug ?? null });
        } catch {
          track(event, { slug: slug ?? null });
        }
      }}
    >
      {label}
    </a>
  );
}
