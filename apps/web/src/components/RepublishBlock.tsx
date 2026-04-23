'use client';

import { useMemo, useState } from 'react';

interface Props {
  articleSlug: string;
  headline: string;
  summary: string;
  publishedAt: string;
  readingTimeMinutes: number;
  // Full article body as plain HTML — built server-side from sections[].
  bodyHtml: string;
}

/**
 * Per-article "Steal Our Stories" republish block (ProPublica pattern).
 * Renders a collapsible section with the CC license, a plain-HTML version
 * of the article, and a copy-to-clipboard affordance.
 *
 * The `bodyHtml` is pre-rendered on the server so the copied markup is
 * CMS-ready (semantic <p> and <h2>, plus a byline + canonical link).
 */
export default function RepublishBlock({
  articleSlug,
  headline,
  summary,
  publishedAt,
  readingTimeMinutes,
  bodyHtml,
}: Props) {
  const [copied, setCopied] = useState(false);
  const canonical = `https://parliamentaudit.ca/news/${articleSlug}`;
  const trackingPixel = `https://parliamentaudit.ca/api/republish-beacon?slug=${articleSlug}`;
  const publishedLabel = new Date(publishedAt).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const republishHtml = useMemo(() => {
    // Escape for embedding in a <pre> / clipboard output. We keep the
    // actual markup as semantic HTML so it drops straight into a CMS.
    return `<!-- Parliament Audit — republished under CC BY-ND 4.0 -->
<article>
  <h1>${escapeHtml(headline)}</h1>
  <p><em>By Parliament Audit · ${publishedLabel} · ${readingTimeMinutes} min read</em></p>
  <p><strong>${escapeHtml(summary)}</strong></p>
${bodyHtml}
  <hr />
  <p><small>
    Originally published by <a href="${canonical}">Parliament Audit</a>
    under the <a href="https://creativecommons.org/licenses/by-nd/4.0/">CC BY-ND 4.0</a> license.
    <img src="${trackingPixel}" alt="" width="1" height="1" />
  </small></p>
</article>`;
  }, [headline, summary, bodyHtml, publishedLabel, readingTimeMinutes, canonical, trackingPixel]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(republishHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: select the <pre> range.
      const pre = document.getElementById(`republish-src-${articleSlug}`);
      if (pre && window.getSelection) {
        const range = document.createRange();
        range.selectNodeContents(pre);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }

  return (
    <details className="mt-10 border-2 border-gray-200 rounded-lg group">
      <summary className="cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 select-none rounded-t-lg">
        <span className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span
              className="inline-block transition-transform group-open:rotate-90 text-gray-400"
              aria-hidden="true"
            >
              ▸
            </span>
            <span className="font-semibold text-[#1a1a2e]">
              Republish this story
            </span>
          </span>
          <span className="text-xs text-gray-500 hidden sm:inline">
            Free, no permission required · CC BY-ND 4.0
          </span>
        </span>
      </summary>
      <div className="p-5 bg-white rounded-b-lg">
        <p className="text-sm text-gray-700 mb-4">
          You&apos;re welcome to run this article in full on your newsroom, blog,
          newsletter, or paper. Keep the byline and the link back to
          parliamentaudit.ca. See the{' '}
          <a href="/republish" className="text-red-700 hover:underline">
            full terms
          </a>
          .
        </p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 bg-[#1a1a2e] text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
        >
          {copied ? 'Copied ✓' : 'Copy clean HTML'}
        </button>
        <pre
          id={`republish-src-${articleSlug}`}
          className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700 overflow-x-auto max-h-60"
        >
          {republishHtml}
        </pre>
      </div>
    </details>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
