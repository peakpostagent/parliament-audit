/**
 * Evergreen day-13: How the federal budget actually becomes spending —
 * budget vs estimates vs supply, in plain English. Non-partisan
 * procedural explainer.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'how-the-federal-budget-actually-becomes-spending-estimates-and-supply-explained',
  headline: 'The Budget Isn\'t What You Think It Is. How Federal Money Actually Gets Approved — Estimates, Supply, and the Votes That Can Topple Governments.',
  subheadline:
    'Budget day gets the headlines, but the budget speech doesn\'t spend a dollar. The legal authority to spend comes from a separate, older, far less televised machine: the estimates and the supply cycle — three fixed periods a year in which the House votes the government its money, with confidence on the line every time. Here is how the pieces actually fit.',
  summary:
    'Canada\'s federal spending process runs on two parallel tracks that are routinely confused. The budget is a policy statement: the Minister of Finance\'s plan for taxing, borrowing, and spending, moved as a ways-and-means motion and implemented through budget implementation acts that change tax law and program statutes. Spending authority, however, flows through the estimates-and-supply track: the Main Estimates (the government\'s itemized departmental spending requests, tabled by the President of the Treasury Board by March 1), reviewed by House committees, and granted through appropriation acts passed in three fixed supply periods ending June 23, December 10, and March 26. Supplementary Estimates (A, B, and C) top up the mains during the year, and interim supply tides departments over before the mains pass. Each supply period also contains the opposition\'s allotted days — the limited slots on which non-confidence motions ride. Every supply vote is a confidence matter: a government that cannot pass supply cannot govern, which is precisely how Joe Clark\'s government fell in December 1979. The Parliamentary Budget Officer provides independent costing and analysis throughout — frequently contradicting government projections, as our PBO explainer documents.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['budget', 'estimates', 'supply', 'appropriations', 'fiscal policy', 'parliamentary procedure', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 6,
  faq: [
    {
      question: 'What is the difference between the federal budget and the estimates?',
      answer:
        'The budget is the Finance Minister\'s policy plan — taxation, borrowing, and spending intentions — implemented through budget implementation acts. The estimates are the separate, itemized departmental spending requests (tabled by the Treasury Board President) that Parliament actually votes money against through appropriation acts. The budget announces; the estimates authorize. A program announced on budget day cannot legally spend until it appears in estimates and an appropriation act passes.',
    },
    {
      question: 'What are supply periods in the House of Commons?',
      answer:
        'Three fixed periods each year — ending June 23, December 10, and March 26 — in which the House deals with the business of supply: reviewing estimates and passing the appropriation acts that grant the government legal spending authority. Each period includes the opposition\'s allotted days. Supply votes are confidence matters.',
    },
    {
      question: 'What are opposition days (allotted days)?',
      answer:
        'Days within each supply cycle — 22 across a normal year — on which an opposition party, not the government, sets the House\'s agenda and moves a motion of its choosing, including non-confidence motions. They exist inside the supply process because of a centuries-old principle: before granting money, the House airs grievances.',
    },
    {
      question: 'Why are budget votes confidence votes?',
      answer:
        'Because a government that cannot obtain money from the elected House cannot govern — supply is the original confidence question, predating Confederation. Defeat on a budget motion or an appropriation bill is treated as the House withdrawing confidence. Joe Clark\'s government fell exactly this way in December 1979, on a sub-amendment to its budget.',
    },
  ],
  keyTakeaways: [
    'The budget is policy intent; the estimates are the legal spending request; appropriation acts are the authority.',
    'Main Estimates: tabled by March 1 by the Treasury Board President, referred to committees.',
    'Three supply periods a year, ending June 23, December 10, and March 26.',
    'Supplementary Estimates (A/B/C) adjust during the year; interim supply bridges the spring.',
    'Opposition allotted days — 22 in a normal year — live inside the supply cycle and carry non-confidence motions.',
    'All supply votes are confidence votes. Clark 1979 is the proof.',
    'Budget implementation acts (often two a year) carry the budget\'s tax and statutory changes — and have grown into frequent omnibus controversies.',
    'The PBO independently costs all of it — and regularly disagrees with the government\'s numbers.',
  ],
  smartBrevity: {
    bigThing:
      'Canada has two money tracks: the budget (the plan, on television) and supply (the authority, in committee rooms and late-night votes). Confusing them means missing where Parliament actually controls the public purse — and where governments actually fall.',
    whyItMatters:
      'Most "Ottawa announces $X billion" headlines describe the budget track — intentions. Whether the money exists in law depends on the estimates track, months later, in votes most coverage skips. The gap between announced and appropriated is where accountability reporting lives, and it is where this site\'s vote tracking does some of its most useful work.',
    goDeeper: [
      'Budget: ways-and-means motion → budget implementation act(s). Changes tax law and program statutes.',
      'Estimates: Main (by Mar 1) + Supplementary A/B/C. Itemized, votable, committee-reviewed.',
      'Supply periods end Jun 23, Dec 10, Mar 26 — appropriation acts pass at each deadline.',
      'Interim supply covers April-June before the mains clear.',
      'Allotted days: opposition agenda-setting inside each supply period.',
      'Everything on the supply track is confidence.',
    ],
    yesBut:
      'The system\'s scrutiny is better on paper than in practice. Committees routinely let estimates pass unexamined (deemed reported if not dealt with by deadline), budget implementation acts have carried hundreds of pages of unrelated amendments past meaningful review, and the two-track structure itself — designed for control — often functions as complexity that shields spending from it. The PBO exists, in large part, because Parliament\'s own machinery was not keeping up.',
    bottomLine:
      'When you want to know what a government values, read its budget. When you want to know what it is actually doing, read the estimates and the appropriation votes. We track the second kind — including who voted to grant the money, line by line.',
  },
  methodology:
    'Process drawn from the House of Commons Standing Orders (Chapter X — the business of supply, including the supply-period calendar and allotted days) and House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017), chapter 18 (Financial Procedures). Estimates mechanics from Treasury Board of Canada Secretariat published guides to the estimates. The 1979 Clark precedent is from the Journals of the House of Commons, December 13, 1979.',
  sections: [
    {
      title: 'Track one: the budget (the plan)',
      body: `The budget is a **policy statement**: the Minister of Finance\'s annual presentation of the government\'s fiscal position and intentions — revenue projections, deficit path, new programs, tax changes. Procedurally it arrives as a **ways and means** motion (the ancient category for taxation measures) followed by debate on the budget motion itself.\n\nIts legal force comes later, through **budget implementation acts** (BIAs) — typically two a year — which amend the Income Tax Act and other statutes to enact the budget\'s measures. BIAs are ordinary bills: readings, committee, report stage, Senate.\n\nTwo things the budget is not. It is **not a spending authorization** — announcing a program creates no legal authority to spend a dollar on it. And it is **not comprehensive** — most federal spending each year flows through programs already authorized by standing legislation (employment insurance, elderly benefits, health transfers), which never appear in an appropriation vote at all. Roughly two-thirds of spending is statutory in this sense; the estimates process governs the discretionary remainder.\n\nThe budget motion and BIAs are confidence matters — the 1979 Clark government fell on a budget sub-amendment, the canonical case covered in our confidence-votes explainer.`,
    },
    {
      title: 'Track two: the estimates (the authority)',
      body: `Spending authority for discretionary programs flows through the **estimates** — the government\'s itemized requests, organized by department and agency, by "vote" (operating, capital, grants and contributions).\n\nThe cycle:\n\n- **Main Estimates** — tabled by the **President of the Treasury Board** by March 1 for the fiscal year starting April 1. Referred to the matching House committees for review; ministers and officials appear to defend the numbers.\n- **Interim supply** — because the mains aren\'t fully granted until June, Parliament passes a bridge appropriation in March covering roughly the first three months.\n- **Supplementary Estimates A, B, and C** — in-year top-ups for needs that emerged after the mains: new programs, cost overruns, emergency response.\n- **Appropriation acts** — the actual statutes granting the money, passed at the end of each supply period. These are the bills whose recorded divisions we track.\n\nA detail with real consequences: estimates not reported back by committees by the deadline are **deemed reported** — scrutiny is time-boxed, and unexamined spending passes on schedule. Procedural reformers have complained about this for decades; it remains the rule.`,
    },
    {
      title: 'The supply calendar — and the confidence clock',
      body: `The Standing Orders fix **three supply periods** a year, ending **June 23, December 10, and March 26**. At the close of each, the House passes the pending appropriation act(s) — usually in a single evening of stacked votes.\n\nInside each period sit the **allotted days** — "opposition days" — totalling **22 in a normal year**, on which an opposition party sets the agenda and moves any motion it chooses. Their placement inside supply is not decorative: it descends from the founding principle of parliamentary finance — **grievances before supply**. Before the Commons grants the Crown money, it airs its complaints. Non-confidence motions, including the one that defeated Paul Martin\'s government in November 2005, ride on allotted days.\n\nAnd that is the deeper point of the whole calendar: in a minority Parliament, the supply schedule is a **standing confidence clock**. Three times a year, at fixed dates, the government must assemble a majority willing to grant it money — or stop being the government. No political manoeuvring can move the dates. When commentators say a minority government "faces a confidence test in the spring," this calendar is usually what they mean.`,
    },
    {
      title: 'Where the watchdogs fit — and where we do',
      body: `Three layers of independent scrutiny sit on the money tracks:\n\n- **The Parliamentary Budget Officer** costs platforms, programs, and projections independently — and, as our PBO explainer documents, regularly contradicts official figures by billions. PBO reports are the standard cross-check we apply to fiscal claims before repeating them.\n- **The Auditor General** examines spending after the fact — value-for-money and compliance audits, reported to the opposition-chaired Public Accounts committee.\n- **Committee estimates review** — the weakest layer in practice, for the deemed-reported reason above, but the venue where a determined committee can force ministers to defend specific line items on the record.\n\nWhat Parliament Audit adds is the voting record: when an appropriation act or budget motion comes to a recorded division, we publish who granted the money and who didn\'t — the supply track rendered legible, MP by MP. The announcements are politics; the appropriations are receipts. We keep the receipts.`,
    },
  ],
  sources: [
    { label: 'House of Commons Standing Orders — Chapter X: The Business of Supply (S.O. 81)', url: 'https://www.ourcommons.ca/procedure/standing-orders/chapter10-e.html' },
    { label: 'House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017) — Chapter 18: Financial Procedures', url: 'https://www.ourcommons.ca/procedure/procedure-and-practice-3/ch_18-e.html' },
    { label: 'Treasury Board Secretariat — A Guide to the Estimates', url: 'https://www.canada.ca/en/treasury-board-secretariat/services/planned-government-spending/government-expenditure-plan-main-estimates.html' },
    { label: 'Office of the Parliamentary Budget Officer', url: 'https://www.pbo-dpb.ca/en' },
    { label: 'Journals of the House of Commons — December 13, 1979 (defeat of the Clark government on the budget)', url: 'https://www.ourcommons.ca/en/parliamentary-business' },
    { label: 'Parliament Audit — What the Parliamentary Budget Officer Actually Does', url: 'https://parliamentaudit.ca/news/what-the-parliamentary-budget-officer-actually-does' },
  ],
};
