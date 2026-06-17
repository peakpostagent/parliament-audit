/**
 * Evergreen day-19: The Speaker of the House — powers, election, and
 * impartiality. Non-partisan procedural explainer.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'the-speaker-of-the-house-powers-election-and-impartiality',
  headline: 'The Speaker of the House: Elected by Secret Ballot, Sworn to Impartiality, and the Only MP Who Usually Doesn\'t Vote.',
  subheadline:
    'The Speaker runs the House of Commons — deciding who talks, ruling on the rules, disciplining members, and protecting Parliament\'s rights against the government. Uniquely, they\'re elected by a secret ballot of all MPs, shed their partisanship on taking the chair, and don\'t normally vote. This explainer covers how the Speaker is chosen, what powers the office holds, and why its impartiality is a load-bearing part of the system.',
  summary:
    'The Speaker of the House of Commons is the presiding officer of the elected chamber, chosen at the start of each Parliament (and after a vacancy) by a secret-ballot, preferential vote of all Members of Parliament — a reform adopted in 1986 that took the choice out of the Prime Minister\'s hands. On taking the chair, the Speaker sets aside party affiliation and presides impartially: recognizing who has the floor, applying and interpreting the Standing Orders, ruling on points of order and questions of privilege, maintaining decorum, and naming (suspending) members who defy the chair. The Speaker also defends the collective rights of the House — its privileges — including against the government, as in the 2011 finding that the government was in contempt of Parliament for withholding documents, a ruling that flowed from the Speaker. By convention the Speaker does not participate in debate and does not vote, except to break a tie; when casting a tie-breaking vote, the Speaker follows established conventions (generally voting to continue debate or to preserve the status quo rather than to decide the matter substantively). The office also administers the House as an institution — its budget, staff, and security — through the Board of Internal Economy.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['Speaker', 'House of Commons', 'parliamentary procedure', 'impartiality', 'privilege', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 5,
  faq: [
    {
      question: 'How is the Speaker of the House of Commons chosen?',
      answer:
        'By a secret-ballot, preferential vote of all Members of Parliament at the start of each Parliament (and to fill a vacancy). Any eligible MP who hasn\'t opted out is a candidate. The secret ballot — adopted in 1986 — means the House itself chooses its presiding officer, not the Prime Minister, which underpins the Speaker\'s independence.',
    },
    {
      question: 'Does the Speaker of the House vote?',
      answer:
        'Not normally. By convention the Speaker stays out of debate and abstains from votes to preserve impartiality. The exception is a tie: the Speaker has a casting vote and must use it. When breaking a tie, the Speaker follows conventions — generally voting to allow further debate or to keep the status quo, rather than to decide the substance.',
    },
    {
      question: 'What powers does the Speaker have?',
      answer:
        'The Speaker recognizes who speaks, interprets and applies the Standing Orders, rules on points of order and privilege, maintains decorum, and can "name" (suspend) a member who defies the chair. The Speaker also defends the House\'s collective privileges — including against the government — and administers the institution (budget, staff, security) through the Board of Internal Economy.',
    },
    {
      question: 'Is the Speaker non-partisan?',
      answer:
        'The Speaker is elected as a party MP but sets aside partisanship on taking the chair and is expected to preside impartially — not attending caucus in a participating way, not taking part in debate, and ruling without favour. The role\'s legitimacy depends on that impartiality, which is why the secret-ballot election (independent of the PM) matters.',
    },
  ],
  keyTakeaways: [
    'The Speaker presides over the House — recognizing speakers, ruling on the rules, keeping order.',
    'Chosen by secret-ballot preferential vote of all MPs (a 1986 reform), not appointed by the PM.',
    'Sets aside party affiliation on taking the chair and presides impartially.',
    'Does not normally vote — only to break a tie, and then by convention (continue debate / preserve status quo).',
    'Can "name" (suspend) a member who defies the chair.',
    'Defends the House\'s privileges even against the government — the 2011 contempt finding flowed from the Speaker.',
    'Administers the House as an institution (budget, staff, security) via the Board of Internal Economy.',
  ],
  smartBrevity: {
    bigThing:
      'The Speaker is the House\'s own referee — chosen by MPs in a secret ballot, stripped of partisanship in the chair, and the one member who normally doesn\'t vote. The office exists to make the chamber\'s rules mean something, including against the government that the House is supposed to hold to account.',
    whyItMatters:
      'A weak or captured Speaker means a chamber the government can run over; an independent one is a real check. The 2011 contempt-of-Parliament finding — which helped bring down a government — began with a Speaker\'s ruling. When this site reports procedural rulings, the Speaker is who makes them.',
    goDeeper: [
      'Chosen by secret-ballot preferential vote of all MPs (since 1986).',
      'Impartial in the chair; sheds party role.',
      'Recognizes speakers, rules on order and privilege, maintains decorum.',
      'Can name/suspend a defiant member.',
      'Doesn\'t normally vote; casting vote only, by convention.',
      'Defends House privilege vs the government (2011 contempt ruling).',
    ],
    yesBut:
      'Impartiality is an expectation, not a guarantee — Speakers are still elected partisans, and rulings on contested procedural fights are sometimes criticized as favouring one side. But the structural safeguards (secret-ballot election independent of the PM, the weight of precedent and the Standing Orders, and the reputational cost of visible bias) make the Canadian Speakership a genuinely constraining office rather than a government instrument.',
    bottomLine:
      'The Speaker is the institution defending itself: the House\'s rules, its dignity, and its privileges given a single impartial enforcer — one the members chose themselves, and one who gives up their own vote to hold the role.',
  },
  methodology:
    'The election process (secret-ballot preferential vote, adopted 1986) and the Speaker\'s powers and conventions are drawn from House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017), chapters on the Speaker and presiding officers, and the Standing Orders. The casting-vote conventions follow long-established "Speaker Denison\'s rules" practice. The 2011 contempt example is from the Speaker\'s ruling of March 9, 2011 and the subsequent contempt motion. Administrative responsibilities reflect the Parliament of Canada Act provisions on the Board of Internal Economy.',
  sections: [
    {
      title: 'Chosen by the House, not the Prime Minister',
      body: `The Speaker is the presiding officer of the House of Commons — and crucially, **the House chooses its own.**\n\nAt the start of each Parliament, MPs elect the Speaker by a **secret-ballot, preferential vote.** Every eligible member who hasn\'t withdrawn is a candidate; MPs rank or vote in successive rounds until someone has a majority. The secret ballot was adopted in **1986**, and it changed the office fundamentally: before, the Speaker was effectively the Prime Minister\'s choice, ratified by the House. Now the House picks its own referee, by a vote the government can\'t see or control.\n\nThat origin is the root of the Speaker\'s independence. An officer chosen *by* the members, in secret, owes their chair to the House as a whole — not to the party leader. It\'s the structural reason the Speakership can act as a genuine check rather than a government tool.`,
    },
    {
      title: 'Partisan no more — the duty of impartiality',
      body: `Speakers are elected as ordinary party MPs. But on taking the chair, they **set their partisanship aside** and are expected to preside with strict impartiality.\n\nIn practice that means: not participating in debate, not taking part in caucus in a meaningful way, not campaigning on partisan lines as Speaker, and — above all — **ruling without favour** to either side. The Speaker recognizes who speaks, decides points of order on the rules rather than the politics, and applies the same standards to government and opposition alike.\n\nThe office\'s entire legitimacy rests on this. A Speaker seen as carrying water for the government loses the authority to enforce the rules at all, because the rulings stop being accepted as fair. That\'s why the impartiality norm is so heavily defended — and why the independent, secret-ballot election that produces the Speaker matters so much.`,
    },
    {
      title: 'What the Speaker can actually do',
      body: `The Speaker\'s powers run the chamber:\n\n- **Recognition.** Nobody speaks without being recognized by the chair. The Speaker controls the floor.\n- **Interpreting the rules.** The Speaker applies and interprets the **Standing Orders**, ruling on **points of order** (procedural disputes) and **questions of privilege** (alleged breaches of Parliament\'s rights).\n- **Decorum and discipline.** The Speaker maintains order, can demand members withdraw unparliamentary language, and can **"name" a member** — formally identifying them for defying the chair, which leads to suspension from the House.\n- **Defending privilege — including against the government.** This is the office\'s constitutional muscle. When the government refused to provide cost documents a committee had ordered, it was a **Speaker\'s ruling (March 2011)** that found a *prima facie* case of contempt — leading to the House finding the government in contempt of Parliament, the first such finding in the Commonwealth, which contributed to that government\'s fall. The Speaker is how the House enforces its rights against the executive.\n- **One vote, held in reserve.** See below.`,
    },
    {
      title: 'The member who gives up their vote',
      body: `Here\'s the Speakership\'s defining sacrifice: **the Speaker does not normally vote.**\n\nTo preside impartially, the Speaker withdraws from debate and abstains from the divisions everyone else participates in. Their riding still has representation through them on constituency matters, but in the chamber the Speaker is the referee, not a player.\n\nThe sole exception is a **tie.** The Speaker holds a **casting vote** and must exercise it when the House is evenly split. And even then, the Speaker doesn\'t vote their preference — by long-standing convention (the "Speaker Denison\'s rules" tradition), the casting vote is used to **allow further debate where possible, and otherwise to preserve the status quo**, rather than to decide a substantive question. The idea is that a tie shouldn\'t be resolved by the one member sworn to neutrality imposing an outcome; it should default to continuing the conversation or leaving things unchanged.\n\nBeyond the chamber, the Speaker also runs the House as an **institution** — its budget, staff, precinct, and security — chairing the **Board of Internal Economy.**\n\nFor this site: when we report a procedural ruling, a member being named, or a finding of privilege, the Speaker is the actor. The office is the House\'s own machinery for making its rules — and its rights against the government — actually stick.`,
    },
  ],
  sources: [
    { label: 'House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017) — The Speaker and other presiding officers', url: 'https://www.ourcommons.ca/procedure/procedure-and-practice-3/ch_07-e.html' },
    { label: 'House of Commons — Role of the Speaker', url: 'https://www.ourcommons.ca/en/our-procedure/the-speaker' },
    { label: 'Standing Orders of the House of Commons — election of the Speaker', url: 'https://www.ourcommons.ca/procedure/standing-orders/chapter1-e.html' },
    { label: 'Speaker\'s ruling on production of documents (March 9, 2011) — Debates', url: 'https://www.ourcommons.ca/DocumentViewer/en/40-3/house/sitting-142/hansard' },
    { label: 'Parliament of Canada Act — Board of Internal Economy', url: 'https://laws-lois.justice.gc.ca/eng/acts/p-1/' },
  ],
};
