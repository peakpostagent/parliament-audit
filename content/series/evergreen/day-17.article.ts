/**
 * Evergreen day-17: Who's who in the House — minister, parliamentary
 * secretary, backbencher, whip, House leader. Non-partisan explainer of
 * the roles inside the Commons and why they matter for reading votes.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'who-does-what-in-the-house-of-commons-minister-to-backbencher-explained',
  headline: 'Minister, Parliamentary Secretary, Whip, Backbencher: Who Actually Does What in the House of Commons.',
  subheadline:
    'Every MP has one vote, but they don\'t have equal power. The Commons runs on a hierarchy of roles — cabinet ministers who run departments, parliamentary secretaries who assist them, House leaders and whips who manage the machinery, and backbenchers who make up the numbers. This explainer maps the roles, who appoints them, and why knowing the difference changes how you read a vote.',
  summary:
    'The House of Commons is composed of Members of Parliament who are formally equal — one seat, one vote — but who occupy very different roles. Cabinet ministers, appointed by the Prime Minister and sworn in by the Governor General, run government departments and are collectively responsible for government policy. Parliamentary secretaries are MPs appointed to assist specific ministers, a junior role often seen as a stepping stone to cabinet. The government House leader manages the government\'s legislative agenda and negotiates the Commons calendar with opposition counterparts. Party whips are responsible for caucus discipline — ensuring MPs attend and vote the party line, and administering the rewards and consequences that enforce it. Backbenchers are MPs without a front-bench role; they make up the bulk of every caucus, do constituency work, sit on committees, and provide the votes. The Speaker, elected by secret ballot of all MPs, presides impartially and does not normally vote. Understanding which role an MP holds explains why a parliamentary secretary is whipped even on a "free vote," why a backbencher\'s private member\'s bill behaves differently from a government bill, and why front-bench resignations are politically significant.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['MPs', 'cabinet', 'parliamentary secretary', 'whip', 'House leader', 'backbencher', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 5,
  faq: [
    {
      question: 'What is the difference between a cabinet minister and a regular MP?',
      answer:
        'All MPs are elected and have one vote. A cabinet minister is an MP additionally appointed by the Prime Minister (and sworn in by the Governor General) to run a government department and share collective responsibility for government policy. Most MPs are not ministers — they\'re backbenchers or hold junior roles. Ministers sit on the "front bench"; everyone else is "backbench."',
    },
    {
      question: 'What does a parliamentary secretary do?',
      answer:
        'A parliamentary secretary is an MP appointed to assist a specific cabinet minister — answering questions, shepherding legislation, and representing the minister at committees and events. It\'s a junior government role, unpaid beyond a small stipend, and widely seen as an audition for cabinet. Because it\'s a government position, parliamentary secretaries are expected to support the government even on votes where backbenchers are freed.',
    },
    {
      question: 'What is a party whip in Parliament?',
      answer:
        'The whip is the MP responsible for party discipline: making sure caucus members show up and vote the party line, managing pairing and attendance, and administering the consequences for breaking ranks (loss of committee seats, speaking slots, advancement). The name comes from fox-hunting\'s "whipper-in." A strong whip\'s office is the machinery behind Canada\'s very high party-line voting rates.',
    },
    {
      question: 'What is a backbencher?',
      answer:
        'A backbencher is an MP with no front-bench role — not a minister, parliamentary secretary, or House officer. Backbenchers make up the majority of every caucus. They do constituency casework, sit on committees, introduce private members\' bills, and provide the votes. They have the most freedom to dissent (having no government job to lose) but also the least individual power over the agenda.',
    },
  ],
  keyTakeaways: [
    'Every MP has one vote, but roles create a real power hierarchy.',
    'Cabinet ministers (PM-appointed, GG-sworn) run departments and share collective responsibility.',
    'Parliamentary secretaries are junior MPs who assist ministers — a stepping stone to cabinet, and whipped like government.',
    'The government House leader manages the legislative agenda and the Commons calendar.',
    'Whips enforce caucus discipline — attendance, the party line, and the consequences for breaking it.',
    'Backbenchers are the majority: committees, constituency work, private members\' bills, and the votes.',
    'The Speaker, elected by secret ballot, presides impartially and doesn\'t normally vote.',
  ],
  smartBrevity: {
    bigThing:
      'One MP, one vote — but a cabinet minister, a parliamentary secretary, a whip, and a backbencher are playing very different games. The role an MP holds explains their freedom to dissent, their power over the agenda, and what their vote actually signals.',
    whyItMatters:
      'When this site reports a vote, the same "Yea" means different things from different MPs. A minister\'s Yea is the government\'s position they\'re bound to. A backbencher\'s Yea on a freed vote is closer to personal judgment. Reading a division accurately means knowing who sits where.',
    goDeeper: [
      'Cabinet minister: runs a department; PM-appointed; front bench.',
      'Parliamentary secretary: assists a minister; junior; whipped as government.',
      'Government House leader: runs the legislative agenda + calendar.',
      'Whip: enforces caucus discipline and its consequences.',
      'Backbencher: the majority; committees, casework, PMBs, the votes.',
      'Speaker: elected by secret ballot; impartial; doesn\'t normally vote.',
    ],
    yesBut:
      'The hierarchy isn\'t the whole story. Backbenchers, precisely because they have no government job to protect, are where dissent and the occasional cross-party private-member\'s coalition come from — and a determined backbench can pressure leadership (the Reform Act gives caucuses real powers if they claim them). Power flows down from the front bench, but accountability and independence often live on the back bench.',
    bottomLine:
      'Learn the seating chart and the vote records start talking. The front bench tells you the government\'s position; the back bench is where you find the MP actually thinking for themselves.',
  },
  methodology:
    'Roles are described from House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017), the Parliament of Canada\'s role descriptions for ministers, parliamentary secretaries, House leaders, and whips, and the Parliament of Canada Act. The collective-responsibility and cabinet-appointment conventions follow standard Canadian constitutional practice. Party-discipline mechanics are consistent with Alex Marland\'s "Whipped: Party Discipline in Canada" (2020), covered in our whipped-votes explainer.',
  sections: [
    {
      title: 'The front bench: ministers and their assistants',
      body: `Walk into the Commons and the geography tells the story. The **front benches** — the rows closest to the centre aisle — hold the government\'s and opposition\'s senior figures. Behind them, the **back benches**, everyone else.\n\n**Cabinet ministers** are the core of the front bench. They\'re MPs (almost always — occasionally a senator) whom the Prime Minister chooses and the Governor General formally appoints and swears in. Each runs a government department, and together they share **collective responsibility**: cabinet decides policy as a body, and ministers publicly support those decisions or resign. A minister\'s vote isn\'t a personal opinion — it\'s the government\'s position, which they are bound to.\n\n**Parliamentary secretaries** sit just below. A parl sec is an MP appointed to assist a specific minister — fielding questions in the House, moving the minister\'s bills along, standing in at committees. It pays little beyond a small stipend, but it\'s the recognized **audition for cabinet**. Crucially, because it\'s a *government* job, parliamentary secretaries are expected to vote with the government even on the "free votes" where ordinary backbenchers are released — a distinction that surprises people reading a split caucus.`,
    },
    {
      title: 'The machinery: House leaders and whips',
      body: `Two roles make the Commons actually function, and they rarely make headlines.\n\nThe **House leader** (each party has one) manages the **legislative agenda and the calendar**. The government House leader decides which bills come up when, moves time allocation, and negotiates the schedule with opposition House leaders. When you hear that "the government will call the bill for debate Thursday," that\'s the House leader\'s work. It\'s the air-traffic control of Parliament.\n\nThe **whip** enforces **discipline**. The whip\'s office tells caucus the party line before a vote, manages attendance and pairing (matching absences so margins hold), and administers the consequences for breaking ranks — committee assignments, speaking slots, travel, and ultimately a leader\'s sign-off on the next nomination. Canada\'s famously high party-line voting (MPs vote with their party in the high-90s percent) is the whip\'s office working. The name is literal: it comes from the "whipper-in" who kept the hounds together in a fox hunt.\n\nNeither role is glamorous, but together they determine what gets debated and how the votes land — which is most of what a legislature does.`,
    },
    {
      title: 'The back bench: where the numbers (and the dissent) live',
      body: `**Backbenchers** are every MP without a front-bench job — not a minister, parl sec, House leader, or whip. They are the **majority of every caucus**, and they do the bulk of the actual parliamentary work:\n\n- **Constituency service** — the casework, the immigration files, the local advocacy that most voters actually experience.\n- **Committees** — the clause-by-clause study, witness questioning, and investigations where bills really change.\n- **Private members\' business** — backbenchers introduce private members\' bills and motions (most die, but it\'s their avenue to set the agenda).\n- **The votes** — they provide the numbers that pass or sink legislation.\n\nThe paradox of the back bench: it has the **least individual power over the agenda** but the **most freedom to dissent.** A backbencher has no government position to lose, so when an MP breaks with their party, it\'s almost always from the back bench. The cross-party coalitions on private members\' bills, the occasional whipped-vote rebellion, the resignations of conscience — back-bench territory. The Reform Act\'s caucus powers, when adopted, are a back-bench lever on leadership.`,
    },
    {
      title: 'And the referee: the Speaker',
      body: `Presiding over all of it is the **Speaker of the House** — covered in depth in our Speaker explainer, but worth placing in the org chart here.\n\nThe Speaker is an MP **elected by secret ballot of all members** at the start of a Parliament. On taking the chair, they shed partisanship: the Speaker enforces the rules impartially, recognizes who speaks, rules on points of order, and disciplines members — but does **not** participate in debate and **does not normally vote** (casting a tie-breaking vote only when needed, by convention to continue debate or preserve the status quo).\n\nSo the full hierarchy, top to bottom by agenda-power: **Prime Minister → cabinet → parliamentary secretaries → House leaders and whips → backbenchers**, with the **Speaker** standing apart as impartial referee.\n\nWhy it matters for this site: when we publish a recorded division, the same vote carries different weight depending on the voter\'s role. A minister\'s vote is the government bound by collective responsibility. A parl sec\'s vote is government too. A backbencher on a freed vote is the closest thing to an MP voting their own judgment. The seating chart is a decoder ring for the vote record.`,
    },
  ],
  sources: [
    { label: 'House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017) — Parliamentary roles', url: 'https://www.ourcommons.ca/procedure/procedure-and-practice-3/index-e.html' },
    { label: 'Parliament of Canada — Roles in the House (ministers, secretaries, House officers)', url: 'https://www.ourcommons.ca/en/parliamentary-framework' },
    { label: 'Parliament of Canada Act', url: 'https://laws-lois.justice.gc.ca/eng/acts/p-1/' },
    { label: 'Marland, Alex — Whipped: Party Discipline in Canada (UBC Press, 2020)', url: 'https://www.ubcpress.ca/whipped' },
    { label: 'Parliament Audit — Whipped votes vs free votes', url: 'https://parliamentaudit.ca/news/whipped-votes-vs-free-votes-how-party-discipline-actually-works' },
  ],
};
