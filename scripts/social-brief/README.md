# Daily Social Brief

An editorial-review workflow for amplifying + replying to appropriate Canadian political content from @ParliamentAudit on Bluesky (and X, once API reads are unblocked).

## The loop

```
            ┌────────────────────┐
  morning → │  generate.ts       │   fetches last 24h from watchlist,
            │  (you run it or    │   drafts replies/amplifications,
            │   a cron runs it)  │   writes content/social-briefs/<DATE>.md
            └──────────┬─────────┘
                       ↓
            ┌────────────────────┐
  you    →  │  review the brief  │   approve / edit / reject inline
            │  in your editor    │   ~10 minutes of editorial judgement
            └──────────┬─────────┘
                       ↓
            ┌────────────────────┐
  you    →  │  execute.ts        │   posts approved items to Bluesky
            │                    │   (and X when we wire it), archives
            │                    │   the brief to executed/
            └────────────────────┘
```

## Why not full autonomy

Replies and amplifications are editorial decisions. One misjudged reply from an account selling itself as non-partisan tanks the brand faster than any other mistake. The machine drafts, the human approves. We will not automate approval.

## Files

| Path | Role |
|---|---|
| `watchlist.json` | Handles, hashtags, keywords — the scope of what we watch. Edit this to add / drop accounts. |
| `generate.ts` | Morning job. Reads watchlist, fetches Bluesky timeline + `#cdnpoli` feed, ranks candidates, drafts replies/amps, writes daily brief. |
| `execute.ts` | Parses the reviewed brief, posts approved items, archives to `executed/`. |
| `content/social-briefs/<DATE>.md` | Today's draft brief with checkboxes. Edit here. |
| `content/social-briefs/executed/<DATE>.md` | Archived briefs after execution. Audit trail. |
| `content/social-briefs/.state.json` | Tracks IDs we've already replied to / amplified so we never double-post. |

## The daily ritual (10 minutes)

1. Run `npx tsx scripts/social-brief/generate.ts` (or let the scheduled job do it at 8 AM).
2. Open `content/social-briefs/<TODAY>.md`.
3. For each candidate, pick one:
   - `[x] APPROVE` — ship as drafted
   - `[x] APPROVE WITH EDITS` — edit the draft text inline
   - `[x] REJECT` — skip
4. Run `npx tsx scripts/social-brief/execute.ts`.
5. Done.

## Image cards on X (and Bluesky link-card hygiene)

Every X mirror MUST attach a 1200×1200 feed-card image. We learned the
hard way (2026-05-12) that relying on X's link-card crawler to pull
`twitter:image` off the page produces blank grey cards roughly half
the time, even when the meta tags are perfect — the crawler is
unreliable on fresh URLs.

`mirror-queue-apply.ts` now defaults `imageMode` to `'headline'` when a
queue entry omits it, so every X post attaches a card directly through
the compose upload. Authors should still specify `imageMode` explicitly
for richer treatments:

| Mode         | When to use                                                                              | Extra fields required                                  |
|--------------|------------------------------------------------------------------------------------------|--------------------------------------------------------|
| `stat`       | Big numbers, $$$, vote splits, percentages, deficits                                     | none (renders article's hero stat)                     |
| `comparison` | Floor-crossings, then/now, two-person contrasts                                          | `subjects[]` array on the **article** (≥2 entries)     |
| `quote`      | Pull-quote treatment (one-line Hansard / Globe / press-gallery line)                     | `imageQuote`, `imageAttrib`, `imageContext` on entry   |
| `headline`   | Default. Headline + thumbnail-style card                                                 | none                                                   |

### Person-focused posts → use `comparison` and ensure portraits load

Articles about a named MP (floor-crossings, ethics, vote-pattern
profiles) carry a `subjects: [{ name, role, portraitUrl, party,
caption }, …]` array. The OG render fetches the portrait from
ourcommons.ca at render time.

**The working URL pattern is:**
```
https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/<parliament>/<LastnameFirstname>_<PartyAtElection>.jpg
```

For the 45th Parliament: `parliament = 45`. Names are PascalCase with
no spaces, no apostrophes (so d'Entremont → `DEntremontChris`). Party
is the **elected** party (CPC, LPC, NDP, BQ, GPC, IND) — even if the MP
later crossed, the photo file is keyed by election affiliation.

> Note: the older `ourcommons.ca/Members/en/<name>(<id>)/photo`
> pattern that ChatGPT / autocomplete tends to produce **returns 404
> across the entire site as of 2026-05**. All article portraitUrls
> were migrated to the working pattern in commit (see git log).

When adding a new person-article:
1. Find the MP via `ourcommons.ca/Members/en/search?searchText=<name>`.
2. Open their profile; right-click their photo; copy the
   `OfficialMPPhotos/...jpg` URL.
3. Drop it into `subjects[].portraitUrl`.
4. Render-test locally:
   `curl /api/og/feed-card?slug=<slug>&mode=comparison -o /tmp/test.png`
   and visually confirm both portraits load (no "XX" initials fallback).
5. Set `imageMode: 'comparison'` on the X mirror queue entry.

## Cadence: 2 posts per platform per day

`scripts/daily-ops.ts` checks the cadence target (`target: 2` per
platform) on every cron tick and only fires the auto-publish gate
when we're below target. With the cron firing at 5 AM MDT and 1 PM
MDT, we have two opportunities per day to hit cadence.

The gate fires (in priority order):

1. **Mirror queue** — if `scripts/social-brief/x-mirror-queue.json`
   has an entry whose Bluesky URI hasn't been mirrored yet,
   `mirror-queue-apply --apply --batch 1` posts it to X with the
   feed-card image attached (see imageMode table above).
2. **Auto-amplify** — if the mirror queue is empty, the gate
   tries `auto-amplify --apply --max 1`, which reposts a fresh
   (< 24h) post from a trusted Bluesky handle if any matches our
   `keywords_positive` list.

If both come up empty (mirror queue drained AND no amplify
candidates), the day ends below target. The mitigation is to keep
`content/social-briefs/drafts/queued-*.txt` stocked with
ready-to-fire drafts. The expected flow:

```
queued-*.txt  →  post-arbitrary-bluesky.ts (manual or scripted)
              →  Bluesky goes live
              →  matchSubstring goes into x-mirror-queue.json
              →  next cron tick fires mirror-queue-apply
              →  X mirror with feed-card image
              →  rename file queued-*.txt → executed-*.txt
```

Each `queued-*.txt` file is one Bluesky-ready draft (≤ 274 chars so
the auto-CTA fits under the 300-char limit). Its filename hints
at the angle. Pick one per day to keep cadence alive.

## Proofread gate — Claude Sonnet 4.6, with Ollama fallback

Before posting any new Bluesky/X draft, run it through
`scripts/claude-proofread.ts`. Uses Claude Sonnet 4.6 (recommended
model for writing/editing per the Anthropic model lineup as of
2026-05) via the Anthropic API. Sonnet 4.6 catches editorial issues
that the previous local-only Ollama qwen3:14b gate consistently
missed:

- **Asymmetric comparisons** — e.g. comparing Alberta petition
  signatures (procedural milestone) with Quebec referendum vote
  percentages (completed-vote results) as if they were the same
  metric. The May 2026 Alberta-vs-Quebec post had to be deleted +
  rewritten because of exactly this; Sonnet would have caught it
  pre-publish.
- **Plain-English / jargon** — flags phrases like "59.6% NO" that a
  smart layperson has to re-parse, and proposes plain-language
  alternatives like "60% voted to stay."
- **Framing risk** — wording that reads as a partisan "gotcha" even
  if every fact is true.
- **Unsourced claims** — surfacing every number that lacks an inline
  source pointer.

Cost: ~$0.01 per check (input + output tokens combined, Sonnet 4.6
pricing $3/$15 per 1M tokens). Cap is 4,096 max-output-tokens — more
than enough for a review-with-rewrite of a 300-char post.

### Usage

```bash
# read the draft from a file (preferred — preserves newlines)
npx tsx scripts/claude-proofread.ts \
  --text-file content/social-briefs/drafts/<draft>.txt \
  --platform bluesky \
  --context "what the post is about, what it links to, any sensitivity"

# or inline
npx tsx scripts/claude-proofread.ts --text "draft body" --platform x
```

`--context` matters — Sonnet calibrates its flags to what the post is
*for*. "Floor-crossing accountability piece" vs "evergreen civic
primer" get different reviews.

### Fallback to Ollama qwen3:14b

If the Anthropic API is unreachable (network, rate limit, 5xx), the
script transparently falls back to the local Ollama model. You'll
see a `[claude-proofread] falling back to Ollama` warning on stderr.
The local model is slower (~30s vs ~3s) and misses some framing
issues, but it beats posting blind.

If `ANTHROPIC_API_KEY` is missing entirely, it also falls back —
useful for offline editing or when Claude Code's shell ends up with
a stale empty `ANTHROPIC_API_KEY=` (a known issue on some Windows
shells; the script forces dotenv override to work around it).

## Voice rules (enforced in drafts)

Drafts follow `content/voice-playbook.md`:

- **Wire-reporter archetype.** No BREAKING, no exclamations, no loaded verbs (slams/crushes/guts), no rhetorical questions, no engagement-bait openers.
- **Factual additions only.** Replies add Hansard citations, vote records, budget-table numbers, historical precedent. Replies never offer opinions.
- **The record is the voice.** Phrases like "The record shows…" / "Hansard has…" / "The vote split was…" are preferred over "We think…" / "It looks like…"
- **No clicks without UTMs.** Every `parliamentaudit.ca` link gets auto-tagged via `scripts/utm.ts` with `?utm_source=bluesky` so Umami attribution works.

## Targets

Per the posting-cadence guidance:

- **1-2 original posts** per day from @ParliamentAudit (article drops, vote facts)
- **6-8 replies** per day in #cdnpoli threads (← this pipeline's main output)
- **2-3 amplifications** per day (quote-tweets / reposts of primary sources)

The generator aims for ~15 candidates per day. Expect to approve 6-10 after review.

## Safety / ethics rails

The watchlist's `keywords_skip` array disqualifies any post using loaded language from any direction. A thread with "libtards" or "cuckservatives" or "comrade" gets filtered out — we don't reply, we don't amplify, even if a factual addition would be correct.

The generator also skips:

- Threads where the original author is anonymous or newly-created (< 30 days)
- Threads with < 3 words (too short to reply to meaningfully)
- Threads we have already replied to / amplified (via the `.state.json` ledger)
- Posts from @ParliamentAudit itself

## Next-session work (V2)

- X candidate fetching (currently Bluesky only — X API reads require paid tier)
- Auto-generate X drafts from approved Bluesky ones (cross-platform duplicate-aware)
- A "mentions" column: anyone who replies to us gets surfaced in the next brief
- Link to the Umami events dashboard alongside each brief

## Failure modes

- **Bluesky API rate-limited** — the generator backs off with exponential delay. Worst case: fewer candidates in the brief.
- **Watchlist handle mismatch** — handles in `watchlist.json` marked `resolveable: true` haven't been confirmed. Generator attempts `com.atproto.identity.resolveHandle`; logs + skips any that don't resolve.
- **State file corruption** — `.state.json` is plain JSON with IDs + timestamps. Safe to delete; generator will regenerate (risk: we double-post on the first run after a delete; accept).
- **Execute failure mid-run** — `execute.ts` marks state *before* posting each item. If the process crashes, re-running may skip that item. Inspect `.state.json` for the failed ID and rerun manually if needed.
