/**
 * Evergreen day-09: Confidence votes — what they are, what counts,
 * and what happens when a government loses one. Non-partisan
 * procedural explainer; the three modern government defeats are
 * documented as historical record.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'confidence-votes-what-counts-and-what-happens-when-a-government-loses',
  headline: 'Confidence Votes, Explained: What Counts, What Doesn\'t, and What Actually Happens When a Government Loses One.',
  subheadline:
    'Canadian governments hold power only as long as they hold the confidence of the House of Commons. But there is no statute listing which votes are confidence votes — it is a constitutional convention with fuzzy edges that governments and oppositions both exploit. Here is what reliably counts, what is contested, and the three times since 1979 a federal government has actually been voted out.',
  summary:
    'The confidence convention is the core rule of responsible government: a ministry may govern only while it commands the confidence of the elected House. No law defines which votes engage confidence. By convention, three categories reliably count: explicit motions of confidence or non-confidence; votes on the budget and on supply (the granting of money, including the main and supplementary estimates and interim supply); and the Address in Reply to the Speech from the Throne. Beyond those, a government may declare any vote a matter of confidence — a tool routinely used to discipline its own caucus and pressure opposition parties in minority Parliaments. Losing a confidence vote obliges the Prime Minister either to resign (allowing the Governor General to invite another leader to attempt to govern) or to advise dissolution and an election. Since 1979 three federal governments have been defeated on confidence: Joe Clark\'s on a budget sub-amendment in December 1979 (139-133), Paul Martin\'s on an explicit non-confidence motion in November 2005 (171-133), and Stephen Harper\'s in March 2011 (156-145) — the only defeat in Commonwealth history on a finding that the government was in contempt of Parliament.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['confidence vote', 'non-confidence', 'responsible government', 'minority government', 'parliamentary procedure', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 6,
  faq: [
    {
      question: 'What is a confidence vote in Canada?',
      answer:
        'A confidence vote is any House of Commons vote that, by constitutional convention, tests whether the government retains the support of a majority of MPs. If the government loses, the Prime Minister must either resign or ask the Governor General to dissolve Parliament for an election. The main categories: explicit confidence/non-confidence motions, budget and supply votes, and the Address in Reply to the Throne Speech.',
    },
    {
      question: 'Is every vote in Parliament a confidence vote?',
      answer:
        'No. Ordinary legislation, committee reports, and most motions are not matters of confidence — a government can lose them and carry on governing. Confidence is engaged by convention on budgets, supply, the Throne Speech, and explicit confidence motions, plus any vote the government itself declares to be a confidence matter.',
    },
    {
      question: 'What happens if the government loses a confidence vote?',
      answer:
        'The Prime Minister has two constitutional options: resign, which lets the Governor General invite another party leader to try to form a government that can command the House; or advise the Governor General to dissolve Parliament, triggering a general election. In every modern federal case — 1979, 2005, 2011 — the result was an election.',
    },
    {
      question: 'How many Canadian governments have been defeated on confidence votes?',
      answer:
        'Federally, six governments have fallen on House votes, three of them in the modern era: Joe Clark\'s PC government on a budget sub-amendment in December 1979, Paul Martin\'s Liberal government on an explicit non-confidence motion in November 2005, and Stephen Harper\'s Conservative government in March 2011 on a motion finding the government in contempt of Parliament — the only such defeat in the Commonwealth.',
    },
  ],
  keyTakeaways: [
    'No statute lists confidence votes — it is pure constitutional convention.',
    'Reliable confidence matters: explicit confidence/non-confidence motions, the budget, supply (estimates and appropriation bills), and the Address in Reply to the Throne Speech.',
    'A government may declare anything a confidence vote — a pressure tool on its own caucus and on opposition parties weighing an election.',
    'Losing means the PM resigns or seeks dissolution. All three modern defeats produced elections.',
    'Clark 1979: defeated 139-133 on a budget sub-amendment, six months into the mandate.',
    'Martin 2005: defeated 171-133 on a plain non-confidence motion.',
    'Harper 2011: defeated 156-145 on a contempt-of-Parliament finding — a Commonwealth first.',
    'Opposition parties get a limited supply of "allotted days" they can use to move non-confidence motions; the government controls the rest of the calendar.',
  ],
  smartBrevity: {
    bigThing:
      'Confidence is the operating system of responsible government: the ministry governs only while the elected House lets it. The catch is that the rule is unwritten — which votes count is convention, contested at the edges, and partly under the government\'s own control.',
    whyItMatters:
      'In a minority Parliament, every supply period is a live-fire test of whether the government survives — and the vagueness of the convention is itself a political weapon. Governments declare votes to be confidence matters to force opposition parties to choose between backing down and campaigning. Reading those moments accurately requires knowing the convention\'s actual contours.',
    goDeeper: [
      'Core confidence matters: explicit motions, budget, supply, Throne Speech address.',
      'Government may attach confidence to anything by declaration.',
      'Defeat → resign (another leader may try to govern) or dissolution (election).',
      '1979: Clark, 139-133, budget sub-amendment. 2005: Martin, 171-133, explicit motion. 2011: Harper, 156-145, contempt.',
      'Opposition non-confidence motions ride on allotted (opposition) days within each supply cycle.',
      'A lost vote on ordinary legislation is NOT a defeat — governments have lost bills and governed on.',
    ],
    yesBut:
      'The convention\'s flexibility is not purely cynical. It lets a government survive accidental losses (a snowstorm vote, a miscount) without an unwanted election, and it lets the House remove a government for misconduct that no statute anticipated — the 2011 contempt defeat being the proof. An exhaustive statutory list would make confidence more gameable, not less.',
    bottomLine:
      'Watch three things: budgets, supply, and explicit motions. Everything else is a confidence vote only if the government says it is — and when it says so, it is usually telling its own backbench as much as the opposition.',
  },
  methodology:
    'Convention and procedure drawn from House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017) and Library of Parliament research publications on the confidence convention. Vote tallies from the official Journals of the House of Commons: December 13, 1979 (sub-amendment to the budget motion, 139-133); November 28, 2005 (non-confidence motion, 171-133); March 25, 2011 (motion declaring the government in contempt and expressing non-confidence, 156-145).',
  sections: [
    {
      title: 'The rule that runs the system',
      body: `Canada\'s Constitution nowhere says "the government must resign if it loses the confidence of the House." It doesn\'t have to — the rule predates the text. Responsible government, won in the 1840s, means the ministry holds office only while it commands the support of a majority of the elected chamber.\n\nThe mechanism is the **confidence convention**, and its enforcement is political rather than judicial: no court will order a Prime Minister out of office for losing a vote. What enforces it is the certainty that a government clinging to office without confidence cannot pass supply — it literally runs out of legal authority to spend money — and the Governor General\'s reserve powers sit behind that as the final backstop.\n\nA majority government almost never faces a live confidence question; its own caucus is the majority. The convention does its real work in **minority Parliaments**, where every budget and every supply period is an existential event.`,
    },
    {
      title: 'What reliably counts',
      body: `Three categories engage confidence by settled convention:\n\n- **Explicit motions.** A motion stating that the House has (or has lost) confidence in the government. Opposition parties move these on their allotted days; governments occasionally move them on themselves to stabilize a minority.\n- **The budget and supply.** Money is the original confidence matter. The budget motion, the main and supplementary estimates, interim supply, and the appropriation (supply) bills that follow — losing any of these is treated as losing the House. The logic is ancient: a government that cannot obtain money from the Commons cannot govern.\n- **The Address in Reply to the Speech from the Throne.** The vote on the government\'s opening program. Losing it means the House rejected the government\'s agenda at the threshold.\n\nBeyond these, **the government can declare any vote a confidence matter.** The declaration is self-executing in political terms: it tells government MPs that defeat means an election (concentrating minds on the backbench) and tells opposition parties that voting their position means campaigning on it.\n\nWhat does NOT engage confidence: ordinary bills, committee reports, opposition motions on policy topics, procedural votes. Governments have lost all of these and governed on. A lost vote is an embarrassment; a lost confidence vote is the end.`,
    },
    {
      title: 'The three modern defeats',
      body: `**December 13, 1979 — Joe Clark, 139-133.** Six months after winning a minority, Clark\'s Progressive Conservatives brought a budget including an 18-cent-per-gallon gasoline excise increase. The NDP moved a sub-amendment; the Liberals and NDP voted together while several Créditiste MPs abstained. Clark treated the loss as decisive, advised dissolution, and lost the February 1980 election to Pierre Trudeau — the textbook case that budget votes are confidence votes, and that governing a minority as if it were a majority has a price.\n\n**November 28, 2005 — Paul Martin, 171-133.** The Conservatives, Bloc, and NDP combined on an explicit, one-line non-confidence motion after the first Gomery report on the sponsorship scandal. It remains the only time a federal government fell on a plain, unadorned motion of non-confidence. The January 2006 election made Stephen Harper Prime Minister.\n\n**March 25, 2011 — Stephen Harper, 156-145.** The Speaker had ruled the government prima facie in contempt of Parliament for refusing to produce cost documents on crime bills, corporate tax cuts, and the F-35 procurement. The Liberal motion adopted the contempt finding and declared non-confidence. It is the only contempt-based fall of a government in the Commonwealth. Harper won a majority in the May 2011 election — a reminder that losing the House and losing the country are different questions.`,
    },
    {
      title: 'What happens the morning after',
      body: `A Prime Minister defeated on confidence has exactly two constitutional doors:\n\n- **Resign.** The Governor General may then invite another leader — usually the Leader of the Opposition — to attempt to form a government that can command the House. This avoids an election if, and only if, a workable alternative majority exists. The possibility was the entire substance of the 2008 coalition crisis: the Liberal-NDP accord existed precisely to present the GG with an alternative government should Harper fall.\n- **Advise dissolution.** An election. This has been the actual outcome in every modern federal defeat — 1979, 2005, 2011 — partly because alternatives rarely command stable majorities, and partly because a freshly-defeated government usually prefers facing voters to handing power to its opponents without a campaign.\n\nThe choice formally belongs to the Governor General\'s acceptance of advice, with the reserve powers as the boundary: very early in a Parliament, a GG could in principle refuse dissolution and invite the alternative — the 1926 King-Byng territory mapped in our Governor General explainer.\n\nFor readers tracking votes on this site: when we label a division a confidence matter, that label comes from the categories above, not from the heat of the rhetoric around it. Plenty of votes are called "tests of the government" by participants; few actually are.`,
    },
  ],
  sources: [
    { label: 'House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017) — Responsible Government and Confidence', url: 'https://www.ourcommons.ca/procedure/procedure-and-practice-3/ch_2-e.html' },
    { label: 'Library of Parliament — The Confidence Convention in the Canadian Parliament', url: 'https://lop.parl.ca/sites/PublicWebsite/default/en_CA/ResearchPublications/2007007E' },
    { label: 'Journals of the House of Commons — December 13, 1979 (budget sub-amendment, 139-133)', url: 'https://www.ourcommons.ca/en/parliamentary-business' },
    { label: 'CBC Archives — Martin government falls, November 28, 2005', url: 'https://www.cbc.ca/news/canada/martin-government-falls-in-historic-commons-showdown-1.532957' },
    { label: 'CBC News — Harper government falls on contempt motion, March 25, 2011', url: 'https://www.cbc.ca/news/politics/harper-government-falls-in-historic-commons-vote-1.989305' },
    { label: 'Speaker\'s ruling on contempt (March 9, 2011) — House of Commons Debates', url: 'https://www.ourcommons.ca/DocumentViewer/en/40-3/house/sitting-142/hansard' },
  ],
};
