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
];

export function getNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}

export function getAllNewsSlugs(): string[] {
  return newsArticles.map((a) => a.slug);
}
