# Editorial Autonomy — what Claude posts unattended

This is the rulebook for what gets published from `@ParliamentAudit` (X) and `@parliamentaudit.bsky.social` (Bluesky) **without you reviewing each post first**. It is also the kill-switch and audit-trail policy.

The brand can survive a slow-news week. It cannot survive a single misjudged post. So: every category that's "allowed" carries a specific guardrail; everything still goes through ntfy so you can react after-the-fact.

**Implementation status legend:**
- ✓ Wired — daily-ops fires this category right now
- ◐ Partial — the data layer (queue file, etc.) exists; the action wiring is the next dev task
- ○ Policy-only — the rule is on paper; building the action requires a new script

---

## Auto-publish allowed

These run unattended via the daily-ops scheduled task. ntfy fires on every action.

### 1. Mirror-queue items ✓
Source: `scripts/social-brief/x-mirror-queue.json`. Already-edited drafts that you (or I) wrote and saved to the queue. These passed editorial review at write-time. Auto-fire is just the trigger. No additional gate beyond what `mirror-queue-apply.ts` already enforces (daily cap, spacing, dedupe, draft-validation).

### 2. Curated primary-source amplifications ◐
Source: `content/amplification-queue.json`. Reposts of vetted accounts (House of Commons, Auditor General when accounts are real, specific Canadian press-gallery journalists, Democracy Watch, etc.). The full curated list lives in the queue file — anyone added there is on the trusted list. Removing names from the list takes one edit.

**Guardrails:**
- Only reposts (not quote-skeets) — we add no commentary
- Candidate post must be < 24 hours old
- Candidate must match at least one keyword from `scripts/social-brief/watchlist.json` `keywords_positive`
- Candidate must NOT match any `keywords_skip`
- Max 2 amplifications/day across both platforms
- Max 1 amplification per source account per week (avoid feed-takeover)
- Min 90 minutes between auto-posts

### 3. Maintenance / housekeeping ○
- "RSS feed published" thread when a new article goes live (auto-fires the article URL post)
- Periodic "Find Your MP" / "Subscribe" reminders pulling from a fixed copy bank — frequency-capped at one every 14 days

### 4. Fresh accountability articles ○
Anything new in `apps/web/src/content/news-articles.ts`.

**Guardrails:**
- Article must cite ≥ 3 tier-1 sources (CBC, Globe and Mail, AG, PBO, Hansard, Reuters, AP, CP wire) in its `sources` array
- `scripts/ollama-review.ts <slug>` must return `PUBLISH` or `PUBLISH WITH FIXES` — never `DO NOT PUBLISH`
- 12-hour cool-off between commit-to-git and auto-publish-to-social (catches typos + late corrections; fresh-eye review on next daily-ops cycle)
- Max 1 fresh article auto-published per calendar week
- The article's `editorsNote` field, if set, will be quoted verbatim in the social post — auto-publish does not happen without an `editorsNote` for sensitive stories (see voice-playbook §6 part 4: partisan-mirror test)
- Halt the auto-publish if the article's `tags` include any partisan-coded keyword (loaded-language list)

### 5. Replies to journalists or politicians ○
The reply-first growth strategy is high-leverage but also the highest brand-risk surface. Specific guardrails:

- Reply must ADD a sourced fact (Hansard citation, vote roll, AG report). Replies that don't add a fact are skipped.
- `scripts/voice-refiner.ts --feedback-only` must return `PASS — ship as-is.` (not just polish — it has to come back with no issues)
- Skip if the parent post OR our reply contains any `keywords_skip` from watchlist
- Skip if the parent post is itself a reply (no second-degree thread-jumping)
- Skip if the parent post starts with `@` (quote-tweet patterns reach into someone else's pile-on)
- Max 4 replies/day across both platforms
- Max 1 reply per target account per week (no following-them-around-the-feed)
- After our reply lands: monitor for 6h — if it gets <5 impressions OR receives a hostile reply, halt further replies in that thread

### 6. Quote-skeets / quote-tweets that add our framing ○
Reposting a primary source's text is low risk. Adding our own commentary on top introduces editorial voice — needs a tighter rail.

**Guardrails:**
- Our added framing must be a sourced fact (date, vote count, dollar figure), not commentary
- `voice-refiner --feedback-only` must return PASS
- Max 1 quote-skeet per day across both platforms
- Same partisan-mirror test as fresh articles

### 7. Account-level changes — bio / name / banner ○
Routes through a new `scripts/update-profile.ts` (not yet built; policy-only).

**Guardrails:**
- Banner / avatar uploads only from `docs/` or `content/` directories
- Bio changes require a git commit message starting with `bio:` (audit trail)
- Display name changes ALWAYS ntfy you for after-the-fact review

### 8. Account-level changes — follow / unfollow ○
Routes through a new `scripts/follow-manager.ts` (not yet built; policy-only).

**Guardrails:**
- Max 5 follow events per day
- Only handles that already appear in `content/amplification-queue.json` trusted list
- No unfollows of anyone we've replied to or amplified in the last 30 days
- No following accounts that have engaged in `keywords_skip` content within the last 30 days

### 9. Account-level changes — DM replies ○
Routes through a new `scripts/dm-replier.ts` (not yet built; policy-only).

**Guardrails:**
- Only REPLIES to threads where you have already replied first (you set the conversational tone)
- No outbound DMs to new contacts
- All DM replies must pass `voice-refiner --feedback-only` PASS verdict
- ntfy fires on every DM sent

### 10. Filter-list-flagged content ✓
Source: `scripts/social-brief/watchlist.json` `keywords_skip`. Posts containing any of these terms are skipped automatically — this is enforced by all auto-publishing scripts. Promoting this category was redundant; the filter handles it.

---

## Auto-publish forbidden

Single rule:

### Payment / Stripe / billing transactions
Hard safety rail. The Claude Agent SDK explicitly prohibits auto-executing financial transactions, and I will not bypass it regardless of what's in this document. If a posting flow somehow proposes a payment action, it gets blocked at the runtime level — not at this document's level.

If you eventually want billing automation, that needs to live in a separate, sandboxed system with its own permission model, not under the social-publishing autonomy.

---

## Hard rate limits (autopilot guardrails)

These apply across ALL categories above, in addition to per-category rules.

| Limit | Value |
|---|---|
| Soft target (originals per day per platform) | **2** (drives the daily-ops auto-publish gate) |
| Max auto-posts per day per platform | **3** (mirror + amp + reply + quote-skeet, combined) |
| Min minutes between auto-posts | **90** |
| Stop on any 4xx/5xx from a posting attempt | **immediate halt** for that platform until next daily-ops |
| Stop if site has any failed-route check | **immediate halt** until site is green |
| Stop if Ollama (qwen3:14b at localhost:11434) is unreachable | **fall back to human review** for any category requiring voice-refiner pass |
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

The file's contents are ignored — its existence is the signal.

### Soft pause (per-platform)

```bash
touch content/AUTO_PAUSE_X        # halts X auto-posting only
touch content/AUTO_PAUSE_BLUESKY  # halts Bluesky auto-posting only
```

### Per-category pause (planned)

When categories beyond mirror-queue-apply are wired, each will support a per-category pause file:

```bash
touch content/AUTO_PAUSE_REPLIES         # blocks category 5
touch content/AUTO_PAUSE_QUOTESKEETS     # blocks category 6
touch content/AUTO_PAUSE_PROFILE         # blocks category 7
touch content/AUTO_PAUSE_FOLLOW          # blocks category 8
touch content/AUTO_PAUSE_DMS             # blocks category 9
```

### Kill the scheduled task entirely

In Claude Code's Scheduled sidebar, disable `parliament-audit-daily-ops`. The task stops firing until re-enabled.

---

## Audit trail

Every auto-publish event is logged to `content/auto-posts/<YYYY-MM-DD>.md` with:

- Timestamp (UTC + ET)
- Platform (X / Bluesky)
- Category (1–10 per this document)
- Full text of the post
- Link to the live post once posted
- Source post URL (for amplifications + replies)
- Voice-refiner / Ollama-review verdict (where applicable)
- ntfy event sent

If something looks off, this log is the first place to check. Logs are committed to git — no silent deletions.

---

## What you can do to override

1. **Edit this document** — it IS the policy. Move a category from allowed to forbidden, tighten a guardrail, or change a hard limit. Daily-ops re-reads on every run.
2. **Edit `content/amplification-queue.json`** — controls the trusted-amplification list. Add or remove handles to expand or tighten the trust boundary.
3. **Push to `content/AUTO_PAUSE`** — silences everything in 1 second.
4. **ntfy reply with `STOP`** — planned feature; not yet wired. For now, run `touch content/AUTO_PAUSE`.

---

## What this trades

**Loses:** human judgement on every post. Some auto-posts will be timing-imperfect. Some amplifications will hit dead news cycles. Some replies will be screenshot-fodder; the guardrails cut that risk to a minority case but don't eliminate it.

**Gains:** consistent cadence regardless of your availability. The 5-day silence problem doesn't repeat. The brand keeps showing up in the feed even when you're heads-down on day-job work. The reply-first growth strategy from `content/x-premium-playbook.md` actually runs.

**Mitigates:** every category has a specific guardrail aligned to its specific risk. The hard rate limits cap blast radius. The kill switches give you instant stop. The audit trail makes everything inspectable after-the-fact.

---

## Changelog

- **2026-05-05 (v1)** — Initial document. Drafted in response to 5-day-silence incident; auto-publish enabled for mirror queue + amplification queue. Other categories forbidden.
- **2026-05-05 (v2)** — Per user direction, promoted ALL categories (A through E) to allowed except E.3 (payment). Added per-category guardrails for fresh articles, replies, quote-skeets, profile changes, follow/unfollow, and DM replies. Wired amplification action layer (category 2). Other categories carry policy-only status until their action layers are built; daily-ops will not fire them yet.
- **2026-05-05 (v3)** — Cadence target raised from 1/day to 2/day per platform after user flagged 23h gap. Added second scheduled-task slot (`parliament-audit-afternoon-ops`, 1 PM MDT) so the gate can fire morning + afternoon. Hard cap stays at 3/day/platform. mirror-queue-apply still ships --batch 1 per run; the second daily run is what gets us from 1/day → 2/day.
