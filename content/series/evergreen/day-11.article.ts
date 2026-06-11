/**
 * Evergreen day-11: How House of Commons committees work — where
 * bills actually change. Non-partisan procedural explainer.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'how-house-of-commons-committees-actually-work',
  headline: 'Committees Are Where Bills Actually Change. Here\'s How They Work — and Why Three of Them Are Always Chaired by the Opposition.',
  subheadline:
    'The chamber gets the cameras; committees do the work. Clause-by-clause review, witness testimony, document fights, estimates scrutiny — almost every substantive amendment to a federal bill happens at a committee table, not on the floor of the House. This explainer covers what committees are, what they can and cannot do to a bill, and the structural quirks that decide who controls them.',
  summary:
    'House of Commons standing committees — roughly two dozen permanent bodies of about a dozen MPs each, with membership proportional to party standings in the House — are where the substantive work of Parliament happens. After a bill passes second reading (approval in principle), it goes to the relevant committee for clause-by-clause study: witnesses testify, members propose amendments, and the committee reports the bill back to the House with or without changes. Committee power over a bill has a hard procedural boundary: amendments must respect the principle and scope of the bill the House approved at second reading, and committees cannot rewrite a bill into something else. Beyond legislation, committees scrutinize departmental spending plans (the estimates), conduct studies, and can compel documents and testimony — powers at the centre of repeated showdowns with governments, including the document fight that produced the 2011 contempt-of-Parliament finding. Control matters: most committees are chaired by government MPs, but the Standing Orders deliberately assign three accountability committees — Public Accounts; Access to Information, Privacy and Ethics; and Government Operations and Estimates — to opposition chairs. In a minority Parliament, opposition parties combined hold committee majorities, which is why minority-era committees produce investigations majorities would never allow.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['committees', 'clause-by-clause', 'parliamentary procedure', 'estimates', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 6,
  faq: [
    {
      question: 'What do parliamentary committees do in Canada?',
      answer:
        'House of Commons committees study bills clause-by-clause after second reading, hear witnesses, propose and vote on amendments, scrutinize government spending plans (the estimates), conduct studies on matters within their mandates, and can order the production of documents and the attendance of witnesses. Most substantive changes to federal legislation happen in committee, not in the House chamber.',
    },
    {
      question: 'Can a committee rewrite or kill a bill?',
      answer:
        'A committee can amend a bill significantly, but amendments must respect the principle and scope the House approved at second reading — a committee cannot turn a bill into a different bill. Committees also cannot formally kill a bill, but they can delay it, and a committee can recommend the House not proceed. The House can also overturn any committee amendment at report stage.',
    },
    {
      question: 'Who controls House of Commons committees?',
      answer:
        'Committee membership is proportional to party standings in the House. In a majority Parliament, the government holds a majority on every committee; in a minority Parliament, the opposition parties combined hold the majority — which is why minority-era committees launch investigations a majority government would block. By Standing Order, three committees are always chaired by opposition MPs: Public Accounts; Access to Information, Privacy and Ethics; and Government Operations and Estimates.',
    },
    {
      question: 'Can committees force witnesses to appear or documents to be produced?',
      answer:
        'Yes. Committees exercise the House\'s power to send for persons, papers, and records. Witnesses can be summoned and documents ordered. Enforcement against a resisting government ultimately runs through the House itself — the refusal to produce cost documents to a committee is what triggered the contempt finding that brought down the government in March 2011.',
    },
  ],
  keyTakeaways: [
    'Bills go to committee after second reading — once the House has approved them in principle.',
    'Clause-by-clause is the real legislative work: every clause voted, amendments proposed and decided.',
    'The boundary: amendments must fit the principle and scope set at second reading. A committee cannot rewrite a bill into a different bill.',
    'The House can overturn committee amendments at report stage — the chamber gets the last word.',
    'Membership is proportional to House standings: majorities control committees in majority Parliaments; oppositions control them in minorities.',
    'Three accountability committees always get opposition chairs: Public Accounts (PACP), Ethics (ETHI), Government Operations (OGGO).',
    'Committees can compel witnesses and documents — the 2011 contempt finding grew from a committee document order.',
    'Estimates scrutiny — reviewing departmental spending line by line — is committee work most Canadians never see.',
  ],
  smartBrevity: {
    bigThing:
      'If you only watch the House chamber, you are watching the theatre. The drafting, the amending, the testimony, the document fights, and the spending scrutiny all happen in committee rooms — and who holds the committee majority decides what gets studied and what gets buried.',
    whyItMatters:
      'When this site reports that a Senate or House committee amended a bill — as with the Bill C-9 amendment we covered in June 2026 — the committee stage is where the change was made and where it could have been stopped. Civic attention aimed only at the chamber arrives after the decisions are made.',
    goDeeper: [
      '~24-25 standing committees, ~10-12 MPs each, proportional to party standings.',
      'Bill flow: 2nd reading (principle) → committee (clause-by-clause) → report stage (House reviews amendments) → 3rd reading.',
      'Amendment boundary: principle and scope of the bill as approved at 2nd reading.',
      'Opposition-chaired by Standing Order: PACP, ETHI, OGGO.',
      'Powers: send for persons, papers, records. Backed by the House\'s contempt power.',
      'Minority Parliaments → opposition committee majorities → investigations the government cannot block.',
    ],
    yesBut:
      'Committee power has real limits. Governments control the House calendar and can use time allocation to cap committee study; majority governments control committee agendas through their majorities; and report stage lets the House reverse anything a committee did. Committees are where bills change — but the government of the day still decides, in most cases, whether they get the chance.',
    bottomLine:
      'Follow the committee, not just the chamber. By the time a bill is back in the House for third reading, the interesting decisions have usually already been made at a table you didn\'t see on the news.',
  },
  methodology:
    'Committee structure, mandates, and powers drawn from the House of Commons Standing Orders (Chapter XIII) and House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017), chapter 20. The opposition-chaired committee list is from Standing Order 106(2). The 2011 document-production episode is summarized from the Speaker\'s ruling of March 9, 2011 and the contempt motion adopted March 25, 2011.',
  sections: [
    {
      title: 'What a committee is',
      body: `The House of Commons delegates its detailed work to **standing committees** — roughly two dozen permanent bodies, each tied to a subject area (finance, health, public safety, ethics…) and composed of about ten to twelve MPs. Membership is **proportional to party standings in the House**: the balance of power in the chamber is reproduced in miniature at every committee table.\n\nThat one design choice does most of the explaining. In a majority Parliament, the government holds every committee majority, controls every agenda, and can end any study. In a **minority Parliament, the opposition parties combined out-vote the government on every committee** — which is why minority eras produce document fights, summoned ministers, and investigations that majority eras never see.\n\nBeside the standing committees sit special committees (created for one task), joint committees (shared with the Senate), and legislative committees (struck for a single bill) — same mechanics, narrower mandates.`,
    },
    {
      title: 'What committees do to bills',
      body: `A bill arrives in committee after **second reading** — meaning the House has already approved it *in principle*. The committee\'s job is the text, line by line:\n\n- **Witnesses first.** Ministers, officials, experts, industry, affected groups. Testimony builds the record amendments draw on.\n- **Clause-by-clause.** Every clause is put to a vote. Any member may move amendments; each is debated and decided. This is the densest legislative work in the system.\n- **Report back.** The committee returns the bill to the House, amended or not.\n\nThe critical boundary: amendments must respect the **principle and scope** of the bill as passed at second reading. A committee studying a firearms bill cannot amend it into a tax bill; a committee cannot reverse the core decision the House already made. Chairs — and ultimately the Speaker — rule amendments out of order on those grounds, and procedural fights over scope are a recurring feature of contested bills.\n\nTwo checks sit above the committee. At **report stage**, the full House reviews and can reverse any committee amendment. And the government, controlling the House calendar, can impose **time allocation** to cap how long a committee holds a bill. Committees are powerful, not sovereign.`,
    },
    {
      title: 'The accountability machinery',
      body: `Legislation is half the job. The other half is scrutiny:\n\n- **Estimates.** Departmental spending plans — the line-by-line requests behind every appropriation bill the House votes on — are referred to the matching committees. Ministers and officials answer for the numbers. (Our budget-cycle explainer covers where the estimates fit in the supply calendar.)\n- **Studies.** Committees set their own study agendas within their mandates and report findings to the House, with government responses required on request.\n- **Persons, papers, and records.** Committees exercise the House\'s ancient power to summon witnesses and order documents. This is the power with teeth: the refusal to give a committee the cost documents behind crime bills and the F-35 purchase is what escalated, ruling by ruling, into the March 2011 contempt-of-Parliament finding — the only one ever to bring down a Commonwealth government.\n\nAnd the structural safeguard worth knowing: by Standing Order, three committees are **always chaired by opposition MPs** — **Public Accounts** (which receives the Auditor General\'s reports), **Access to Information, Privacy and Ethics**, and **Government Operations and Estimates**. The design logic is plain: the committees whose core job is auditing the government should not be gavelled by it.`,
    },
    {
      title: 'How to watch a committee like it matters',
      body: `Practical guidance for following our coverage:\n\n- **The committee stage is the intervention window.** When we publish a ContactYourMP prompt on a bill in committee, that timing is deliberate — amendments are still possible there in a way they mostly aren\'t at third reading.\n- **Watch who chairs and who counts to a majority.** A study launched at PACP or ETHI under an opposition chair in a minority Parliament has subpoena-backed momentum; the same motion in a majority Parliament dies in a routine vote.\n- **Committee reports are findings of the House\'s own machinery** — when we cite one, it carries more evidentiary weight than party messaging, and we treat it accordingly.\n- **Senate committees run on the same logic** with one difference that has mattered recently: no government majority controls them, which is how a Senate committee could add the Bill C-9 amendment we covered in June 2026 over government objections.\n\nEvery committee meeting is public by default, livestreamed on ParlVU, with full transcripts published. The work is observable. It is just rarely observed — which is part of why we do this.`,
    },
  ],
  sources: [
    { label: 'House of Commons Standing Orders — Chapter XIII: Committees', url: 'https://www.ourcommons.ca/procedure/standing-orders/chapter13-e.html' },
    { label: 'House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017) — Chapter 20: Committees', url: 'https://www.ourcommons.ca/procedure/procedure-and-practice-3/ch_20-e.html' },
    { label: 'Standing Order 106(2) — opposition-chaired committees', url: 'https://www.ourcommons.ca/procedure/standing-orders/chapter13-e.html' },
    { label: 'House of Commons — Committees portal (mandates, memberships, ParlVU)', url: 'https://www.ourcommons.ca/committees/en' },
    { label: 'Speaker\'s ruling on production of documents (March 9, 2011) — Debates', url: 'https://www.ourcommons.ca/DocumentViewer/en/40-3/house/sitting-142/hansard' },
  ],
};
