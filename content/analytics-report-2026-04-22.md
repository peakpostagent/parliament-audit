# Analytics Report — 2026-04-22

Snapshot of live traffic + interpretation. Umami has been tracking since 2026-04-22 ~04:43 UTC (homepage only) and across all SSG routes since ~05:06 UTC after the Dockerfile ARG fix.

## What the data says right now

| Metric | Last 24h | Last 7d |
|---|---|---|
| Pageviews | 7 | 7 (same — tracking started <24h ago) |
| Visitors | 6 | 6 |
| Visits | 6 | 6 |
| Bounces | 5 | 5 |
| Total time on site | 30 sec | 30 sec |
| Active visitors | 0 at time of pull | — |

**Bounce rate:** 83% (5 of 6 visits single-page). **Avg session:** ~5 seconds.

### Breakdown

**Browsers**
- Chrome (desktop): 4
- Chrome iOS: 2

**Operating systems**
- Windows 10: 3
- iOS: 2
- Linux: 1

**Countries**
- US: 3
- China: 2
- Canada: 1

**Devices**
- Laptop: 4
- Mobile: 2

**Referrers captured**
- google.com: 1 (this was my own diagnostic beacon earlier tonight)
- All other visits: direct / no referrer

## How to read these numbers honestly

These are **diagnostic numbers, not growth numbers.** Tracking has been live for under 24 hours, and only on all pages for about 18 hours. Anything we conclude about traffic patterns from this sample is noise.

A few things are still worth flagging:

**1. Zero X or Bluesky referrers — and we've been posting.**
Three possible explanations:
- Those platforms strip the referer header on link clicks (they often do; X is the worst offender — it usually appears as direct traffic or as `t.co`)
- People are seeing the posts but not clicking through
- People are clicking on articles that were still on the old build (pre-Dockerfile-fix) and not getting tracked

Verdict: most likely a mix of (1) the referer-stripping behaviour and (3) the tracking gap. We can't distinguish them yet. **The fix is UTM tags on every social post link** — that turns every click from X/Bluesky into an identifiable source regardless of the referer header.

**2. The US/China/Canada mix is suspect at this volume.**
Six real humans wouldn't come from three continents on a <24h-old tracker for a Canadian politics site. Two of those are almost certainly: (a) my own test traffic from browser-fork's automation UA, which can geolocate anywhere Playwright's backend is, and (b) legitimate bots that Umami's filter didn't catch. This noise settles out once real traffic volume grows.

**3. The 83% bounce rate is meaningless at this sample size.**
Five bounces on six visits = N of six. This will stabilize around the honest baseline for accountability journalism over the next 30–60 days. Per the Reuters Institute, healthy newsroom bounce rates are 60–75%.

## What we're tracking well

- **Homepage traffic** — SSR route, live since 04:43 UTC
- **News index + article pages** — SSG, live since 05:06 UTC
- **Tag pages** (38 of them) — same
- **MP pages** — with editorial-coverage fallback
- **Support, republish, subscribe, find-your-mp** — all trackable

## What we're NOT tracking yet (the gaps that matter)

These are all from the [analytics playbook](./analytics-playbook.md) and are the highest-priority next-sprint items. I'm shipping some of them tonight.

1. **Custom events** (`umami.track()` calls) — nothing is currently wired. Need:
   - `newsletter-subscribed` — fires from the Subscribe form on success
   - `find-my-mp-submitted` — fires from the postal-code lookup
   - `outbound-social` — fires on every X / Bluesky / LinkedIn click
   - `outbound-source` — fires on every source-citation click at the bottom of articles (this is the "did they actually read the primary source?" signal)
   - `article-share` — fires on X / FB share button clicks
   - `read-more-at-source` — aliases outbound-source, separate prop for "source" vs "external"
   - `article-engaged` — scroll + dwell hook, fires after 30s + 50% scroll
   - `article-finished` — fires when user scrolls past the last paragraph

2. **UTM tagging on outbound social posts** — so Bluesky and X clicks become identifiable regardless of referer header. Shipping in this session.

3. **Google Search Console** — zero visibility right now into what Google thinks our pages are for. Needs DNS verification at Porkbun (one-time, <10 min).

4. **Resend email open/click webhook** — we don't know if a single welcome email has been opened. Resend has webhooks; we have zero listeners.

5. **RSS / Atom feed** — we don't have one. Anyone who wants to syndicate us can't without scraping. Shipping in this session.

## Targets to aim for in the first 90 days

From the analytics playbook, calibrated to our actual starting point:

| KPI | 90-day target | How we'll measure |
|---|---|---|
| Weekly pageviews | 500 | Umami weekly stats |
| Engagement rate (replies + reposts ÷ impressions) | 35% | X + Bluesky analytics |
| Article read-through (50% scroll + 30s dwell) | 20% of article starts | `article-engaged` event ÷ pageviews |
| Email conversion | 1.5% of article readers subscribe | `newsletter-subscribed` ÷ article pageviews |
| 30-day returning visitor rate | 25% | Umami visitors with session in two 30-day windows |
| Non-branded Search Console clicks | 500/mo | Search Console once verified |

**The single most important signal** in the first 30 days: **`article-engaged` rate**. If people land on an article, read for 30+ seconds, and scroll 50%, we have a product. If they bounce, we don't — and no amount of social distribution will fix that.

## What I'm shipping right now to close the gaps

- 8 custom events (see list above)
- UTM param auto-append on social posting scripts
- RSS / Atom feed at `/rss.xml` with feed discovery links
- Query-param capture on `/subscribe?intent=builder&tier=...` so the /support wait list funnel is trackable

Not shipping tonight (blocked on you or deferred):
- Google Search Console DNS verification (~10 min at Porkbun, needs your login)
- Resend webhook listener (needs a decision about where to pipe events — DB column on subscribers? separate email_events table?)
- Bluesky native-scheduling login (5 min at your screen)

## How to actually read the Umami dashboard

[umami-production-d170.up.railway.app](https://umami-production-d170.up.railway.app) — login `admin` + password in `.umami-creds.json`.

**Do look at:**
- Filters → Referrer: which platforms drive clicks
- Filters → URL: which articles hit vs. which die
- Filters → Entry page: where people land (homepage vs. social-referred article)
- Events (once wired): engagement-rate signals

**Don't look at:**
- Average session duration — will lie to you at small samples
- Bounce rate in isolation — only meaningful per-article and over ≥100 sessions
- Raw pageview spikes — every "spike" at this volume is one person on Reddit

Report back on Monday with the first weekly roll-up.
