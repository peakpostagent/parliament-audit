/**
 * Evergreen day-14: Whipped votes vs free votes — how party discipline
 * actually works in Canada. Non-partisan: documents the machinery and
 * its documented consequences across all parties; takes no position
 * on whether discipline is good or bad.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'whipped-votes-vs-free-votes-how-party-discipline-actually-works',
  headline: 'Whipped Votes vs Free Votes: Why Your MP Almost Always Votes the Party Line — and What Happens to the Ones Who Don\'t.',
  subheadline:
    'Canadian MPs vote with their party upwards of 99% of the time — among the highest rates of party discipline in the democratic world. That isn\'t an accident of like-mindedness; it\'s machinery: whips, caucus management, and a ladder of rewards and punishments that runs from committee seats to expulsion. Here is how the system works, what a "free vote" really means, and the one law that tried to shift the balance.',
  summary:
    'Nearly every recorded division this site tracks is a whipped vote: each party\'s whip informs its MPs of the party position and is responsible for delivering their votes. Canadian party discipline is among the tightest in any democracy — political-science studies of House divisions consistently find MPs voting with their party in the high-90s percent range, tighter than the UK, far tighter than the US. The machinery: party whips manage attendance, pairing, and voting; deviation carries graduated consequences (loss of committee assignments, travel, question slots, nomination sign-off, and ultimately caucus expulsion — the fate of Jody Wilson-Raybould and Jane Philpott in 2019). Free votes — where the party declares no position, typically on matters of conscience — are rare and usually partial: in the 2005 same-sex-marriage vote, Liberal backbenchers voted freely while cabinet was whipped; the 2016 assisted-dying bill followed the same pattern. The Reform Act, 2014 (Michael Chong\'s private member\'s bill) gives each party caucus the option, after every election, to claim powers including the right to expel members by caucus vote rather than leader\'s fiat and to trigger leadership reviews — but caucuses must opt in, and most, most of the time, have not. The practical upshot for readers of voting records: an MP\'s vote usually tells you the party\'s position; the informative exceptions — abstentions, absences, and the rare open break — are where individual conviction becomes visible, and they are exactly what our per-MP tracking is built to surface.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['party discipline', 'whipped vote', 'free vote', 'Reform Act', 'caucus', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 6,
  faq: [
    {
      question: 'What is a whipped vote in Canadian politics?',
      answer:
        'A whipped vote is one where a party has taken an official position and its whip — the MP responsible for party discipline — is expected to deliver the caucus\'s votes for it. The overwhelming majority of House of Commons votes are whipped, and Canadian MPs vote with their party in the high-90s percent range, among the highest discipline rates in any democracy.',
    },
    {
      question: 'What is a free vote?',
      answer:
        'A free vote is one where a party declares no official position and MPs may vote as they judge — typically reserved for "matters of conscience." Free votes are rare and often partial: in the 2005 same-sex-marriage and 2016 assisted-dying votes, government backbenchers voted freely while cabinet ministers were still whipped to support the government bill.',
    },
    {
      question: 'What happens to an MP who votes against their party?',
      answer:
        'Consequences are graduated and mostly informal: loss of committee assignments, speaking slots, and travel; being passed over for parliamentary secretary or cabinet roles; in persistent cases, refusal of the leader\'s sign-off on their next nomination; and ultimately expulsion from caucus — as happened to Jody Wilson-Raybould and Jane Philpott in 2019. Expelled MPs keep their seats and sit as independents.',
    },
    {
      question: 'What is the Reform Act and did it change anything?',
      answer:
        'The Reform Act, 2014 — Conservative MP Michael Chong\'s private member\'s bill — requires each party caucus to vote after every election on whether to adopt powers including expelling members by caucus vote (instead of the leader\'s decision) and triggering leadership reviews. The Conservative caucus\'s adoption of those powers enabled the removal of Erin O\'Toole as leader in February 2022 — the law\'s most consequential use. Most caucuses in most Parliaments have declined to adopt most of the powers, so the leader-centred status quo largely persists.',
    },
  ],
  keyTakeaways: [
    'Canadian MPs vote with their party in the high-90s percent range — tighter than the UK, far tighter than the US.',
    'The whip\'s office manages votes, attendance, pairing — and the consequences for deviation.',
    'The discipline ladder: committee seats → speaking slots → travel → parliamentary-secretary/cabinet prospects → nomination sign-off → caucus expulsion.',
    'Nomination sign-off is the structural anchor: under the Canada Elections Act, a candidate needs the leader\'s (or designate\'s) endorsement to run under the party banner.',
    'Free votes are rare and usually partial — cabinet stays whipped even when backbenchers are freed (2005 same-sex marriage; 2016 assisted dying).',
    'Wilson-Raybould and Philpott (2019): the modern reference case for expulsion.',
    'Reform Act, 2014: caucuses may opt into expulsion-by-caucus-vote and leadership-review powers each Parliament. Used to remove Erin O\'Toole as Conservative leader in 2022.',
    'Reading a vote record: party-line votes show party positions; the abstentions, absences, and rare breaks show the individual.',
  ],
  smartBrevity: {
    bigThing:
      'Your MP\'s vote is, statistically, the party\'s vote. The machinery that makes it so — whips, perks, nomination control — is mostly invisible, entirely legal, and the single most important context for reading any Canadian voting record.',
    whyItMatters:
      'This site exists to report how MPs vote. Honest reporting requires the caveat the data itself imposes: on a whipped vote, an individual MP\'s Yea tells you little about their personal judgment. The signal lives in the exceptions — and in which votes a party chooses to free.',
    goDeeper: [
      'Discipline rate: high-90s percent party-line voting across House divisions.',
      'Whip\'s toolkit: committee/travel/speaking assignments, attendance and pairing, escalating sanctions.',
      'Structural anchor: leader sign-off on nominations (Canada Elections Act).',
      'Free votes: party-declared, conscience matters, often backbench-only.',
      '2019: Wilson-Raybould and Philpott expelled from Liberal caucus over SNC-Lavalin fallout.',
      'Reform Act: opt-in caucus powers; enabled O\'Toole\'s 2022 removal; otherwise sparingly adopted.',
    ],
    yesBut:
      'Party discipline is not simply pathology. It makes the confidence convention workable (a government must be able to count its votes), makes party labels meaningful to voters (a Liberal or Conservative vote means a predictable program), and protects individual MPs from being singled out by pressure campaigns on every vote. The strongest defenders of the Canadian system argue loose-discipline legislatures like the US Congress trade coherence for chaos. The critique — best documented in Alison Loat and Michael MacMillan\'s exit interviews with 80 former MPs — is about degree: discipline so tight that elected members describe their own role as scripted.',
    bottomLine:
      'Treat a party-line vote as the party speaking. Treat an abstention, a strategic absence, or an open break as the MP speaking. Our per-MP records are built to make the second category findable — because that\'s where the individual accountability actually is.',
  },
  methodology:
    'Discipline rates summarized from the Canadian political-science literature on House divisions (party-unity studies consistently reporting high-90s percent cohesion) and from Alex Marland\'s "Whipped: Party Discipline in Canada" (UBC Press, 2020), the standard documentary account of the machinery, drawn from ~150 interviews. The Loat/MacMillan exit-interview material is from "Tragedy in the Commons" (2014). The nomination sign-off requirement is from the Canada Elections Act candidate-endorsement provisions. Reform Act provisions are from S.C. 2015, c. 37, and the February 2, 2022 Conservative caucus leadership review is from the contemporaneous public record. The 2019 expulsions are from the public record of April 2, 2019. Both books cited appear on our /reading list; the affiliate disclosure there applies.',
  sections: [
    {
      title: 'The number that frames everything',
      body: `Studies of recorded divisions in the House of Commons consistently find Canadian MPs voting with their party in the **high-90s percent** range — party-unity scores that exceed the UK House of Commons (where triple-digit government rebellions occur on major bills) and dwarf the US Congress.\n\nFor a site that publishes voting records, this is the foundational caveat: **on a whipped vote, the individual MP\'s vote is the party\'s vote.** When we report that an MP voted Yea on a bill, the honest interpretation is usually "their party voted Yea, and they did not pay the price of breaking ranks" — not "they personally weighed the bill and approved."\n\nWhich makes the real questions: what machinery produces 99% cohesion among 338 ambitious adults — and what does it cost to defect?`,
    },
    {
      title: 'The whip\'s toolkit',
      body: `Each party\'s **whip** is the MP responsible for delivering the caucus\'s votes: circulating the party line before divisions, managing attendance and **pairing** (the practice of matching an absent government MP with an absent opposition MP so the margin is preserved), and administering consequences.\n\nThe discipline ladder, roughly in escalating order:\n\n- **House privileges** — speaking slots, Question Period rotations, statements. Allocated by the party, withdrawable by the party.\n- **Committee assignments** — the substantive work and profile of an MP\'s career. The whip moves members on and off.\n- **Travel and delegations** — parliamentary associations, international trips.\n- **Advancement** — parliamentary secretary and cabinet appointments are the leader\'s alone; a record of independence is rarely a qualification.\n- **The nomination** — the structural anchor. Under the Canada Elections Act, running under a party banner requires the leader\'s (or designate\'s) signed endorsement. An MP who breaks with the party can face an un-signed nomination paper at the next election — the career death penalty, administered quietly.\n- **Expulsion from caucus** — the public last resort. The modern reference case: **Jody Wilson-Raybould and Jane Philpott**, expelled from the Liberal caucus on April 2, 2019 in the aftermath of the SNC-Lavalin affair. Expelled MPs keep their seats and sit as independents; both did, and Wilson-Raybould was re-elected as one.\n\nMost discipline never reaches any of these rungs. As Alex Marland\'s "Whipped" — the standard book-length account, built on ~150 interviews — documents, the system runs principally on anticipation: members internalize the costs and the whip rarely needs to impose them.`,
    },
    {
      title: 'Free votes: rarer and narrower than advertised',
      body: `A **free vote** is one where a party declares no position and releases its members. Two features keep the category narrow:\n\n- **They are reserved for "matters of conscience"** — historically: capital punishment, abortion-adjacent questions, marriage, end-of-life. Routine legislation is never freed.\n- **They are usually partial.** In the 2005 same-sex-marriage vote (Bill C-38), Liberal backbenchers voted freely while **cabinet was whipped** to support the government\'s own bill. The 2016 assisted-dying bill (C-14) followed the same template: a "free vote" for Liberal MPs, except ministers. The government cannot free the ministry from supporting government legislation without incoherence — so "free vote" in practice often means "free for those without jobs to lose."\n\nPrivate members\' business is the quieter exception: by convention, votes on backbench bills and motions are unwhipped more often, which is why they produce the cross-party splits that make our vote breakdowns occasionally surprising.\n\nWhen a recorded division shows a party splitting, this is the first thing we check: was the vote freed, or did members actually defy a whip? The two look identical in the tally and mean opposite things.`,
    },
    {
      title: 'The Reform Act — the attempt to shift the balance',
      body: `Conservative MP **Michael Chong**\'s Reform Act, 2014 — passed as a private member\'s bill with broad support — tried to move power from leaders to caucuses. It requires each recognized party\'s caucus to vote, at its first meeting after every election, on whether to adopt four powers for that Parliament:\n\n- expulsion and readmission of caucus members **by recorded caucus vote** (rather than the leader\'s decision),\n- election of the caucus chair,\n- triggering a **leadership review** on the written request of 20% of caucus, and\n- electing an interim leader.\n\nThe design concedes the political reality: the powers exist only if a caucus claims them, in the open, at the moment of maximum leader goodwill. Most caucuses, most of the time, have declined most of the powers — the Liberal caucus has consistently not adopted them.\n\nThe great exception proved the mechanism works when armed: the Conservative caucus adopted the leadership-review power after the 2021 election, and on **February 2, 2022**, used it to remove **Erin O\'Toole** as leader, 73-45 — a sitting leader of the Official Opposition removed by his own MPs under a statutory process. Defenders of the Act point to that day; critics note that one use in a decade, against a leader rather than on behalf of a dissenting backbencher, is a modest rebalancing of a system that still runs, vote by vote, through the whip.\n\nFor readers of this site: it is why we surface per-MP records at all. The party line is the default; the deviations are the data.`,
    },
  ],
  sources: [
    { label: 'Marland, Alex — Whipped: Party Discipline in Canada (UBC Press, 2020)', url: 'https://www.ubcpress.ca/whipped' },
    { label: 'Loat, Alison & MacMillan, Michael — Tragedy in the Commons (2014)', url: 'https://www.samaracanada.com/research/tragedy-in-the-commons' },
    { label: 'Reform Act, 2014 (S.C. 2015, c. 37)', url: 'https://laws-lois.justice.gc.ca/eng/annualstatutes/2015_37/page-1.html' },
    { label: 'Canada Elections Act — candidate endorsement by party leader', url: 'https://laws-lois.justice.gc.ca/eng/acts/e-2.01/' },
    { label: 'CBC News — Wilson-Raybould and Philpott expelled from Liberal caucus (April 2, 2019)', url: 'https://www.cbc.ca/news/politics/wilson-raybould-philpott-liberal-caucus-1.5081826' },
    { label: 'CBC News — Erin O\'Toole removed as Conservative leader in caucus vote (February 2, 2022)', url: 'https://www.cbc.ca/news/politics/otoole-leadership-vote-1.6336219' },
    { label: 'House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017) — Party whips and divisions', url: 'https://www.ourcommons.ca/procedure/procedure-and-practice-3/index-e.html' },
  ],
};
