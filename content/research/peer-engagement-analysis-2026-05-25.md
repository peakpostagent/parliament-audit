# Peer Engagement Analysis — Canadian Civic / Political Accounts

**Date:** 2026-05-25
**Author:** Parliament Audit (Claude research pass)
**Purpose:** Identify what's working for peer accounts on Bluesky and X, then translate into 5–10 concrete edits to PA's post wording.

---

## Section 1 — Peer Accounts Surveyed

All follower / engagement figures pulled via Bluesky's public XRPC API on 2026-05-25 (X/Twitter blocks unauthenticated scraping with HTTP 402, so X data is via search-engine summaries and account observations). "Typical engagement" is a rough median over the last ~15–20 posts unless noted.

| # | Account | Platform | Followers | Typical likes/post | Notes |
|---|---|---|---|---|---|
| 1 | **Michael Geist** (`mgeist.bsky.social`) | Bluesky | 5,679 | 10–20 likes, 5–15 reposts | **Most directly comparable peer.** Same beat (Bill C-22, lawful access). Posts 3x/day, every post is "My post on…" + link card. Best post in window: 29♥/23↻ (Signal-may-exit-Canada). |
| 2 | **Polling Canada** (`canadianpolling.bsky.social`) | Bluesky | 26,804 | 20–60 likes | Rigid template format: source line + bullet stats with coloured-circle emojis (🟢⚫️⚪️). Multiple posts per day. Charts get the highest engagement. |
| 3 | **Justin Ling** (`justinling.ca`) | Bluesky | 51,668 | 15–150 likes | Investigative journalist. Posts are personal voice — "My Saturday column this week is all about…" — bordering on essayistic. Top post: 156♥/70↻ (West Bank statement image). |
| 4 | **Canadaland** (`canadaland.com`) | Bluesky | 10,586 | 3–10 likes | Heavily reliant on link cards to podcast episodes. Headline-style framing. Lower engagement-per-follower than expected; brand-account pattern. |
| 5 | **The Canadian Press** (`cdnpress.bsky.social`) | Bluesky | 10,596 | 5–25 likes | Daily "Top things to know" numbered-emoji roundup (1️⃣2️⃣3️⃣) is their signature format and one of their top-engagement post types. |
| 6 | **Patrick Chovanec** (`prchovanec.bsky.social`) | Bluesky | 40,385 | 50–1000+ likes | High variance — viral when posting punchy political takes/quote-posts, low when replying. Lots of one-liner replies; quote-posts outperform standalones. |
| 7 | **Evan Solomon** (`evansolomon.bsky.social`) | Bluesky | 1,544 | 10–20 likes / 28 quotes on top | MP / Minister account, posts sparingly (3 posts total). Bilingual image-statement format drives high quote count. |
| 8 | **CANADALAND** (X, `@CANADALAND`) | X | ~80K+ | Variable | Investigative branded media account. X data not directly scrapeable but their pattern is question-headlines + link cards. |
| 9 | **Democracy Watch** (X, `@DWatchCda`) | X | ~12K | Low-moderate | Press-release style; lots of "Group X demands Y" framing. Often misses engagement because reads as PR. |
| 10 | **CBC Politics / Globe Politics** (X) | X | 100K+ each | Variable | Headline + link card. Best-performing tend to be quote-pull cards. |
| 11 | **openparliament.ca** (X, `@openparlca`) | X | ~5K | Low | Very terse, automated-feeling. A cautionary tale: civic-data accounts that just announce votes without a frame get little traction. |
| 12 | **The Line** (`readtheline.ca`) | Bluesky | (handle returned 400; via X observation) | Moderate | Wry-insider voice; Gerson/Gurney quote-pulls perform well. |

---

## Section 2 — Patterns Observed Across High-Performers

### 1. The hook lives in the first 8 words.
Geist's top posts open with the verdict, not the setup:
- "Plainly wrong." (after a Minister quote)
- "Bill C-22 has gone off the rails."
- "Signal says it may have to exit the Canadian market under Bill C-22."

PA's posts tend to open neutrally with the bill name. Geist opens with the **judgment** or the **named actor**, then gives the data.

### 2. Named actors > institutional nouns.
The highest-engagement Geist posts name a **specific company or person** in the first line: *Signal, Apple, Meta, RCMP, CSIS, Public Safety, Sean Fraser.* Compare to lower-engagement ones that begin "The government…" or "Bill C-22 creates…"

### 3. The question hook reliably outperforms the statement hook (on Geist's feed).
- "How did Canada's lawful access plan go awry so quickly?" → 14♥/14↻
- "Why are Signal, Apple, VPNs and the US Congress raising alarm bells…?" → 16♥/14↻
- "RCMP's justification for mandatory metadata retention?" → 7♥/11↻ (note: 11 reposts!)

### 4. The data-stat template (Polling Canada) is shockingly portable.
```
Topic title:

🟢 Position 1: 59%
⚫️ Position 2: 35%
⚪️ Net: +24%

Source / Date
```
This format ranges from 25–60+ likes. It's a tight, scannable, image-free post with maximum information density. PA could adapt it for vote splits, party support patterns, and committee outcomes.

### 5. The "1️⃣2️⃣3️⃣ Top things to know" roundup (Canadian Press) is the highest-engagement format type for organizational accounts.
A numbered emoji list of 4–5 items, each ~10 words, gets ~5x the engagement of single-item announcements.

### 6. Image-statements drive quote counts.
Evan Solomon's top post (45 replies, 28 quotes) was an **image of a statement** (no link card). On Bluesky, native images outperform link cards by a wide margin because the algorithm favours dwell time on-platform.

### 7. Posts that name multiple high-profile actors in one line get repost-heavy engagement.
- Geist: "Signal, Windscribe, NordVPN and Apple aren't bluffing…" → 15♥/13↻
- Geist: "Signal, Apple, Meta, the U.S. Congress, and cybersecurity experts have issued the same warning." → 12♥/6↻

Each name is a coalition signal — "these are the smart people who agree." High-status mentions trigger reposts from those communities.

### 8. The trailing "→" link signal is fine but doesn't help.
PA's "Sources + full breakdown →" is a signature touch and consistent with our brand. But peer accounts that don't use it (Geist, Polling Canada) outperform PA, so the arrow is neutral at best — keep it for brand consistency, don't expect it to drive clicks.

### 9. Cadence matters. Geist posts 3–4x/day. PA posts much less frequently.
Bluesky's algorithm rewards recency. Three medium-engagement posts/day beat one polished post.

### 10. Engagement on Bluesky lives off rhetorical structure, not hashtags.
Almost no high-engagement post in this sample used a hashtag. `#cdnpoli` is present on a few of PA's posts and may even be slightly suppressing reach.

---

## Section 3 — Concrete Recommendations for PA

Each comes with a before-post (real, from PA's recent feed) and an after-rewrite.

### Recommendation 1 — Lead with the verdict or the named actor, not the bill number.

PA's strongest move is its factual rigor — but factual leads bury the punch. Open with the person, company, or judgment.

**BEFORE (PA, ~12♥/9↻):**
> Bill C-22 creates new surveillance powers + a 1-year metadata retention regime + secret capability orders.
>
> The Privacy Commissioner of Canada has no statutory role in any of it.
>
> Every prior lawful-access bill (C-30 in 2012, C-2 last year) included one. C-22 doesn't.

**AFTER:**
> The Privacy Commissioner has no role in Bill C-22.
>
> Every prior lawful-access bill — C-30 (2012), C-2 (2025) — gave the Commissioner a statutory role. C-22 creates new surveillance powers, a 1-year metadata retention regime, and secret capability orders. None of it crosses the Commissioner's desk.
>
> Sources + full breakdown →

Same facts, but the opener is the surprising verdict, and the second sentence frames C-22 as the **outlier**.

---

### Recommendation 2 — Use the question-hook 1–2x per week.

Geist's question posts get 11–17 reposts each. PA has zero question-led posts in the last 15.

**BEFORE (PA, 1♥/0↻):**
> Bill C-22 passed second reading April 20 — now at committee.
>
> The Lawful Access Act:
> → 1 year of metadata retention
> → Secret capability orders by Public Safety
> → Lower police access threshold
>
> Opposition: Geist, EFF, Meta, Apple, the U.S. House Judiciary.

**AFTER:**
> Why are Apple, Meta, Signal, the EFF, and the U.S. House Judiciary all opposing Bill C-22?
>
> → 1 year of metadata retention on every Canadian
> → Secret capability orders by Public Safety
> → Lower police access threshold
>
> The bill is at committee now.
>
> Sources + full breakdown →

The question primes engagement before the bullets land.

---

### Recommendation 3 — Front-load named, recognizable actors. Move "Bill C-22" out of the lede.

**BEFORE (PA, 3♥/1↻):**
> Bill C-22 doesn't allow police to read your texts. It doesn't have to.
>
> Metadata = who you called, when, for how long, where you were, what device. A year of that, on every Canadian.
>
> Michael Hayden, former NSA + CIA director: "We kill people based on metadata."

**AFTER:**
> "We kill people based on metadata." — Michael Hayden, former NSA + CIA Director.
>
> Bill C-22 doesn't let police read your texts. It doesn't have to. It mandates 1 year of metadata — who, when, where, what device — on every Canadian.
>
> Sources + full breakdown →

Lead with Hayden. The quote is the most retweetable line in the post — put it where the reader sees it before scrolling.

---

### Recommendation 4 — Add a "by the numbers" template for budget / vote / committee posts.

Adapt Polling Canada's format. Use it 2–3x per week.

**BEFORE (PA, 0♥/0↻):**
> Budget 2025, by the numbers:
>
> → $60.6B in cuts over 4 years
> → 40,000 public service positions eliminated
> → CRA: -2,620 jobs (largest)
> → +$5.3B/yr added to National Defence
> → Deficit target: $43.1B (2025-26) → $21.8B by 2028-29

This is already close — but the title is generic and there's no source-and-date footer. Add the Polling Canada signal:

**AFTER:**
> Budget 2025 in 5 numbers:
>
> 🔴 Cuts over 4 years: $60.6B
> 🔴 Public service jobs eliminated: 40,000
> 🔴 Largest single hit (CRA): –2,620 jobs
> 🟢 Defence boost: +$5.3B/yr
> ⚪️ Deficit path: $43.1B → $21.8B by 2028-29
>
> Dept. of Finance / Nov 2025
>
> Sources + full breakdown →

The coloured circles cue scan-and-stop. The date line signals rigour.

---

### Recommendation 5 — Run a weekly "Top things from Parliament this week" numbered post.

Adapt Canadian Press's 1️⃣2️⃣3️⃣ format to a parliamentary cadence. Friday afternoon slot.

**Example (new):**
> This week in Parliament:
>
> 1️⃣ C-22 hits day 4 at SECU. Signal warns it may exit Canada.
> 2️⃣ Budget 2025 amendment: 2,620 CRA jobs to be cut.
> 3️⃣ PrescribeIT audit motion goes 6–5 to in-camera, all 6 YEAs Liberal.
> 4️⃣ Alberta independence petition: 302K signatures certified.
> 5️⃣ World Cup costing: $1.07B total, $473M federal (PBO).
>
> Each story → parliamentaudit.ca

A reliable weekly anchor builds repeat-reader habit, which Bluesky's algorithm rewards.

---

### Recommendation 6 — Replace link-card-only posts with image-quote cards 1–2x per week.

Bluesky surfaces native images more aggressively than link cards. Evan Solomon's image-statement post got 7x his typical engagement.

**BEFORE (PA, 6♥/6↻):**
> Bill C-22 lets the Public Safety Minister order a telecom to build a surveillance capability into their service.
>
> The telecom must comply. The telecom is legally barred from telling you.

**AFTER:** Same text, but **also generate a simple quote-card PNG** with:
> "The telecom must comply. The telecom is legally barred from telling you."
>
> — Bill C-22, §17

…attached as a native Bluesky image (1080×1080 or 1080×1350, PA brand colors). Add the text body underneath. Image gives the algorithm dwell-time signal; text body gives skim readers the context.

---

### Recommendation 7 — Build a coalition-name shortcut for surveillance/privacy posts.

When PA covers C-22, mentioning the coalition opposing it triggers reposts from each of those communities' followers. Geist's top posts all do this.

**BEFORE (PA, 1♥/0↻):**
> Bill C-22 is at committee. The 12 Liberal MPs who put it there:
>
> → Sponsor: PS Min Anandasangaree
> → Cabinet speakers: Fraser, Sahota, Lattanzio
> [etc.]

**AFTER:**
> Signal, Apple, Meta, the EFF, Michael Geist, and the U.S. House Judiciary all oppose Bill C-22.
>
> The 12 Liberal MPs who voted it to committee:
> → Sponsor: PS Min Anandasangaree
> → Cabinet: Fraser, Sahota, Lattanzio
> → SECU (7): Duclos (chair), Acan, Dandurand, Housefather, Powlowski, Ramsay, Sodhi
> → House Leader: MacKinnon
>
> Sources + full breakdown →

The opposition-coalition lead frames the MPs as the outliers and primes reposts from privacy / tech / civil-liberties accounts.

---

### Recommendation 8 — Drop `#cdnpoli` as a primary tag. Mention the named people instead.

`#cdnpoli` on Bluesky doesn't have the discovery weight it had on Twitter. Mentioning `@mgeist.bsky.social`, `@justinling.ca`, etc., when their work is referenced gets you into their notifications — far more likely to drive a repost than a hashtag.

**BEFORE (PA):**
> [post text]
>
> #cdnpoli

**AFTER:** Strip the hashtag. When the post quotes/references a known account, @-mention them. Use `#cdnpoli` only on a Friday roundup where you want broader feed discovery.

---

### Recommendation 9 — Increase cadence to 3 posts/day on legislation days, 1–2 baseline.

Geist's 3–4 posts/day is the engagement engine. PA is below 1/day on average. Even just **3 posts a day on a committee/vote day** (morning preview / midday quote-pull / evening summary) would 3x daily reach.

Specific daily cadence to test for 2 weeks:
- **Morning (8–9 ET):** committee/vote preview, one fact, one named actor
- **Midday (12–1 ET):** the quote of the day from committee, image-card format
- **Evening (6–8 ET):** the day's verdict, "by the numbers" format

---

### Recommendation 10 — End at least one post per day with a direct CTA (not just "Sources →").

"Sources + full breakdown →" is informational. A CTA pushes the reader to do something — and CTAs that ask for a small action correlate with engagement spikes.

Variants to test:
- "Read the full bill section: parliamentaudit.ca/c-22"
- "Email your MP: parliamentaudit.ca/secu-contacts"
- "Tell us: should the Privacy Commissioner have a role? Reply 👇"
- "Three numbers we'll be watching. Bookmark this."

Use the bookmark- or comment-prompt sparingly (1 in 5 posts), but it converts passive readers into engaged ones.

---

## Section 4 — Quick-Reference Checklist for Drafting Posts

Run every post through this before publishing:

**Hook (first 8 words)**
- [ ] Does my first line name a person, company, or institution (not "Bill C-22" or "the government")?
- [ ] Or: does it open with a verdict / strong claim / question?

**Body**
- [ ] Is there at least one named, recognizable actor (Geist, Signal, RCMP, a specific MP, a named Court)?
- [ ] If it's a stat-heavy post, am I using the bullet template with coloured-circle emojis or arrows?
- [ ] Have I cut every sentence that doesn't add a fact or a name?
- [ ] Body under 300 chars? (Bluesky cap is 300, X varies)

**Format**
- [ ] Native image attached if quote is the killer line? (Quote card, not just link card.)
- [ ] If it's a roundup, am I using the 1️⃣2️⃣3️⃣ numbered format?
- [ ] No hashtag — unless this is a Friday roundup or a thematic series (#PAaudit, etc.).

**CTA**
- [ ] "Sources + full breakdown →" is the default, fine.
- [ ] 1 in 5 posts: stronger CTA (email an MP, reply with your view, bookmark for committee day).

**Coalition signal**
- [ ] If 3+ recognizable institutions agree with my framing, are they named in one line?
- [ ] If I'm quoting / building on another account's reporting, have I @-mentioned them?

**Cadence**
- [ ] At least 1 post today. Target 3 on a committee/vote day.
- [ ] Friday: weekly numbered roundup.
- [ ] Mondays: agenda preview for the parliamentary week.

**Voice**
- [ ] Non-partisan: I'm not telling readers what to think, I'm naming the people, the numbers, and the gap.
- [ ] Authoritative but not dry: a verdict is OK ("plainly wrong," "off the rails," "outlier") when sourced.
- [ ] No editorializing without an expert quote behind it.

---

## Appendix — Engagement Benchmarks for PA

Where PA should aim, based on this peer set:

- **Followers <100 (where PA is now):** 0–3 likes typical, occasional 5–15 on viral posts. PA's recent best (16♥/11↻ on the Tommy Douglas/CSIS post) is already at the high end for this size.
- **Followers 500–1,000:** 5–15 likes typical.
- **Followers 5,000 (Geist tier):** 10–25 likes typical, 30+ on hits.
- **Followers 25,000+ (Polling Canada / Justin Ling):** 30–150 likes typical.

The constraint right now is **discovery**, not post quality. PA's posts are already as well-crafted as Geist's. Closing the gap is mostly:
1. Cadence (3x more posts/day)
2. Coalition-name @-mentions (get into Geist's, Ling's, EFF's notifications)
3. Image-quote cards (algorithm boost)
4. Hook rewrites (verdict-first, named-actor-first, question-first)

A realistic 60-day target: 200 Bluesky followers, median 5 likes/post, one breakout post in the 30–50 like range.
