/**
 * Bill C-22 Series — Day 1 article object.
 *
 * Consumed by scripts/series/publish-next-day.ts which:
 *   1. imports this file dynamically
 *   2. validates the slug isn't already in apps/web/src/content/news-articles.ts
 *   3. prepends the article object to the newsArticles[] array
 *   4. commits + pushes (Railway deploy)
 *   5. posts the companion social posts (day-01.bsky.txt + day-01.x-queue.json)
 *
 * If you need to edit the article body, edit THIS file. The companion
 * day-01-second-reading-update.md remains as the human-readable draft +
 * outline; this file is what publishes.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'bill-c-22-second-reading-update-april-20-2026',
  headline:
    'Bill C-22 Just Passed Second Reading. With a Liberal Majority, the Path to Royal Assent Is Now Mostly Clear.',
  subheadline:
    'The Lawful Access Act, 2026 cleared a critical procedural hurdle in the House on April 20. Committee review starts next. Five distinct opposition voices — academic, technology-industry, civil-society, U.S. legislative, and Charter-rights — have already weighed in against parts of the bill. Here is where the bill stands, what it would do, and what happens between here and Royal Assent.',
  summary:
    'On April 20, 2026, the House of Commons passed Bill C-22 — the Lawful Access Act, 2026 — at second reading. The bill is now at the Standing Committee on Public Safety and National Security, the last stage where substantial amendments are realistic before the Liberal majority votes it through. The bill mandates one year of metadata retention by "core providers," authorizes the Public Safety Minister to issue secret capability orders to electronic service providers, and lowers the police access threshold for subscriber information from "reasonable grounds to believe" to "reasonable grounds to suspect." Opposition is from a wide coalition: academic privacy law, civil-society groups, the U.S. House Judiciary Committee, technology firms including Meta and Apple, and the Department of Justice\'s own Charter statement, which is silent on the metadata-retention question. The Privacy Commissioner of Canada has no statutory oversight role under the bill as drafted.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['Bill C-22', 'lawful access', 'metadata', 'civil liberties', 'privacy', 'second reading', 'committee'],
  readingTimeMinutes: 7,
  keyTakeaways: [
    'Bill C-22 (Lawful Access Act, 2026) passed second reading on April 20, 2026, and is now at committee.',
    'The bill mandates one year of metadata retention by "core providers," authorizes secret capability orders by the Public Safety Minister, and lowers the police access threshold.',
    'Opposition is from a wide coalition: academic privacy experts, civil-society groups, technology firms, and a U.S. congressional committee.',
    'The Privacy Commissioner has no statutory oversight role in the bill as drafted.',
    'With a Liberal House majority, the only realistic path to changes is via committee amendments — which require government cooperation to pass.',
  ],
  smartBrevity: {
    bigThing:
      'Bill C-22 passed second reading in the House of Commons on April 20, 2026. The bill is now at committee — the last stage where substantial amendments are realistic before the Liberal majority votes it through.',
    whyItMatters:
      'Canada has never had mandatory telecom metadata retention. C-22 would change that, plus add a secret-order power for the Public Safety Minister and lower the police access threshold from "reasonable grounds to believe" to "reasonable grounds to suspect."',
    goDeeper: [
      'Second-reading vote: April 20, 2026 (Hansard 45-1 House debate, April 13–14, 17–20).',
      'Now at the Standing Committee on Public Safety and National Security.',
      'Five organized opposition voices public to date: University of Ottawa law (Geist), TWU law (Diab), Electronic Frontier Foundation, Meta + Apple (industry), and the U.S. House Judiciary Committee.',
      'The Privacy Commissioner of Canada has no oversight role under the bill as drafted.',
      'Liberal majority means amendments require government cooperation; opposition can pressure but not block.',
    ],
    yesBut:
      'Supporters argue C-22 is materially narrower than the failed Bill C-2 (Strong Borders Act), and that warrants are still required for the content of communications. The Minister states encryption is not interrupted.',
    bottomLine:
      'The bill is past the point where it can be killed on the floor. The civil-liberties-coalition focus shifts to committee testimony, suggested amendments, and public pressure on individual Liberal MPs before third reading.',
  },
  methodology:
    'Reporting is based on (1) the Bill C-22 first-reading text on the Parliament of Canada website; (2) the Public Safety Canada backgrounder on Part 2 (the Supporting Authorized Access to Information Act); (3) the Department of Justice Charter statement on C-22; (4) the second-reading Hansard debate, April 13–20, 2026; (5) Michael Geist\'s two analytical pieces on the bill (University of Ottawa Faculty of Law); (6) Robert Diab\'s Thompson Rivers University analysis; (7) Electronic Frontier Foundation\'s May 2026 brief; (8) public statements from Meta and Apple; (9) reporting in CBC News on U.S. House Judiciary Committee concerns. No government official was contacted for this piece; all government positions are quoted from on-record statements.',
  sections: [
    {
      title: 'Where the bill is right now',
      body: `On April 20, 2026, the House of Commons passed Bill C-22 at second reading. The vote followed three sitting days of debate — April 13, 14, 17, and the procedural vote on April 20. Under House procedure, a successful second-reading vote means the House has approved the bill in principle and is sending it to a parliamentary committee for clause-by-clause study.\n\nThat committee is the Standing Committee on Public Safety and National Security (SECU). Committee study is where witnesses are heard, amendments are proposed, and the bill is reported back to the House for third reading. Three things matter about this stage:\n\n- Amendments require government cooperation. With a Liberal majority on the committee, opposition-proposed amendments to strip or narrow the secret-order power, restore Privacy Commissioner oversight, or shorten the retention period cannot pass without Liberal support.\n- Witness testimony is on-record. Privacy advocates, providers, law-enforcement representatives, and Charter scholars who appear at SECU enter the record. That record is what next year's litigants, the Office of the Privacy Commissioner, and any future bill-amendment process will cite.\n- The committee schedule is public. Anyone tracking the bill can watch committee live, read the transcripts the next day, and contact MPs before key votes.`,
    },
    {
      title: 'What the bill would do, in plain English',
      body: `Bill C-22 has two parts.\n\nPart 1 amends the Criminal Code and other statutes to create new investigative tools for police. The most notable changes:\n\n- A "Confirmation of Service" demand allows police to require a telecom or internet provider to confirm whether they serve a particular individual. This is materially narrower than the warrantless subscriber-data access in the failed Bill C-2, but is broader than the status quo.\n- For information beyond service confirmation, police would need a court-approved production order — but the legal threshold is "reasonable grounds to suspect," a lower bar than the "reasonable grounds to believe" standard required for a search warrant.\n\nPart 2 is the Supporting Authorized Access to Information Act. It contains two big provisions:\n\n- Mandatory metadata retention for "core providers": telecom and internet companies would be required to retain transmission data on every user for up to one year. That data includes the date, time, duration, and type of every communication; device identifiers; and location information sufficient to reconstruct a person's movements over time. The retention applies to all users, not just those under investigation.\n- Secret capability orders. The Minister of Public Safety would gain authority to issue orders compelling electronic service providers to build and maintain surveillance capabilities. Providers receiving these orders would be legally barred from disclosing them publicly. The scope extends beyond traditional telecoms to major platforms.\n\nThe bill does explicitly exclude the content of communications, web browsing history, and social-media activity from the mandatory retention requirement.`,
    },
    {
      title: 'Who is on the record against parts of the bill',
      body: `Five distinct opposition voices are now public, and the diversity matters:\n\nAcademic privacy law. University of Ottawa professor Michael Geist published two detailed analyses in March 2026 calling out the metadata-retention model as a "fundamental shift" in the relationship between Canadians and providers, and the secret-order power as a "dangerous backdoor surveillance risk." Robert Diab at Thompson Rivers University reached similar conclusions.\n\nCivil-society groups. The Electronic Frontier Foundation, in a May 2026 brief titled "Canada's Bill C-22 Is a Repackaged Version of Last Year's Surveillance Nightmare," argued the bill recycles core problems from prior lawful-access attempts.\n\nTechnology industry. Meta and Apple have publicly opposed Part 2, raising encryption-backdoor concerns. The Minister has disputed that characterization, stating that "encryption is not in any way interrupted as part of Bill C-22."\n\nU.S. legislative. The U.S. House Judiciary Committee has reportedly raised concerns — a meaningful signal because cross-border data-sharing under the Cloud Act and Budapest Convention is one of the bill's quieter implications.\n\nCharter rights. The Department of Justice's own Charter statement on C-22 is, per Geist, "oddly silent" on the metadata-retention question. That silence is the kind of thing future Charter litigants will point to.`,
    },
    {
      title: 'What’s missing',
      body: `The most concrete gap in the bill is the absence of the Office of the Privacy Commissioner from any statutory oversight role over the new powers. There is no requirement that the OPC approve or audit the secret capability orders, no requirement that retention practices be reported to the OPC, and no statutory mechanism for the OPC to investigate complaints about retained metadata.\n\nThis is a meaningful departure from how Canada has handled comparable privacy-affecting legislation in recent years. The OPC has had a defined audit and report-to-Parliament role in most lawful-access proposals since Bill C-30 in 2012.`,
    },
    {
      title: 'What happens next',
      body: `The committee schedule is set by the SECU committee chair in consultation with the government. Realistically:\n\n- May to June 2026: SECU witness hearings. Privacy advocates, providers, law enforcement, Charter scholars, the OPC.\n- June to July 2026: Clause-by-clause review. Amendments proposed and voted on; the government can accept or reject.\n- September to October 2026: Report stage and third reading in the House.\n- Fall to Winter 2026: Senate review (committee, third reading).\n- Late 2026 or early 2027: Royal Assent if all stages proceed.\n\nThe bill could move faster than this if the government chooses to use closure or time-allocation motions. It could move slower if amendments require negotiation.`,
    },
    {
      title: 'What to watch over the next week',
      body: `Parliament Audit is running a daily piece on Bill C-22 from May 19 to May 25, each focusing on one specific dimension of the bill that bears civil-liberties or oversight scrutiny:\n\n- Tuesday — What a year of metadata actually reveals.\n- Wednesday — Why the absence of the Privacy Commissioner role matters.\n- Thursday — How the secret capability-order process would work.\n- Friday — What happened when Europe tried a nearly identical scheme (Digital Rights Ireland, 2014).\n- Saturday — Documented Canadian surveillance overreach: from Tommy Douglas to Northern Gateway protesters.\n- Sunday — How to track committee study and contact your MP before third reading.`,
    },
  ],
  sources: [
    {
      label: 'Bill C-22 — LEGISinfo',
      url: 'https://www.parl.ca/legisinfo/en/bill/45-1/c-22',
    },
    {
      label: 'Bill C-22 — First Reading Text (Parliament of Canada)',
      url: 'https://www.parl.ca/DocumentViewer/en/45-1/bill/C-22/first-reading',
    },
    {
      label: 'Public Safety Canada Backgrounder — Supporting Authorized Access to Information Act (Bill C-22 Part 2)',
      url: 'https://www.canada.ca/en/public-safety-canada/news/2026/03/backgrounder--securing-access-to-information-in-bill-c-22.html',
    },
    {
      label: 'Department of Justice — Charter Statement on Bill C-22',
      url: 'https://www.justice.gc.ca/eng/csj-sjc/pl/charter-charte/c22_2.html',
    },
    {
      label: 'Michael Geist — A Tale of Two Bills: Lawful Access Returns',
      url: 'https://www.michaelgeist.ca/2026/03/a-tale-of-two-bills-lawful-access-returns-with-changes-to-warrantless-access-but-dangerous-backdoor-surveillance-risks-remains/',
    },
    {
      label: 'Michael Geist — Unpacking Bill C-22’s Expansive Metadata Retention Requirements',
      url: 'https://www.michaelgeist.ca/2026/03/the-lawful-access-privacy-risks-unpacking-bill-c-22s-expansive-metadata-retention-requirements/',
    },
    {
      label: 'Robert Diab (TRU) — Ottawa Reboots Its Lawful Access Bill',
      url: 'https://www.robertdiab.ca/posts/bill-c22/',
    },
    {
      label: 'Electronic Frontier Foundation — Canada’s Bill C-22 Is a Repackaged Version of Last Year’s Surveillance Nightmare',
      url: 'https://www.eff.org/deeplinks/2026/05/canadas-bill-c-22-repackaged-version-last-years-surveillance-nightmare',
    },
    {
      label: 'Meta’s Position on Canada’s Bill C-22',
      url: 'https://about.fb.com/news/2026/05/metas-position-on-canadas-bill-c-22/',
    },
    {
      label: 'CBC News — Why the U.S. is noticing this Canadian security bill',
      url: 'https://www.cbc.ca/news/politics/why-americans-noticing-canadian-security-bill-9.7199947',
    },
    {
      label: 'OurCommons.ca — Standing Committee on Public Safety and National Security',
      url: 'https://www.ourcommons.ca/Committees/en/SECU',
    },
  ],
};
