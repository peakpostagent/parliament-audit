# Improvement Backlog — 2026-04-22

Ranked by ROI (best-ROI first). Source: [competitor-gap-analysis-2026-04-22.md](./competitor-gap-analysis-2026-04-22.md).

## Ship now — quick wins (~16 dev-hours combined)

- [ ] **#1 Smart Brevity article format** — axiom labels ("Why it matters", "Go deeper", "Between the lines") + bullet-forward template. ~3h. Source: Axios.
- [ ] **#2 Tag pages / topic hubs** — `/tag/[slug]` dynamic route + tag links on every article. ~4h. Source: NiemanLab.
- [ ] **#3 Source line + carousel format on chart images** — visible source URL on every OG chart; support 4-image carousel on X/Bluesky. ~4h. Source: Visual Capitalist.
- [ ] **#4 "How we reported this" per-story box** — collapsible methodology section per article. ~2h. Source: The Markup.
- [ ] **#5 CC republication footer / "Steal Our Stories"** — `/republish` page + article footer block with CC-BY-ND license + plain-HTML copy button. ~3h. Source: ProPublica.

## Q3 structural (foundation for everything downstream)

- [ ] **#6 Parliament Audit Builders supporter tier** — Stripe recurring + supporters-only bi-monthly newsletter. ~12h dev + user decisions on name/perks/price. Source: The Tyee.
- [ ] **#7 Weekly "How the press covered this vote" column** — Friday 600-word wire-voice media-criticism column. 2 user-hrs/week ongoing. Source: Canadaland.
- [ ] **#8 QCJO registration pathway** — unlocks 25% labour tax credit + subscriber tax credit. 4 user-hours to scope + accountant consult. Source: The Logic.

## Q4 flagships (step-function moves)

- [ ] **#9 MP vote-history searchable database** — every constituent shares their own MP's page → built-in viral referral engine. ~20h v1. Source: ProPublica Dollars-for-Docs.
- [ ] **#10 Annual "Predictions for Parliament" crowdsourced series** — December 2026 drop; 30-50 named contributors × their own amplification. 20+ user-hours Q3-Q4. Source: NiemanLab.

---

## Execution log

Tracking what actually ships — will update as I go tonight.

### Tonight's sprint

**Shipped (5/5 quick wins):**
- ✅ **#2 Tag pages** — commit `51e9a3f`. `/tag/[slug]` + `/tags` index; 38 tag pages pre-rendered; every article tag is now a clickable link; sitemap updated.
- ✅ **#3 Source line on chart images** — commit `99ecb36`. Standardized `SourceFooter` component across all 3 chart types (vote-split, budget-cuts, floor-crossing-poll) with source, URL, retrieval date, and PA brand.
- ✅ **#1 Smart Brevity header** — commit `1d5d793`. New optional `smartBrevity` article field ("The big thing" / "Why it matters" / "Go deeper" / "Yes, but" / "The bottom line"). Applied to Bill C-22 and Marilyn Gladu articles as seed examples.
- ✅ **#4 "How we reported this" methodology box** — same commit (`1d5d793`). Collapsible disclosure below Key Takeaways. Applied to the same 2 seed articles.
- ✅ **#5 Steal Our Stories / CC republication** — commit `e2e69c6`. New `/republish` page + per-article `RepublishBlock` (plain-HTML copy button with CC BY-ND 4.0 license + canonical link + tracking pixel) + `/api/republish-beacon` + footer link + sitemap entry.

**Remaining content task for you (trivial):** Roll out `smartBrevity` and `methodology` fields to the other 8 articles as a pure content edit. Pattern + 2 examples already in `content/news-articles.ts`.

### Overnight run (longer-run items)

**Shipped:**
- ✅ **#6 Builders supporter tier scaffold** — commit `ad418bc`. New `/support` marketing page + subscribers-table schema extended with supporter fields + nav entries + sitemap. Stripe NOT wired (awaits your tier/price decisions).
- ✅ **#9 MP page enhancements** — commit `ddabf0f`. `/mp/[slug]` now (a) surfaces our editorial coverage when we've written about that MP (floor-crosser profiles show instantly on /mp/marilyn-gladu etc.), (b) falls back gracefully when Postgres has no vote data yet. Ready for the vote pipeline to auto-populate the stats section on top.
- ✅ **#7 First Press Review column** — commit `394bb0a`. "How the Press Covered the Floor-Crossings: One Story Became Two." Grounded in real coverage from CBC, Globe, Hill Times, Sarnia Journal, Petrolia Lambton Independent, Tyee, Rebel, Postmedia. Introduces a new "Press Review" category. Sets the weekly-column pattern.
- ✅ **Smart Brevity + methodology rollout to Bill C-9 + budget cuts** — same commit. Four of ten articles now use the Axios-style header.

**Still-pending items in the backlog (need you):**
- **#6 Stripe wiring** — decide Builders tier prices, perks, and cadence. Swap the TBD buttons on `/support` for Stripe Checkout URLs. ~2 hours once decisions made.
- **#7 Weekly cadence** — commit to filing one Press Review column every Friday. The pattern is in place; new columns just drop into `news-articles.ts` with category "Press Review."
- **#8 QCJO registration** — book an accountant consult. Monetization doc has the sequencing.
- **#10 Predictions for Parliament** — December 2026 flagship; Q3-Q4 contributor outreach.
- **Smart Brevity rollout to remaining 6 articles** — pure content edit, pattern + 4 examples live in the codebase. User-hours, not dev-hours.
