# Overnight Report — 2026-04-24

Third overnight autonomous sprint. Short version then detail.

## The short version

Shipped the **daily social-brief pipeline** end-to-end. You now have a working editorial-review system for amplifying Canadian political content and replying to parliamentary threads — exactly the task you asked for before going to bed.

**How it works:**
1. Morning: `npx tsx scripts/social-brief/generate.ts` fetches last 24h from 27 curated Canadian handles + `#cdnpoli`, filters, ranks, and drafts replies/amplifications.
2. Output lands at `content/social-briefs/<YYYY-MM-DD>.md` with APPROVE / EDIT / REJECT checkboxes.
3. You spend ~10 min marking approvals in your editor.
4. Run `npx tsx scripts/social-brief/execute.ts --apply` to ship.

**Your first brief is live at `content/social-briefs/2026-04-24.md`** — 15 candidates, drawn from Philippe Fournier (@338canada), Aaron Wherry, and #cdnpoli.

## What shipped

### Scripts

| File | Role |
|---|---|
| `scripts/social-brief/generate.ts` | Morning job. ~350 LOC. Fetches, filters, ranks, drafts. Runs clean end-to-end (verified tonight). |
| `scripts/social-brief/execute.ts` | Posts approved items via AT Protocol. Dry-run default; requires `--apply` to actually send. Daily-cap safety rail (12 posts max, override with `--no-cap`). |
| `scripts/social-brief/resolve-watchlist.ts` | Audits every handle in watchlist.json against live Bluesky. Resolved 16/27 on first run; surfaced search candidates for the other 11. |
| `scripts/social-brief/watchlist.json` | 27 curated handles (journalists, MP leaders, parties, watchdogs, primary sources) + hashtags + positive/skip keyword lists. |
| `scripts/social-brief/README.md` | The workflow documented. Read this first. |

### Commits (in order)

| | |
|---|---|
| `b0b914b` | Ship daily social-brief pipeline (reply-first + amplify workflow) |
| `30781ec` | Resolve watchlist handles + tighten vote-split regex |

Pushed to `main`.

### Watchlist audit — what I confirmed tonight

**Verified live on Bluesky (16):** Justin Ling, Aaron Wherry, Althia Raj, Rosemary Barton, 338Canada (Fournier), David Akin, Jesse Brown (Canadaland), Matt Gurney, Carney, Poilievre, Singh, Blanchet, Liberal Party, NDP, Bloc, Democracy Watch, House of Commons.

**Found via search + updated (4):**
- Chantal Hébert → `chebert18.bsky.social`
- Stephen Maher → `stephenmaher.bsky.social`
- CCPA → `policyalternatives.ca`
- Green Party of Canada → `canadiangreens.bsky.social`

**Not on Bluesky yet (6, kept speculative with notes):** Paul Wells, Jen Gerson, official CPC account (an impersonator holds `@cpc-hq.bsky.social` — do not follow), CTF, Fraser Institute, Parliament of Canada official.

Re-run `npx tsx scripts/social-brief/resolve-watchlist.ts` any time to check for new arrivals.

## Safety rails I wired in

- **Human approval required** on every item. The machine drafts, you ship. Non-negotiable — one misjudged reply tanks the non-partisan brand.
- **Daily cap of 12 posts.** Any approval count >12 aborts with a warning. Override with `--no-cap` for a budget-day live thread.
- **Placeholder protection.** Draft replies contain `[ADD FACTUAL NOTE]` and `[SLUG]` markers. The executor refuses to post any reply still containing them.
- **Skip-keyword filter.** Posts using loaded language from any direction (libtards / cuckservatives / comrade / WEF / 15-minute cities / etc.) are disqualified before reaching the brief.
- **State ledger.** `content/social-briefs/.state.json` (git-ignored) records every URI we've drafted against or posted to. Prevents redrafting and prevents double-replying.
- **State-before-post.** `execute.ts` marks state *before* the API call and rolls back only on failure. A mid-run crash can't cause a double-post.
- **300-char limit.** Bluesky limit enforced client-side before posting.

## The output quality

Spot-check of tonight's brief:

- **#1: Fournier polling** — the bot flagged "vote split 21-22" from his Ontario polling post. That was a false positive (date range, not a vote split). I patched the regex in commit `30781ec` — it now rejects splits where both sides are < 30 or preceded by a month word. Tomorrow's brief will be cleaner.
- **#2 / #4: Fournier reposts** — safe amplifications, primary-source voice, factual.
- **#3: Wherry on "majority government" language** — flagged for repost. Reasonable candidate.

The drafts aren't ready-to-post as-is. That's by design: the text contains `[ADD FACTUAL NOTE]` and `[SLUG]` placeholders so you're forced to anchor the reply on a specific Hansard citation or vote record before shipping. Rejecting is also a valid call — you don't need to approve 15 every day. The cadence guidance still stands: 6-8 replies + 2-3 amplifications per day.

## Still needs you (unchanged from last night)

1. **Bluesky profile login** — actually done yesterday (commit `03738b7`), session verified tonight — should be off the list. ✓
2. **Stripe wiring for Builders tiers** — v1 prices live on `/support`, Stripe is the gap.
3. **Google Search Console DNS verification at Porkbun** — 10 min job, wires the non-branded-search signal into the Monday review.
4. **Review tomorrow's brief + run execute** — the daily ritual starts when you wake up.

## V2 deferred (by design)

- **X candidate fetching** — we have the X API write creds but reads require the paid tier. The browser-profile logged-in session could scrape the home feed but X's DOM and bot detection make that brittle. Defer until either (a) you OK a paid API tier, or (b) we accept the scraping fragility.
- **Mention tracking** — anyone who replies to @ParliamentAudit doesn't surface in the daily brief. Worth adding once we have replies to notice.
- **Cross-platform dedup** — if you approve the same idea as both a Bluesky reply and an X reply, the pipeline won't notice. Trivial to add.
- **Auto-scheduling via cron** — right now `generate.ts` runs on demand. Could wire a daily 8am trigger. I'd wait until you've run the ritual manually for a week to make sure the cadence actually lands before automating.

## One-line summary for tomorrow morning

> Open `content/social-briefs/2026-04-24.md`, mark approvals on the 6-8 best candidates, run `npx tsx scripts/social-brief/execute.ts --apply`. Done. ~10 min.

Good morning.
