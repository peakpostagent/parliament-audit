# Parliament Audit — scripts/

Quick reference for the operational scripts. Read in order — each builds on the one before it.

## Posting

| Script | What | When |
|---|---|---|
| `browser/post-one-x.ts` | Post one tweet via the logged-in `.browser-profile/` Chrome session. Supports `--text` inline, `--text-file <path>`, `--slug <article-slug>` for UTM-tagged links, `--no-cta` to skip the brand CTA. | One-off X post launches. |
| `post-arbitrary-bluesky.ts` | Post arbitrary text + link card to Bluesky via AT Protocol. Same flags as `post-one-x.ts`, plus `--image <url>` to attach a 1200×1200 image (replaces the link card with an attached visual; URL goes inline using the short `/n/<slug>` redirect form). | One-off Bluesky launches; image-driven posts. |
| `post-floor-crossing-with-images.ts` | Hard-coded batch poster for the 4 floor-crossing pieces. Reference for any future hard-coded batch. | Already executed; kept as a pattern. |
| `post-to-bluesky.ts` | Original launch-tweet poster (12-tweet array). Used by the original scheduling sequence. | Legacy; new posts use `post-arbitrary-bluesky.ts`. |

**The brand CTA** — both `post-one-x.ts` and `post-arbitrary-bluesky.ts` automatically append `Sources + full breakdown →` between the body and the URL whenever a link is being posted. Override the text with `--cta "<text>"`. Skip with `--no-cta` (rare). See `content/voice-playbook.md` §7 for the rationale.

**Multi-line bodies** — always use `--text-file <path>` for any post body that has more than one paragraph. Shell quoting truncates multi-line `--text "<body>"` to the first paragraph. Drafts live as plain `.txt` files in `content/social-drafts/`.

## Daily ops

| Script | What |
|---|---|
| `daily-ops.ts` | Single-entry health audit. Runs site checks, social-state fetches, mirror-queue depth, Umami stats, cadence audit. Writes a markdown report to `content/daily-ops/<YYYY-MM-DD>.md` and sends a ntfy summary. Scheduled daily 5 AM MDT (7 AM ET) via the `parliament-audit-daily-ops` task. |

Manual run: `npx tsx scripts/daily-ops.ts` (add `--no-ntfy` to skip notifications, `--quiet` for cron-friendly output).

## Mirror / cross-platform

| Script | What |
|---|---|
| `social-brief/mirror-to-x.ts` | Reads recent Bluesky originals, identifies posts not yet mirrored to X, filters out too-long / placeholder / loaded-language drafts, then either dry-runs or posts via the browser. Hard daily cap, 30-min spacing, state-file dedupe. |
| `social-brief/mirror-queue-apply.ts` | Hand-trimmed-queue version. Reads `scripts/social-brief/x-mirror-queue.json` (curated entries with optional `imageMode` for feed-card image attach) and posts in order with spacing. State-file dedupe + safety rails. |
| `social-brief/seed-mirror-state.ts` | One-off helper to mark Bluesky URIs as "already mirrored" without posting — solves the dedupe problem when manual + automated cross-posts mix. |

## Editorial

| Script | What |
|---|---|
| `voice-refiner.ts` | Pre-publish polish via local Ollama (`qwen3:14b` by default). Takes a draft `.txt` (or `--text "inline"`), runs through the voice playbook, returns a polished version. `--feedback-only` returns issues without rewriting. **Treat the rewrite as a starting point, not autopilot — the model can drift on facts.** |
| `ollama-review.ts` | Pre-publish "brutal editor" gate for full articles. Takes a `news-articles.ts` slug + research files + voice playbook, returns a verdict (PUBLISH / PUBLISH WITH FIXES / DO NOT PUBLISH) + required fixes. Used before high-stakes accountability publishes. |

## Analytics + debugging

| Script | What |
|---|---|
| `social-brief/bsky-stats.ts` | Bluesky profile snapshot + last-25 originals engagement. |
| `browser/x-stats.ts` | X profile snapshot via `.browser-profile/`. Returns last 6 posts + view counts. |
| `social-brief/check-bsky-recent.ts` | Last-12 Bluesky originals with timestamps. Audit tool for "did we double-post?" investigations. |
| `social-brief/umami-stats.ts` | Umami pageview / visitor / referrer fetch via the API. |
| `weekly-review.ts` | Monday ritual: 7-day window vs prior 7 days, top referrers, Monday checklist. |

## Utilities

| Script | What |
|---|---|
| `utm.ts` | `withUtm(url, opts)` — appends `utm_source`/`utm_medium`/`utm_campaign` to any `parliamentaudit.ca` URL. |
| `browser/post-x-lib.ts` | Shared `postToX()` function used by every X-posting CLI. Handles browser session, OG pre-warm, attached-image setInputFiles, and the brand CTA. |
| `browser/context.ts` | Shared Playwright context loader. `.browser-profile/` is the persistent session — login state survives across runs. |
| `browser/login-x.ts`, `login-bluesky.ts` | One-time logins (visible Chrome window). Run once after a fresh checkout to seed `.browser-profile/`. |

## The four-step pattern for a new article launch

1. Write the article in `apps/web/src/content/news-articles.ts` (insert at top of array — newest first).
2. Run `npx tsx scripts/ollama-review.ts <slug>` for an editorial gate.
3. Commit + push (Railway deploys; article goes live at `/news/<slug>`).
4. Draft posts as plain `.txt` files in `content/social-drafts/`. Optionally polish via `npx tsx scripts/voice-refiner.ts --file content/social-drafts/foo.txt`. Then post manually:
   - `npx tsx scripts/browser/post-one-x.ts --slug <slug> --text-file <draft>`
   - `npx tsx scripts/post-arbitrary-bluesky.ts --slug <slug> --text-file <draft>` (add `--image <url>` for an attached-image variant)

**Manual launch is preferred over scheduled tasks** for sensitive content. The scheduled-task path requires pre-approval ("Run now" once before relying on unattended runs) and has no human eyeball before the post fires. For cadence + amplification on already-shipped articles, scheduling is fine.
