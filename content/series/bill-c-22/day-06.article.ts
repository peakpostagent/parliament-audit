/**
 * Bill C-22 Series — Day 6: Documented Canadian surveillance overreach
 *
 * Historical-Canadian-precedent piece. Shows from declassified files,
 * CBC reporting, BCCLA litigation, and the MMIWG inquiry that
 * surveillance powers granted to RCMP and CSIS have been used against
 * politicians, Indigenous land defenders, and environmental activists.
 * Not hypothetical — documented. The article does not claim C-22 will
 * necessarily be used this way; it shows what HAS happened when
 * similar latitude was granted.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'bill-c-22-canadian-surveillance-history-tommy-douglas-pipeline-protesters',
  headline:
    "Canada Has Granted Surveillance Powers Like Bill C-22 Before. Here Is How They Were Used.",
  subheadline:
    "Declassified RCMP files show the man who built Medicare was surveilled for 30 years. Internal CSIS documents released through the BCCLA show pipeline-protest organizers were monitored, with the intelligence shared back to the company being protested. The MMIWG inquiry found Indigenous land defenders were \"surveilled, criminalized, and subjected to violence\" by the RCMP. Each of these powers, at the time they were granted, had reasonable-sounding justifications. Here is what the record shows.",
  summary:
    "Bill C-22's defenders argue that the bill's safeguards and stated use cases will prevent the new surveillance powers from being misused. The argument is not new. Canadians have heard versions of it before every previous expansion of federal surveillance authority, from the 1939 establishment of the RCMP Security Service through the 2015 Anti-Terrorism Act. The declassified historical record — through Access to Information releases, court orders obtained by the BC Civil Liberties Association, CBC News investigations, and the formal findings of the Missing and Murdered Indigenous Women and Girls inquiry — shows what was actually done with those powers, after the safeguards were in place. The RCMP surveilled Tommy Douglas (the founder of Medicare) for over 30 years. CSIS told police that Indigenous land defenders at Ipperwash were armed in 1995, a claim that turned out to be false, three days before an OPP officer shot Dudley George. CSIS surveilled peaceful Northern Gateway pipeline opponents and shared intelligence back to Enbridge — the company being protested. This article walks the documented record. It does not claim Bill C-22 will be used in any of these ways; it shows what HAS happened when similar latitude was granted.",
  publishedAt: new Date().toISOString(),
  category: 'Accountability',
  tags: ['Bill C-22', 'RCMP', 'CSIS', 'civil liberties', 'history', 'Indigenous rights', 'surveillance abuses'],
  readingTimeMinutes: 9,
  keyTakeaways: [
    "RCMP Security Service surveilled Tommy Douglas — the founder of Medicare — for over 30 years (1939–1986).",
    "The Tommy Douglas RCMP file is one of 650 \"VIP program\" dossiers on Canadian politicians and public figures. About one-fifth of the Douglas file remains classified today; CSIS has refused court orders to release the rest.",
    "CSIS told police in 1995 that Indigenous land defenders at Ipperwash were armed. They were not. Three days later, OPP officer Kenneth Deane fatally shot land defender Dudley George.",
    "BCCLA litigation forced the release of \"Protest Papers\" showing CSIS spied on peaceful Northern Gateway pipeline opponents and shared intelligence back to Enbridge.",
    "The 2019 MMIWG inquiry found in formal Royal Commission findings that Indigenous land defenders \"are vilified, surveilled, criminalized, and subjected to violence by the RCMP.\"",
    "In 2024, the RCMP commissioner publicly expressed regret for the decades-long Indigenous-surveillance program.",
  ],
  smartBrevity: {
    bigThing:
      "The argument that \"surveillance powers will only be used against the right targets\" is a claim Canadians have heard before — for over 50 years. The declassified record shows otherwise.",
    whyItMatters:
      "Bill C-22's defenders point to safeguards and to limited use cases. The historical record is what happens after those safeguards are in place, when the political context shifts.",
    goDeeper: [
      "The RCMP surveilled Tommy Douglas for over 30 years, keeping him in their VIP-program dossier alongside 650 other politicians and public figures.",
      "RCMP ran an Indigenous-extremism program from 1968 to 1982; CSIS restarted similar surveillance in 1988.",
      "CSIS told police Indigenous land defenders at Ipperwash were armed in 1995, days before OPP shot Dudley George.",
      "BCCLA litigation forced the release of \"Protest Papers\" showing CSIS spied on peaceful Northern Gateway opponents and shared intelligence with Enbridge.",
      "The RCMP commissioner publicly regretted the Indigenous surveillance program in 2024.",
    ],
    yesBut:
      "None of these abuses arose under powers exactly equivalent to Bill C-22; they arose under different statutes, different oversight regimes, and in different eras.",
    bottomLine:
      "When new powers are granted to RCMP and CSIS, the historical pattern is that the powers expand in practice beyond their stated purpose. Bill C-22 grants new powers with weaker oversight than its predecessors. The pattern of expansion has, every prior time, been documented after the fact — not predicted in advance.",
  },
  methodology:
    "Documentation of historical RCMP and CSIS surveillance practices is drawn from declassified Access to Information releases, the National Inquiry into Missing and Murdered Indigenous Women and Girls (MMIWG) final report (2019), the BC Civil Liberties Association's \"Protest Papers\" disclosed through court order, and contemporaneous CBC News and Globe and Mail reporting. Tommy Douglas's RCMP file was released in tranches in 2006 and 2010 under the Access to Information Act; portions remain classified. Information on the Ipperwash incident is from the 2007 Ipperwash Inquiry report (the Linden Commission). Information on the CSIS Indigenous-surveillance program is from CBC News investigations, the 2024 RCMP commissioner's public statement, and Chiefs of Ontario submissions. We did not contact the RCMP, CSIS, or the Government of Canada for this article; the cited material is from formal public-record sources.",
  sections: [
    {
      title: "The premise",
      body: `When surveillance bills are debated, the public defense follows a recognizable pattern: trust the safeguards, trust the agencies, the powers will only be used against legitimate targets. Bill C-22's House debate in April 2026 followed that pattern almost word for word. The Public Safety Minister has emphasized the bill's safeguards. The Justice Minister has emphasized the requirement of a production order. The Parliamentary Secretary has emphasized the bill's child-exploitation use cases.\n\nThis is not an unusual pattern. Every prior expansion of federal surveillance authority in Canada has been defended on the same lines: the 1939 establishment of the RCMP Security Service; the 1984 creation of CSIS via the CSIS Act; the 2001 Anti-Terrorism Act; the 2015 Bill C-51; the lawful-access proposals of 2009 and 2012; the abandoned Bill C-2 of 2025.\n\nWhat distinguishes Canadian civic discussion of these regimes from the discussion in some other democracies is that we have decades of declassified record showing what was actually done, after the safeguards were in place. The record is what informs whether the next round of safeguards can be expected to hold.`,
    },
    {
      title: "Tommy Douglas, 1939–1986",
      body: `**Tommy Douglas** was the seven-term Premier of Saskatchewan (1944–1961), the first leader of the federal New Democratic Party (1961–1971), and the legislative architect of Canada's universal public-healthcare system. He is widely regarded across partisan lines as the founder of Medicare.\n\nThe RCMP Security Service opened a file on Tommy Douglas in 1939. It was maintained continuously until his death in 1986 — over 30 years of surveillance of a sitting Premier, then a federal party leader, then a former federal party leader.\n\nThe file was released in tranches under the Access to Information Act in 2006 and 2010. CBC News and the Globe and Mail covered both releases. The documents that have been released show that the RCMP:\n\n- Attended Douglas's public speeches and recorded the contents.\n- Maintained a clipping file of his published writing.\n- Eavesdropped on a private conversation Douglas had during a demonstration on Parliament Hill.\n- Monitored his correspondence with foreign political figures.\n- Kept the file open through the period when Douglas was Leader of the federal Opposition.\n\nThe Douglas file is one of 650 dossiers in what the RCMP called the \"VIP program\" — surveillance files on Canadian politicians and public figures. About one-fifth of the Douglas file remains classified today. CSIS, which inherited the RCMP Security Service's files in 1984, has resisted court orders to release the rest.\n\nThe Saskatchewan provincial government's policy positions, Douglas's federal NDP platform, his published writing, and his public speeches were entirely lawful political activity. The 30-year RCMP surveillance was not authorized by any statute that named him as a target. It was authorized by the broad operational latitude granted to the RCMP Security Service to identify and monitor \"persons of interest.\"`,
    },
    {
      title: "The Indigenous-extremism programs, 1968–present",
      body: `Between 1968 and 1982, the RCMP ran a domestic-intelligence program internally called the \"Indigenous extremism\" program. The program's stated purpose was to monitor foreign-state involvement in Indigenous-rights movements in Canada. In 1978, in response to internal reviews, the program was narrowed in scope to focus specifically on \"foreign involvement.\"\n\nIn 1988, four years after CSIS was created via the CSIS Act, the program was restarted in modified form within CSIS. The 1988-era program is the subject of CBC News investigations published in 2024 and 2025 — investigations enabled by Access to Information releases that took over a decade to process.\n\nThe most consequential documented incident in this surveillance lineage occurred in September 1995 at Ipperwash Provincial Park in Ontario. Indigenous land defenders from the Stony Point First Nation had occupied the park, which contained ancestral burial sites that had been seized by the federal government for military use during the Second World War and never returned.\n\nInternal documents indicate that CSIS told the Ontario Provincial Police that the land defenders at Ipperwash were armed. The claim was false. Three days later, on September 6, 1995, an OPP officer named Kenneth Deane fatally shot land defender Dudley George — an unarmed man.\n\nThe Linden Commission (the Ipperwash Inquiry, 2007) examined the OPP's conduct in detail. The Commission did not have full access to CSIS's internal documents; the CSIS dimension of the case has been pieced together over the years that followed, through Access to Information releases and CBC News investigation.\n\nIn 2024, the RCMP commissioner publicly expressed regret for the decades-long Indigenous-surveillance program. The Chiefs of Ontario have issued a formal statement calling for a public inquiry into the program's full scope.`,
    },
    {
      title: "The MMIWG inquiry's findings",
      body: `The National Inquiry into Missing and Murdered Indigenous Women and Girls (MMIWG) was a federal Royal Commission established in 2016. Its final report was delivered in June 2019, in two volumes totalling over 1,200 pages.\n\nThe MMIWG inquiry made the following formal finding on policing and surveillance, in Volume 1b of its report: Indigenous land defenders \"are vilified, surveilled, criminalized, and subjected to violence by the RCMP.\" The finding was made on the basis of testimony from Indigenous witnesses across Canada, expert-witness reports, and the inquiry's review of internal RCMP records that were disclosed.\n\nThis is a formal Royal Commission finding, not opinion journalism. A Royal Commission's findings are not legally binding on the government — but they are admissible in subsequent litigation and they carry the official imprimatur of the federal Crown that established the inquiry.\n\nThe inquiry's recommendations included specific requirements for civilian oversight of RCMP surveillance of Indigenous-rights organizations. None of those recommendations have been implemented in federal legislation as of the 2026 session.`,
    },
    {
      title: "The Northern Gateway pipeline protests, 2013–2017",
      body: `Between 2013 and 2017, the Northern Gateway pipeline project — Enbridge's proposal to ship Alberta bitumen by pipeline to a marine terminal on the British Columbia coast — drew sustained opposition from environmental, civil-society, and First Nations organizations.\n\nIn 2014, the BC Civil Liberties Association (BCCLA) filed a formal complaint alleging that CSIS and the RCMP had surveilled organizers of peaceful protest against the project. The complaint was filed with the Security Intelligence Review Committee (now the National Security and Intelligence Review Agency, NSIRA) and through the Federal Court system. The BCCLA's request was specific: produce the documents that show what was surveilled, by whom, and what was done with the intelligence.\n\nAfter several years of litigation, the BCCLA obtained partial disclosure under court order. The released documents — collectively referred to as the \"Protest Papers\" — were heavily redacted but substantively damning:\n\n- **Monitoring of social media.** CSIS / RCMP analysts maintained ongoing watch on Twitter, Facebook, and Indymedia accounts of protest organizers.\n- **Attendance at organizing meetings.** Documents show CSIS analysts attended open public meetings of protest organizing committees.\n- **Storytelling-workshop surveillance.** A specific incident documented in the Protest Papers: CSIS monitoring of an Indigenous-led storytelling workshop held in a church in Kelowna, British Columbia.\n- **Industry intelligence-sharing.** The most consequential disclosure: Natural Resources Canada shared the surveillance details with Enbridge — the pipeline operator being protested — and the broader Canadian petroleum industry at an off-the-record industry briefing. The Narwhal subsequently published the internal RCMP assessment, which described pipeline opponents as \"anti-petroleum extremists.\"\n\nThe Northern Gateway file is the single clearest documented case in modern Canada of federal intelligence-gathering powers being used to monitor peaceful political activity, and of the resulting intelligence being shared with the private-sector interest adverse to the activity being monitored.`,
    },
    {
      title: "The Manitoba \"Native extremism\" files",
      body: `CBC News reporting in early 2026 surfaced detailed RCMP intelligence files on First Nations leaders and activists in Manitoba. The files were released after a decade-long Access to Information process and span a period from the 1970s through the 2000s.\n\nThe Manitoba files document surveillance of: Indigenous elected band leaders, treaty-rights organizers, Manitoba Métis Federation officials, and First Nations academics whose work was concentrated in land-rights advocacy. The targets are, in significant part, figures Canadians would recognize as legitimate political voices — elected officials, recognized treaty negotiators, university faculty.\n\nNone of the surveillance documented in the Manitoba files was authorized by warrant in the modern sense. It was authorized by the broad operational latitude granted to the RCMP under its general security-intelligence mandate, in the period before CSIS was created in 1984.`,
    },
    {
      title: "What this means for Bill C-22",
      body: `The historical record does not predict that Bill C-22 will be used against politicians, Indigenous land defenders, or environmental activists. The bill is at second reading; it is not yet law. The agencies that would use the bill's powers have new commissioners, new internal accountability structures (NSIRA, the Intelligence Commissioner, NSICOP), and new operational guidance compared to 1939, 1968, 1988, or even 2013.\n\nWhat the record does show is the structural pattern that has held across regimes:\n\n1. **Surveillance powers expand beyond their stated purpose.** The RCMP Security Service was not chartered to surveil Premiers. CSIS was not chartered to share pipeline-protest intelligence with the pipeline company. In both cases, the latitude granted by the underlying statute was used in ways that were not contemplated in the statute's debate.\n2. **Intelligence flows to interests adverse to the surveilled.** The Northern Gateway case is the documented modern example. The Ipperwash case is the documented historical example — CSIS intelligence flowed to the OPP, the police force whose officer subsequently shot Dudley George.\n3. **The surveillance footprint persists for decades.** The Douglas file was open for 47 years. Portions remain classified 40 years after his death. The structural feature of intelligence files is that they accumulate; they do not erode.\n\nBill C-22's specific provisions — the metadata-retention mandate, the secret capability-order regime, the access threshold change — interact with this structural pattern. The retained metadata exists. The capability orders exist. The Intelligence Commissioner's review is case-by-case and not public. The Privacy Commissioner has no statutory role.\n\nWhether the structural pattern recurs under C-22's regime is not predictable. What is predictable, on the record of every prior expansion, is that the documentation will follow after the fact — not in advance.`,
    },
    {
      title: "What this article is not claiming",
      body: `This article does not claim that the Carney government has any intention to misuse Bill C-22's powers. It does not claim that the RCMP or CSIS are currently planning equivalent abuses. It does not claim that the historical abuses prove future ones.\n\nWhat it does claim is that the documented historical record — declassified files, court-ordered disclosures, Royal Commission findings — is what should inform Parliamentary debate over the bill's oversight architecture. Not the assurances of the day; not the assurances of any government in the moment they ask for new powers.\n\nThe assurances offered in 1939, in 1968, in 1988, and in 2013 were not dishonest. The senior officials who offered them likely believed them. The pattern that has emerged is structural rather than individual. The question for the Standing Committee on Public Safety and National Security, on which seven Liberal MPs hold the deciding votes on amendments, is whether the bill's oversight architecture is adequate to the structural pattern the historical record describes.\n\nDay 7 of this series catalogues the seven Liberal MPs on SECU and how to reach them.`,
    },
  ],
  sources: [
    {
      label: "CBC News — RCMP spied on Tommy Douglas, files reveal (2006)",
      url: "https://www.cbc.ca/news/canada/rcmp-spied-on-tommy-douglas-files-reveal-1.626622",
    },
    {
      label: "Globe and Mail — RCMP spied on Tommy Douglas (2014 release)",
      url: "https://www.theglobeandmail.com/news/national/rcmp-spied-on-tommy-douglas/article18180106/",
    },
    {
      label: "CBC News — RCMP spies infiltrated the 1970s Indigenous rights movement",
      url: "https://www.cbc.ca/news/indigenous/rcmp-spies-1970s-indigenous-rights-9.7134112",
    },
    {
      label: "CBC News — Indigenous leaders in Manitoba monitored as part of RCMP \"Native extremism\" program",
      url: "https://www.cbc.ca/news/canada/manitoba/rcmp-intelligence-files-indigenous-leaders-activists-9.7140524",
    },
    {
      label: "CBC News — RCMP commissioner regrets Indigenous spying program (2024)",
      url: "https://www.cbc.ca/news/politics/rcmp-response-indigenous-spying-operation-9.7141533",
    },
    {
      label: "MMIWG National Inquiry — Final Report, Volume 1b",
      url: "https://www.mmiwg-ffada.ca/final-report/",
    },
    {
      label: "BCCLA — Protest Papers release (Georgia Straight coverage)",
      url: "https://www.straight.com/news/1263836/bc-civil-liberties-association-releases-protest-papers-showing-csis-surveillance",
    },
    {
      label: "National Observer — Spies in our midst (RCMP and CSIS, green activists)",
      url: "https://www.nationalobserver.com/2017/05/05/news/spies-our-midst-rcmp-and-csis-snoop-green-activists",
    },
    {
      label: "The Narwhal — RCMP \"anti-petroleum extremists\" assessment",
      url: "https://thenarwhal.ca/leaked-internal-rcmp-document-names-anti-petroleum-extremists-threat-government-industry/",
    },
    {
      label: "Ipperwash Inquiry (Linden Commission) Final Report (2007)",
      url: "https://www.attorneygeneral.jus.gov.on.ca/inquiries/ipperwash/report/index.html",
    },
    {
      label: "Bill C-22 — LEGISinfo (current status + bill text)",
      url: "https://www.parl.ca/legisinfo/en/bill/45-1/c-22",
    },
  ],
};
