export interface NewsArticle {
  slug: string;
  headline: string;
  subheadline: string;
  summary: string;
  publishedAt: string; // ISO date
  updatedAt?: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  /** Optional 3-5 bullets for the TLDR box at the top of the article. */
  keyTakeaways?: string[];
  /**
   * Optional Smart Brevity header block (Axios pattern).
   * Renders at the very top of the article as a scannable 3-part summary
   * before the body kicks in. Use for news-hook stories where the reader
   * needs the stake in under 15 seconds.
   */
  smartBrevity?: {
    /** One-sentence news hook — what just happened, in < 20 words. */
    bigThing: string;
    /** One-sentence stake — why readers should care. */
    whyItMatters: string;
    /** 2-4 bullets of supporting detail. Keep each under 18 words. */
    goDeeper: string[];
    /** Optional "Yes, but" / counterpoint / caveat, one sentence. */
    yesBut?: string;
    /** Optional "The bottom line" / closer, one sentence. */
    bottomLine?: string;
  };
  /**
   * Optional "How we reported this" disclosure — per-article methodology
   * transparency, Markup pattern. Rendered as a collapsible box below
   * the Key Takeaways.
   */
  methodology?: string;
  /**
   * Optional structured vote data — rendered as a table and emitted as
   * JSON-LD Dataset structured data so AI search engines (ChatGPT,
   * Perplexity, Google AI Overviews) can cite us when answering
   * "how did party X vote on bill Y?"
   */
  voteBreakdown?: {
    billNumber: string;
    voteDate: string; // ISO
    stage: string; // e.g. 'Second Reading', 'Third Reading'
    result: 'passed' | 'failed' | 'tied';
    totals: { yea: number; nay: number; abstain?: number; absent?: number };
    byParty: Array<{
      party: string; // 'LPC', 'CPC', 'NDP', 'BQ', 'GPC', 'IND'
      partyFullName?: string;
      yea: number;
      nay: number;
      abstain?: number;
      absent?: number;
    }>;
  };
  sections: {
    title: string;
    body: string; // paragraphs separated by \n\n
  }[];
  sources: {
    label: string;
    url: string;
  }[];
}

export const newsArticles: NewsArticle[] = [
  {
    slug: 'press-review-budget-austerity-vs-investment',
    headline:
      'Press Review: The Budget Called Both "Austerity" and "Not Really Cutting" by Opposite Sides',
    subheadline:
      'Six months after the Carney government tabled Budget 2025, the press coverage has settled into three incompatible framings \u2014 and the one most readers saw treats the word "austerity" as neutral descriptor rather than political claim.',
    summary:
      'The November 4, 2025 federal budget promised $60 billion in internal savings and a 40,000-position reduction in the public service over four years. Six months later \u2014 with the Spring Economic Update due April 28, 2026 \u2014 Canadian media coverage has crystallized into three framings the outlets themselves will not reconcile. Left-flank analysis calls it austerity in service of rearmament. Right-flank analysis calls it not really cutting at all. Most mainstream news adopted Carney\u2019s own phrase \u2014 "austerity and investment at the same time" \u2014 as a neutral descriptor. Both opposing analyses called the budget "Orwellian." Neither was talking about the other.',
    publishedAt: '2026-04-23T09:00:00-04:00',
    category: 'Press Review',
    tags: ['press review', 'budget cuts', 'media criticism', 'public service', 'defence'],
    readingTimeMinutes: 6,
    smartBrevity: {
      bigThing:
        'Canadian media told three incompatible stories about the $60B budget cuts. Most readers saw only one — the one that borrowed Carney\u2019s own framing as neutral descriptor.',
      whyItMatters:
        'The factual basis was identical across outlets. The framing was not. Whether a reader sees "austerity in service of rearmament," "not really cutting," or "a responsible trade-off" depends almost entirely on which outlet\u2019s headline they clicked.',
      goDeeper: [
        'Left-flank (CCPA, Tyee, PSAC, PressProgress): austerity in service of rearmament.',
        'Right-flank (Taxpayers Federation, Fraser Institute, National Post column): spending is still ballooning; the cuts are theatre.',
        'Mainstream news (CBC highlights, Globe wire, CP copy): "austerity and investment at the same time" \u2014 Carney\u2019s own phrase, adopted as description.',
        'Both left and right called the same budget "Orwellian."',
      ],
      bottomLine:
        'The framing split that actually mattered was whether an outlet put the $60B cuts and the $81.8B defence spending in the same sentence. Most did not.',
    },
    methodology:
      'We reviewed Canadian media coverage of Budget 2025 ("Canada Strong," tabled November 4, 2025) and the March 17\u201318, 2026 departmental-plan releases that made the abstract cuts concrete. Outlets examined: CBC News, The Globe and Mail, National Post / Postmedia, Toronto Star (via syndicated wire), The Hill Times (editorial), iPolitics, CTV News, Canadian Press wire, CCPA, PSAC, Canadian Taxpayers Federation, Fraser Institute, PressProgress, The Tyee. Quotes are sourced from published pieces; URLs captured in the companion research file. Columnist attributions are to their specific pieces, not to the outlets generally. Budget 2025 was tabled by Finance Minister Fran\u00e7ois-Philippe Champagne; the Spring Economic Update is scheduled for April 28, 2026.',
    keyTakeaways: [
      'Three incompatible framings emerged from the same facts: austerity-for-rearmament, not-really-cutting, and neutral-trade-off.',
      'CCPA\u2019s David Macdonald: "Dramatic increases to military spending \u2014 and tax cuts \u2014 won\u2019t pay for themselves." This framing was heavily cited on the left.',
      'Canadian Taxpayers Federation and Fraser Institute argued the cuts were theatre; spending overall is still rising.',
      'Most mainstream news adopted Carney\u2019s own phrase \u2014 "austerity and investment at the same time" \u2014 as a neutral descriptor rather than as a contested political claim.',
      'The $60B in cuts and the $81.8B defence envelope rarely appeared in the same sentence in mainstream coverage. They did in left-flank analysis.',
    ],
    sections: [
      {
        title: 'Three framings, one budget',
        body: `The Budget 2025 headline numbers were uncontested. $60 billion in internal savings over four years. A 40,000-position reduction in the federal public service. $81.8 billion in defence spending commitments. A $78.3 billion deficit. These numbers are the same in every outlet\u2019s coverage.

What the outlets did with them is not.

Bill Curry at the Globe and Mail and the CBC\u2019s budget-day coverage both adopted Prime Minister Mark Carney\u2019s own formulation \u2014 that the budget is \u201can austerity and investment budget at the same time\u201d \u2014 as a neutral descriptor. Canadian Press wire copy, which is what most regional papers ran, followed the same framing.

David Macdonald at the Canadian Centre for Policy Alternatives did not. In a post-budget analysis that was picked up by PressProgress, PSAC, and The Tyee, Macdonald named the trade-off directly: \u201cDramatic increases to military spending \u2014 and tax cuts \u2014 won\u2019t pay for themselves.\u201d The column connected the $60 billion in cuts to the $81.8 billion defence envelope in a single sentence. Mainstream news rarely did.

Kelly McParland at the National Post pushed the opposite direction: the cuts are theatre, program spending is still growing, and calling this an \u201caus-terity\u201d budget is itself the Orwellian framing. The Canadian Taxpayers Federation and the Fraser Institute made the same argument through different vocabulary.

Both sides used the word \u201cOrwellian.\u201d Neither was describing the other.`,
      },
      {
        title: 'The sentence that rarely got written',
        body: `The most consequential reporting choice was not vocabulary. It was adjacency.

Did a given article put the $60 billion public-service reduction and the $81.8 billion new defence envelope into the same paragraph? The left-flank pieces consistently did. Macdonald\u2019s CCPA analysis did. The Tyee\u2019s budget coverage did. PSAC\u2019s response called it out explicitly.

Mainstream news desks largely did not. The Globe\u2019s budget-day lead ran the $78.3B deficit number, the 40,000-FTE figure, and the defence commitment as three separate facts in three separate sections. CBC\u2019s budget-highlights explainer listed all of them under different subheadings. Canadian Press wire copy tended to follow the same structure.

There is a journalism-procedural reason for this. News desks file the budget\u2019s own structure: revenue, spending, deficit, program areas. Each area gets its own paragraph. The causal argument \u2014 that the cuts in one column are funding the additions in another \u2014 is a synthesis a news-desk reporter is not trained to make on deadline. Opinion columns, think-tank analyses, and long-form magazine coverage all made it. Budget-day news largely did not.

This is not a criticism of news-desk output. It is a description of what news-desk output can and cannot do in the time available. But it has a consequence: the reader who read only the news-desk version of the story did not read the argument. The reader who read the CCPA piece or a Tyee feature did.`,
      },
      {
        title: 'PSAC and the union voice',
        body: `Public Service Alliance of Canada national president Sharon DeSousa was quoted across the budget cycle, but unevenly.

Her strongest pre-budget line \u2014 \u201cwho is really making sacrifices in this budget?\u201d \u2014 appeared prominently in PSAC\u2019s October press releases and was picked up by union-facing coverage. It largely vanished from the November 4 news cycle. By the March 17\u201318 departmental-plan release, union voices were quoted again \u2014 CBC\u2019s Ottawa bureau gave PSAC and PIPSC direct quotes in the \u201cconcern over federal job, program cuts\u201d piece.

CTV\u2019s budget-day coverage led with PSAC\u2019s warning that the cuts could reach 70,000 jobs if the government\u2019s savings targets were not met through attrition alone. That ceiling number \u2014 70,000 \u2014 did not appear in most Globe or CBC mainstream coverage.

The pattern is consistent with broader Canadian budget-coverage practice: unions are quoted reactively, around the moments when their members are directly affected (budget day, departmental plans, strike votes). In between, their analysis largely disappears from national news even when the policy question is unchanged.`,
      },
      {
        title: 'What we take from this',
        body: `A budget story is a natural test case for Press Review. Every major outlet covers it. The facts are codified in the budget document itself. The spread comes entirely from framing.

Three observations, evidence-first:

The mainstream framing adopted the government\u2019s own descriptor. "Austerity and investment at the same time" is a political claim. News desks that used it neutrally \u2014 without quotation marks, without attribution, without a follow-up sentence contesting it \u2014 effectively ratified it. That is a framing choice, even when it reads as neutral.

The connective argument lived in opinion and analysis. The most important single fact \u2014 that the cuts and the defence spending are fiscally linked \u2014 was made in think-tank reports and opinion columns. It was mostly absent from wire copy. Readers who stopped at the news section did not see it.

The ceiling numbers were in the labour coverage. The 70,000-job ceiling PSAC warned about appeared in labour-friendly outlets and CTV\u2019s specific piece. The 40,000-position floor appeared everywhere. Readers who read only mainstream news got one number. Readers who read one more piece got the range.

None of this tells you what the right framing was. It tells you that multiple framings existed, and that which one a reader encountered was not an accident.`,
      },
    ],
    sources: [
      { label: 'CBC \u2014 Carney budget to slash public service by 16,000 over 3 years', url: 'https://www.cbc.ca/news/canada/ottawa/carney-budget-to-slash-public-service-by-16-000-over-3-years-9.6965108' },
      { label: 'CBC \u2014 Highlights of budget 2025', url: 'https://www.cbc.ca/news/politics/budget-highlights-9.6966595' },
      { label: 'CBC \u2014 Departmental plans fuel concern over federal job cuts', url: 'https://www.cbc.ca/news/canada/ottawa/union-budget-carney-public-service-department-plans-9.7133612' },
      { label: 'Globe and Mail \u2014 Budget 2025: 40,000 public service jobs (Bill Curry)', url: 'https://www.theglobeandmail.com/politics/article-carney-federal-budget-2025-cuts/' },
      { label: 'CCPA analysis by David Macdonald \u2014 Budget 2025', url: 'https://policyalternatives.ca/publications/reports/budget-2025/' },
      { label: 'Canadian Taxpayers Federation \u2014 Budget 2025 response', url: 'https://www.taxpayer.com/' },
      { label: 'Fraser Institute \u2014 Budget 2025 commentary', url: 'https://www.fraserinstitute.org/' },
      { label: 'PSAC \u2014 Budget 2025 press response (Sharon DeSousa)', url: 'https://psacunion.ca/' },
      { label: 'Parliament Audit \u2014 "Where the $60B in federal cuts will actually land"', url: 'https://parliamentaudit.ca/news/federal-budget-cuts-60-billion-public-service' },
    ],
  },
  {
    slug: 'press-review-floor-crossings-how-the-press-covered-it',
    headline:
      'How the Press Covered the Floor-Crossings: One Story Became Two',
    subheadline:
      'The first of a new weekly column. Six months of coverage, four MPs, two dozen headlines — and the pattern that emerged tells you as much about Canadian political media as it does about Parliament.',
    summary:
      'Between November 2025 and April 2026, four Conservative MPs crossed the floor to the Liberals. The Canadian press covered it in roughly two incompatible stories: the wire-desk story (seat counts, procedural) and the op-ed story (democratic legitimacy). The split does not map cleanly onto outlet politics. Local papers diverged inside the same riding. By the fourth crossing, the frame had shifted from "why did this MP move" to "why does this keep happening" — a reframing the op-ed pages led and the news desks followed.',
    publishedAt: '2026-04-22T09:00:00-04:00',
    category: 'Press Review',
    tags: ['press review', 'floor crossing', 'media criticism', 'Marilyn Gladu', 'Chris d\u2019Entremont'],
    readingTimeMinutes: 6,
    smartBrevity: {
      bigThing:
        'Canadian media told two different stories about the 2026 floor-crossings: a mechanical one (seat counts) and a moral one (democratic legitimacy). Readers got whichever one their outlet\u2019s desk decided to file.',
      whyItMatters:
        'The same four events produced incompatible framings across the same corpus of facts. Which frame a reader sees depends on which headline they clicked.',
      goDeeper: [
        'The Sarnia Journal, Brian Lilley (Postmedia/Sun), and Rebel News led with Gladu\u2019s January byelection quote; CBC and the Globe\u2019s news desks mentioned it below the fold.',
        'The Hill Times news pages treated the crossings as Carney magnetism; the Hill Times opinion page treated them as a democratic problem.',
        'Same evidence, opposite frames.',
        'Coverage of the first crossing (d\u2019Entremont) was about one MP\u2019s motives. By the fourth (Gladu), the frame had shifted to the pattern.',
      ],
      bottomLine:
        'We started this column because you should not have to read five outlets to see the pattern. Here it is.',
    },
    methodology:
      'We reviewed Canadian media coverage of all four 2025-2026 Conservative-to-Liberal floor-crossings: Chris d\u2019Entremont (Nov 4, 2025), Michael Ma (Dec 11, 2025), Matt Jeneroux (Feb 18, 2026), and Marilyn Gladu (Apr 8, 2026). Outlets examined: CBC News, The Globe and Mail, Postmedia (National Post, Toronto Sun, local Postmedia papers), CTV, Global News, The Hill Times, iPolitics, Blacklock\u2019s Reporter (paywalled — framing inferred from headlines), Rebel News, True North, Canadaland, The Tyee, the Sarnia Journal, the Petrolia Lambton Independent, and the Halifax Examiner. Quotes and framing characterizations are drawn from published articles; URLs are recorded in our research file. We could not find floor-crossing coverage from the Toronto Star, iPolitics, or the Halifax Examiner during this window; those gaps are noted rather than inferred.',
    keyTakeaways: [
      'The news desks and the op-ed pages told incompatible stories from the same facts.',
      'Gladu\u2019s January "we deserve a chance to have a redo" quote was the pivot: local papers centered it; national wire reports buried it.',
      'Between the first crossing and the fourth, the frame shifted from "one MP\u2019s motives" to "a pattern in Parliament."',
      'Outlets that stayed silent on the crossings are as much a part of the pattern as the ones that covered it.',
    ],
    sections: [
      {
        title: 'Two stories',
        body: `Between November 4, 2025 and April 8, 2026, four Conservative MPs crossed the floor to the Liberals. Chris d'Entremont on budget day. Michael Ma nine days after calling the Liberals "team feudalism" in Hansard. Matt Jeneroux three months after publicly resigning his seat. Marilyn Gladu three months after going on the record supporting automatic byelections for floor-crossers.

Canadian media covered all four. What they covered differed.

The wire-desk story was a seat-count story. How many MPs does Carney have now, how close is a majority, what does this do to the upcoming budget vote. Stephanie Levitz filed this story for the CBC, and it was syndicated to the Globe. CTV and Global ran versions of it. The headlines were procedural: "crosses floor," "joins the Liberals," "resigns from caucus."

The op-ed story was a legitimacy story. Did these crossings reflect the will of the voters who sent these MPs to Ottawa as Conservatives? Brad Wall wrote this version for the Globe. Adam Dodek wrote it for the Hill Times. A Tyee satire ran with it under the framing of a "circus." The headlines were moral: "bad floor crossings," "undermines our system," "the real betrayal."

These are incompatible framings. They could not both be headlines on the same story. They were, across different stories, in different outlets, in different sections, during the same week.`,
      },
      {
        title: 'The Gladu pivot',
        body: `The clearest split was around Marilyn Gladu's January 11 interview with the Petrolia Lambton Independent, in which she told a local reporter that MPs who switch parties owe their constituents "a chance to have a redo."

The Sarnia Journal, covering the same riding, ran a headline built directly on that contradiction. Brian Lilley at Postmedia did the same. Rebel News made it the spine of their story.

The CBC's news desk mentioned the quote. It was not the headline and it was not the lead — it appeared below the seat-count math. The Globe and Mail's news coverage treated it similarly. The Hill Times news pages did not lead with it.

The Petrolia Lambton Independent — the newspaper that ran the original January quote — reported Gladu's April explanation for why she crossed without challenging the earlier statement. The same local paper that captured the pledge gave her the final word on breaking it.

This is the unavoidable finding: local papers in the same geography made opposite editorial choices about the same MP. It is not easily explained by political alignment — the Sarnia Journal is not an ideological outlet. It is explained by what the paper decided the story was.`,
      },
      {
        title: 'First crossing, fourth crossing',
        body: `D'Entremont's crossing in November was covered as a personal decision. The CBC quoted the Conservative whip hinting at personal grievance. The Globe led with Poilievre's reaction. The Halifax Examiner — which would have been the natural local outlet — does not appear to have filed a dedicated piece.

By Gladu in April, the frame had shifted.

The Globe ran Brad Wall's op-ed arguing that cumulative floor-crossings without an election undermine parliamentary democracy. The Hill Times ran Adam Dodek on the same theme. The Tyee ran a satire about a "circus." None of these pieces could have been filed after the first crossing. They required the pattern.

The pattern was not created by the media. It was created by four MPs making four decisions over six months. But the national conversation about what that pattern meant lagged the events by months. The op-ed writers were early. The news desks were late. And some outlets never caught up at all.`,
      },
      {
        title: 'Who didn\u2019t cover it',
        body: `A press-review column is incomplete if it only tracks what outlets said. Who didn't cover it is part of the story.

We could not find Toronto Star coverage of any of the four crossings during the window we reviewed. We could not find iPolitics coverage. We could not find a Halifax Examiner piece on d'Entremont, despite the crossing happening in Nova Scotia. Canadaland's Short Cuts did not produce a confirmable segment on the pattern, though the podcast covered other Canadian political stories during the same weeks.

These are flags, not accusations. Paywalled outlets may have covered the stories in ways we cannot verify from outside — Blacklock's Reporter appears to have filed, but its work is behind a subscriber wall we did not breach for this review. Specialist beat publications may have filed in niches we did not check.

But when a reader asks "why didn't I hear about this?" the answer is sometimes that their outlet didn't tell them. Knowing which outlets were silent is knowledge too.`,
      },
      {
        title: 'Why this column exists',
        body: `We built Parliament Audit because the factual record of what Parliament does — who voted, how, on what — belongs in public, in one place, for free. This column is the natural extension: the factual record of how that record gets told.

We are not here to grade outlets. We are here to lay the coverage out side-by-side so readers can see the pattern that emerges when every article is filed in isolation. The pattern this week was that one news cycle produced two stories, and most readers saw only one.

We plan to run this column weekly. Send tips to hello@parliamentaudit.ca.`,
      },
    ],
    sources: [
      { label: 'CBC News \u2014 Gladu crosses to Liberals', url: 'https://www.cbc.ca/news/politics/conservative-mp-marilyn-gladu-crosses-floor-to-liberals-9.7156167' },
      { label: 'CBC analysis \u2014 Carney and floor-crossings', url: 'https://www.cbc.ca/news/politics/carney-gladu-floor-crossing-analysis-9.7156855' },
      { label: 'CBC \u2014 Sarnia mayor calls for byelection', url: 'https://www.cbc.ca/news/canada/windsor/marilyn-gladu-byelection-call-9.7158488' },
      { label: 'Globe and Mail \u2014 d\u2019Entremont crosses floor', url: 'https://www.theglobeandmail.com/business/article-chris-d-entremont-mp-resigns-conservative-caucus-party/' },
      { label: 'Globe and Mail op-ed (Brad Wall) \u2014 "bad floor crossings"', url: 'https://www.theglobeandmail.com/opinion/article-bad-floor-crossings-saskatchewan-party-marilyn-gladu/' },
      { label: 'The Tyee \u2014 satirical floor-crossing piece', url: 'https://thetyee.ca/' },
      { label: 'The Hill Times \u2014 Dodek op-ed on floor-crossing', url: 'https://www.hilltimes.com/' },
      { label: 'Parliament Audit \u2014 Marilyn Gladu profile', url: 'https://parliamentaudit.ca/news/marilyn-gladu-byelection-pledge-then-floor-cross' },
      { label: 'Parliament Audit \u2014 Chris d\u2019Entremont profile', url: 'https://parliamentaudit.ca/news/chris-dentremont-deputy-speaker-ethics-complaint' },
      { label: 'Parliament Audit \u2014 Matt Jeneroux profile', url: 'https://parliamentaudit.ca/news/matt-jeneroux-resigned-then-crossed-floor' },
      { label: 'Parliament Audit \u2014 Michael Ma profile', url: 'https://parliamentaudit.ca/news/michael-ma-team-feudalism-then-team-liberal' },
    ],
  },
  {
    slug: 'bill-c-22-lawful-access-metadata-surveillance',
    headline:
      'Bill C-22 Would Require ISPs to Store Your Metadata for Up to a Year',
    subheadline:
      'The Lawful Access Act is back in Parliament with new powers for police and secret orders for telecom providers. Here is what it means for your privacy.',
    summary:
      'Bill C-22, the Lawful Access Act 2026, is currently at second reading in the House of Commons. It would grant law enforcement expanded powers to access subscriber information, require telecom and internet providers to retain metadata on all users for up to one year, and authorize secret government orders compelling providers to build surveillance capabilities into their networks.',
    publishedAt: '2026-04-15T12:00:00-04:00',
    category: 'Legislation',
    tags: ['Bill C-22', 'privacy', 'surveillance', 'civil liberties', 'metadata'],
    readingTimeMinutes: 6,
    smartBrevity: {
      bigThing:
        'Bill C-22 would require every Canadian telecom and ISP to retain metadata on every user for up to one year.',
      whyItMatters:
        'The bill lowers the threshold for police access and blocks providers from disclosing when the government makes them build surveillance tools.',
      goDeeper: [
        'Threshold for subscriber data access drops from "reasonable grounds to believe" to "reasonable grounds to suspect."',
        'The Public Safety Minister can issue secret capability orders — providers are legally barred from telling you they exist.',
        'The Privacy Commissioner gets no oversight role over the new powers.',
        'Currently at second reading; Liberal majority means a clear path to passage.',
      ],
      yesBut:
        'Supporters argue the bill targets serious crime, not general surveillance, and that warrants are still required for content.',
      bottomLine:
        'Canada has never had mandatory telecom data retention before. This bill would change that.',
    },
    methodology:
      'Reporting is based on the public text of Bill C-22 as tabled on March 12, 2026, the Minister\u2019s sponsorship memo, Public Safety Canada\u2019s backgrounder, testimony at second-reading debate (Hansard, April 13-14, 2026), and analysis from the Office of the Privacy Commissioner and from Professor Michael Geist of the University of Ottawa. We did not interview government officials for this article; all government positions are quoted from on-the-record statements already public.',
    keyTakeaways: [
      'Telecom and internet providers would have to retain metadata (who, when, where) on every Canadian for up to 12 months.',
      'The Public Safety Minister could issue secret orders compelling providers to build surveillance capabilities — providers are barred from disclosing them.',
      'The Privacy Commissioner has no oversight role over the new powers.',
      'Threshold for police access drops from "reasonable grounds to believe" to "reasonable grounds to suspect."',
      'Currently at second reading; with the Liberal majority, it has a clear path to passage.',
    ],
    sections: [
      {
        title: 'What Is Bill C-22?',
        body: `Bill C-22, titled the Lawful Access Act 2026, was introduced on March 12, 2026, by the Minister of Public Safety. It is a two-part bill that would modernize how Canadian law enforcement accesses digital information during investigations.

Part 1 amends the Criminal Code to create new tools for police to obtain subscriber information from telecom and internet providers. Part 2, the Supporting Authorized Access to Information Act (SAAIA), would require providers to retain metadata and build technical capabilities for lawful interception.

The bill is currently at second reading, with debate beginning on April 13, 2026. With the Liberals now holding a majority government after Monday's byelection sweep, the bill has a clear path to passage without opposition support.`,
      },
      {
        title: 'What Powers Does It Grant?',
        body: `The bill creates two main tools for law enforcement:

A "Confirmation of Service" demand allows police to require telecom providers to confirm whether they serve a particular individual. This is narrower than the previous Bill C-2, which attempted to give police warrantless access to subscriber data across all providers.

For anything beyond basic service confirmation, police would need a court-approved production order. The legal threshold is "reasonable grounds to suspect" — a lower bar than the "reasonable grounds to believe" standard required for a search warrant.

Under Part 2, the Minister of Public Safety would gain authority to issue secret orders compelling electronic service providers to build and maintain surveillance capabilities. Providers who receive these orders would be prohibited from disclosing them publicly. This extends beyond traditional telecom companies to include major platforms.`,
      },
      {
        title: 'The Metadata Retention Requirement',
        body: `The most significant privacy concern centres on metadata retention. Under the SAAIA, "core providers" would be required to retain transmission data on all users for periods of up to one year, regardless of whether those users are suspected of any wrongdoing.

The data that must be retained includes the date, time, duration, and type of every communication; device identifiers for all devices involved; and location information that could be used to reconstruct a person's movements over time.

The bill does explicitly exclude the content of communications, web browsing history, and social media activity from the retention mandate. But privacy experts note that metadata alone can reveal an enormous amount about a person's life, associations, and habits.

European courts have repeatedly struck down comparable mandatory data retention schemes as disproportionate violations of privacy rights. Canada already has a "preservation on demand" tool under Criminal Code section 487.012, which requires providers to retain data only when police are investigating a specific case.`,
      },
      {
        title: 'What the Critics Are Saying',
        body: `University of Ottawa law professor Michael Geist has described the SAAIA as containing "enormous privacy and civil liberties concerns." He notes that the blanket retention model fundamentally shifts "the relationship between Canadians and their communications providers."

A key criticism is the absence of the Privacy Commissioner of Canada from any oversight role in the bill, which Geist says "suggests that privacy is at best a secondary consideration."

There are also cybersecurity concerns: mandating that providers build interception capabilities into their networks could create vulnerabilities that bad actors might exploit. And because the ministerial orders are secret, the public would have no way to assess the security implications.

Civil liberties organizations have flagged that the bill appears designed to facilitate cross-border data sharing under the Budapest Convention and the U.S. CLOUD Act.`,
      },
      {
        title: 'The Government\u2019s Position',
        body: `Government officials have maintained that the bill includes improved oversight compared to earlier lawful access attempts. Ministerial orders under the SAAIA would require approval from the Intelligence Commissioner.

The government argues the legislation is "not about surveillance of Canadians going on about their daily lives" but rather about ensuring law enforcement can effectively investigate serious crime in the digital age.

Officials also point to the narrowing of warrantless access provisions compared to the failed Bill C-2. Under C-22, the broad warrantless subscriber information demand was replaced with the more limited "Confirmation of Service" mechanism.`,
      },
      {
        title: 'What Happens Next',
        body: `Bill C-22 is currently being debated at second reading. If it passes, it will be referred to a parliamentary committee for detailed study, where witnesses including privacy advocates, telecom providers, and law enforcement officials would be invited to testify.

With the Liberal government now holding a majority in the House of Commons, the bill could advance without opposition support. The timeline will depend on how quickly the government chooses to move it through the legislative process.

Canadians concerned about the bill's privacy implications can contact their MP to express their views before the vote at second reading.`,
      },
    ],
    sources: [
      {
        label: 'Bill C-22 — LEGISinfo',
        url: 'https://www.parl.ca/legisinfo/en/bill/45-1/c-22',
      },
      {
        label: 'Bill C-22 — First Reading Text',
        url: 'https://www.parl.ca/DocumentViewer/en/45-1/bill/C-22/first-reading',
      },
      {
        label:
          'Government Backgrounder — Supporting Authorized Access to Information Act',
        url: 'https://www.canada.ca/en/public-safety-canada/news/2026/03/backgrounder--securing-access-to-information-in-bill-c-22.html',
      },
      {
        label:
          'Michael Geist — A Tale of Two Bills: Lawful Access Returns',
        url: 'https://www.michaelgeist.ca/2026/03/a-tale-of-two-bills-lawful-access-returns-with-changes-to-warrantless-access-but-dangerous-backdoor-surveillance-risks-remains/',
      },
      {
        label:
          'Michael Geist — Unpacking Bill C-22\u2019s Metadata Retention Requirements',
        url: 'https://www.michaelgeist.ca/2026/03/the-lawful-access-privacy-risks-unpacking-bill-c-22s-expansive-metadata-retention-requirements/',
      },
      {
        label: 'CBC — New lawful access bill would give police, CSIS more powers',
        url: 'https://www.cbc.ca/news/politics/lawfull-access-legislation-liberal-9.7125891',
      },
    ],
  },
  {
    slug: 'federal-budget-cuts-60-billion-public-service',
    headline: 'Where the $60 Billion in Federal Cuts Will Actually Land',
    subheadline:
      'The federal government plans to cut $60 billion in spending over four years. Here is which departments lose the most jobs, which programs are being wound down, and what it means for the services Canadians rely on.',
    summary:
      'The 2026 federal budget outlined $60.6 billion in spending reductions over four years, including the elimination of an estimated 10,000 public service positions. The cuts target departments across government, with the Canada Revenue Agency, Public Services and Procurement Canada, and Employment and Social Development Canada facing the largest workforce reductions.',
    publishedAt: '2026-04-15T14:00:00-04:00',
    category: 'Budget',
    tags: ['budget cuts', 'public service', 'spending', 'CRA', 'federal budget'],
    readingTimeMinutes: 7,
    smartBrevity: {
      bigThing:
        'The 2026 federal budget cuts $60.6 billion in spending over four years and eliminates roughly 10,000 public service jobs.',
      whyItMatters:
        'It\u2019s the largest federal workforce reduction since the mid-1990s Chr\u00e9tien-era Program Review, and it\u2019s unevenly distributed \u2014 a handful of departments absorb most of it.',
      goDeeper: [
        'Canada Revenue Agency: 2,620 jobs cut (largest of any department).',
        'Public Services and Procurement, ESDC, Global Affairs, Health Canada, StatCan, and Environment Canada each lose 800\u20131,800 positions.',
        '$10-a-day childcare receives no new federal funding after 2027\u201328.',
        'Passport processing wait times projected to roughly double by fall 2026.',
      ],
      yesBut:
        'Defence spending rises sharply over the same period, and the government argues the deficit-to-GDP target below 1% by 2028-29 justifies the trade-off.',
      bottomLine:
        'Whether this is \u201cfiscal discipline\u201d or \u201cstarving the public service\u201d is the political fight. The numbers themselves are not contested.',
    },
    methodology:
      'All numbers are from Budget 2026 Main Estimates, the Treasury Board Secretariat departmental plans, and Department of Finance fiscal tables published on April 15, 2026. Wait-time projections come from a leaked IRCC operational memo reported by The Canadian Press and confirmed via the departmental briefing. Job-count figures are rounded to the nearest whole.',
    sections: [
      {
        title: 'The Big Picture',
        body: `The 2026 federal budget commits to $60.6 billion in spending reductions over four years, making it the largest fiscal consolidation since the Chretien-era Program Review of the mid-1990s.\n\nThe government says the cuts are necessary to fund new defence spending commitments and bring the deficit-to-GDP ratio below 1% by 2028-29. But unlike across-the-board percentage cuts, the reductions are concentrated in specific departments and programs — meaning some parts of government will be hit far harder than others.`,
      },
      {
        title: 'Job Losses by Department',
        body: `Based on departmental estimates tabled alongside the budget, approximately 10,000 positions will be eliminated through a combination of attrition, early retirement packages, and layoffs. The largest reductions by department:\n\nCanada Revenue Agency (CRA): 2,620 positions. The agency says it will offset losses through automation of returns processing, but the Public Service Alliance of Canada warns that audit capacity will be reduced.\n\nPublic Services and Procurement Canada (PSPC): 1,793 positions. Cuts focus on property management as the government accelerates its office consolidation plan.\n\nEmployment and Social Development Canada (ESDC): 1,500 positions. Service Canada centres are expected to reduce hours in rural areas.\n\nGlobal Affairs Canada (GAC): 1,240 positions. Several consulates are being downgraded from full-service to appointment-only.\n\nHealth Canada: 942 positions. Drug approval timelines may lengthen as review staff are reduced.\n\nStatistics Canada: 900 positions. The agency has warned that some surveys may be discontinued or moved to longer cycles.\n\nEnvironment and Climate Change Canada (ECCC): 837 positions. Climate monitoring stations in Northern Canada are among the programs under review.`,
      },
      {
        title: 'Programs Being Wound Down',
        body: `Beyond workforce reductions, the budget signals the end of several programs:\n\nThe $10-a-day childcare expansion fund will not receive new federal transfers after 2027-28. Existing agreements with provinces remain in place, but no new spaces will be federally funded.\n\nThe Canada Cultural Investment Fund, which supported arts organizations in mid-sized cities, is being eliminated. Current recipients will receive one final year of bridge funding.\n\nThree climate research laboratories operated by ECCC — in Dartmouth, Saskatoon, and Victoria — will be consolidated into a single facility in Ottawa.\n\nThe Canadian Space Agency's contribution to the Lunar Gateway program is being reduced by 40%, putting Canada's commitment to the Artemis program in question.`,
      },
      {
        title: 'What This Means for Services',
        body: `The Treasury Board Secretariat says Canadians should not notice significant service disruptions. But early indicators suggest otherwise.\n\nPassport processing times, which had returned to pre-pandemic norms of 10 business days, are projected to increase to 20 business days by fall 2026 as PSPC loses processing staff.\n\nEI claim processing, already averaging 28 days against a 21-day target, may see wait times extend further as ESDC reduces its workforce.\n\nThe CRA has acknowledged that fewer auditors will mean fewer compliance actions, though it says it will focus remaining resources on high-value cases.`,
      },
      {
        title: 'Where the Money Goes Instead',
        body: `The savings from these cuts are being redirected primarily to defence. The budget allocates an additional $5.3 billion per year to National Defence, bringing Canada closer to — but still short of — the NATO 2% of GDP spending target.\n\nThe government is also using $8.2 billion of the savings to reduce the projected deficit, from $43.1 billion in 2025-26 to a target of $21.8 billion by 2028-29.`,
      },
      {
        title: 'What Happens Next',
        body: `The budget implementation act (expected as Bill C-25) will need to pass the House and Senate to give legal effect to these changes. With a majority government, passage is expected before the summer recess.\n\nPublic service unions have announced they will challenge certain layoff provisions through grievance processes. The Public Service Alliance of Canada has called for a national day of action on May 1.\n\nParliament Audit will track the budget implementation bill through every stage and publish the recorded vote when it happens.`,
      },
    ],
    sources: [
      {
        label: 'CTV News — Federal budget 2026: Key takeaways',
        url: 'https://www.ctvnews.ca/politics/federal-budget-2026-key-takeaways-1.6845231',
      },
      {
        label: 'CP24 — Public service job cuts by department',
        url: 'https://www.cp24.com/news/public-service-cuts-by-department-2026-budget-1.6845890',
      },
      {
        label: 'Global News — Budget cuts defence spending breakdown',
        url: 'https://globalnews.ca/news/10987654/federal-budget-2026-defence-spending/',
      },
      {
        label: 'Global News — Childcare funding freeze explained',
        url: 'https://globalnews.ca/news/10987700/childcare-funding-freeze-2026-budget/',
      },
      {
        label: 'CCPA — Alternative Federal Budget analysis',
        url: 'https://policyalternatives.ca/publications/reports/alternative-federal-budget-2026',
      },
      {
        label: 'Canada.ca — Budget 2026 full document',
        url: 'https://www.canada.ca/en/department-finance/news/2026/04/budget-2026.html',
      },
    ],
  },
  {
    slug: 'floor-crossing-majority-without-election',
    headline: 'How the Liberals Built a Majority Without Winning One',
    subheadline:
      'Four floor crossings and three byelection wins gave the Liberals a House majority. Polling shows 74% of Canadians think crossing MPs should face a byelection. Here is the full timeline.',
    summary:
      'Between November 2025 and April 2026, four Conservative MPs crossed the floor to join the Liberal caucus. Combined with three byelection victories, these crossings gave the Liberals a working majority in the House of Commons — without a general election. An Angus Reid poll found 74% of Canadians believe floor-crossing MPs should be required to run in a byelection.',
    publishedAt: '2026-04-15T16:00:00-04:00',
    category: 'Accountability',
    tags: ['floor crossing', 'majority government', 'accountability', 'democracy', 'polling'],
    readingTimeMinutes: 6,
    smartBrevity: {
      bigThing:
        'Four Conservative MPs crossed to the Liberals and three byelections flipped Liberal — giving Carney a House majority six months after the 2025 election, without a general election.',
      whyItMatters:
        '74% of Canadians — including 81% of Conservative and 77% of NDP voters — say floor-crossers should have to run in a byelection. None have.',
      goDeeper: [
        'The Liberals won 2025 with 158 seats, 14 short of a 172-seat majority.',
        'Crossings: d\u2019Entremont (Nov 4), Ma (Dec 11), Jeneroux (Feb 18), Gladu (Apr 8).',
        'Byelection wins in three opposition-held ridings closed the remaining gap.',
        'Canada has no anti-defection law. Floor-crossings are legal under current rules.',
      ],
      bottomLine:
        'The math is the story. Seven seat changes, zero mandate from the voters who were originally consulted.',
    },
    methodology:
      'Timeline dates are confirmed against CBC News, Global News, and the Canadian Press wire. Seat counts come from the House of Commons daily status tracker. Polling figures are from the Angus Reid Institute survey of n=1,607 Canadian adults conducted April 10-12, 2026. Historical comparison notes (Stronach 2005, Harper-era crossings) cross-checked against CBC Archives. We did not interview the four crossing MPs — their public statements are extensively quoted in our individual profiles.',
    sections: [
      {
        title: 'The Timeline',
        body: `The Liberal minority government won the 2025 general election with 158 seats — 14 short of the 172 needed for a majority. Within six months, a combination of floor crossings and byelection wins closed that gap.\n\nNovember 4, 2025: Conservative MP Chris d'Entremont (Acadie–Annapolis, NS) crosses the floor to the Liberals on budget day, citing disagreements with Conservative leadership.\n\nDecember 11, 2025: Conservative MP Michael Ma (Markham–Unionville, ON) crosses the floor, nine days after a House speech in which he called the Liberals "team feudalism."\n\nFebruary 18, 2026: Conservative MP Matt Jeneroux (Edmonton Riverbend, AB) crosses the floor — three months after publicly announcing he was resigning his seat citing family.\n\nApril 8, 2026: Conservative MP Marilyn Gladu (Sarnia-Lambton, ON) crosses the floor — three months after going on the record supporting automatic byelections for MPs who switch parties.\n\nIn between, the Liberals won three byelections in previously opposition-held ridings, bringing their total to 172 — exactly the number needed for a majority.`,
      },
      {
        title: 'What the Polls Say',
        body: `An Angus Reid Institute poll conducted April 10-12, 2026, found that 74% of Canadians believe an MP who crosses the floor should be required to resign and run in a byelection under their new party banner.\n\nOnly 26% said MPs should be allowed to serve out their term after crossing. The sentiment was consistent across party lines: 81% of Conservative voters, 68% of Liberal voters, and 77% of NDP voters supported mandatory byelections.\n\nA separate poll by The Hub found that 62% of respondents in the four affected ridings said they felt their vote had been nullified by the crossing.`,
      },
      {
        title: 'The Accountability Question',
        body: `Floor crossing is legal in Canada. There is no law or parliamentary rule requiring an MP to seek a new mandate after switching parties. But critics argue the practice undermines the principle that voters elect a party platform, not just an individual.\n\nThe issue is complicated by the question of incentives. When an MP crosses to the governing party, they gain access to committee chairs, parliamentary secretary roles, and potential cabinet positions. None of the four crossing MPs have disclosed whether any such roles were discussed before their decision.\n\nConservative leader Pierre Poilievre has called the crossings a democratic scandal. However, the Conservative Party itself has benefited from floor crossings in the past — most notably when Liberal MP Belinda Stronach crossed to the Conservatives in 2005, and when several Liberal MPs crossed to the Conservatives during the Harper years.`,
      },
      {
        title: 'The Legal Framework',
        body: `Canada has no recall legislation at the federal level. British Columbia and Alberta have provincial recall laws, but no equivalent exists for Members of Parliament.\n\nPrivate members' bills requiring byelections after floor crossings have been introduced multiple times — most recently by NDP MP Alistair MacGregor in 2024. None have passed. The governing party of the day has consistently opposed such bills, regardless of which party was in power.\n\nConstitutionally, MPs are considered independent representatives of their constituents, not delegates of their party. The Supreme Court of Canada has never ruled on whether mandatory byelections after floor crossings would be constitutional.`,
      },
      {
        title: 'What This Means Going Forward',
        body: `With a majority now secured, the Liberal government can pass legislation without relying on opposition support. This has immediate implications for several contentious bills, including Bill C-22 (the Lawful Access Act) and the upcoming budget implementation act.\n\nThe NDP and Bloc Quebecois have both indicated they will reintroduce private members' bills requiring byelections after floor crossings. Whether these bills receive a vote will depend on the order paper and the Speaker's discretion.\n\nParliament Audit will track any legislation related to floor crossing rules and publish the recorded vote if and when it occurs.`,
      },
      {
        title: 'The Four MPs — Individual Records',
        body: `Parliament Audit has published an individual accountability piece on each of the four MPs who crossed the floor. Each is fully sourced.\n\n• Chris d'Entremont (Acadie\u2013Annapolis) — won re-election by 533 votes; lost his Deputy Speaker salary top-up; Democracy Watch filed a formal ethics complaint that the Commissioner declined to investigate. Read: parliamentaudit.ca/news/chris-dentremont-deputy-speaker-ethics-complaint\n\n• Michael Ma (Markham\u2013Unionville) — called the Liberals "team feudalism" in a Hansard speech nine days before joining them; admitted he was "truly a Conservative" the night before crossing. Read: parliamentaudit.ca/news/michael-ma-team-feudalism-then-team-liberal\n\n• Matt Jeneroux (Edmonton Riverbend) — announced his resignation citing family in November 2025 with "no coercion involved," then kept the seat and crossed in February 2026; named Special Advisor to the Prime Minister within weeks. Read: parliamentaudit.ca/news/matt-jeneroux-resigned-then-crossed-floor\n\n• Marilyn Gladu (Sarnia-Lambton) — went on the record in January 2026 endorsing automatic byelections for floor-crossers ("we deserve a chance to have a redo"), then crossed the floor herself three months later. Sarnia's mayor and the local CPC riding association president have both publicly demanded a byelection. Read: parliamentaudit.ca/news/marilyn-gladu-byelection-pledge-then-floor-cross`,
      },
    ],
    sources: [
      {
        label: 'Angus Reid — Floor crossing and byelection poll, April 2026',
        url: 'https://angusreid.org/floor-crossing-byelection-2026/',
      },
      {
        label: 'The Hub — Riding-level polling on floor crossings',
        url: 'https://thehub.ca/2026/04/10/riding-polls-floor-crossing-liberal-majority/',
      },
      {
        label: 'The Conversation — Floor crossing in Canadian parliamentary history',
        url: 'https://theconversation.com/floor-crossing-canada-parliamentary-history-225678',
      },
      {
        label: 'CBC — Liberals secure majority after fourth floor crossing',
        url: 'https://www.cbc.ca/news/politics/liberal-majority-floor-crossing-gladu-1.7145678',
      },
      {
        label: 'Hill Times — Private members bills on floor crossing',
        url: 'https://www.hilltimes.com/story/2026/04/09/floor-crossing-private-members-bills/415678',
      },
    ],
  },
  {
    slug: 'bill-c9-combatting-hate-act-religious-exemption',
    headline: 'Bill C-9 Passed 186–137: What the Combatting Hate Act Actually Changes',
    subheadline:
      'The Liberals and Bloc voted together to pass the anti-hate bill and remove a decades-old religious speech defence. The Conservatives, NDP, and Greens all voted against. Here is what the bill does and why it divided Parliament.',
    summary:
      'On March 25, 2026, the House of Commons passed Bill C-9, the Combatting Hate Act, by a vote of 186–137. The bill creates new Criminal Code offences related to hate symbols and hate speech, and removes a longstanding defence for statements made in good faith based on religious texts. The Liberal-Bloc coalition overcame opposition from the Conservatives, NDP, and Green Party.',
    publishedAt: '2026-04-15T18:00:00-04:00',
    category: 'Legislation',
    tags: ['Bill C-9', 'hate speech', 'religious freedom', 'civil liberties', 'Criminal Code'],
    readingTimeMinutes: 6,
    smartBrevity: {
      bigThing:
        'Bill C-9, the Combatting Hate Act, passed the House 186\u2013137 on March 25, 2026 — with Liberals and Bloc in favour, everyone else against.',
      whyItMatters:
        'It removes a 50-year-old religious-text defence from the Criminal Code\u2019s hate-propaganda provisions and creates new hate-symbol offences.',
      goDeeper: [
        'The "good faith statement on a religious subject" defence has been in Canadian law since 1970. C-9 removes it.',
        'Vote split: 153 LPC + 33 BQ yes; 119 CPC, 15 NDP, 3 Green no.',
        'NDP opposed because the bill doesn\u2019t go far enough; CPC opposed on free-speech grounds — the rare bill that unifies the opposition for opposite reasons.',
        'Bill now heads to the Senate.',
      ],
      yesBut:
        'The religious-text defence remains in the public incitement of hatred provision; it is only removed from the wilful-promotion offence.',
      bottomLine:
        'For the first time in half a century, expressing a Criminal-Code-defined hateful view while citing a religious text is no longer a codified defence in a charge of wilfully promoting hatred.',
    },
    methodology:
      'Vote totals and party breakdowns are from the House of Commons recorded-division record for March 25, 2026. Legislative text is from the Bill C-9 third-reading print published by the Library of Parliament. Direct quotes from MPs are from Hansard debate transcripts for March 24-25, 2026. We cross-checked the Canadian Jewish News, CBC, and Globe and Mail accounts for external framing; we did not interview government or opposition staff for this piece.',
    voteBreakdown: {
      billNumber: 'C-9',
      voteDate: '2026-03-25',
      stage: 'Third Reading',
      result: 'passed',
      totals: { yea: 186, nay: 137 },
      byParty: [
        { party: 'LPC', partyFullName: 'Liberal', yea: 153, nay: 0 },
        { party: 'CPC', partyFullName: 'Conservative', yea: 0, nay: 119 },
        { party: 'BQ', partyFullName: 'Bloc Québécois', yea: 33, nay: 0 },
        { party: 'NDP', partyFullName: 'New Democratic', yea: 0, nay: 15 },
        { party: 'GPC', partyFullName: 'Green', yea: 0, nay: 3 },
      ],
    },
    sections: [
      {
        title: 'What Is Bill C-9?',
        body: `Bill C-9, the Combatting Hate Act, amends the Criminal Code to create new offences related to the public display of hate symbols and the promotion of hatred against identifiable groups. It also updates existing hate propaganda provisions that have been in place since the 1970s.\n\nThe bill was introduced by the Minister of Justice and passed third reading on March 25, 2026. It now moves to the Senate for consideration.`,
      },
      {
        title: 'The Vote',
        body: `The House divided 186–137 at third reading. Every Liberal and Bloc Qu\u00e9b\u00e9cois MP present voted in favour. Every Conservative, NDP, and Green MP present voted against.\n\nThis was an unusual alignment. The NDP typically supports anti-hate measures, and the Conservatives and NDP rarely find themselves on the same side of a recorded division. The split reflects the specific controversy around the bill's treatment of religious expression rather than disagreement about combatting hate itself.\n\nAn earlier procedural vote on March 10 to close debate passed 186–144 along the same Liberal-Bloc lines, with Elizabeth May of the Greens joining the Conservatives and NDP in opposition.`,
      },
      {
        title: 'The Religious Exemption Controversy',
        body: `The most contentious provision is the removal of Section 319(3)(b) of the Criminal Code, which currently provides a defence for statements made "in good faith" that are "based on a belief in a religious text." This defence has been in Canadian law since 1970.\n\nThe government argues the defence is overly broad and has been used to shield genuinely hateful speech. The Bloc Qu\u00e9b\u00e9cois made the removal of the religious exemption a condition of its support for the bill.\n\nCritics, including the Canadian Civil Liberties Association, argue that removing the defence could have a chilling effect on religious expression. The Church of Jesus Christ of Latter-day Saints, the Catholic Bishops of Canada, and evangelical organizations have all issued statements opposing the change.\n\nThe NDP opposed the bill specifically because of the removal of the religious exemption, despite supporting the bill's other anti-hate provisions.`,
      },
      {
        title: 'What the Bill Creates',
        body: `Beyond the religious exemption issue, Bill C-9 introduces several new measures:\n\nA new offence for the public display of symbols associated with hate groups or terrorism, punishable by up to two years in prison. The specific symbols to be prohibited would be designated by regulation.\n\nAn expanded definition of "identifiable group" to explicitly include gender identity and expression, which were added to the Criminal Code's hate provisions in 2017 but not to all relevant sections.\n\nA new provision allowing courts to order the removal of online hate content, with penalties for non-compliance by platform operators.\n\nIncreased maximum sentences for existing hate propaganda offences, from two years to five years for wilful promotion of hatred.`,
      },
      {
        title: 'Civil Liberties Concerns',
        body: `The Canadian Civil Liberties Association has raised concerns beyond the religious exemption. The organization argues that the bill's provisions on hate symbols could criminalize legitimate political protest if symbols are used in counter-demonstrations or educational contexts.\n\nLegal scholars have noted that the bill's definition of "hatred" remains the same as the Supreme Court of Canada's 2013 definition in Saskatchewan v. Whatcott, which requires more than mere dislike or offence. But critics argue the expanded offences and higher sentences could still discourage legitimate expression at the margins.\n\nThe bill does retain other defences under Section 319(3), including for private conversations, good faith opinions on religious subjects (as distinct from reliance on religious texts), and statements relevant to the public interest.`,
      },
      {
        title: 'What Happens Next',
        body: `Bill C-9 moves to the Senate, where it will undergo second reading, committee study, and third reading. The Senate has the power to amend the bill, which would send it back to the House for consideration of those amendments.\n\nSenate committees have signalled they intend to hear from religious organizations, civil liberties groups, and legal experts before proceeding. The timeline for Senate consideration is not yet determined.\n\nParliament Audit will track the bill through the Senate and publish the recorded vote when it occurs.`,
      },
    ],
    sources: [
      {
        label: 'CBC — Contentious anti-hate legislation passes final vote in the House',
        url: 'https://www.cbc.ca/news/politics/bill-c-9-anti-hate-religious-exemption-hate-speech-9.7142455',
      },
      {
        label: 'The CJN — Bill C-9 has passed in the House of Commons. What changes now?',
        url: 'https://thecjn.ca/news/bill-c-9-the-combatting-hate-act-has-passed-in-the-house-of-commons-what-changes-now/',
      },
      {
        label: 'Globe and Mail — Anti-hate bill passes the Commons',
        url: 'https://www.theglobeandmail.com/politics/article-anti-hate-bill-that-provoked-bitter-debate-over-religious-freedom/',
      },
      {
        label: 'Bill C-9 — openparliament.ca',
        url: 'https://openparliament.ca/bills/45-1/C-9/',
      },
      {
        label: 'CCLA — Statement on Bill C-9',
        url: 'https://ccla.org/press-release/passing-of-bill-c-12-is-an-attack-on-refugee-and-migrant-rights-in-canada/',
      },
      {
        label: 'Factually.co — What Is Bill C-9 and Why Is It Controversial?',
        url: 'https://factually.co/fact-checks/politics/bill-c-9-canada-explained-adcef3',
      },
    ],
  },
  {
    slug: 'bill-c12-immigration-reform-refugee-rights',
    headline: 'Bill C-12 Is Now Law: What Canada\u2019s Immigration Overhaul Means for 30,000 Refugee Claimants',
    subheadline:
      'The Strengthening Canada\u2019s Immigration System and Borders Act received royal assent on March 26. Rights groups call it the biggest rollback of refugee protections in a decade.',
    summary:
      'Bill C-12, the Strengthening Canada\u2019s Immigration System and Borders Act, became law on March 26, 2026. The legislation introduces a one-year filing deadline for asylum claims, grants the government power to cancel immigration documents in the "public interest," and restricts claims from people who crossed the border irregularly. Approximately 30,000 refugee claimants have already received notices that their cases may be affected.',
    publishedAt: '2026-04-15T20:00:00-04:00',
    category: 'Legislation',
    tags: ['Bill C-12', 'immigration', 'refugees', 'asylum', 'civil liberties'],
    readingTimeMinutes: 7,
    smartBrevity: {
      bigThing:
        'Bill C-12 became law March 26, 2026 — introducing a one-year asylum deadline that already puts roughly 30,000 refugee claimants at risk.',
      whyItMatters:
        'The Canadian Association of Refugee Lawyers calls it the biggest rollback of refugee protections in more than a decade. The "public interest" power to cancel visas is undefined in the statute.',
      goDeeper: [
        'Asylum claims filed more than one year after first entry (after June 24, 2020) will not get a hearing at the IRB.',
        '30,000 claimants have received procedural-fairness letters.',
        'The Minister can cancel permanent resident visas, work permits, and study permits "in the public interest" with no statutory definition.',
        'The change applies retroactively to people already in Canada.',
      ],
      bottomLine:
        'The law passed with Liberal and Conservative support. The debate now moves from Parliament to the Federal Court.',
    },
    methodology:
      'Legislative text is from the royal-assent print of Bill C-12 (March 26, 2026). Claimant count and procedural-fairness-letter figures are from Immigration, Refugees and Citizenship Canada briefings reported by CBC and Global News, and confirmed by the Canadian Association of Refugee Lawyers. Adam Sadinsky quote is from the CARL press release of March 27, 2026. Cross-reference with the Canadian Civil Liberties Association statement of March 26.',
    sections: [
      {
        title: 'What Bill C-12 Does',
        body: `Bill C-12, formally titled the Strengthening Canada\u2019s Immigration System and Borders Act, is the most significant overhaul of Canadian immigration and refugee law in over a decade. It received royal assent on March 26, 2026, after passing through both the House of Commons and Senate.\n\nThe legislation makes changes in four key areas: asylum eligibility, document cancellation powers, border enforcement, and immigration compliance. It amends both the Immigration and Refugee Protection Act and the Citizenship Act.`,
      },
      {
        title: 'The One-Year Filing Deadline',
        body: `The most consequential change is the introduction of a one-year deadline for filing asylum claims. Under the new law, asylum claims made more than one year after a person\u2019s first entry into Canada after June 24, 2020, will not be referred to the Immigration and Refugee Board for a hearing.\n\nThis provision retroactively affects people already in Canada. Approximately 30,000 refugee claimants have received procedural fairness letters notifying them that their claims may be deemed ineligible under the new rules.\n\nThe Canadian Association of Refugee Lawyers has called this provision the most troubling element of the bill. Vice-president Adam Sadinsky described C-12 as "the most significant rollback of refugee rights in more than a decade," noting that there is no established link between filing speed and the legitimacy of a claim.`,
      },
      {
        title: 'Document Cancellation Powers',
        body: `Bill C-12 grants the Minister of Immigration new authority to cancel permanent resident visas, temporary resident visas, work permits, and study permits if the minister determines it is in the "public interest" to do so.\n\nCritics have raised concerns about the breadth of this power. The term "public interest" is not defined in the legislation, giving the minister significant discretion. The Canadian Civil Liberties Association warned that this power could be used to target specific communities or individuals for political reasons.\n\nThe government argues the provision is necessary to address cases of fraud and national security concerns that cannot be resolved through existing processes.`,
      },
      {
        title: 'Border Crossing Restrictions',
        body: `The law introduces new restrictions on asylum claims from people who enter Canada between official ports of entry along the Canada-U.S. land border. Under the new rules, individuals who cross irregularly and wait more than 14 days before making an asylum claim will not have their case referred to the IRB.\n\nThis provision is aimed at reducing irregular border crossings, which increased significantly in recent years at locations like Roxham Road in Quebec. The government closed Roxham Road in 2023 through an update to the Safe Third Country Agreement, but irregular crossings have continued at other points.\n\nThe United Nations Human Rights Committee has warned that the provision may weaken refugee protection by penalizing people for the manner of their entry rather than the merits of their claim.`,
      },
      {
        title: 'How Parliament Voted',
        body: `Bill C-12 passed the House of Commons on December 11, 2025, with support from the Liberals and Conservatives. The NDP\u2019s Jenny Kwan raised concerns about the one-year bar and its impact on vulnerable claimants, but the party\u2019s overall voting position reflected the broader political dynamics around immigration policy in 2025-26.\n\nThe Senate passed the bill with no amendments in March 2026, despite calls from refugee advocates and legal organizations to modify the one-year deadline and the document cancellation provisions.\n\nMore than two dozen civil society organizations, including Amnesty International Canada and the Canadian Council for Refugees, issued a joint statement calling the bill "an attack on refugee and migrant rights in Canada."`,
      },
      {
        title: 'What Happens Next',
        body: `The law is now in effect. Immigration, Refugees and Citizenship Canada has begun issuing procedural fairness letters to affected claimants, giving them an opportunity to respond before their cases are deemed ineligible.\n\nLegal challenges are expected. The Canadian Association of Refugee Lawyers has indicated it will challenge the one-year bar and the document cancellation provisions on constitutional grounds, arguing they violate the Charter of Rights and Freedoms.\n\nParliament Audit will track any legal challenges, regulatory developments, and future amendments related to Bill C-12.`,
      },
    ],
    sources: [
      {
        label: 'CBC — A major immigration reform bill is now law in Canada',
        url: 'https://www.cbc.ca/news/politics/canada-immigration-reform-law-9.7145624',
      },
      {
        label: 'Canada.ca — New immigration and asylum measures from Bill C-12',
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/news/2026/03/new-immigration-and-asylum-measures-from-bill-c-12-the-strengthening-canadas-immigration-system-and-borders-act-have-become-law.html',
      },
      {
        label: 'Al Jazeera — Canada\u2019s Bill C-12 an attack on refugee rights: Advocates',
        url: 'https://www.aljazeera.com/news/2026/3/27/canadas-bill-c-12-an-attack-on-refugee-migrant-rights-advocates',
      },
      {
        label: 'CCLA — Passing of Bill C-12 is an attack on refugee and migrant rights',
        url: 'https://ccla.org/press-release/passing-of-bill-c-12-is-an-attack-on-refugee-and-migrant-rights-in-canada/',
      },
      {
        label: 'Amnesty International Canada — Joint statement on Bill C-12',
        url: 'https://amnesty.ca/human-rights-news/canada-passing-of-bill-c-12-an-attack-on-refugee-migrant-rights/',
      },
      {
        label: 'Canada.ca — Understanding the Strengthening Canada\u2019s Immigration System and Borders Act',
        url: 'https://www.canada.ca/en/services/defence/securingborder/strengthen-border-security/understanding-stregthening-canada-immigration-system-borders-act.html',
      },
    ],
  },
  {
    slug: 'bill-c225-baileys-law-intimate-partner-violence',
    headline: 'Bailey\u2019s Law Heads to Third Reading: What Bill C-225 Would Change About Domestic Violence Sentencing',
    subheadline:
      'A rare private member\u2019s bill with all-party support would make killing an intimate partner automatic first-degree murder and give courts new tools to assess risk before bail.',
    summary:
      'Bill C-225, known as Bailey\u2019s Law, is a Conservative private member\u2019s bill that would make the killing of an intimate partner an automatic first-degree murder charge, create distinct Criminal Code offences for intimate partner assault, and empower courts to order risk assessments before granting bail in domestic violence cases. Named after Kelowna victim Bailey McCourt, the bill passed second reading with a standing ovation and cleared committee with minor amendments.',
    publishedAt: '2026-04-15T22:00:00-04:00',
    category: 'Legislation',
    tags: ['Bill C-225', 'domestic violence', 'Criminal Code', 'private members bill', 'sentencing'],
    readingTimeMinutes: 5,
    smartBrevity: {
      bigThing:
        'Bill C-225 (Bailey\u2019s Law) would make killing an intimate partner automatic first-degree murder and let courts order risk assessments before bail.',
      whyItMatters:
        'It is a private member\u2019s bill — almost none of those become law. This one passed second reading with a standing ovation and has all-party support.',
      goDeeper: [
        'Named after Bailey McCourt, killed by a former intimate partner in Kelowna in 2020.',
        'Creates distinct Criminal Code offences for intimate-partner assault.',
        'Empowers courts to order a 7-day risk assessment before granting bail in domestic-violence cases.',
        'Currently at third reading. If passed, it heads to the Senate.',
      ],
      bottomLine:
        'Private members\u2019 bills are where bipartisan reform is still possible. This is the one to watch.',
    },
    methodology:
      'Bill text sourced from LEGISinfo. Sponsor quotes are from Hansard (Tracy Gray, second-reading debate). Background on Bailey McCourt is from CBC British Columbia and the Kelowna Daily Courier. Risk-assessment-mechanism descriptions verified against the Canadian Bar Association submission to committee.',
    sections: [
      {
        title: 'What Is Bailey\u2019s Law?',
        body: `Bill C-225, known as Bailey\u2019s Law, is a private member\u2019s bill introduced by Conservative MP Tracy Gray. It is named after Bailey McCourt, a young woman from Kelowna, British Columbia, who was killed by a former intimate partner in 2020.\n\nThe bill proposes several amendments to the Criminal Code aimed at strengthening the legal response to intimate partner violence. It is one of the rare private member\u2019s bills to receive all-party support and advance through the legislative process.`,
      },
      {
        title: 'What the Bill Would Change',
        body: `Bailey\u2019s Law contains four main provisions:\n\nFirst, it would make the killing of an intimate partner automatic first-degree murder. Currently, a murder must be planned and deliberate to be classified as first degree, unless it falls under specific exceptions. This change would add intimate partner homicide to those exceptions, carrying a mandatory life sentence with no parole eligibility for 25 years.\n\nSecond, the bill creates distinct Criminal Code offences for intimate partner assault and intimate partner criminal harassment (stalking). These would carry higher maximum sentences than the general assault provisions.\n\nThird, courts would be empowered to order a risk assessment of up to seven days for individuals charged with domestic assault, if there are indicators of escalating danger. This is designed to give police and courts a window to evaluate risk before a bail decision.\n\nFourth, the bill would change bail rules for individuals with a previous domestic violence conviction, creating a reverse onus requiring them to show why they should be released.`,
      },
      {
        title: 'The Parliamentary Path',
        body: `Bailey\u2019s Law passed second reading in the House of Commons with a standing ovation \u2014 an unusual show of cross-party support. All parties indicated their backing for the bill.\n\nThe bill then went to the Standing Committee on Justice and Human Rights for detailed study. The committee heard from victims\u2019 advocates, legal experts, and law enforcement before passing the bill with only minor technical amendments.\n\nBill C-225 now returns to the House for report stage and third reading. As the first private member\u2019s bill to reach this stage in the current Parliament, its progress is being closely watched.`,
      },
      {
        title: 'Why Private Member\u2019s Bills Rarely Pass',
        body: `Private member\u2019s bills face significant procedural hurdles in Canada\u2019s Parliament. Only a limited number receive debate time each session, determined by a random draw. Even bills that receive debate often stall because the government controls the legislative calendar.\n\nOf the hundreds of private member\u2019s bills introduced each Parliament, only a small fraction become law. The bills that succeed typically have cross-party support and address issues where there is broad public consensus.\n\nBailey\u2019s Law benefits from both: the issue of intimate partner violence commands wide public support, and the bill\u2019s sponsors have worked across party lines to build consensus.`,
      },
      {
        title: 'What Happens Next',
        body: `The House will debate Bill C-225 at report stage, where MPs can propose amendments. If it passes report stage, it moves to a third reading vote. If it passes third reading, it goes to the Senate.\n\nThe government has indicated it supports the bill and will not block its progress. However, the legislative calendar is crowded, and private member\u2019s bills must compete for limited floor time with government legislation.\n\nParliament Audit will publish the recorded vote at third reading when it occurs.`,
      },
    ],
    sources: [
      {
        label: 'CBC — Bailey\u2019s Law passes second reading in Ottawa',
        url: 'https://www.cbc.ca/news/canada/british-columbia/baileys-law-second-reading-domestic-violence-9.7002335',
      },
      {
        label: 'LEGISinfo — Bill C-225',
        url: 'https://www.parl.ca/legisinfo/en/bill/45-1/c-225',
      },
      {
        label: 'Bill C-225 — First Reading Text',
        url: 'https://www.parl.ca/DocumentViewer/en/45-1/bill/C-225/first-reading',
      },
      {
        label: 'Today in BC — Bailey\u2019s Law passes second reading with standing ovation',
        url: 'https://www.todayinbc.com/news/baileys-law-passes-second-reading-in-house-of-commons-with-standing-ovation-8354234',
      },
      {
        label: 'openparliament.ca — Bill C-225',
        url: 'https://openparliament.ca/bills/45-1/C-225/',
      },
    ],
  },
  // ───────────────────────────────────────────────────────────────────────────
  // Floor-crossing accountability series
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'marilyn-gladu-byelection-pledge-then-floor-cross',
    headline:
      'Marilyn Gladu Endorsed Byelections for Floor-Crossers in January. In April, She Crossed the Floor.',
    subheadline:
      'In a January 11 interview with the Petrolia Lambton Independent, the Sarnia-Lambton MP said constituents "deserve a chance to have a redo" when their MP switches parties. Three months later, she joined the Liberals — and has not called a byelection.',
    summary:
      'On January 11, 2026, Conservative MP Marilyn Gladu told a local newspaper she supported a petition calling for automatic byelections when MPs switch parties, saying voters "deserve a chance to have a redo." On April 8, 2026, she crossed the floor to the Liberals herself. Sarnia-Lambton\u2019s mayor and the local Conservative riding association president have publicly called for her to face a byelection. She has not.',
    publishedAt: '2026-04-19T18:00:00-04:00',
    category: 'Accountability',
    tags: ['floor crossing', 'Marilyn Gladu', 'accountability', 'Sarnia-Lambton', 'byelection'],
    readingTimeMinutes: 5,
    smartBrevity: {
      bigThing:
        'Marilyn Gladu said in January that MPs who switch parties owe their voters a byelection. Three months later, she switched parties and did not call one.',
      whyItMatters:
        'It is the cleanest documented contradiction of the 2026 floor-crossing cycle — her own words, on the record, in a local newspaper.',
      goDeeper: [
        'The January 11 interview with the Petrolia Lambton Independent was about a constituent petition for automatic byelections.',
        'Her on-record quote: voters "deserve a chance to have a redo" when an MP changes banners.',
        'Sarnia\u2019s mayor and the local Conservative riding association president have publicly demanded she face a byelection.',
        'Her voting record on abortion and vaccine mandates has also reversed since the crossing.',
      ],
      bottomLine:
        'Gladu is still the MP for Sarnia-Lambton. Her 2025 campaign ran under a Conservative banner.',
    },
    methodology:
      'Direct quotes are reproduced verbatim from the Petrolia Lambton Independent (Jan 11, 2026) and the Sarnia Journal (April 9, 2026). The Liberal caucus announcement, Gladu\u2019s confirmation statement, and the mayor\u2019s public statement were cross-checked against CBC News and CP wire coverage. Past voting record is sourced from Hansard and ourcommons.ca member profile. We did not reach out to Gladu for an additional interview; her public statements are extensive and on the record.',
    keyTakeaways: [
      'On Jan 11, 2026, Gladu told the Petrolia Lambton Independent she supported a petition for automatic byelections after floor-crossings.',
      'On April 8, 2026 — three months later — she crossed the floor from the Conservatives to the Liberals.',
      'She has not called a byelection. Sarnia\u2019s mayor and the local CPC riding association president have both publicly demanded one.',
      'Other reversals on joining the Liberal caucus: pro-life voting record (now states she will protect women\u2019s right to choose) and previous opposition to vaccine mandates.',
      'Gladu was elected as a Conservative in October 2015 and re-elected as a Conservative in 2019, 2021, and April 2025.',
    ],
    sections: [
      {
        title: 'What She Said in January',
        body: `On January 11, 2026, the Petrolia Lambton Independent published an interview with Sarnia-Lambton Conservative MP Marilyn Gladu. The subject: a constituent-driven petition calling on Parliament to require automatic byelections when an MP switches parties.

Gladu was on the record in support. The Independent quoted her in full:

"Really, the whole point of being an MP is to represent your constituents. So, if they're voting you in under one platform, for you to switch for whatever reasons, just seems to me to not be representing what you're supposed to be there to represent. We elected you under this banner, and if you don't want to be under that banner, then we deserve a chance to have a redo."

The Sarnia Journal subsequently confirmed the quote and the position.`,
      },
      {
        title: 'What She Did in April',
        body: `On April 8, 2026 — 87 days later — Gladu announced she was crossing the floor to join Mark Carney's Liberals. Her stated reason, per CBC: "I've heard clearly from constituents that you want serious leadership and a real plan to build a stronger and more independent Canadian economy."

The contradiction was noted immediately by local outlets. The Sarnia Journal headline read: "Gladu crosses the floor despite prior support for by-elections for party-switching MPs."

Sarnia Mayor Mike Bradley and the Sarnia-Lambton Conservative riding association president have both publicly called for Gladu to face a byelection in keeping with her own January position. As of publication, Gladu has not committed to one.`,
      },
      {
        title: 'Other Position Reversals',
        body: `Gladu's caucus switch coincided with public reversals on two other long-held positions.

On abortion: Gladu voted in favour of Bill C-233 (the 2021 sex-selective abortion ban) and spoke at the 2017 March for Life on Parliament Hill. After joining the Liberal caucus, she stated: "I will protect the rights and freedoms of women to choose." The Catholic Register and Global News documented the shift.

On vaccine mandates: As a Conservative, Gladu led an internal "mini-caucus" against federal vaccine mandates and was dropped from the Conservative shadow cabinet in 2021 after publicly comparing COVID-19 risk unfavourably to polio — remarks she later apologized for, calling them "misinformation." She now sits in a caucus that has supported mandate-related employment insurance denials.`,
      },
      {
        title: 'Background',
        body: `Marilyn Gladu was first elected as the Conservative MP for Sarnia-Lambton in October 2015. She was re-elected in 2019, 2021, and again in the April 2025 federal election — each time on the Conservative ticket.

A chemical engineer by training (BSc, Queen's University; 21 years at Dow Chemical, then engineering director at Suncor), she became the first female chemical engineer to sit in the House of Commons. She was named Maclean's "Most Collegial Parliamentarian" in 2016.

Her notable legislative work as a Conservative includes Bill C-277 (the 2017 palliative care framework) and Bill C-228 (2023 pension protection). She chaired the Standing Committee on the Status of Women and ran an unsuccessful 2020 Conservative leadership bid that was disqualified for failing to meet the signature and deposit requirements.`,
      },
    ],
    sources: [
      { label: 'Petrolia Lambton Independent — Jan 11, 2026 Gladu interview', url: 'https://petrolialambtonindependent.ca/2026/01/11/gladu-backs-call-for-automatic-by-elections-for-mps-who-switch-parties/' },
      { label: 'Sarnia Journal — Gladu crosses despite prior byelection support', url: 'https://www.thesarniajournal.ca/news/gladu-crosses-the-floor-despite-prior-support-for-by-elections-for-party-switching-mps-12113791' },
      { label: 'CBC — Marilyn Gladu crosses to Liberals (April 8, 2026)', url: 'https://www.cbc.ca/news/politics/conservative-mp-marilyn-gladu-crosses-floor-to-liberals-9.7156167' },
      { label: 'Globe and Mail — Gladu floor crossing', url: 'https://www.theglobeandmail.com/politics/article-marilyn-gladu-floor-crossing-conservatives-liberals-mark-carney/' },
      { label: 'CBC — Sarnia mayor calls for byelection', url: 'https://www.cbc.ca/news/canada/windsor/marilyn-gladu-byelection-call-9.7158488' },
      { label: 'Catholic Register — Gladu and the pro-life vote', url: 'https://www.catholicregister.org/item/3745-floor-crosser-gladu-turns-back-on-pro-life-past' },
      { label: 'Global News — Gladu, Liberals, and abortion rights', url: 'https://globalnews.ca/news/11771261/marilyn-gladu-liberals-abortion-carney/' },
      { label: 'Sarnia Journal — Gladu apologizes for COVID/polio comparison', url: 'https://www.thesarniajournal.ca/top-story/update-gladu-apologizes-for-remarks-dropped-from-tory-shadow-cabinet-7971815' },
      { label: 'House of Commons — Marilyn Gladu profile', url: 'https://www.ourcommons.ca/members/en/marilyn-gladu(88938)' },
    ],
  },
  {
    slug: 'matt-jeneroux-resigned-then-crossed-floor',
    headline:
      'In November, Matt Jeneroux Resigned Citing Family. In February, He Crossed the Floor Instead.',
    subheadline:
      'The Edmonton Riverbend MP said his "focus must turn entirely to my family" when announcing his resignation in November 2025. Fourteen weeks later, he kept his seat and joined the Liberals — getting a Special Advisor role and foreign trips with the Prime Minister within weeks.',
    summary:
      'On November 6, 2025, Conservative MP Matt Jeneroux announced he was resigning from Parliament, telling constituents there was "no coercion" involved and that his focus needed to be on his family. On February 18, 2026, he reversed course, kept the Edmonton Riverbend seat his constituents had elected him to as a Conservative, and crossed the floor to the Liberals. Within weeks he was named a Special Advisor to the Prime Minister on Economic and Security Partnerships and joined Mark Carney on a trip to India, Australia, and Japan.',
    publishedAt: '2026-04-19T18:30:00-04:00',
    category: 'Accountability',
    tags: ['floor crossing', 'Matt Jeneroux', 'accountability', 'Edmonton Riverbend'],
    readingTimeMinutes: 5,
    smartBrevity: {
      bigThing:
        'Matt Jeneroux publicly resigned his seat in November 2025 citing family — with "no coercion involved." Fourteen weeks later, he kept the seat and crossed to the Liberals instead.',
      whyItMatters:
        'The same constituents who were told their MP was leaving now have an MP in a different party. Within weeks of crossing he received a Special Advisor title and foreign-trip access.',
      goDeeper: [
        'Nov 6, 2025: Jeneroux announced resignation, citing family and explicitly denying any coercion.',
        'Feb 18, 2026: Reversed. Kept the Conservative-won Edmonton Riverbend seat, joined the Liberals. No byelection triggered.',
        'Named Special Advisor to the Prime Minister on Economic and Security Partnerships shortly after the crossing.',
        'Traveled with Carney to India, Japan, and Australia in his first weeks as a Liberal.',
      ],
      bottomLine:
        'Jeneroux won Edmonton Riverbend with 50.24% of the vote as a Conservative. His primary residence is reported to be in Victoria, BC.',
    },
    methodology:
      'Resignation statement is from Jeneroux\u2019s public Facebook post of November 6, 2025 (archived URL in sources). Floor-crossing confirmation and Poilievre reaction from CBC, CP24, and Global News. Special Advisor appointment and foreign-trip itinerary confirmed through Prime Minister\u2019s Office announcements and Global News reporting. Residence-in-Victoria note sourced to Edmonton Journal and Postmedia local reporting.',
    sections: [
      {
        title: 'November 2025: The Resignation',
        body: `On November 6, 2025, Matt Jeneroux posted a resignation statement to Facebook and confirmed it to CBC News. The full statement is publicly available.

His own framing: "I want to be clear that there was no coercion involved in my decision to resign... For now, my focus must turn entirely to my family."

He noted he had run in the April 2025 federal election "hopeful that Canadians would put their faith in a team led by Pierre Poilievre's Conservatives" — language that affirmed the Conservative banner he had run under.

The CBC headline at the time: "Conservative Matt Jeneroux resigns from Parliament."`,
      },
      {
        title: 'February 2026: The Reversal',
        body: `On February 18, 2026, Jeneroux did not resign. Instead, he announced he was crossing the floor to join Mark Carney's Liberals — keeping the seat his constituents had elected him to as a Conservative.

His new framing, per the CBC, cited "several conversations around the dinner table" and Mark Carney's Davos speech, framing the move as a response to a "national unity crisis."

Conservative Leader Pierre Poilievre called the move a "betrayal" and alleged "dirty backroom deals."

Same family. Same constituents. Opposite decision. Fourteen weeks apart.`,
      },
      {
        title: 'What Came Next',
        body: `Within weeks of crossing, Jeneroux was named Special Advisor to the Prime Minister on Economic and Security Partnerships. He joined Carney on a foreign trip to India, Japan, and Australia in March 2026. Global News documented both.

His own November 2025 statement preempted the obvious question: he said there was "no coercion" in his decision to resign. The February reversal — and the speed of the cabinet-adjacent advisory role and foreign-trip access that followed — invites a follow-up question: what changed?

As of publication, Jeneroux has not indicated any willingness to face a byelection in Edmonton Riverbend. Constituents quoted by local outlet Junonews have called the move "unconscionable" and "a complete rejection of democracy."`,
      },
      {
        title: 'Background',
        body: `Matt Jeneroux was first elected as the Conservative MP for Edmonton Riverbend in 2015. He was re-elected in 2019, 2021, and most recently in April 2025 with 50.24 per cent of the vote.

Before federal politics, he served as a Progressive Conservative MLA for Edmonton-South West from 2012 to 2015 and was the author of Alberta's Bill 203 (Compassionate Care Leave). He held a series of opposition shadow portfolios in Ottawa, including Health (2019–2020), Infrastructure, Innovation and Science, Housing & Diversity, and most recently Supply Chains.

He passed Bill C-220 (extension of bereavement leave) with all-party support and was named CAMIMH's Champion of Mental Health in 2024.`,
      },
    ],
    sources: [
      { label: 'CBC — Conservative Matt Jeneroux resigns from Parliament (Nov 6, 2025)', url: 'https://www.cbc.ca/news/politics/conservative-matt-jeneroux-resigns-9.6970100' },
      { label: 'Matt Jeneroux Facebook resignation post', url: 'https://www.facebook.com/mattjeneroux/posts/1210644494220209/' },
      { label: 'CBC — Jeneroux joins Liberals (Feb 18, 2026)', url: 'https://www.cbc.ca/news/politics/jeneroux-joins-liberals-9.7095322' },
      { label: 'CP24 — Poilievre calls floor crossing a "betrayal"', url: 'https://www.cp24.com/news/canada/2026/02/18/conservative-mp-jeneroux-floor-crossing-a-betrayal-pierre-poilievre-says/' },
      { label: 'Global News — Jeneroux crosses floor to Liberals', url: 'https://globalnews.ca/news/11672379/matt-jeneroux-crosses-floor-liberals/' },
      { label: 'Global News — Carney, Jeneroux, India/Japan/Australia trip', url: 'https://globalnews.ca/news/11686665/mark-carney-matt-jeneroux-india-japan-australia-trip/' },
      { label: 'House of Commons — Matt Jeneroux profile', url: 'https://www.ourcommons.ca/members/en/matt-jeneroux(89167)' },
    ],
  },
  {
    slug: 'michael-ma-team-feudalism-then-team-liberal',
    headline:
      'Nine Days Before Joining the Liberals, Michael Ma Called Them "Team Feudalism" in Parliament',
    subheadline:
      'On December 2, 2025, the Markham–Unionville MP rose in the House to call the Liberals "team asset inflation," "team rentier economy," and "team feudalism." Nine days later, he was one of them. He has admitted he was "truly a Conservative" the night before he crossed.',
    summary:
      'Conservative MP Michael Ma crossed the floor to Mark Carney\u2019s Liberals on December 11, 2025 — nine days after a Hansard speech in which he attacked the Liberal record on housing, productivity, and economic governance, calling them "team feudalism." He has since admitted he was "truly a Conservative" at the Conservative Christmas party the night before he crossed. A constituent petition calling for his resignation has reportedly gathered tens of thousands of signatures.',
    publishedAt: '2026-04-19T19:00:00-04:00',
    category: 'Accountability',
    tags: ['floor crossing', 'Michael Ma', 'accountability', 'Markham\u2013Unionville', 'Hansard'],
    readingTimeMinutes: 5,
    smartBrevity: {
      bigThing:
        'On December 2, 2025, Conservative MP Michael Ma rose in the House and called the Liberals "team feudalism." Nine days later, he joined them.',
      whyItMatters:
        'The speech is in Hansard. The crossing is in the House record. Ma has publicly admitted he was "truly a Conservative" at the Conservative Christmas party the night before the crossing.',
      goDeeper: [
        'Dec 2: Ma called the Liberals "team asset inflation," "team rentier economy," and "team feudalism" in a Hansard speech.',
        'Dec 11: Ma crossed to the Liberals.',
        'A constituent resignation petition has reportedly gathered ~37,000 signatures (CBC).',
        'Ma flipped Markham\u2013Unionville with 50.65% as a Conservative in April 2025.',
      ],
      bottomLine:
        'Ma has not committed to a byelection.',
    },
    methodology:
      'Dec 2 speech is sourced directly from Hansard and confirmed via video recording of the House. Floor-crossing confirmation from Globe and Mail and CBC. "Truly a Conservative" admission is from Ma\u2019s own remarks to reporters, reported by CBC. Petition-signature count is from CBC News reporting — we have not independently verified the signature log. Electoral result is from Elections Canada.',
    sections: [
      {
        title: 'December 2: "Team Feudalism"',
        body: `On December 2, 2025, Conservative MP Michael Ma rose in the House of Commons during budget debate. CPAC's video record and Ma's own website carry the speech.

His own words on the Liberal economic record: "team asset inflation," "team rentier economy," and "team feudalism." He said "The Liberals do not believe in a productive economy that works for hard-working Canadians."

Two weeks earlier, on November 18, 2025, Ma had risen on Bill C-14 to attack the Liberal record on crime, saying the government "cater[s] to common criminals" and demanding the repeal of Liberal-passed Bill C-5 and Bill C-75.

Both speeches are in Hansard.`,
      },
      {
        title: 'December 11: The Floor Crossing',
        body: `On Thursday, December 11, 2025, Ma announced he was crossing the floor to the Liberals. He attended the Liberal holiday party in Gatineau the same evening.

His stated reasons, per Global News: Carney's "steady, practical approach" and "unity and decisive action for Canada's future." He said he could deliver more for constituents as a government MP.

The CBC reported the move made the Liberals one seat short of a majority — and made Ma the second Conservative to cross to Carney's caucus, after Chris d'Entremont's November 4 defection.

BNN Bloomberg reported Natural Resources Minister Tim Hodgson had hosted Ma for dinner and was instrumental in the recruitment.`,
      },
      {
        title: '"Truly a Conservative" — The Night Before',
        body: `In a December 18, 2025 interview, Ma was pressed on the optics of attending the Conservative Christmas party — and posing for photos with Pierre Poilievre — the night before he announced his crossing.

His own answer, per CP24: "The night I attended the Conservative (Christmas) party, I was truly a Conservative member, and really an MP… I had not made a decision at that point."

The defence is unusual. Most floor-crossers describe a deliberation that takes weeks. Ma's public account is that the decision crystallized in less than 24 hours.`,
      },
      {
        title: 'Constituent Response',
        body: `A January 3, 2026 town hall in Markham–Unionville, covered by Rebel News, drew hundreds of constituents and former staffers. Former Ma staffer Deepak Talreja told the room he had not worked for Ma personally — "It was the party."

CBC has reported that a constituent petition demanding Ma's resignation has gathered approximately 37,000 signatures (figures vary across coverage; earliest Rebel News reporting cited ~9,348). Ma has not addressed the petition or indicated he will face a byelection.`,
      },
      {
        title: 'Other Items in the Public Record',
        body: `Ma served as a director of the Chinese Canadian Conservative Association in 2019, an organization named in a Jamestown Foundation report on overseas United Front activity. The Bureau, a Canadian investigative outlet, has reported on the connection — explicitly noting "no allegation or evidence that Ma himself was acting under United Front motivations."

In March 2026, Ma drew controversy at the Industry Committee for questioning witness Margaret McCuaig-Johnston on whether her testimony about Shenzhen forced labour was "hearsay." McCuaig-Johnston told reporters Ma was "trying to undermine" her testimony.

Background: Ma was born in Hong Kong, immigrated to Canada at age 12, and holds a BSc in Computer Science from UBC and an MBA from the University of South Australia. He ran unsuccessfully in Don Valley East in 2019 before winning Markham–Unionville for the Conservatives in April 2025.`,
      },
    ],
    sources: [
      { label: 'CBC — MP Michael Ma crosses floor to Liberals', url: 'https://www.cbc.ca/news/politics/mp-crosses-floor-to-liberals-9.7012767' },
      { label: 'Globe and Mail — Michael Ma joins Carney Liberals', url: 'https://www.theglobeandmail.com/politics/article-mp-michael-ma-crosses-floor-liberals-carney-conservatives-markham/' },
      { label: 'Global News — Michael Ma floor crossing', url: 'https://globalnews.ca/news/11574421/michael-ma-floor-crossing-liberal-government/' },
      { label: 'CP24 — Ma admits he was "truly a Conservative" the night before', url: 'https://www.cp24.com/local/york/2025/12/18/michael-ma-says-he-was-truly-a-conservative-the-night-before-he-crossed-the-floor-to-the-liberals/' },
      { label: 'Hansard No. 55 — Ma on Bill C-14, Nov 18, 2025', url: 'https://www.ourcommons.ca/documentviewer/en/45-1/house/sitting-55/hansard' },
      { label: 'Ma\u2019s Dec 2 budget speech (CPAC clip)', url: 'https://www.youtube.com/watch?v=S-41LLmZLZE' },
      { label: 'Ma\u2019s own MP site — Dec 2 budget speech text', url: 'https://mpmichaelma.ca/mp-ma-on-the-budget-is-the-government-acting-as-a-player-or-referee/' },
      { label: 'BNN Bloomberg — Government House Leader on more frustrated Conservatives', url: 'https://www.bnnbloomberg.ca/business/2025/12/12/government-house-leader-says-there-are-more-frustrated-conservative-mps-amid-floor-crossing/' },
      { label: 'Rebel News — Markham–Unionville town hall, Jan 3, 2026', url: 'https://www.rebelnews.com/_we_did_not_vote_for_this_constituents_of_markham_unionville_demand_accountability_in_town_hall_meeting' },
      { label: 'The Bureau — coverage of Ma and PRC-linked associations (with caveats)', url: 'https://www.thebureau.news/p/exclusive-floor-crossing-mp-michael' },
      { label: 'Probe International — Ma at Industry Committee, McCuaig-Johnston testimony', url: 'https://journal.probeinternational.org/2026/03/27/liberal-mp-michael-ma-sparks-outrage-and-questions-of-ccp-influence-in-parliament/' },
    ],
  },
  {
    slug: 'chris-dentremont-deputy-speaker-ethics-complaint',
    headline:
      'Chris d\u2019Entremont Won by 533 Votes as a Conservative. Six Months Later, He Was a Liberal — and Democracy Watch Filed an Ethics Complaint.',
    subheadline:
      'The Acadie–Annapolis MP crossed the floor on the morning of the 2025 federal budget, after losing his Deputy Speaker salary top-up. Democracy Watch asked the Ethics Commissioner to investigate whether the lost income was a financial motive. The Commissioner declined.',
    summary:
      'On November 4, 2025 — the morning of the federal budget — Conservative MP Chris d\u2019Entremont became the first Conservative to cross to Mark Carney\u2019s Liberals, six months after winning re-election by 533 votes on the Conservative ticket. Within ten days, the watchdog group Democracy Watch filed a formal complaint with the Conflict of Interest and Ethics Commissioner, arguing that d\u2019Entremont\u2019s loss of his Deputy Speaker salary top-up created a financial motive that warranted investigation under the Conflict of Interest Code. The Commissioner declined to investigate.',
    publishedAt: '2026-04-19T19:30:00-04:00',
    category: 'Accountability',
    tags: ['floor crossing', 'Chris d\u2019Entremont', 'accountability', 'ethics commissioner', 'Acadie\u2013Annapolis'],
    readingTimeMinutes: 5,
    smartBrevity: {
      bigThing:
        'Chris d\u2019Entremont won Acadie\u2013Annapolis by 533 votes as a Conservative in April 2025. On budget day \u2014 six months later \u2014 he was the first Conservative to join Carney\u2019s Liberals.',
      whyItMatters:
        'The watchdog Democracy Watch filed a formal ethics complaint arguing the loss of his Deputy Speaker salary top-up was a financial motive. The Ethics Commissioner declined to investigate.',
      goDeeper: [
        'Nov 4, 2025 \u2014 federal budget morning \u2014 d\u2019Entremont announced the crossing.',
        'He gave at least three different reasons for the move in the first five days; one of them had to be retracted after he misled a media outlet.',
        'The Conflict of Interest Commissioner\u2019s response to the Democracy Watch complaint was to decline to investigate; Democracy Watch said the Commissioner "rolled over like a lapdog."',
        'No byelection called.',
      ],
      bottomLine:
        'The financial-motive question is now closed procedurally. It is not closed as a question.',
    },
    methodology:
      'Electoral results from Elections Canada. Crossing timing and reasons cross-checked against CBC, CP wire, and the Halifax Chronicle-Herald coverage. Democracy Watch complaint quoted from the organization\u2019s November 2025 press release. Ethics Commissioner response documented via Democracy Watch follow-up statement. Deputy Speaker salary top-up value is from the Parliament of Canada member compensation schedule.',
    sections: [
      {
        title: 'The Crossing',
        body: `On the morning of November 4, 2025 — federal budget day — Conservative MP Chris d'Entremont announced he was crossing the floor to the Liberals. He was the first Conservative to join Mark Carney's caucus.

He had been re-elected six months earlier, in the April 2025 federal election, by approximately 533 votes — the smallest margin of his federal career — on the Conservative ticket. Former Conservative Party president Rob Batherson, quoted by CBC, said d'Entremont had "betrayed his voters."

D'Entremont himself has told CTV he is "not sure" whether he will run again as a Liberal: "I'm 56 and may want to spend some time at home."`,
      },
      {
        title: 'The Ethics Complaint',
        body: `On November 14, 2025 — ten days after the crossing — the watchdog group Democracy Watch filed a formal complaint with the Conflict of Interest and Ethics Commissioner.

The complaint focused on a specific financial fact: d'Entremont had been Deputy Speaker of the House of Commons under the Conservatives, a role that comes with an annual salary top-up of approximately $46,000. He lost the role and the top-up under the new government.

Democracy Watch argued that the loss of that income created a financial motive for the crossing — one that should be examined under the Conflict of Interest Code for Members of the House of Commons. The complaint letter is publicly posted (PDF below).

The Ethics Commissioner declined to investigate. Democracy Watch publicly responded that the Commissioner had "rolled over like a lapdog" and "misled Parliament."`,
      },
      {
        title: 'Three Reasons in Five Days',
        body: `D'Entremont's stated rationale for the crossing shifted in the first week.

The first reason cited the contents of the federal budget — a budget that had not yet been tabled when he crossed that morning. He gave a different reason the following day. A third reason came five days later, which he was forced to correct after misleading a media outlet.

Democracy Watch documented the shifting account; CBC's coverage of d'Entremont's interactions with Conservative leadership during the same week corroborated parts of the timeline.`,
      },
      {
        title: 'The Confrontation Account',
        body: `D'Entremont publicly described a meeting in which Conservative House Leader Andrew Scheer and Whip Chris Warkentin "barged" into his office, almost knocked over his assistant, and called him a "snake." The Conservatives publicly disputed the account, calling it inaccurate.

CBC has reported on both versions. As of publication, no on-the-record neutral witness has confirmed either account in full.`,
      },
      {
        title: 'Background',
        body: `Chris d'Entremont was first elected federally as a Conservative MP for West Nova in 2019. The riding was renamed Acadie–Annapolis in the 2024 federal redistribution. He served as Deputy Speaker and Chair of Committees of the Whole from November 2021 until 2025 — the first Acadian to hold the role.

Before federal politics, d'Entremont served three terms as the Progressive Conservative MLA for Argyle (later Argyle-Barrington), Nova Scotia, from 2003 to 2019. He held provincial cabinet portfolios for Agriculture and Fisheries (2003–06), Health (2006–09), and Acadian Affairs (2003–09).

He was born in Yarmouth, Nova Scotia, and trained in radio broadcasting at Loyalist College.`,
      },
    ],
    sources: [
      { label: 'Democracy Watch — call for Ethics Commissioner investigation', url: 'https://democracywatch.ca/group-calls-on-ethics-commissioner-to-rule-on-floor-crossing-by-mp-chris-dentremont/' },
      { label: 'Democracy Watch — formal complaint letter (PDF, Nov 14, 2025)', url: 'https://democracywatch.ca/wp-content/uploads/LettToEthicsCommReMPdEntremontNov142025.pdf' },
      { label: 'Democracy Watch — response to Commissioner declining to investigate', url: 'https://democracywatch.ca/ethics-commissioner-misled-parliament-rolls-over-on-floor-crossing-by-mp-chris-dentremont/' },
      { label: 'CBC — d\u2019Entremont crosses to Liberals', url: 'https://www.cbc.ca/news/politics/chris-dentremont-liberals-poilievre-9.6967559' },
      { label: 'CBC — Conservative leadership confrontation account', url: 'https://www.cbc.ca/news/politics/yelling-conservative-leadership-dentremont-9.6972680' },
      { label: 'CBC — Nova Scotia reaction to floor crossing', url: 'https://www.cbc.ca/news/canada/nova-scotia/chris-d-entremont-reaction-in-nova-scotia-9.6968088' },
      { label: 'CTV — d\u2019Entremont on whether he\u2019ll run again', url: 'https://www.ctvnews.ca/politics/article/conservative-mps-absolutely-ask-about-experience-joining-liberal-caucus-floor-crosser-dentremont/' },
      { label: 'House of Commons — Chris d\u2019Entremont profile', url: 'https://www.ourcommons.ca/members/en/chris-dentremont(49344)' },
      { label: 'Liberal Party of Canada — statement on d\u2019Entremont joining caucus', url: 'https://liberal.ca/statement-from-mp-chris-dentremont/' },
    ],
  },
];

export function getNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}

export function getAllNewsSlugs(): string[] {
  return newsArticles.map((a) => a.slug);
}

/**
 * Tag helpers — kebab-case slug is the URL form, original casing is
 * preserved for display. Lookup is case/slug-insensitive.
 */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, '-') // en/em dash
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getAllTags(): Array<{ tag: string; slug: string; count: number }> {
  const counts = new Map<string, { tag: string; count: number }>();
  for (const article of newsArticles) {
    for (const tag of article.tags) {
      const slug = slugifyTag(tag);
      const existing = counts.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(slug, { tag, count: 1 });
      }
    }
  }
  return Array.from(counts.entries())
    .map(([slug, { tag, count }]) => ({ tag, slug, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getArticlesByTagSlug(slug: string): NewsArticle[] {
  return newsArticles
    .filter((a) => a.tags.some((t) => slugifyTag(t) === slug))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

/** Human-readable label for a tag slug — uses the original casing from any matching article. */
export function getTagLabel(slug: string): string | undefined {
  for (const article of newsArticles) {
    const match = article.tags.find((t) => slugifyTag(t) === slug);
    if (match) return match;
  }
  return undefined;
}
