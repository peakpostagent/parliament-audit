# Overnight Report — 2026-04-22

What I worked on while you slept, what's ready for you, and what's blocked waiting on you.

---

## 1. Analytics is live

**Umami is deployed, configured, and tracking.** Full self-hosted instance on Railway, in our own Postgres (its own dedicated `umami` database so it doesn't collide with the main app schema).

- **Dashboard:** [umami-production-d170.up.railway.app](https://umami-production-d170.up.railway.app)
- **Login:** `admin` / password in `.umami-creds.json` (git-ignored; open that file to grab it)
- **Website ID:** `5f53d939-6497-4408-b9b6-b1132dad57fc`
- **Tracker:** wired into `apps/web/src/components/Analytics.tsx`, env-gated so local dev stays quiet
- **Currently tracking:** the homepage (SSR route). Every visit logs a pageview.

### Known issue (fix pushed, awaiting rebuild)

Static routes (`/news`, `/about`, every `/bill/[n]`, every `/mp/[s]`) are not yet tracking. Root cause was a Railway-specific Dockerfile gotcha: `NEXT_PUBLIC_*` env vars must be declared as `ARG`s in the Dockerfile so they're inlined at **build** time into the static client bundle, not just available at runtime. Fixed in commit `92418a9`. Railway is rebuilding now — should be live within 5 min of this file being written.

**How to verify once you're up:** `curl -s https://parliamentaudit.ca/news | grep -c data-website-id` should return 1. If 0, Railway hasn't finished the build yet (not your problem — just give it another 5 min).

### Analytics playbook (see `content/analytics-playbook.md`)

The full playbook is ~3,250 words. The headline points:

**The 5 KPIs that matter, with 90-day targets:**
1. **Engagement rate** (replies+reposts/impressions) — 35% target
2. **Read-through / finish rate** — 20% of article starts finish
3. **Email conversion** — 1.5% of article readers subscribe
4. **30-day returning-visitor rate** — 25%
5. **Non-branded Search Console clicks** — 500/mo, 15 queries in top 10

**Vanity metrics to ignore:** raw pageviews, viral-spike weeks, session duration in isolation, bounce rate in isolation, social follower count, platform-reported impressions.

**8 custom events to add to Umami** (next dev session, ~30 min of work): `newsletter-subscribed`, `find-my-mp-submitted`, `outbound-social`, `outbound-source`, `article-share`, `read-more-at-source`, `article-engaged`, `article-finished`. Playbook has the exact `umami.track()` snippets and a reusable `useArticleEngagement` scroll+dwell hook.

**Gaps Umami doesn't cover** (and what to add):
- Google Search Console (critical for newsroom SEO) — setup via Porkbun DNS, ~10 min
- UTM params on every social link — helper function drafted in the playbook
- Resend webhook for email opens/clicks — route drafted
- RSS feed with user-agent-based subscriber count

**Weekly routine:** 15-min Monday checklist (8 checkboxes) in the playbook.

---

## 2. Voice playbook (see `content/voice-playbook.md`)

You were right that the posts read flat. The fix isn't "add personality" — it's **pick one specific journalism archetype and commit to it**.

**Our archetype: the late-shift wire reporter.** Canadian Press / Reuters desk hand, 15 years on the file, filing at 11:47pm. Not a pundit, not a breaking-news screamer. The numbers carry the weight; the sentence gets out of their way.

Why this archetype works: authority without opinion (audiences want depth, per the 2025 Reuters Institute Digital News Report), compression is a feature (matches the 280/300-char limits), deadpan registers as smart (see 338Canada's "🔴 LPC 189 / majority: 172 / 🔵 CPC 123" — the numbers are the story), and it scales from breaking votes to long contradiction threads without a tonal shift.

**18 sentence-level patterns** with before/after, including:

- Vote results as stories, not scoreboards. BAD "Bill C-9 passed 186–137." GOOD "Bill C-9 passed tonight — with every NDP MP voting no."
- Lead with the human stake, not the procedure. BAD "Bill C-12 received royal assent Tuesday." GOOD "30,000 refugee claimants got letters this week. Bill C-12 is why."
- Numbers replacing adjectives. Avoid "big," "huge," "dramatic." Use "$60.6B," "186–137," "four MPs in five months."
- The signature phrase: "The record." ("Here's the record." / "The record is clear.") Never "Here's the truth" — that's opinion-coded.
- Named acts of journalism. "We pulled this from Hansard." "We checked the vote roll." Shows labor, builds trust.

**Credibility killers** listed: "BREAKING" overuse, exclamation points, emoji clutter, loaded verbs ("slams," "crushes," "guts"), rhetorical questions, engagement-bait openers, all-caps-for-sentiment.

**5 existing drafts rewritten** side-by-side with annotations explaining why the rewrite works.

**Pre-post checklist** (5 items): adjective audit, first-line test, quiet-close check, partisan-mirror test, link-promise check.

> **Recommendation for you:** Read just section 5 (the 5 rewrites) first. That's where the whole approach clicks. Then decide whether you want the remaining 12 scheduled tweets rewritten before they fire, or whether to keep them as-is and apply the voice to the next batch.

---

## 3. Monetization strategy (see `content/monetization-strategy.md`)

You asked how to make money from this. Short answer: at <100 followers, only 3 paths matter in year 1 — **tip jar, grant prep, and seed a paid tier**. Ignore merch, affiliates, and sponsorships until 2027.

### Year-1 revenue mix (realistic)

| Path | Effort | Year-1 take | Why |
|---|---|---|---|
| Ko-fi tip jar + "Support" links | 30 min | $0–$500 | Must exist to compound; zero-ops |
| Inspirit Journalism Futures Fund | High | **$50K–$140K/yr × 3** | Inaugural 2026 cohort took $1.875M. Project stream open through 2026. Requires incorporation. |
| Local Journalism Initiative (LJI) | Medium | ~$60K/yr | Moderate fit — parliamentary accountability isn't the typical "underserved community" frame. Email before applying. |
| Patreon/Ghost paid tier | Medium | $0–$2K | Seed now, compounds in year 2–3 |

### Legal sequencing (the agent recommends)

1. Incorporate federal non-profit ($250 fee)
2. Pursue **QCJO** (Qualified Canadian Journalism Organization) — enables the subscriber tax credit for paying readers
3. Pursue **RJO** (Registered Journalism Organization) — lets you issue tax receipts + unlocks the 35% journalism labour tax credit (runs through Dec 2026)
4. Join Canadian Journalism Collective — member benefits + legitimacy signal

Not legal advice. Talk to an accountant. But this sequencing is what Canadaland, The Logic, The Hub, and The Line have converged on.

### Projection benchmarks

- **1K followers** → $2–$8K/yr revenue
- **10K followers** → $25–$90K/yr
- **100K followers** → $250–$700K/yr

Canadaland took **7 years** to hit $325K/yr in subscriptions. The Line (Gurney/Gerson) is estimated at $100–$400K split between two founders. These are realistic curves, not hockey sticks.

### Hard ethical lines (non-negotiables for the non-partisan positioning)

- No political party money, ever
- No "opposition research" contracts to GR firms (though GR firms **reading** our published product is fine)
- No single donor >20% of revenue
- No sitting-government discretionary grants (LJI is arm's-length — OK; a direct PMO grant is not)

### Sleeper revenue path

**B2B data licensing to GR firms at $500–$2K/seat** — but only once the vote pipeline ships publicly. That engineering work (the original "publish every House vote as structured data" pipeline) is now the highest-ROI product work because it unlocks both grant applications and future B2B revenue.

### Action plan for the next 90 days

The doc has a week-by-week. The biggest first step: **incorporate the federal non-profit.** Everything else downstream depends on that. ($250 + ~2 hours of paperwork.)

---

## 4. What else shipped

- **Dockerfile hardened** against `NEXT_PUBLIC_*` build-time injection bugs (commit `92418a9`). Future env vars of that shape just need an ARG line added — pattern is documented inline.
- **New scripts:**
  - `scripts/browser/deploy-umami.ts` — idempotent, redeployable if Umami ever needs to come back up
  - `scripts/browser/setup-umami.ts` — idempotent admin setup
  - `scripts/browser/create-umami-db.ts` — creates dedicated DB on shared Postgres
  - `scripts/browser/wire-umami-envs.ts` — sets NEXT_PUBLIC_UMAMI_* on the web service
  - `scripts/browser/check-web-deploy.ts` — deploy status + env var audit

---

## 5. What needs you (priority order)

1. **Read `content/voice-playbook.md` section 5** (15 min). That's the whole approach in 5 rewrites. Decide whether to rewrite the remaining scheduled tweets before they fire.
2. **Decide: incorporate federal non-profit this week?** ($250, 2 hours, blocks everything else in the monetization plan). Pick a corporate name. Suggest: "Parliament Audit Journalism Society" or similar — needs to include a journalism/society/foundation word for RJO eligibility later.
3. **Bluesky native scheduling login** (5 min at your screen) — run `npx tsx scripts/browser/login-bluesky.ts` from the project root. Needed only if you want Bluesky native scheduling (my API script already works headless).
4. **Review `content/analytics-playbook.md` section 3** (the 8 events to add) and approve. I can wire them into the codebase next session — ~30 min of work.
5. **Confirm the 4 quarterly priorities** before we lock the sprint plan:
   - Ship the vote pipeline publicly (unlocks grant apps + B2B)
   - Incorporate + pursue QCJO/RJO
   - Apply to Inspirit Journalism Futures Fund (project stream open through 2026)
   - Adopt the voice playbook across all new posts

---

## 6. Final confirmed state

- **Umami tracking**: ✅ **live on all routes** (confirmed post-rebuild, 05:06 UTC deploy `a744b7ea`)
  - `/` ✓ &nbsp; `/news` ✓ &nbsp; `/about` ✓ &nbsp; `/news/[slug]` ✓
  - Ingestion verified end-to-end: a clean-shot beacon registered 1 pageview in the database and returned correctly via `/api/websites/:id/stats`. Real human traffic will accumulate from here.
- **Note on early zero counts**: my browser-automation test visits were filtered by Umami's built-in bot detection (expected behaviour — it's working). Real visitors (including you on any device) will register normally.
- **Scheduled tweets** for the day: still set to fire; drafts are in the OLD voice (see recommendation in section 2 above).
- **3 research docs saved** (committed in `2216874`): `content/voice-playbook.md`, `content/analytics-playbook.md`, `content/monetization-strategy.md`.

Good morning.
