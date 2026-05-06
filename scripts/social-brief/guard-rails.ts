/**
 * Pre-post guard rails. Cheap insurance against three documented failure modes:
 *
 *   1. Gannett-class template-leak ([[VARIABLE]] / {{var}} / [TBD] / TODO)
 *      — see content/research/civic-news-agentic-precedents-2026.md §3.2
 *
 *   2. Quakebot-1925-class stale-data publishing (a 2017 LA Times bot
 *      tweeted "breaking news" about a 1925 quake because nothing checked
 *      the source-event date)
 *      — see same doc §3.2
 *
 *   3. Tragedy-keyword tone-deaf timing — Epicurious during the Boston
 *      Marathon bombing, SKIMS during LA wildfires, Gap on election night
 *      — see content/research/agentic-operators-2026.md §3.2.
 *      The actual halt-on-tragedy detector lives in halt-on-tragedy.ts;
 *      this module just exposes the file-presence helper.
 *
 * All three guards return a `GuardResult { ok, severity, reason }` so
 * callers (mirror-queue-apply, auto-amplify, etc.) can decide whether
 * to BLOCK or WARN. Default policy in this codebase: BLOCK on bracket
 * leaks, WARN-then-block on date-sanity > 7d, BLOCK on tragedy-pause.
 */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export interface GuardResult {
  ok: boolean;
  severity: 'pass' | 'warn' | 'block';
  reason: string;
}

/**
 * Detects unfilled template variables that should never appear in a
 * published post. Patterns derived from the Gannett LedeAI 2023 incident
 * where "[[WINNING_TEAM_MASCOT]]" leaked into high-school sports recaps.
 *
 * Patterns:
 *   - `[[ ANYTHING ]]`  (double-bracket Mustache style)
 *   - `{{ ANYTHING }}`  (Handlebars style)
 *   - `[TBD]`, `[TK]`, `[XXX]`, `[FIX]`, `[CITE]` (newsroom shorthand)
 *   - bare TODO / FIXME inside a draft
 *   - `<placeholder>` / `<insert ...>` HTML-ish placeholders
 *
 * The single-bracket form `[citation]` is intentionally NOT flagged;
 * news content legitimately contains square-bracketed clarifications.
 */
export function checkBrackets(text: string): GuardResult {
  const patterns: Array<[RegExp, string]> = [
    [/\[\[\s*[^\]]+\s*\]\]/, 'unfilled [[ ]] template variable'],
    [/\{\{\s*[^}]+\s*\}\}/, 'unfilled {{ }} template variable'],
    [/\[\s*(TBD|TK|XXX|FIX|CITE|PLACEHOLDER|TODO|FIXME)\s*\]/i, 'newsroom-shorthand placeholder'],
    [/\b(TODO|FIXME):/, 'bare TODO/FIXME marker'],
    [/<\s*(insert|placeholder|tk)[^>]*>/i, 'HTML-style placeholder tag'],
  ];
  for (const [re, label] of patterns) {
    const m = text.match(re);
    if (m) {
      return {
        ok: false,
        severity: 'block',
        reason: `bracket-guard: ${label} ("${m[0]}")`,
      };
    }
  }
  return { ok: true, severity: 'pass', reason: 'no template leaks detected' };
}

/**
 * Date-sanity check. Rejects posts whose stated source-event date is
 * either in the future or absurdly old. Defaults are tuned for
 * parliamentary content where committee transcripts often publish 4–7
 * days after the meeting; breaking-event posts use a 24h window.
 *
 * Pass `eventDate` (ISO string) and an optional `category` to pick a
 * different staleness window:
 *
 *   - 'breaking'  →  24 hours      (vote roll-call same day, etc.)
 *   - 'analysis'  →  7 days        (default — committee, transcript)
 *   - 'historical' → unlimited     (intentional context posts)
 */
export function checkDateSanity(
  eventDate: string | Date | null | undefined,
  category: 'breaking' | 'analysis' | 'historical' = 'analysis',
): GuardResult {
  if (category === 'historical') {
    return { ok: true, severity: 'pass', reason: 'historical category — no staleness window' };
  }
  if (!eventDate) {
    return {
      ok: true,
      severity: 'warn',
      reason: 'no source-event date provided — staleness check skipped',
    };
  }
  const d = new Date(eventDate);
  if (Number.isNaN(d.getTime())) {
    return {
      ok: false,
      severity: 'block',
      reason: `date-guard: source-event date "${eventDate}" is unparseable`,
    };
  }
  const ageHours = (Date.now() - d.getTime()) / 3600_000;
  if (ageHours < -1) {
    // More than an hour in the future is almost certainly a parser error
    // (e.g. timezone bug). The Quakebot 1925 incident was caused by
    // exactly this kind of date-parse failure.
    return {
      ok: false,
      severity: 'block',
      reason: `date-guard: source-event date "${eventDate}" is in the future by ${Math.abs(ageHours).toFixed(1)}h`,
    };
  }
  const window = category === 'breaking' ? 24 : 7 * 24;
  if (ageHours > window) {
    return {
      ok: false,
      severity: 'warn',
      reason: `date-guard: source-event ${ageHours.toFixed(1)}h old (>${window}h ${category} window) — confirm framing is intentional`,
    };
  }
  return {
    ok: true,
    severity: 'pass',
    reason: `${ageHours.toFixed(1)}h old — within ${category} window (${window}h)`,
  };
}

/**
 * Returns true if `content/AUTO_PAUSE_TRAGEDY` exists at the project root.
 * The file is created and removed by halt-on-tragedy.ts based on RSS
 * polling of CBC + AP + Reuters + Globe + CP wire. Callers should treat
 * its presence as a hard BLOCK on auto-publishing — the user's manual
 * judgement is needed before posting again.
 */
export function isTragedyPaused(rootDir: string = process.cwd()): GuardResult {
  const flag = resolve(rootDir, 'content/AUTO_PAUSE_TRAGEDY');
  if (existsSync(flag)) {
    return {
      ok: false,
      severity: 'block',
      reason: 'tragedy-guard: content/AUTO_PAUSE_TRAGEDY present (see halt-on-tragedy.ts log)',
    };
  }
  return { ok: true, severity: 'pass', reason: 'no tragedy pause active' };
}

/**
 * Convenience: run all three pre-post checks and return the first
 * blocking result, or pass.
 */
export function runAllGuards(opts: {
  text: string;
  eventDate?: string | Date | null;
  category?: 'breaking' | 'analysis' | 'historical';
  rootDir?: string;
}): GuardResult {
  const r1 = checkBrackets(opts.text);
  if (r1.severity === 'block') return r1;
  const r2 = checkDateSanity(opts.eventDate, opts.category);
  if (r2.severity === 'block') return r2;
  const r3 = isTragedyPaused(opts.rootDir);
  if (r3.severity === 'block') return r3;
  // If any guard returned a warn, surface it (non-blocking)
  for (const r of [r1, r2, r3]) {
    if (r.severity === 'warn') return r;
  }
  return { ok: true, severity: 'pass', reason: 'all guards pass' };
}
