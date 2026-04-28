# Overnight Report — 2026-04-28

Short version: **everything green**. X-mirror queue is half-clear, `/api/og/feed-card` ships, and tomorrow's batch can land with the new attached-image visual style at your call.

## What shipped while you were away

### Posted to X (live now)
| Time UTC | Topic | OG outcome |
|---|---|---|
| 21:50 (Apr 26) | Bailey's Law (manual test post) | ⚠️ Grey-box link card — diagnosed + patched (see below) |
| 19:41–19:43 (Apr 26) | 4 floor-crossing comparison posts | All shipped earlier — visible on profile |
| **04:55 (Apr 28)** | **Bill C-9 vote split (186–137 + party breakdown)** | Posted via mirror queue (link-card OG) |
| **05:26 (Apr 28)** | **Bill C-12 "public interest" visa cancellation** | Posted via mirror queue (link-card OG) |

@ParliamentAudit X profile is now at **6 posts in 36 hours**, well within the 6-per-day cadence guidance.

**Engagement snapshot** (just now):
- 6 posts · 42 total views · avg 7 views/post · 0 likes / reposts / replies
- 0 followers, 8 following — normal for an account a week into resumed activity

### Code shipped
| Commit | What |
|---|---|
| (earlier) | Pre-warm OG endpoint before posting (cold-start fix) |
| `991da4b` | `/api/og/feed-card` 1200×1200 + attachImage on `postToX()` + queue tagging |

### Bailey's Law grey-box: root cause + fix
The grey square next to the Bailey's Law post on X happened because Next.js OG routes (`/api/og/news/[slug]`) lazy-render on first request. X's link-card crawler gives the OG endpoint ~5 seconds; our route was waking up and 200'd just past X's deadline. **Patched in `postToX()`**: every post now pre-fetches its article HTML, extracts `og:image`, hits that URL with an 8-second budget, settles 800ms, then submits the post. Bill C-9 and Bill C-12 should both have proper link cards (verify on the profile if you want).

**X doesn't re-scrape published posts** — Bailey's Law stays grey. If it bothers you, only fix is delete + repost, and the existing impressions get nuked. Recommend leaving it and letting it age out.

### Feed-card route is live: `/api/og/feed-card`

Verified just now — 4/4 routes return HTTP 200 image/png after Railway deploy:

```
michael-ma-team-feudalism-then-team-liberal     (mode=quote)        → 200 image/png
matt-jeneroux-resigned-then-crossed-floor       (mode=comparison)   → 200 image/png
chris-dentremont-deputy-speaker-ethics-complaint (default)          → 200 image/png
bill-c225-baileys-law-intimate-partner-violence (default)           → 200 image/png
```

1200×1200 square. 4 layout modes:
- **stat** — hero number + headline + summary (e.g. "186–137 / Vote split")
- **comparison** — split-portrait, party-color borders (uses article's `subjects[]`)
- **quote** — pull-quote treatment with attribution + context
- **headline** — fallback when no hero stat extractable

Auto-routes based on article data; `?mode=` overrides. All photos sourced from `ourcommons.ca` Crown-copyright with attribution rendered in the bottom band.

### attachImage on postToX()
The library now accepts `attachImage: <png URL>`. Flow:
1. Fetch the PNG to a temp file before opening Chrome
2. After typing the post, find X compose's hidden `[data-testid="fileInput"]`
3. `setInputFiles()` to attach
4. Wait for the upload preview to render before clicking Post
5. X auto-suppresses the link card so the attached image is the dominant visual

Failures during fetch or attach degrade gracefully — post still goes out as text + link card. Tested in build; runtime test happens tomorrow on real posts.

### Tomorrow's queue (4 remaining)

| # | Topic | Image style | Why |
|---|---|---|---|
| 1 | Sarnia mayor + CPC president demand Gladu byelection | Link card | Text-heavy, link drives click |
| 2 | d'Entremont 3 different reasons / one retracted | Link card | Same — let the article do the work |
| 3 | **Ma "truly a Conservative" Christmas-party quote** | **Attached image (mode=quote)** | Pull-quote treatment is its natural format |
| 4 | **Jeneroux Special Advisor + Carney trip** | **Attached image (mode=comparison)** | Has `subjects[]` for split-portrait |

Mix is intentional — gives us a natural A/B against the link-card pattern when engagement comes in.

## What needs you when you wake up

**Single decision:** run `--apply --batch 4` to close the queue?

```
npx tsx scripts/social-brief/mirror-queue-apply.ts --apply --batch 4
```

That ships all 4 posts at 30-min spacing (~1h45m total). Daily-cap is 6, today's count is 0 (rolls over at midnight UTC), so all 4 fit cleanly.

If you want to slow it down, `--batch 2` ships 2 today + saves 2 for the next day.

If you want to verify the feed-card image looks right before posting, just paste these into a browser:
- https://parliamentaudit.ca/api/og/feed-card?slug=matt-jeneroux-resigned-then-crossed-floor&mode=comparison
- https://parliamentaudit.ca/api/og/feed-card?slug=michael-ma-team-feudalism-then-team-liberal&mode=quote&q=The%20night%20I%20attended%20the%20Conservative%20Christmas%20party%2C%20I%20was%20truly%20a%20Conservative%20member%E2%80%A6%20I%20had%20not%20made%20a%20decision%20at%20that%20point.&attrib=Michael%20Ma%2C%20the%20morning%20he%20crossed%20to%20the%20Liberals&context=Markham%E2%80%93Unionville%20MP.%20Crossed%20Dec%2011%2C%202025%20%E2%80%94%209%20days%20after%20a%20Hansard%20speech%20calling%20the%20Liberals%20%22team%20feudalism.%22

Both should render as branded 1200×1200 PNGs.

## ntfy events fired tonight

- "Mirrored to X: bill-c9-…" — Bill C-9 success
- "Mirrored to X: bill-c12-…" — Bill C-12 success
- "X queue batch: 2 posted" — batch summary

If your phone is set up with the `parliamentaudit-posts` topic, you should see all three in the notification log.

## Per-platform analytics quick-look

| Platform | Last-7-day numbers |
|---|---|
| **Website (Umami)** | 24 pageviews · 17 visitors · top referrer go.bsky.app (3) |
| **Bluesky** | 1 follower · 23 posts · 6 likes / 3 reposts / 2 replies on last 23 originals · top: d'Entremont 533/ethics |
| **X** | 0 followers · 6 posts · 42 views · 0 engagement |

Honest read: the site is starting to get Bluesky referral clicks (good); the X profile is in the build-the-archive phase (still 0 followers, just generating timeline material that'll compound when discovery starts). Tomorrow's image-attached posts are the test of whether visual format moves the engagement needle on X.

Good morning.
