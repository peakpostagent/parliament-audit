# Overnight Report — 2026-05-01

You asked me to (1) auto-check daily that the site + social are working, (2) make sure we have an optimal post cadence, and (3) work with Ollama to refine our personality. All three shipped. Here's the map.

## The 3 things you asked for

### 1. Daily auto-ops (`scripts/daily-ops.ts`)

Single-entry script that runs every morning at **5 AM MDT (7 AM ET)**, scheduled via Claude Code task `parliament-audit-daily-ops`. Each run:

- Pings 11 production routes (`/`, `/news`, `/news/<latest-slug>`, `/api/og/news`, `/api/og/feed-card`, `/rss.xml`, `/sitemap.xml`, `/n/<slug>` redirect, `/support`, `/builders`, `/find-your-mp`)
- Fetches Bluesky + X stats — last-post age, recent engagement, hours-since-silence
- Reads mirror-queue depth (how many cross-platform posts are pending)
- Pulls 24h Umami stats (pageviews, visitors, top referrers)
- Cadence audit — flags if posts-today < 1/platform or last post > 36h ago
- Writes a markdown report to `content/daily-ops/<YYYY-MM-DD>.md`
- Sends ntfy summary with status (✅ green / ⚠ issues)

If the run finds **site issues**, it sends an extra ntfy alert and **does not auto-post**. If site is healthy but **cadence is below target**, it surfaces the next mirror-queue item via dry-run and sends ntfy with the suggestion — **the user reviews and triggers manually**. The task explicitly does not auto-publish.

**Important — needs a one-time pre-approval from you when you wake up.** Open Claude Code, find `parliament-audit-daily-ops` in the Scheduled sidebar, click **Run now**, and approve every permission it asks for (Bash, Playwright, ntfy fetch). Approvals get stored on the task — future unattended runs use them automatically. Without this step, the cron fires but the spawned session stalls on the permission prompt (that's the same trap that bit us last week).

First report already on disk: `content/daily-ops/2026-05-01.md`. State at the smoke-test:
- 10/11 routes OK (one was an in-flight build at the moment)
- Last post 35h ago on both platforms — confirms the gap you flagged earlier today
- 6 mirror queue entries pending
- Umami quiet: 2 pageviews / 1 visitor over 24h

### 2. Optimal cadence — surfaced, not auto-applied

The daily-ops task **detects** cadence issues and surfaces actions, but doesn't auto-publish (the safety floor we agreed on in last week's recovery still holds). When cadence is below target it suggests:

- `mirror-queue-apply.ts --apply --batch 1` to ship a queued mirror post
- `social-brief/generate.ts` to draft fresh replies + amplifications

You decide whether to run them. The cron sends a "📋 Cadence below target — mirror queue ready" ntfy when applicable; you review on your phone and trigger from your laptop.

### 3. Ollama voice-refinement (`scripts/voice-refiner.ts`)

Pre-publish polish step. Reads `content/voice-playbook.md` as a binding constraint, runs the draft through local Ollama (`qwen3:14b`), returns a wire-reporter version stripped of BREAKING / exclamations / loaded verbs / emoji.

Two modes:

```bash
# Rewrite mode — returns polished version (saves to .refined.txt next to source)
npx tsx scripts/voice-refiner.ts --file content/social-drafts/foo.txt

# Feedback-only — returns the pre-post checklist applied to the draft
npx tsx scripts/voice-refiner.ts --file foo.txt --feedback-only
```

Smoke-tested with a deliberately-bad draft ("BREAKING: Liberals JUST CRUSHED their critics by spending a stunning $290M on a failed software! Mind-blowing waste!! 😱"). Output stripped all the partisan framing and produced wire-voice prose.

**Important caveat that's now in the README**: the refiner is a polish step, not a fact-checker. The qwen3:14b model can drift on numbers and proper nouns. In my smoke test it changed "$290M" to "$90M" while polishing voice. Always re-read the refined output for fact preservation before posting.

The refiner is **not auto-wired into the posters** — it's a separate manual step you run if you want it. Wiring it in as a default gate is a possible next step but felt premature given the fact-drift risk.

## What else shipped tonight

Two earlier things from this session, both committed before the daily-ops work:

| Commit | What |
|---|---|
| `af26e1f` | Auto-CTA: every post that links to an article auto-appends `Sources + full breakdown →` between body and URL. Configurable with `--cta`, opt out with `--no-cta`. Documented in `voice-playbook.md` §7. |
| `72cf1b9` | Per-angle image variety: `--image <url>` flag on `post-arbitrary-bluesky.ts` attaches an image (replaces link card) + `/n/<slug>` short-URL redirect that re-attaches UTM server-side (saves ~80 chars vs. inline UTM URL). |

Tonight's commit:

| Commit | What |
|---|---|
| `a3b66f2` | Daily auto-ops + Ollama voice refiner + `scripts/README.md` reference |

All pushed.

## What needs you when you wake up

**Single critical task** (~30 seconds):

1. Open Claude Code → Scheduled sidebar → find `parliament-audit-daily-ops` → click **Run now**.
2. When prompted, approve every permission: Bash, Playwright, fetch (ntfy). Pre-approvals get stored on the task and reused for every future unattended run.
3. Verify the run completes and produces a fresh report at `content/daily-ops/<DATE>.md`.

After that, the daily ritual runs itself every 5 AM MDT and pings your phone. You handle whatever the ntfy surfaces (manual mirror-queue runs, site fixes, fresh content drafts).

**Today's recommendation if you want to clear the cadence gap**:

```
npx tsx scripts/social-brief/mirror-queue-apply.ts --apply --batch 2
```

Ships 2 of the 6 pending mirror posts (Sarnia mayor + d'Entremont 3-reasons) at 30-min spacing. Spreads the rest over the next 2-3 days so we don't bot-spike.

## Reference

`scripts/README.md` is now the operational doc — covers posting, daily-ops, mirroring, editorial gates, analytics, and the four-step pattern for a new article launch. Read it once when you're back at the keyboard so the toolkit is fresh.

Sleep was your call earlier this week, you were busy this week — picking back up gradually is the right move. Daily-ops handles the maintenance; you focus on the editorial calls.
