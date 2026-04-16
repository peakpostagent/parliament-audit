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
];

export function getNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}

export function getAllNewsSlugs(): string[] {
  return newsArticles.map((a) => a.slug);
}
