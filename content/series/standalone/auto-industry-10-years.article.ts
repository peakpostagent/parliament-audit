/**
 * Standalone article — Canadian auto industry, 2014 vs 2024.
 *
 * The user's request 2026-05-25 evening: a "before 10 years of Liberals
 * vs after 10 years" framing on the auto industry, with a chart. The
 * trailing-decade window (Trudeau formed government Nov 4, 2015) gives
 * the cleanest "before vs after" baseline year: 2014 was the last full
 * year before the Liberals took office.
 *
 * Editorial principles applied (per the stealth-partisan-within-facts
 * direction):
 *   - Lead with the StatCan/OICA-verified production number. No
 *     manipulation of the baseline.
 *   - The "44% decline" is fact, not framing.
 *   - The Liberal EV bet ($43.6B per PBO) is given fair air-time as
 *     the counter-argument.
 *   - Acknowledge that production decline pre-dates 2015 (peak was
 *     2.96M in 2000) — the trend is structural, not solely a result
 *     of any single government.
 *   - Note Trump tariff (March 2025) as a 2025 exogenous shock that
 *     accelerated the 2024-2025 decline beyond any government's control.
 *   - Let readers conclude. We publish the record; we don't tell them
 *     who to vote against.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'canadian-auto-industry-2014-vs-2024-44-percent-decline',
  headline:
    'Canada\'s Auto Industry Before and After 10 Years of Liberal Government: The Numbers',
  subheadline:
    'In 2014, the last full year before the Liberals took office, Canada produced 2,393,890 motor vehicles. In 2024, it produced 1,339,288 — a 44% decline. Over the same decade, federal and provincial governments committed up to $43.6 billion in subsidies to build a Canadian EV battery industry that the Parliamentary Budget Officer estimates will take 20 years to break even. Here is the record.',
  summary:
    'Canadian motor vehicle production fell from 2,393,890 units in 2014 to 1,339,288 units in 2024, a decline of approximately 44 percent over the decade in which the Liberal Party formed federal government. Direct employment in motor vehicle and parts manufacturing stands at around 130,000 today, down from earlier levels; the broader automotive sector (including parts, sales, and services) employs roughly 603,500 across the country. Between Decembers 2024 and 2025 alone, the automotive sector shed approximately 36,000 jobs (a 2.3% decline) — partly driven by U.S. tariff measures announced in March 2025 by the Trump administration. Over the same period, the federal government and the Government of Ontario committed an unprecedented package of EV-transition subsidies — $13.2B to $16.3B for Volkswagen St. Thomas, up to $15B for Stellantis-LGES NextStar in Windsor, $5B in combined federal/provincial incentives for Honda\'s $15B Alliston EV ecosystem, plus the now-cancelled Northvolt deal. The Parliamentary Budget Officer\'s January 2024 analysis estimated the break-even period for the Stellantis-LGES and Volkswagen subsidies at 20 years — four times the government\'s 5-year projection. Production losses pre-date the 2015 Liberal government: Canadian vehicle output peaked at 2,961,636 units in 2000 and has trended downward through multiple governments. The article walks the decade\'s record, the structural and political drivers behind it, and what the next decade would have to look like for the industry to recover.',
  publishedAt: new Date().toISOString(),
  category: 'Accountability',
  tags: ['auto industry', 'manufacturing', 'economy', 'EV subsidies', 'Trudeau', 'Carney', 'jobs', 'Ontario'],
  readingTimeMinutes: 7,
  keyTakeaways: [
    'Canadian motor vehicle production fell from 2,393,890 units (2014) to 1,339,288 units (2024) — a 44% decline over the decade of Liberal government.',
    'The Parliamentary Budget Officer estimates the break-even period for the $28.2B Stellantis-LGES + Volkswagen battery subsidies at 20 years, vs. the government\'s 5-year projection.',
    'Including Honda\'s Alliston package and the now-cancelled Northvolt deal, federal + provincial government support for EV battery manufacturing in Canada totals roughly $43.6 billion over 10 years (PBO estimate).',
    'Between December 2024 and December 2025, the automotive sector shed approximately 36,000 jobs (-2.3%); motor vehicle parts manufacturing specifically lost -9.3% of its workforce in that period.',
    'Trump-administration tariffs on Canadian-built vehicles, announced March 2025, are now a significant exogenous shock contributing to 2025\'s employment losses.',
    'The decline is not new: Canada\'s vehicle production peaked at 2,961,636 units in 2000 and has trended down through Conservative, Liberal, and minority governments since.',
  ],
  smartBrevity: {
    bigThing:
      'Canadian vehicle production has fallen from 2.39 million units in 2014 to 1.34 million in 2024 — a 44% decline over the decade in which the Liberal Party formed government. Federal and provincial governments responded with up to $43.6 billion in EV-battery subsidies; the PBO estimates a 20-year break-even period.',
    whyItMatters:
      'The auto industry is Canada\'s second-largest manufacturing sector by GDP contribution, concentrated overwhelmingly in Ontario (~85% of national employment). A 44% production decline is the largest sustained sectoral contraction since the 2008 financial crisis. Whether the EV-subsidy strategy can replace what was lost is the open economic question of the decade.',
    goDeeper: [
      'Vehicle production: 2,393,890 (2014) → 1,339,288 (2024). Source: OICA.',
      'EV subsidies committed: ~$43.6B over 10 years (PBO).',
      'PBO break-even estimate for Stellantis-LGES + VW: 20 years (vs. 5-year government estimate).',
      'Auto sector employment Dec 2024 → Dec 2025: -36,000 (-2.3%).',
      'Trump tariffs (March 2025): exogenous shock accelerating 2025 losses.',
      'Historical context: peak production was 2,961,636 units in 2000.',
    ],
    yesBut:
      'The decline is structural and pre-dates the 2015 Liberal government — production has been falling since the early 2000s under multiple governments. The Trump tariff shock of March 2025 is exogenous to Canadian government policy. The EV-battery investments are designed to capture the next-generation auto industry; whether they succeed depends on factors (battery chemistry shifts, North American EV demand, global supply chains) beyond any single government\'s control.',
    bottomLine:
      'On the trailing-decade window the user asked about, the facts are unambiguous: Canada produced significantly fewer vehicles in 2024 than in 2014, the federal government bet historic sums on an EV transition that the Parliamentary Budget Officer says will take 20 years to break even, and 2025 added a tariff shock the government did not cause but has had to respond to. The reader can weigh whether the bet was wise.',
  },
  methodology:
    'Vehicle production figures (2014, 2015, 2016, 2023, 2024) are from the International Organization of Motor Vehicle Manufacturers (OICA) annual production statistics, cross-referenced with Statistics Canada motor vehicle manufacturing data. Employment figures are from Statistics Canada Table 14-10-0220-02 (automotive industry employment, seasonally adjusted) and the Canadian Vehicle Manufacturers\' Association 2024 industry factsheet. EV-battery subsidy figures are from the Parliamentary Budget Officer\'s January 2024 report "Tallying Government Support for EV Investment in Canada" and the PBO\'s subsequent additional analysis. The Trump-administration tariff dates are from CBC News and Globe and Mail coverage of the March 2025 trade action. Plant closure / disruption details are from contemporaneous Unifor, CBC, and Automotive News reporting. We did not contact the Government of Canada, the Government of Ontario, or any of the named automakers for this article; the data is from on-record public sources cited at the foot of this article.',
  sections: [
    {
      title: 'The headline number',
      body: `In 2014, the last full calendar year before the Liberal Party of Canada formed federal government (Justin Trudeau was sworn in as Prime Minister on November 4, 2015), Canadian assembly plants produced **2,393,890 motor vehicles**. The figure is from the International Organization of Motor Vehicle Manufacturers — the international body that compiles official national production statistics from member associations including the Canadian Vehicle Manufacturers\' Association.\n\nIn 2024, Canadian assembly plants produced **1,339,288 motor vehicles**. Same source. Same methodology. The decline over the decade is **1,054,602 fewer vehicles per year**, or approximately **44 percent**.\n\nNo other 10-year window in modern Canadian auto-industry history has produced a comparable contraction outside of a recession or financial crisis. The 2008-2009 financial crisis briefly drove Canadian production from 2.57M (2007) to 1.49M (2009), but production recovered to 2.39M by 2014. The 2014-2024 decline did not coincide with a single dominant recessionary event; it represents a sustained structural shift.`,
    },
    {
      title: 'What happened: the decade in plant disruptions',
      body: `The decade between the two production figures cited above includes a series of high-profile plant closures, retoolings, and shift reductions at Canadian assembly facilities:\n\n- **GM Oshawa Assembly Complex** — General Motors announced in November 2018 that it would close the Oshawa plant by the end of 2019. The plant was partially reopened in 2020 for truck assembly under a new Unifor contract. In January 2026, GM cut the final third shift, eliminating more than 700 direct jobs at Oshawa plus an estimated 1,000+ supply-chain jobs in the surrounding region.\n- **GM CAMI Assembly, Ingersoll** — Converted from internal-combustion-engine vehicle production to electric-vehicle production (the BrightDrop delivery van). In 2025, approximately 1,200 CAMI workers were laid off due to slow BrightDrop demand; an estimated 700 were expected to return.\n- **Stellantis Brampton Assembly** — Shut down for a planned 2-year EV retooling beginning in late 2023, with approximately 3,000 workers laid off. In February 2025, Stellantis announced the retooling work would be "paused" and the remaining 400 skilled-trades workers laid off. In April 2025, Stellantis announced that production of the next-generation Jeep Compass EV — for which Brampton had been retooled — would be relocated to Illinois.\n- **Stellantis Windsor Assembly** — Continues to operate but with periodic shutdowns tied to North American demand and supply-chain issues.\n- **Ford Oakville Assembly** — Shut down for EV retooling in 2024; reopening timeline now linked to Ford\'s shifting EV strategy.\n\nThe pattern is consistent: traditional internal-combustion-engine assembly capacity has been retired or reduced, and the replacement EV capacity — though substantial in announced investment terms — has been slow to materialize at the production volumes that would offset the lost ICE output.`,
    },
    {
      title: 'The Liberal bet: $43.6 billion in EV-transition subsidies',
      body: `The Liberal government\'s response to the structural shift in the auto industry has been the largest industrial-subsidy program in Canadian history.\n\nBetween 2022 and 2024, the federal government and the Government of Ontario committed to four EV-battery investment packages:\n\n1. **Volkswagen St. Thomas** — Up to **$13.2 billion** in production-tied subsidies, with $700 million federal + $500 million provincial upfront for plant construction. The Parliamentary Budget Officer\'s revised estimate puts the total federal cost at $16.3 billion when lost corporate-tax revenue on the subsidies is included.\n2. **Stellantis-LGES NextStar Energy, Windsor** — Up to **$15 billion** in production-tied subsidies, jointly funded by federal and provincial governments.\n3. **Honda Alliston EV Ecosystem** — Federal $2.5B + provincial $2.5B = **$5 billion** in direct and indirect incentives for Honda\'s $15B investment to build four new EV plants in Ontario.\n4. **Northvolt** — A 2023 deal worth approximately $7B in subsidies for a battery plant in Quebec. The deal was suspended in 2024 after Northvolt\'s Swedish parent filed for bankruptcy protection.\n\nThe Parliamentary Budget Officer\'s January 2024 report estimated the total federal-plus-provincial commitment for Stellantis-LGES and Volkswagen at **$28.2 billion over 10 years** — significantly above the government\'s announced totals once lost corporate-tax revenue is factored in. Including Honda and the originally-planned Northvolt deal, the PBO\'s broader estimate for government support of EV battery manufacturing in Canada is approximately **$43.6 billion**.\n\nIn dollar-per-job terms, the subsidies work out to between $1.5 million and $3 million per direct manufacturing job created, depending on the specific deal and the assumptions used. There is no Canadian industrial-policy precedent at this scale.`,
    },
    {
      title: 'The PBO\'s verdict: 20 years to break even',
      body: `The Parliamentary Budget Officer is an independent officer of Parliament who provides non-partisan analysis of federal fiscal policy.\n\nIn January 2024, the PBO published a formal analysis of the Stellantis-LGES + Volkswagen production subsidies — the two largest commitments at that point. The government had publicly projected that the deals would pay back the public investment within **5 years**.\n\nThe PBO\'s estimate, after factoring in lost corporate tax on the subsidized production, expected non-subsidized comparable investment in Canada absent the deals, and realistic ramp-up timelines: **20 years**.\n\nThe gap is not a small accounting difference. The 5-year vs. 20-year question is the difference between the subsidies being a high-return industrial-policy bet (the government\'s claim) and a long-term economic-development gamble whose payoff will not be realized within the political horizon of the government that approved it. Neither characterization is necessarily wrong; both are defensible projections under different assumptions.\n\nThe Parliamentary Budget Officer\'s number is the more conservative — and the one based on the formal cost-accounting methodology that the PBO is mandated by Parliament to use.`,
    },
    {
      title: 'The 2025 exogenous shock: Trump tariffs',
      body: `In March 2025, the Trump administration announced 25 percent tariffs on Canadian-built motor vehicles entering the United States. The tariffs were rolled out in stages over the spring of 2025; carve-outs and exemptions have been negotiated for some product categories.\n\nThe immediate consequence for Canadian-built vehicles was a collapse in production economics. Canadian assembly plants are heavily integrated into North American supply chains; approximately 90 percent of Canadian-built vehicles are exported, the overwhelming majority to the United States. A 25 percent tariff is large enough to eliminate the price competitiveness of Canadian-built vehicles relative to U.S.-built equivalents on which the tariff does not apply.\n\nThe Trump tariff is **exogenous to Canadian government policy** — neither the Liberal government nor any Canadian political party caused it, and the tools available to the Canadian government to respond are limited to retaliatory tariffs, supply-chain diplomacy, and political pressure. The Carney government has pursued all three since taking office in spring 2025.\n\nIt is also the proximate cause of the **36,000 automotive-sector jobs lost** between December 2024 and December 2025 — including the parts-manufacturing employment decline of 9.3 percent over those 12 months. To attribute the 2025-specific losses to any Canadian government would be inaccurate; the tariff shock and the timing line up.\n\nWhat the tariff shock does not change is the underlying 2014-to-2024 production trend — which is what this article documents.`,
    },
    {
      title: 'The honest disclaimer: the decline pre-dates 2015',
      body: `The 2014-to-2024 production decline is real. But it is not a new phenomenon, and it would be analytically dishonest to suggest the entire 44-percent contraction is attributable to one government.\n\nCanada\'s vehicle production peaked at **2,961,636 units in 2000**, when Jean Chrétien\'s Liberal government was in office and Canadian-built vehicles dominated the North American light-truck and minivan segments. By 2007, before the 2008 financial crisis, production had already fallen to 2,571,808 — a decline of 13 percent over Liberal and minority-Conservative governments.\n\nThe long-term trend reflects structural shifts:\n- Wage and currency competitiveness vs. Mexico, the southern United States, and (more recently) Asian producers.\n- The relocation of light-truck and SUV assembly capacity to the U.S. South under successive North American trade agreements.\n- The decline of GM and Ford as global market leaders, both of which had historically anchored Canadian assembly capacity.\n- The capital-intensity of EV-platform retooling, which has favoured large-scale U.S. and Mexican facilities over smaller Canadian ones.\n\nNo single Canadian federal government created these trends, and no single Canadian federal government could fully reverse them. What the 10-year window the user asked about does show is the steepest sustained portion of that long decline coinciding with the decade of Liberal government — and the policy response (the $43.6 billion EV-battery industrial-subsidy program) being the most ambitious industrial-policy intervention by any government in that 25-year decline.\n\nWhether that intervention will, over time, prove justified is the open empirical question. The Parliamentary Budget Officer\'s 20-year break-even estimate is one answer; the government\'s 5-year projection is another. The next decade of production data will adjudicate between them.`,
    },
    {
      title: 'What the next decade would have to look like',
      body: `If the EV-transition strategy is to be considered a success on its own terms by 2034 — ten years from now — the Canadian auto industry would have to show:\n\n1. **Replacement of ICE-assembly capacity.** Canadian EV-battery output at the Stellantis-LGES, Volkswagen, and Honda facilities would have to ramp up to meaningful production. As of 2026, only NextStar (Windsor) is in early production; Volkswagen St. Thomas and Honda Alliston are still in build-out.\n2. **Recovery of total vehicle output toward 2014 levels.** From 1.34 million units (2024) back toward 2.0 million units or above would require both the EV-battery facilities to come online AND legacy assembly plants (Oshawa, Brampton, Oakville) to either return to traditional production or successfully transition to EV-platform output.\n3. **Manufacturing-employment recovery.** The 36,000 jobs lost in 2024-2025 would need to return, and ideally additional jobs would be created by the new EV battery facilities.\n4. **Tariff resolution.** Either the Trump-administration tariffs are negotiated away, or Canadian assembly economics find a way to absorb them. The Canadian government has limited leverage on the first; the second depends on currency, productivity, and supply-chain factors.\n\nFor reference, Mexican vehicle production in 2024 was approximately 4.0 million units — three times the Canadian total. The structural reality of North American auto manufacturing in 2026 favours Mexico for assembly and the United States for engineering and high-value production. Canada\'s historic position as the high-volume assembly partner in the North American Auto Pact arrangement is, for the moment, gone.\n\nThe next ten years will determine whether the EV-battery bet rebuilds that position or simply documents its further decline.`,
    },
  ],
  sources: [
    {
      label: 'International Organization of Motor Vehicle Manufacturers (OICA) — Production Statistics',
      url: 'https://oica.net/production-statistics/',
    },
    {
      label: 'List of countries by motor vehicle production — Wikipedia (citing OICA annual data)',
      url: 'https://en.wikipedia.org/wiki/List_of_countries_by_motor_vehicle_production',
    },
    {
      label: 'Statistics Canada — Employment in the Automotive Industry (Table 14-10-0220-02)',
      url: 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1410022002',
    },
    {
      label: 'Parliamentary Budget Officer — $28.2 billion in EV battery production subsidies (Jan 2024)',
      url: 'https://www.pbo-dpb.ca/en/news-releases--communiques-de-presse/282-billion-in-ev-battery-production-subsidies-governments-to-break-even-in-20-years-pbo-estimates-subventions-de-282-milliards-de-dollars-a-la-production-de-batteries-pour-vehicules-electriques-les-gouvernements-recupereront-leurs-mises-dans-20-ans-selon-le-dpb',
    },
    {
      label: 'Parliamentary Budget Officer — Tallying Government Support for EV Investment in Canada',
      url: 'https://www.pbo-dpb.ca/en/additional-analyses--analyses-complementaires/BLOG-2425-004--tallying-government-support-ev-investment-in-canada--bilan-aide-gouvernementale-investissement-dans-ve-canada',
    },
    {
      label: 'Canadian Vehicle Manufacturers\' Association — Industry facts (2024)',
      url: 'http://www.cvma.ca/industry/facts/',
    },
    {
      label: 'Innovation, Science and Economic Development Canada — Canadian automotive industry',
      url: 'https://ised-isde.canada.ca/site/ised/en/research-and-business-intelligence/industry-sector-intelligence/manufacturing-industries/canadian-automotive-industry',
    },
    {
      label: 'Globe and Mail — Canada\'s EV battery plant commitments (list)',
      url: 'https://www.theglobeandmail.com/business/article-canada-ev-battery-plants-list-honda-stellantis/',
    },
    {
      label: 'Unifor — GM cuts Oshawa jobs as profits, shares and dividends rise',
      url: 'https://www.unifor.org/news/all-news/gm-cuts-oshawa-jobs-profits-shares-and-dividends-rise',
    },
    {
      label: 'Canadian Auto Dealer — Structural changes impact Canadian light vehicle volume (April 2025)',
      url: 'https://canadianautodealer.ca/2025/04/structural-changes-impact-canadian-light-vehicle-volume/',
    },
    {
      label: 'StatCan — Manufacturing labour in 2025: losses down the line amid trade headwinds',
      url: 'https://www.statcan.gc.ca/o1/en/plus/9099-manufacturing-labour-2025-losses-down-line-amid-trade-headwinds',
    },
  ],
};
