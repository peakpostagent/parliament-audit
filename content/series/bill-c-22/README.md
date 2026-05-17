# Bill C-22 — 7-day series runbook

**Status as of 2026-05-17:** Bill C-22 (Lawful Access Act, 2026) passed
second reading on **April 20, 2026**. Now at committee stage. Sponsor:
Public Safety Minister Gary Anandasangaree. With the Liberal majority,
the bill has a clear path to passage if committee makes only cosmetic
changes.

## The 7 articles

Numbered for the publish order, not the draft order. Each `day-N-*.md`
file in this folder is the staging draft. Conversion to a live
`apps/web/src/content/news-articles.ts` entry happens on the publish
day, after a news re-check.

| Day | File | Angle | Status |
|---|---|---|---|
| Mon | `day-01-second-reading-update.md` | Status piece: just passed second reading; what's in the bill; where it goes next | Drafted |
| Tue | `day-02-year-of-metadata.md` | Vivid concrete piece: what a year of YOUR metadata reveals | Outline |
| Wed | `day-03-privacy-commissioner-missing.md` | The OPC has no oversight role in C-22. That absence IS the story | Outline |
| Thu | `day-04-secret-orders.md` | The Public Safety Minister's secret capability-order power: walked through | Outline |
| Fri | `day-05-europe-tried-this.md` | Digital Rights Ireland (2014): EU CJEU struck down a nearly-identical retention scheme | Outline |
| Sat | `day-06-surveillance-abuses.md` | Documented Canadian surveillance overreach: Tommy Douglas, Indigenous land defenders, pipeline protesters | Outline |
| Sun | `day-07-action-third-reading.md` | What to do before third reading: contact MP, committee schedule, deadlines | Outline |

## The publish-day workflow

For each day in the series:

1. **News re-check (5 min).** Search Google News + LEGISinfo for any
   change to Bill C-22's status since the draft was written. Key
   triggers that change the article:
   - Bill amended in committee
   - Public Safety Minister statement
   - Privacy Commissioner submission published
   - Major opposition party statement
   - U.S. Judiciary Committee or U.S. State Department statement
   - Major-outlet editorial (Globe and Mail, CBC, La Presse)

2. **Update the staged article** if the news check turned anything up.
   Add a "Status update (May NN)" callout at the top. Refresh the
   tagline.

3. **Run Sonnet 4.6 proofread** on the article:
   ```bash
   npx tsx scripts/claude-proofread.ts \
     --text-file content/series/bill-c-22/day-NN-<slug>.md \
     --context "Bill C-22 week, day N of 7. <one-line angle>"
   ```
   Pay attention to BLOCK-level flags on framing risk, asymmetric
   comparison, and unsourced claim.

4. **Convert to news-articles.ts entry.** Paste the draft into the
   array (top of the file, most-recent-first). Set `publishedAt` to
   the current ISO timestamp.

5. **Commit + push.** Triggers Railway deploy.

6. **Wait for deploy (poll OG endpoint).** Confirm the article is live
   at `parliamentaudit.ca/news/<slug>` and the OG card renders.

7. **Post Bluesky.** Use `post-arbitrary-bluesky.ts --text-file
   content/series/bill-c-22/posts/day-NN-bsky.txt --slug <slug>
   --campaign c22-day-NN-<topic>`.

8. **Queue X mirror.** Edit `scripts/social-brief/x-mirror-queue.json`
   to prepend the day's X-version entry with `imageMode: 'stat'`.

9. **Fire mirror-queue-apply.** Verification module catches silent
   X failures and auto-retries (with image, then without image).

10. **Daily-ops cron auto-fires Mastodon mirror** within hours.

11. **Update this README** with status: `Drafted` → `Live YYYY-MM-DD`.

## Voice + sourcing rules

- Civil-liberties-coalition framing — pulls in privacy, libertarian,
  civil-libertarian-left, mainstream-Charter-rights, and technology-
  industry audiences simultaneously.
- Every factual claim sourced inline to the Hogue Commission text, Bill
  C-22 first-reading text, Charter statement, OPC submissions, Geist /
  Diab academic analysis, or CBC / Globe / National Observer reporting.
- No comparisons to communist dictatorships. The Friday and Saturday
  pieces use democratic-country and historical-Canadian parallels
  respectively — both of which are stronger because they're real and
  defensible.
- Mild value judgments allowed (per voice-playbook update 2026-05-17):
  "unusual," "the bill's most aggressive provision," "uniquely
  permissive" — fine. "Frivolous," "authoritarian," "tyranny" — not
  fine. Loaded language collapses our coalition.

## Authoritative sources (curated)

Primary documents:

- Bill C-22 first-reading text: <https://www.parl.ca/DocumentViewer/en/45-1/bill/C-22/first-reading>
- LEGISinfo C-22 status page: <https://www.parl.ca/legisinfo/en/bill/45-1/c-22>
- Government backgrounder (Public Safety Canada): <https://www.canada.ca/en/public-safety-canada/news/2026/03/backgrounder--securing-access-to-information-in-bill-c-22.html>
- Department of Justice — Bill C-22 Part 1 explainer: <https://www.justice.gc.ca/eng/csj-sjc/pl/c22/index.html>
- Department of Justice — Charter statement on C-22: <https://www.justice.gc.ca/eng/csj-sjc/pl/charter-charte/c22_2.html>

Expert analysis:

- Michael Geist — "A Tale of Two Bills" (the Part 1 analysis): <https://www.michaelgeist.ca/2026/03/a-tale-of-two-bills-lawful-access-returns-with-changes-to-warrantless-access-but-dangerous-backdoor-surveillance-risks-remains/>
- Michael Geist — "Unpacking Bill C-22's Expansive Metadata Retention": <https://www.michaelgeist.ca/2026/03/the-lawful-access-privacy-risks-unpacking-bill-c-22s-expansive-metadata-retention-requirements/>
- Robert Diab — "Ottawa Reboots Its Lawful Access Bill": <https://www.robertdiab.ca/posts/bill-c22/>
- Fasken (law firm analysis): <https://www.fasken.com/en/knowledge/2026/03/the-government-of-canada-introduces-bill-c22>

Civil-society opposition:

- Electronic Frontier Foundation — "Canada's Bill C-22 Is a Repackaged Version of Last Year's Surveillance Nightmare": <https://www.eff.org/deeplinks/2026/05/canadas-bill-c-22-repackaged-version-last-years-surveillance-nightmare>
- National Observer opinion piece: <https://www.nationalobserver.com/2026/05/14/opinion/online-privacy-digital-surveillance-canada>
- Meta's position statement: <https://about.fb.com/news/2026/05/metas-position-on-canadas-bill-c-22/>
- CBC News on C-22: <https://www.cbc.ca/news/politics/why-americans-noticing-canadian-security-bill-9.7199947>

Comparative-democracy precedent (Friday):

- Digital Rights Ireland v. Minister for Communications (CJEU C-293/12 and C-594/12, April 8 2014): <https://curia.europa.eu/site/upload/docs/application/pdf/2014-04/cp140054en.pdf>
- EFF on the DRI ruling: <https://www.eff.org/node/81899>
- Global Freedom of Expression case summary: <https://globalfreedomofexpression.columbia.edu/cases/ecj-digital-rights-ireland-ltd-v-minister-for-communications-marine-and-natural-resources-c%E2%80%9129312-and-c%E2%80%9159412-2014/>

Documented Canadian surveillance abuses (Saturday):

- CBC — "RCMP spied on Tommy Douglas, files reveal": <https://www.cbc.ca/news/canada/rcmp-spied-on-tommy-douglas-files-reveal-1.626622>
- CBC — "RCMP spies infiltrated the 1970s Indigenous rights movement": <https://www.cbc.ca/news/indigenous/rcmp-spies-1970s-indigenous-rights-9.7134112>
- CBC — "Indigenous activists, leaders in Manitoba were monitored as part of historic RCMP 'Native extremism program'": <https://www.cbc.ca/news/canada/manitoba/rcmp-intelligence-files-indigenous-leaders-activists-9.7140524>
- CBC — "RCMP commissioner regrets Indigenous spying program that spanned over a decade": <https://www.cbc.ca/news/politics/rcmp-response-indigenous-spying-operation-9.7141533>
- BCCLA "Protest Papers" on CSIS surveillance of Northern Gateway protesters: <https://www.straight.com/news/1263836/bc-civil-liberties-association-releases-protest-papers-showing-csis-surveillance>
- National Observer — "Spies in our midst: RCMP and CSIS snoop on green activists": <https://www.nationalobserver.com/2017/05/05/news/spies-our-midst-rcmp-and-csis-snoop-green-activists>
- The Narwhal — leaked RCMP "violent anti-petroleum extremists" document: <https://thenarwhal.ca/leaked-internal-rcmp-document-names-anti-petroleum-extremists-threat-government-industry/>

## What this is NOT

- An attack on the Liberal Party. Lawful-access bills have been pushed
  by Conservative governments too (Bill C-30 / Toews / 2012, withdrawn
  after coalition opposition). The series critiques the bill, not the
  partisan colour of the cabinet that tabled it.
- A claim that Canada is a dictatorship or trending toward one. The
  series uses ONLY democratic-country precedents (EU, UK) for legal
  comparisons and ONLY documented Canadian declassified abuses for
  historical comparisons.
- An opinion column. Every factual claim is sourced; the argument is
  carried by the contrast between what the bill enables and what the
  record shows happens when similar powers are granted.
