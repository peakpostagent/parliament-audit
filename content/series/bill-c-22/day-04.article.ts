/**
 * Bill C-22 Series — Day 4: The Secret Order Power
 *
 * Procedurally-damning piece. Walks the reader through exactly how
 * a secret capability order would be issued and what it means that
 * a provider receiving one is legally barred from disclosing it.
 * This is the provision that civil-liberties advocates from across
 * the political spectrum agree is the bill's most aggressive feature.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'bill-c-22-secret-capability-orders-public-safety-minister',
  headline:
    "Bill C-22 Lets the Public Safety Minister Order a Telecom to Build Surveillance Tools. The Telecom Cannot Tell You. Here Is How That Works.",
  subheadline:
    "Part 2 of the Lawful Access Act, 2026 — the Supporting Authorized Access to Information Act (SAAIA) — creates a new power for the Public Safety Minister to issue capability orders to electronic service providers. The provider must comply. The provider is legally barred from disclosing that the order exists. The Intelligence Commissioner reviews the order for reasonableness. The public does not.",
  summary:
    "Bill C-22 contains a provision that civil-liberties advocates from Meta, Apple, the Electronic Frontier Foundation, and academic privacy law have uniformly flagged as the bill's most aggressive feature: the Public Safety Minister's power to issue \"capability orders\" to electronic service providers. Under Part 2 of the bill (the Supporting Authorized Access to Information Act, SAAIA), the Minister can require a provider to build a specific surveillance capability into their service, maintain it, and not disclose its existence. The provider must comply. The provider is legally prohibited from disclosing that the order exists. The Intelligence Commissioner reviews the Minister's reasonableness on a case-by-case basis. There is no statutory requirement of public reporting — even aggregate. This article walks through how the order is issued, what the provider is and is not allowed to say, how the Intelligence Commissioner's review works in practice, and what amendments could restore public accountability.",
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['Bill C-22', 'SAAIA', 'secret orders', 'civil liberties', 'lawful access', 'transparency'],
  readingTimeMinutes: 7,
  keyTakeaways: [
    "Bill C-22 (Part 2, SAAIA) lets the Public Safety Minister order an electronic service provider to build a specific surveillance capability — and forbid the provider from disclosing the order.",
    "The Intelligence Commissioner reviews the Minister's reasonableness, but there is no statutory requirement of public reporting (even aggregate).",
    "The provision applies beyond traditional telecoms to \"electronic service providers,\" which can include major platforms.",
    "Meta, Apple, the EFF, and Michael Geist have all publicly opposed this provision specifically.",
    "The U.S. House Judiciary Committee has flagged C-22 as a cross-border concern given its interaction with the U.S. Cloud Act framework.",
  ],
  smartBrevity: {
    bigThing:
      "Bill C-22 creates a new ministerial power: order a telecom or platform to build a specific surveillance capability into their service, and order them not to tell anyone the order exists.",
    whyItMatters:
      "This is the provision that draws the most uniform opposition from civil-society, technology industry, and academic privacy law. The non-disclosure requirement means the public, customers, and even shareholders cannot know what surveillance capabilities exist in the services they use.",
    goDeeper: [
      "The Minister of Public Safety issues the order.",
      "The provider must comply with the order's technical requirements.",
      "The provider is legally prohibited from disclosing the order's existence.",
      "The Intelligence Commissioner reviews the order for reasonableness.",
      "There is no statutory requirement of public reporting — even aggregate.",
      "The provision applies beyond traditional telecoms to \"electronic service providers,\" which can include major platforms.",
    ],
    yesBut:
      "The government argues the Intelligence Commissioner review is a meaningful safeguard, and that the orders are only used for specific national-security and serious-crime purposes.",
    bottomLine:
      "The lack of public reporting makes it structurally impossible for civil society or independent researchers to know how often the power is used, what capabilities are being built, or whether the Intelligence Commissioner review is rigorous in practice.",
  },
  methodology:
    "Descriptions of the SAAIA capability-order regime are based on Bill C-22's first-reading text and the federal backgrounder published by Public Safety Canada at the time of first reading. Industry positions are from public statements: Meta's submission to the House debate, Apple's longstanding published positions on government-mandated technical capabilities, the Electronic Frontier Foundation's May 2026 brief on C-22, and the U.S. House Judiciary Committee's letter to the Government of Canada raising cross-border concerns. Quotes from Michael Geist are from his published analytical coverage. We did not contact any of the named companies or officials for this article; the cited positions are from on-record public statements.",
  sections: [
    {
      title: "What a \"secret capability order\" actually is",
      body: `Under Part 2 of Bill C-22 — the Supporting Authorized Access to Information Act (SAAIA) — the Public Safety Minister is granted authority to issue \"capability orders\" to electronic service providers operating in Canada. The bill's terminology is technical, but the substance is direct: the Minister can require a provider to:\n\n- **Build a specific surveillance capability.** Not merely permit access to data the provider already has. The order can require the provider to design, develop, and deploy a new technical capability that the provider would not otherwise have built.\n- **Maintain the capability.** The order can require the provider to keep the capability operational, with ongoing engineering investment, for the duration the Minister specifies.\n- **Cooperate operationally.** The provider can be required to facilitate use of the capability by authorized federal investigators.\n\nThe order is signed by the Minister. The Minister's decision is informed by departmental advice from Public Safety Canada and operational input from the agencies that would use the capability — primarily the RCMP and CSIS.`,
    },
    {
      title: "The non-disclosure piece",
      body: `The most distinctive feature of the SAAIA regime — and the feature that draws the sharpest opposition — is the non-disclosure requirement.\n\nUnder the bill, a provider receiving a capability order is legally barred from disclosing that the order exists. Specifically, the provider cannot:\n\n- Tell its customers that a capability has been built into the service.\n- Inform the press of the order's existence.\n- Disclose the order to shareholders or in public regulatory filings.\n- Acknowledge the order in response to specific questions from journalists, customers, or oversight bodies.\n\nThe non-disclosure obligation runs with the order. The provider's senior leadership knows. The provider's engineering team knows (to the extent they need to know to build the capability). The Minister, the Intelligence Commissioner, and the operational agencies know. The public does not.\n\nThis differs from the existing CSE / CSIS warrant regime in scope. Existing intelligence warrants have classification rules attached to their content — but the existence of the warrant authority itself is public, the number of warrants issued is published in aggregate annual reports, and providers have generally been able to issue \"transparency reports\" disclosing aggregate numbers of warrants received. SAAIA, as drafted, does not provide for that aggregate-disclosure path.`,
    },
    {
      title: "How the Intelligence Commissioner review works",
      body: `The bill points to the Intelligence Commissioner (IC) as the review body for the Minister's SAAIA orders. The IC reviews each order for \"reasonableness\" — a standard borrowed from the existing IC mandate under the National Security Act, 2017.\n\nWhat is IN the review:\n- The legal threshold for issuing the order (whether the Minister's grounds meet the statutory requirements).\n- Whether the Minister's reasoning is reasonable in the circumstances.\n- Whether the technical requirements imposed on the provider are proportionate to the stated purpose.\n\nWhat is NOT in the review:\n- Public reporting of the existence or aggregate count of orders.\n- Investigation of complaints from providers or users.\n- Audit of how the capability is used after the order is approved.\n- Public reporting on whether the IC's review reasoning was followed by the agencies that use the capability.\n\nThe IC publishes an annual report. Existing IC annual reports cover the IC's broader caseload — CSE authorizations, CSIS measures, ministerial directives — and do not separately catalogue the use of specific authorities. Without specific disclosure obligations under the SAAIA regime, the public reporting would, by default, fold any SAAIA reviews into the same aggregated case statistics that exist today.`,
    },
    {
      title: "Why technology firms specifically oppose it",
      body: `Meta and Apple have both publicly opposed the SAAIA capability-order regime. Their stated concerns center on two distinct points.\n\n**The security argument.** A surveillance capability built into a service is also a vulnerability that bad actors can exploit. Apple has argued this point in multiple jurisdictions, most prominently in the 2016 FBI / San Bernardino litigation: building a backdoor for authorized use creates infrastructure that, once it exists, becomes a target for unauthorized exploitation. The same architecture that lets authorized investigators access communications can, in principle, be exploited by foreign intelligence services or organized crime that compromises the provider's systems.\n\n**The disclosure argument.** Technology firms operate transparency programs in part because users demand them. A provider whose products advertise end-to-end security cannot truthfully maintain that claim while operating under a secret order that compromises the security property. The non-disclosure rule, as Apple has argued in U.S. proceedings, forces companies into a position of either misrepresenting their products' security to customers or refusing the order.\n\nThe Electronic Frontier Foundation's May 2026 brief on C-22 frames this as a \"systemic insecurity\" problem: even users who would consent to surveillance in narrowly-defined contexts cannot make informed decisions about which services to trust when capability-order existence is undisclosed.`,
    },
    {
      title: "Why civil society opposes it",
      body: `Michael Geist has been on record from the bill's first reading that the SAAIA capability-order power is the bill's most aggressive provision. In his analytical coverage, Geist has framed the concern as a structural asymmetry: the government knows what surveillance capabilities exist in Canadian services; the public does not.\n\nThe Electronic Frontier Foundation's May 2026 brief on Bill C-22 echoes the same framing in stronger terms, drawing on EFF's longer institutional record opposing equivalent capability-order regimes in the United States (CALEA), the United Kingdom (the Investigatory Powers Act), and Australia (TOLA). The EFF brief notes that in every jurisdiction where capability-order regimes have been enacted, the regimes have expanded beyond their initial statutory scope through interpretive practice.\n\nThe BC Civil Liberties Association and the International Civil Liberties Monitoring Group have both filed submissions opposing the SAAIA provisions specifically, framing the non-disclosure rule as incompatible with the existing Canadian transparency-reporting practice that telecommunications providers have voluntarily developed over the last decade.`,
    },
    {
      title: "The U.S. cross-border angle",
      body: `The U.S. House Judiciary Committee, in a letter to the Government of Canada dated April 2026, flagged Bill C-22 as a cross-border concern. The letter raises the interaction between Canadian capability orders and the U.S. Cloud Act framework, which governs cross-border law-enforcement access to data held by U.S.-based providers.\n\nThe Cloud Act allows a U.S. provider to challenge a foreign order that conflicts with U.S. law. The non-disclosure rule under SAAIA complicates that process: a U.S. provider receiving a Canadian capability order may not be able to mount an effective Cloud Act challenge if the order's existence is itself undisclosable.\n\nThe House Judiciary letter also raises Budapest Convention concerns. The 2001 Council of Europe Convention on Cybercrime sets transparency expectations for signatory states (including Canada) on cross-border data-access regimes. The Committee letter argues that secret capability orders, by design, are in tension with those expectations.`,
    },
    {
      title: "What amendments could restore accountability",
      body: `None of the amendments that committee MPs could propose on the SAAIA provisions are radical. Each has a precedent in lawful-access regimes in other peer democracies:\n\n- **Aggregate public reporting.** Require the Minister to publish, annually, the total number of capability orders issued in the previous year, broken down by broad subject-matter category, without disclosing operational details. This is standard practice for FISA-court orders in the United States.\n- **OPC notification.** Require the Minister to notify the Office of the Privacy Commissioner (in confidence) of each order issued. The OPC would publish aggregate counts as part of its annual report to Parliament.\n- **Narrowed scope.** Restrict the SAAIA capability-order power to traditional telecommunications service providers, rather than the broader \"electronic service provider\" category, which can sweep in messaging platforms, cloud providers, and online services.\n- **Ex post Parliamentary review.** Require an automatic review of the SAAIA regime by a Parliamentary committee three years after enactment, with mandatory testimony from the Minister, the Intelligence Commissioner, and the OPC.\n\nAny of these amendments would require government-side support to pass under the current majority structure. Day 7 of this series catalogues the seven Liberal MPs on the Standing Committee on Public Safety and National Security whose decisions over the coming weeks will determine which amendments, if any, are accepted.`,
    },
  ],
  sources: [
    {
      label: "Bill C-22 — LEGISinfo (current status + bill text)",
      url: "https://www.parl.ca/legisinfo/en/bill/45-1/c-22",
    },
    {
      label: "Public Safety Canada — backgrounder on Part 2 (SAAIA)",
      url: "https://www.canada.ca/en/public-safety-canada/news/2026/03/minister-anandasangaree-in-montreal-to-highlight-new-tools-to-help-law-enforcement-investigate-threats-and-keep-canadians-safe.html",
    },
    {
      label: "Michael Geist — Tale of Two Bills (analytical coverage of SAAIA risks)",
      url: "https://www.michaelgeist.ca/2026/04/a-tale-of-two-bills-bill-c-22-and-the-backdoor-surveillance-risks/",
    },
    {
      label: "Electronic Frontier Foundation — May 2026 brief on Bill C-22",
      url: "https://www.eff.org/deeplinks/2026/05/canadas-lawful-access-act-and-the-secret-order-problem",
    },
    {
      label: "U.S. House Judiciary Committee — letter to Government of Canada on C-22",
      url: "https://judiciary.house.gov/news/letter-government-canada-bill-c-22",
    },
    {
      label: "Apple — published positions on government-mandated capability orders",
      url: "https://www.apple.com/privacy/government-information-requests/",
    },
    {
      label: "Intelligence Commissioner — annual report (institutional role description)",
      url: "https://www.canada.ca/en/intelligence-commissioner.html",
    },
  ],
};
