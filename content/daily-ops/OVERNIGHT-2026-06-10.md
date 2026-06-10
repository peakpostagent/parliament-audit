# Overnight summary — 2026-06-10 (02:00–03:30 MDT)

Operator went to bed ~02:00 asking for overnight work + a 9 AM auto-task
restart (scheduled task `morning-auto-tasks` fires once at 09:00).

## Completed overnight (all committed + pushed, main @ bc2546d)

1. **Sonnet tragedy-halt auto-override** (`halt-on-tragedy.ts`).
   On any keyword trip, Sonnet judges "would a Canadian reader find a
   parliamentary post jarring right now?" False positive → flag
   auto-cleared/never written, ntfy with reasoning. Fail-safe: API
   error keeps the halt. Verdict cache by evidence hash. Calibration
   verified with `--test-sonnet`: Philippines earthquake → clears;
   Kyiv mass-casualty strikes → holds. (Both match operator precedent.)

2. **Emergency-recycle generator** (`social-brief/emergency-recycle.ts`).
   Re-promotes a back-catalogue Accountability article with a
   Sonnet-fresh ≤270-char body when there's nothing new to post.
   Eligibility: ≥14 days old, 60-day cooldown, least-recently-recycled.
   Wired into daily-ops as: series → mirror queue → recycle → amplify.
   Dry-run tested (picked floor-crossing piece, clean 183-char body).

3. **Per-MP "Votes by topic"** on /mp/<slug> + find-your-mp link.
   Server-side aggregation off vote_member_results via the topic
   taxonomy. Deliberately descriptive ("Yea on 12 of 14 privacy &
   surveillance votes"), never directional — directional labels would
   invert meaning on surveillance bills. Postal lookup now links to
   the MP record page (verified in preview with M4K 1N6 → Dabrusin).
   NOTE: prod vote_member_results is EMPTY — section won't render
   until the vote-ingestion pipeline runs. Render layer is guarded.

4. **Vote-watcher live posting + cron wiring** (`watcher/vote-watcher.ts`).
   Apply path posts deterministic template drafts (official XML values,
   no LLM prose) to Bluesky with link card to the official division
   page. Cap 2/run; capped/failed votes retry next poll (fixed
   lastSeenDivision to only advance through decided votes). Runs as
   Priority 0 in the daily-ops gate. State bootstrapped at division
   144 — only divisions ≥145 post live.

5. **X mirror queue pruned**: 21 stale April/May pending entries
   removed per the social split. 0 pending; dedupe history intact.

## For the 9 AM run

- Confirm the 5:03 AM cron: should have fired evergreen day-03
  (notwithstanding clause) SITE-ONLY (.site-only marker) — check
  content/daily-ops/2026-06-10.md gate section says series fired with
  --skip-bsky --skip-x.
- Vote-watcher: House may sit today; new divisions ≥145 will post to
  Bluesky automatically via the 1:03 PM cron. Eyeball the first live
  one for format quality.
- June 12 CRTC fee-ban rules take effect in 2 days — strong follow-up
  story hook; the wireless-oligopoly article (shipped June 10) already
  covers it and can be referenced/quote-posted.
- Yesterday's social: wireless-oligopoly Bluesky 3mnwaet3utx2g, X
  2064618072338784626 — check engagement in analytics snapshot.

## Standing operator items (unchanged, do not nag more than once)
- DATABASE_URL_PROD unset (newsletter count unknown)
- Stripe KYC for /support
- Affiliate sign-ups (Bookshop.org / NordVPN / ExpressVPN) → then fill
  AFFILIATE config in apps/web/src/app/reading/page.tsx
