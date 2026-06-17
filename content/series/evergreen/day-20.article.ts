/**
 * Evergreen day-20: Private members' bills — why most die, how the
 * lottery works, and the ones that beat the odds. Non-partisan
 * procedural explainer.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'private-members-bills-why-most-die-and-how-the-lottery-works',
  headline: 'Any MP Can Introduce a Law. Almost None of Them Pass. Here\'s the Lottery That Decides Which Ones Even Get a Chance.',
  subheadline:
    'Most legislation comes from the government. But any backbench or opposition MP can introduce a private member\'s bill — and a literal random draw decides whose bill gets debated. The odds of passage are long, the time allotted is tiny, and a government that doesn\'t like a bill has easy ways to run out the clock. This explainer covers how private members\' business works, why so little of it becomes law, and the notable exceptions.',
  summary:
    'Legislation in the House of Commons comes in two streams. Government bills carry the government\'s agenda, get priority access to House time, and are backed by the whip — most pass. Private members\' bills (PMBs) are introduced by MPs who are not ministers (backbenchers and opposition members) and travel a far harder road. Which MPs even get a chance is set by a random draw at the start of a Parliament that orders members on the "List for the Consideration of Private Members\' Business"; only those near the top will realistically reach debate, since private members\' business gets a limited slot (about one hour on most sitting days). A PMB that is reached gets two hours of second-reading debate spread across separate days, a committee stage, report stage, and third reading — each competing for scarce slots — and votes on PMBs are more often free (unwhipped) than government bills. The combination of the lottery, the time scarcity, the free-vote unpredictability, and the government\'s control of the broader calendar means the large majority of PMBs never become law. The ones that do tend to be narrowly scoped, broadly sympathetic, or quietly backed by the government; private members\' bills cannot directly appropriate public money (a "royal recommendation" from the government is required for spending), which rules out an entire category. Despite the odds, PMBs are a real avenue: they put issues on the record, force recorded votes, and occasionally pass into law.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['private members bills', 'PMB', 'parliamentary procedure', 'royal recommendation', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 6,
  faq: [
    {
      question: 'What is a private member\'s bill?',
      answer:
        'A private member\'s bill (PMB) is a bill introduced by a Member of Parliament who is not a cabinet minister — a backbencher or opposition member — rather than by the government. PMBs let ordinary MPs put proposals before the House, but they face far tighter limits on time and money than government bills, and most never become law.',
    },
    {
      question: 'Why do most private members\' bills fail?',
      answer:
        'Several reasons stack up: a random draw determines which MPs even get a realistic chance to have their bill debated; private members\' business gets only a small slot of House time (about an hour on most sitting days); the multiple stages each compete for scarce slots; PMBs can\'t appropriate public money without a government "royal recommendation"; and votes are often free, making outcomes unpredictable. The result is that the large majority die on the Order Paper.',
    },
    {
      question: 'How does the private members\' bill lottery work?',
      answer:
        'At the start of a Parliament, MPs eligible to introduce private members\' business are placed in a random order — the List for the Consideration of Private Members\' Business — by a draw. Members near the top of the list get to bring their item forward first; those near the bottom may never reach the top before the Parliament ends. Where you land in the draw substantially determines whether your bill gets a real chance.',
    },
    {
      question: 'Can a private member\'s bill spend government money?',
      answer:
        'Not on its own. Bills that appropriate public funds or impose a new tax require a "royal recommendation" — a signal that can only come from the government (a minister). A private member\'s bill that would spend money is out of order without it. This is why PMBs tend to be regulatory or symbolic rather than spending measures, and it\'s a major structural limit on what backbenchers can achieve through legislation.',
    },
  ],
  keyTakeaways: [
    'Government bills carry the agenda, get priority time, and are whipped — most pass.',
    'Private members\' bills come from non-minister MPs and face a much harder road.',
    'A random draw orders MPs for private members\' business; your spot largely decides if your bill gets a real chance.',
    'Private members\' business gets only a small slot (~1 hour most sitting days), and every stage competes for it.',
    'PMB votes are more often free (unwhipped) than government-bill votes — outcomes are less predictable.',
    'PMBs cannot appropriate money without a government "royal recommendation" — ruling out spending bills.',
    'Most PMBs die on the Order Paper; those that pass tend to be narrow, sympathetic, or quietly government-backed.',
  ],
  smartBrevity: {
    bigThing:
      'Any MP can introduce a law, but the system is built so almost none of theirs pass: a random draw gates who even gets debated, the time is tiny, the money is off-limits without the government\'s blessing, and the votes are unwhipped. Private members\' bills are a real avenue — and a long shot by design.',
    whyItMatters:
      'When this site reports a recorded vote on a private member\'s bill, the dynamics are completely different from a government bill — free votes produce genuine cross-party splits, and a PMB reaching a vote at all means it cleared a gauntlet. Knowing the odds and the rules is how you read what a PMB vote actually means.',
    goDeeper: [
      'Two streams: government bills (priority, whipped) vs PMBs (scarce time, often free votes).',
      'Random draw orders MPs; top of the list = a real chance.',
      'Private members\' business: ~1 hour most sitting days; stages compete for it.',
      'No appropriation without a government royal recommendation.',
      'Most PMBs die on the Order Paper.',
      'Passers tend to be narrow, sympathetic, or quietly government-supported.',
    ],
    yesBut:
      'Long odds don\'t mean PMBs are pointless. They\'re how a backbencher puts an issue on the national agenda, forces colleagues onto the record with a recorded vote, and occasionally changes the law — several significant Canadian reforms began as private members\' bills. And because PMB votes are often free, they\'re among the rare moments the vote record shows MPs voting their own judgment rather than the party line. The low pass rate reflects scarce time and money, not a lack of value.',
    bottomLine:
      'A private member\'s bill is the clearest test of how much (or little) power an individual MP has. The draw, the clock, and the money rule are why most die — and why the ones that survive, and the free votes they trigger, are worth watching.',
  },
  methodology:
    'Private members\' business procedure — the random draw, the List for the Consideration of Private Members\' Business, time allocation for private members\' business, the stages, and the royal-recommendation requirement — is drawn from the House of Commons Standing Orders (Chapter XI) and House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017), chapter 21 (Private Members\' Business). The royal-recommendation rule is from the Constitution Act, 1867 (s. 54) and the Standing Orders. The free-vote tendency on PMBs reflects long-standing convention, not a formal rule.',
  sections: [
    {
      title: 'Two kinds of bill, two very different lives',
      body: `Every bill in the House of Commons is one of two kinds, and the kind decides almost everything about its chances.\n\n**Government bills** carry the governing party\'s agenda. They\'re introduced by ministers, get **priority access** to House time, and are backed by the **whip** — the government marshals its majority (or its minority deals) to pass them. Most government bills that the government actually wants become law.\n\n**Private members\' bills (PMBs)** are introduced by everyone else — backbenchers and opposition MPs who aren\'t in cabinet. They\'re the avenue for an individual MP to propose a law. And they travel a road specifically structured to be hard: scarce time, limited scope, unpredictable votes, and — first of all — a lottery just to get a turn.\n\nThe gap between the two streams is the gap between *the government legislating* and *an individual MP trying to.*`,
    },
    {
      title: 'The lottery: a literal random draw',
      body: `Here\'s the part that surprises people: which MPs even get a realistic shot at passing a bill is decided by **chance.**\n\nAt the start of each Parliament, every MP eligible to introduce private members\' business is placed into a **random order** — the **List for the Consideration of Private Members\' Business** — by a draw. Members at the **top** of the list bring their items forward first and get the limited debate time available; members near the **bottom** may never climb high enough before the Parliament ends.\n\nBecause private members\' business gets only a **small slice of House time** — roughly **one hour on most sitting days** — the queue moves slowly. Drawing a low number can mean your bill is effectively dead before you\'ve written it. Drawing a high one is the single biggest factor in whether you get a real chance. It is, quite literally, the luck of the draw.`,
    },
    {
      title: 'The gauntlet: time, money, and free votes',
      body: `Suppose you draw well and your bill is reached. It still has to survive a gauntlet:\n\n- **Scarce slots at every stage.** A PMB gets two hours of **second-reading** debate (split across separate days), then **committee**, **report stage**, and **third reading** — and each competes for that same thin sliver of private members\' time. A bill can wait months between stages.\n- **The money wall.** A PMB **cannot appropriate public funds or impose a tax** without a **royal recommendation** — and only the government (a minister) can provide one. So any bill that would *spend* money is out of order on its own. This rules out an entire category and pushes PMBs toward regulatory or symbolic measures.\n- **Free votes.** Unlike whipped government bills, votes on PMBs are **more often free** — MPs vote their own judgment. That\'s democratically healthy but makes outcomes **unpredictable**: a PMB can pass on cross-party support or die when the mood shifts.\n- **The government controls the wider calendar.** Even without whipping against a PMB, a government that dislikes one rarely needs to kill it openly — the scarcity of time does the work.\n\nStack these together and the result is arithmetic: **most private members\' bills never become law.** They die on the Order Paper when Parliament prorogues or dissolves, having run out of time.`,
    },
    {
      title: 'Why they still matter — and the ones that beat the odds',
      body: `Long odds don\'t make PMBs pointless. They do real work:\n\n- **They set the agenda.** A PMB forces an issue onto the floor and into the national conversation, even if it never passes.\n- **They force the record.** A PMB that reaches a vote puts every MP on the record — and because the vote is often free, it\'s one of the rare divisions where you see members voting their own conviction rather than the party line. For a vote-tracking site like this one, PMB divisions are some of the most revealing.\n- **A few become law.** Despite everything, significant Canadian reforms have begun as private members\' bills — typically ones that are **narrowly scoped, broadly sympathetic across parties, or quietly backed by the government** (which can supply a royal recommendation and ease the timing when it chooses to).\n\nSo when we report a recorded vote on a private member\'s bill, read it differently from a government bill: it cleared a lottery and a gauntlet to get there, the vote is more likely to reflect genuine individual judgment, and its passage — if it passes — is the exception that proves how hard the system makes it for one MP to change the law alone.`,
    },
  ],
  sources: [
    { label: 'House of Commons Standing Orders — Chapter XI: Private Members\' Business', url: 'https://www.ourcommons.ca/procedure/standing-orders/chapter11-e.html' },
    { label: 'House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed., 2017) — Chapter 21: Private Members\' Business', url: 'https://www.ourcommons.ca/procedure/procedure-and-practice-3/ch_21-e.html' },
    { label: 'Constitution Act, 1867 — s. 54 (royal recommendation for money bills)', url: 'https://laws-lois.justice.gc.ca/eng/const/page-1.html' },
    { label: 'House of Commons — Private Members\' Business (process and lists)', url: 'https://www.ourcommons.ca/en/parliamentary-business' },
    { label: 'Library of Parliament — Private Members\' Business', url: 'https://lop.parl.ca/sites/PublicWebsite/default/en_CA/ResearchPublications' },
  ],
};
