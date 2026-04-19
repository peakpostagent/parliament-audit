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
    keyTakeaways: [
      '$60.6 billion in federal spending cuts over four years.',
      '~10,000 public service positions eliminated, with CRA losing 2,620.',
      '$10-a-day childcare expansion gets no new federal funding after 2027–28.',
      'Three climate research labs consolidated into one; lunar program cut 40%.',
      'Passport processing wait times projected to roughly double by fall.',
    ],
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
    keyTakeaways: [
      '4 Conservative MPs crossed the floor to the Liberals between Nov 2025 and April 2026.',
      '3 Liberal byelection wins in the same window pushed the caucus over the majority threshold.',
      'No general election was held — voters never weighed in on the new balance of power.',
      'Angus Reid: 74% of Canadians say crossing MPs should have to run in a byelection. Cross-party consensus: 81% of CPC, 77% of NDP, and 68% of LPC voters agree.',
      'Canada has no anti-defection law; floor crossings are legal under current rules.',
    ],
    sections: [
      {
        title: 'The Timeline',
        body: `The Liberal minority government won the 2025 general election with 158 seats — 14 short of the 172 needed for a majority. Within six months, a combination of floor crossings and byelection wins closed that gap.\n\nNovember 4, 2025: Conservative MP Chris d'Entremont (West Nova, NS) crosses the floor to the Liberals, citing disagreements with Conservative leadership on Atlantic regional development.\n\nDecember 11, 2025: Conservative MP Kin Ma (Calgary Skyview, AB) crosses the floor, stating that the Conservative party has moved too far from its centrist roots.\n\nFebruary 18, 2026: Conservative MP Matt Jeneroux (Edmonton Riverbend, AB) crosses the floor, citing concerns about party direction on climate policy.\n\nApril 8, 2026: Conservative MP Marilyn Gladu (Sarnia-Lambton, ON) crosses the floor, the fourth Conservative to do so in five months.\n\nIn between, the Liberals won three byelections in previously opposition-held ridings, bringing their total to 172 — exactly the number needed for a majority.`,
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
    keyTakeaways: [
      'Passed the House 186–137 on March 25, 2026; now moves to the Senate.',
      'Liberals and Bloc voted yes; Conservatives, NDP, and Greens all voted no.',
      'Removes the "good faith religious text" defence that has been in the Criminal Code since the 1970s.',
      'Creates new offences for the public display of hate symbols and the promotion of hatred against identifiable groups.',
      'NDP and CPC objections were for opposite reasons: CPC sees the religious-text removal as a free-speech threat; NDP sees the bill as not going far enough.',
    ],
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
    keyTakeaways: [
      'Received royal assent on March 26, 2026 — now law.',
      '~30,000 refugee claimants have received letters saying their cases may be ineligible.',
      'New 1-year filing deadline for asylum claims, retroactively applied.',
      'Government can now cancel permanent resident visas, work permits, and study permits if it deems it in the "public interest" — a term the law does not define.',
      'Rights groups call it the biggest rollback of Canadian refugee protections in a decade.',
    ],
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
    keyTakeaways: [
      'Would make killing an intimate partner an automatic first-degree murder charge.',
      'Creates distinct Criminal Code offences for intimate partner assault.',
      'Empowers courts to order 7-day risk assessments before granting bail in domestic violence cases.',
      'Named after Bailey McCourt, killed by an intimate partner in Kelowna in 2020.',
      'Rare all-party support for a private member\u2019s bill — passed second reading with a standing ovation; cleared committee with minor amendments.',
    ],
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
];

export function getNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}

export function getAllNewsSlugs(): string[] {
  return newsArticles.map((a) => a.slug);
}
