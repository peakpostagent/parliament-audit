# Parliament Audit — Improvement Plan (May 2026)

Synthesis of three deep-research passes:

- `content/research/agentic-operators-2026.md` — field survey of 10 agentic accounts + tools comparison + risk taxonomy + ranked improvements
- `content/research/ai-disclosure-compliance-2026.md` — Canadian / US / EU regulatory + platform policy + ethics framework + compliance checklist
- `content/research/civic-news-agentic-precedents-2026.md` — Canadian and international civic-news comparables + AI-augmented news experiments + voice and growth patterns

---

## 1. Where the three reports converge

The three independent passes agree on five themes. These are the spine of the plan.

### Theme A — Radical transparency about agentic ops is a credibility *asset*, not a vulnerability

- Agentic-operators ranked "Public 'how this account works' page" #9 (Sports Illustrated as the inverse cautionary tale)
- AI-disclosure made it M3, M7, S1 (named human editor + about-page + per-article footer)
- Civic-news precedents ranked it #1 single highest-leverage move ("Publish a 'How Parliament Audit is Built' page now")

Translation: **leading with disclosure is what differentiates us from "another political bot account."** Sub-10-follower accounts have nothing to lose by being unusually transparent, and the journalists/staffers/academics we want as our first 1,000 followers are exactly the audience that rewards radical transparency.

### Theme B — Tragedy-halt circuit-breaker is the biggest governance gap

- Agentic-operators: #1 highest-leverage improvement (Epicurious / SKIMS / Gap as cautionary tales)
- AI-disclosure: M8 mandatory for editorial duty of care
- Brand-extinction risk class. We have nothing here today.

### Theme C — Platform-level bot self-disclosure is free, fast, and required

- AI-disclosure: M1 X "Automated Account" label, M2 Bluesky self-label as automated
- Agentic-operators: #3 verify Bluesky bot self-label
- Both note the X label requires being tied to Cole's personal handle. Bluesky self-label reduces labeler-purge risk.

### Theme D — Voice-refiner system-prompt audit + no-fabricated-quotes rule

- AI-disclosure: M5 never produce quoted speech unless verbatim-matched (single highest-risk failure mode for defamation + Canada Elections Act s. 480.1)
- Agentic-operators: #4 voice-refiner ingest the full voice playbook (not excerpted)
- Civic-news precedents: highlighted Quakebot 2017 stale-data publishing as a kill-switch case

### Theme E — Single templated visual unit + cadence locked to events

- Civic-news precedents: #2 (338Canada-style "Vote Scorecard" template) and #3 (lock cadence to House sittings)
- Agentic-operators: per-platform copy variants (#2 ranked improvement)
- Pattern: 338Canada grew from spreadsheet to ~46K X followers by templating one chart and tying cadence to poll releases / writs

---

## 2. Where the three reports DIVERGE — and what we do about it

### Divergence 1 — How fast to publish disclosure language

- Civic-news precedents: ship the about-page now, even before all the M-items are met (sub-10-follower account: nothing to lose)
- AI-disclosure: insists on naming an accountable human editor as part of M3 / M7
- Resolution: ship a v1 about-page footer tonight that names "Cole Tindall" as accountable editor. The user has been operating openly under that name on @ParliamentAudit. If they want a pseudonym, they'll tell me tomorrow night and I'll swap it.

### Divergence 2 — Cross-platform copy variants vs. cross-platform parity

- Agentic-operators: per-platform variants (Bluesky reads short, X reads punchy)
- Civic-news precedents: 338Canada succeeded on cross-platform PARITY (same template everywhere)
- Resolution: parity for the LINK CARD + IMAGE; per-platform variants for the BODY TEXT. Mirror queue currently has one `text` field; we extend to optional `text_x` + `text_bluesky` falling back to `text`. Keeps the templated-visual unit identical across platforms while letting copy fit each platform's rhythm.

### Divergence 3 — Open the data vs. focus on voice

- Civic-news precedents: #7 "open the data" (GovTrack-style API → ecosystem flywheel)
- Agentic-operators: did not flag this; voice-grounding via voice-playbook was the priority
- Resolution: a CSV export endpoint is a 1-day build with high optionality value. Park as P2 — does not block tonight's ships.

---

## 3. Ranked plan — by impact ÷ effort

Format: **[ID] — [Title] — [Source agents] — [Effort] — [Owner: ME or USER]**

### P0 — Ship tonight, autonomously

| ID | Title | Source agents | Effort | Owner |
|---|---|---|---|---|
| P0-1 | Add per-article AI-assist disclosure footer to all news articles | AI-disclosure (S1), Civic-news (#1) | 1h | ME |
| P0-2 | Build `/methods` page with full agentic-ops disclosure | AI-disclosure (S3), Civic-news (#1, #6), Agentic-operators (#9) | 2h | ME |
| P0-3 | Add bracket-detection kill-switch to mirror-queue-apply (Gannett guard) | Civic-news (#3 in §5) | 30m | ME |
| P0-4 | Audit voice-refiner.ts: full playbook ingestion + no-quoted-speech rule | AI-disclosure (M5), Agentic-operators (#4, #6) | 1h | ME |
| P0-5 | Add date-sanity-check to mirror-queue-apply (Quakebot-1925 guard) | Civic-news (#4 in §5) | 30m | ME |
| P0-6 | Build `scripts/social-brief/halt-on-tragedy.ts` (RSS-driven AUTO_PAUSE_TRAGEDY writer) | Agentic-operators (#1), AI-disclosure (M8) | 4h | ME |
| P0-7 | Wire halt-on-tragedy into daily-ops as a pre-gate | Agentic-operators (#1), AI-disclosure (M8) | 30m | ME |

### P1 — Ship soon (this week)

| ID | Title | Source agents | Effort | Owner |
|---|---|---|---|---|
| P1-1 | Per-platform copy variants in mirror queue (text_x + text_bluesky) | Agentic-operators (#2) | 6h | ME |
| P1-2 | Vote-Scorecard template — repeatable visual unit | Civic-news (#2), Agentic-operators (image governance) | 1 day | ME |
| P1-3 | Public corrections log — `/corrections` page | Civic-news (#10), AI-disclosure (C3) | 3h | ME |
| P1-4 | Reply-pattern monthly audit script | Agentic-operators (#5) | 5h | ME |
| P1-5 | LinkedIn AI training opt-out (when/if we open a LinkedIn) | AI-disclosure (M10) | n/a | USER |
| P1-6 | Activate X "Automated Account" label (tied to user's personal handle) | AI-disclosure (M1) | 5m setting | USER |
| P1-7 | Activate Bluesky bot self-label | AI-disclosure (M2), Agentic-operators (#3) | 5m setting | USER |
| P1-8 | Refresh X bio + Bluesky bio with AI-assisted disclosure language | AI-disclosure (§7.3) | 10m | USER (post-approval) |

### P2 — Park, optionality value high

| ID | Title | Source agents | Effort | Owner |
|---|---|---|---|---|
| P2-1 | CSV export of MP voting records (GovTrack pattern) | Civic-news (#7) | 1 day | ME |
| P2-2 | "MP of the Week" / "Vote of the Week" thread template | Civic-news (#8) | 1 day | ME |
| P2-3 | 60-second video explainer pipeline (AI voiceover + House footage) | Civic-news (#5) | 3 days | ME |
| P2-4 | Postiz pilot (alternative posting backend) | Agentic-operators (#8) | 8h | ME |
| P2-5 | Engagement-window data analysis (post when audience is awake) | Agentic-operators (#7) | 4h | ME |
| P2-6 | Outreach emails to ~30 civic-tech contacts | Civic-news (#9) | 1 day | USER (drafts ready, user hits send) |
| P2-7 | Media-liability insurance quote (Hub International / Aon) | Agentic-operators (#10), AI-disclosure (C5) | 2h calls | USER |
| P2-8 | Privacy notice / Quebec Law 25 audit if/when newsletter launches | AI-disclosure (M6) | n/a yet | USER |

### Park indefinitely

- ManyChat / Buffer / Hootsuite OwlyWriter migrations (downgrades for our model)
- LinkedIn / Threads / Meta expansion (out of scope for current Q)
- Generative AI portraits of MPs (explicitly forbidden per AI-disclosure §5.3)

---

## 4. What ships tonight (the exact P0 build sheet)

1. **`apps/web/src/app/about/methods/page.tsx`** — new page; canonical AI disclosure language modeled on AI-disclosure §7.2
2. **`apps/web/src/components/AiAssistFooter.tsx`** — per-article footer using AI-disclosure §7.4 language; mounted in `apps/web/src/app/news/[slug]/page.tsx`
3. **`apps/web/src/app/corrections/page.tsx`** — public corrections log skeleton (P1-3 brought forward; ~30 min more work and it's a brand asset)
4. **`scripts/social-brief/guard-rails.ts`** — small library exporting:
   - `containsBracketTokens(text)` — detects `[[ ]]` / `{{ }}` / `[TBD]` / similar (Gannett guard)
   - `dateSanityCheck(post)` — rejects posts where source-event date is >36h old (Quakebot-1925 guard)
5. **Wire (4) into `mirror-queue-apply.ts`** — both checks fire before posting
6. **`scripts/voice-refiner.ts`** — patch the system prompt to (a) load voice-playbook.md in full not excerpted, (b) include explicit "never produce quoted speech inside quotation marks unless flagged as VERBATIM_FROM_PRIMARY" rule
7. **`scripts/social-brief/halt-on-tragedy.ts`** — RSS poll of CBC + AP + Reuters + Globe + CP newswire; keyword-match against tragedy lexicon; writes/clears `content/AUTO_PAUSE_TRAGEDY` file. Pre-gate hook in daily-ops checks for the file before auto-publish gate fires.
8. **Commit + push** all of the above as one cohesive batch.

---

## 5. What needs the user tomorrow night (the bring-list)

1. **Approve `Cole Tindall` as the public named accountable editor** on /methods and /about. (If they want a pseudonym or just "Editor: Parliament Audit Editorial Desk", that's the version I'll ship instead.)
2. **Activate X "Automated Account" label** under Settings → Your Account → Automated; tie it to their personal X handle. Platform setting; cannot be toggled by automation.
3. **Activate Bluesky `automated` self-label** in profile settings. Same constraint.
4. **Update X + Bluesky bios** to include "AI-assisted, human-edited. parliamentaudit.ca/methods" — ~10s on each platform. I'll have draft text ready.
5. **Decide on the corrections-log directory format** — append-only `.md` file under `content/corrections/`, or a database table? Default: `.md` file, low complexity, version-controlled.
6. **Decide whether to pursue media-liability insurance quote in Q3** — phone-call exercise, no urgency tonight.

If the user is unavailable tomorrow night, the P0 ships are still net-positive on their own; the P1 platform settings can wait without harm.

---

## 6. Risks to the plan itself

1. **Disclosure overshoot** — adding AI-assist footers + methods page + corrections page in one ship could read as defensive. Mitigation: tone in the methods page is matter-of-fact ("we use these tools, here's what the human does") not apologetic.
2. **Halt-on-tragedy false positives** — RSS keyword matching is noisy; news cycles include the word "fire" routinely. Mitigation: 2-of-N source corroboration before pause; clear log + override toggle.
3. **Per-platform variants schema migration** — current mirror queue has hundreds of historical entries. Mitigation: P1-1 makes `text_x` and `text_bluesky` optional with `text` as fallback. Zero migration burden.
4. **Voice-refiner rebuild breaks current draft pipeline** — the system prompt change is small but loads into a model with finite context. Mitigation: Ollama qwen3:14b has a 32k context window; voice-playbook.md is ~5k tokens; well within budget.

---

## 7a. Refinements after Ollama qwen3:14b skeptic-strategist review

Ollama flagged seven issues; four are real and incorporated into the build sheet:

1. **Date-sanity window too tight.** 36h would suppress legitimate follow-up on parliamentary procedure (committee transcripts publish ~4 days after meetings; Hansard rolls daily but corrections come days later). Updated: window is **7 days for in-camera / committee posts, 24h for breaking-event posts** — defaults to 7d when in doubt; advisory-only WARN (not BLOCK) so the operator sees it on stderr.
2. **Tragedy keyword false positives.** Plan now requires **2-of-N source corroboration** (≥2 of CBC, AP, Reuters, Globe, CP wire must trip the same keyword in the same 30-min window) before AUTO_PAUSE_TRAGEDY is written. Plus a 6-hour cool-down after the upstream feed clears, so we don't whipsaw.
3. **Corrections page lacks workflow.** Page content will explicitly spell out: how to submit a correction (email link), who authorizes (named editor), how it shows up (timestamped append-only list), and how the user can verify the audit trail (link to git commit log of the corrections file).
4. **Disclosure scope.** Per-article footer covers articles. Social-post disclosure happens via (a) the bot self-labels on X + Bluesky platforms, (b) the "AI-assisted" line in each platform bio, (c) the /methods page linked from those bios. We document that explicitly on the methods page.

Ollama's other critiques (bracket detection too narrow; vote-scorecard assumes data parity; user education on bot labels) are noted but not blocking — the bracket guard is cheap insurance, our ourcommons.ca scrape gives us granular vote data, and our target audience (journalists/staffers/academics) doesn't need bot-label explainers.

---

## 7b. Execution order tonight

1. Run Ollama qwen3:14b skeptic-strategist review on this plan → refine
2. Ship P0-3, P0-4, P0-5 (low-risk guard-rail patches) first — they protect everything else
3. Ship P0-1 + P0-2 (about-page + per-article footer) — this is the brand-positioning layer
4. Ship P0-6 + P0-7 (tragedy halt) — the biggest governance gap
5. Commit cohesive batch
6. Final ntfy summary
