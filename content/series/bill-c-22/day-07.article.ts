/**
 * Bill C-22 Series — Day 7 (capstone): the MPs who moved it to committee.
 *
 * Replaces the originally-planned "How to push back on Bill C-22" piece
 * with a more concrete version: name the load-bearing MPs by role +
 * publish their public contact info. Per operator request 2026-05-21
 * + my editorial pushback: civic-transparency framing (not campaign
 * advocacy). The ContactYourMP embed at the bottom of this article
 * is the action vector; the article body publishes the receipts.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'bill-c-22-mps-who-moved-it-to-committee',
  headline:
    'Bill C-22 Is at Committee. Here Are the MPs Who Put It There — And How to Reach Them.',
  subheadline:
    'Civic transparency on the second-reading record. The bill\'s sponsor, the Cabinet members who spoke for it on the floor, the Government House Leader who scheduled the debate, and the Liberal members of the Public Safety committee who now control its amendments — each with their public role on C-22 and their public-record contact details. Constituents in any of these ridings can reach the listed MPs directly.',
  summary:
    'On April 20, 2026, the House of Commons passed Bill C-22 (Lawful Access Act, 2026) at second reading. The bill is now at the Standing Committee on Public Safety and National Security (SECU), which is the last realistic stage for substantive amendments. This article catalogues the load-bearing Liberal MPs in C-22\'s path to passage — the bill\'s sponsor (Public Safety Minister Gary Anandasangaree), three Cabinet members who spoke for the bill at second reading (Justice Minister Sean Fraser, Secretary of State for Combatting Crime Ruby Sahota, Parliamentary Secretary Patricia Lattanzio), the Government House Leader who scheduled the debate (Steven MacKinnon), and the seven Liberal members on SECU led by Chair Jean-Yves Duclos. Each MP\'s public role on C-22 is described and public-record contact information is included so constituents can reach their representatives. Parliament Audit takes no position on whether the bill should pass; we publish the record and the contact channel.',
  publishedAt: new Date().toISOString(),
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
};
