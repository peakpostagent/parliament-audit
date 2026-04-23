# Overnight Report — 2026-04-23

Second overnight autonomous sprint. What shipped, what's pending, where to start your morning.

## Shipped this session

### Content rollout
- **Smart Brevity + methodology across all 11 articles.** The Axios-style header ("The big thing / Why it matters / Go deeper / Yes, but / The bottom line") + "How we reported this" box are now on every piece. Rolled out: floor-crossing roundup, Bill C-12, Bill C-225 Bailey's Law, Jeneroux, Ma, d'Entremont (the remaining 6 — the first 4 shipped yesterday).

### Analytics instrumentation (playbook §3 complete)
- **8 custom Umami events wired** into the codebase:
  - `newsletter-subscribed`, `find-my-mp-submitted`, `outbound-source`, `outbound-social`, `article-share`, `read-more-at-source`, `article-engaged`, `article-finished`, plus `builder-intent`
- **Safe `track()` wrapper** in `apps/web/src/lib/analytics.ts` — never crashes the page, silently no-ops in dev/no-env/ad-blocked environments
- **Article engagement tracker** — fires `article-engaged` (30s + 50% scroll) and `article-finished` (reading-time × 30s + 95% scroll) exactly once per page
- **Source + Share components** wrap every outbound article-footer link with click tracking
- **Subscribe form** captures `?intent=builder&tier=<slug>` query params from `/support` CTAs and fires `builder-intent` on load + stores `builder-waitlist:<tier>` as the signup_source in DB

### Distribution
- **RSS 2.0 feed at `/rss.xml`** — full article bodies with CC-BY-ND-4.0 republish note, discoverable via `<link rel="alternate">` in `<head>`, linked in footer, in sitemap
- **UTM auto-tagging** — `scripts/utm.ts` auto-appends `utm_source` / `utm_medium` / `utm_campaign` (ISO week) to every parliamentaudit.ca URL posted via `post-to-bluesky.ts` or `post-to-x.ts`. Umami can now attribute every click back to the exact platform + week even when the referer header is stripped (as X does).

### New pages
- **`/builders`** — public supporter wall. Renders from the `subscribers` table (`supporterDisplayPublicly=true`) in 3 tiers: Founding Builders / Builders / Supporters. Empty today; populates the day Stripe + opt-in wire up.
- **`/press-review`** — dedicated landing for the weekly column, brand-first lead explaining cadence + methodology. Separate from the `/tag/press-review` auto-archive.
- **`/support/opengraph-image`** — branded 1200×630 social card for the Builders marketing page. "Keep the record public." Hero.

### Infrastructure polish
- **Search Console + Bing verification placeholders** — env-var gated. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` on Railway, and the `<meta>` auto-renders. Same for `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
- **Weekly-review CLI** — `npx tsx scripts/weekly-review.ts` prints a Monday terminal dashboard (last-7-days vs. prior-7-days deltas, top referrers, and the 8-item Monday checklist from the analytics playbook). Single command instead of a dashboard login.

### Smoke test
All 9 new/modified routes return HTTP 200:
```
/                                        HTTP/1.1 200
/news                                    HTTP/1.1 200
/tag/accountability                      HTTP/1.1 200
/tag/floor-crossing                      HTTP/1.1 200
/press-review                            HTTP/1.1 200
/support                                 HTTP/1.1 200
/builders                                HTTP/1.1 200
/republish                               HTTP/1.1 200
/rss.xml                                 HTTP/1.1 200
```
RSS feed has 11 items; XML parses cleanly.

## Current Umami snapshot

`npx tsx scripts/weekly-review.ts` at the end of this session:
- **7 pageviews / 6 visitors** in the first 24h of tracking (baseline)
- Top referrer: google.com (my test beacon)
- No X or Bluesky referrers yet — which is exactly what the UTM auto-tagging shipped tonight will fix for future posts

Don't read into the numbers. Full honest read at `content/analytics-report-2026-04-22.md`.

## Still needs you (priority order)

1. **Bluesky native-scheduling login** (5 min at screen) — `npx tsx scripts/browser/login-bluesky.ts`. Not urgent but unblocks native scheduling.
2. **Stripe wiring for Builders tiers** — v1 prices and perks are live on `/support`. Swap the `/subscribe?intent=builder&tier=<slug>` hrefs for Stripe Checkout URLs. ~2 hours.
3. **Search Console DNS verification at Porkbun** — add TXT record, then set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` on Railway. Enables search visibility tracking in the weekly review.
4. **Commit to the weekly Press Review cadence** — pattern + two landing pages + sidebar archive are in place. Every Friday, drop a new article with `category: 'Press Review'` into `news-articles.ts`.
5. **Incorporate the non-profit** — $250 + ~2 hours of paperwork. Blocks QCJO + RJO + Inspirit grant application. Nothing else monetization-wise moves without this.

## Second Press Review column shipped

**"The Budget Called Both 'Austerity' and 'Not Really Cutting' by Opposite Sides"** — grounded in real coverage from CBC, Globe (Bill Curry), National Post (Kelly McParland), CCPA (David Macdonald), PSAC, Canadian Taxpayers Federation, Fraser Institute, PressProgress, and The Tyee. Names the three incompatible framings that emerged from the same budget document. Research file at `content/press-coverage-research-budget-cuts.md` captures every URL used.

**⚠️ Factual issue flagged by the research agent — needs your call.**

The existing article `federal-budget-cuts-60-billion-public-service` (in `news-articles.ts`) is dated April 15, 2026 and references "the 2026 federal budget." Per the research: there is **no federal Budget 2026 on that date**. The $60B / 40,000-FTE plan was **Budget 2025** ("Canada Strong") tabled by Finance Minister Champagne on **November 4, 2025**. The **Spring Economic Update** is scheduled for **April 28, 2026**.

The new Press Review column I just wrote uses the correct dates (Nov 4, 2025 budget + April 28, 2026 update). But the original article still carries the inaccurate framing.

**Three ways to resolve:**
1. **Rewrite the original article** to anchor on the real Budget 2025 dates + cite the departmental plans tabled March 17-18, 2026.
2. **Reframe it** as a post-budget-first-six-months retrospective pegged to the upcoming Spring Economic Update — keep the publish date but acknowledge it is a retrospective.
3. **Quiet-correct**: add an editor's note at the top ("Corrected 2026-04-23: this article originally misidentified Budget 2025 as Budget 2026") and adjust the dates in the body.

I did not edit the existing article silently. Your call on which move. Option 1 is the cleanest; option 3 is the most transparent if the piece has already been circulated.

## Everything that changed tonight

```
e5ee817  /press-review landing + /support OG image + nav wiring
9c05260  /builders supporter-wall page + cross-link from /support
f7a0300  UTM auto-tagging + RSS feed
0ffa17f  Umami events + Smart Brevity complete (11/11) + analytics report
e1c68c8  weekly-review.ts for Monday ritual
44c3726  Search Console + Bing verification placeholders
```

Full commit log: `git log --oneline 110fe02..HEAD` (since the v1 Builders pricing).

Good morning.
