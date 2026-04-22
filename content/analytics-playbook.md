# Parliament Audit — Analytics Playbook

_Last updated: 2026-04-21. Owner: Cole. Stack: self-hosted Umami on Railway (website ID `5f53d939-6497-4408-b9b6-b1132dad57fc`), Next.js on Railway, Resend for transactional/newsletter, X + Bluesky for social, Porkbun DNS._

This playbook answers three questions: **what to look at, what to stop looking at, and how to turn it into decisions.** It is built for year-one scale (hundreds-to-low-thousands of weekly readers), not for a legacy newsroom with a data team. Revisit every 90 days.

---

## 1. The 5 KPIs That Actually Matter (Year One)

Most newsroom dashboards drown you in numbers. At this stage, five metrics tell you everything you need. Each is defined, has a 90-day target, and maps to a specific decision. If a metric doesn't change a decision, it's vanity — move it to the ignore list.

### 1.1 Engagement Rate (per article)
**Definition:** `(scroll depth ≥ 75%) × (time on page ≥ 90s) / sessions`, captured as a tagged Umami event `article-engaged` (see §3). A reader who scrolls past the fold AND stays 90 seconds is "engaged."
**Why it matters:** On a civic-news site, an outraged tweet-click that bounces in 7 seconds is worth less than a quiet reader who finishes the piece. Engagement is a leading indicator of return visits, newsletter signups, and word-of-mouth. Morning Brew's team has internally tracked "attention minutes" as a proxy for revenue-per-reader since at least 2021; the logic applies at our scale too.
**90-day target:** 35% engagement rate across the top 10 articles of the quarter. (The Reuters Institute 2026 trends report pegs engaged-session rates for small digital publishers in the 25–40% band.)
**Decision it drives:** Which article _formats_ work. If engagement on vote-explainer pieces is 45% and on hot-take opinion pieces is 18%, write more explainers. If "scroll depth 75%" drops off a cliff at a specific section, that section is where you're losing people.

### 1.2 Read-Through (finish rate)
**Definition:** % of sessions that fire the `article-finished` event (scrolled to last paragraph, dwell ≥ 60s on footer). Different from engagement — finish rate measures whether the _ending_ is reached.
**Why it matters:** Our CTAs (newsletter signup, "Find my MP", sources list) live at the bottom. If only 12% of readers reach the footer, moving the CTA up is worth more than rewriting it.
**90-day target:** 20% finish rate. Benchmark: 404 Media and similar reader-supported newsrooms report 15–25% on long-form.
**Decision it drives:** CTA placement, article length, whether to add a TL;DR card at the top.

### 1.3 Email Conversion Rate
**Definition:** `newsletter signups / unique article readers that week`. Track with a tagged `newsletter-subscribed` event fired on Resend's confirmation webhook, divided by weekly unique sessions.
**Why it matters:** Email is the only channel we own. X/Bluesky/Google can deplatform us tomorrow; the list cannot. Newsletter conversion is the single clearest proxy for "does this site build an audience or just get traffic?" Morning Brew achieved 47% open rate and 15% CTR at scale, but the _growth_ metric that built them was conversion rate — readers-to-subscribers — which they pushed past 2% in their early years.
**90-day target:** 1.5% of unique weekly readers convert to email. Once we pass 2%, we're in the top quartile for reader-supported news.
**Decision it drives:** Whether CTAs are working, whether lead magnets (e.g., a "Weekly Parliament Brief") are worth producing, whether to add an exit-intent modal.

### 1.4 Return-Visitor Rate (30-day)
**Definition:** % of sessions in a week from visitors who have visited in the prior 30 days (Umami provides this natively as "returning visitors").
**Why it matters:** The single biggest difference between a viral flash-in-the-pan and a sustainable publication is whether readers _come back_. The Reuters Institute's 2026 predictions explicitly name "habit formation" as the decisive 2026 KPI. A site with 40% returning visitors at 5,000 sessions/week is worth ten times one with 8% returning at 50,000/week.
**90-day target:** 25% returning-visitor rate. (Canadaland and similar independents sit around 30–45%; we start lower because we're new.)
**Decision it drives:** Frequency of posting, whether to add a running "Vote of the Week" recurring format readers come back for, push-notification strategy.

### 1.5 Search Visibility (Google Search Console clicks)
**Definition:** Organic clicks from Search Console, segmented by branded (`parliament audit`, `parliamentaudit.ca`) vs non-branded (`bill c-22`, `floor crossing canada`) queries.
**Why it matters:** Non-branded organic search is the only traffic source that compounds without ongoing effort. Every article indexed for "what is bill c-22" is a long-tail asset. Social decays in hours; SEO decays in years. For a civic-news site with evergreen explainer content, this is the highest-leverage channel.
**90-day target:** 500 non-branded clicks/month; top 10 position for 15 distinct queries. Note: position-1 organic CTR has dropped 32% YoY in 2026 because of AI Overviews, so we optimize for _impressions_ and _presence in AI Overviews_, not just blue-link CTR.
**Decision it drives:** Which bills/topics to write explainers on next (pick queries with high impressions but no ranking). Title and meta-description rewrites for pages with impressions but weak CTR.

---

## 2. Vanity Metrics to Ignore

These numbers feel good and tell you nothing useful at our scale. Do not build dashboards around them. Do not celebrate them on X.

- **Raw pageviews.** A 50,000-pageview spike from one Reddit link is indistinguishable from 50,000 engaged readers in Umami's top-line number. Pageviews without engagement context mislead you into thinking a viral-bait headline is a content strategy. Only look at pageviews _relative to_ engagement rate.
- **Single-story traffic spikes.** One story hitting r/CanadaPolitics can quadruple your monthly traffic. That number will not repeat. Decisions made on peak-week data ("we should write more like this!") ignore that 98% of that traffic bounced. Judge weeks by _median_ performance, not peaks.
- **Session duration without context.** Umami reports "average session duration." This number is corrupted by (a) users who leave a tab open, (b) bot traffic, (c) one outlier who reads every article. Use engagement events (§3) instead.
- **Bounce rate in isolation.** A "bounce" on an article page where the reader read the whole thing and left satisfied is a _good_ outcome. Bounce rate only matters when paired with scroll depth.
- **Social-platform follower counts.** Follower count doesn't convert. Click-through rate on posts (§4.2) does. 2,000 followers who click is worth 20,000 who don't.
- **Twitter/Bluesky "impressions."** Platform-reported impression numbers are inflated and non-comparable. Use _clicks_ (UTM-tagged) as the only trustworthy social metric.

Rule of thumb: if a number only goes up, it's vanity. If a number can go down when you make a mistake, it's a KPI.

---

## 3. Events to Tag in Umami

Umami out of the box tracks pageviews, referrers, country, device, browser. To measure the KPIs above, we need custom events. Add the following `window.umami.track()` calls to the Next.js app (`apps/web`).

Umami's tracker exposes a global `umami` object once the script is loaded. Wrap all calls in a feature-check so SSR and ad-blockers don't throw.

```ts
// apps/web/lib/analytics.ts
export function track(event: string, props: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.umami?.track !== 'function') return;
  try {
    window.umami.track(event, props);
  } catch {
    // swallow — analytics must never break the page
  }
}
```

### Events to add

| Event name | Fires when | Props to capture |
|---|---|---|
| `newsletter-subscribed` | Resend confirms subscription (on the confirm-email landing page) | `source` (article slug / footer / modal), `campaign` (utm_campaign if set) |
| `find-my-mp-submitted` | User submits postal code on the MP lookup form | `postal_prefix` (first 3 chars only — FSA, not full code), `result_found` (bool) |
| `outbound-social` | Click on X/Bluesky icons in site chrome | `platform` (`x` / `bluesky`), `location` (`header` / `footer` / `article`) |
| `outbound-source` | Click on any citation link in an article | `article_slug`, `source_domain`, `position` (1-indexed) |
| `article-share` | Click on any share button | `article_slug`, `platform` (`x` / `bluesky` / `copy` / `email`) |
| `read-more-at-source` | Click on the "Read the full bill on ourcommons.ca" link | `article_slug`, `source_domain` |
| `article-engaged` | Scroll depth ≥ 75% AND ≥ 90s on page (debounced, fires once) | `article_slug`, `word_count` |
| `article-finished` | Footer of article in viewport ≥ 60s | `article_slug` |

### Example implementations

**Newsletter signup (Resend confirm page):**
```tsx
// apps/web/app/subscribe/confirmed/page.tsx
'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { track } from '@/lib/analytics';

export default function ConfirmedPage() {
  const params = useSearchParams();
  useEffect(() => {
    track('newsletter-subscribed', {
      source: params.get('source') ?? 'unknown',
      campaign: params.get('utm_campaign') ?? 'organic',
    });
  }, [params]);
  return <main>Thanks — you're subscribed.</main>;
}
```

**Outbound source clicks (applied via a wrapped `<Link>`):**
```tsx
// apps/web/components/SourceLink.tsx
'use client';
import { track } from '@/lib/analytics';

export function SourceLink({ href, slug, position, children }: {
  href: string; slug: string; position: number; children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('outbound-source', {
        article_slug: slug,
        source_domain: new URL(href).hostname,
        position,
      })}
    >
      {children}
    </a>
  );
}
```

**Engagement (scroll + dwell) — one hook reused across all article pages:**
```tsx
// apps/web/hooks/useArticleEngagement.ts
'use client';
import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';

export function useArticleEngagement(slug: string, wordCount: number) {
  const fired = useRef({ engaged: false, finished: false });
  useEffect(() => {
    const start = Date.now();
    const onScroll = () => {
      const depth = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      const dwell = (Date.now() - start) / 1000;
      if (!fired.current.engaged && depth >= 0.75 && dwell >= 90) {
        fired.current.engaged = true;
        track('article-engaged', { article_slug: slug, word_count: wordCount });
      }
      if (!fired.current.finished && depth >= 0.97 && dwell >= 60) {
        fired.current.finished = true;
        track('article-finished', { article_slug: slug });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const id = setInterval(onScroll, 5000); // catch users who stop scrolling but keep reading
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(id); };
  }, [slug, wordCount]);
}
```

**Never** pass PII (email, full postal code, name) to Umami. Props are stored in cleartext on our self-hosted DB.

---

## 4. What Umami Doesn't Track — and What to Add

Umami is a pageview-and-events tool. It does not see search queries before the click, email engagement after the click, or RSS subscribers at all. Four supplementary systems cover those gaps.

### 4.1 Google Search Console + Bing Webmaster Tools (**critical**)
Umami only sees visitors after they land. Search Console sees them _before_ — which queries, which impressions, which positions. For an evergreen explainer site, this is the single most valuable tool after Umami.

**Setup (30 minutes):**
1. Go to [search.google.com/search-console](https://search.google.com/search-console), add `parliamentaudit.ca` as a Domain property.
2. Verify via Porkbun DNS TXT record (copy the string Google gives, paste into Porkbun DNS).
3. Submit `https://parliamentaudit.ca/sitemap.xml` under Indexing → Sitemaps.
4. Repeat for [bing.com/webmasters](https://www.bing.com/webmasters) (Bing's share is small but free signal, and it powers ChatGPT Search + DuckDuckGo).
5. Grant access to any contributors via Settings → Users and permissions.

**What to watch weekly in Performance → Search results:**
- Total non-branded clicks (KPI 1.5).
- Queries with ≥ 50 impressions and CTR < 2% → rewrite title/meta. 2026 CTR benchmarks: position 1 without AI Overviews = 35–40%; with AI Overviews present = 15–20%.
- New queries appearing in the top 20 positions — these are content expansion opportunities (write a dedicated piece).
- Pages with declining average position week-over-week — indicates a newer competitor or stale content.

**Gotcha:** Search Console data is delayed ~48 hours. Don't panic on Mondays.

### 4.2 UTM tagging on every social post
Umami shows `bsky.app` and `x.com` as referrers but can't distinguish _which post_ drove the click. Fix by auto-appending UTMs in our posting scripts.

Add to `scripts/post-to-bluesky.ts` and `scripts/post-to-x.ts`:

```ts
// scripts/lib/utm.ts
export function withUtm(url: string, opts: {
  source: 'bluesky' | 'x';
  campaign: string;      // e.g. 'bill-c22' — usually the article slug
  content?: string;      // e.g. 'tweet-1' — distinguish posts in a thread
}): string {
  const u = new URL(url);
  u.searchParams.set('utm_source', opts.source);
  u.searchParams.set('utm_medium', 'social');
  u.searchParams.set('utm_campaign', opts.campaign);
  if (opts.content) u.searchParams.set('utm_content', opts.content);
  return u.toString();
}
```

Then in `post-to-bluesky.ts`, replace the raw `tweet.url` with:
```ts
import { withUtm } from './lib/utm';

const tracked = withUtm(tweet.url, {
  source: 'bluesky',
  campaign: tweet.url.split('/news/')[1] ?? 'homepage',
  content: `post-${tweet.id}`,
});
// use `tracked` when building the RichText / embed
```

Umami's Referrers report will then show `utm_campaign=bill-c22` + `utm_content=post-3`, letting us rank which _posts_ (not just platforms) drive engaged traffic.

### 4.3 Resend email engagement
Resend has open + click tracking built in but it lives in their dashboard, not ours. Two levels of integration:

**Level 1 (10 minutes, do this now):** Enable open + click tracking in Resend → Domains → parliamentaudit.ca → Tracking. Check the Resend dashboard weekly for open rate (target 40%+, Morning Brew tier is 47%) and click rate (target 5%+).

**Level 2 (half-day, do when list > 500):** Add a Resend webhook pointing to `https://parliamentaudit.ca/api/webhooks/resend`. Store events (`email.sent`, `email.delivered`, `email.opened`, `email.clicked`, `email.bounced`) in a Postgres table; surface in the admin app. This lets us (a) A/B test subject lines, (b) identify cold subscribers (no opens in 60 days) for re-engagement, (c) alert on bounce spikes indicating deliverability problems.

```ts
// apps/web/app/api/webhooks/resend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyResendSignature } from '@/lib/resend';

export async function POST(req: NextRequest) {
  const body = await req.text();
  if (!verifyResendSignature(req.headers, body)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const evt = JSON.parse(body);
  await db.emailEvent.create({
    data: {
      type: evt.type,            // e.g. 'email.opened'
      emailId: evt.data.email_id,
      to: evt.data.to?.[0],
      subject: evt.data.subject,
      campaign: evt.data.tags?.find((t: any) => t.name === 'campaign')?.value,
      occurredAt: new Date(evt.created_at),
    },
  });
  return NextResponse.json({ ok: true });
}
```

### 4.4 RSS feed + subscriber count
We don't publish RSS yet. We should — it's the lingua franca of news readers (Feedly, Inoreader, NetNewsWire) and, increasingly, AI agents ingesting news.

**Add `/rss.xml`:** generate from the same data source as the homepage feed in `apps/web`. Include full content, not summaries, so readers don't need to click through (this trades pageviews for trust, which is the right trade for us).

**Count subscribers:** RSS readers identify themselves in the User-Agent (`Feedly/1.0 (...; 1247 subscribers; ...)`). Parse the subscriber count out of UA strings in a middleware and log to Umami as a `rss-poll` event with `reader` and `subscribers` props. Alternative: route `/rss.xml` through [feedpress.com](https://feedpress.com) ($2/mo) for a unified count.

### 4.5 Newsletter platform migration (if)
If we move the newsletter off Resend to Substack or Beehiiv for growth-network effects:
- Both expose open/click rate natively. Substack also surfaces "recommendations" (cross-promotion) as a growth lever — track referred-subscribers as a distinct source.
- Beehiiv has a Boosts marketplace (paid acquisition per verified subscriber) — measure LTV vs CAC before scaling.
- Export list monthly regardless of platform. We own the list, not them.

---

## 5. Weekly Review Routine (15 minutes, Monday 9am)

Ritualize this. Put it in the calendar. Skipping weeks is how metrics become vanity.

- [ ] **Umami → Dashboard (2 min):** Top 5 referrers this week vs last week. Which social post, which search query, which external link drove traffic? Anything surprising?
- [ ] **Umami → Pages (2 min):** Top 3 articles by engaged sessions (not pageviews). Which formats worked? Any old articles resurging — a sign of a news cycle to ride.
- [ ] **Umami → Events (2 min):** `newsletter-subscribed` count this week. Calculate conversion = subs / unique sessions. Trending up or down?
- [ ] **Search Console → Performance (3 min):** Total clicks WoW. Any query with > 100 impressions and CTR < 2% — flag for title rewrite. Any page with rank dropping from top 10 to 11–20 — flag for refresh.
- [ ] **Resend Dashboard (2 min):** Last newsletter's open rate and click rate vs the rolling 4-issue average. Bounce rate — if > 3%, investigate deliverability.
- [ ] **Social clicks (2 min):** Umami Referrers filtered to `utm_source=bluesky` + `utm_source=x`. Click-count per post. Which post formats are converting?
- [ ] **Return-visitor rate (1 min):** Umami reports this. Is it trending up WoW? If flat for 4 weeks, publishing cadence or topic mix needs review.
- [ ] **Action notes (1 min):** Write 2–3 sentences in `content/weekly-review.md`. "Bill C-22 piece hitting — write follow-up. Finish rate on budget piece was 8% — test TL;DR at top next time."

**Monthly (first Monday of the month, add 15 min):** review the experiment log (§6), kill what didn't work, pick next experiment.

---

## 6. Growth Experiments to Run in Months 1–3

Each experiment has a hypothesis, a success metric, a run duration, and a kill criterion. Run one at a time to avoid confounding; only parallelize if they touch different surfaces (e.g. email and on-site).

### Experiment 1 — "Sources" section placement (weeks 1–2)
**Hypothesis:** Moving the Sources list from bottom to a collapsible card at the top of articles will increase read-through by signalling rigor upfront without displacing the reader.
**Measure:** `article-finished` rate on articles A (sources-top) vs articles B (sources-bottom). Split by article, not by user.
**Run:** 2 weeks, 4 articles each arm.
**Kill if:** Finish rate drops >5pp on sources-top — revert immediately.

### Experiment 2 — Newsletter CTA timing (weeks 2–4)
**Hypothesis:** A mid-article inline CTA (after the 2nd H2) will convert better than only a footer CTA, because many readers never reach the footer.
**Measure:** `newsletter-subscribed` event with `source` prop (`inline` vs `footer`). Conversion rate per surface.
**Run:** 3 weeks. A/B via Next.js middleware assigning cohort by cookie.
**Kill if:** Inline CTA causes finish-rate drop >8pp (reader felt interrupted).

### Experiment 3 — "Vote of the Week" recurring format (weeks 3–8)
**Hypothesis:** A consistent Friday explainer of the single most important vote that week will drive return-visitor rate above 30% within 6 weeks, because readers build a habit.
**Measure:** Return-visitor rate WoW. Also: direct-traffic sessions on Fridays (habitual readers bookmark).
**Run:** 6 weeks minimum. Habit loops take ~4 weeks to form.
**Kill if:** Engagement rate on Friday pieces < 20% by week 4 — format isn't landing.

### Experiment 4 — Bluesky posting cadence (weeks 4–6)
**Hypothesis:** 3 posts/article (hook, detail, call-to-action) will drive 2x the clicks of 1 post/article, without hurting follower retention, because Bluesky's chronological timeline rewards frequency.
**Measure:** UTM-tagged clicks per article from Bluesky. Follower delta weekly.
**Run:** 2 weeks at 1-post baseline, 2 weeks at 3-post treatment.
**Kill if:** Follower attrition > 2%/week or engagement rate on posts drops >50%.

### Experiment 5 — Explainer-first SEO push (weeks 6–12)
**Hypothesis:** Publishing a dedicated explainer page for every active bill (even low-profile ones) will capture long-tail search before legacy outlets, because our bill-tracking data pipeline can ship them faster.
**Measure:** Non-branded Search Console clicks; number of queries ranking top 10.
**Run:** 6 weeks; ship 2 explainers/week targeting bill numbers with ≥ 10 monthly searches.
**Kill if:** After 6 weeks, fewer than 3 explainers rank top 20 — indicates a domain-authority problem, not a content problem, and we need backlink work first.

Log each experiment in `content/experiments.md`: hypothesis, start date, end date, result, decision (keep / kill / iterate).

---

## Appendix — Dashboard shortcuts

- Umami: https://umami-production-d170.up.railway.app (website ID `5f53d939-6497-4408-b9b6-b1132dad57fc`)
- Search Console: https://search.google.com/search-console (after verification)
- Bing Webmaster: https://www.bing.com/webmasters
- Resend: https://resend.com/emails
- Railway project: services listed in `memory/project_railway_services.md`

## Appendix — Further reading

- [How Morning Brew Improved Email Open Rates by 125%](https://www.campaignmonitor.com/blog/customers/how-morning-brew-improved-email-open-rates-by-125/)
- [Umami — Track events](https://docs.umami.is/docs/track-events)
- [Reuters Institute — Journalism trends and predictions 2026](https://reutersinstitute.politics.ox.ac.uk/journalism-media-and-technology-trends-and-predictions-2026)
- [Nieman Lab — Newsroom culture beyond pageviews](https://www.niemanlab.org/2019/03/how-to-build-a-newsroom-culture-that-cares-about-metrics-beyond-pageviews/)
- [2026 KPIs for publishers — Lineup](https://lineup.com/2026-kpis-for-publishers-keep-kill-or-redefine/)
- [Google CTR by search position 2026 — WeAreTG](https://www.wearetg.com/blog/google-ctr-by-position/)
- [Resend — Capture email events with Webhooks](https://resend.com/blog/webhooks)
