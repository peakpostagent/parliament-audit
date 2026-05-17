# Day 5 (Fri) — Europe tried this. The highest court struck it down.

**Slug:** `bill-c-22-europe-data-retention-directive-struck-down`
**Category:** `Legislation`
**Angle:** the comparative-democracy precedent piece. The European
Court of Justice ruled in 2014 that a nearly identical mandatory
data-retention directive violated fundamental rights and was invalid.
The ruling does not bind Canadian courts but is highly persuasive
authority and a clear cautionary tale.

## Headline

> The European Court of Justice Already Struck Down a Law Like Bill C-22. Here Is What It Found.

## Subheadline

> In April 2014, the EU's highest court invalidated the Data Retention Directive — a law that required ISPs to retain user metadata for six months to two years. The court found the retention was "particularly serious" interference with fundamental rights and not "limited to what is strictly necessary." The directive's retention period and category of data are nearly identical to what Bill C-22 proposes for Canada.

## Smart Brevity

- **bigThing**: In 2014, the European Court of Justice struck down the EU Data Retention Directive — a mandatory metadata-retention scheme almost identical to Bill C-22 — as a disproportionate violation of fundamental rights.
- **whyItMatters**: The CJEU ruling is the most authoritative judicial test of mandatory mass metadata retention in any peer democracy. Its reasoning is directly applicable to Canada's Charter analysis.
- **goDeeper**:
  - The Directive required 6 months to 2 years of retention; C-22 says up to 1 year.
  - The Directive covered phone numbers, IP addresses, location data, traffic data; C-22 covers transmission data, device identifiers, and location.
  - The CJEU found the Directive "particularly serious interference with fundamental rights to private life and protection of personal data."
  - The Court found legitimate aim (fighting serious crime) but failed proportionality test.
  - Member states have spent the 11 years since the ruling rewriting their data-retention laws.
- **yesBut**: The Charter of the European Union is not the Canadian Charter. Canadian courts are not bound by CJEU rulings. The bill's defenders point to differences in the Canadian access-threshold and warrant regime.
- **bottomLine**: The CJEU's reasoning is highly persuasive authority. Future Canadian Charter litigants will cite Digital Rights Ireland prominently. The bill's drafters either expect the legislation to be tested in court and survive, or expect it not to be tested at all.

## Sections (outline)

1. **The Digital Rights Ireland case** — DRI (an Irish digital-rights NGO) brought the original complaint. The Austrian complaint (Kärntner Landesregierung) was merged. The CJEU heard them together as C-293/12 and C-594/12.

2. **What the EU directive required** — quote from the CJEU summary: phone numbers (caller, receiver), date/time/duration, IP addresses, device identifiers, location data sufficient to determine where the user was during a communication. Six months to two years of retention. Mandatory for all ISPs/telcos.

3. **The CJEU's reasoning** — quote the ruling: "particularly serious interference" with private-life rights under Article 7 and personal-data rights under Article 8 of the EU Charter. The court accepted that fighting serious crime is a legitimate aim. But the directive failed proportionality because:
   - The retention applied to all persons without distinction.
   - There was no relationship between the data and the threat addressed.
   - There were insufficient safeguards on access.
   - The retention period was not differentiated by category of data or by threat profile.

4. **The Canadian comparison** — side-by-side: EU directive vs. Bill C-22. Same retention category (transmission/traffic metadata). Comparable retention duration (1 year on the lower bound of EU vs. exactly 1 year for C-22). Comparable absence of differentiated retention (all users, all data). Different access threshold (Canada requires production order with "reasonable grounds to suspect" — Geist notes that's a weaker threshold than under the previous regime).

5. **How EU member states responded** — most rewrote their data-retention laws to be narrower and more targeted. Some (Sweden, Germany) had national courts strike down their domestic implementations. The European Parliament has not attempted to re-introduce a directive.

6. **Why this matters for Canadian Charter analysis** — Section 8 of the Canadian Charter protects against "unreasonable search and seizure" and has been interpreted by the Supreme Court in *R v Spencer* (2014) to cover subscriber metadata. *Spencer* held that Canadians have a reasonable expectation of privacy in their internet-subscriber data. C-22 is the first federal bill to test what a mandatory retention regime under the post-Spencer Charter looks like.

7. **What the bill's defenders would say** — fair-rendering paragraph. The Canadian access threshold under C-22 is not warrantless. The Intelligence Commissioner review provides a layer the CJEU directive did not have. The retention scope is narrower in some respects (no web browsing, no content).

8. **What Charter litigants will likely argue** — the CJEU's proportionality analysis applies almost word-for-word. The "particularly serious interference" language has Canadian analogues in *Spencer* and *R v Vu*. The "all users without distinction" critique is structurally identical to what C-22 proposes.

## Required sources

- CJEU press release on Digital Rights Ireland, April 8 2014: <https://curia.europa.eu/site/upload/docs/application/pdf/2014-04/cp140054en.pdf>
- Global Freedom of Expression case summary: <https://globalfreedomofexpression.columbia.edu/cases/ecj-digital-rights-ireland-ltd-v-minister-for-communications-marine-and-natural-resources-c%E2%80%9129312-and-c%E2%80%9159412-2014/>
- EFF reporting on the ruling: <https://www.eff.org/node/81899>
- Wikipedia (Digital Rights Ireland case): <https://en.wikipedia.org/wiki/Digital_Rights_Ireland>
- Oxford Academic — "Telecommunications data retention after Digital Rights Ireland": <https://academic.oup.com/ijlit/article/23/3/290/783843>
- *R v Spencer*, 2014 SCC 43.

## Companion posts

### Bluesky

```
In 2014, the European Court of Justice struck down the EU's mandatory metadata-retention directive.

Same category of data (transmission, location, device). Comparable retention period (6 months–2 years; C-22 proposes 1 year).

The Court called it a "particularly serious" rights interference.
```

(approx 290 chars — needs slight trim)

### X

```
In 2014, the European Court of Justice struck down the EU's mandatory metadata-retention directive.

Same data category. Same retention duration. The Court called it a "particularly serious" rights interference.

Canada is now proposing the same scheme.
```

(approx 251 chars)

### imageMode

`stat` — hero "2014" or "Particularly serious interference" pull-quote. Or `quote` mode with `imageQuote: "Particularly serious interference with fundamental rights."` · `imageAttrib: "European Court of Justice, Digital Rights Ireland (2014)"` · `imageContext: "On the EU Data Retention Directive — a nearly identical scheme to what Bill C-22 proposes."`

## Status

Outline. Strongest piece of the series — single authoritative precedent
from a peer democracy. On publish day, finish the prose + confirm
the section references in C-22 align with the EU comparison.
