/**
 * Bill C-22 Series — Day 3: the Privacy Commissioner is missing
 *
 * The structural / institutional piece. The Office of the Privacy
 * Commissioner is the federal body that exists specifically to audit
 * how government and providers handle Canadians' personal data. The
 * bill grants new powers and creates new retention mandates — and
 * contains no statutory role for the OPC. That absence is itself
 * a story.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'bill-c-22-privacy-commissioner-no-oversight-role',
  headline:
    "Bill C-22 Creates New Surveillance Powers. The Privacy Commissioner Has No Role in Overseeing Any of Them.",
  subheadline:
    "Every recent Canadian lawful-access proposal — from Bill C-30 in 2012 to Bill C-2 last year — included some statutory role for the Office of the Privacy Commissioner. Bill C-22 does not. The OPC cannot audit how the retained metadata is stored, cannot review the secret capability orders, and has no investigation power over complaints arising from the new regime. Here is what changed.",
  summary:
    "The Office of the Privacy Commissioner of Canada is the federal body designed specifically to audit how privacy-affecting government and private-sector practices are conducted. Every recent lawful-access bill in Canada — Bill C-30 (Toews, 2012), Bill C-2 (Strong Borders Act, 2025) — included some statutory role for the OPC in the regime being created. Bill C-22 (Lawful Access Act, 2026) does not. The OPC has no audit role over the bill's one-year metadata-retention requirement, no review role over the Public Safety Minister's secret capability orders, and no complaint jurisdiction over the new regime. The bill instead points to the Intelligence Commissioner as the review body for ministerial orders — a different review body with a different scope. This article walks through what changed between the predecessors and the current bill, and what an OPC role could look like as an amendment.",
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['Bill C-22', 'Privacy Commissioner', 'oversight', 'civil liberties', 'lawful access', 'accountability'],
  readingTimeMinutes: 6,
  keyTakeaways: [
    "Bill C-22 contains no statutory oversight role for the Office of the Privacy Commissioner — no audit power, no review of secret orders, no complaint jurisdiction over the new surveillance regime.",
    "Predecessors did include OPC roles: Bill C-30 (2012, Toews) had OPC reporting requirements; Bill C-2 (2025) likewise.",
    "The bill points to the Intelligence Commissioner as the review body for ministerial orders — a different role from privacy audit and not interchangeable.",
    "Michael Geist on the design choice: the OPC's absence \"suggests that privacy is at best a secondary consideration\" in the bill.",
    "The Department of Justice's Charter statement on Bill C-22 is silent on the metadata-retention question.",
  ],
  smartBrevity: {
    bigThing:
      "The Office of the Privacy Commissioner has no statutory oversight role under Bill C-22 — no audit power, no review of secret orders, no complaint jurisdiction over the new surveillance regime.",
    whyItMatters:
      "The OPC is the federal body specifically designed to audit privacy-affecting government and private-sector practices. Its absence from a privacy-affecting bill is a deliberate design choice, not an oversight.",
    goDeeper: [
      "Bill C-30 (2012, withdrawn): contained OPC reporting requirements.",
      "Bill C-2 (2025, abandoned): contained OPC reporting requirements.",
      "Bill C-22 (2026): contains no OPC oversight role.",
      "The Intelligence Commissioner reviews ministerial decisions — but does not audit retention practices, investigate complaints, or report aggregate statistics publicly.",
      "Department of Justice's Charter statement on the bill is silent on the metadata-retention question (Geist's observation).",
    ],
    yesBut:
      "The bill does require ministerial orders under Part 2 (SAAIA) to receive Intelligence Commissioner approval. That is a different review body, with a different scope.",
    bottomLine:
      "The Intelligence Commissioner reviews ministerial decisions for reasonableness; the Privacy Commissioner audits privacy practices in detail. They are not interchangeable. The bill substitutes one for the other.",
  },
  methodology:
    "Predecessor-bill comparisons are based on the public LEGISinfo records for Bill C-30 (41st Parliament, 1st session) and Bill C-2 (44th Parliament, 1st session — Strong Borders Act). Quotes from Michael Geist are from his published analytical coverage of Bill C-22. We reviewed Bill C-22's first-reading text section-by-section for any reference to the OPC; the references that exist are non-statutory (i.e., a general acknowledgement of privacy concerns rather than a grant of audit, review, or investigation authority). We did not contact the OPC's office for this article; the OPC's public submission on the bill, when issued, will be added to the sources block.",
  sections: [
    {
      title: "What the Privacy Commissioner does",
      body: `The Office of the Privacy Commissioner of Canada (OPC) is an Officer of Parliament. The OPC has existed since 1983 under the Privacy Act and operates under two statutes: the Privacy Act (governing federal departments' handling of personal information) and PIPEDA (governing private-sector handling of personal information in commercial activity).\n\nThe OPC's core powers include: auditing federal departments' privacy practices, investigating complaints from individuals, reporting publicly to Parliament on systemic issues, conducting research and public education, and reviewing Privacy Impact Assessments before new federal programs launch.\n\nIn the lawful-access context specifically, the OPC has been the principal independent voice on every prior lawful-access proposal in Canada: the 2002 Lawful Access consultation, the 2009 Conservative bills, Bill C-30 in 2012, and the Trudeau-era Bill C-51 (the 2015 anti-terror omnibus). Each of those proposals contained explicit OPC oversight roles in the regime they created.`,
    },
    {
      title: "What predecessor lawful-access bills included",
      body: `**Bill C-30 (the 2012 Toews bill).** The "Protecting Children From Internet Predators Act" was the most controversial lawful-access bill of the Harper era. It was withdrawn after public outcry. The bill contained provisions requiring the Public Safety Minister to "consult with the Privacy Commissioner" on regulations and required telecommunications service providers (TSPs) to give the OPC certain reporting obligations. Those provisions were embedded in the bill text, not relegated to policy guidance.\n\n**Bill C-2 (the 2025 Strong Borders Act).** The most-recent predecessor to C-22. Tabled by the previous government, abandoned before second reading. The bill contained a section requiring the Public Safety Minister to "consult with the Privacy Commissioner of Canada" before issuing regulations governing the retention of telecommunications data. While narrower than C-30's provisions, it was a statutory OPC touchpoint within the regime.\n\n**Bill C-22 (2026).** No equivalent provision. The Privacy Commissioner is referenced in the federal backgrounder accompanying the bill, but the bill text itself does not contain a "Privacy Commissioner" role within the regime it creates.`,
    },
    {
      title: "What Bill C-22 contains — and doesn't",
      body: `Bill C-22 does the following on oversight:\n\n- **Intelligence Commissioner approval** of ministerial orders under Part 2 (SAAIA). The IC reviews specific orders for reasonableness on a case-by-case basis.\n- **Production-order requirement** for police access to retained metadata, with a "reasonable grounds to suspect" threshold.\n- **Warrant requirement** for content access (already required by the Criminal Code).\n\nIt does NOT do the following:\n\n- No statutory authority for the OPC to audit how providers store retained metadata.\n- No requirement that the Minister notify the OPC of secret capability orders (even in confidence).\n- No mechanism for the OPC to report aggregate statistics on the regime to Parliament.\n- No OPC complaint jurisdiction over the C-22 regime specifically (the OPC retains its general PIPEDA jurisdiction over private-sector providers, but with no special standing on C-22-specific practices).\n\nThe OPC therefore enters the C-22 regime only through general PIPEDA — the same statute under which it polices a credit-card company's data-breach handling. The bill creates new federal surveillance powers and does not grant the federal privacy watchdog a corresponding new oversight role.`,
    },
    {
      title: "What the Intelligence Commissioner does — and doesn't",
      body: `The Intelligence Commissioner is a separate institution under the National Security Act, 2017. The IC reviews ministerial decisions in the national-security space — including authorizations for CSE foreign-intelligence operations and CSIS threat-reduction measures — for reasonableness.\n\nThe IC's role differs from the OPC's in three ways:\n\n1. **Scope.** The IC reviews specific ministerial decisions one at a time, asking whether the Minister's reasoning is reasonable. The OPC audits patterns of practice across institutions.\n2. **Reporting.** The IC reports annually to Parliament but is not structured to publish aggregate statistics on the use of specific powers in real time. The OPC publishes detailed annual reports on systemic privacy issues, often naming and tracking specific institutional failures.\n3. **Complaints.** The IC does not investigate complaints from individuals affected by ministerial decisions. The OPC's complaint jurisdiction is one of its core functions and the principal mechanism for individual Canadians to challenge how their data is handled.\n\nMichael Geist's analytical coverage of Bill C-22 has flagged this substitution explicitly: pointing to the IC as the review body for a metadata-retention regime is "not a substitute for OPC oversight" because the two bodies serve different functions in the federal privacy architecture.`,
    },
    {
      title: "What an OPC role could look like",
      body: `None of the OPC roles that could be added to Bill C-22 are hypothetical. Each has a precedent in the OPC's existing federal mandate or in the predecessor lawful-access bills:\n\n- **Audit authority over retention practices.** An amendment could authorize the OPC to audit how a "core provider" stores, accesses, and secures the retained metadata. This is functionally identical to the OPC's audit authority over federal departments' Privacy Act compliance.\n- **In-confidence notification of secret capability orders.** An amendment could require the Minister to notify the OPC (under classification) of each Part-2 order issued. The OPC could then publish aggregate counts annually — number of orders, broad subject-matter categories — without disclosing operational details.\n- **Charter-statement consultation requirement.** An amendment could require the Department of Justice to consult the OPC before issuing the Charter statement on any future amendment touching the metadata-retention regime.\n- **Complaint jurisdiction over the C-22 regime.** An amendment could give the OPC explicit complaint-handling authority for individual Canadians whose data has been accessed through the C-22 regime, with reporting back to Parliament on patterns.\n\nThese are standard OPC functions, not novel powers. They appear in some form in every prior lawful-access regime in Canada.`,
    },
    {
      title: "The political math at committee",
      body: `For an OPC oversight role to be added to Bill C-22, a Liberal MP on the Standing Committee on Public Safety and National Security would have to propose or accept the amendment. SECU has eleven members. Seven are Liberal. Four are opposition (two Conservative Vice-Chairs, plus Bloc and NDP members).\n\nUnder normal House rules, the committee can amend the bill at clause-by-clause review. But under a majority-government structure, government-side amendments are the only ones with a clear path. Opposition amendments need at least one government MP to break ranks — which is uncommon but not unprecedented on civil-liberties questions.\n\nDay 7 of this series catalogues the seven Liberal members of SECU. The Chair is the Honourable Jean-Yves Duclos. The six other Liberal members are Sima Acan, Marianne Dandurand, Anthony Housefather, Marcus Powlowski, Jacques Ramsay, and Amandeep Sodhi.`,
    },
    {
      title: "Why the absence is itself a story",
      body: `Civil-liberties analysts treat institutional architecture — who has audit authority, who reviews what, who reports to whom — as the load-bearing structure of a regime, more telling than the specific operational provisions. The provisions can be amended at committee. The oversight architecture is harder to redesign once the bill is on the statute book.\n\nThe OPC's absence from the bill is the most institutionally distinctive feature of Bill C-22 relative to its predecessors. The predecessors had OPC roles. C-22 does not. That is not a drafting accident — Justice Canada's Bill C-22 working group included departmental privacy specialists, and the OPC's mandate is well known to them. The choice not to include a statutory OPC role under the new regime is exactly that: a choice.\n\nWhat that choice means for the bill's eventual Charter test is the question Day 5 examines, in the context of the European Court of Justice's 2014 ruling on a structurally similar regime.`,
    },
  ],
  sources: [
    {
      label: "Bill C-22 — LEGISinfo (current status + bill text)",
      url: "https://www.parl.ca/legisinfo/en/bill/45-1/c-22",
    },
    {
      label: "Bill C-30 (41-1) — LEGISinfo (Protecting Children From Internet Predators Act)",
      url: "https://www.parl.ca/legisinfo/en/bill/41-1/c-30",
    },
    {
      label: "Bill C-2 (44-1) — LEGISinfo (Strong Borders Act, 2025)",
      url: "https://www.parl.ca/legisinfo/en/bill/44-1/c-2",
    },
    {
      label: "Office of the Privacy Commissioner of Canada — mandate + recent submissions",
      url: "https://www.priv.gc.ca/en/about-the-opc/what-we-do/",
    },
    {
      label: "Intelligence Commissioner — annual reports + role description",
      url: "https://www.canada.ca/en/intelligence-commissioner.html",
    },
    {
      label: "Michael Geist — analytical coverage of Bill C-22 oversight architecture",
      url: "https://www.michaelgeist.ca/2026/03/the-lawful-access-privacy-risks-unpacking-bill-c-22s-expansive-metadata-retention-requirements/",
    },
    {
      label: "Department of Justice — Charter statement on Bill C-22",
      url: "https://www.justice.gc.ca/eng/csj-sjc/pl/charter-charte/c22.html",
    },
  ],
};
