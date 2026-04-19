# Parliament Audit — Growth Tactics & Tools (April 2026)

Tactical research compiled from three parallel investigations: Canadian competitor accounts, journalism tooling stack, and current X/Bluesky algorithm behavior. The previous account-level competitor analysis lives in `competitor-report.md` — this is the *what to do* companion to that *who to watch* doc.

---

## TL;DR — Top 5 things to do this week

1. **Subscribe to X Premium ($16/mo).** Non-Premium link posts have ~0 algorithmic distribution since March 2026. This is now infrastructure cost, not a vanity buy. ~10x reach multiplier documented across multiple 2026 studies (Buffer 18M-post analysis).
2. **Mirror every post to Bluesky on day one** — already doing this via `post-to-bluesky.ts`. Tag `#cdnpoli` on every Bluesky post (the cdnpoli custom feed pulls on hashtag, drives 60%+ of Bluesky discovery). 
3. **Run a 70/30 reply campaign on X.** 10–20 thoughtful replies/day targeting Canadian journalists with 2–10x our follower count, ideally with a chart-image attached. Replies are weighted ~15x a like in the algorithm; chart-image replies get +150% visibility. Target list: Aaron Wherry, Althia Raj, Rosie Barton, Justin Ling, Paul Wells, Coyne, Boessenkool, Kheiriddin.
4. **Request the Datawrapper free-for-nonprofits Custom plan.** Free tier is already excellent for branded charts; the Custom tier removes their watermark and adds team features. Used by NYT/WaPo/Reuters. Email request takes 5 min.
5. **Plug in the OpenParliament API.** Michael Mulley already solved the hard parsing of votes/Hansard/MPs at `api.openparliament.ca`. Free. Instant 10x on data depth vs. our current ourcommons.ca scraping.

---

## Part 1 — Tactics validated by multiple streams of research

### 1.1 — Lead with a number or named entity

Top-performing 2026 hook formula across data-journalism studies. Number-led posts get **2–3x more bookmarks**, signal data-backed authority, and anchor scroll attention.

Example rewrites from our existing posts:
- ❌ "Bill C-9 passed the House" 
- ✅ "186–137. Bill C-9 passed today. Liberals + Bloc voted yes; Conservatives, NDP, Greens voted no."

Sweet spot post length: **71–110 characters** (+17% engagement vs. longer per Tweet Archivist 2026).

### 1.2 — Pull-quote teaser format (Paul Wells / The Logic style)

Don't tweet "new article up." Lead with the single most surprising stat from the article + link card. Treat X as a billboard for owned-channel content, not a conversation venue.

Example:
- ❌ "Our new piece on the federal budget is up: parliamentaudit.ca/..."
- ✅ "$60.6B in cuts. 10,000 jobs. CRA loses 2,620. Passport waits projected to double by fall.   parliamentaudit.ca/..."

### 1.3 — Quote-tweet with receipts (Canadaland's signature move)

The single highest-leverage post type for accountability journalism. When an MP votes against their stated position, quote-tweet the original promise with the vote record screenshot.

Native to a vote tracker — every broken promise = a quote-tweet of the politician's own words paired with our chart. **Lipad.ca** (machine-readable historical Hansard) makes finding the original quote trivial.

### 1.4 — Single long-form posts beat threads (post-Jan 2026 algo update)

Threads still get 3x raw engagement, BUT since X's January 2026 ranking update, long-form single posts (expanded character limit) get more *distribution*. Reserve threads for genuinely sequential explainers ("here's how a bill becomes law"). Use long single posts for "here's what just happened."

### 1.5 — Polls work, with a follow-up

Polls hit 1.5–3% engagement (2–3x regular tweets) because the one-tap interaction is cheap. Power-move: post a follow-up analysis 1–2 hours after the poll closes to trigger a "second wave."

Native fit for us: *"How do you think your MP voted on Bill C-X?"* → drop the actual roll-call breakdown 2 hours later.

### 1.6 — Personal / founder account beats brand account

Jesse Brown (~70K) outperforms @Canadaland. Wells, Gurney, and Gerson all carry their publications' reach. Recommend running a **"Parliament Audit, by [Founder Name]"** personal handle in parallel that does most of the engagement/replies. Brand account stays tight on data drops.

### 1.7 — Number-led on data days, question-led on engagement days

Mon/Wed/Fri = number-led data drops (authority + bookmarks).
Tue/Thu = question-led civic prompts (replies + algorithm-favored conversation depth).

---

## Part 2 — Tools to adopt (prioritized)

### 🟢 Adopt this month

| Tool | Cost | Why now |
|---|---|---|
| **X Premium** | $16/mo | Required for link distribution post-March 2026. ~10x reach. Non-negotiable. |
| **OpenParliament API** | Free | Instant 10x on data depth. Mulley already solved Hansard parsing. |
| **Datawrapper** (request nonprofit Custom) | Free | Newsroom-grade charts that embed everywhere. Complements our `@vercel/og` social cards rather than replacing them. |
| **Lipad.ca** (Canadian Hansard search) | Free | Powers "this MP voted opposite their 2015 self" content. Quote-tweet-with-receipts engine. |
| **Elections Canada open data** | Free | Powers "who funds this MP" angles. |

### 🟡 Adopt next month

| Tool | Cost | Why later |
|---|---|---|
| **Typefully** Creator | $15/mo | One composer for X + Bluesky + LinkedIn + Threads with built-in analytics. Replaces juggling X native scheduler + our `post-to-bluesky.ts`. |
| **Ghost(Pro)** newsletter | $9/mo start | Set up *before* the list grows. Migrating off Substack later costs trust. Bundle with website for full data ownership. |
| **Animated chart videos** (Flourish) | Free tier | X gives native video 2–3x impression priority over static images. A 10-second animated chart reveal beats our PNG charts. |

### 🔴 Skip

- Hypefury (growth-hacker tilt; wrong brand fit)
- Buffer / Hootsuite / X Pro (overpriced or weaker than Typefully for our use case)
- Substack (10% cut + weak data ownership)
- Midjourney for civic content (synthetic-image trust risk)

---

## Part 3 — Article-side improvements (not just social)

Looking at our current article structure (`/news/[slug]`):

✅ Already good: number-driven headlines, clear H2 sections, sources linked, reading time shown.

❌ Missing vs. best-in-class data journalism:

1. **TLDR / "Key takeaways" box at the top.** Pew, USAFacts, Reuters Visuals all open with 3–5 bullet takeaways before the body. ~5x time-on-page for skimmers who want the summary then leave.
2. **In-article charts** (not just OG images for social). Datawrapper embeds inline = Reuters-grade credibility.
3. **Pull quotes** — call out one sentence per section in larger text. Massively improves scannability and gives screenshot-friendly moments.
4. **"Last updated" timestamp** alongside published date. Trust signal for live-tracker content.
5. **Author byline + photo.** "Personality/creator-led news beats institutional brands" per Reuters Institute 2026 trends. A faceless "Parliament Audit Team" loses to a single-byline voice.
6. **AEO/GEO structured data** (JSON-LD `Article` + `Dataset` schemas). New "SEO" — gets us cited when ChatGPT/Perplexity/Google AI Overviews answer "how did my MP vote?" The Reuters Institute 2026 Trends report calls this the single biggest emerging discovery channel.
7. **Comparison tables** for vote breakdowns. Currently we have prose like "Liberals voted yes, Conservatives voted no" — a real `<table>` showing party / yea / nay / abstain renders much better in search results AND is parseable by AI agents.

---

## Part 4 — Bluesky-specific moves

1. **Tag `#cdnpoli` on every post.** The cdnpoli custom feed pulls on hashtag, and 60%+ of Bluesky discovery flows through custom feeds (TechCrunch Jan 2026). Free reach.
2. **DM 5 Canadian starter-pack curators** to be added (Luke LeBrun's "Journalists who cover Canadian politics", Callum's "Canadian Politicians on Bluesky", plus the 11+ Canadian Government packs at blueskystarterpack.com). One-line pitch: "Non-partisan vote tracker, here's a sample post." Most curators add on request — curating is a chore.
3. **Reply substantively to every comment in the first hour after posting.** Bluesky's Discover algorithm scores conversation depth highest: a post with 40 replies + 10 reposts outranks one with 200 likes + 0 replies (bskygrowth 2026).
4. **Build a "Parliament Audit Watch" custom feed** in month 2–3 using Bluesky's new Attie AI tool (March 2026 launch). Brand authority play.
5. **Canadian press / policy / engaged civic audience is on Bluesky now.** Charlie Angus reports engagement up + harassment way down despite smaller follower count. CBC reports MP Bluesky adoption quadrupled in 4 months. Use X for reach + virality, Bluesky for depth + relationships.

---

## Part 5 — Things I want to validate next

These need either real-world testing or one more research pass before we commit:

- **Two-voice analyst format.** The Line proves it works for opinion. Does it work for non-partisan data journalism? Test: pair "what a fiscal hawk sees" + "what a progressive sees" on one bill, measure engagement vs. neutral baseline.
- **10-second animated chart videos vs. static PNGs.** Build one of each for the same article, A/B test on X.
- **"Lighter tone" voice.** Kettering Foundation 2026 research found humor/comedians drive outsized civic-journalism engagement. Test a dry-wit voice variant on weekend posts where stakes are lower.
- **Repost-vs-remix windows.** Don't duplicate top performers; remix the hook within 48–72 hours. Confirm with our own data once we have ≥100 posts to measure against.

---

## Sources (key ones; full lists in the original agent reports)

- [Reuters Institute Journalism, Media and Technology Trends 2026](https://reutersinstitute.politics.ox.ac.uk/journalism-media-and-technology-trends-and-predictions-2026)
- [How the Twitter/X Algorithm Works in 2026 (source-code analysis) — posteverywhere.ai](https://posteverywhere.ai/blog/how-the-x-twitter-algorithm-works)
- [Does X Premium Really Boost Reach? 18M+ posts analyzed — Buffer](https://buffer.com/resources/x-premium-review/)
- [70/30 Reply Strategy on X 2026 — Teract](https://www.teract.ai/resources/grow-twitter-following-2026)
- [Journalists Are Leaving X for Bluesky — Columbia Journalism Review](https://www.cjr.org/the_media_today/journalists_leaving_x_bluesky.php)
- [Canadian MPs pivoting from X to Bluesky — CBC News](https://www.cbc.ca/news/politics/canadian-politics-bluesky-x-1.7391832)
- [How the Bluesky Algorithm Works in 2026 — bskygrowth](https://blog.bskygrowth.com/how-bluesky-algorithm-works-2026/)
- [OpenParliament API](https://openparliament.ca/api/)
- [Lipad — Canadian Hansard search](https://www.lipad.ca/)
- [Elections Canada Open Data](https://www.elections.ca/content.aspx?section=fin&dir=oda&document=index&lang=e)
- [Datawrapper for Newsrooms](https://www.datawrapper.de/)
- [Three newsletters for the price of 1.5 — Nieman Lab on indie civic journalism bundling](https://www.niemanlab.org/2026/04/three-newsletters-for-the-price-of-1-5-independent-journalists-experiment-with-a-bundle/)
