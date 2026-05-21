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
   * Optional editor's note — renders in an amber callout at the top of
   * the article (above the Smart Brevity header). Use for corrections,
   * late-breaking updates, or transparency about substantive edits
   * made after the initial publish.
   */
  editorsNote?: {
    /** ISO date of the note. */
    date: string;
    /** Prose — one short paragraph. Rendered as plain text. */
    body: string;
  };
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
   * Optional explicit hero-stat override for the OG / feed-card image.
   * When set, the social-card renderer uses these values verbatim
   * instead of running its extractor over the summary text. Use it
   * whenever the auto-extractor would pick a misleading number or
   * apply a misleading label — for example, on a piece about
   * procedural thresholds where '10%' could be misread as '10% of
   * Canadians.' The label should be neutral and factually scoped
   * (e.g. 'Signatures submitted', 'NO vote 1980', 'Of vote cast').
   * Added 2026-05-13 after the Alberta-petition article rendered
   * '10% OF CANADIANS' via the percentage-auto-label path.
   */
  heroStat?: { value: string; label: string };
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
  /**
   * Optional "subjects" — two named individuals (or one named + one
   * generic) whose juxtaposition is the story. When set, the social
   * card uses the comparison-style OG template (split portrait, bold
   * headline) instead of the default. Photos are pulled from
   * ourcommons.ca (Crown copyright; non-commercial reproduction
   * permitted with attribution) or Wikimedia Commons.
   *
   * Examples:
   *   subjects: [
   *     { name: 'Marilyn Gladu', role: 'Sarnia–Lambton MP', portraitUrl: 'https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/45/GladuMarilyn_CPC.jpg', party: 'LPC' },
   *     { name: 'Marilyn Gladu (Jan 11)', role: 'Then a Conservative', portraitUrl: 'same as above', party: 'CPC' }
   *   ]
   */
  subjects?: Array<{
    name: string;
    role: string;
    portraitUrl?: string;
    /** Optional party tint applied behind the portrait. */
    party?: 'LPC' | 'CPC' | 'NDP' | 'BQ' | 'GPC' | 'IND';
    /** Optional caption shown under the portrait (e.g. "Then" / "Now"). */
    caption?: string;
  }>;
}

export const newsArticles: NewsArticle[] = [
  {
  slug: 'bill-c-22-what-one-year-of-metadata-reveals',
  headline:
    "Bill C-22 Doesn't Read Your Texts. It Doesn't Have To.",
  subheadline:
    "The bill explicitly excludes the content of communications from mandatory retention. What it would require — who you talked to, when, where you were, what device you used — is the data that intelligence professionals call \"the more important half\" of surveillance. Here is what a year of that data reveals about an ordinary Canadian.",
  summary:
    "Bill C-22 (Lawful Access Act, 2026) does not require police to read the content of your communications. It requires \"core providers\" to retain metadata — who you contacted, when, where, on which device — for one year, on every Canadian. Two former directors of the U.S. National Security Agency have been on record since 2014 that metadata is operationally equivalent-to or more useful than content for surveillance. A Stanford study found that five days of phone metadata is sufficient to identify medical conditions, religious affiliation, and sexual relationships. This article walks through what one year of that data reveals about an ordinary person — not as accusation, but as illustration of what becomes knowable about every Canadian under the bill as drafted.",
  publishedAt: '2026-05-21T19:03:22.208Z',
  category: 'Legislation',
  tags: ['Bill C-22', 'metadata', 'privacy', 'surveillance', 'lawful access', 'civil liberties'],
  readingTimeMinutes: 6,
  keyTakeaways: [
    "Bill C-22 mandates retention of metadata (transmission data, device IDs, location) — not message content.",
    "Stuart Baker, former NSA general counsel (2014): \"Metadata absolutely tells you everything about somebody's life. If you have enough metadata, you don't really need content.\"",
    "Michael Hayden, former director of NSA and CIA (2014): \"We kill people based on metadata.\"",
    "A Stanford study (Mayer & Mutchler, 2014) showed 5 days of phone metadata is sufficient to identify medical conditions, religious affiliation, sexual relationships, and gun ownership.",
    "The retention applies to every Canadian, not just suspects — the existence of a year-long metadata trail changes what is knowable about every person.",
  ],
  smartBrevity: {
    bigThing:
      "Bill C-22 mandates the retention of metadata, not message content. But metadata is what intelligence services call \"the more important half\" of surveillance — it reveals associations, movements, beliefs, and patterns of life.",
    whyItMatters:
      "The bill's defenders point to the content exclusion as a privacy safeguard. The intelligence community has been on record for over a decade saying the opposite: that metadata is more useful than content for understanding a person.",
    goDeeper: [
      "Who you called and when — every call, every duration.",
      "Every cell tower your phone connected to — location every 5–15 minutes, year-round.",
      "Every device you used and the unique identifier of each one.",
      "Every IP address you connected to — which website, which app, which service.",
      "By week 6 of analyzed metadata, a competent analyst can usually identify a person's job, sleep schedule, religion, who they live with, and their political associations.",
    ],
    yesBut:
      "The bill states law enforcement still needs a production order to access this data, with a \"reasonable grounds to suspect\" threshold. Content access still requires a full search warrant.",
    bottomLine:
      "The choice of words — \"metadata, not content\" — is technically accurate and substantively misleading. The retention IS the surveillance; the access threshold is a second question.",
  },
  methodology:
    "All technical descriptions of metadata categories are drawn from Bill C-22 (first-reading text) and the federal Lawful Access backgrounder. Quotes from Stuart Baker (NSA general counsel) and Michael Hayden (NSA / CIA director) are taken from public on-record events (NYU School of Law debate Oct 1, 2013; Johns Hopkins University remarks April 2014). The Stanford MetaPhone study is Mayer & Mutchler, PNAS 2016. We did not contact any of the named officials for this article; their quoted statements are well-attested across multiple sources.",
  sections: [
    {
      title: "What the bill says metadata is",
      body: `Bill C-22's metadata definition covers four overlapping categories. The bill text refers to "transmission data" — the technical record of what was sent, when, between which endpoints, and via which protocol. The bill additionally lists subscriber information (the user behind a device or service), device identifiers (every IMEI, MAC address, advertising ID, account handle), and "location information sufficient to determine the location of a communication."\n\nThe bill explicitly excludes the content of communications from mandatory retention. The Public Safety Minister has emphasized this distinction in House debate. A warrant is still required to access the substantive content of a phone call, text, or email.\n\nThat exclusion is technically accurate. It is also, on the intelligence community's own record, the less important half.`,
    },
    {
      title: "What the intelligence community has said about metadata",
      body: `**Michael Hayden** ran the National Security Agency from 1999 to 2005 and the Central Intelligence Agency from 2006 to 2009. At a Johns Hopkins University event in April 2014 — speaking publicly, on the record — he said: "We kill people based on metadata." The statement was a defense of the operational value of metadata-only intelligence, not a critique.\n\n**Stuart Baker** was general counsel of the NSA. At a New York University School of Law debate in October 2013, also on the record, Baker said: "Metadata absolutely tells you everything about somebody's life. If you have enough metadata, you don't really need content. … It's sort of embarrassing how predictable we are as human beings."\n\nThese are not civil-liberties activists speaking. They are two of the most senior practitioners of modern signals intelligence in the United States, describing why metadata is the form of surveillance their agencies prioritized.`,
    },
    {
      title: "The Stanford MetaPhone study — what 5 days of metadata reveals",
      body: `In 2014–2015, Stanford computer scientists Jonathan Mayer and Patrick Mutchler conducted a controlled study published in PNAS in 2016. They recruited volunteers who agreed to share their phone metadata — call records and contact information only, no content — for analysis.\n\nFrom an average of five days of metadata per participant, the researchers identified, with high confidence:\n- Medical conditions (calls to specific medical specialists at characteristic intervals)\n- Religious affiliation (call patterns to congregations and clergy)\n- Sexual relationships (calls to crisis lines, intimate partners)\n- Gun ownership (calls to firearm dealers and ranges)\n- Marijuana use (calls to known dispensaries)\n\nFive days. Not a year. And the Mayer-Mutchler study was a research analysis, not an intelligence-grade analytic platform — modern systems are materially more sophisticated.`,
    },
    {
      title: "A year in the life of an ordinary Canadian",
      body: `Consider any ordinary Canadian — not a target, not a suspect. From one year of the metadata Bill C-22 would require to be retained, a competent analyst could, with high reliability, derive:\n\n- **Place of work and commute pattern** — from the cell-tower trail. The morning trail also reveals daycare drop-off, gym attendance, coffee shops.\n- **Religious practice** — call frequency to specific congregations, location patterns on Sundays / Fridays / Saturdays at known addresses.\n- **Medical history** — call patterns to specialists. An oncologist appearing in the call log every 21 days reveals a treatment cycle without ever accessing a medical record.\n- **Romantic life** — sustained call patterns and overnight cell-tower co-location with a specific other phone.\n- **Political and union associations** — call patterns to riding offices, organizer lines, recurring location overlap with rally addresses.\n- **Financial stress or change** — bank-call patterns, calls to creditor lines, location patterns at payday-loan storefronts.\n- **Substance use** — calls to recovery sponsors or to known dispensaries.\n\nNone of this requires reading a single text message. None of it requires intercepting a single call. The metadata, by itself, makes it knowable.\n\nThis is not a claim about what police would necessarily do. It is a description of what becomes knowable about every Canadian once the retention is mandated.`,
    },
    {
      title: "What changes under Bill C-22",
      body: `Today, in Canada, telecom and electronic-service providers retain metadata for variable, mostly-business-driven periods — billing-cycle records for a few months, location trails for a few weeks, IP-assignment logs for varying durations. There is no national mandate that providers retain a uniform year of this data on every customer.\n\nUnder Bill C-22, every "core provider" would be required to retain transmission data, device identifiers, and location information for a defined period — up to one year — on every customer. Access by police would still require a production order under the "reasonable grounds to suspect" threshold (a lower bar than the warrant required for content). The Intelligence Commissioner would review ministerial orders under Part 2 (SAAIA) — but not the production-order access to retained metadata.\n\nThe substantive change is the retention itself. Once a year of metadata exists on every Canadian, what becomes derivable about every Canadian changes — independent of how strictly access is gated.`,
    },
    {
      title: "Why the \"metadata, not content\" framing is doing rhetorical work",
      body: `Michael Geist has been on record since the bill's first reading that the "content exclusion" framing — repeated in the Public Safety Minister's House remarks and in the federal backgrounder — is technically correct and rhetorically misleading.\n\nThe Department of Justice's Charter statement on Bill C-22 is, as Geist has noted, silent on the metadata-retention question. The statement addresses the access-threshold change, the Part 2 (SAAIA) ministerial-order regime, and the bill's intersection with the Criminal Code. It does not address whether mandatory mass metadata retention on every Canadian, independent of any individual suspicion, would survive a Section 8 Charter challenge.\n\nThe European Court of Justice, ruling on a nearly identical mandatory data-retention regime in 2014 (the Data Retention Directive), found the regime to be a "particularly serious interference" with fundamental rights — even with comparable access thresholds in place. That ruling is examined in detail in the Day 5 article in this series.`,
    },
    {
      title: "What the committee process could change",
      body: `Bill C-22 is now at the Standing Committee on Public Safety and National Security. Amendments that committee MPs could realistically propose on the metadata-retention question include: a shorter mandatory retention period (90 or 180 days rather than 1 year), differentiated retention by data category (location-data retention shorter than connection-record retention), or a Privacy Commissioner audit role over how the retained metadata is stored.\n\nUnder a Liberal majority government, none of those amendments will pass without Liberal-government support. Day 7 of this series catalogues the seven Liberal MPs on the committee whose votes will determine which amendments survive.`,
    },
  ],
  sources: [
    {
      label: "Bill C-22 — LEGISinfo (current status + bill text)",
      url: "https://www.parl.ca/legisinfo/en/bill/45-1/c-22",
    },
    {
      label: "Bill C-22 — First Reading Text",
      url: "https://www.parl.ca/DocumentViewer/en/45-1/bill/C-22/first-reading",
    },
    {
      label: "Michael Hayden — Johns Hopkins remarks (April 2014, multiple outlets reporting)",
      url: "https://www.theguardian.com/commentisfree/2014/may/10/dianne-feinstein-real-spying-fear-nsa-michael-hayden-metadata",
    },
    {
      label: "Stuart Baker — NYU School of Law debate (October 2013)",
      url: "https://www.aclu.org/news/national-security/nsa-officials-tell-truth-about-metadata",
    },
    {
      label: "Mayer & Mutchler — Stanford MetaPhone Study (PNAS, 2016)",
      url: "https://www.pnas.org/doi/10.1073/pnas.1508081113",
    },
    {
      label: "Michael Geist — analytical coverage of Bill C-22's metadata-retention regime",
      url: "https://www.michaelgeist.ca/2026/03/the-lawful-access-privacy-risks-unpacking-bill-c-22s-expansive-metadata-retention-requirements/",
    },
    {
      label: "Department of Justice — Charter statement on Bill C-22",
      url: "https://www.justice.gc.ca/eng/csj-sjc/pl/charter-charte/c22.html",
    },
  ],
},
  {
  slug: 'bill-c-22-mps-who-moved-it-to-committee',
  headline:
    'Bill C-22 Is at Committee. Here Are the MPs Who Put It There — And How to Reach Them.',
  subheadline:
    'Civic transparency on the second-reading record. The bill\'s sponsor, the Cabinet members who spoke for it on the floor, the Government House Leader who scheduled the debate, and the Liberal members of the Public Safety committee who now control its amendments — each with their public role on C-22 and their public-record contact details. Constituents in any of these ridings can reach the listed MPs directly.',
  summary:
    'On April 20, 2026, the House of Commons passed Bill C-22 (Lawful Access Act, 2026) at second reading. The bill is now at the Standing Committee on Public Safety and National Security (SECU), which is the last realistic stage for substantive amendments. This article catalogues the load-bearing Liberal MPs in C-22\'s path to passage — the bill\'s sponsor (Public Safety Minister Gary Anandasangaree), three Cabinet members who spoke for the bill at second reading (Justice Minister Sean Fraser, Secretary of State for Combatting Crime Ruby Sahota, Parliamentary Secretary Patricia Lattanzio), the Government House Leader who scheduled the debate (Steven MacKinnon), and the seven Liberal members on SECU led by Chair Jean-Yves Duclos. Each MP\'s public role on C-22 is described and public-record contact information is included so constituents can reach their representatives. Parliament Audit takes no position on whether the bill should pass; we publish the record and the contact channel.',
  publishedAt: '2026-05-21T17:03:51.186Z',
  category: 'Accountability',
  tags: ['Bill C-22', 'committee', 'civic engagement', 'public safety committee', 'civil liberties', 'transparency', 'contact your MP'],
  readingTimeMinutes: 8,
  keyTakeaways: [
    'Bill C-22 passed second reading April 20, 2026, and is at the Standing Committee on Public Safety and National Security (SECU).',
    'The bill\'s sponsor is Public Safety Minister Gary Anandasangaree (Scarborough—Guildwood—Rouge Park).',
    'Three Cabinet members spoke for the bill at second reading: Justice Minister Sean Fraser, Secretary of State Ruby Sahota, Parliamentary Secretary Patricia Lattanzio.',
    'The Government House Leader, Steven MacKinnon, scheduled the bill for debate.',
    'Seven Liberal MPs sit on SECU and will decide which committee amendments pass. Chair is Jean-Yves Duclos.',
    'Public contact information for each named MP is included below.',
  ],
  smartBrevity: {
    bigThing:
      'Twelve Liberal MPs are now the bill\'s decisive movers — the sponsor, three speaking Cabinet members, the Government House Leader, and the seven Liberals on the Public Safety committee. Every Canadian can reach any one of them through publicly listed channels.',
    whyItMatters:
      'Committee is where amendments are accepted or rejected; under a majority government, amendments require government cooperation. Constituent letters to MPs on the committee are the most direct civic-engagement channel for shaping (or stopping) what the bill looks like before third reading.',
    goDeeper: [
      'Sponsor: Public Safety Minister Gary Anandasangaree',
      'Cabinet speakers at second reading: Sean Fraser (Justice), Ruby Sahota (Combatting Crime), Patricia Lattanzio (PS)',
      'Government House Leader who scheduled the debate: Steven MacKinnon',
      'Public Safety committee Chair: Jean-Yves Duclos',
      'Six other Liberal members on SECU: Acan, Dandurand, Housefather, Powlowski, Ramsay, Sodhi',
    ],
    yesBut:
      'The Conservative + Bloc + NDP members of SECU oppose parts of the bill; opposition committee testimony will also shape the record. The story isn\'t one-sided.',
    bottomLine:
      'Twelve Liberal MPs hold the bill\'s next-stage outcome. Their contact information is below. Parliament Audit takes no position on whether you should write to them, or what you should say if you do.',
  },
  methodology:
    'All MP names, ridings, and roles are taken from the public Parliament of Canada record: the Bill C-22 first-reading sponsorship line, the second-reading Hansard (April 13-14, 17-20, 2026), the Government House Leader\'s public statements on House scheduling, the SECU committee membership page at ourcommons.ca/Committees/en/SECU/Members, and Cabinet appointments published at pm.gc.ca/en/cabinet. Contact information follows the standard ourcommons.ca format: Parliament Hill email (firstname.lastname@parl.gc.ca), Hill switchboard 613-992-4211, and links to each MP\'s ourcommons.ca page for their constituency office. We did not contact any of the listed MPs for this article; all role descriptions are from public Hansard or news reporting.',
  sections: [
    {
      title: 'Why this list and not a 178-MP roll call',
      body: `The second-reading vote on Bill C-22 passed because the Liberal caucus voted as a bloc, supported by the bill\'s formal sponsorship. A 178-name yea list would be technically accurate but not actionable — most yea voters had no individual role in shaping the bill\'s text or its parliamentary path.\n\nThis article focuses on the twelve Liberal MPs whose specific roles are documented in the public record: the sponsor, the three Cabinet members who actually spoke for the bill in second-reading debate, the Government House Leader who scheduled the debate, and the seven Liberal members of the Public Safety committee where the bill now lives. These are the people whose decisions over the coming weeks will determine which amendments survive committee and what the bill looks like at third reading.\n\nConstituents in any of these MPs\' ridings have a stronger civic case for being heard than constituents writing to backbench MPs who voted with their caucus but otherwise have no role in shaping the bill.`,
    },
    {
      title: 'The sponsor',
      body: `**The Honourable Gary Anandasangaree** — Public Safety Minister; MP for Scarborough—Guildwood—Rouge Park.\n\nRole: Tabled Bill C-22 in the House of Commons on March 12, 2026 and is the bill\'s named sponsor. As Public Safety Minister, he holds the ministerial authority that the bill\'s most novel provision — the power to issue secret capability orders under Part 2 (SAAIA) — would attach to. His public statements on C-22 emphasize that "encryption is not in any way interrupted as part of Bill C-22" and that the bill is "about ensuring law enforcement can effectively investigate serious crime in the digital age."\n\nContact:\n- Hill email: gary.anandasangaree@parl.gc.ca\n- Hill office: 613-992-1908 (or House switchboard 613-992-4211)\n- ourcommons.ca page: https://www.ourcommons.ca/members/en/gary-anandasangaree(89449)\n- Media inquiries (Public Safety Canada): media@ps-sp.gc.ca · 613-991-0657`,
    },
    {
      title: 'Cabinet members who spoke for the bill at second reading',
      body: `**The Honourable Sean Fraser** — Minister of Justice and Attorney General of Canada.\n\nRole on C-22: Devoted his second-reading remarks principally to the bill\'s lawful-access architecture; addressed the mandatory metadata retention requirement in one paragraph of his speech. As Justice Minister, he is also responsible for the Charter statement on the bill — the document Geist has noted is "oddly silent" on the metadata retention question.\n\nContact:\n- Hill email: sean.fraser@parl.gc.ca\n- Hill switchboard: 613-992-4211\n- ourcommons.ca page: search "Sean Fraser" at ourcommons.ca/members\n\n---\n\n**The Honourable Ruby Sahota** — Secretary of State for Combatting Crime.\n\nRole on C-22: Spoke at second reading and described the bill as "a first step." Asked by Conservative MP Glen Motz (a former police officer) whether law enforcement had requested additional powers beyond what is in C-22, she indicated openness to going further. That on-the-record statement is itself notable for any civil-liberties analysis of the bill\'s trajectory after Royal Assent.\n\nContact:\n- Hill email: ruby.sahota@parl.gc.ca\n- Hill switchboard: 613-992-4211\n- ourcommons.ca page: search "Ruby Sahota" at ourcommons.ca/members\n\n---\n\n**Patricia Lattanzio** — Parliamentary Secretary; MP for Saint-Léonard—Saint-Michel.\n\nRole on C-22: Spoke at second reading. Framed Bill C-22 as "really about one simple thing: keeping Canadians safe in a digital world that criminals are increasingly exploiting." Her speech emphasized child-exploitation statistics as the bill\'s motivating use case.\n\nContact:\n- Hill email: patricia.lattanzio@parl.gc.ca\n- Hill switchboard: 613-992-4211\n- ourcommons.ca page: search "Patricia Lattanzio" at ourcommons.ca/members`,
    },
    {
      title: 'House management — who scheduled the debate',
      body: `**The Honourable Steven MacKinnon** — Government House Leader.\n\nRole on C-22: As Government House Leader, he controls which government bills get House debate time and when. The April 13 / 14 / 17 / 20 debate schedule for C-22 was scheduled through his office. After the bill clears committee, the timing of report stage and third reading will likewise route through Steven MacKinnon\'s scheduling.\n\nContact:\n- Hill email: steven.mackinnon@parl.gc.ca\n- Hill switchboard: 613-992-4211\n- ourcommons.ca page: search "Steven MacKinnon" at ourcommons.ca/members`,
    },
    {
      title: 'The Standing Committee on Public Safety and National Security (SECU)',
      body: `SECU has eleven members. The Conservative + Bloc Vice-Chairs (Frank Caputo and Claude DeBellefeuille) and the four other opposition members are pushing back on parts of the bill in committee testimony; their work shapes the record but they cannot pass amendments without Liberal support.\n\nThe seven Liberal members of SECU are the bill\'s decisive movers at this stage. They are listed below in alphabetical order.\n\n---\n\n**The Honourable Jean-Yves Duclos** (Chair) — MP for Québec Centre, Quebec.\n\nRole on C-22: As committee Chair, controls the SECU witness schedule, the clause-by-clause order, and the report-back date. The Chair role is by convention a Liberal seat. Long-serving Liberal MP with a senior policy profile (former Finance Minister, former Treasury Board President).\n\n- Hill email: jean-yves.duclos@parl.gc.ca\n- ourcommons.ca: https://www.ourcommons.ca/members/en/jean-yves-duclos\n\n---\n\n**Sima Acan** — MP for Oakville West, Ontario.\n\nRole: Liberal SECU member. Will vote on every committee amendment to C-22.\n\n- Hill email: sima.acan@parl.gc.ca\n- ourcommons.ca: search "Sima Acan" at ourcommons.ca/members\n\n---\n\n**Marianne Dandurand** — MP for Compton—Stanstead, Quebec.\n\nRole: Liberal SECU member.\n\n- Hill email: marianne.dandurand@parl.gc.ca\n- ourcommons.ca: search "Marianne Dandurand" at ourcommons.ca/members\n\n---\n\n**Anthony Housefather** — MP for Mount Royal, Quebec.\n\nRole: Liberal SECU member. Among the longer-tenured Liberal MPs on the committee, with a record of working across party lines on Charter-rights questions. Constituent letters may carry more weight with Anthony Housefather than with newer committee members.\n\n- Hill email: anthony.housefather@parl.gc.ca\n- ourcommons.ca: search "Anthony Housefather" at ourcommons.ca/members\n\n---\n\n**Marcus Powlowski** — MP for Thunder Bay—Rainy River, Ontario.\n\nRole: Liberal SECU member.\n\n- Hill email: marcus.powlowski@parl.gc.ca\n- ourcommons.ca: search "Marcus Powlowski" at ourcommons.ca/members\n\n---\n\n**Jacques Ramsay** — MP for La Prairie—Atateken, Quebec.\n\nRole: Liberal SECU member.\n\n- Hill email: jacques.ramsay@parl.gc.ca\n- ourcommons.ca: search "Jacques Ramsay" at ourcommons.ca/members\n\n---\n\n**Amandeep Sodhi** — MP for Brampton Centre, Ontario.\n\nRole: Liberal SECU member.\n\n- Hill email: amandeep.sodhi@parl.gc.ca\n- ourcommons.ca: search "Amandeep Sodhi" at ourcommons.ca/members`,
    },
    {
      title: 'How to use this information',
      body: `Every MP\'s office reads constituent mail. The most effective constituent letters share three properties:\n\n1. **From a constituent in their riding.** MP offices weigh letters from their own constituents far more heavily than form-letter floods from outside the riding. If you are not a constituent of any MP on this list, the MPs whose decisions you can most directly influence are your OWN MP (use the postal-code lookup at the bottom of this article) — and the seven SECU Liberal members above if you are a constituent of any of those seven ridings.\n2. **Specific to a provision.** "I am writing about the secret capability-order power in Section X of C-22" is materially more effective than "I oppose Bill C-22." Letters that reference a specific clause and ask a specific question of the MP carry weight in committee briefings.\n3. **Personalized.** MP offices triage form-letter floods into one aggregate count; personalized letters get individual attention. One paragraph in your own words beats a hundred shared form letters.\n\nParliament Audit takes no position on whether Bill C-22 should pass. We publish the record and the channel. The decision about whether to contact your MP, and what to say to them if you do, belongs to you.`,
    },
  ],
  sources: [
    {
      label: 'Bill C-22 — LEGISinfo (legislative status + sponsor)',
      url: 'https://www.parl.ca/legisinfo/en/bill/45-1/c-22',
    },
    {
      label: 'Bill C-22 — First Reading Text',
      url: 'https://www.parl.ca/DocumentViewer/en/45-1/bill/C-22/first-reading',
    },
    {
      label: 'Standing Committee on Public Safety and National Security — Members',
      url: 'https://www.ourcommons.ca/Committees/en/SECU/Members',
    },
    {
      label: 'The Honourable Gary Anandasangaree — Member of Parliament profile',
      url: 'https://www.ourcommons.ca/members/en/gary-anandasangaree(89449)',
    },
    {
      label: 'Cabinet — Office of the Prime Minister',
      url: 'https://www.pm.gc.ca/en/cabinet',
    },
    {
      label: 'Public Safety Canada — Minister Anandasangaree statements on C-22',
      url: 'https://www.canada.ca/en/public-safety-canada/news/2026/03/minister-anandasangaree-in-montreal-to-highlight-new-tools-to-help-law-enforcement-investigate-threats-and-keep-canadians-safe.html',
    },
    {
      label: 'Hansard — second-reading debate on Bill C-22 (April 13-20, 2026)',
      url: 'https://openparliament.ca/bills/45-1/C-22/',
    },
    {
      label: 'Michael Geist — analytical coverage of the second-reading debate',
      url: 'https://www.michaelgeist.ca/2026/03/the-lawful-access-privacy-risks-unpacking-bill-c-22s-expansive-metadata-retention-requirements/',
    },
  ],
},
  {
  slug: 'bill-c-22-second-reading-update-april-20-2026',
  headline:
    'Bill C-22 Just Passed Second Reading. With a Liberal Majority, the Path to Royal Assent Is Now Mostly Clear.',
  subheadline:
    'The Lawful Access Act, 2026 cleared a critical procedural hurdle in the House on April 20. Committee review starts next. Five distinct opposition voices — academic, technology-industry, civil-society, U.S. legislative, and Charter-rights — have already weighed in against parts of the bill. Here is where the bill stands, what it would do, and what happens between here and Royal Assent.',
  summary:
    'On April 20, 2026, the House of Commons passed Bill C-22 — the Lawful Access Act, 2026 — at second reading. The bill is now at the Standing Committee on Public Safety and National Security, the last stage where substantial amendments are realistic before the Liberal majority votes it through. The bill mandates one year of metadata retention by "core providers," authorizes the Public Safety Minister to issue secret capability orders to electronic service providers, and lowers the police access threshold for subscriber information from "reasonable grounds to believe" to "reasonable grounds to suspect." Opposition is from a wide coalition: academic privacy law, civil-society groups, the U.S. House Judiciary Committee, technology firms including Meta and Apple, and the Department of Justice\'s own Charter statement, which is silent on the metadata-retention question. The Privacy Commissioner of Canada has no statutory oversight role under the bill as drafted.',
  publishedAt: '2026-05-19T05:28:23.475Z',
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
},
  {
    slug: 'canada-net-electricity-importer-oct-dec-2025',
    headline:
      'Canada Was a Net Electricity Importer for Three Consecutive Months. December 2025 Imports from the US Rose 79% Year-Over-Year.',
    subheadline:
      'Statistics Canada confirmed in its March 2026 energy-statistics release that Canada imported more electricity than it exported in October, November, and December 2025. The same three-month pattern occurred in early 2024. The drivers are provincial and physical — drought-reduced hydroelectric output in British Columbia and Quebec, and scheduled nuclear refurbishments in Ontario — rather than federal policy choice.',
    summary:
      'Statistics Canada\'s March 2026 release of December 2025 energy statistics confirmed that Canada was a net electricity importer for three consecutive months — October, November, and December 2025. Imports from the United States in December reached 3.1 million MWh, up 79.3% versus December 2024, against exports of 2.3 million MWh, down 34.5%. The same three-month pattern occurred earlier in 2024 (March 2024 alone reached 3.3 million MWh in imports, the highest single month in the series). Drivers are provincial and physical: drought-reduced hydroelectric output in British Columbia and Quebec, paired with scheduled nuclear-plant refurbishments in Ontario that pushed Ontario\'s combustible-fuel generation up 56.8% to 4.2 million MWh. British Columbia accounts for roughly 57% of Canadian electricity imports from the United States. Electricity generation, transmission, and trade are constitutionally provincial jurisdiction; the federal government regulates the international crossing only.',
    publishedAt: '2026-05-15T15:30:00-04:00',
    category: 'Energy',
    tags: ['electricity', 'StatsCan', 'hydro', 'energy trade', 'BC drought', 'Ontario nuclear', 'provincial jurisdiction'],
    readingTimeMinutes: 6,
    keyTakeaways: [
      'Canada was a net electricity importer for three consecutive months: October, November, and December 2025.',
      'December 2025 imports from the US: 3.1 million MWh, up 79.3% vs. December 2024.',
      'December 2025 exports to the US: 2.3 million MWh, down 34.5% vs. December 2024.',
      'The same three-month net-importer pattern occurred earlier in 2024. March 2024 (3.3M MWh) remains the highest single month of imports in the series.',
      'Drivers are physical, not federal-policy: BC + Quebec drought reducing hydro output, plus scheduled nuclear refurbishments in Ontario.',
      'Electricity is constitutionally provincial jurisdiction. Ottawa regulates the international crossing only.',
    ],
    smartBrevity: {
      bigThing:
        'Canada — historically a major net exporter of electricity — was a net importer of electricity from the United States for three consecutive months ending December 2025.',
      whyItMatters:
        'The pattern is real and recurring (it also happened in early 2024). But "Canada had to buy power to keep the lights on" is loose framing for what the data shows: an electricity-trade pattern shaped by drought and scheduled maintenance, in a sector that is provincial jurisdiction.',
      goDeeper: [
        'Dec 2025 imports: 3.1M MWh (+79.3% YoY); exports: 2.3M MWh (−34.5% YoY).',
        'British Columbia takes ~57% of US electricity imports — a drought-driven baseload story.',
        'Ontario filled the nuclear-maintenance gap with combustible-fuel generation (+56.8%).',
        'Quebec — historically the largest provincial exporter — also imported some US power in 2025.',
      ],
      yesBut:
        'The grid worked as designed: cross-border interconnections exist precisely so a drought year in one country can be balanced by surplus in the other. Net-importer status is not equivalent to a supply shortage or "blackout risk."',
      bottomLine:
        'A factual, multi-month story. Not a "first time" event and not the federal cabinet\'s direct doing.',
    },
    methodology:
      'All MWh figures and year-over-year percentage changes come from Statistics Canada\'s "Energy statistics, December 2025" release, published in The Daily on March 2, 2026 (catalogue 11-001-X). Historical context (3-month net-importer streak in 2024, March 2024 peak of 3.3M MWh, provincial export shares) cross-checked against the C.D. Howe Institute\'s "Graph of the Week" analysis and the Canada Energy Regulator\'s Electricity Trade Summary. No politician\'s statement is quoted in this piece because the data itself is the story; the press releases came later. We did not contact StatsCan, the CER, or any provincial utility for additional comment.',
    sections: [
      {
        title: 'What StatsCan actually said',
        body: `In its March 2, 2026 release of December 2025 energy statistics, Statistics Canada reported that Canada was a net electricity importer for the third consecutive month. The exact figures:\n\n- December 2025 imports from the United States: **3.1 million MWh**, up **79.3% year-over-year**.\n- December 2025 exports to the United States: **2.3 million MWh**, down **34.5% year-over-year**.\n- Net trade balance for December 2025: a deficit of roughly 0.8 million MWh.\n\nThe full series remains publicly available through StatsCan\'s "Imports and Exports of Electricity" dataset on Open Government Portal, with monthly granularity going back to 1990.\n\nMarch 2024 — not December 2025 — is the single-month record for electricity imports from the US in this series, at approximately 3.3 million MWh. The current pattern is a continuation, not a one-off event.`,
      },
      {
        title: 'The 2024 precedent',
        body: `Canada was also a net electricity importer for three months in early 2024. The C.D. Howe Institute, in its "Graph of the Week" review of the data, attributed that 2024 shift to two compounding factors: drought conditions reducing Canadian hydroelectric output, and lower natural-gas prices in the United States that made American thermal generation more competitive across the border.\n\nThe 2025 streak (October, November, December) has similar underlying causes but a different sectoral mix. By 2025, Ontario nuclear-plant refurbishments — scheduled outages at units that are routinely refit at multi-decade intervals — were a larger contributor than they had been in 2024. Ontario\'s combustible-fuel generation rose 56.8% year-over-year in December 2025 to 4.2 million MWh, filling the gap from nuclear units that were temporarily offline.`,
      },
      {
        title: 'Why this is a provincial story, not a federal one',
        body: `Under section 92A of the Constitution Act, 1867, electricity generation, transmission, and intra-provincial distribution are provincial jurisdiction. Each province owns or regulates its own grid. The federal government — through the Canada Energy Regulator — regulates the international crossing (the wires that physically span the border) but not the underlying decisions about how much to generate, what fuel to burn, or whether to buy or sell across that crossing.\n\nThe provinces driving the December 2025 net-import position:\n\n- **British Columbia** accounts for roughly 57% of Canada\'s electricity imports from the United States. BC is in a multi-year drought cycle that has lowered reservoir levels at major hydroelectric facilities, including those operated by BC Hydro. The British Columbia government, an NDP minority, sets BC Hydro\'s operating mandate.\n- **Ontario** filled its temporary nuclear-output gap with natural-gas-fired generation. The Ontario Progressive Conservative government, a majority, sets the Independent Electricity System Operator\'s procurement directions.\n- **Quebec** — historically Canada\'s largest electricity exporter via Hydro-Québec — also began importing some US power in 2025 as drought reduced reservoir storage at the La Grande complex. The Coalition Avenir Québec government sets Hydro-Québec\'s strategic plan.\n\nThe federal Cabinet — Liberal, under Prime Minister Mark Carney — does not directly choose how much electricity flows in either direction. Federal policy can shape long-run incentives (the Clean Electricity Regulations, federal Investment Tax Credits for clean-power assets, the Atlantic Loop transmission proposal), but the month-by-month trade flow is the output of provincial generation decisions and weather.`,
      },
      {
        title: 'What this article is not arguing',
        body: `Parliament Audit takes no position on whether Canada should expand its hydroelectric capacity, accelerate nuclear refurbishments, or build new inter-tie transmission. Those are decisions for provincial legislatures and utilities, with federal cost-sharing where the parties choose to negotiate it.\n\nWhat we report is the trade balance, sourced to Statistics Canada, with the recurring pattern and the physical drivers laid out so readers do not have to take any politician\'s framing on trust. If electricity-trade fluctuations come up in question period or at a parliamentary committee, we will cover those exchanges and link the underlying StatsCan series here.`,
      },
    ],
    sources: [
      {
        label: 'Statistics Canada — "Energy statistics, December 2025" (The Daily, March 2, 2026)',
        url: 'https://www150.statcan.gc.ca/n1/daily-quotidien/260302/dq260302a-eng.htm',
      },
      {
        label: 'Statistics Canada — "Imports and Exports of Electricity" dataset (Open Government Portal)',
        url: 'https://open.canada.ca/data/en/dataset/5c358f51-bc8c-4565-854d-9d2e35e6b178',
      },
      {
        label: 'C.D. Howe Institute — "Graph of the Week: Canada Becomes Temporary Net Electricity Importer Amid Shifting Energy Dynamics"',
        url: 'https://cdhowe.org/publication/graph-week-canada-becomes-temporary-net-electricity-importer-amid-shifting/',
      },
      {
        label: 'Canada Energy Regulator — Electricity Trade Summary',
        url: 'https://www.cer-rec.gc.ca/en/data-analysis/energy-commodities/electricity/statistics/electricity-trade-summary/',
      },
      {
        label: 'U.S. Energy Information Administration — "The United States is a net energy importer from Canada"',
        url: 'https://www.eia.gov/todayinenergy/detail.php?id=36332',
      },
      {
        label: 'Constitution Act, 1867 — Section 92A (Non-renewable natural resources, forestry resources and electrical energy)',
        url: 'https://laws-lois.justice.gc.ca/eng/const/page-5.html',
      },
    ],
  },
  {
    slug: 'spaceport-canso-200m-defence-lease',
    headline:
      'Ottawa Signed a $200M, 10-Year Lease for a Launch Pad. The Site Is a Concrete Slab and Two Shipping Containers. The Tenant Reported $14,980 in Revenue Last Year.',
    subheadline:
      'Defence Minister David McGuinty announced the agreement on March 16, 2026 — a $20-million-per-year payment to Maritime Launch Services for a dedicated military launch pad near Canso, Nova Scotia. As of late March 2026, the site has a gravel road, two sea cans, and one 25-by-35-foot concrete pad. MLS reported a $47-million loss in 2025.',
    summary:
      'On March 16, 2026, Defence Minister David McGuinty announced a 10-year, $200-million lease agreement between the Department of National Defence and Halifax-based Maritime Launch Services (MLS) for a dedicated launch pad at Spaceport Nova Scotia near Canso. The deal pays MLS $20 million annually, backdated to April 1, 2025, with 90% of the rental payments directed to support the Canadian Space Agency. As of March 21, 2026, the site consists of a gravel access road, two shipping containers, and one 25-by-35-foot concrete pad — no servicing infrastructure. MLS reported $14,980 in revenue and a $47-million loss in its 2025 financial filings; combined CEO and CFO compensation was $697,308, rising to $984,930 with stock options and directors’ fees. The company’s original Cyclone 4M rocket design has never been built. No launches have occurred at the site by MLS itself; the launch pad has been used twice — by a York University rocketry club in 2023 and by Dutch firm T-Minus Engineering in November 2025. Separately, on April 21, 2026, Transport Minister Steven MacKinnon tabled Bill C-28, the Canadian Space Launch Act, the first dedicated federal legislative framework for space launch activities from Canadian territory.',
    publishedAt: '2026-05-15T09:00:00-04:00',
    category: 'Accountability',
    tags: ['defence spending', 'Maritime Launch Services', 'Canso spaceport', 'Bill C-28', 'space policy', 'procurement'],
    readingTimeMinutes: 7,
    keyTakeaways: [
      'Ottawa is paying $20 million per year for 10 years ($200M total) to lease a launch pad in Canso, Nova Scotia.',
      'The lease was signed by the Department of National Defence on March 16, 2026, backdated to April 1, 2025.',
      'As of March 21, 2026, the site is a gravel road, two shipping containers, and one 25×35-foot concrete pad. No servicing infrastructure.',
      'Maritime Launch Services reported $14,980 in revenue and a $47-million loss in 2025. CEO+CFO total compensation: $984,930.',
      'Zero launches by MLS itself. Two third-party launches at the site (York U rocketry club, 2023; Dutch firm T-Minus, 2025).',
      'Bill C-28 (Canadian Space Launch Act) was tabled separately on April 21, 2026 by Transport Minister Steven MacKinnon.',
    ],
    smartBrevity: {
      bigThing:
        'The federal government has committed $200 million over 10 years to lease a launch pad that today consists of a concrete slab, two shipping containers, and a gravel road.',
      whyItMatters:
        'Canada is the only G7 nation without sovereign space-launch capability, and government rationale is defence and industrial policy. But the contract was awarded to a company that reported $14,980 in revenue last year against a $47-million operating loss.',
      goDeeper: [
        'Lease term: 10 years, $20M/year, backdated to April 1, 2025.',
        '90% of MLS’s rental payments are earmarked back to the Canadian Space Agency.',
        'MLS 2025: $14,980 revenue · $47M loss · $984,930 in top-executive compensation.',
        'Original Cyclone 4M rocket: never built. MLS launches to date: 0.',
        'A separate $24.9M is funding three other domestic rocket companies.',
      ],
      yesBut:
        'Critics call this a boondoggle; supporters note no infrastructure-led industrial strategy starts with infrastructure already in place, and that $200M is small relative to Canada’s $40-billion projected space industry over the next decade.',
      bottomLine:
        'A $20M-per-year lease is an unusual instrument for industrial policy. The Auditor General has not yet commented; Bill C-28 is at first reading.',
    },
    methodology:
      'All dollar figures, dates, and infrastructure details come from: (1) the Department of National Defence announcement of March 16, 2026 covered by The Globe and Mail; (2) Maritime Launch Services’ public 2025 financial disclosures, as reported by the Halifax Examiner; (3) the Halifax Examiner reporter’s on-site inspection of March 21, 2026; (4) Bill C-28 First Reading text on the Parliament of Canada website. The “zero MLS launches” count is as reported in the Halifax Examiner April 20, 2026 review and corroborated by Maritime Technology Review on April 23, 2026; the two third-party launches at the site (York University, T-Minus) come from the same source. We did not contact Maritime Launch Services, the Department of National Defence, or the Canadian Space Agency for comment — every claim here is sourced to a public document. If MLS issues a clarification or correction, we will update this article and disclose it under our corrections policy.',
    sections: [
      {
        title: 'The deal',
        body: `On March 16, 2026, at the Canadian Space Agency’s David Florida Laboratory in Ottawa, Defence Minister David McGuinty announced that the Department of National Defence had signed a 10-year, $200-million lease agreement with Maritime Launch Services (MLS), a Halifax-based publicly traded company.\n\nThe agreement pays MLS $20 million per year. It is backdated to April 1, 2025, meaning the first year’s payment was made before the announcement was public. Ninety per cent of the rental payments flow back to the Canadian Space Agency to support its mandate.\n\nMcGuinty framed the deal in defence and sovereignty terms: "With this step, we are not only advancing our capabilities here on Earth — we are reaffirming our place among the spacefaring nations shaping the future beyond it." The press release positions the lease as a "cornerstone of Canada’s defence capabilities."\n\nIn his remarks, McGuinty also announced a separate $24.9 million in initial funding for three other Canadian rocket-development companies, bringing the total federal commitment around the file to nearly $225 million.`,
      },
      {
        title: 'What $200 million currently buys',
        body: `Halifax Examiner journalist Tim Bousquet visited the site on March 21, 2026 — five days after the announcement. His on-site inspection found:\n\n- One gravel access road.\n- Two repurposed shipping containers ("sea cans").\n- One concrete pad measuring 25 feet by 35 feet.\n- No on-site fuel storage, no control facility, no servicing infrastructure of any kind.\n\nThe lease agreement itself describes the facility as "currently provisioned with a single launch pad suitable for suborbital and orbital launch vehicles." MLS pays Nova Scotia an annual land lease of $13,500 plus HST for the property — the federal government is paying $20 million per year to access what MLS is renting for the price of a used compact car.`,
      },
      {
        title: 'Who is Maritime Launch Services',
        body: `MLS was registered in Nova Scotia in October 2016 and listed on the NEO Exchange (now the Cboe Canada exchange) in 2022. It received provincial environmental approval for the Canso site on June 4, 2019, and federal construction approval in August 2022.\n\nThe company’s 2025 audited financial statements (filed publicly on SEDAR) report:\n\n- Revenue: **$14,980**.\n- Net loss: **$47 million**.\n- Combined CEO and CFO compensation: $697,308.\n- With stock options and directors’ fees added: $984,930.\n\nThe company’s originally announced rocket — the Cyclone 4M, derived from a Soviet-era Ukrainian launch vehicle — has never been built. MLS has launched zero rockets of any kind itself. The Canso pad has been used twice: once by a York University rocketry club in 2023, and once by Dutch firm T-Minus Engineering in November 2025 for a sub-orbital test flight.\n\nCEO Steve Matier has said that MLS plans to launch two Barracuda rockets (built by US firm Reaction Dynamics) from the site in May or June 2026, with a fourth launch planned for late 2026.`,
      },
      {
        title: 'The broader context',
        body: `Canada is the only G7 country without a sovereign space-launch capability. Every Canadian satellite to date has reached orbit on a rocket built by — and a launch service provided by — another country: most often the United States, France, India, or Japan. The federal rationale for the MLS lease is to change that.\n\nOn April 21, 2026, Transport Minister Steven MacKinnon tabled Bill C-28, the Canadian Space Launch Act — the first dedicated federal legislative framework for space launches and re-entries from Canadian territory. The bill received first reading and is expected to enter second-reading debate in May or June 2026. As of this writing, no recorded vote has occurred. The bill is supported in principle by NordSpace Corp. and other Canadian space-launch startups; the Canso project is the most visible existing site that would operate under the new framework.\n\nA $40-billion projected Canadian space industry over the next decade is the figure most often cited by supporters as the prize that justifies the early-stage spending.`,
      },
      {
        title: 'What this article is not arguing',
        body: `Parliament Audit takes no position on whether Canada should pursue a sovereign space-launch capability, whether $200 million is too much or too little, or whether MLS is the right vehicle. These are matters for the elected legislature and, in due course, for the Auditor General.\n\nWhat we report is the contract as written, the company as audited, and the site as it presently stands. The contrast between those three is unusual enough in a federal procurement that it merits being on the public record in one place.`,
      },
    ],
    sources: [
      {
        label: 'The Globe and Mail — "Ottawa investing $200-million in Nova Scotia spaceport to enable sovereign satellite launches" (March 16, 2026)',
        url: 'https://www.theglobeandmail.com/business/article-canada-sovereign-satellite-launches-space-defence/',
      },
      {
        label: 'Government of Canada announcement — Atlantic Canada Opportunities Agency (March 16, 2026)',
        url: 'https://www.canada.ca/en/atlantic-canada-opportunities/news/2026/03/historic-200-million-investment-positions-nova-scotia-spaceport-as-cornerstone-of-canadas-defence-capabilities.html',
      },
      {
        label: 'Halifax Examiner — "Everything you need to know about the spaceport in Nova Scotia" (Tim Bousquet, April 20, 2026)',
        url: 'https://www.halifaxexaminer.ca/commentary/everything-you-need-to-know-about-the-spaceport-in-nova-scotia/',
      },
      {
        label: 'Maritime Technology Review — "Canada\'s $200M Spaceport Nova Scotia Gamble Hits Turbulence" (April 23, 2026)',
        url: 'https://maritimetechnologyreview.com/2026/04/23/canadas-200m-spaceport-nova-scotia-gamble-hits-turbulence/',
      },
      {
        label: 'BetaKit — "Feds commit nearly $225 million to advance Canada\'s sovereign space launch capabilities"',
        url: 'https://betakit.com/feds-commit-nearly-225-million-to-advance-canadas-sovereign-space-launch-capabilities/',
      },
      {
        label: 'Parliament of Canada — Bill C-28: Canadian Space Launch Act (First Reading, April 21, 2026)',
        url: 'https://www.parl.ca/DocumentViewer/en/45-1/bill/C-28/first-reading',
      },
      {
        label: 'Maritime Launch Services — corporate site',
        url: 'https://www.maritimelaunch.com/',
      },
    ],
  },
  {
    slug: 'alberta-citizen-petition-quebec-referendums-compared',
    headline:
      'Alberta’s Citizen-Led Independence Petition Has Cleared the Signature Threshold. Here Is How the Process Compares to Quebec’s Two Sovereignty Referendums.',
    subheadline:
      'Stay Free Alberta submitted approximately 302,000 signatures by May 2, 2026 — above the 177,732-signature threshold (10% of the 2023 provincial vote). Verification by Elections Alberta is currently paused under a court stay related to First Nations treaty rights. Quebec’s referendums in 1980 and 1995 were initiated by sitting Parti Québécois governments; Alberta’s petition is a citizen initiative.',
    summary:
      'On May 2, 2026, signature collection closed on a citizen-initiative petition under Alberta’s Citizen Initiative Act asking whether the province should leave Canada. The petition’s organizer, Mitch Sylvestre of the Alberta Prosperity Project / Stay Free Alberta, reported approximately 302,000 signatures submitted to Elections Alberta. The threshold required to trigger a referendum was 177,732 signatures, or 10% of the 2023 provincial-vote count. Verification by the Chief Electoral Officer is currently on hold pending an Alberta Court of King’s Bench review of a treaty-rights challenge brought by the Athabasca Chipewyan First Nation, the Piikani Nation, the Siksika Nation, and the Blood Tribe. The two Quebec sovereignty referendums (1980 and 1995) were initiated by sitting Parti Québécois governments — René Lévesque’s and Jacques Parizeau’s respectively — not by citizen petitions. Alberta’s petition would, if certified, oblige the legislature to either pass legislation responsive to the question or hold a binding referendum.',
    publishedAt: '2026-05-13T05:00:00-04:00',
    category: 'Accountability',
    tags: ['Alberta', 'Quebec', 'referendums', 'sovereignty', 'Citizen Initiative Act', 'Bill 54', 'treaty rights', 'Clarity Act'],
    readingTimeMinutes: 7,
    heroStat: { value: '~302K', label: 'Signatures submitted' },
    keyTakeaways: [
      'Stay Free Alberta submitted ~302,000 signatures by May 2, 2026 — above the 177,732-signature threshold (10% of 2023 provincial-vote count).',
      'Question on the petition: “Do you agree that the Province of Alberta should cease to be a part of Canada to become an independent state?”',
      'Verification is paused. April 10, 2026: Alberta Court of King’s Bench Justice Shaina Leonard granted a stay after a treaty-rights lawsuit by four First Nations.',
      'Quebec 1980: 59.6% NO, 86% turnout. Question framed as a mandate to negotiate sovereignty-association.',
      'Quebec 1995: 50.6% NO, 93.5% turnout — highest in Canadian electoral history. Question framed as sovereignty after a partnership offer.',
      'Quebec’s referendums were initiated by sitting Parti Québécois governments. Alberta’s is a citizen initiative; Premier Smith has said publicly she is not a separatist.',
    ],
    methodology:
      'Alberta signature counts and threshold are taken from Elections Alberta’s public notices and the JURIST news service reporting of May 2026. The April 10, 2026 court stay and the First Nations applicants are from the same source. Bill 54 details are from the Alberta Hansard record and the Alberta Open Government registry (Citizen Initiative Act). Quebec referendum results, question wordings, and turnout figures are from Élections Québec’s official results pages and the Canadian Encyclopedia. The 1998 Reference re Secession of Quebec citation is to [1998] 2 S.C.R. 217. The Clarity Act is S.C. 2000, c. 26. We did not contact the campaign organizers, the four First Nations, or the Smith government for comment; we are reporting verified procedural facts.',
    sections: [
      {
        title: 'What Alberta’s petition is and where it stands',
        body: `Alberta’s Citizen Initiative Act (in force since 2021, amended in 2025 by Bill 54) lets any Albertan launch a petition that, if it collects enough valid signatures within a fixed window, obliges the legislature either to introduce responsive legislation or to hold a referendum on the question.\n\nOn July 5, 2025, Mitch Sylvestre, working with the Alberta Prosperity Project and the campaign group Stay Free Alberta, filed a citizen-initiative application proposing the question: “Do you agree that the Province of Alberta should cease to be a part of Canada to become an independent state?”\n\nElections Alberta set the signature threshold at 177,732 — 10% of the votes cast in the 2023 Alberta general election. Bill 54, passed by the Smith UCP government on May 15, 2025, lowered that threshold from a previous 20% and lengthened the signature window from 90 to 120 days.\n\nSignature collection ran from January 3, 2026 to May 2, 2026. On May 2, the campaign delivered approximately 302,000 signatures to Chief Electoral Officer Gordon McClure. Verification is currently on hold.`,
      },
      {
        title: 'Why verification is paused — the treaty-rights stay',
        body: `On April 10, 2026, before the signature window closed, Alberta Court of King’s Bench Justice Shaina Leonard issued a temporary stay barring Elections Alberta from certifying the petition. The stay was granted in response to a joint lawsuit by the Athabasca Chipewyan First Nation, the Piikani Nation, the Siksika Nation, and the Blood Tribe.\n\nThe applicants argue that Alberta lies on lands covered by Treaties 6, 7, and 8, signed with the Crown in right of Canada — and that the Crown’s treaty obligations cannot be unilaterally severed by a province choosing to leave Confederation.\n\nA related earlier ruling — from Justice Colin Feasby on December 6, 2025 — held that separation could not lawfully proceed under the prior version of the Citizen Initiative Act, citing both constitutional and treaty grounds. In response, the legislature passed amendments removing the requirement that an initiative question not contravene the Constitution and removing Elections Alberta’s authority to seek a court review of a proposed question’s legality.\n\nThose amendments do not displace the treaty-rights argument now before Justice Leonard, which is being litigated separately.`,
      },
      {
        title: 'Quebec 1980 — the first sovereignty referendum',
        body: `On May 20, 1980, the Parti Québécois government of René Lévesque held the first sovereignty referendum in Quebec’s history.\n\nThe question was long and conditional: it asked voters whether they gave the Government of Quebec a mandate to negotiate “a new agreement with the rest of Canada, based on the equality of nations” — sovereignty paired with an economic association, including a common currency. Any change in political status arising from those negotiations would itself be put to a second referendum.\n\nResults: 59.56% NO, 40.44% YES. Turnout 86%.\n\nThe Liberal-led federal government of Pierre Trudeau campaigned actively on the NO side. The Quebec Liberal opposition, led by Claude Ryan, also campaigned NO.`,
      },
      {
        title: 'Quebec 1995 — the second referendum',
        body: `On October 30, 1995, the Parti Québécois government of Jacques Parizeau held a second referendum.\n\nThe question was shorter than 1980’s but still conditional: it asked whether Quebec should become sovereign “after having made a formal offer to Canada for a new economic and political partnership.”\n\nResults: 50.58% NO, 49.42% YES — a margin of just over 54,000 votes out of more than 4.7 million cast. Turnout was 93.52%, the highest of any provincial or federal election or referendum in Canadian history.\n\nThe federal government of Prime Minister Jean Chrétien campaigned on the NO side. In the wake of the result, Parliament passed the Clarity Act (S.C. 2000, c. 26), which provides that the federal government will only enter secession negotiations if a future referendum question is judged “clear” by Parliament and the result a “clear majority.”`,
      },
      {
        title: 'The 1998 Supreme Court reference — the constitutional framework',
        body: `In Reference re Secession of Quebec, [1998] 2 S.C.R. 217, the Supreme Court of Canada answered three questions referred to it by the federal government after the 1995 referendum.\n\nIn summary, the Court held: (1) Quebec cannot under either the Canadian Constitution or international law unilaterally secede; (2) a clear majority of Quebecers, on a clear question, in favour of secession would create a constitutional duty on the rest of Canada to enter into negotiations toward an amendment of the Constitution; and (3) the four constitutional principles of federalism, democracy, constitutionalism and the rule of law, and the protection of minorities, all bear on the process.\n\nThe Court did not specify what counts as “clear.” That definitional question was left to political actors and codified in the Clarity Act (2000) — which gives Parliament the authority to determine, before any future secession referendum, whether the question is clear and the result a clear majority.\n\nThe constitutional framework therefore applies in principle to any province, not just Quebec. Alberta’s petition, if certified and approved at referendum, would face the same constitutional path: secession requires an amendment to the Constitution of Canada under Part V of the Constitution Act, 1982.`,
      },
      {
        title: 'Procedural differences at a glance',
        body: `Initiation: Quebec’s two referendums were initiated by sitting Parti Québécois governments. Alberta’s petition is a citizen initiative under provincial law. Premier Danielle Smith has publicly stated she is not a supporter of separatism. Her government did, however, pass Bill 54 in 2025 lowering the petition threshold.\n\nQuestion design: Quebec’s 1980 and 1995 questions were both conditional — they asked for a mandate to negotiate, not a direct vote to leave. Alberta’s question is a direct yes/no on ceasing to be part of Canada, without a negotiating mandate or partnership offer.\n\nBinding effect: A Quebec “YES” result, under Parizeau’s 1995 plan, would have given the National Assembly authority to declare sovereignty after a partnership-offer negotiation. Alberta’s Citizen Initiative Act, after the Bill 54 amendments, requires the legislature to either pass responsive legislation or to hold a referendum on the question — and there is no statutory requirement that the result of such a referendum bind the legislature.\n\nFederal posture: The Trudeau (1980) and Chrétien (1995) federal governments both campaigned actively on the NO side. The Carney federal government’s posture, as of May 2026, has been to defer comment until the petition completes verification.`,
      },
      {
        title: 'What this article is not arguing',
        body: `Parliament Audit takes no position on whether Alberta should remain part of Canada. We also take no position on the framing or wording of the citizen-initiative question, on the validity of the treaty-rights claim before Justice Leonard, or on whether Bill 54 was good policy.\n\nWhat we are doing is laying out the procedural record: the numbers submitted, the thresholds set, the court actions in motion, the historical comparisons in the legal record, and the constitutional framework that applies. Canadians can decide for themselves what to make of it.`,
      },
    ],
    sources: [
      {
        label: 'Elections Alberta — Citizen Initiative Petition Received, Verification on Hold (May 2026)',
        url: 'https://www.elections.ab.ca/resources/media/news-releases/citizen-initiative-petition-sylvestre/',
      },
      {
        label: 'JURIST News — Alberta receives separation referendum petition pending verification (May 2026)',
        url: 'https://www.jurist.org/news/2026/05/alberta-receives-separation-referendum-petition-pending-verification/',
      },
      {
        label: 'Alberta Open Government — Citizen Initiative Act',
        url: 'https://open.alberta.ca/publications/c13p2',
      },
      {
        label: 'Wikipedia — Alberta separatism (May 2026 revision)',
        url: 'https://en.wikipedia.org/wiki/Alberta_separatism',
      },
      {
        label: 'Élections Québec — Results of the 1980 sovereignty-association referendum',
        url: 'https://www.electionsquebec.qc.ca/en/results-and-statistics/referendum-on-the-1980-sovereignty-association-proposal-for-quebec/',
      },
      {
        label: 'Élections Québec — Results of the 1995 referendum on accession to sovereignty',
        url: 'https://www.electionsquebec.qc.ca/en/results-and-statistics/1995-referendum-on-quebecs-accession-to-sovereignty/',
      },
      {
        label: 'Supreme Court of Canada — Reference re Secession of Quebec, [1998] 2 S.C.R. 217',
        url: 'https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/1643/index.do',
      },
      {
        label: 'Government of Canada — Clarity Act (S.C. 2000, c. 26)',
        url: 'https://laws-lois.justice.gc.ca/eng/acts/C-31.8/',
      },
    ],
  },
  {
    slug: 'party-nominations-non-citizens-can-vote',
    headline:
      'The Canada Elections Act Does Not Regulate Who Can Vote in a Party’s Nomination Contest. Each Party Sets Its Own Rule.',
    subheadline:
      'The Liberal Party permits anyone who “ordinarily lives in Canada” to be a member — a category that includes non-citizens such as international students and work-visa holders. The Conservative, NDP, and Green parties require members to be Canadian citizens or permanent residents. The Bloc Québécois has no citizenship or residency requirement at all.',
    summary:
      'Candidate nomination contests are how Canada’s federal political parties select who will appear on the ballot as their candidate in each riding. The Canada Elections Act does not regulate who can vote in those contests; it leaves the rules entirely to each party. The Foreign Interference Commission’s overview report on political parties’ rules and processes summarized the position of each major federal party. As of 2026, the Liberal Party extends membership and nomination-voting rights to anyone who “ordinarily lives in Canada” — a category that includes individuals on work visas or study permits. The Conservative, NDP, and Green parties require members to be Canadian citizens or permanent residents. The Bloc Québécois has no citizenship or residency requirement at all. Elections Canada has confirmed it has no role in setting these rules.',
    publishedAt: '2026-05-12T22:30:00-04:00',
    category: 'Accountability',
    tags: ['nominations', 'party rules', 'voting eligibility', 'foreign interference', 'Hogue Commission'],
    readingTimeMinutes: 5,
    keyTakeaways: [
      'The Canada Elections Act does not regulate who can vote in a party’s nomination contest — each party sets its own rule.',
      'Liberal Party: any member who “ordinarily lives in Canada,” including non-citizens (e.g. international students, work-permit holders).',
      'Conservative, NDP, and Green parties: Canadian citizen or permanent resident.',
      'Bloc Québécois: no citizenship or residency requirement.',
      'Minimum age to vote in a nomination is 14 for LPC, CPC, BQ, and GPC; NDP varies by province (typically 12–14).',
    ],
    smartBrevity: {
      bigThing:
        'Federal law leaves it to each party to decide who can vote in its candidate nomination contests — and the parties have made very different choices.',
      whyItMatters:
        'A nomination contest is the gate between an aspiring politician and the ballot. Who can pass through that gate is a question about democratic legitimacy that federal law doesn’t answer.',
      goDeeper: [
        'LPC: “Ordinarily lives in Canada” — non-citizens included.',
        'CPC / NDP / GPC: Canadian citizen or permanent resident only.',
        'Bloc: no citizenship or residency requirement.',
        'Federal election candidacy itself still requires Canadian citizenship.',
      ],
      bottomLine:
        'Federal candidacy requires citizenship. The nomination vote that produces the candidate does not — at least in three of the five major parties.',
    },
    methodology:
      'Membership and nomination-voting rules are taken from the Foreign Interference Commission’s public Overview Report: Political Parties’ Rules and Processes, exhibit COM0000591.EN, published by the Public Inquiry into Foreign Interference in Federal Electoral Processes and Democratic Institutions (the Hogue Commission). The relevant section is Part 2 (“Membership”), paragraphs [4]–[6]. The Liberal Party’s current rule is also documented in its National Rules for the Selection of Candidates (February 2026 edition) and the party’s public Nomination FAQ. Conservative Party rules are documented in the Conservative Party of Canada Membership By-law. We did not contact the parties for comment; we are citing their published rules verbatim. The age threshold for NDP voting varies by provincial/territorial section per paragraph [5] of the Commission’s report.',
    sections: [
      {
        title: 'What the Canada Elections Act says — and does not say',
        body: `The Canada Elections Act regulates federal elections. It sets the rules for who can vote in a federal election (Canadian citizens 18+ who are ordinarily resident in Canada), who can run as a candidate (Canadian citizens 18+), how campaigns are financed, what signs may be posted on polling day, and how votes are counted.\n\nIt does not set rules for who can vote inside a political party. That is a private matter for each party. The Foreign Interference Commission summarized the position this way: “The Canada Elections Act doesn’t determine who is allowed to vote at a party nomination. That is a private matter. The law leaves that up to each political party, and lets them make whatever rules they want regarding selecting the candidate.”\n\nElections Canada’s role in a nomination contest is limited to financial oversight — contributions and spending limits — and confirming a registered party’s endorsement of the candidate who eventually emerges.`,
      },
      {
        title: 'Each major federal party’s rule, in plain language',
        body: `Per the Hogue Commission overview report, paragraph [4]:\n\n“The CPC, NDP and GPC require members to be either citizens or permanent residents, while the LPC extends eligibility to those who ‘ordinarily live in Canada’ and to Canadians living abroad who are eligible to vote in federal elections. The BQ has no citizenship or residency requirements.”\n\nIn plain terms:\n\nLiberal Party of Canada (LPC) — Membership is open to anyone 14+ who “ordinarily lives in Canada,” plus Canadian expatriates who would be eligible to vote in a federal election. Non-citizens on long-term residency — international students, work-permit holders, refugee claimants pending determination — are eligible to become Registered Liberals. Registered Liberals living in the electoral district vote at the riding’s nomination meeting.\n\nConservative Party of Canada (CPC) — Membership requires being 14+ and either a Canadian citizen or a permanent resident. Only members in good standing as of the closing notice can vote in a nomination contest.\n\nNew Democratic Party (NDP) — Federal NDP membership is processed through provincial and territorial parties (except in Quebec and Nunavut). All provincial constitutions require members to be Canadian citizens or permanent residents. The minimum age varies by province, typically 12 to 14.\n\nGreen Party of Canada (GPC) — Members must be 14+ and either Canadian citizens or permanent residents. Members aged 12–14 may join but cannot vote on party matters.\n\nBloc Québécois (BQ) — The Bloc’s membership rules contain no citizenship or residency requirement. Membership is open to any applicant who pays the fee and is approved 30 days after submission.`,
      },
      {
        title: 'Why this is in the public record now',
        body: `The Public Inquiry into Foreign Interference in Federal Electoral Processes and Democratic Institutions — chaired by Justice Marie-Josée Hogue — was commissioned in 2023 after reporting and intelligence-leak disclosures suggested foreign-state involvement in some Canadian nomination contests, particularly in ridings with large diaspora communities.\n\nA stated rationale for the inquiry was that nomination contests are the least-regulated step in the path to elected office, and that the asymmetry between federal-election eligibility (which requires citizenship) and party-nomination eligibility (which varies) creates a vector for foreign-influence operations.\n\nThe Commission’s overview report on parties’ rules was published as a public exhibit so that any Canadian can read the rules for themselves. We have linked it under Sources.`,
      },
      {
        title: 'What this article is not arguing',
        body: `Parliament Audit takes no position on whether any of these rules should change. There are arguments on every side — from “it’s a private association, the rules are theirs to set” to “citizenship should be required because candidates ultimately need it.”\n\nWhat we report is what the rules currently are, where they come from in writing, and what the gaps between them and federal-election law actually are. Canadians can decide what to do with that information.`,
      },
    ],
    sources: [
      {
        label: 'Public Inquiry into Foreign Interference — Overview Report: Political Parties’ Rules and Processes (exhibit COM0000591.EN)',
        url: 'https://foreigninterferencecommission.ca/fileadmin/foreign_interference_commission/Documents/Exhibits_and_Presentations/Overview_Reports/COM0000591.EN.pdf',
      },
      {
        label: 'Liberal Party of Canada — National Rules for the Selection of Candidates (February 2026)',
        url: 'https://liberal.ca/wp-content/uploads/sites/292/2023/01/National-Rules-for-the-Selection-of-Candidates.pdf',
      },
      {
        label: 'Liberal Party of Canada — Nomination FAQ',
        url: 'https://liberal.ca/nomination-faq/',
      },
      {
        label: 'Conservative Party of Canada — Membership By-law',
        url: 'https://cpcassets.conservative.ca/wp-content/uploads/2020/10/20170655/98bd7fe568afae5.pdf',
      },
      {
        label: 'New Democratic Party of Canada — Constitution (April 2021)',
        url: 'https://xfer.ndp.ca/2023/Documents/Constitution%20EN-2021.pdf',
      },
      {
        label: 'Elections Canada — Chapter 5: Political Parties and Candidates (March 2025)',
        url: 'https://www.elections.ca/content.aspx?section=res&dir=pub%2Fecdocs%2From%2FvII%2Fch_5&document=ch_5&lang=e',
      },
      {
        label: 'Canadian Affairs — “Ballots beyond borders: should non-citizens vote in party nomination races?” (Dec 3, 2024)',
        url: 'https://www.canadianaffairs.news/2024/12/03/ballots-beyond-borders-should-non-citizens-vote-in-party-nomination-races/',
      },
    ],
  },
  {
    slug: 'liberal-majority-cameras-off-april-28',
    headline:
      'Liberals Used Their New Majority to Vote a $298M Health Hearing Behind Closed Doors. The Vote Was 6–5.',
    subheadline:
      'On Tuesday, April 28, the Liberal Parliamentary Secretary of Health moved the cameras off two minutes after a Conservative MP moved to ask the Auditor General to audit PrescribeIT. A parallel in-camera vote happened the same morning at the Ethics Committee on a motion about the Prime Minister’s ethics screen. Both votes were 6–5 on Liberal party lines.',
    summary:
      'On April 28, 2026 — the first day the Liberals’ new House majority took effect — two House of Commons standing committees voted to go in camera on motions involving public-interest accountability. At HESA (Health), Liberal Parliamentary Secretary Maggie Chi moved to take the meeting in camera while a Conservative motion to ask the Auditor General to audit PrescribeIT was on the floor. The vote was 6–5: six Liberals YEA, four Conservatives plus one Bloc MP NAY. At ETHI (Ethics), Liberal members made an identical move on a Conservative motion that would have required the Privy Council Office to provide regular updates on the Prime Minister’s ethics screen. The pattern triggered a public defence from Liberal House leader Steven MacKinnon, who pledged "open committees" the next day.',
    publishedAt: '2026-05-05T22:00:00-04:00',
    category: 'Accountability',
    tags: [
      'in camera',
      'accountability',
      'committees',
      'PrescribeIT',
      'HESA',
      'ETHI',
      'Liberal majority',
      'transparency',
    ],
    readingTimeMinutes: 6,
    smartBrevity: {
      bigThing:
        'On Day One of the new Liberal majority, two House committees voted 6–5 to take public-interest accountability motions behind closed doors.',
      whyItMatters:
        'The minutes are now public. Liberal Parliamentary Secretary Maggie Chi moved cameras-off two minutes after a motion to audit a $298M health-software program hit the floor. An identical move shut down a motion on the PM’s ethics screen at a second committee the same morning.',
      goDeeper: [
        'HESA Meeting 31 minutes record the vote at 12:16 PM — cameras off two minutes after the in-camera motion was moved.',
        'YEAs (6, all Liberal): Bittle, Chi, Eyolfson, Jaczek, Sawatzky, Sidhu. NAYs (5): Bailey, Blanchette-Joncas, Konanz, Mazier, Strauss.',
        'Same morning at the Ethics Committee (ETHI), Liberal members moved a Conservative motion on the PM’s ethics screen behind closed doors.',
        'Liberal House leader Steven MacKinnon publicly committed to "open committees" the next day under pressure.',
      ],
      yesBut:
        'The HESA committee did still order unredacted documents from Canada Health Infoway and Telus Health on PrescribeIT before adjourning. The story is not that no work happened — the story is that the public was kicked out of the room while it happened.',
      bottomLine:
        'Two committees, two public-interest motions, two in-camera votes on Day One. That is a strategy, not an incident.',
    },
    methodology:
      'The HESA Meeting 31 vote details — mover, motion text, party-line breakdown — are sourced directly to the official ourcommons.ca minutes. Direct quotes from Conservative MPs Dan Mazier and Michael Barrett, and from Liberal House leader Steven MacKinnon, come from Canadian Press wire reporting (Sarah Ritchie / Nick Murray) carried by Castanet, CBC News, Global News, National Post, and others on April 29–30. We have NOT seen the in-camera proceedings themselves and explicitly do not characterize what was discussed once the cameras went off. The article reports what is on the public record: the motion, the vote, the timing, and the on-the-record reactions from each side. Maggie Chi did not respond to media questions per CP. Liberal MPs Doug Eyolfson and Sonia Sidhu declined to comment per CP. Bloc MP Maxime Blanchette-Joncas attempted to ask Chi her reasoning during the meeting; the chair (acting Liberal Chris Bittle) ruled the question out of order. We did not interview the participants for this piece.',
    keyTakeaways: [
      'HESA voted 6–5 to go in camera at 12:16 PM ET on April 28, 2026. Six Liberal MPs YEA; four Conservative MPs plus Bloc MP Blanchette-Joncas NAY.',
      'The motion to go in camera came two minutes after Conservative MP Dan Mazier moved to have the Auditor General audit the $298M PrescribeIT program.',
      'Liberal Parliamentary Secretary of Health Maggie Chi was the mover.',
      'The Standing Committee on Access to Information, Privacy and Ethics (ETHI) made the identical move the same morning on a Conservative motion about the Prime Minister’s ethics screen.',
      'Liberal House leader Steven MacKinnon publicly committed to "open committees" the next day under media pressure.',
      'HESA did still order unredacted documents from Canada Health Infoway and Telus Health on PrescribeIT before adjourning — the in-camera vote did not bury the file entirely.',
    ],
    sections: [
      {
        title: 'The 16 minutes',
        body: `The Standing Committee on Health gaveled in at 12:00 PM ET on Tuesday, April 28, 2026. The meeting had been forced under Standing Order 106(4) by opposition members who wanted to discuss the PrescribeIT program — the federal e-prescribing service that absorbed more than $290 million over a decade and is shutting down on May 29.

At 12:13 PM, Conservative health critic Dan Mazier moved that the committee request the Auditor General audit the program, and that the committee invite the Minister of Health and senior officials to appear within two weeks.

At 12:14 PM, Liberal Maggie Chi — Parliamentary Secretary to the Minister of Health — moved that the committee proceed to sit in camera.

At 12:16 PM, the cameras went off. The vote was 6–5 on strict party lines.

YEAs, all Liberal: Chris Bittle, Maggie Chi, Doug Eyolfson, Helena Jaczek, Jake Sawatzky, Sonia Sidhu.

NAYs: Burton Bailey (CPC), Maxime Blanchette-Joncas (BQ), Helena Konanz (CPC), Dan Mazier (CPC), Matt Strauss (CPC).

The committee resumed in camera at 12:24 PM, suspended again at 12:36 PM and 12:51 PM, and adjourned at 1:00 PM.

These details are on the official ourcommons.ca Meeting 31 minutes. There is no source-attribution distance between Parliament Audit and the parliamentary record on the vote itself.`,
      },
      {
        title: 'The same morning at Ethics',
        body: `The same morning, the Standing Committee on Access to Information, Privacy and Ethics (ETHI) was scheduled to debate a Conservative motion that would have required the Privy Council Office to provide regular updates on the Prime Minister’s ethics screen — a reference to the conflict-of-interest screen built around Mark Carney’s former Brookfield Asset Management ties, which Conservative MP Michael Barrett has previously characterized as covering roughly 103 entities.

According to Canadian Press wire reporting on April 29, ETHI’s meeting "went into closed-door sessions minutes after gaveling in," with the same Liberal-majority arithmetic. The party-line vote pattern matches HESA.

It is the same play, on the same day, in two different committees, on two different public-interest accountability motions. That fact — two committees, not one — is what makes the story strategic rather than incidental.`,
      },
      {
        title: 'What each side said on the record',
        body: `Conservative MP Dan Mazier, after the HESA vote: "We were going to ask the auditor general to come in and do an investigation and Liberal Maggie Chi voted to shut down the cameras." Separately: "It’s very disheartening to see the Liberals go to this degree of kind of authoritarianism." And: "It was astounding, it was awful. I think if that’s what Mark Carney plans to do with his newfound majority, I think Canadians should be really, really distressed."

Conservative ethics critic Michael Barrett, on the ETHI vote: "That means that the media get kicked out, the public can’t watch online. It’s going to make it more difficult for us to be able to bring that accountability to bear and that’s a choice that Liberals have made."

Liberal House leader Steven MacKinnon, in response to the criticism: "I reject the premise. No one’s shutting down debate. We’re having lots of debate every day on a very ambitious legislative agenda."

Bloc MP Maxime Blanchette-Joncas, the lone non-Conservative NAY vote on HESA, attempted to ask Chi her reasoning before the in-camera vote was taken. The chair, acting Liberal MP Chris Bittle, ruled the question out of order on the grounds that members had already been called to vote.

Maggie Chi did not respond to email questions from Canadian Press. Liberal MPs Doug Eyolfson and Sonia Sidhu declined to comment to reporters.`,
      },
      {
        title: 'The pattern that followed',
        body: `On Wednesday, April 29 — the morning after — Liberal House leader Steven MacKinnon publicly committed to "open committees." This was a reactive commitment, made under media pressure that included Canadian Press wire copy reprinted in 20+ outlets, CBC News’s lead politics piece for the day, Global News, National Post, and others. Conservative House leader Andrew Scheer responded that the commitment did not match what had happened on the ground 18 hours earlier.

On Thursday, April 30, the House of Commons Standing Committee on Human Resources, Skills and Social Development (HUMA) was scheduled to debate a Bloc Québécois motion that would have required the government to produce documents on a $6.6-billion benefits-delivery IT modernization project — originally budgeted at $1.7 billion in 2017, now over three times that.

When HUMA convened, Liberal members instead pushed forward with clause-by-clause consideration of an unrelated bill, without notice, effectively running out the clock on the Bloc motion. This is procedural shelving, not an in-camera vote — different mechanism, same effect on access. Conservative MP Garnett Genuis told reporters: "Canadians will be worse off because they won’t have access to this information about this software."

Three committees in three days, three different mechanisms, three documents-and-audit motions deferred or moved out of public view. The Liberal majority has been in effect since Monday, April 27.`,
      },
      {
        title: 'What we do not know yet',
        body: `Several pieces of this file are not yet public.

The exact disposition of Mazier’s motion to ask the Auditor General to audit PrescribeIT — once the meeting went in camera — is not on the public record. The committee did, before adjourning, order unredacted documents from Canada Health Infoway and Telus Health on PrescribeIT costs, contracts, and board minutes. Whether the AG-audit motion was passed in part, in full, or shelved during the in-camera portion is not something we can report from the available record. The committee’s report on PrescribeIT, when tabled, will reveal it.

The exact disposition of the ETHI motion on the Prime Minister’s ethics screen is similarly not public.

The Auditor General’s office has not, as of publication, responded to the original April 27 request from Conservative MPs to investigate PrescribeIT. The AG can decline.

Whether HESA Meeting 32 (with the Health Minister summoned within two weeks) will be held in public or in camera is not yet announced.

We will update this article when those facts surface.`,
      },
    ],
    sources: [
      {
        label: 'Standing Committee on Health — Meeting 31 Minutes (Apr 28, 2026)',
        url: 'https://www.ourcommons.ca/DocumentViewer/en/45-1/HESA/meeting-31/minutes',
      },
      {
        label: 'Canadian Press / Castanet — Tories accuse Liberals of shutting down public debate (Apr 29, 2026)',
        url: 'https://www.castanet.net/news/Canada/611641/Tories-accuse-Liberals-of-shutting-down-public-debate-in-parliamentary-committees',
      },
      {
        label: 'CBC News — Liberals use majority to move some parliamentary committees behind closed doors (Apr 29, 2026)',
        url: 'https://www.cbc.ca/news/politics/liberals-in-camera-parliamentary-committees-9.7182912',
      },
      {
        label: 'CBC News — MacKinnon defends, commits to open committees (Apr 30, 2026)',
        url: 'https://www.cbc.ca/news/politics/mackinnon-committees-scheer-in-camera-9.7184688',
      },
      {
        label: 'Global News — House of Commons committee majorities debate (Apr 29, 2026)',
        url: 'https://globalnews.ca/news/11823220/house-of-commons-committee-majorities-debate-liberals/',
      },
      {
        label: 'Global News — Liberals on transparency under majority (Apr 30, 2026)',
        url: 'https://globalnews.ca/news/11826939/liberals-committees-transparency-majority-mackinnon/',
      },
      {
        label: 'Unpublished.ca / National Post — Liberals won’t explain why health committee was moved behind closed doors (Apr 29, 2026)',
        url: 'https://unpublished.ca/news-feed-item/2026-04-29/liberals-wont-explain-why-health-committee-was-moved-behind-closed-doors',
      },
      {
        label: 'National Observer — Liberals use new powers to shut down committee debate on $6.6B IT project (May 1, 2026)',
        url: 'https://www.nationalobserver.com/2026/05/01/news/liberals-use-new-powers-shut-down-committee-debate-66-billion-it-project',
      },
      {
        label: 'Castanet — Liberals shut down committee debate on $6.6 billion IT project (Apr 30, 2026)',
        url: 'https://www.castanet.net/news/Canada/611951/Liberals-shut-down-committee-debate-on-6-6-billion-IT-project',
      },
      {
        label: 'Parliament Audit — PrescribeIT $298M post-mortem (Apr 29, 2026)',
        url: 'https://parliamentaudit.ca/news/prescribeit-298m-axe-the-fax-shutdown',
      },
    ],
  },
  {
    slug: 'prescribeit-298m-axe-the-fax-shutdown',
    headline:
      'Ottawa Spent $298M on PrescribeIT. Telus Kept 85% of the IP. The Service Shuts Down May 29.',
    subheadline:
      'After 10 years and roughly $290 million in federal spending on the national e-prescribing service, fewer than 5% of Canadian prescriptions ever moved through it. Conservative MPs have asked the Auditor General to investigate.',
    summary:
      'PrescribeIT, the federal e-prescribing service operated by Canada Health Infoway and built primarily by Telus Health, will go offline at 11:59 PM EST on May 29, 2026. Health Canada has acknowledged "more than $290 million" in federal spending on the program over 10 years; Conservative MPs use the rounded "$300 million" figure. Roughly $98 million of that flowed to Telus Health, which retained approximately 85% of the underlying intellectual property. Adoption never broke 5% of Canadian prescriptions. On April 27, 2026, four Conservative MPs on the House of Commons Health Committee — led by Conservative health critic Dan Mazier — formally asked the Auditor General to investigate. The Conservative Party stated that on the same day, "Liberal Members filibustered the health committee to block the release of those documents." Bloc Québécois MP Maxime Blanchette-Joncas endorsed the audit request. Health Canada told the committee that detailed PrescribeIT spending is not centrally tracked.',
    publishedAt: '2026-04-29T08:00:00-04:00',
    category: 'Accountability',
    tags: [
      'PrescribeIT',
      'accountability',
      'Canada Health Infoway',
      'Telus Health',
      'Auditor General',
      'health',
      'e-prescribing',
    ],
    readingTimeMinutes: 6,
    smartBrevity: {
      bigThing:
        'Ottawa spent more than $290M on PrescribeIT. Telus kept 85% of the IP. The service shuts down May 29.',
      whyItMatters:
        'Health Canada says the spending is not centrally tracked. On April 27, Conservative MPs asked the Auditor General to investigate. The Conservative Party says Liberal MPs filibustered a committee vote that would have released the program’s contribution agreements.',
      goDeeper: [
        'Initial budget (2016): $40M. Total federal spend acknowledged: more than $290M.',
        'Adoption: fewer than 5% of Canadian prescriptions ever flowed through the system after 10 years.',
        'Telus Health was paid roughly $98M and retained ~85% of the underlying IP.',
        'Canada Health Infoway CEO Michael Green declined to disclose his salary when asked at the Health Committee.',
      ],
      yesBut:
        'The Auditor General has not yet committed to opening an investigation. The full text of the Conservative MPs’ letter has not been released. Liberal MPs have not publicly characterized their April 27 procedural conduct as a filibuster.',
      bottomLine:
        'Most prescriptions in Canada in 2026 are still sent by fax or paper. Ottawa funded the build, the vendor owns the asset, and Health Canada cannot say where most of the money went.',
    },
    methodology:
      'Spending figures sourced to Health Canada (via Globe and Mail reporting, April 21–22, 2026), to Conservative MP Dan Mazier’s April 27 audit request, and to Canada Health Infoway’s own February 18, 2026 shutdown announcement. The "more than $290 million" figure is Health Canada’s; the rounded "$300 million" framing is Mazier’s. Telus Health\'s ~$98M revenue figure and ~85% IP retention are reported in the Globe and Mail (Feb 10–12, 2026 and Apr 21–22 follow-up). Committee testimony from Canada Health Infoway CEO Michael Green is from House of Commons Health Committee (HESA) Meeting 29, April 21–22, 2026, held in public and webcast. The filibuster claim is attributed to a Conservative Party of Canada press release dated April 27, 2026 — Liberal members of the committee have not publicly characterized their conduct as a filibuster, and HESA Meeting 31 (April 28, 2026) was a Standing Order 106(4) opposition-requested meeting that was televised, not held in camera. We have not seen the text of the Conservative MPs’ formal letter to the Auditor General; only the April 27 press conference and the news coverage that followed. The NDP has not put a position on the record in available reporting. We did not interview Canada Health Infoway, Telus Health, or the Office of the Minister of Health for this piece.',
    keyTakeaways: [
      'PrescribeIT shuts down 11:59 PM EST on May 29, 2026 — announced February 18 by Canada Health Infoway.',
      'Total federal spending: "more than $290 million" (Health Canada). Conservative framing rounds to "$300 million."',
      'Telus Health was paid roughly $98 million and kept ~85% of the program’s intellectual property.',
      'Conservative MPs Mazier, Bailey, Konanz, and Strauss requested an Auditor General investigation on April 27. Bloc MP Blanchette-Joncas endorsed the request.',
      'The Conservative Party says Liberal members filibustered a Health Committee motion that would have released PrescribeIT’s contribution agreements.',
      'Health Canada told the Health Committee that PrescribeIT spending "is not centrally tracked."',
    ],
    sections: [
      {
        title: 'The numbers',
        body: `PrescribeIT was announced in 2016 with a federal budget of $40 million. By the time Canada Health Infoway announced the shutdown on February 18, 2026, Health Canada had acknowledged "more than $290 million" in federal spending across the program’s 10-year run — a figure first reported by the Globe and Mail and confirmed in Conservative MP Dan Mazier’s April 27 audit request, which used the figure $298 million.

Conservative messaging has rounded that to "$300 million." That framing has propagated into outlet headlines at CBC, BNN Bloomberg, and The Deep Dive over the last 24 hours. The "more than $290 million" figure is the conservative-with-a-small-c version, and is the one Health Canada itself has used.

Of the total, roughly $98 million is reported to have flowed to Telus Health — a subsidiary of Telus Corp. and the program’s primary technology vendor. Telus retained approximately 85% of the underlying intellectual property. The federal government holds no IP in the platform it funded.

Recent annual operating cost was approximately $35 million. In 2025, when federal funding was cut, Canada Health Infoway introduced a $0.20-per-prescription fee charged to pharmacists. Some pharmacies abandoned the service in response.`,
      },
      {
        title: 'Why it failed',
        body: `Adoption never broke 5%. Despite onboarding chains as large as Shoppers Drug Mart, Metro Ontario, and Walmart, fewer than 5 in every 100 prescriptions in Canada in any given year were transmitted through PrescribeIT. The vast majority continued to be sent by fax or paper, including in 2026.

In testimony to the House of Commons Health Committee on April 21–22, 2026, Canada Health Infoway CEO Michael Green told MPs the cause was multi-factor: "The ease of adoption by primary care physicians and prescribers was lower than expected." Glen Doucet, CEO of the Canadian Pharmacists Association, told the committee that the program needed "more of a carrot than a stick" — a reference to the $0.20-per-prescription fee that pharmacists were charged after federal funding was cut.

Health Minister Marjorie Michel’s office, through spokesperson Guillaume Bertrand, has cited the absence of a federal-provincial-territorial cost-sharing agreement as the deciding factor. Provinces and territories declined to share the program’s operating costs. Without an FPT funding model, Infoway could not sustain the system on federal funding alone.

In the same April 21–22 hearing, Liberal committee members — including former Health Committee chair Hedy Fry and MP Doug Eyolfson — asked diagnostic questions about why physicians did not adopt the system and what problems had been identified. Conservative MP Helena Konanz asked Green what his salary was; Green declined to answer.`,
      },
      {
        title: 'The Telus question',
        body: `The Conservative audit request, filed by Mazier and three other Health Committee members on April 27, focuses partly on the relationship between the federal government, Canada Health Infoway, and Telus Health.

Telus Health, through approximately 50 employees assigned to the program, designed and built the PrescribeIT platform. Globe and Mail reporting puts Telus’s revenue from the project at roughly $98 million since 2017. The vendor retained approximately 85% of the underlying intellectual property.

When the program shuts down on May 29, the federal government will have funded the construction of a system whose intellectual asset is owned by a private vendor. The Conservative MPs have asked the Auditor General to examine whether the federal investment achieved value for money under that structure.

Mazier, framing the file at his April 27 press conference: "So what did Canadians get for their $300 million? Well, that’s the $300-million question." Separately: "The $300-million question is simple: Who got rich?"

Bloc Québécois MP Maxime Blanchette-Joncas endorsed the call for an Auditor General investigation. The NDP has not yet publicly stated a position. The Auditor General’s office has not, as of publication, committed to opening a probe.`,
      },
      {
        title: 'The committee, the documents, and the filibuster',
        body: `On April 27, 2026, the same day Conservative MPs sent the Auditor General request, the Conservative Party of Canada issued a statement saying Liberal members of the House of Commons Health Committee had filibustered a motion that would have required Canada Health Infoway to release its PrescribeIT contribution agreements and performance documents.

The Conservative wording: "Instead of allowing a vote, Liberal Members filibustered the health committee to block the release of those documents."

Liberal members of the committee have not publicly characterized their April 27 conduct as a filibuster. Parliament Audit has not seen the committee transcript for that day; HESA Meeting 30 minutes had not been published as of the morning this article went up. The Conservative claim is in the public record via party press release; no Liberal counter-statement has yet been published.

On April 28, 2026, the Health Committee held Meeting 31, a Standing Order 106(4) opposition-requested meeting whose agenda items were "Election of Chair" and discussion of the PrescribeIT investigation. The meeting was televised. The Liberals\' new House majority — secured in early April after four Conservative floor crossings — translates to expanded committee majorities, including the chair election that took place at the April 28 meeting.

Conservative MP Helena Konanz also asked Canada Health Infoway CEO Michael Green during his April 21–22 testimony what his salary was. Green declined to answer.`,
      },
      {
        title: 'What happens next',
        body: `PrescribeIT goes offline at 11:59 PM EST on May 29, 2026. Canada Health Infoway has committed to making "a national e-prescribing standard" publicly available before May 1, 2026 — a framework, not a working system. The Health Committee has set May 6 as a deadline for Infoway and Health Canada to provide follow-up testimony.

What replaces PrescribeIT operationally is unclear. Most Canadian provinces have no operational e-prescribing alternative ready by May 30. The default reverts to fax and paper.

The Conservative MPs’ letter to the Auditor General, summarized in news coverage but not yet released in full, requests an investigation into the spending. Whether the AG accepts the request is at the discretion of that office; the AG can decline. If accepted, an audit report typically takes 12–18 months to produce.

In the meantime, Health Canada’s own statement to the committee — that detailed PrescribeIT spending data "is not centrally tracked by Health Canada" — stands as the most damaging line in the file. The department funded the program. It cannot say where most of the money went.`,
      },
      {
        title: 'What we do not know',
        body: `We have flagged this honestly so the file can be tracked.

The exact year-by-year federal spending breakdown has not been published. Of the ~$290 million spent, the ~$98 million paid to Telus is the only large allocation accounted for in current reporting. The remaining roughly $200 million has not been line-itemed publicly.

Other vendors’ contracts — if any — are not in the public record.

Canada Health Infoway CEO Michael Green committed at the April 21–22 hearing to providing the Health Committee with detailed board reports. Those have not, as of publication, been provided.

Whether Telus Health was profitable on the project net of operating costs is unknown; the $98 million figure is gross revenue.

Provincial-by-provincial adoption breakdowns have not been published. PrescribeIT operated in eight provinces and territories at peak, with Quebec in trial.

Whether the Auditor General will accept the audit request is unknown.`,
      },
    ],
    sources: [
      {
        label: 'CBC News — Conservative MPs call on auditor general to investigate $250M PrescribeIT program (Apr 27, 2026)',
        url: 'https://www.cbc.ca/news/politics/conservatives-auditor-general-request-prescribeit-9.7179223',
      },
      {
        label: 'Globe and Mail — Conservative MPs call on Auditor-General to probe PrescribeIT (Apr 27, 2026)',
        url: 'https://www.theglobeandmail.com/business/article-conservative-mps-auditor-general-prescribeit-probe/',
      },
      {
        label: 'Globe and Mail — MPs press official on why $250-million "axe the fax" digital prescribing program failed (Apr 21–22, 2026)',
        url: 'https://www.theglobeandmail.com/business/economy/article-mps-press-official-on-why-250-million-axe-the-fax-digital-prescribing/',
      },
      {
        label: 'Globe and Mail — Ottawa says digital prescription tool cancelled because it failed to replace fax machines (Feb 10–12, 2026)',
        url: 'https://www.theglobeandmail.com/business/economy/article-digital-prescription-tool-cancelled-failed-to-replace-fax-machines/',
      },
      {
        label: 'Globe and Mail — Doctors are still faxing prescriptions in 2026. Ottawa’s $250M program just shut down (Feb 2026)',
        url: 'https://www.theglobeandmail.com/business/economy/article-federal-axe-the-fax-e-prescribing-service-built-with-telus-health-to/',
      },
      {
        label: 'BNN Bloomberg — Conservatives call on auditor general to investigate $250M PrescribeIT program (Apr 27, 2026)',
        url: 'https://www.bnnbloomberg.ca/business/politics/2026/04/27/conservatives-call-on-auditor-general-to-investigate-250-million-prescribeit-program/',
      },
      {
        label: 'Canadian Press — Conservatives call on auditor general to investigate $250M PrescribeIT program (Apr 27, 2026)',
        url: 'https://www.thecanadianpressnews.ca/national/conservatives-call-on-auditor-general-to-investigate-250-million-prescribeit-program/article_2ab73084-36ec-50a4-adbd-72b546071ebe.html',
      },
      {
        label: 'Canadian Healthcare Technology — Infoway pulls the plug on PrescribeIT (Feb 18, 2026)',
        url: 'https://www.canhealth.com/2026/02/18/infoway-pulls-the-plug-on-prescribeit/',
      },
      {
        label: 'Alberta College of Pharmacy — PrescribeIT to cease operations May 29, 2026',
        url: 'https://abpharmacy.ca/news/prescribeit-e-prescribing-service-to-cease-operations-may-29-2026/',
      },
      {
        label: 'The Deep Dive — Conservative MPs seek auditor-general probe into $298M PrescribeIT (Apr 27, 2026)',
        url: 'https://thedeepdive.ca/conservative-audit-prescribeit-spending/comment-page-1/',
      },
      {
        label: 'PrescribeIT.ca — Service Update notice (Canada Health Infoway)',
        url: 'https://www.prescribeit.ca/?view=article&id=477:notice-prescribeit-service-update&catid=2',
      },
      {
        label: 'Telus Health — PrescribeIT product page (vendor confirmation)',
        url: 'https://www.telus.com/en/health/health-professionals/clinics/emr-add-ons/prescribeit',
      },
    ],
  },
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
      'Budget 2025 committed the federal government to $60 billion in internal savings over four years and a 40,000-position reduction in the public service. The March 2026 departmental plans showed where the cuts will actually land.',
    summary:
      'Budget 2025 (tabled November 4, 2025 by Finance Minister Fran\u00e7ois-Philippe Champagne) outlined $60.6 billion in spending reductions over four years, including a 40,000-position reduction in the federal public service \u2014 with an estimated 10,000 jobs cut in the first three years. The departmental plans released in March 2026 specified where the cuts land: the Canada Revenue Agency, Public Services and Procurement Canada, and Employment and Social Development Canada face the largest workforce reductions. The Spring Economic Update scheduled for April 28, 2026 will reforecast against these numbers.',
    publishedAt: '2026-04-15T14:00:00-04:00',
    category: 'Budget',
    tags: ['budget cuts', 'public service', 'spending', 'CRA', 'federal budget', 'Budget 2025'],
    readingTimeMinutes: 7,
    editorsNote: {
      date: '2026-04-23',
      body: 'Corrected 2026-04-23: this article originally described the plan as "Budget 2026" and attributed it to fiscal tables "published on April 15, 2026." The $60B / 40,000-FTE plan is in fact Budget 2025 ("Canada Strong"), tabled by Finance Minister Champagne on November 4, 2025. The April 15 framing conflated the departmental plans released March 17\u201318, 2026 with the original budget. The Spring Economic Update is scheduled for April 28, 2026 and will reforecast against the Budget 2025 numbers. The underlying figures (the $60B, the 40,000-position reduction, the department-by-department breakdown) are unchanged \u2014 only the date attribution has been corrected.',
    },
    smartBrevity: {
      bigThing:
        'Budget 2025 committed the federal government to $60.6 billion in internal savings over four years and a 40,000-position reduction in the public service.',
      whyItMatters:
        'It\u2019s the largest federal workforce reduction since the mid-1990s Chr\u00e9tien-era Program Review, and it\u2019s unevenly distributed \u2014 a handful of departments absorb most of it.',
      goDeeper: [
        'Canada Revenue Agency: 2,620 jobs cut (largest of any department).',
        'Public Services and Procurement, ESDC, Global Affairs, Health Canada, StatCan, and Environment Canada each lose 800\u20131,800 positions.',
        '$10-a-day childcare receives no new federal funding after 2027\u201328.',
        'Passport processing wait times projected to roughly double by fall 2026.',
      ],
      yesBut:
        'Defence spending rises sharply over the same period ($81.8B envelope), and the government argues the deficit-to-GDP target below 1% by 2028-29 justifies the trade-off.',
      bottomLine:
        'Whether this is \u201cfiscal discipline\u201d or \u201cstarving the public service\u201d is the political fight. The numbers themselves are not contested.',
    },
    methodology:
      'All numbers are from Budget 2025 ("Canada Strong," tabled November 4, 2025), the 85+ departmental plans released March 17\u201318, 2026, Treasury Board Secretariat briefings, and Department of Finance fiscal tables. The Spring Economic Update on April 28, 2026 will reforecast against these figures. Wait-time projections come from a leaked IRCC operational memo reported by The Canadian Press and confirmed via the departmental briefing. Job-count figures are rounded to the nearest whole.',
    sections: [
      {
        title: 'The Big Picture',
        body: `Budget 2025 ("Canada Strong"), tabled on November 4, 2025, commits the federal government to $60.6 billion in spending reductions over four years — the largest fiscal consolidation since the Chr\u00e9tien-era Program Review of the mid-1990s. The departmental plans released March 17\u201318, 2026 made the abstract numbers concrete by specifying where the cuts land.\n\nThe government says the cuts are necessary to fund new defence spending commitments ($81.8 billion envelope) and bring the deficit-to-GDP ratio below 1% by 2028-29. But unlike across-the-board percentage cuts, the reductions are concentrated in specific departments and programs — meaning some parts of government will be hit far harder than others.`,
      },
      {
        title: 'Job Losses by Department',
        body: `Based on the 85+ departmental plans tabled March 17\u201318, 2026 following the November 2025 budget, approximately 10,000 positions will be eliminated in the first three years through a combination of attrition, early retirement packages, and layoffs, as part of the 40,000-position drawdown over four years. The largest reductions by department:\n\nCanada Revenue Agency (CRA): 2,620 positions. The agency says it will offset losses through automation of returns processing, but the Public Service Alliance of Canada warns that audit capacity will be reduced.\n\nPublic Services and Procurement Canada (PSPC): 1,793 positions. Cuts focus on property management as the government accelerates its office consolidation plan.\n\nEmployment and Social Development Canada (ESDC): 1,500 positions. Service Canada centres are expected to reduce hours in rural areas.\n\nGlobal Affairs Canada (GAC): 1,240 positions. Several consulates are being downgraded from full-service to appointment-only.\n\nHealth Canada: 942 positions. Drug approval timelines may lengthen as review staff are reduced.\n\nStatistics Canada: 900 positions. The agency has warned that some surveys may be discontinued or moved to longer cycles.\n\nEnvironment and Climate Change Canada (ECCC): 837 positions. Climate monitoring stations in Northern Canada are among the programs under review.`,
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
        label: 'Canada.ca — Budget 2025 ("Canada Strong") full document',
        url: 'https://www.canada.ca/en/department-finance/news/2025/11/budget-2025.html',
      },
      {
        label: 'Treasury Board Secretariat — March 2026 departmental plans',
        url: 'https://www.canada.ca/en/treasury-board-secretariat/services/planned-government-spending/reports-plans-priorities.html',
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
    subjects: [
      {
        name: 'Marilyn Gladu',
        role: 'Sarnia–Lambton MP',
        portraitUrl: 'https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/45/GladuMarilyn_CPC.jpg',
        party: 'CPC',
        caption: 'Jan 11',
      },
      {
        name: 'Marilyn Gladu',
        role: 'Sarnia–Lambton MP',
        portraitUrl: 'https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/45/GladuMarilyn_CPC.jpg',
        party: 'LPC',
        caption: 'Apr 8',
      },
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
    subjects: [
      {
        name: 'Matt Jeneroux',
        role: 'Edmonton Riverbend MP',
        portraitUrl: 'https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/45/JenerouxMatt_CPC.jpg',
        party: 'CPC',
        caption: 'Nov 6 — Resigning',
      },
      {
        name: 'Matt Jeneroux',
        role: 'Edmonton Riverbend MP',
        portraitUrl: 'https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/45/JenerouxMatt_CPC.jpg',
        party: 'LPC',
        caption: 'Feb 18 — Crossing',
      },
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
    subjects: [
      {
        name: 'Michael Ma',
        role: 'Markham–Unionville MP',
        // ourcommons.ca ID 105088 (45th Parliament); the photo file is
        // tagged _CPC at the elected-party because the official MP-photos
        // index is keyed on the seat-of-election party, not current
        // caucus. Confirmed working 2026-05-12.
        portraitUrl: 'https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/45/MaMichael_CPC.jpg',
        party: 'CPC',
        caption: 'Dec 2 — "Team Feudalism"',
      },
      {
        name: 'Michael Ma',
        role: 'Markham–Unionville MP',
        portraitUrl: 'https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/45/MaMichael_CPC.jpg',
        party: 'LPC',
        caption: 'Dec 11 — Crossed',
      },
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
    subjects: [
      {
        name: 'Chris d’Entremont',
        role: 'Acadie–Annapolis MP',
        portraitUrl: 'https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/45/DEntremontChris_CPC.jpg',
        party: 'CPC',
        caption: 'Won by 533',
      },
      {
        name: 'Chris d’Entremont',
        role: 'Acadie–Annapolis MP',
        portraitUrl: 'https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/45/DEntremontChris_CPC.jpg',
        party: 'LPC',
        caption: 'Crossed Nov 4',
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

/**
 * Find articles related to a given slug, scored by tag overlap + category
 * affinity. Returns up to `limit` articles, excluding the source slug.
 *
 * Scoring:
 *   +3 per shared tag (case-insensitive)
 *   +1 if same category
 *   recency tiebreak (newer wins)
 *
 * Intended for the "Related reporting" block at the end of each article.
 */
export function getRelatedArticles(slug: string, limit = 3): NewsArticle[] {
  const source = getNewsArticle(slug);
  if (!source) return [];
  const sourceTags = new Set(source.tags.map((t) => t.toLowerCase()));

  const scored = newsArticles
    .filter((a) => a.slug !== slug)
    .map((a) => {
      const sharedTags = a.tags.filter((t) => sourceTags.has(t.toLowerCase())).length;
      const categoryMatch = a.category === source.category ? 1 : 0;
      return {
        article: a,
        score: sharedTags * 3 + categoryMatch,
        publishedAt: a.publishedAt,
      };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.publishedAt < b.publishedAt ? 1 : -1;
    });

  return scored.slice(0, limit).map((x) => x.article);
}
