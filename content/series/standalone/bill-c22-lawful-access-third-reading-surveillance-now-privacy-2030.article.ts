/**
 * Standalone — Bill C-22, the Lawful Access Act, cleared committee,
 * report stage, AND third reading in the House of Commons in a single
 * day (June 18, 2026) and got first reading in the Senate the same
 * afternoon. The government capped clause-by-clause committee review
 * at 30 minutes. Meanwhile the companion privacy-PROTECTION bill (C-36)
 * delays actual reform to ~2030 and strips the independent Privacy
 * Commissioner of private-sector privacy. The frame: surveillance
 * fast-tracked now, privacy protection parked.
 *
 * Editorial floor:
 *   - Every claim sourced: LEGISinfo for the procedural timeline;
 *     Michael Geist (Univ. of Ottawa) for the "two heads," the metadata
 *     retention, the threshold, and the fast-track motion; JURIST/CBC
 *     for the witnesses (Dufresne, Apple, Signal/NordVPN, Chiefs of
 *     Police Carrique). "Two-headed surveillance monster," "comprehensive
 *     surveillance map," and "lowest investigative threshold" are GEIST'S
 *     characterizations and attributed to him, not asserted as fact.
 *   - No loaded language ("authoritarian," "Stasi," etc.). The process
 *     criticism (one-day passage, 30-min clause-by-clause, secret govt
 *     amendments) is documented procedure, stated plainly.
 *   - Balance: the Chiefs of Police defence is included in their own
 *     words ("overstated"; victims' right to safety and justice).
 *   - Status stated precisely: passed the HOUSE June 18, now at the
 *     Senate (first reading) — NOT yet law.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'bill-c22-lawful-access-act-third-reading-surveillance-now-privacy-2030',
  headline:
    'In a Single Day, the Lawful Access Bill Cleared Committee, Report Stage, and Third Reading. The Privacy Law Meant to Balance It Is Parked Until 2030.',
  subheadline:
    'On June 18, 2026, the House of Commons passed Bill C-22, the Lawful Access Act — compressing committee study, report stage, and third reading into one day, with clause-by-clause committee review capped at 30 minutes. It now sits in the Senate. The bill lowers the standard for police to compel a subscriber\'s identity to "reasonable grounds to suspect" and lets regulations require providers to retain a year of Canadians\' metadata. Its companion bill, C-36 — the one that\'s supposed to strengthen your privacy — won\'t take effect until roughly 2030 and hands the independent Privacy Commissioner\'s private-sector role to a new Cabinet-appointed commission. Surveillance now; protection later.',
  summary:
    'Bill C-22, the Lawful Access Act (full title: "An Act respecting lawful access"), passed third reading in the House of Commons on June 18, 2026 and received first reading in the Senate the same day. According to Parliament\'s own LEGISinfo record, committee consideration, report stage, and third reading all occurred on June 18 — the bill having been at first reading since March 12 and referred to committee on April 20. University of Ottawa law professor Michael Geist reported that the government limited clause-by-clause committee review to 30 minutes, after which remaining amendments were voted on with no further debate, and that government amendments were not publicly disclosed while opposition amendments — drawn from testimony by the Privacy Commissioner, bar associations, and security experts — were neither released nor debated. The bill lowers the threshold for compelling subscriber information to "reasonable grounds to suspect," which Geist describes as the lowest investigative standard in Canadian criminal law, down from "reasonable grounds to believe." It also authorizes regulations requiring providers to retain categories of metadata for up to one year, and to build interception capability. Privacy Commissioner Philippe Dufresne told committee on May 28 the wording could expose a subscriber\'s healthcare providers, lawyers, or financial institutions, and urged judicial warrants wherever Canadians retain a reasonable expectation of privacy. Apple, Signal, and NordVPN raised encryption objections, with Signal and NordVPN signalling they could exit Canada. The Canadian Association of Chiefs of Police president, Thomas Carrique, told committee the privacy concerns were "overstated" and that the debate should not overlook victims\' rights to safety and justice. C-22 is the standalone successor to the lawful-access provisions originally in the 2025 omnibus Bill C-2, the Strong Borders Act, whose broader warrantless powers were removed in October 2025 after backlash. Separately, Bill C-36 — the government\'s private-sector privacy modernization — is not expected to take effect until roughly 2030 and transfers private-sector privacy enforcement from the Privacy Commissioner of Canada to a new Cabinet-appointed Digital Safety and Data Protection Commission. This article documents what passed, how fast, who objected, and the gap between the speed of the surveillance bill and the delay on the privacy bill.',
  publishedAt: new Date().toISOString(),
  category: 'Accountability',
  tags: ['Bill C-22', 'lawful access', 'privacy', 'surveillance', 'metadata', 'encryption', 'Privacy Commissioner', 'Parliament', 'civil liberties'],
  readingTimeMinutes: 6,
  heroStat: { value: '1 day', label: 'committee, report stage & third reading — all June 18' },
  faq: [
    {
      question: 'What is Bill C-22, the Lawful Access Act?',
      answer:
        'Bill C-22 ("An Act respecting lawful access") is federal legislation governing how police and security agencies can compel information from telecom and internet providers. It lowers the legal threshold for obtaining a subscriber\'s identity to "reasonable grounds to suspect," and authorizes regulations requiring providers to retain categories of metadata for up to a year and to build interception capability. It passed third reading in the House of Commons on June 18, 2026 and is now before the Senate.',
    },
    {
      question: 'What does the "reasonable grounds to suspect" change actually mean?',
      answer:
        'To compel subscriber information, police would need only "reasonable grounds to suspect" — which University of Ottawa law professor Michael Geist describes as the lowest investigative threshold in Canadian criminal law — rather than the higher "reasonable grounds to believe." Privacy Commissioner Philippe Dufresne told committee the wording could expose sensitive details such as a subscriber\'s healthcare providers, lawyers, or financial institutions, and recommended judicial warrants wherever a reasonable expectation of privacy exists.',
    },
    {
      question: 'Does the bill threaten encryption?',
      answer:
        'Apple, Signal, and NordVPN told Parliament it could. Apple\'s position was that the bill would let the government force companies to weaken encryption by building in backdoors — something Apple said it would not do — and Signal and NordVPN indicated they could withdraw from the Canadian market. The bill\'s defenders, including the Canadian Association of Chiefs of Police, called the privacy and security concerns "overstated."',
    },
    {
      question: 'Is Bill C-22 law yet?',
      answer:
        'No. As of June 18, 2026 it has passed the House of Commons (third reading) and received first reading in the Senate. It must still clear second reading, committee, and third reading in the Senate, then receive Royal Assent, before becoming law. The Senate is where it can still be studied or amended.',
    },
  ],
  keyTakeaways: [
    'Bill C-22, the Lawful Access Act, passed third reading in the House of Commons on June 18, 2026 and went to the Senate the same day.',
    'Committee study, report stage, and third reading were all completed on June 18 — clause-by-clause review was capped at 30 minutes (per Michael Geist).',
    'It lowers the standard to compel a subscriber\'s identity to "reasonable grounds to suspect" — what Geist calls the lowest investigative threshold in Canadian law.',
    'It authorizes regulations requiring providers to retain up to a year of metadata and to build interception capability.',
    'Privacy Commissioner Philippe Dufresne, Apple, Signal, NordVPN, the Canadian Chamber of Commerce, and security reviewers objected; the Chiefs of Police called the concerns "overstated."',
    'C-22 is the standalone successor to the lawful-access parts of the 2025 omnibus Bill C-2 (Strong Borders Act), whose warrantless powers were dropped in October 2025.',
    'The companion privacy-protection bill, C-36, isn\'t expected to take effect until roughly 2030 — and moves private-sector privacy away from the independent Privacy Commissioner.',
  ],
  smartBrevity: {
    bigThing:
      'On June 18, 2026, the House of Commons passed the Lawful Access Act (Bill C-22) — running committee, report stage, and third reading through in a single day, with clause-by-clause review limited to 30 minutes. It\'s now in the Senate.',
    whyItMatters:
      'The bill lowers the bar for police to compel who you are online to "reasonable grounds to suspect," and lets regulations require providers to keep a year of your metadata. The privacy law meant to balance this — Bill C-36 — isn\'t slated to take effect until around 2030, and it removes the independent Privacy Commissioner from private-sector privacy. The surveillance side moved in a day; the protection side is years away.',
    goDeeper: [
      'Passed House third reading June 18, 2026; now at Senate first reading.',
      'Committee, report stage, third reading all on June 18; 30-min clause-by-clause cap (Geist).',
      'Threshold lowered to "reasonable grounds to suspect"; up-to-one-year metadata retention.',
      'Objectors: Privacy Commissioner Dufresne, Apple, Signal, NordVPN, Chamber of Commerce, security reviewers.',
      'Defenders: Chiefs of Police president Carrique — concerns "overstated," victims\' rights.',
      'Successor to lawful-access parts of 2025 omnibus C-2 (Strong Borders Act).',
    ],
    yesBut:
      'The government and police make a real argument: investigators say identifying anonymous accounts is essential in cases involving child exploitation and serious crime, and the Chiefs of Police told committee the privacy concerns were "overstated" and that victims\' right to safety can\'t be an afterthought. That case deserves a hearing — which is exactly the point of the process criticism. Compressing committee, report stage, and third reading into one day, capping clause-by-clause at 30 minutes, and not publicly disclosing the government\'s own amendments is not how a bill with this many flagged constitutional and security questions usually gets its hearing. The disagreement is legitimate; the speed is the story.',
    bottomLine:
      'C-22 isn\'t law yet — the Senate can still study and amend it. But the contrast is now on the record: Parliament moved a surveillance-powers bill from committee to passed-the-House in a single afternoon, while the privacy-protection bill that\'s supposed to balance it sits years from taking effect. Where your MP stood on the speed, and where your senators land next, is the accountability question.',
  },
  methodology:
    'The procedural timeline — first reading March 12, 2026; second reading and committee referral April 20; committee consideration, report stage, and third reading all on June 18; first reading in the Senate June 18 — is from Parliament of Canada\'s LEGISinfo record for Bill C-22 (45-1). The 30-minute clause-by-clause cap, the non-disclosure of government amendments, the "two heads" (metadata retention up to one year; interception/technical-capability mandate), and the "reasonable grounds to suspect" / "lowest investigative threshold" characterizations are reported and argued by University of Ottawa law professor Michael Geist and are attributed to him, not asserted as the site\'s own legal conclusions. Privacy Commissioner Philippe Dufresne\'s May 28 testimony, the Apple / Signal / NordVPN encryption objections, and Canadian Association of Chiefs of Police president Thomas Carrique\'s "overstated" testimony are from JURIST and CBC committee reporting. The Bill C-2 (Strong Borders Act) backstory — the 2025 omnibus, its warrantless information-demand powers reaching service providers broadly, and their removal in October 2025 — is from contemporaneous reporting and legal-firm summaries. The Bill C-36 details (private-sector privacy modernization, the roughly-2030 implementation timeline, and the transfer of private-sector privacy from the Privacy Commissioner to a new Cabinet-appointed commission) are from Geist\'s June 2026 analyses. We did not contact the government, the Privacy Commissioner, any provider, or any police service for this article; all of it is from on-record public sources cited below. This is a developing story: C-22 is before the Senate and its provisions could change.',
  sections: [
    {
      title: 'What happened on June 18',
      body: `In a single sitting day, **Bill C-22 — the Lawful Access Act** — went from committee to passed-the-House.\n\nAccording to Parliament's own [LEGISinfo](https://www.parl.ca/legisinfo/en/bill/45-1/c-22) record, three stages were completed on **June 18, 2026**: **committee consideration**, **report stage**, and **third reading**. The bill then received **first reading in the Senate** the same afternoon. It had been sitting at first reading since March 12 and was referred to committee on April 20 — and then the final stretch was done in a day.\n\nUniversity of Ottawa law professor **Michael Geist** reported that the government moved a motion **limiting clause-by-clause committee review to 30 minutes**, after which any remaining amendments were voted on **with no further debate, discussion, or questions to officials.** He also reported that the **government's own amendments were not publicly disclosed**, while **opposition amendments** — built from the testimony of the Privacy Commissioner, bar associations, and security experts — were neither released nor debated.\n\nThat's the procedural fact pattern. A bill with this many flagged constitutional and security questions cleared its last three Commons stages in one day, with the substance of the final amendments kept off the public record.`,
    },
    {
      title: 'What the bill actually does',
      body: `Strip away the procedure and two changes sit at the centre of the bill. Geist calls them the **"two heads"** of the legislation.\n\n**1. A lower bar to identify you.** To compel **subscriber information** — the records that tie an online account or device to a real person — the standard drops to **"reasonable grounds to suspect."** Geist describes this as the **lowest investigative threshold in Canadian criminal law**, a step down from the long-standing "reasonable grounds to believe." Privacy Commissioner **Philippe Dufresne** told committee on May 28 that the wording could reach **sensitive details** — a subscriber's **healthcare providers, lawyers, or financial institutions** — and urged that a **judicial warrant** be required wherever Canadians retain a reasonable expectation of privacy.\n\n**2. A year of retained metadata, and built-in interception.** The bill authorizes **regulations requiring providers to retain categories of metadata for up to one year** and to build the technical capability to intercept and extract authorized information. Metadata isn't the content of your messages — it's the **who, when, where, and how often.** Geist's warning is that, retained at scale, it amounts to "**a comprehensive surveillance map of virtually every Canadian.**"\n\nNeither head is the lurid "reading your texts" caricature. Both are quieter, and arguably more consequential: **who you are**, and **the pattern of everything you do**, made easier to obtain and required to be kept. We mapped the **metadata** mechanics and the **subscriber-information** history in our earlier coverage of this bill ([the metadata-retention piece](/news/bill-c-22-lawful-access-metadata-surveillance); [the surveillance-history piece](/news/bill-c-22-canadian-surveillance-history-tommy-douglas-pipeline-protesters)).`,
    },
    {
      title: 'Who tried to stop it — and who pushed it',
      body: `This was not a quiet bill. The list of objectors is unusually broad:\n\n- **The Privacy Commissioner of Canada**, Philippe Dufresne, who asked Parliament to **raise the threshold** and require warrants for anything carrying a reasonable expectation of privacy.\n- **Apple**, whose senior director for user privacy, Erik Neuenschwander, told Parliament the bill would let the government **"force companies to break encryption by inserting backdoors into their products, something Apple will never do."**\n- **Signal** and **NordVPN**, both of which indicated they could **leave the Canadian market** rather than comply.\n- **The Canadian Chamber of Commerce**, cybersecurity reviewers, and civil-liberties groups.\n\nThe bill also had a clear case made *for* it. **Thomas Carrique**, president of the **Canadian Association of Chiefs of Police**, told committee the concerns raised by telecoms and privacy advocates were **"overstated,"** and argued the debate should not focus only on privacy while overlooking **victims' rights to safety and justice.** Police have long said that identifying anonymous accounts is essential in serious cases, including child exploitation. That argument is real, and we're not waving it away.\n\nThe backstory matters too. C-22 is the **standalone successor** to the lawful-access provisions originally buried in the 2025 omnibus **Bill C-2, the Strong Borders Act.** That earlier version included **warrantless information-demand powers** so broad they would have reached **anyone providing a service in Canada — including physicians and lawyers** — and the government **removed them in October 2025** after a backlash. The bill that passed this week is the narrowed second attempt. ([We covered the Privacy Commissioner's missing oversight role here.](/news/bill-c-22-privacy-commissioner-no-oversight-role))`,
    },
    {
      title: 'Surveillance now, privacy in 2030',
      body: `Here's the contrast worth holding onto.\n\nThe same government advancing C-22 has a **privacy-protection** bill, **C-36** — meant to modernize Canada's 25-year-old private-sector privacy law, with new child-data protections, AI rules, and penalties up to $10 million or 3% of global revenue. On paper, it's the counterweight: more surveillance power for the state, more privacy rights for the citizen.\n\nBut the timing doesn't match. By Geist's reading, **C-36 isn't expected to take effect until roughly 2030** — a year for passage, eighteen months to stand up the regulator, two more for it to build expertise. And it **moves private-sector privacy enforcement away from the independent Privacy Commissioner of Canada** to a **new, Cabinet-appointed commission** that also polices online content — what Geist calls a step **"unprecedented among peer countries."**\n\nSo the scoreboard, as of this week, reads like this: the bill that **expands the state's reach** moved from committee to passed-the-House **in a single day.** The bill that's supposed to **expand your protection** is **years from taking effect** and **removes the one independent privacy watchdog** Canadians have had. You don't have to oppose lawful access to notice the asymmetry in **which half got the fast lane.**\n\nC-22 isn't law yet — it's at the **Senate**, where it can still be studied and amended. That makes the next question a live one: where your **senators** land, and where your **MP** stood on doing this in a day. [Find your MP's record here.](/find-your-mp)`,
    },
  ],
  sources: [
    { label: 'LEGISinfo — Bill C-22 (45-1), "An Act respecting lawful access" (status & stage dates)', url: 'https://www.parl.ca/legisinfo/en/bill/45-1/c-22' },
    { label: 'Michael Geist — Government Moves to Shut Down Lawful Access Hearing to Fast-Track the Bill This Week', url: 'https://www.michaelgeist.ca/2026/06/government-moves-to-shut-down-lawful-access-hearing-in-order-to-fast-track-passing-the-bill-this-week/' },
    { label: 'Michael Geist — The Lawful Access Two-Headed Surveillance Monster: How Bill C-22 Went Off the Rails', url: 'https://www.michaelgeist.ca/2026/05/the-lawful-access-two-headed-surveillance-monster-how-bill-c-22-went-off-the-rails/' },
    { label: 'Michael Geist — Bill C-22\'s Clause-by-Clause Problem (agencies in, Privacy Commissioner out)', url: 'https://www.michaelgeist.ca/2026/06/bill-c-22s-clause-by-clause-problem-the-government-includes-agencies-seeking-lawful-access-powers-but-blocks-the-privacy-commissioners-return/' },
    { label: 'JURIST — Canada lawful access bill faces backlash from privacy watchdog and tech giants', url: 'https://www.jurist.org/news/2026/05/canada-lawful-access-bill-faces-backlashes-from-privacy-watchdog-and-tech-giants/' },
    { label: 'CBC News — Committee studying lawful access bill urged to protect encryption, balance privacy with police needs', url: 'https://www.cbc.ca/news/politics/lawful-access-c-22-committee-9.7211701' },
    { label: 'CP24 — Bill to help authorities probe online activities raises widespread privacy fears', url: 'https://www.cp24.com/news/canada/2026/05/10/bill-to-help-authorities-probe-online-activities-raises-widespread-privacy-fears/' },
    { label: 'Michael Geist — Canada\'s Digital Super-Regulator: Bill C-36 pushes out the Privacy Commissioner', url: 'https://www.michaelgeist.ca/2026/06/canadas-digital-super-regulator-bill-c-36-pushes-out-the-privacy-commissioner-and-hands-private-sector-privacy-to-an-overloaded-commission/' },
    { label: 'Parliament Audit — Bill C-22: the metadata that becomes a surveillance map', url: 'https://parliamentaudit.ca/news/bill-c-22-lawful-access-metadata-surveillance' },
    { label: 'Parliament Audit — Bill C-22 and the Privacy Commissioner with no oversight role', url: 'https://parliamentaudit.ca/news/bill-c-22-privacy-commissioner-no-oversight-role' },
  ],
};
