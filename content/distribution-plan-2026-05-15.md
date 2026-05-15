# Parliament Audit — Distribution Plan, May 15 2026

## Current state (baseline)

- **Site**: 9 unique visitors / 12 pageviews / past 7 days (Umami). Bounce rate ~80%.
- **Bluesky**: 1 follower, ~30 original posts shipped.
- **X**: ~5 posts shipped, low engagement (single-digit views per post).
- **Article inventory**: 16 articles, all sourced, all imageMode-ready for OG cards.
- **What's working**: Every Umami visitor in the last 24h came from `go.bsky.app` or `t.co`. Our posted content is converting clicks. The audience just isn't built yet.

## 30-day goal

- **Site**: 100+ unique visitors / week
- **Bluesky**: 50–100 followers (interim milestone toward the 1,000-follower outreach threshold)
- **Earned media**: deferred until 1K-follower threshold reached (operator decision 2026-05-15)

## Long-arc goal: 1,000 Bluesky followers before any earned-media outreach

Operator-set credibility floor. Until we cross 1,000 followers, any journalist
who clicks our profile from a cold-outreach email sees a small account and
makes a snap judgment we can't recover from. Better to wait and arrive
with social proof.

### Honest timeline estimate

| Tactic | Realistic monthly delta | To 1,000 |
|---|---|---|
| Daily 3-reply quota only | +30–80 followers/mo | 12–30 months |
| Replies + cadence (2 posts/day, all proofread, with strong stat cards) | +60–150 followers/mo | 7–16 months |
| Above + 2–3 viral-tier breakdowns (a vote that becomes news while we're already on it) | +200–500 followers/mo | 3–6 months |
| Above + a paid Bluesky Premium amplification on one strong article | +400+ in a single week | 1–3 months |

We do not have to commit to any tier above the first now. The plan ramps
naturally: ship daily, watch which posts compound, double down on what works.

The 1K threshold is far enough out that **none of the operator decisions we
were waiting on (outreach target, outreach email tone) are blocking** for now.
That clears focus to execution.

## Why this is a brand-safe distribution problem, not a content problem

Our content is already at publishable quality (Sonnet 4.6 proofread, primary sourcing on every claim, non-partisan voice). The problem is reach. The fix is not to make the content louder — it's to put it in front of the existing #cdnpoli audience that doesn't yet know we exist.

---

## Week 1 (May 15 – May 22) — checklist

### Day 1 (today, May 15)

- [ ] **Bootstrap follow batch (Bluesky)**: Follow ~60 high-quality #cdnpoli accounts in one batch. Use:
  - The Canadian journalism starter pack at <https://blueskystarterpack.com/canadian-journalism>
  - The Canadian News starter pack at <https://blueskystarterpack.com/canadian-news>
  - Hill Times starter pack at <https://blueskystarterpack.com/starter-packs/@jchidleyhill.bsky.social/the-canadian-press-3lbplh6bfp62u>
  - From these, filter to: press-gallery reporters, parliamentary procedure nerds (Procedure & House Affairs chairs, clerks-emeritus), policy academics, electoral data accounts, and watchdog orgs (Democracy Watch, Samara Centre).
  - **Skip**: anyone whose feed is dominated by partisan commentary; we want to be discovered by neutrals.
  - Expected payoff: appears in 60 accounts' "new follower" notifications + makes us visible in their "people you may know" lists.

- [ ] **Set up Mastodon mirror (canadian-news Mastodon servers are an underrated #cdnpoli audience)**:
  - Create `@parliamentaudit@mstdn.ca` or similar
  - Wire an RSS-to-Mastodon bot pointed at `parliamentaudit.ca/rss.xml`
  - Cost: free, ~30 minutes setup

- [ ] **Submit to Google News Publisher Center**: <https://publishercenter.google.com>. Adds eligibility for News Showcase and "Top Stories" panels. Approval takes 1–3 weeks.

### Day 2 (May 16)

- [ ] **Daily reply quota: 3 factual additions to #cdnpoli threads on Bluesky**. Voice rules apply (Hansard / vote-count / budget-table additions only; no opinions, no rhetorical questions). Target accounts:
  - `@aaronwherry.bsky.social` — CBC, parliamentary procedure
  - `@338canada.bsky.social` — non-partisan electoral analysis, very active
  - `@davidakin.bsky.social` — daily political roundup
  - `@chebert18.bsky.social` — At Issue, FR + EN
  - `@justinling.bsky.social` — civic-data-friendly journalist
  - `@democracywatch.bsky.social` — we cited them in the d'Entremont piece, leverage the existing connection
- [ ] **One quote-repost** of @ourcommons.bsky.social on any vote announcement, adding our breakdown link.

### Day 3 (May 17)

- [ ] **Same daily reply quota (3 + 1 quote-repost)**.
- [ ] ~~First earned-media outreach~~ — **SHELVED until we hit 1,000 Bluesky followers** (operator decision, 2026-05-15). Until then we lean entirely on organic distribution: daily replies, follow-back from the bootstrap batch, content cadence, and the algorithmic-discovery surface. Outreach gets revisited when a journalist clicking our profile sees a 1K-follower civic-data account, not a 1-follower account. Email draft remains in this doc for that moment.

### Day 4 (May 18)

- [ ] **Daily reply quota**.
- [ ] **Twitter/X parallel pass**: follow ~30 of the same Canadian press-gallery accounts on X. X's algorithm deprioritizes low-follower accounts, so we play the long game. One reply per day max.
- [ ] **Cross-poll with our content**: notice that 338canada is posting about Alberta referendum + Scarborough Southwest nomination chaos. We have the [alberta-citizen-petition-quebec-referendums-compared](https://parliamentaudit.ca/news/alberta-citizen-petition-quebec-referendums-compared) and [party-nominations-non-citizens-can-vote](https://parliamentaudit.ca/news/party-nominations-non-citizens-can-vote) articles. Surface them as factual additions to 338canada threads.

### Day 5 (May 19)

- [ ] **Daily reply quota**.
- [ ] **Newsletter sign-up bootstrap**: our `/subscribe` endpoint is wired to Resend (we verified yesterday). Mention the newsletter in one Bluesky post + pinned-post update. Audit subscribers DB; if anyone signed up between deploy and now, send them a "welcome + here's what we publish" via Resend.

### Day 6 (May 20)

- [ ] **Daily reply quota**.
- [ ] **Indexing & freshness**: ping IndexNow for the 4 articles published this week (Bing, Yandex). One-time `curl` per slug. Improves search-engine pickup speed by hours/days.

### Day 7 (May 21–22) — weekly review

- [ ] **Re-pull Umami stats**. Compare 7-day numbers vs last week's baseline (12 pv / 9 visitors).
- [ ] **Check Bluesky follower delta** (target: 1 → 20–30 minimum from the follow-back wave alone).
- [ ] **Note which replies got engagement**. Double down on the reply styles that worked; drop the ones that didn't.

---

## Recurring (every day, not just Week 1)

- **Daily auto-publish gate** continues running (`parliament-audit-daily-ops` cron 5 AM MDT + 1 PM MDT). Posts our own content.
- **The 3-reply quota is the actual lever.** Owned-channel posts hit our 1-follower audience; replies to high-reach #cdnpoli accounts hit thousands. The math heavily favors the replies.

---

## What I am NOT recommending

- **Paid promotion** (Bluesky Premium amplification, X promoted posts): premature. Build organic credibility first. If we still have <50 followers in 60 days, then revisit.
- **Reciprocal-follow gaming**: don't follow accounts that don't add value just to inflate metrics. Damages the algorithmic signal that recommends us to neutrals.
- **Aggressive hashtag use**: \#cdnpoli is enough. Stacking 4+ hashtags reads as a small account trying to compensate.
- **Engagement-bait posts** (\"Did you know..." / "Hot take..."): violates voice playbook. The factual-addition-only rule is part of our differentiation; without it we're just another opinion account.

---

## Outreach email draft (use ONE of these)

### Pitch to Justin Ling, Aaron Wherry, or Tim Bousquet

> Subject: A civic-data project tracking how Carney's caucus actually votes
>
> Hi [Name],
>
> I run Parliament Audit (parliamentaudit.ca), a small civic-media project that tracks every recorded House of Commons vote and writes factual breakdowns — no opinion, no engagement bait, every claim sourced to Hansard / StatsCan / committee transcripts. It launched in early April.
>
> Two recent pieces you might find useful as primary-source background:
>
> 1. **Spaceport Canso $200M lease**: The Department of National Defence is paying Maritime Launch Services $20M/year for a launch pad that consists of one concrete slab and two shipping containers. MLS reported $14,980 in 2025 revenue. Full breakdown: <https://parliamentaudit.ca/news/spaceport-canso-200m-defence-lease>
>
> 2. **Federal party nomination rules and non-citizens**: Per the Hogue Commission, the LPC allows anyone who "ordinarily lives in Canada" to vote in nomination contests; CPC/NDP/Green require PR or citizenship; the Bloc requires neither. The Canada Elections Act doesn't regulate this. Full breakdown: <https://parliamentaudit.ca/news/party-nominations-non-citizens-can-vote>
>
> Not asking for coverage or a follow — just dropping these in case the receipts are useful. Happy to be a citation, never a partisan source.
>
> — Alex Croft (parliamentaudit.ca)

**Why this email**:

- Short. No CTA. Doesn't ask anything.
- Leads with the strongest fact (concrete slab + $14,980 revenue) — the journalist will click out of curiosity even if they ignore the rest.
- "Be a citation, never a partisan source" is the framing journalists like — we're useful, not seeking favors.
- Pseudonym Alex Croft is consistent with the X/Bluesky display name.

---

## Metrics to watch

| Metric | Baseline (May 15) | Day-7 target | Day-30 target | Outreach gate |
|---|---|---|---|---|
| Bluesky followers | 1 | 20 | 50–100 | **1,000** |
| Site visitors / 7-day | 9 | 30 | 100+ | — |
| Site pageviews / 7-day | 12 | 50 | 200+ | — |
| Bounce rate | 80% | <70% | <60% | — |
| Articles published | 17 | 19 | 27 | — |
| Earned-media mentions | 0 | 0 | 0 | first outreach unlocks at 1K followers |

If we miss Day-7 by a lot, the issue is reply-quota execution, not the plan. If we hit Day-7 but miss Day-30, we're getting noticed but not retained — that's an article-mix / CTA / newsletter problem.

**Outreach gate**: every weekly review, log current Bluesky follower count. The day we hit 1,000, re-read the outreach section below and ship the first email within 48 hours of crossing the threshold. Don't wait for "the perfect article" — at 1K followers, three of our existing pieces (Spaceport Canso, Party nominations, Energy net-importer) are already strong enough to lead with.

---

## What I want from you (the operator)

- [x] **Approve the bootstrap-follow batch** — done 2026-05-15: 33 followed, 0 failed, 23 unresolved logged for next-session chase.
- [ ] ~~Pick ONE of the three earned-media outreach targets~~ — deferred to 1K-follower threshold (operator decision 2026-05-15).
- [ ] ~~Confirm tone of the outreach email~~ — deferred to 1K-follower threshold (re-review the email draft at that moment in case our brand voice has evolved).
- [ ] **Decide on Mastodon mirror** — yes or no. Free, ~30 min setup, ongoing cost = 0. Canadian-news Mastodon servers have an underserved #cdnpoli audience.

Everything else is execution. I can run most of it autonomously on the cron schedule + per-day prompts.
