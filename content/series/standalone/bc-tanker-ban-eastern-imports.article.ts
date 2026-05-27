/**
 * Standalone article — The BC tanker ban + Eastern Canada foreign-oil
 * imports, the contradiction the user asked us to surface.
 *
 * Operator request 2026-05-26: BC has a tanker ban that "only really
 * affects Canada" because ships pass by BC to and from Alaska; meanwhile
 * Eastern provinces import oil via tankers from the Middle East and
 * not via pipeline from Alberta.
 *
 * Both substantive claims hold up on the facts:
 *   - Bill C-48 (Oil Tanker Moratorium Act, 2019) bans large crude
 *     tankers >12,500 tonnes from the BC north coast between Vancouver
 *     Island and the Alaska border, killing the Northern Gateway and
 *     Eagle Spirit pipelines.
 *   - U.S. tankers heading to and from Alaska continue to transit the
 *     adjacent waters under the 1985 voluntary Tanker Exclusion Zone
 *     (TEZ), which keeps them offshore but does not stop them.
 *   - Eastern Canadian refineries import roughly 10.7% of Canada's
 *     crude oil supply from Saudi Arabia (2023), plus additional
 *     volumes from the U.S., Nigeria, and others.
 *   - Energy East — the proposed 4,500 km pipeline that would have
 *     moved 1.1M bpd of Alberta oil to Saint John, NB — was cancelled
 *     by TransCanada in October 2017 citing regulatory delays.
 *
 * Editorial floor: present the refinery-configuration argument fairly
 * (Eastern refineries are designed for light/sweet crude; Alberta
 * bitumen-derived heavy crude needs different processing). Don't
 * pretend the Energy East cancellation is purely a political decision.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'bc-tanker-ban-eastern-canada-saudi-oil-imports',
  headline:
    'BC\'s Tanker Ban: Canadian Tankers Banned. Alaskan Tankers Still Pass. Saudi Oil Still Lands in New Brunswick.',
  subheadline:
    'Bill C-48, passed in 2019, bans Canadian large crude tankers from the northern coast of British Columbia. It does not stop U.S. tankers from passing the same waters on their way to and from Alaska. Meanwhile, in Atlantic Canada, the largest refinery in the country runs in part on imported Saudi crude — because the Alberta-to-New-Brunswick pipeline that would have replaced those imports was cancelled in 2017. This is the geography of how Canadian oil is moved, and how foreign oil arrives in the same country.',
  summary:
    'The Oil Tanker Moratorium Act (Bill C-48), passed by Parliament in June 2019, bans crude oil tankers carrying more than 12,500 metric tonnes from stopping, loading, or unloading at ports along the northern coast of British Columbia — specifically the waters from the northern tip of Vancouver Island (50°28′N) to the Alaska border. The geography it covers includes Hecate Strait, Dixon Entrance, and the waters surrounding Haida Gwaii. The Act killed the proposed Northern Gateway pipeline (Enbridge) and the Eagle Spirit pipeline (an Indigenous-led proposal led by 35 First Nations along the proposed route). It does not apply to tankers below the 12,500-tonne threshold (smaller fuel deliveries to coastal communities are exempt) and it does not apply to U.S. tankers transiting between Alaska and the continental United States. Those U.S. tankers operate under the 1985 voluntary Tanker Exclusion Zone (TEZ), which keeps them offshore from BC\'s coast but allows them to pass. In Atlantic Canada, the situation is the inverse: the largest refinery in Canada — Irving Oil\'s 320,000-barrel-per-day facility in Saint John, New Brunswick — runs in part on imported crude, with Saudi Arabia historically supplying between 63,000 and 127,000 barrels per day. Canada imports approximately 10.7% of its crude oil supply from Saudi Arabia (2023), with additional volumes from the United States, Nigeria, and other suppliers. The Alberta-to-New-Brunswick pipeline that would have replaced much of this — the 4,500 km, 1.1 million bpd Energy East project — was cancelled by TransCanada in October 2017, citing regulatory delays and changed market conditions. The pieces are connected: Canada has constrained where Canadian oil can move within its own borders, while continuing to import equivalent oil from foreign suppliers via tankers that, for the most part, are not Canadian-flagged.',
  publishedAt: new Date().toISOString(),
  category: 'Accountability',
  tags: ['Bill C-48', 'tanker ban', 'oil', 'Alberta', 'pipelines', 'Energy East', 'Saudi Arabia', 'Atlantic Canada'],
  readingTimeMinutes: 7,
  keyTakeaways: [
    'Bill C-48 (2019) bans crude tankers over 12,500 tonnes from BC\'s north coast — from the northern tip of Vancouver Island to the Alaska border.',
    'U.S. tankers heading to/from Alaska continue to transit the same waters under the 1985 voluntary Tanker Exclusion Zone — the moratorium does not apply to them.',
    'The Act killed two proposed pipelines: Northern Gateway (Enbridge) and Eagle Spirit (a 35-First-Nation Indigenous-led proposal).',
    'Canada imports approximately 10.7% of its crude oil supply from Saudi Arabia (2023), plus volumes from the U.S., Nigeria, and others.',
    'Irving Oil\'s Saint John refinery — the largest in Canada at 320,000+ bpd — has historically processed 63,000-127,000 bpd of Saudi crude.',
    'Energy East — the cancelled 4,500 km Alberta-to-NB pipeline that would have moved 1.1 million bpd of domestic crude east — was killed by TransCanada in October 2017 citing regulatory delays.',
    'The Trans Mountain Expansion (TMX, completed May 2024, 890,000 bpd) gives Alberta oil access to the Pacific via the southern BC coast — but not the northern coast Bill C-48 protects.',
  ],
  smartBrevity: {
    bigThing:
      'Canada has banned its own large crude tankers from the BC north coast (Bill C-48, 2019). It has not stopped U.S. tankers from passing the same waters between Alaska and the continental U.S. Meanwhile, Eastern Canada\'s largest refinery imports Saudi crude because the Alberta-to-NB pipeline that would have replaced it was cancelled in 2017.',
    whyItMatters:
      'The combined effect is that Canadian-produced oil cannot move freely within Canada\'s own coastal and pipeline infrastructure, while equivalent oil from foreign producers — including jurisdictions with significant human-rights concerns — continues to land at Canadian ports via foreign-flagged tankers. The policy architecture protects coastal waters from Canadian oil but not from foreign oil.',
    goDeeper: [
      'Bill C-48: bans >12,500 tonne crude tankers from BC north coast.',
      'Geography: northern Vancouver Island (50°28′N) to Alaska border, including Hecate Strait, Dixon Entrance, Haida Gwaii.',
      'Tanker Exclusion Zone (1985): voluntary buffer for U.S. tankers, keeps them offshore but allows transit.',
      'Cancelled pipelines: Northern Gateway (Enbridge), Eagle Spirit (Indigenous-led, 35 First Nations).',
      'Energy East: 4,500 km, 1.1M bpd, cancelled October 2017.',
      'Saudi crude imports: ~10.7% of Canadian supply (2023); historically 63K-127K bpd at Irving Saint John.',
      'TMX: completed May 2024, 890K bpd, southern BC coast (not affected by Bill C-48).',
    ],
    yesBut:
      'Atlantic Canadian refineries were originally configured to process light, sweet crude. Alberta\'s bitumen-derived heavy crude requires different refining equipment; switching refineries from one feedstock to another is a multi-year, multi-billion-dollar capital project. The Energy East cancellation reflected both regulatory delay AND the market reality that Atlantic refineries could not have immediately consumed the volume the pipeline would have delivered. The "refinery configuration" caveat is real, not a talking point.',
    bottomLine:
      'On the geography, the facts are unambiguous: Canadian tankers cannot deliver to BC\'s north coast; U.S. tankers can transit it. Saudi tankers can deliver to Atlantic Canada; Albertan oil cannot reach Atlantic Canada by pipeline. Whether the resulting cost — in higher reliance on foreign suppliers, in lost domestic energy revenue, in the symbolic question of whether Canadian energy policy serves Canadian interests — is a fair price for coastal protection is the question Parliament and the public are answering implicitly every year these arrangements remain in force.',
  },
  methodology:
    'Bill C-48 specifics are from the Royal Assent text of the Oil Tanker Moratorium Act (S.C. 2019, c. 26) and the Library of Parliament Legislative Summary (publication 421C48E). Tanker Exclusion Zone history is from Transport Canada\'s 2018 review of the voluntary TEZ. Canadian crude oil import data is from the Canada Energy Regulator\'s Market Snapshots (specifically the "Crude oil imports rose slightly in 2023" snapshot) and Statistics Canada Table 25-10-0090-01. Irving Oil refinery details are from publicly-available company filings and Wikipedia (cross-referenced with industry trade press). Energy East cancellation details are from the October 5, 2017 TransCanada press release, contemporaneous CBC News reporting, and The Globe and Mail coverage. We did not contact Transport Canada, the Canada Energy Regulator, Irving Oil, or TC Energy for this article; the data is from on-record public sources cited at the foot.',
  sections: [
    {
      title: 'What Bill C-48 actually does',
      body: `The Oil Tanker Moratorium Act, passed by Parliament in June 2019 as Bill C-48, prohibits any vessel carrying **more than 12,500 metric tonnes of crude oil or persistent oil as cargo** from stopping, loading, or unloading at any port or marine installation along the northern coast of British Columbia.\n\nThe geographic boundary is precise. The moratorium zone extends from the northern tip of Vancouver Island — specifically 50 degrees 28 minutes north latitude — to the boundary with Alaska. The zone covers Hecate Strait (the body of water between mainland BC and Haida Gwaii), Dixon Entrance (the strait separating Haida Gwaii from southeast Alaska), and the waters surrounding Haida Gwaii itself.\n\nWhat is exempt: tankers carrying less than 12,500 tonnes (smaller fuel deliveries to remote coastal communities are unaffected), and any vessel in transit that is not stopping in the moratorium zone. The Act explicitly does NOT regulate vessels of any nationality that are merely passing through the area without docking.\n\nThe legislative intent, as stated in the Government of Canada\'s 2016 announcement and the 2019 royal-assent process, was to protect the ecologically sensitive waters of BC\'s northern coast — including the spawning grounds of the Pacific salmon runs and the marine habitat of the resident orca, humpback whale, and Steller sea lion populations — from the risk of a major crude-oil spill.`,
    },
    {
      title: 'The Tanker Exclusion Zone — what stops U.S. tankers, and what doesn\'t',
      body: `American oil tankers carrying Alaska North Slope crude to refineries on the West Coast of the continental United States have transited the waters off BC\'s coast for decades. The volume is significant — Alaska\'s North Slope production peaked at over 2 million barrels per day in 1988 and remains above 400,000 barrels per day in 2024. Most of that production is moved to U.S. West Coast refineries by tanker.\n\nThe arrangement that governs U.S. tanker transit through these waters is the **Tanker Exclusion Zone (TEZ)**, a voluntary buffer established in 1985 by the U.S. Coast Guard and Transport Canada. The TEZ asks U.S. tankers to stay a specified distance offshore from the BC coastline (the buffer varies between 25 and 100 nautical miles depending on the section of coast). Tankers complying with the TEZ pass through international waters of the Pacific without ever entering Canadian territorial waters.\n\nThe critical distinction: the TEZ is voluntary, not mandatory; it applies only as a request to keep tankers offshore from BC\'s coast; and it does nothing to limit the volume, frequency, or size of U.S. tankers transiting the area. If an oil-spill incident occurred in the TEZ corridor — which is in international waters but adjacent to BC\'s shoreline — the ecological consequences for the same BC north coast Bill C-48 was designed to protect would be largely identical to those of a spill from a Canadian tanker. The difference is jurisdiction, not consequence.\n\nThe practical result: Canadian large crude tankers are banned from the area. American large crude tankers transit the area on an ongoing, decades-long basis. Both classes of tanker would cause comparable environmental damage in the event of a spill.`,
    },
    {
      title: 'What was killed — Northern Gateway and Eagle Spirit',
      body: `Bill C-48 did not just prohibit a hypothetical future tanker traffic. It eliminated two specific pipeline-to-tanker projects that had been under active development.\n\n**Northern Gateway.** Enbridge\'s proposed 1,177-kilometre pipeline would have moved Alberta oil-sands crude to a marine terminal at Kitimat, BC, for export by tanker to Asian markets. The project had received conditional approval from the federal government in 2014 under the Harper government but faced significant opposition from First Nations and environmental groups. The Trudeau government rejected the project in November 2016, citing Bill C-48 as the policy reason. Construction never began.\n\n**Eagle Spirit.** A 35-First-Nation-led proposal to build a pipeline from Alberta to a marine terminal at Lax Kw\'alaams (just north of Prince Rupert, BC), specifically structured to provide Indigenous nations with majority equity ownership and operational control. The Eagle Spirit consortium argued that Bill C-48 had been imposed without consulting the First Nations along its proposed route — many of whom supported the project specifically because it offered an Indigenous-led pathway to oil-export economic benefit. Eagle Spirit launched a federal-court challenge to Bill C-48 in 2019; the case was ultimately not successful in reversing the moratorium.\n\nThe Indigenous-rights dimension of Bill C-48 is itself contested. Some First Nations (notably the Heiltsuk and Gitga\'at, whose territories Northern Gateway would have crossed) strongly opposed both Northern Gateway and Eagle Spirit on ecological grounds. Other First Nations (notably the Eagle Spirit consortium) supported the projects as economic-sovereignty initiatives. The federal government\'s 2019 passage of Bill C-48 effectively resolved that intra-Indigenous disagreement by legislating one position into law over the other.`,
    },
    {
      title: 'The Eastern Canadian picture — Saudi oil at Saint John',
      body: `Irving Oil\'s refinery in Saint John, New Brunswick is the largest oil refinery in Canada by capacity, processing more than 320,000 barrels per day. Most of its production is exported to the U.S. East Coast (the largest single buyer is the Northeast U.S. gasoline market); some is consumed domestically in Atlantic Canada.\n\nThe Saint John refinery has historically run on a mix of crude sources. Public import records show that Saudi Arabia has supplied between **63,024 barrels per day (2012 low) and 127,630 barrels per day (2018 high)** to Saint John. Other historic suppliers have included the United States (light sweet crude from the Bakken and Eagle Ford), Norway, Nigeria, and Saudi Arabia\'s neighbouring Gulf producers.\n\nQuebec\'s refineries — operated by Suncor in Montreal and Valero in Lévis — receive crude through a combination of the Enbridge Mainline pipeline (which moves Western Canadian and U.S. domestic crude from Sarnia to Montreal) and tanker imports at the Saint-Romuald terminal. The Enbridge Mainline reversed its flow direction in 2015 (after a 14-year campaign by Quebec refiners) to allow Western Canadian crude to reach Montreal; before 2015, the flow was the opposite direction, and Quebec refineries were almost entirely dependent on imports.\n\nIn aggregate, the Canada Energy Regulator reports that **Canadian crude oil imports rose in 2023 for the first time since 2019** — driven primarily by Atlantic refinery demand. The 2023 import mix: approximately 60% from the United States (a mix of U.S. domestic and re-exported third-country crude), approximately 11% from Saudi Arabia, and the remainder from Nigeria, Norway, and other producers.`,
    },
    {
      title: 'The pipeline that would have connected them — Energy East',
      body: `Energy East was a proposed 4,500-kilometre crude oil pipeline that would have moved up to 1.1 million barrels per day of Western Canadian crude from Alberta and Saskatchewan to refineries in Quebec and New Brunswick, with an export terminal at Saint John. The project route was: Alberta → Saskatchewan → Manitoba → Ontario → Quebec → New Brunswick.\n\nThe project was proposed by TransCanada (now TC Energy) in 2013. It was specifically designed to address the Eastern Canadian refinery situation: Quebec and Atlantic refineries would have received Albertan crude instead of, or in addition to, imports from Saudi Arabia and other foreign suppliers. The Saint John terminal would have allowed export to Atlantic markets, expanding the Canadian oil industry\'s geographic reach.\n\nOn October 5, 2017, TransCanada cancelled Energy East. The company\'s announcement cited "existing and likely future delays resulting from the regulatory process, the associated cost implications and the increasingly challenging issues and obstacles." The immediate trigger was the National Energy Board\'s 2017 decision to expand the scope of its Energy East review to include upstream and downstream greenhouse-gas emissions — a methodological change that significantly increased the regulatory burden and uncertainty around project approval.\n\nThe broader context included: declining global oil prices (the 2014-2017 price collapse), the simultaneous revival of Keystone XL under the Trump administration (which competed for TransCanada\'s capital allocation), strong opposition from Quebec municipalities and environmental groups, and an evolving federal political environment that the project\'s backers described as less supportive of new oil pipelines.\n\nEnergy East was the single most consequential pipeline-cancellation decision of the past decade for the question this article addresses. Had it proceeded, the Saint John refinery and the Quebec refineries would have received Albertan crude instead of, in significant part, Saudi crude. The market reality without Energy East is the market reality this article describes.`,
    },
    {
      title: 'The Trans Mountain Expansion — what it does and doesn\'t change',
      body: `In May 2024 — five years after Bill C-48 became law — the Trans Mountain Expansion (TMX) project entered commercial operation. TMX nearly tripled the capacity of the existing Trans Mountain pipeline (which has operated since 1953), bringing combined system capacity to approximately 890,000 barrels per day of Albertan crude reaching the Pacific Coast at the Westridge Marine Terminal in Burnaby, BC.\n\nTMX is the Canadian oil industry\'s primary new tidewater access in over a decade. It allows Albertan oil to reach Pacific Rim export markets (primarily Asian refineries) for the first time at scale. The economic effect has been visible in the price differential between Western Canadian Select (WCS) crude and U.S. West Texas Intermediate (WTI): the WCS-to-WTI discount has narrowed since TMX entered service, reflecting that Western Canadian producers now have an alternative to selling everything into the U.S. Midwest.\n\nWhat TMX does NOT do, with respect to the geography Bill C-48 covers:\n- TMX terminates at Burnaby, on the southern BC coast — at the head of the Burrard Inlet, well south of the Bill C-48 moratorium zone.\n- TMX tankers depart from Westridge southward through the Strait of Georgia and Juan de Fuca Strait, then south along the U.S. Pacific coast. They do not enter the BC north coast.\n- TMX does not change Eastern Canadian refinery economics. Albertan crude moving via TMX goes to Pacific Rim export markets, not to Quebec or Atlantic Canada.\n\nIn other words: TMX restored Western Canadian access to one marine terminal (Westridge) but did not reverse Bill C-48\'s impact on the northern BC coast, did not change Eastern Canadian refinery feedstock economics, and did not reduce Atlantic Canada\'s reliance on imported Saudi crude.`,
    },
    {
      title: 'The honest "yes but" — refinery configuration is real',
      body: `One factual nuance matters before concluding. Atlantic Canadian refineries — and to a lesser extent Quebec\'s refineries — were originally configured for **light, sweet crude**: oil that is low in sulfur and low in carbon density (lighter molecules). Alberta\'s bitumen-derived oil-sands product is a **heavy, sour crude**: high sulfur, high carbon density, requiring specific refining equipment (coker units, hydrotreaters, additional desulfurization capacity).\n\nA refinery that was built for light sweet crude cannot simply substitute heavy sour crude into its existing process equipment. The chemistry doesn\'t work, the yields are wrong, the equipment fouls.\n\nSwitching a refinery from one feedstock category to another is a multi-year, multi-billion-dollar capital project. Even if Energy East had been built and delivered Albertan crude to Saint John in 2020, the Irving refinery could not have processed 320,000 bpd of heavy sour crude without significant retooling.\n\nThis is the honest qualifier on the "Eastern Canada imports Saudi oil while domestic oil sits unused" framing. The Eastern refineries import light sweet crude (from Saudi Arabia, the U.S. Bakken, Nigeria, and Norway) because that is what their existing equipment is configured to process. Some Albertan production — specifically, conventional light crude from the Saskatchewan and southern Alberta fields, NOT the heavy oil-sands product — could have substituted directly. The volumes available from those Western Canadian light-crude basins are smaller than Energy East would have moved, but they are non-trivial.\n\nThe honest version of the story is therefore: Energy East could have moved a meaningful volume of Western Canadian light crude to Atlantic refineries directly. It could have moved heavy crude to a Saint John deepwater terminal for export to refineries elsewhere that ARE configured for heavy sour. Either way, the cancellation foreclosed both options.`,
    },
    {
      title: 'The bottom line',
      body: `The geography that emerges from the policy architecture:\n\n- **British Columbia north coast** — closed to large Canadian crude tankers (Bill C-48). Open to U.S. Alaska tankers passing through the voluntary TEZ.\n- **British Columbia south coast** — open via TMX to Asian export markets. Receiving tanker traffic at Westridge.\n- **Alberta-to-east overland route** — Energy East cancelled 2017. No replacement proposal active in 2026.\n- **Quebec refineries** — receive partial Western Canadian crude via reversed Enbridge Mainline (since 2015) plus tanker imports.\n- **Atlantic refineries** — receive primarily imported crude: U.S., Saudi Arabia, Nigeria, Norway. Roughly 60-70% imports at Irving Saint John.\n\nThe policy result: Albertan oil reaches the Pacific Ocean (via TMX) and the U.S. Midwest (via existing pipelines) but cannot reach Atlantic Canada\'s deepwater ports overland. Saudi oil reaches Atlantic Canada via tanker. American oil reaches every part of Canada because the existing pipeline network was built for U.S.-Canada trade, not for inter-provincial Canadian flow.\n\nWhether this is the right policy mix for Canada — given the geopolitical concerns about Saudi crude, the economic loss to Western Canadian producers, the ecological-protection benefits in the BC north, and the realistic alternative pipeline-and-refinery configurations — is the open question for the public and Parliament. What the geography itself does not allow is the dismissive framing that this is a "non-issue" or that Bill C-48 is a routine environmental measure with no broader trade-offs.`,
    },
  ],
  sources: [
    {
      label: 'Oil Tanker Moratorium Act (S.C. 2019, c. 26) — Royal Assent text',
      url: 'https://www.parl.ca/DocumentViewer/en/42-1/bill/C-48/royal-assent',
    },
    {
      label: 'Library of Parliament — Legislative Summary of Bill C-48 (publication 421C48E)',
      url: 'https://lop.parl.ca/sites/PublicWebsite/default/en_CA/ResearchPublications/LegislativeSummaries/421C48E',
    },
    {
      label: 'Oil Tanker Moratorium Act — Wikipedia (cross-referenced with primary sources)',
      url: 'https://en.wikipedia.org/wiki/Oil_Tanker_Moratorium_Act',
    },
    {
      label: 'Transport Canada — Tanker Exclusion Zone history and review',
      url: 'https://tc.canada.ca/en/marine-transportation/marine-safety/voluntary-tanker-exclusion-zone',
    },
    {
      label: 'Canada Energy Regulator — Crude oil imports rose slightly in 2023, for the first time since 2019',
      url: 'https://www.cer-rec.gc.ca/en/data-analysis/energy-markets/market-snapshots/2024/market-snapshot-crude-oil-imports-rose-slightly-2023-first-time-since-2019.html',
    },
    {
      label: 'Statistics Canada — Crude oil imports by country of origin (Table 25-10-0090-01)',
      url: 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=2510009001',
    },
    {
      label: 'Irving Oil Refinery — Wikipedia (cross-referenced with company filings)',
      url: 'https://en.wikipedia.org/wiki/Irving_Oil_Refinery',
    },
    {
      label: 'TC Energy — Termination announcement for Energy East and Eastern Mainline (October 5, 2017)',
      url: 'https://www.tcenergy.com/announcements/2017/2017-10-05-transcanada-anounces-termination-of-energy-east-pipeline-and-eastern-mainline-projects/',
    },
    {
      label: 'CBC News — TransCanada kills Energy East pipeline',
      url: 'https://www.cbc.ca/news/business/transcanada-energy-east-1.4338227',
    },
    {
      label: 'Trans Mountain Corporation — TMX entry into commercial operation (May 2024)',
      url: 'https://www.transmountain.com/news/2024/trans-mountain-expansion-project-enters-commercial-operation',
    },
    {
      label: 'Eagle Spirit Energy — Federal Court challenge to Bill C-48',
      url: 'https://www.eaglespiritenergy.com/',
    },
    {
      label: 'Canada Action — Why Was the Energy East Pipeline Cancelled?',
      url: 'https://www.canadaaction.ca/energy-east-pipeline-cancellation-facts',
    },
    {
      label: 'Globe and Mail — TransCanada kills controversial Energy East pipeline project',
      url: 'https://www.theglobeandmail.com/report-on-business/industry-news/energy-and-resources/transcanada-kills-controversial-energy-east-pipeline-project/article36498370/',
    },
  ],
};
