/**
 * Safe wrapper around `window.umami.track()`.
 *
 * Designed so importing this module never crashes the page, even in:
 *   - Server-side rendering (no `window`)
 *   - Local/preview builds without NEXT_PUBLIC_UMAMI_* env vars
 *   - Ad-blocker / privacy-extension environments that strip the script
 *
 * All calls silently no-op when the tracker isn't available.
 */

declare global {
  interface Window {
    umami?: {
      track: (
        eventOrFn?: string | ((props: Record<string, unknown>) => void),
        data?: Record<string, unknown>,
      ) => void;
    };
  }
}

export type AnalyticsEvent =
  | 'newsletter-subscribed'
  | 'find-my-mp-submitted'
  | 'outbound-social'
  | 'outbound-source'
  | 'article-share'
  | 'read-more-at-source'
  | 'article-engaged'
  | 'article-finished'
  | 'builder-intent'
  | 'republish-copied'
  // ContactYourMP action embed (added 2026-05-20, idea #6 from
  // competitive review — 5 Calls pattern).
  | 'contact-mp-lookup-submitted'
  | 'contact-mp-lookup-success'
  | 'contact-mp-lookup-error'
  | 'contact-mp-message-copied'
  | 'contact-mp-email-opened';

/**
 * Fire a named event. `data` is an optional flat object of string/number/
 * boolean props — Umami doesn't support nested data.
 */
export function track(event: AnalyticsEvent, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (!window.umami || typeof window.umami.track !== 'function') return;
  try {
    if (data) {
      window.umami.track(event, data);
    } else {
      window.umami.track(event);
    }
  } catch {
    // Silent — telemetry must never break the app.
  }
}
