/**
 * Evergreen day-08: Prorogation vs dissolution vs adjournment.
 * Procedural explainer — non-partisan; documents what each mechanism
 * does, what dies and what survives, and the notable modern uses
 * without taking a side on any of them.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'prorogation-vs-dissolution-vs-adjournment-what-each-actually-does',
  headline: 'Prorogation, Dissolution, Adjournment: Three Ways Parliament Stops Sitting, and Why the Difference Matters.',
  subheadline:
    'When Parliament "shuts down," one of three very different things has happened. Adjournment is a scheduled break — nothing dies. Prorogation ends the session — government bills die on the Order Paper. Dissolution ends the Parliament itself — everything dies and an election follows. Each has been used strategically, and knowing which is which is the difference between a holiday and a constitutional event.',
  summary:
    'Parliament stops sitting in three legally distinct ways. Adjournment suspends sittings within a session — committees can keep working and all business survives. Prorogation, exercised by the Governor General on the Prime Minister\'s advice, terminates the session: government bills die on the Order Paper (they can be reinstated by motion in a new session at the stage they had reached), while private members\' business carries over automatically under the Standing Orders. Dissolution, also on the Prime Minister\'s advice, terminates the Parliament entirely and triggers a general election; every bill dies with no reinstatement. Prorogation has repeatedly been used at politically convenient moments — Stephen Harper in December 2008 during the coalition crisis, Justin Trudeau in August 2020 during the WE Charity committee studies, and again in January 2025 during the Liberal leadership transition — making the mechanism itself a recurring accountability question.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['prorogation', 'dissolution', 'adjournment', 'parliamentary procedure', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 5,
  faq: [
    {
      question: 'What is prorogation in Canadian politics?',
      answer:
        'Prorogation ends a session of Parliament without ending the Parliament itself. The Governor General prorogues on the Prime Minister\'s advice. Government bills that haven\'t received royal assent die on the Order Paper, committees stop their work, and Parliament returns later with a new Speech from the Throne. Unlike dissolution, no election is triggered.',
    },
    {
      question: 'What is the difference between prorogation and dissolution?',
      answer:
        'Prorogation ends a session; Parliament returns with the same MPs and a new Throne Speech. Dissolution ends the Parliament entirely — every seat is vacated and a general election follows. Bills die in both cases, but after prorogation, government bills can be reinstated by motion at the stage they had reached; after dissolution, everything starts from zero in a new Parliament.',
    },
    {
      question: 'Do bills die when Parliament is prorogued?',
      answer:
        'Government bills die on the Order Paper, but a new session can reinstate them by motion at the stage they had already reached. Private members\' bills survive automatically under House of Commons Standing Order 86.1 and resume in the new session. On dissolution, by contrast, all bills die with no reinstatement path.',
    },
    {
      question: 'Can the Governor General refuse to prorogue Parliament?',
      answer:
        'In theory the power belongs to the Governor General as a reserve power; in practice, by constitutional convention, the GG acts on the Prime Minister\'s advice. The closest modern test was December 2008, when Governor General Michaëlle Jean met with Prime Minister Harper for over two hours before granting prorogation during the coalition crisis — the length of the meeting itself signalling that the request was not treated as automatic.',
    },
  ],
  keyTakeaways: [
    'Adjournment = a break within a session. Nothing dies; committees can keep working.',
    'Prorogation = the session ends. Government bills die on the Order Paper; private members\' business survives automatically.',
    'Dissolution = the Parliament ends. Everything dies; a general election follows.',
    'Prorogation and dissolution are exercised by the Governor General on the Prime Minister\'s advice.',
    'Reinstatement motions can revive government bills after prorogation at the stage they had reached — but the government must spend House time to do it.',
    'Modern controversial prorogations: December 2008 (Harper, coalition crisis), August 2020 (Trudeau, WE Charity studies), January 2025 (Trudeau, leadership transition).',
  ],
  smartBrevity: {
    bigThing:
      'Three mechanisms stop Parliament from sitting, and they are not interchangeable: adjournment pauses, prorogation resets, dissolution erases. The political stakes scale accordingly — and so does the incentive to use the middle one strategically.',
    whyItMatters:
      'Prorogation kills every committee study and every government bill in progress. That makes it a procedural tool that can double as an escape hatch from parliamentary scrutiny — which is exactly the accusation levelled at its three most controversial modern uses, by governments of both major parties.',
    goDeeper: [
      'Adjournment: set by the House itself under its calendar; business survives intact.',
      'Prorogation: GG on PM\'s advice; session ends; committees dissolve; new Throne Speech required.',
      'Government bills die but can be reinstated by motion at their prior stage.',
      'Private members\' business carries over automatically (Standing Order 86.1).',
      'Dissolution: GG on PM\'s advice; election follows; nothing survives.',
      '2008, 2020, and 2025 prorogations all coincided with acute political pressure on the government of the day.',
    ],
    yesBut:
      'Prorogation is also routine housekeeping. Most prorogations in Canadian history were unremarkable session-endings after a legislative agenda was exhausted — the mechanism is neutral; the timing is what carries the politics. A government that prorogues with nothing controversial in front of committees attracts no attention at all.',
    bottomLine:
      'When you hear "Parliament is shutting down," ask which of the three it is. A break, a reset, or an election — the word tells you the stakes.',
  },
  methodology:
    'Procedural rules drawn from House of Commons Procedure and Practice (Bosc & Gagnon, 3rd edition, 2017), the House of Commons Standing Orders (notably S.O. 86.1 on private members\' business), and the Parliament of Canada\'s published procedural guides. Historical prorogation details from the contemporaneous public record: the December 2008 prorogation during the proposed Liberal-NDP coalition with Bloc support, the August 2020 prorogation during the WE Charity committee studies, and the January 2025 prorogation during the Liberal leadership transition.',
  sections: [
    {
      title: 'Adjournment: the pause button',
      body: `Adjournment is the House of Commons taking a scheduled break within a session — evenings, weekends, the summer recess, the winter break. The House adjourns itself under its own calendar and Standing Orders; no role for the Governor General, no constitutional event.\n\nThe defining feature: **nothing dies.** Every bill stays exactly where it is on the Order Paper. Committees can continue meeting, studying, and hearing witnesses while the House itself is adjourned. Written questions remain on the Order Paper awaiting answers.\n\nWhen commentators say "Parliament has risen for the summer," that is adjournment. The machinery is idling, not off.`,
    },
    {
      title: 'Prorogation: the reset button',
      body: `Prorogation terminates a **session** of Parliament. It is exercised by the Governor General on the Prime Minister\'s advice — in practice, a phone call or a meeting, followed by a proclamation.\n\nWhat happens on prorogation:\n\n- **Government bills die on the Order Paper.** A bill at committee stage, report stage, or awaiting third reading is gone.\n- **Committees cease to exist** for the session. Every study, every witness list, every draft report ends.\n- **Written questions are wiped** from the Order Paper.\n- **Parliament returns with a new Speech from the Throne**, opening a new session.\n\nTwo important survival mechanisms soften this. First, a new session can pass a **reinstatement motion** restoring government bills to the stage they had already reached — but the government must propose it and spend House time on it. Second, **private members\' business survives automatically** under Standing Order 86.1; a backbencher\'s bill resumes where it left off.\n\nThe asymmetry is the point worth noticing: the government\'s own bills can be revived at the government\'s initiative, and committee investigations — the thing prorogation kills most thoroughly — have no reinstatement mechanism at all. A new committee must start the study again from scratch.`,
    },
    {
      title: 'Dissolution: the off switch',
      body: `Dissolution terminates the **Parliament itself**. Every seat in the House of Commons is vacated, a general election follows, and the next Parliament starts from zero.\n\nEverything dies — government bills, private members\' bills, committee studies — and nothing can be reinstated, because the body that was considering them no longer exists. A bill that died at third reading on dissolution must be reintroduced at first reading in the next Parliament and travel the whole road again.\n\nDissolution happens on the Prime Minister\'s advice to the Governor General, subject to Canada\'s fixed-election-date law — which sets a default election date but, as its own text and practice confirm, does not prevent an earlier dissolution. Like prorogation, the GG\'s acceptance of the advice is governed by convention, with reserve-power refusal a theoretical backstop (the 1926 King-Byng affair being the canonical — and only — federal example, covered in our Governor General explainer).`,
    },
    {
      title: 'The strategic uses everyone remembers',
      body: `Three modern prorogations made the mechanism famous, and they span both major parties:\n\n- **December 2008 — Stephen Harper.** Weeks after the election, facing a Liberal-NDP coalition agreement (with Bloc support) ready to defeat his government on a confidence vote, Harper asked Governor General Michaëlle Jean to prorogue. She granted it after a meeting of more than two hours. By the time Parliament returned in late January, the coalition had collapsed.\n- **August 2020 — Justin Trudeau.** With four committees studying the WE Charity affair, Trudeau prorogued Parliament until late September. The studies died with the session.\n- **January 2025 — Justin Trudeau.** Announced alongside his resignation as Liberal leader, proroguing Parliament until March 24, 2025, while the party selected a successor — pausing, among other things, a House deadlocked over a document-production fight.\n\nIn each case the government described the prorogation as routine and necessary; in each case the opposition described it as escaping scrutiny. Both descriptions fit the record — which is precisely why the mechanism deserves to be understood rather than taken on either side\'s framing.\n\nParliament Audit\'s practice: when a prorogation lands, we report what dies on the Order Paper, item by item. The list speaks for itself.`,
    },
  ],
  sources: [
    { label: 'House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017) — Parliamentary Cycle', url: 'https://www.ourcommons.ca/procedure/procedure-and-practice-3/ch_8-e.html' },
    { label: 'House of Commons Standing Orders — S.O. 86.1 (private members\' business carry-over)', url: 'https://www.ourcommons.ca/procedure/standing-orders/chapter11-e.html' },
    { label: 'Library of Parliament — Prorogation in Canada', url: 'https://lop.parl.ca/sites/PublicWebsite/default/en_CA/ResearchPublications/202021E' },
    { label: 'CBC News archive — GG agrees to suspend Parliament (December 4, 2008)', url: 'https://www.cbc.ca/news/canada/gg-agrees-to-suspend-parliament-until-january-1.738864' },
    { label: 'CBC News — Trudeau prorogues Parliament until March 24, resigns as Liberal leader (January 6, 2025)', url: 'https://www.cbc.ca/news/politics/trudeau-resignation-prorogation-1.7423680' },
    { label: 'Canada Elections Act — fixed election dates (s. 56.1)', url: 'https://laws-lois.justice.gc.ca/eng/acts/e-2.01/' },
  ],
};
