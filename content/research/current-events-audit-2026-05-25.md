# Current Events Audit — House of Commons Coverage Gap

_Generated 2026-05-25 by overnight autonomous run, after the user asked: "make sure we are still reporting current events that are happening in the house of commons."_

## Headline finding

**Bill C-11 (National Defence Act amendments) passed 3rd reading TODAY at 3:35 PM MDT.** Parliament Audit has NOT covered it on Bluesky, X, or the site. This is the largest single coverage gap as of right now.

A second-tier gap: **Bill C-30** received time allocation (closure) today at 1:07 PM MDT, signalling it is the next major bill being moved through the House on a government priority track. We have no coverage.

A third gap from earlier this month: an **opposition motion on "measures to support manufacturing"** passed on May 6. This would have been the perfect pairing for the auto-industry article we just shipped — coverage gap left unfilled.

## What's been happening in the House (May 2026)

From the ourcommons.ca XML feed (parlSession=45-1), the 15 most recent recorded divisions:

| Division | Date | Result | Subject | Bill | Covered? |
|---|---|---|---|---|---|
| 123 | 2026-05-25 15:35 | Agreed To | 3rd reading and adoption | **C-11** | ❌ No |
| 122 | 2026-05-25 15:25 | Negatived | Recommittal motion | C-11 | ❌ No |
| 121 | 2026-05-25 15:15 | Negatived | Opposition Motion — Protection of private property rights | — | ❌ No |
| 120 | 2026-05-25 13:07 | Agreed To | Time allocation | **C-30** | ❌ No |
| 119 | 2026-05-06 15:45 | Agreed To | Ways and means motion No. 11 | — | ❌ No |
| 118 | 2026-05-06 15:15 | Agreed To | Opposition Motion — Measures to support manufacturing | — | ❌ **No (and highly relevant to today's auto piece)** |
| 117 | 2026-05-05 15:50 | Agreed To | Concurrence at report stage | C-11 | ❌ No |
| 116 | 2026-05-05 15:45 | Negatived | Report stage Motion No. 9 | C-11 | ❌ No |
| 115 | 2026-05-05 15:40 | Agreed To | Report stage Motion No. 6 | C-11 | ❌ No |
| 114 | 2026-05-05 15:35 | Agreed To | Report stage Motion No. 5 | C-11 | ❌ No |
| 113 | 2026-05-05 15:30 | Negatived | Report stage Motion No. 4 | C-11 | ❌ No |
| 112 | 2026-05-05 15:25 | Agreed To | Report stage Motion No. 3 | C-11 | ❌ No |
| 111 | 2026-05-05 15:20 | Negatived | Report stage Motion No. 2 | C-11 | ❌ No |
| 110 | 2026-05-05 15:15 | Negatived | Report stage Motion No. 1 | C-11 | ❌ No |
| 109 | 2026-05-04 15:15 | Negatived | Opposition Motion — Sovereign debt funds | — | ❌ No |

## What Parliament Audit covered this month

May 2026 coverage on parliamentaudit.ca + Bluesky + X:
- Bill C-22 series Days 1-7 (May 19-25) — full coverage
- Bill C-22 MP-accountability piece (May 21) — full coverage
- Canadian auto industry 2014 vs 2024 (May 25) — full coverage (just shipped)
- (April pieces: Bill C-9, Bill C-12, floor crossings, Budget 2025 — completed coverage from prior month)

**Net assessment:** Out of 15 recorded divisions since May 4, we've covered zero — and four of them are first-order news (C-11 passage, C-30 closure, manufacturing motion, sovereign-debt motion).

## Why this happened

The series-publisher autopilot (scripts/series/publish-next-day.ts) is wired to publish from `content/series/bill-c-22/` only — there's no autopilot for non-series news. Once the C-22 series completed, the autopilot had nothing to ship.

The vote-watcher (scripts/watcher/vote-watcher.ts, task #21) was built but is not yet live-posting (task #24 deferred). It can detect new votes and generate draft posts, but doesn't push them through the publish pipeline.

## What should ship next (priority order)

### Tier 1 — ship in the next 24 hours

1. **Bill C-11 — National Defence Act Amendments passed 3rd reading.** Top of the news cycle. The bill has been in our topic taxonomy (`'C-11': ['defence-foreign']`) and our coverage planning lists it. Needs: full article walking what the amendments do, the vote split, the opposition arguments, and what happens next (Senate). One-day turnaround.

2. **Bill C-30 — time allocation passed.** The government is moving C-30 on closure. The story is "what is C-30 and why is the government in a hurry." Needs: a primer + the time-allocation context.

### Tier 2 — ship this week

3. **Opposition motion on manufacturing (May 6) — agreed to.** Direct pairing with today's auto-industry article. The opposition motion proposes specific manufacturing-support measures; covering it would extend the auto-industry story arc and tie our economic angle to a concrete parliamentary moment.

4. **Bill C-11 report-stage amendment record (May 5).** Six of the seven amendments at report stage were government-supported. Two opposition amendments were defeated. Worth surfacing the amendment-by-amendment record for civic-engagement readers.

### Tier 3 — backfill for completeness

5. **Opposition motion on sovereign debt funds (May 4) — defeated.** Niche but on-brand for the audit / accountability angle.

6. **Ways and means motion No. 11 (May 6) — agreed.** Procedural, low audience-interest but should appear in the audit ledger for completeness.

## Structural recommendation

**Wire the vote-watcher live (task #24, currently deferred).** As long as new votes happen and we don't auto-detect+queue them, we will keep missing news. The vote-watcher already:
- Polls ourcommons.ca every 15 min (via parliament-pulse-vote-poller scheduled task)
- Classifies divisions (close / unanimous / bill-vote / noteworthy / skip)
- Generates deterministic draft posts

What it doesn't yet do:
- Push draft articles into news-articles.ts
- Post drafts to social media without operator approval

The path I'd recommend (does NOT need overnight execution; for operator review):
1. Add a "vote-watcher autonomous mode" flag — when set, the watcher's `noteworthy` and `bill-vote` classifications auto-publish drafts to a `pending/` queue.
2. Each morning's daily-ops cron checks the `pending/` queue; if anything has been there >12h without operator review, it auto-publishes.
3. This gives the operator a 12-hour review window per piece but defaults to publishing if no action.

The alternative is operator-driven coverage, which is what's been happening — but that means coverage gaps when the operator is busy (as has just happened with C-11).

## What the operator should review

- Authorize ship-Bill-C-11 in the morning (Tier 1, item 1)
- Decide whether to enable vote-watcher autonomous mode
- Sign off on the manufacturing-motion piece as a follow-up to the auto-industry article

## Coverage-gap audit cadence

Recommend running this audit weekly. The script would be: pull the recent divisions feed, cross-reference against news-articles.ts slugs, flag uncovered divisions ranked by significance. ~30 lines of TypeScript. Not built yet but trivial to add.
