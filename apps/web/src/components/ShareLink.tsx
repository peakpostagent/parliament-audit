'use client';

import { track } from '@/lib/analytics';

interface Props {
  url: string;
  label: string;
  slug: string;
  platform: 'x' | 'facebook' | 'bluesky' | 'email' | 'copy';
  className?: string;
}

/**
 * Article share button that fires an `article-share` event before the
 * default-target link opens. Used in the article footer share bar.
 */
export function ShareLink({ url, label, slug, platform, className }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? 'text-sm text-blue-600 hover:text-blue-800'}
      onClick={() => track('article-share', { slug, platform })}
    >
      {label}
    </a>
  );
}
