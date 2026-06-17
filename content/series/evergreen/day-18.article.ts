/**
 * Evergreen day-18: How a Canadian federal election actually works —
 * the writ, ridings, first-past-the-post, Elections Canada. Non-partisan
 * mechanics explainer.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'how-a-canadian-federal-election-actually-works-writ-to-results',
  headline: 'How a Canadian Federal Election Actually Works: From the Writ to the Results.',
  subheadline:
    'You don\'t vote for a prime minister. You vote for one local candidate, in one of 343 ridings, and whoever gets the most votes there wins the seat — even with far less than half. The party that wins the most seats usually forms government. This explainer walks the whole mechanism: the writ, the ridings, first-past-the-post, who runs the election, and why the seat count and the vote share so often don\'t match.',
  summary:
    'A Canadian federal election fills the seats of the House of Commons — 343 of them as of the 2023 redistribution. Each seat represents a riding (electoral district), and voters in each riding choose among local candidates. The candidate with the most votes in a riding wins it outright; this is first-past-the-post (single-member plurality), and a winner needs only more votes than any rival, not a majority. Canadians do not directly vote for the Prime Minister or the government; the party (or coalition) that can command the confidence of the House — usually the one with the most seats — forms government, and its leader becomes Prime Minister. Elections are triggered by the Governor General dissolving Parliament on the Prime Minister\'s advice, subject to the fixed-election-date law (a default date that does not prevent an earlier call). The independent, non-partisan agency Elections Canada, led by the Chief Electoral Officer (an officer of Parliament), administers the vote. Because first-past-the-post translates votes to seats riding-by-riding, the national seat share routinely diverges from the national vote share — a party can win the most seats without the most votes, and small vote swings can produce large seat swings.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['elections', 'first-past-the-post', 'ridings', 'Elections Canada', 'writ', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 6,
  faq: [
    {
      question: 'Do Canadians vote for the Prime Minister?',
      answer:
        'No. Canadians vote for one local candidate in their riding. The Prime Minister is the leader of the party that can command the confidence of the House of Commons — usually the party that wins the most seats. You only get to vote directly for the PM if you happen to live in the riding they\'re running in.',
    },
    {
      question: 'What is first-past-the-post?',
      answer:
        'First-past-the-post (single-member plurality) means each riding elects one MP, and the candidate with the most votes wins — even if that\'s well under 50%. There\'s no runoff and no ranking. It\'s simple and produces clear local winners, but because seats are won riding-by-riding, the national seat count often doesn\'t match the national vote share.',
    },
    {
      question: 'Who runs federal elections in Canada?',
      answer:
        'Elections Canada, an independent, non-partisan agency headed by the Chief Electoral Officer — an officer of Parliament who reports to Parliament, not the government. It administers the vote, maintains the voters list, registers parties and candidates, and enforces the Canada Elections Act. Its independence from the government of the day is a core feature.',
    },
    {
      question: 'How is a federal election called?',
      answer:
        'The Governor General dissolves Parliament on the Prime Minister\'s advice, which "drops the writ" and starts the campaign (minimum 37 days). Canada has a fixed-election-date law setting a default date roughly every four years, but it does not prevent an earlier dissolution — a government can fall on a confidence vote, or a PM can request an early election.',
    },
  ],
  keyTakeaways: [
    'You vote for one local candidate in your riding — not for the PM or the government.',
    'There are 343 ridings (since the 2023 redistribution); each elects one MP.',
    'First-past-the-post: the candidate with the most votes in a riding wins, majority not required.',
    'The party that can command the confidence of the House forms government — usually the one with the most seats.',
    'Elections are triggered by the GG dissolving Parliament on the PM\'s advice (fixed-date law sets a default, not a ceiling).',
    'Elections Canada — led by the Chief Electoral Officer, an officer of Parliament — runs the vote, independent of government.',
    'Seat share routinely diverges from vote share; a party can win the most seats without the most votes.',
  ],
  smartBrevity: {
    bigThing:
      'A Canadian election is 343 separate local contests, each won by whoever gets the most votes — not a single national vote for a leader. That riding-by-riding design is why the seat count and the popular vote so often tell different stories.',
    whyItMatters:
      'How votes become seats shapes everything downstream — who governs, whether it\'s a majority or minority, and how much a party\'s seat total reflects its actual support. Misreading "most seats" as "most votes" (they\'re frequently different) distorts how you understand a result and the government it produces.',
    goDeeper: [
      'Vote = one local candidate in one of 343 ridings.',
      'First-past-the-post: most votes in the riding wins, no majority needed.',
      'Government = whoever commands the confidence of the House (usually most seats).',
      'Called by GG on PM advice; fixed-date law is a default, not a cap.',
      'Elections Canada (Chief Electoral Officer) runs it, independent of government.',
      'Seat share ≠ vote share — a recurring feature, not a glitch.',
    ],
    yesBut:
      'First-past-the-post is genuinely contested. Critics say it distorts representation — wasting votes for losing local candidates, under-representing parties with broad-but-thin support, and manufacturing majorities from minority vote shares. Defenders value its simplicity, strong local representation (every riding has one accountable MP), and tendency to produce decisive governments. The 2015–2017 federal electoral-reform effort explored alternatives and ended without change. It\'s a live debate, not a settled flaw.',
    bottomLine:
      'Strip it down and it\'s simple: 343 local races, most-votes-wins, and the party that holds the House\'s confidence governs. The complications — seats vs. votes, majorities from minorities — all flow from that one design choice.',
  },
  methodology:
    'Mechanics are from the Canada Elections Act and Elections Canada\'s published guidance on the electoral process, ridings, and the role of the Chief Electoral Officer. The seat count (343) reflects the 2023 representation order following the decennial redistribution. The dissolution/writ process and fixed-election-date provisions are from the Canada Elections Act (s. 56.1–56.2) and the Constitution Act, 1867. The seat-share-vs-vote-share divergence is an inherent, well-documented property of single-member-plurality systems.',
  sections: [
    {
      title: 'What you\'re actually voting for',
      body: `On a federal ballot, you mark **one name** — a local candidate running in your **riding** (electoral district). That\'s it. You are not voting for the Prime Minister, not for a party leader by name (unless they happen to run in your riding), and not directly for "the government."\n\nCanada has **343 ridings** (as of the 2023 redistribution, up from 338), each electing exactly **one** Member of Parliament. Your vote helps decide who represents *your* riding in the House of Commons — nothing more, directly.\n\nThe government emerges *indirectly*. After the votes are counted across all 343 ridings, the party (or combination of parties) that can **command the confidence of the House of Commons** — usually the party that won the most seats — forms government, and its leader becomes Prime Minister. So you influence who governs only through which local MP you send to Ottawa and which party they belong to. The PM is chosen by the math of the Commons, not by a national ballot line.`,
    },
    {
      title: 'First-past-the-post: most votes wins, full stop',
      body: `Each riding is decided by **first-past-the-post** (formally, single-member plurality): the candidate with the **most votes wins the seat** — even if that\'s far below half.\n\nThere is no runoff, no second round, no ranking of preferences. In a riding split four ways, a candidate can win with 35% while 65% of voters preferred someone else. Those 65% elect no one; in the seat math, their votes "don\'t count" toward representation.\n\nThis has a profound consequence at the national level: because seats are awarded **riding-by-riding**, the **national seat share routinely diverges from the national vote share.** A party whose support is efficiently concentrated (winning many ridings narrowly) can win more seats than a party with more total votes spread thinly. It\'s entirely possible — and has happened federally — for a party to **win the most seats without winning the most votes.** Small national vote swings can also produce large seat swings, because they tip many close ridings at once.\n\nNone of this is a malfunction; it\'s the arithmetic of the system Canada uses. But it\'s why "won the popular vote" and "won the election" are not the same statement.`,
    },
    {
      title: 'How an election gets called, and how long it runs',
      body: `Elections begin when the **Governor General dissolves Parliament** on the **Prime Minister\'s advice** — "dropping the writ." Writs of election are issued for every riding, and the campaign runs a **minimum of 37 days.**\n\nCanada has a **fixed-election-date law**: by default, a general election is held on a set date roughly every four years (the third Monday of October in the fourth calendar year after the last election). But — as both the statute\'s wording and repeated practice confirm — this default **does not prevent an earlier election.** A government can fall on a confidence vote (forcing dissolution), or a Prime Minister can simply advise the Governor General to dissolve early. The fixed date is a ceiling on a government\'s term, not a guarantee of one.\n\nThe Governor General\'s acceptance of dissolution advice is governed by constitutional convention, with the reserve-power backstop covered in our Governor General explainer — the 1926 King-Byng affair being the one federal instance of refusal.`,
    },
    {
      title: 'Who runs it — and why their independence matters',
      body: `The entire machinery is administered by **Elections Canada**, an **independent, non-partisan agency** led by the **Chief Electoral Officer (CEO)**.\n\nThe CEO is an **officer of Parliament** — appointed by resolution of the House of Commons and reporting to **Parliament, not the government of the day.** That distinction is the point: the people running the election answer to the legislature as a whole, not to the party in power, which removes the incumbent\'s ability to tilt the process.\n\nElections Canada maintains the National Register of Electors, registers political parties and candidates, runs the polls and counts, administers the **Canada Elections Act**, and enforces its rules (with the Commissioner of Canada Elections handling investigations). Its independence is why Canadian elections are administered the same way regardless of who\'s in government.\n\nFor readers of this site: the election decides *who* fills the 343 seats whose votes we then track for the next four years. Understanding that the result is 343 local plurality contests — not a national referendum on a leader — is the foundation for reading both the election and everything that follows it in the House.`,
    },
  ],
  sources: [
    { label: 'Elections Canada — The electoral process', url: 'https://www.elections.ca/content.aspx?section=vot&document=index&lang=e' },
    { label: 'Canada Elections Act (S.C. 2000, c. 9) — incl. fixed-date s. 56.1', url: 'https://laws-lois.justice.gc.ca/eng/acts/e-2.01/' },
    { label: 'Elections Canada — Office of the Chief Electoral Officer', url: 'https://www.elections.ca/content.aspx?section=abo&document=index&lang=e' },
    { label: 'Elections Canada — Redistribution of federal electoral districts (2023, 343 seats)', url: 'https://www.elections.ca/content.aspx?section=res&dir=cir/red&document=index&lang=e' },
    { label: 'Library of Parliament — Canada\'s electoral system', url: 'https://lop.parl.ca/sites/PublicWebsite/default/en_CA/ResearchPublications' },
  ],
};
