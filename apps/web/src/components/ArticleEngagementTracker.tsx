'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';

interface Props {
  slug: string;
  /** Reading time in minutes, used as an engagement threshold weight. */
  readingTimeMinutes: number;
}

/**
 * Scroll + dwell engagement tracker for news article pages.
 *
 * Fires two events exactly once per page load:
 *   - `article-engaged`  — user has been on the page ≥ 30 sec AND scrolled past
 *                          at least 50% of the document height.
 *   - `article-finished` — user has scrolled past 95% of the document AND been
 *                          on the page for at least (readingTimeMinutes × 30) sec.
 *
 * These are the core read-through signals from the analytics playbook.
 * Everything is best-effort: no state persists across reloads, no fetches,
 * no user-identifying data. Umami filters it out if tracking is disabled.
 */
export function ArticleEngagementTracker({ slug, readingTimeMinutes }: Props) {
  const engagedFiredRef = useRef(false);
  const finishedFiredRef = useRef(false);
  const mountedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    mountedAtRef.current = Date.now();
    let ticking = false;
    const DWELL_ENGAGED_MS = 30_000;
    const DWELL_FINISHED_MS = Math.max(readingTimeMinutes, 1) * 30_000;
    // 30s/min read-time gives us a reasonable "actually read it" threshold
    // short of full read-time, which is unrealistically long.

    function check() {
      if (engagedFiredRef.current && finishedFiredRef.current) return;

      const dwell = Date.now() - mountedAtRef.current;
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight =
        Math.max(
          document.documentElement.scrollHeight,
          document.body?.scrollHeight ?? 0,
        ) - window.innerHeight;
      const scrollRatio = docHeight > 0 ? scrollTop / docHeight : 0;

      if (
        !engagedFiredRef.current &&
        dwell >= DWELL_ENGAGED_MS &&
        scrollRatio >= 0.5
      ) {
        engagedFiredRef.current = true;
        track('article-engaged', {
          slug,
          dwellSeconds: Math.round(dwell / 1000),
          scrollPct: Math.round(scrollRatio * 100),
        });
      }

      if (
        !finishedFiredRef.current &&
        dwell >= DWELL_FINISHED_MS &&
        scrollRatio >= 0.95
      ) {
        finishedFiredRef.current = true;
        track('article-finished', {
          slug,
          dwellSeconds: Math.round(dwell / 1000),
          readingTimeMinutes,
        });
      }
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          check();
          ticking = false;
        });
        ticking = true;
      }
    }

    const interval = window.setInterval(check, 2500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('scroll', onScroll);
    };
  }, [slug, readingTimeMinutes]);

  return null;
}
