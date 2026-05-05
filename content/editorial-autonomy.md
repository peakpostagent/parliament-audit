# Editorial Autonomy — what Claude posts unattended

This is the rulebook for what gets published from `@ParliamentAudit` (X) and `@parliamentaudit.bsky.social` (Bluesky) **without you reviewing each post first**. It is also the kill-switch and audit-trail policy.

The brand can survive a slow-news week. It cannot survive a single misjudged post on a non-partisan account. So: I auto-publish only the categories where the editorial risk is provably low; everything else still routes through you.

---

## Auto-publish allowed

These run unattended via the daily-ops scheduled task. ntfy fires on every action.

### 1. Mirror-queue items (`scripts/social-brief/x-mirror-queue.json`)
Already-edited drafts that you (or I) wrote and saved to the queue. These passed editorial review at write-time. Auto-fire is just the trigger.

### 2. Curated primary-source amplifications (`content/amplification-queue.json`)
Reposts/quote-skeets of vetted accounts: House of Commons (`@ourcommons.bsky.social`), Auditor General (when accounts are real), specific Canadian press-gallery journalists, Democracy Watch, etc. The full curated list lives in `content/amplification-queue.json` — anyone added there is on the trusted list. Removing names from the list takes one edit.

### 3. Maintenance / housekeeping
- "RSS feed published" thread when a new article goes live (auto-fires the article URL post)
- Periodic "Find Your MP" / "Subscribe" reminders pulling from a fixed copy bank — frequency-capped at one every 14 days

---

## Auto-publish forbidden

These ALWAYS route through you, no matter what. The daily-ops task doesn't fire them; it surfaces them via ntfy + drafts saved to `content/social-drafts/`.

### A. Fresh accountability articles
Anything in `apps/web/src/content/news-articles.ts` that's marked `publishedAt` after the last daily-ops run AND has not been previously discussed with you. PrescribeIT showed Ollama can hallucinate facts during voice-refinement; new articles need human eyes on the receipts.

### B. Replies to specific journalists or politicians
The reply-first growth strategy is high-leverage but also high-risk. A misjudged reply-tag in a #cdnpoli thread is a screenshot magnet. Until we have a tested reply-quality gate, replies stay manual.

### C. Quote-skeets / quote-tweets that add our framing
Reposting a primary source's text is low risk. Adding our own commentary on top of someone else's post introduces editorial voice — that's a manual call.

### D. Contested or partisan-flagged content
- Anything with words on the loaded-language list (`scripts/social-brief/watchlist.json` `keywords_skip`)
- Anything that could be characterized as taking a partisan side
- Anything that requires interpretation of motive or intent

### E. Account-level changes
- Profile bio / name / banner / handle
- Following or unfollowing accounts (algorithmic signals)
- Any payment / Stripe / billing action
- DMs

---

## Hard rate limits (autopilot guardrails)

| Limit | Value |
|---|---|
| Max auto-posts per day per platform | **3** |
| Min minutes between auto-posts | **90** |
| Stop after N consecutive ntfy events go unread | (manual stop only — Claude can't detect read state) |
| Stop on any 4xx/5xx from posting attempt | **immediate halt** for that platform until next daily-ops |
| Stop if site has any failed-route check | **immediate halt** until site is green |
| Stop if last 24h shows zero Umami pageviews and Bluesky shows zero engagement | **investigate before posting** — likely something's off |

---

## Kill switches

### Hard pause (1 file = 0 posts)

```bash
touch content/AUTO_PAUSE
```

While this file exists, ALL auto-publishing halts. Daily-ops still runs site checks + Umami stats but does not fire any posts. Remove the file to resume:

```bash
rm content/AUTO_PAUSE
```

The file's contents are ignored — its existence is the signal. Use it for trips, controversies, lawyer calls, anything where you want a clean stop with no per-post negotiation.

### Soft pause (per-platform)

Same idea, per platform:

```bash
touch content/AUTO_PAUSE_X        # halts X auto-posting only
touch content/AUTO_PAUSE_BLUESKY  # halts Bluesky auto-posting only
```

### Kill the scheduled task entirely

In Claude Code's Scheduled sidebar, disable `parliament-audit-daily-ops`. The task stops firing until re-enabled.

---

## Audit trail

Every auto-publish event is logged to `content/auto-posts/<YYYY-MM-DD>.md` with:

- Timestamp (UTC + ET)
- Platform (X / Bluesky)
- Action (mirror / amplify / maintenance)
- Full text of the post
- Link to the live post once posted
- ntfy event sent

If something looks off, this log is the first place to check. Logs are committed to git; deleted nothing accidentally.

---

## What you can do to override

1. **Add or remove names in `content/amplification-queue.json`** — controls the trusted-amplification list. Edit it; commit; the next daily-ops picks up the change.
2. **Edit this document** — it IS the policy. If you remove the "no fresh-article auto-publishing" rule, I'll publish drafts I write. If you tighten the cadence cap from 3 to 1, that takes effect at the next run.
3. **Push to `content/AUTO_PAUSE`** — silences everything in 1 second.
4. **ntfy reply** — if a planned auto-post looks wrong in your phone preview, reply to the ntfy event with `STOP` (planned feature; not yet wired). For now, run the AUTO_PAUSE file.

---

## What this trades

**Loses:** human judgement on every post. Some auto-posts will be timing-imperfect. Some amplifications will hit dead news cycles.

**Gains:** consistent cadence regardless of your availability. The 5-day silence problem doesn't repeat. The brand keeps showing up in the feed even when you're heads-down on day-job work.

**Mitigates:** the editorial risk concentrates in the categories that matter (fresh articles, replies, contested takes). Auto-publishing only happens on categories where the cost-of-mistake is low and the benefit-of-cadence is high.

---

## Changelog

- **2026-05-05** — Initial document. Drafted in response to 5-day-silence incident; auto-publish enabled for mirror queue + amplification queue.
