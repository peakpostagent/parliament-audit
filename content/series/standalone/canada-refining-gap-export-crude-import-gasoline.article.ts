/**
 * Standalone — Canada's refining gap: we produce 6.1M barrels a day,
 * can refine 1.9M, export 98% of crude to the U.S. (which now tariffs
 * it), and in B.C. literally buy our own oil back as gasoline.
 *
 * Operator hook 2026-06-11: "why we don't have any fuel refinery or
 * very little so we ship our oil south then have it shipped back as
 * fuel for cars. Seems crazy especially during a trade war, as well
 * as how much extra carbon it takes to ship the oil there and back."
 *
 * Editorial floor:
 *   - Canada DOES have refineries (14, ~1.9M b/d) — the accurate
 *     framing is the gap between production and refining, the 40-year
 *     construction drought, and the buy-back loop. The article corrects
 *     the "no refineries" folk version explicitly and early.
 *   - The B.C.–Washington loop is the documented anchor: ~145k b/d of
 *     Alberta crude to Washington refineries, gasoline/jet fuel shipped
 *     back to Vancouver (Oil Sands Magazine; figure dated mid-2010s and
 *     labelled as such). Cherry Point runs on Alaska + Trans Mountain
 *     crude; largest share of Washington's exported refined product
 *     goes to B.C.
 *   - Carbon point made honestly: the round trip adds transport
 *     emissions, but transport is a modest share of lifecycle oil
 *     emissions vs combustion/extraction — the stronger documented
 *     critique is economic (value-added + the WCS discount). We say so.
 *   - Counter-case included: Tombe/MLI comparative-advantage argument,
 *     Sturgeon's $5.7B→$10B overrun as the cautionary tale.
 *   - Trade-war facts: 10% U.S. tariff on Canadian crude during the
 *     2025-26 trade war; 3.9M b/d exported to U.S. in 2025; 98% of
 *     crude exports U.S.-bound in 2024. Carney-Alberta pipeline MOU +
 *     Poilievre energy-corridor positions both reported.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'canada-refining-gap-export-crude-import-gasoline',
  headline: 'Canada Pumps 6.1 Million Barrels a Day and Can Refine 1.9 Million. B.C. Sends Crude to Washington State — and Buys It Back as Gasoline. During a Trade War.',
  subheadline:
    'Canada is the world\'s fourth-largest oil producer and hasn\'t built a major new refinery since 1984. We export 98% of our crude to one customer — the United States, which now tariffs it at 10% — much of it at a structural discount, and then re-import refined gasoline, diesel, and jet fuel. The British Columbia loop is the starkest version: Alberta crude flows down the Trans Mountain pipeline to Washington State refineries, and tankers carry the gasoline back to Vancouver. Here is the documented anatomy of the refining gap — including the honest economics of why it exists.',
  summary:
    'Canada produced about 6.1 million barrels of oil per day in 2025. Its 14 refineries can process about 1.9 million barrels per day and ran at roughly 90% of that capacity. The arithmetic gap defines the system: roughly 4 million barrels a day leave the country as crude, 98% of it to the United States (2024), where Gulf Coast and Midwest refineries — built specifically to process heavy oil — capture the refining margin. During the 2025-26 trade war, the United States imposed a 10% tariff on Canadian crude, taxing the very flow Canada depends on. Meanwhile Canada re-imports refined products, and Ontario and Quebec refineries now source their imported crude almost entirely (99%+) from the United States. The most vivid loop is British Columbia\'s: Alberta crude moves via Trans Mountain to Washington State refineries (BP Cherry Point runs substantially on Alaskan and Canadian crude), and the largest share of Washington\'s exported refined product ships right back to B.C. — a figure documented at roughly 145,000 barrels per day of crude south and gasoline/jet fuel north in the mid-2010s. No major Canadian refinery has been built since 1984; the one attempt, Alberta\'s Sturgeon Refinery (2017-2020), ballooned from $5.7 billion to roughly $10 billion for just ~80,000 barrels per day, with Alberta taxpayers absorbing a 50% stake plus $25 billion in 30-year processing commitments. Economists like Trevor Tombe argue the market is signalling Canada has no comparative advantage in marginal refining; sovereignty advocates answer that the trade war has repriced the risk of refining dependence on a single foreign customer. The carbon argument the operator class often makes — that the round trip burns extra emissions — is real but modest: transport is a small share of oil\'s lifecycle emissions compared to extraction and combustion. The harder documented cost is economic: the value-added margin, and the Western Canadian Select discount, surrendered every day at the border. Both major federal leaders now propose versions of an answer — Carney\'s "energy superpower" agenda and Alberta pipeline memorandum aimed at Asian markets, Poilievre\'s Canada First National Energy Corridor — and both, notably, are about moving more crude, not refining it.',
  publishedAt: new Date().toISOString(),
  category: 'Accountability',
  tags: ['oil', 'refining', 'energy', 'trade war', 'tariffs', 'Trans Mountain', 'WCS discount', 'Alberta', 'British Columbia', 'cost of living'],
  readingTimeMinutes: 7,
  heroStat: { value: '98%', label: 'of Canadian crude exports went to the U.S. (2024)' },
  faq: [
    {
      question: 'Does Canada have its own oil refineries?',
      answer:
        'Yes — 14 refineries with a combined capacity of about 1.9 million barrels per day, running at roughly 90% capacity. The issue is scale: Canada produces about 6.1 million barrels per day, so roughly two-thirds of Canadian crude is exported raw, 98% of it to the United States, where the refining value-added is captured. No major new Canadian refinery has been built since 1984.',
    },
    {
      question: 'Why does B.C. buy gasoline from the United States if Canada produces so much oil?',
      answer:
        'British Columbia has very little refining capacity of its own. Alberta crude flows through the Trans Mountain pipeline both to B.C. terminals and onward to Washington State refineries like BP Cherry Point, which run substantially on Alaskan and Canadian crude. Washington then exports refined gasoline and jet fuel — and the largest share of those exports goes back to British Columbia. Mid-2010s figures documented roughly 145,000 barrels per day of Alberta crude going to Washington refineries while Vancouver imported gasoline and jet fuel from the same plants.',
    },
    {
      question: 'Why hasn\'t Canada built a new oil refinery since 1984?',
      answer:
        'Economics, primarily. A new refinery costs $10 billion or more and takes years to build, against a long-term outlook of flat-to-declining gasoline demand. The one recent attempt — Alberta\'s Sturgeon Refinery — ran from a $5.7 billion estimate to roughly $10 billion for only ~80,000 barrels per day, with Alberta taxpayers taking a 50% stake and $25 billion in long-term processing commitments. Economists argue U.S. Gulf Coast refineries, built for heavy crude, simply out-compete any new Canadian plant. The counter-argument — that dependence on a single foreign refiner is a sovereignty risk — gained force when the U.S. imposed a 10% tariff on Canadian crude during the 2025-26 trade war.',
    },
    {
      question: 'How much extra carbon does shipping oil south and gasoline back create?',
      answer:
        'The round trip does add transport emissions — pipeline pumping south and marine shipping north both burn energy. But transport is a modest share of oil\'s lifecycle emissions; the large majority comes from extraction/upgrading and, above all, burning the fuel. The double-handling is real and avoidable, but the strongest documented case against the current arrangement is economic — surrendered refining margins and the discount on Canadian heavy crude — rather than the carbon delta from shipping.',
    },
  ],
  keyTakeaways: [
    'Canada produced ~6.1 million barrels/day in 2025; its 14 refineries can process ~1.9 million.',
    '98% of Canadian crude exports went to the United States (2024); the U.S. took 3.9 million b/d in 2025 — more than from every other country combined.',
    'During the 2025-26 trade war, the U.S. imposed a 10% tariff on Canadian crude — taxing the export flow Canada depends on.',
    'The B.C. loop: Alberta crude → Trans Mountain → Washington State refineries → gasoline and jet fuel tankered back to Vancouver.',
    'Ontario and Quebec refineries import 99%+ of their foreign crude from the U.S.',
    'Canadian heavy crude (WCS) routinely sells at a discount of roughly US$10-20 per barrel below the U.S. benchmark — a structural price cut on a captive export.',
    'No major Canadian refinery built since 1984. The one attempt, Sturgeon (2017-2020), ran $5.7B → ~$10B for ~80,000 b/d; Alberta taxpayers hold 50% plus $25B in 30-year toll commitments.',
    'The carbon cost of the round trip is real but modest next to lifecycle emissions; the surrendered refining margin is the bigger documented cost.',
    'Both Carney (energy superpower, Alberta pipeline MOU toward Asia) and Poilievre (Canada First National Energy Corridor) propose moving more crude — neither proposes refining it.',
  ],
  smartBrevity: {
    bigThing:
      'Canada is the fourth-largest oil producer on Earth and ships two-thirds of its crude raw to a single customer that now tariffs it — then buys some of it back as gasoline. The refining gap is 40 years in the making, and the trade war has turned a market-logic arrangement into a sovereignty problem.',
    whyItMatters:
      'Every barrel exported raw exports the refining margin with it — the jobs, the value-added, and the price control. The Western Canadian Select discount means Canada sells low; the buy-back loop means parts of Canada buy high. During a trade war with the only customer, both ends of that trade are exposed to one government\'s tariff pen — and it isn\'t Ottawa\'s.',
    goDeeper: [
      'Production ~6.1M b/d (2025); refining capacity ~1.9M b/d across 14 refineries; runs ~1.6M b/d.',
      'Exports: 98% U.S.-bound (2024); 3.9M b/d in 2025.',
      'U.S. tariff on Canadian crude during the trade war: 10%.',
      'B.C.: ~145k b/d of Alberta crude to Washington refineries; gasoline/jet fuel shipped back (mid-2010s documented figures).',
      'WCS discount: roughly US$10-20/bbl below WTI in recent years.',
      'Last new major refinery: 1984. Sturgeon Refinery: $5.7B → ~$10B, ~80k b/d, Alberta took 50% + $25B in tolls.',
      'Ontario/Quebec refinery imports: 99%+ from the U.S.',
    ],
    yesBut:
      'The economists\' case against building refineries is serious. Refining is a low-margin, capital-devouring business; U.S. Gulf Coast plants were purpose-built for heavy crude and out-compete any greenfield Canadian plant; long-term fuel demand is flat-to-declining as fleets electrify; and Sturgeon — $10 billion of mostly public money for 80,000 barrels a day — is the cautionary tale, not the model. Trevor Tombe\'s summary: the market is telling Canada it has no comparative advantage in marginal refining. The rebuttal isn\'t economic, it\'s strategic: comparative advantage assumed a customer that doesn\'t weaponize the border. The 10% crude tariff repriced that assumption.',
    bottomLine:
      'Canada\'s refining gap was built by forty years of rational, market-logic decisions that all shared one assumption: permanent, frictionless access to American refineries. The trade war broke the assumption. Whether the answer is new refineries, new pipelines to new customers, or accepting the dependence, the one option no longer on the table is pretending the arrangement is risk-free.',
  },
  methodology:
    'Production, refining capacity, refinery runs, and import sourcing figures are from the Canada Energy Regulator\'s 2026 market snapshot (Canadian crude refinery runs held steady in 2025) and CER provincial profiles: ~6.1 million b/d production (2025), 14 refineries at ~1.9 million b/d capacity, ~1.6 million b/d runs, Quebec crude imports 126 Mb/d (99.99% U.S.), Ontario 87 Mb/d (99.78% U.S.). Export-share figures (98% of crude exports U.S.-bound in 2024; 3.9 million b/d to the U.S. in 2025, exceeding all other U.S. suppliers combined) are from CBC and oil-trade reporting of EIA data during the trade-war coverage. The 10% U.S. tariff on Canadian crude is from contemporaneous trade-war reporting (2025-26). The B.C.-Washington loop is documented in Oil Sands Magazine\'s analysis (~145,000 b/d of Alberta crude to Washington refineries, gasoline and jet fuel imported back to Vancouver; figure dated mid-2010s and labelled as such), Wikipedia/industry profiles of BP Cherry Point (supplied by Alaskan crude and Trans Mountain deliveries), Sightline Institute analysis of Washington refined-product exports (largest share to B.C.), and Salish Current reporting on post-TMX tanker deliveries to Washington. Sturgeon Refinery cost history ($5.7B 2012 estimate, ~$10B final, four years late, Alberta\'s 50% stake and $25B in 30-year processing commitments) is from Globe and Mail, Global News, CBC, and University of Calgary School of Public Policy commentary. The comparative-advantage counter-case is Trevor Tombe\'s, published via The Hub/Macdonald-Laurier Institute. The WCS-WTI differential range is from Canada Energy Regulator and Alberta government price data; it varies with pipeline capacity and is stated as a recent-years range, not a constant. Lifecycle-emissions framing (transport a modest share relative to extraction and combustion) follows standard lifecycle-analysis findings for crude oil. We did not contact CER, CAPP, Trans Mountain, BP, the Alberta government, or any federal party for this article; all data is from on-record public sources cited at the foot.',
  sections: [
    {
      title: 'First, the correction worth making: Canada has refineries — just not nearly enough',
      body: `The folk version of this story — "Canada doesn\'t refine anything" — is wrong, and the accurate version is more damning, not less.\n\nCanada has **14 refineries** with a combined capacity of about **1.9 million barrels per day**, and they run hard — roughly 90% utilization in 2025. Irving\'s Saint John refinery is the country\'s largest; Alberta, Ontario, and Quebec host most of the rest.\n\nThe problem is the other number: Canada **produced about 6.1 million barrels per day** in 2025. Refining capacity covers less than a third of production. The remaining roughly **4 million barrels a day leave the country as crude** — unrefined, with the processing margin, the jobs, and the price leverage travelling with them.\n\nAnd they overwhelmingly leave in one direction: **98% of Canadian crude exports went to the United States in 2024.** In 2025 the U.S. took **3.9 million barrels per day** from Canada — more than it imported from every other country on Earth combined.\n\nOne customer. For two-thirds of the product. During a trade war in which that customer imposed a **10% tariff on Canadian crude.**`,
    },
    {
      title: 'The B.C. loop: selling crude south, buying gasoline back',
      body: `The operator-level version of this story that most offends common sense is real, and British Columbia is where it lives.\n\nB.C. has minimal refining capacity. Its gasoline comes mostly from Alberta — via the Trans Mountain pipeline — and from the **U.S. Pacific Northwest**. Washington State\'s five refineries, led by **BP Cherry Point**, run substantially on Alaskan crude and on **Canadian crude delivered by the Trans Mountain system**; after the pipeline\'s 2024 expansion, tanker deliveries of Canadian oil to Washington jumped from roughly half a million barrels in late 2023 to nearly six million barrels in a single quarter of 2024.\n\nThen the loop closes: Washington\'s refineries export a share of their output, and **the largest share of those exports goes to British Columbia**. Documented mid-2010s figures put the loop at roughly **145,000 barrels per day of Alberta crude going south to Washington refineries, with gasoline and jet fuel shipped back into the Vancouver market** from the same plants.\n\nCanadian oil, refined in another country, sold back to Canadians — with the refining margin, refinery wages, and tax base accruing to Washington State. In a normal trading relationship, that\'s comparative advantage at work. In a trade war, every link of that loop crosses a border controlled by the other side.\n\nThe pattern isn\'t only western. **Ontario and Quebec refineries now source 99%+ of their imported crude from the United States** — efficient in peacetime, single-point-of-failure in a tariff fight. (Eastern Canada\'s import dependence is a story we\'ve covered before, in our BC-tanker-ban piece documenting Saudi crude deliveries to New Brunswick while Canadian tankers are banned from B.C.\'s north coast.)`,
    },
    {
      title: 'Why nobody builds a refinery: forty years of rational decisions',
      body: `No major new refinery has been built in Canada **since 1984** (none in the U.S. since 1976). That isn\'t an accident or a conspiracy — it\'s a sequence of individually rational economics:\n\n- **Capital cost.** A new full-scale refinery is a **$10-billion-plus, decade-long** project.\n- **Demand outlook.** Gasoline demand in developed countries has been flat-to-declining since the 2000s and the long-term forecast — electrification, efficiency — points down. Nobody finances a 40-year asset against a shrinking market.\n- **Competition.** U.S. Gulf Coast and Midwest refineries were purpose-built (with coking capacity) to process exactly the heavy, sour crude the oilsands produce. They are paid for, optimized, and at scale. A greenfield Canadian plant starts the race laps behind.\n- **The cautionary tale.** Alberta tried. The **Sturgeon Refinery** — the first new refinery in Canada in three decades — was pitched at **$5.7 billion in 2012**, rose to $8.5 billion a year later, and landed around **$10 billion**, four years late, for just **~80,000 barrels per day** of capacity. Alberta taxpayers ended up holding a **50% equity stake plus roughly $25 billion in processing-toll commitments over 30 years**. CBC opinion writers called it the "Bitumen Boondoggle"; the University of Calgary\'s School of Public Policy tracked the mounting costs for years.\n\nEconomist Trevor Tombe\'s summary of the orthodox view is worth quoting honestly: the market is telling us Canada **does not have a comparative advantage in refining at the margin** — forcing more domestic refining could shrink the economy, not grow it, when American and Asian refineries do it cheaper.\n\nOn pure peacetime economics, the refinery skeptics have the better numbers. The question 2025-26 raised is whether peacetime economics is still the right frame.`,
    },
    {
      title: 'The trade war repriced the whole arrangement',
      body: `Every rational decision in the previous section shared one load-bearing assumption: **permanent, frictionless access to U.S. refineries and the U.S. market.** The 2025-26 trade war put a price on that assumption — literally, a **10% tariff on Canadian crude**.\n\nThree consequences worth documenting:\n\n- **The discount got company.** Canadian heavy crude (Western Canadian Select) already sells at a structural discount to the U.S. benchmark — commonly in the range of **US$10-20 per barrel** in recent years, a function of quality, distance, and above all a captive single customer. A tariff stacks a tax on top of a discount: Canada\'s flagship export sells low and is then taxed for arriving.\n- **Leverage became the debate.** Pierre Poilievre argued Canada should use oil and minerals as leverage against U.S. tariffs; Prime Minister Carney explicitly refused to "leverage" energy in trade talks. The U.S. Trade Representative, for his part, warned Canada against trying. Whatever the right answer, the fact that energy leverage is the live federal debate confirms how completely the old assumption has died.\n- **Both parties\' answers are pipelines, not refineries.** Carney signed a memorandum with Alberta laying groundwork for a new crude pipeline to B.C.\'s north coast aimed at Asian markets, under his "energy superpower" agenda. Poilievre proposes a **Canada First National Energy Corridor** to move resources to new markets. Note what both have in common: they diversify the *customers* for raw crude. Neither proposes capturing the refining margin at home. The Sturgeon experience hangs over that silence.\n\nAnd the carbon question the operator class raises — doesn\'t shipping oil south and gasoline back burn extra emissions? **Yes, and honesty requires sizing it.** The double-handling adds pipeline-pumping and marine-shipping emissions in both directions, and it is genuinely avoidable inefficiency. But transport is a modest slice of oil\'s lifecycle emissions; extraction/upgrading and, above all, combustion dominate. The strongest documented case against the loop isn\'t the shipping carbon — it\'s the **billions in surrendered margin and discounted prices**, every day, to a counterparty currently taxing us at the border.`,
    },
    {
      title: 'The bottom line',
      body: `On the documented record:\n\n- Canada produces **~6.1 million barrels a day** and can refine **~1.9 million**.\n- **98% of crude exports** go to one customer, which imposed a **10% tariff** on them during the trade war.\n- British Columbia\'s gasoline loop — Alberta crude to Washington refineries, fuel tankered back to Vancouver — is real and documented.\n- The refining gap is the product of forty years of individually rational decisions, all premised on a frictionless border that no longer exists.\n- The one modern attempt to close it domestically cost Alberta taxpayers ~$10 billion for 80,000 barrels a day.\n- Both major federal leaders propose moving more crude to more customers. Neither proposes refining more of it at home.\n\nWhether Canada should build refineries, build pipelines to Asia, or simply accept the dependence is a legitimate policy fight with serious arguments on every side. What is no longer legitimate, after the tariff, is the premise that shipping two-thirds of our oil to a single customer — and buying some of it back at the pump — carries no risk worth pricing.\n\nYour MP\'s votes on energy infrastructure, tariff response, and interprovincial trade are on the record — [find yours](/find-your-mp).`,
    },
  ],
  sources: [
    { label: 'Canada Energy Regulator — Market Snapshot: Canadian crude refinery runs held steady in 2025', url: 'https://www.cer-rec.gc.ca/en/data-analysis/energy-markets/market-snapshots/2026/market-snapshot-canadian-crude-refinery-runs-held-steady-in-2025.html' },
    { label: 'Canada Energy Regulator — Estimated production of Canadian crude oil and equivalent', url: 'https://www.cer-rec.gc.ca/en/data-analysis/energy-commodities/crude-oil-petroleum-products/statistics/estimated-production-canadian-crude-oil-equivalent.html' },
    { label: 'Canada Energy Regulator — Provincial energy profile: British Columbia', url: 'https://www.cer-rec.gc.ca/en/data-analysis/energy-markets/province-territory-energy-profiles/british-columbia.html' },
    { label: 'CBC News — Canada\'s biggest points of leverage in tariff and trade talks with the U.S.', url: 'https://www.cbc.ca/news/politics/trump-tariffs-canada-trade-negotiation-cusma-usmca-9.7132301' },
    { label: 'Wikipedia — 2025-2026 United States trade war with Canada and Mexico (10% crude tariff)', url: 'https://en.wikipedia.org/wiki/2025%E2%80%932026_United_States_trade_war_with_Canada_and_Mexico' },
    { label: 'Oil Sands Magazine — Why Vancouver desperately needs a new oil refinery (the 145,000 b/d loop)', url: 'https://www.oilsandsmagazine.com/news/2016/3/03/why-vancouver-desperately-needs-a-new-oil-refinery' },
    { label: 'Oil Sands Magazine — Canadian refineries (capacity inventory)', url: 'https://www.oilsandsmagazine.com/projects/canadian-refineries' },
    { label: 'Salish Current — More Canada crude is coming, but trade war could hamper flow (post-TMX Washington deliveries)', url: 'https://salish-current.org/2025/01/03/more-canada-crude-is-coming-but-trade-war-could-hamper-flow/' },
    { label: 'Sightline Institute — Washington\'s oil: where does it come from and where does it go?', url: 'https://www.sightline.org/2013/12/04/washingtons-oil-where-does-it-come-from/' },
    { label: 'Globe and Mail — Alberta government buying a 50-per-cent stake in the Sturgeon Refinery', url: 'https://www.theglobeandmail.com/business/article-alberta-government-buying-a-50-per-cent-stake-in-the-sturgeon-refinery/' },
    { label: 'CBC Opinion — This "Bitumen Boondoggle" is costing Alberta taxpayers billions', url: 'https://www.cbc.ca/news/canada/calgary/alberta-bitumen-sturgeon-refinery-nwrp-1.5718044' },
    { label: 'Macdonald-Laurier Institute / The Hub — Tombe: Why Canada should think twice before building more refineries', url: 'https://macdonaldlaurier.ca/why-canada-should-think-twice-before-building-more-refineries-trevor-tombe-in-the-hub/' },
    { label: 'Globe and Mail — Canada won\'t "leverage" energy or critical minerals in U.S. trade talks, Carney says', url: 'https://www.theglobeandmail.com/canada/article-canada-wont-leverage-energy-or-critical-minerals-in-us-trade-talks/' },
    { label: 'Bloomberg — Poilievre says Canada can use oil, minerals to sway Trump on tariffs', url: 'https://www.bloomberg.com/news/articles/2026-03-20/poilievre-says-canada-can-use-oil-minerals-to-sway-trump-on-tariffs' },
    { label: 'Oil & Gas Watch — After economic rupture with U.S., Canada looks to Asia for oil exports (Carney-Alberta pipeline MOU)', url: 'https://news.oilandgaswatch.org/post/after-economic-rupture-with-u-s-canada-looks-to-asia-for-oil-exports' },
    { label: 'Natural Resources Canada — The refining sector in Canada', url: 'https://natural-resources.canada.ca/energy-sources/fossil-fuels/refining-sector-canada' },
    { label: 'Parliament Audit — BC tanker ban + Eastern Canada\'s import dependence (related coverage)', url: 'https://parliamentaudit.ca/news/bc-tanker-ban-eastern-canada-saudi-oil-imports' },
  ],
};
