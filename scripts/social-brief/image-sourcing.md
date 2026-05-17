# Image Sourcing Workflow

Per operator decision 2026-05-16: when drafting a new article that
would meaningfully benefit from a real photograph (scene, building,
event, person), spend up to ~3 minutes searching legitimate sources
in priority order. If nothing licensable turns up, fall back to our
generated stat / headline / comparison OG card.

**Adding "📷 credit" to a stolen photo does not make the use legal.**
This is the most common misconception and the one that gets civic-
media accounts publicly accused of theft. The workflow below exists
to avoid that without giving up on real images entirely.

## When to bother

| Does a photo add something the text + stat card don't? | Action |
|---|---|
| Yes — site/scene contrasts ("$20M for a concrete slab"), faces of named people, place identification | Run the search |
| Marginal — a pretty backdrop with no information value | Skip, stat card is fine |
| No — chart territory, poll splits, vote tallies, legal text | Skip, stat card is the right answer |

The default is **skip**. Real photos are an enhancement, not a requirement.

## Priority order (search top → bottom, stop on first hit)

### 1. Wikimedia Commons

<https://commons.wikimedia.org/wiki/Special:Search>

Search the most specific subject term first ("Marilyn Gladu", "Spaceport
Nova Scotia", "Canso Nova Scotia"), then broaden. Filter by license if
the UI offers it — accept **CC0, CC-BY, CC-BY-SA, PD**, reject "fair
use" or "non-commercial only."

Attribution format:
```
📷 Photo: <photographer or "Wikimedia Commons contributor"> · <license, linked>
```

### 2. Flickr — Creative Commons filter

<https://www.flickr.com/search/?advanced=1>

Tick "All creative commons" + "Commercial use allowed" + "Modifications
allowed". Reject NC (non-commercial) and ND (no-derivatives) — they make
re-cropping risky.

Attribution format:
```
📷 Photo: <photographer username on Flickr> · <license, linked to source>
```

### 3. Crown copyright — Government of Canada

Federal-government photos from press releases are governed by the
[Open Government Licence — Canada (2.0)](https://open.canada.ca/en/open-government-licence-canada).
Use is permitted with attribution. Check:

- The relevant Canada.ca news release for attached photos
- DND (National Defence) media advisories
- Parliament of Canada multimedia
- House of Commons MP-portrait service at
  `ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/45/`
  (already wired into `subjects[].portraitUrl`)

Attribution format:
```
📷 Photo: Government of Canada, [Department name], [release date]
   (Open Government Licence — Canada 2.0)
```

### 4. Direct ask — indie journalists

If we've already cited an indie journalist's reporting and they have
the one defining photo nobody else does, email them. Two-sentence ask,
link to our article, offer credit + link back. Realistic reply rate is
high; the use is small and the credit drives traffic to them.

Template:

> Subject: Photo licensing for a Parliament Audit post citing your reporting
>
> Hi [Name] — We cited your [date + topic] piece in our Parliament Audit
> breakdown ([article link]). Would you license one of your photos for a
> single Bluesky + X post + the article page, with credit + a link back
> to your piece? Credit goes in image alt text and post body — your call
> on phrasing.
>
> — Alex Croft

### 5. Skip — fall back to the stat card

If 1–4 yield nothing, ship without a real photo. The generated
1200×1200 stat card is already on-brand and risk-free. Do **not**
fall back to:

- Pulling from a paywalled outlet without permission (Halifax Examiner,
  Globe and Mail, CBC, Maclean's, La Presse). Fair dealing is technically
  available for news reporting but the platform-takedown risk + the
  brand-trust risk are too high.
- AI-generated illustrations *of real places or events*. They're
  by-definition misleading because the model invents details.
- Generic stock that has nothing to do with the actual subject.

## What never works as a license

| Mistake | Why it's not enough |
|---|---|
| "📷 Photo: CBC News" credit on a copyrighted CBC photo | Attribution alone is not a license |
| "We cited their article, so we can use their photo" | Citation is for text/quotes; images are separately licensed |
| "We linked back to the original" | Backlinks aren't a copyright clearance |
| "It's been retweeted thousands of times" | Doesn't grant anyone else a license |
| "It came up in Google Image Search" | Search indexing isn't licensing |

## Required when we DO use an image

1. **Inline credit** in the post body (Bluesky + X) where space allows,
   otherwise in the article body caption.
2. **Image alt text** that includes the photographer and license. Always.
3. **Article-page attribution** under the image (rendered).
4. **Link back to the original source** when one exists (Wikimedia file
   page, Flickr source, government release URL).

## For platforms that don't allow alt-text or captions

X allows alt text on uploaded images — always populate it.
Bluesky allows alt text on attached images — always populate it.
Mastodon allows alt text — always populate it.

If a platform truly doesn't, push the credit into the body text.

## Schema note (open follow-up)

`apps/web/src/content/news-articles.ts` currently supports a
`subjects[].portraitUrl` for person-focused articles. It does NOT
support a generic hero-photo field (top-of-article scene photo with
caption + credit). If we start pulling in real images per this
workflow at any meaningful volume, we'll want to add a structured
`hero?: { url, alt, credit, licenseUrl, sourceUrl }` field to the
NewsArticle interface and render it above the Smart Brevity block.
Defer that until we have ~3 articles where it actually matters.
