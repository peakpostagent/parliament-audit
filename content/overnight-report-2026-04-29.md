# Overnight Report — 2026-04-29

You went to bed asking me to research $300M spent on a health-care software project (you later confirmed: PrescribeIT) and a committee hearing where Liberals "used their new majority to turn off the cameras." You asked me to publish + post at the next peak time, and to use Ollama for a second opinion if I needed one.

Short version: **article is live, 4 posts scheduled, but I had to correct the cameras-off framing — it's not what actually happened.**

## The cameras-off claim — what I found and why I didn't run with it

I ran three parallel research agents. Two of them dug into the committee record specifically. Findings, with confidence:

- **HIGH:** The PrescribeIT story is real. ~$298M spent. Telus retained ~85% of the IP. Conservative MPs filed for an Auditor General investigation on April 27.
- **HIGH:** On April 27, the Conservative Party of Canada issued a press release stating that **Liberal members of the House of Commons Health Committee filibustered** a motion that would have released PrescribeIT's contribution agreements and performance documents.
- **NOT SUPPORTED:** No source places a Liberal "vote to go in camera" on PrescribeIT. HESA Meeting 31 (April 28) was a Standing Order 106(4) opposition-requested meeting whose notice explicitly lists it as **televised**, not held in camera. Committee transcripts won't be public for ~10 days, but the meeting notice is dispositive on the camera question.

So what you heard was almost certainly the filibuster story, framed by a Conservative voice as "shutting down the meeting." That's a different procedural action than going in camera. **Filibustering** = members talk endlessly to prevent a vote (cameras stay on, public sees it happen). **In camera** = the committee votes to make the meeting private (cameras off, transcript suppressed). Both are valid criticisms of a governing-party committee majority, but they're not the same thing, and conflating them is exactly the kind of slip that lets a partisan reader screenshot us.

The article carries the filibuster claim with full attribution to the Conservative press release, plus our note that Liberal members have not publicly characterized their conduct as a filibuster. The methodology section explicitly states: HESA Meeting 31 was televised, not in camera. If new evidence surfaces (a journalist tweet, the committee transcript when it lands), I can write a follow-up. I will not publish the cameras-off framing without a source.

## What was published

Article: **`parliamentaudit.ca/news/prescribeit-298m-axe-the-fax-shutdown`**

Slug + headline: *"Ottawa Spent $298M on PrescribeIT. Telus Kept 85% of the IP. The Service Shuts Down May 29."*

5 sections:
1. The numbers ($40M initial → $290M+ final, $98M to Telus)
2. Why it failed (low adoption, no FPT cost-sharing, $0.20 fee, IP capture, salary refusal)
3. The Telus question (vendor IP retention, AG ask)
4. **The committee, the documents, and the filibuster** (procedural piece — fully attributed)
5. What happens next (May 29 shutoff, replacement framework, AG response unknown)
6. What we do not know (transparency-honesty section)

12 sourced citations: CBC, Globe x4, BNN Bloomberg, Canadian Press, Canadian Healthcare Technology, Alberta College of Pharmacy, The Deep Dive, PrescribeIT.ca, Telus Health.

Editorial review: ran the draft through local **Ollama qwen3:14b** as a brutal-editor second-opinion gate. Verdict: PUBLISH WITH FIXES. The valid feedback (clearer attribution on every contested claim) was already in place; two of three "required fixes" were hallucinated weaknesses (the model flagged in-camera language that doesn't actually appear in the article — verified by grep).

Ollama-review script saved at `scripts/ollama-review.ts` for reuse on future sensitive accountability stories.

Commit: `94a4ee5` — pushed; Railway deployed; verified HTTP 200 live.

## What was scheduled

4 posts, all firing Wed April 29:

| Time | Platform | Angle |
|---|---|---|
| **08:00 ET** | X | Vendor IP + AG request — "Telus paid ~$98M, kept ~85% of the IP" |
| **08:00 ET** | Bluesky | Same angle, Bluesky-format |
| **12:00 ET** | X | Adoption failure — "less than 5% of prescriptions, fax still wins" |
| **12:00 ET** | Bluesky | Tracking gap — "Health Canada says spending 'is not centrally tracked'" |

All 4 lead with rock-solid verifiable facts. None lead with the filibuster claim — too contested for a hook. Anyone clicking through gets the full story including the procedural section.

Storage: drafts at `content/social-drafts/prescribeit-2026-04-29.md`. Schedule via Claude Code scheduled tasks (each task self-disables after firing).

ntfy will fire on each post — you'll get phone notifications for all 4.

## What I deliberately did NOT do

- **No "cameras off" framing** anywhere in article or posts.
- **No Article B** ("Liberals voted to go in camera") — there's no story to write until somebody verifies the claim.
- **No auto-post tonight** of anything beyond what was already scheduled.
- **Did not interview Canada Health Infoway, Telus Health, or the Health Minister's office** — flagged in methodology.
- **Did not assert NDP position** — they haven't put one on the record.

## What needs you when you wake up

1. **Verify the article reads cleanly** at parliamentaudit.ca/news/prescribeit-298m-axe-the-fax-shutdown. Especially section 4 (the committee/filibuster section) — the procedural framing is honest but tightly attributed; you may want to soften or harden specific phrases.
2. **First post fires at 08:00 ET (~3 hours from now if you're up early).** ntfy will hit your phone. Reply on either platform if you want — both Bluesky and X will accept comments / replies during the day.
3. **If you have a source for the cameras-off claim** (a tweet, a CBC article, a quote in a press release), send it to me and I'll write a follow-up article. Until then, the filibuster framing is what we have.
4. **The mirror-queue --apply --batch 4** from yesterday is still pending your call. Today's PrescribeIT posts will saturate the daily X cadence — recommend pushing the Sarnia mayor + d'Entremont 3-reasons + Ma quote + Jeneroux Special-Advisor mirror posts to **tomorrow** (Apr 30).

## Files committed tonight

```
content/research-300m-health-software.md       — Agent #1 fact sheet
content/research-prescribeit.md                — Agent #3 fact sheet (incorporates filibuster claim)
content/research-in-camera-hearing.md          — Agent #2 fact sheet (rules out cameras-off)
content/social-drafts/prescribeit-2026-04-29.md — Draft posts + voice-rules note
apps/web/src/content/news-articles.ts           — New article inserted at top
scripts/ollama-review.ts                        — Pre-publish editorial gate
scripts/post-arbitrary-bluesky.ts               — Reusable arbitrary-text Bluesky poster
content/overnight-report-2026-04-29.md          — This file
```

Final commit: `94a4ee5`. All pushed.

Good morning.
