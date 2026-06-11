/**
 * Evergreen day-12: Question Period — the actual rules. Non-partisan
 * procedural explainer; documents the Standing Orders and conventions
 * without editorializing about any party's QP conduct.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'question-period-the-actual-rules-and-why-nobody-has-to-answer',
  headline: 'Question Period: The Actual Rules — Including the One Where Nobody Has to Answer.',
  subheadline:
    'Forty-five minutes a day, 35 seconds at a time, and no rule anywhere requiring a minister to answer the question asked. Question Period is the most-watched and least-understood ritual in Canadian politics. Here are the actual Standing Orders behind it — and the quieter, written mechanism that extracts far more information from governments than the daily theatre ever does.',
  summary:
    'Oral Questions — Question Period — runs 45 minutes every sitting day in the House of Commons under Standing Order 30(5). Questions rotate among parties by a Speaker-administered formula weighted by party standings, with each question and answer conventionally capped at about 35 seconds. The rules require questions to concern the administrative responsibility of the government, but no rule compels a minister to answer the question asked: ministers "may respond as they see fit" — they may deflect, answer a different question, or decline, and the Speaker has no power to force responsiveness, only to police decorum and unparliamentary language. The structural complement most Canadians never see is written questions on the Order Paper (Standing Order 39): any MP may file up to four detailed written questions, and the government must respond within 45 days when a response is requested — a mechanism that produces the documented disclosures (travel costs, program spending, contract details) that drive much of Canada\'s accountability journalism, including several stories this site has covered. The daily theatre tests the government\'s composure; the Order Paper extracts its records.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['Question Period', 'Order Paper', 'written questions', 'parliamentary procedure', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 5,
  faq: [
    {
      question: 'Do ministers have to answer questions in Question Period?',
      answer:
        'No. The Standing Orders require questions to relate to government business, but there is no rule compelling a minister to answer the question asked — ministers may respond as they see fit, deflect, or decline. The Speaker enforces time limits and decorum, not responsiveness.',
    },
    {
      question: 'How long is Question Period and who gets to ask questions?',
      answer:
        'Question Period runs 45 minutes each sitting day (Standing Order 30(5)). Questions rotate among the recognized parties under a Speaker-administered allocation weighted by party standings, with the Official Opposition leading off. Questions and answers are conventionally limited to about 35 seconds each.',
    },
    {
      question: 'What is a written question on the Order Paper?',
      answer:
        'Under Standing Order 39, any MP may place up to four detailed written questions on the Order Paper seeking information from the government. If the MP requests a response within 45 days, the government must table one. Written questions produce far more documented information than oral Question Period — itemized spending, contract details, program data — and are a primary source for accountability reporting.',
    },
    {
      question: 'Why does Question Period seem like theatre?',
      answer:
        'Because structurally it is: 35-second exchanges, no obligation of responsiveness, full television coverage, and clips designed for social media. Its real accountability function is narrower but genuine — it forces ministers to appear in person, daily, and respond to the opposition\'s chosen topics on the record. The substantive information extraction happens through written questions, committees, and officers of Parliament.',
    },
  ],
  keyTakeaways: [
    'QP is 45 minutes per sitting day, under Standing Order 30(5).',
    'Questions and answers run ~35 seconds each, by convention enforced by the Speaker.',
    'Questions must concern the government\'s administrative responsibility.',
    'NO rule requires a minister to answer the question asked — responsiveness is unenforceable.',
    'The Speaker polices time and decorum, not content.',
    'Written questions (S.O. 39): up to 4 per MP on the Order Paper, 45-day response deadline when requested.',
    'Written questions are the workhorse: itemized disclosures driving much of Canada\'s accountability reporting.',
    'Ministers must be present and on the record daily — the genuine accountability core under the theatre.',
  ],
  smartBrevity: {
    bigThing:
      'Question Period guarantees ministers must show up and be asked; it guarantees nothing about being answered. The mechanism that actually compels answers — written Order Paper questions with a 45-day clock — gets none of the cameras and produces most of the documents.',
    whyItMatters:
      'Several stories this site has covered began as Order Paper disclosures — itemized government records released because an MP filed the right written question. Knowing the difference between the two question systems is knowing where Canadian government information actually comes from.',
    goDeeper: [
      'S.O. 30(5): 45 minutes daily. Rotation weighted by party standings; Official Opposition leads.',
      '~35-second convention per question and answer.',
      'Scope rule: must relate to government administration.',
      'No responsiveness rule. Speaker enforces decorum only.',
      'S.O. 39: 4 written questions per MP; 45-day deadline; responses tabled in the House.',
      'Written responses are documents — citable, checkable, archived.',
    ],
    yesBut:
      'Dismissing QP entirely misses its function. Daily, in-person, televised exposure to the opposition\'s best material imposes real discipline on governments — scandals stay alive because QP renews them every afternoon, and ministers who cannot hold the room lose standing in their own caucus. The theatre is real, but theatre with consequences.',
    bottomLine:
      'Watch QP to see what the opposition thinks hurts the government. Read Order Paper responses to find out what is actually true. We do both — but the documents we cite come from the second one.',
  },
  methodology:
    'Rules drawn from the House of Commons Standing Orders (S.O. 30(5) on Oral Questions, S.O. 39 on written questions) and House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017), chapter 11. The 35-second convention and Speaker\'s enforcement practice are documented in the Speaker\'s statements and the procedural literature; the "respond as they see fit" formulation is the standard statement of ministerial discretion in Bosc & Gagnon.',
  sections: [
    {
      title: 'The rules of the daily show',
      body: `Oral Questions runs **45 minutes every sitting day** — standardly 2:15 p.m. Monday through Thursday, 11:15 a.m. Friday — under Standing Order 30(5).\n\nThe mechanics:\n\n- **Rotation.** The Speaker recognizes questioners under an allocation negotiated among the parties and weighted by standings. The Leader of the Opposition (or designate) leads with the first rounds; smaller recognized parties get guaranteed slots; independents get occasional ones.\n- **The 35-second convention.** Questions and answers are each held to roughly 35 seconds, enforced by the Speaker cutting microphones. The format guarantees pace and precludes depth — by design, on both counts.\n- **Scope.** Questions must concern the **administrative responsibility of the government** — a minister\'s department, government policy, public spending. Questions about party matters or opposition policy are out of order.\n- **Decorum.** The Speaker polices unparliamentary language, personal attacks, and noise. Members are named and, rarely, ejected.\n\nWhat the rules conspicuously do not contain: any requirement that the answer address the question.`,
    },
    {
      title: 'The rule that isn\'t there',
      body: `The procedural authorities state it plainly: ministers **may respond as they see fit**. A minister may answer the question, answer a different question, recite talking points, attack the questioner\'s record, or stand and say nothing of substance — all fully in order.\n\nThe Speaker\'s powers stop at form. Time limits: enforceable. Unparliamentary language: enforceable. Responsiveness: **not the Speaker\'s jurisdiction**, and successive Speakers have said so explicitly when opposition members have raised points of order about non-answers.\n\nWhy does the gap exist? Partly inheritance — Westminster question time was built on ministerial discretion. Partly realism: a responsiveness rule would put the Chair in the impossible position of judging, in real time, whether an answer was "responsive enough," converting every exchange into a procedural appeal.\n\nThe consequence is the QP everyone recognizes: a daily exchange of 35-second performances in which the questions are often better-documented than the answers. That is not a malfunction of the rules. It is the rules.`,
    },
    {
      title: 'The question system that actually extracts answers',
      body: `Standing Order 39 runs the quieter system. Any MP may place up to **four written questions** at a time on the Order Paper — and these can be long, forensic, multi-part requests: itemize every flight on a government aircraft in a date range; list every contract with a named vendor; state program spending by year and province.\n\nThe teeth: an MP may request a response within **45 days**, and the government must table one in the House. Responses are prepared by departments, signed off by ministers\' offices, and become **public documents** — citable, archivable, checkable against other records.\n\nThis is where a large share of Canadian accountability journalism actually starts. Itemized travel and hospitality costs, program-by-program spending breakdowns, departmental staffing numbers — disclosures of that kind routinely enter the public record as Order Paper responses, including records behind spending stories this site has covered.\n\nThe system has known weaknesses — responses can be thin, deadlines produce "unable to respond in the time provided" answers, and volume caps limit throughput. But compare the yields: 45 minutes of QP produces clips; one well-drafted written question produces a document set.`,
    },
    {
      title: 'How to consume QP intelligently',
      body: `Three habits, from how we use it ourselves:\n\n- **Read QP as the opposition\'s sense of the battlefield.** The topics chosen each day are the opposition\'s best current material; persistence on one file across weeks signals they believe it is drawing blood. The answers, by contrast, tell you mostly what the government wishes the question had been.\n- **Treat claims from either side as leads, not facts.** A QP assertion — number, quote, accusation — is a starting point for verification against Hansard, Order Paper responses, PBO reports, and committee records. That verification step is, in one sentence, this site\'s job.\n- **When a minister repeatedly won\'t answer orally, watch for the written question.** Opposition researchers follow the same logic: the QP stonewall is regularly followed by an S.O. 39 filing on the same subject, and the tabled response 45 days later is where the story lands. We track those tabled responses; the daily clips age out, the documents don\'t.\n\nQuestion Period is the most visible accountability ritual Canada has, and the least informative. Used as an index to the real records — Hansard, the Order Paper, committee evidence — it earns its 45 minutes.`,
    },
  ],
  sources: [
    { label: 'House of Commons Standing Orders — S.O. 30(5) (Oral Questions) and S.O. 39 (Written Questions)', url: 'https://www.ourcommons.ca/procedure/standing-orders/index-e.html' },
    { label: 'House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017) — Chapter 11: Questions', url: 'https://www.ourcommons.ca/procedure/procedure-and-practice-3/ch_11-e.html' },
    { label: 'House of Commons — Order Paper and Notice Paper (current written questions)', url: 'https://www.ourcommons.ca/en/parliamentary-business' },
    { label: 'Library of Parliament — Questions in the House of Commons', url: 'https://lop.parl.ca/sites/PublicWebsite/default/en_CA/ResearchPublications' },
  ],
};
