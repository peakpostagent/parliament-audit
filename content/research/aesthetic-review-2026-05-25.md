# Aesthetic Review — Parliament Audit social channels

_Generated 2026-05-25 by overnight autonomous run, after the user asked: "is there any aesthetic thing we can do to look more professional."_

I pulled profile metadata from each platform's public API, downloaded the avatar + banner images, and visually inspected them. Captures of the current state are saved to `content/research/aesthetic-audit-assets/`.

## Channel-by-channel state

### Bluesky — @parliamentaudit.bsky.social
- **Avatar:** Outlined maple leaf with a "design grid" / audit-mark crosshatch through the center, white on a solid Canadian-red background. Strong, recognizable at small sizes. Clever visual pun on "audit" (the leaf-as-blueprint). **9/10.**
- **Banner:** Dark black background, "PARLIAMENT AUDIT" wordmark (white + red typography), small red-tag label "CANADIAN CIVIC JOURNALISM" above the wordmark, tagline "Every vote. Every bill. Every MP. Non-partisan. Factual." underneath. Red vertical accent strip on left. Professional, news-outlet-grade. **9/10.**
- **Display name:** "Parliament Audit"
- **Handle:** parliamentaudit.bsky.social
- **Bio:** "Canadian parliamentary votes, legislation, and accountability — tracked and explained. Non-partisan. Factual. Transparent. / parliamentaudit.ca"
- **Followers / following / posts:** 10 / 34 / 40
- **Pinned post:** None
- **Account created:** 2026-04-02

### X — @ParliamentAudit
- API rate-limited / auth-walled for unauthenticated WebFetch — could not inspect visually from the overnight session. From the analytics-snapshot reports we have:
  - Display name: "Parliament Audit"
  - Followers: 3
  - Posts: 40+ via mirror queue
  - Bio + banner + avatar status: **unverified — operator to spot-check tomorrow**.

### Mastodon — @parliamentaudit@mstdn.ca
- **Avatar:** Filled-in maple leaf (not outlined) in white on solid red, with a thin white border around the whole tile. **Different from the Bluesky avatar.** 6/10 standalone; brand-inconsistency lowers it.
- **Banner:** Light grey grid-pattern background, "PARLIAMENT AUDIT" wordmark in same typography as Bluesky (red + black), tagline "Canada deserves to know." (**different from Bluesky tagline**), small "@parliamentaudit" handle line, faint maple-leaf watermark on right. Red border on left and bottom. Mini-tags "EST. 2026 / #cdnpoli" in bottom-right corner. **8/10 standalone — clean and credible.**
- **Display name:** "Parliament Audit"
- **Handle:** parliamentaudit@mstdn.ca
- **Bio:** "Canada's House of Commons votes — logged, categorized, and explained. Non-partisan, factual, every claim sourced. Mirror of parliamentaudit.ca. Author: @alexcroft."
- **Custom profile fields (rel=me verified links):** ⚠️ **EMPTY.** This is the biggest single Mastodon credibility miss — no green-checkmark verified links to website, Bluesky, or X.
- **Followers / following / posts:** 5 / 0 / 7
- **Pinned post:** None
- **Account created:** 2026-05-16

## Top issues (ranked by credibility lift)

### 🔴 Priority 1 — fix tonight or first thing tomorrow

**1. Avatar inconsistency between Bluesky and Mastodon.** The two platforms show two different avatars. Same color but different leaf treatment (outlined vs filled). The Bluesky avatar is the better one — the audit-grid pun is a meaningful brand differentiator. Upload it to Mastodon (and confirm/upload on X). **15 minutes of work, large brand-recognition benefit.**

**2. Empty Mastodon profile fields (no rel=me verified links).** Mastodon profiles support up to 4 custom "fields" — the standard civic-media setup is: Website (with rel=me on parliamentaudit.ca that returns the green ✓), Bluesky link, X link, optional newsletter link. These are the "verified" badges Mastodon users look for to distinguish real accounts from impersonators. **30 minutes of work — needs editing the profile page on mstdn.ca + adding a `<link rel="me" href="https://mstdn.ca/@parliamentaudit">` to parliamentaudit.ca's `<head>`.** The user memory notes this was set up previously but the current API response shows fields = []; worth re-checking.

**3. No pinned post on any platform.** The pinned-post slot is the single most-viewed real estate on any social profile. Visitors hit your profile, look at the pinned post, decide whether to follow. Recommendation: pin a "What is Parliament Audit" post on each platform. One per platform, written in that platform's voice. Suggested copy for the Bluesky pinned:

> Parliament Audit tracks every recorded vote in Canada's House of Commons. We publish original articles on the bills, the votes, and the MPs — non-partisan, sourced, in plain English.
>
> Every claim links to Hansard or LEGISinfo. Every MP's vote is searchable.
>
> Read at parliamentaudit.ca · Contact your MP via the article footers.

### 🟡 Priority 2 — fix this week

**4. Tagline inconsistency across 4 surfaces.** We currently have FOUR different versions of the brand tagline:
- Bluesky banner: "Every vote. Every bill. Every MP. Non-partisan. Factual."
- Mastodon banner: "Canada deserves to know."
- Bluesky bio: "Canadian parliamentary votes, legislation, and accountability — tracked and explained. Non-partisan. Factual. Transparent."
- Mastodon bio: "Canada's House of Commons votes — logged, categorized, and explained. Non-partisan, factual, every claim sourced. Mirror of parliamentaudit.ca. Author: @alexcroft."

Recommendation: pick one and use it everywhere. My pick — **"Every vote. Every bill. Every MP. Non-partisan. Factual."** It's the strongest line we have (parallel structure, three concrete nouns, two adjectives) and it's already on the Bluesky banner.

**5. Banner style inconsistency.** Bluesky banner is dark; Mastodon banner is light. Different visual systems. The dark Bluesky banner is more striking, but the light Mastodon banner is cleaner and reads better on mobile. Pick one and commission a single coherent set across all three channels. (Low priority because both are good individually; we'd just look more polished.)

**6. Mastodon following = 0.** Mastodon is conversation-driven, not broadcast-driven. Following zero accounts makes us look like a one-way RSS feed. Recommendation: follow 20-30 relevant Canadian civic accounts (Michael Geist if on Mastodon, Democracy Watch, parliamentary press gallery accounts, fellow civic-data projects, journalists from CBC/Globe/Toronto Star). Takes 20 minutes. Materially changes how the account reads to new visitors.

### 🟢 Priority 3 — nice-to-have polish

**7. Mastodon post cadence (7 total posts).** We're under-mirroring to Mastodon. The Bluesky→Mastodon mirror script exists and works; some posts haven't been mirrored. Worth a one-time backfill of the C-22 series + auto-industry piece to Mastodon to bring it to parity (~10 posts vs current 7).

**8. Bio length.** The Mastodon bio is verbose ("Author: @alexcroft" inside the bio breaks brand voice — the brand is impersonal and audit-style; an author signature reads more like a personal blog). Recommend dropping the author line from the bio; instead, surface it only in the profile fields ("Operator: Alex Croft" as one of the rel=me fields, optional).

**9. No "media kit" / brand assets page.** As we grow, journalists / podcasters / fellow civic outlets will want to cite or interview Parliament Audit. A simple `/about/press` page on the site with the logo files (avatar + banner in various sizes), one-paragraph organizational description, and contact email would prevent stale third-party usage of the wrong assets. ~1 hour of work.

## Quick-action checklist for the operator

When you next have 30 minutes:

- [ ] Upload the Bluesky avatar to Mastodon (visual consistency)
- [ ] Spot-check X avatar matches the others
- [ ] Add 4 Mastodon profile fields with rel=me back-verification
- [ ] Pin one "what we do" post per platform
- [ ] Consolidate to a single tagline ("Every vote. Every bill. Every MP. Non-partisan. Factual.")
- [ ] Follow 20-30 relevant Canadian civic accounts on Mastodon
- [ ] Backfill C-22 series posts to Mastodon

## Visual references

All current assets archived to:
- `content/research/aesthetic-audit-assets/pa-bsky-avatar.jpg`
- `content/research/aesthetic-audit-assets/pa-bsky-banner.jpg`
- `content/research/aesthetic-audit-assets/pa-mst-avatar.png`
- `content/research/aesthetic-audit-assets/pa-mst-header.png`

(These are downloaded snapshots, not the canonical files — the canonical assets live on each platform's CDN. If a future redesign needs starting points, the SVG/PSD masters should be in whatever design folder Alex maintains.)
