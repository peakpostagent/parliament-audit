/**
 * Standalone — how Canada's wireless oligopoly happened, who has tried
 * to fight it, and what the scoreboard says. Companion deep-dive to
 * the streaming-tax/wireless-protectionism piece (2026-06-04), which
 * the operator asked us to reference and comment on.
 *
 * Operator hook 2026-06-10: "research the monopoly on Canadian cell
 * providers, how that happened, who if anyone if any politician is
 * trying to fight back, and compare/comment on our last cell provider
 * article."
 *
 * Editorial floor:
 *   - "Oligopoly," not "monopoly" — three firms, not one. Headline and
 *     body use the accurate term; the colloquial "monopoly" framing
 *     appears only as what Canadians commonly call it.
 *   - Every acquisition in the consolidation timeline is documented:
 *     Public Mobile→Telus (2013), Mobilicity→Rogers (2015),
 *     Wind→Shaw (2016), MTS→Bell (2017), Shaw→Rogers (2023,
 *     Freedom divested to Vidéotron).
 *   - The honest counter-trend is prominent, not buried: CRTC-measured
 *     prices fell ~25% in two years; the June 12, 2026 fee bans are a
 *     real consumer win. The StatCan CPI uptick (Oct/Nov 2025, first
 *     YoY increase in ~30 months) is the news hook suggesting the
 *     window may be closing.
 *   - Champagne's Rogers-Shaw conditions are reported as extracted
 *     concessions AND as approval of the merger — both true.
 *   - Market-share figure: "roughly 90%" (CRTC/analyst range 89-91%
 *     including flanker brands).
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'canada-wireless-oligopoly-how-ottawa-built-it-who-fought-it',
  headline: 'Canada\'s Cell Phone "Monopoly" Is Actually Three Companies, and It Wasn\'t an Accident. Ottawa Helped Build It — Then Spent 18 Years Trying and Failing to Build a Fourth Carrier.',
  subheadline:
    'Bell, Rogers, and Telus — plus the flanker brands they own — control roughly 90% of Canadian wireless. That dominance was constructed: foreign-ownership rules walled out deep-pocketed competitors, and every domestic challenger Ottawa seeded since 2008 was eventually bought by the companies it was created to challenge. Three federal governments, two regulators, and one Competition Bureau court fight have tried to break the pattern. The scoreboard: prices finally fell for two years — and as of late 2025, Statistics Canada says they\'re rising again. New CRTC switching-fee bans take effect June 12.',
  summary:
    'Canadians commonly call it the cell phone monopoly. Technically it is an oligopoly: Bell, Rogers, and Telus, together with the flanker brands they own — Fido, Chatr and Cityfone (Rogers), Koodo and Public Mobile (Telus), Virgin Plus and Lucky Mobile (Bell) — control roughly 90% of the Canadian wireless market. This article traces how that happened: the Telecommunications Act\'s foreign-ownership rules (the "80/80 rule" plus the 10% market-share rule) that keep foreign carriers from competing at scale; the 2008 AWS spectrum auction in which Ottawa set aside spectrum to create new competitors (Wind Mobile, Mobilicity, Public Mobile); and the decade in which every one of those entrants was absorbed — Public Mobile by Telus (2013), Mobilicity by Rogers (2015), Wind by Shaw (2016, renamed Freedom Mobile), Manitoba\'s MTS by Bell (2017), and finally Shaw itself by Rogers in a $26-billion merger completed in 2023. The article catalogues who has actually fought back: the Harper Conservatives\' 2013 attempt to recruit Verizon (defeated by the Big Three\'s "Fair for Canada" lobbying campaign and Verizon\'s withdrawal); the NDP\'s price-cap pledges under Jagmeet Singh; the Competition Bureau\'s full-scale legal war against the Rogers-Shaw merger (lost at the Competition Tribunal in December 2022 and at the Federal Court of Appeal in January 2023); Industry Minister François-Philippe Champagne\'s extracted conditions (Vidéotron must hold Freedom Mobile for 10 years and price Ontario/Western plans comparably to its Quebec plans, roughly 20% below incumbent levels); and the CRTC\'s consumer-protection turn, including the fee bans taking effect June 12, 2026 that the regulator estimates will save Canadians more than $600 million per year. The honest scoreboard: CRTC-measured wireless prices fell roughly 25% over two years after the Vidéotron remedy — and in October and November 2025, Statistics Canada recorded the first year-over-year cellular price increases in about 30 months, suggesting the competitive window opened by the merger remedies may already be narrowing.',
  publishedAt: new Date().toISOString(),
  category: 'Accountability',
  tags: ['wireless', 'Big Three', 'oligopoly', 'competition', 'CRTC', 'Rogers', 'Bell', 'Telus', 'cost of living', 'Telecommunications Act', 'Competition Bureau'],
  readingTimeMinutes: 8,
  heroStat: { value: '~90%', label: 'Big Three share of Canadian wireless' },
  faq: [
    {
      question: 'Why are Canadian cell phone bills so high?',
      answer:
        'Three structural reasons documented across regulator and analyst studies: (1) the Telecommunications Act\'s foreign-ownership rules effectively prevent large foreign carriers from competing in Canada at scale; (2) every domestic fourth-carrier challenger created since the 2008 spectrum set-asides was eventually acquired by the Big Three or their affiliates; and (3) the "competition" on store shelves — Fido, Koodo, Virgin Plus, Chatr, Lucky — is mostly flanker brands owned by the same three companies. Less competitive pressure means prices settle higher than in peer countries, though CRTC data shows real declines between 2023 and 2025.',
    },
    {
      question: 'Who owns Fido, Koodo, Virgin Plus, and Public Mobile?',
      answer:
        'Rogers owns Fido, Chatr, and Cityfone. Telus owns Koodo and Public Mobile. Bell owns Virgin Plus and Lucky Mobile. Freedom Mobile, formerly Wind Mobile, is owned by Vidéotron (Quebecor) — the one major brand outside the Big Three, and it exists in its current form because the government required Rogers to divest it as a condition of the 2023 Shaw merger.',
    },
    {
      question: 'Has any politician tried to break the Big Three\'s dominance?',
      answer:
        'Several, across party lines. The Harper Conservatives set aside spectrum for new entrants in 2008 and openly courted Verizon in 2013. The NDP under Jagmeet Singh pledged price caps in 2019 and 2021. Liberal Industry Minister François-Philippe Champagne attached binding conditions to the Rogers-Shaw merger — Vidéotron must hold Freedom Mobile at least 10 years and offer Quebec-level pricing in Ontario and Western Canada. The Competition Bureau fought the merger itself all the way to the Federal Court of Appeal and lost. The CRTC banned plan-switching fees effective June 12, 2026.',
    },
    {
      question: 'Are Canadian cell phone prices going up or down in 2026?',
      answer:
        'Both, depending on the window. CRTC data shows prices for popular plan tiers fell roughly 25-40% between 2023 and 2025 after the Freedom Mobile divestiture triggered a price war. But Statistics Canada\'s CPI recorded year-over-year cellular price increases in October and November 2025 — the first in about 30 months — and analysts say the period of aggressive discounting appears to be ending.',
    },
  ],
  keyTakeaways: [
    'Bell, Rogers, Telus and their flanker brands control roughly 90% of Canadian wireless.',
    'The "competition" on store shelves is mostly the same three companies: Fido/Chatr (Rogers), Koodo/Public Mobile (Telus), Virgin Plus/Lucky (Bell).',
    'Foreign-ownership rules (the 80/80 rule + the 10% market-share rule) wall out foreign carriers at scale — the same architecture we documented in our streaming-tax piece.',
    'Ottawa seeded fourth carriers with 2008 spectrum set-asides. All three entrants were absorbed: Public Mobile→Telus (2013), Mobilicity→Rogers (2015), Wind→Shaw (2016).',
    'Bell bought Manitoba\'s MTS in 2017. Rogers bought Shaw for $26B in 2023 — the Competition Bureau fought it and lost twice.',
    'Champagne\'s merger conditions: Vidéotron holds Freedom 10 years, prices Ontario/West comparable to Quebec (~20% lower).',
    'The remedy worked — for a while: CRTC-measured prices fell ~25% in two years.',
    'StatCan CPI: October and November 2025 saw the first year-over-year cellular price INCREASES in ~30 months.',
    'New CRTC rules effective June 12, 2026 ban activation, plan-change, and most cancellation fees — estimated $600M/year in consumer savings.',
  ],
  smartBrevity: {
    bigThing:
      'Canada\'s cell phone "monopoly" is really a constructed oligopoly: foreign competitors walled out by statute, domestic challengers absorbed one by one, and a retail shelf of "competitors" mostly owned by the same three companies. Eighteen years of federal fix-it attempts have one durable win — and the price data says even that window may be closing.',
    whyItMatters:
      'Wireless is a monthly bill nearly every Canadian adult pays. The difference between a protected oligopoly price and a competitive price, multiplied across 30+ million subscriptions, is one of the largest hidden costs of living in Canada — and unlike groceries or gas, this one traces directly to identifiable federal policy choices made and maintained across both Liberal and Conservative governments.',
    goDeeper: [
      'Big Three + flankers: roughly 90% of the market.',
      '2008: Ottawa sets aside AWS spectrum → Wind, Mobilicity, Public Mobile launch.',
      '2013: Public Mobile → Telus. Verizon courted by Harper government; "Fair for Canada" campaign; Verizon walks.',
      '2015: Mobilicity → Rogers. 2016: Wind → Shaw (becomes Freedom).',
      '2017: MTS → Bell. Manitoba\'s fourth-carrier discount disappears.',
      '2023: Shaw → Rogers ($26B). Bureau loses at Tribunal + Federal Court of Appeal.',
      'Champagne conditions: Vidéotron holds Freedom 10 yrs, Quebec-level pricing in ON/West.',
      '2023-2025: prices fall ~25% (CRTC). Oct/Nov 2025: CPI turns positive — first in ~30 months.',
      'June 12, 2026: CRTC fee bans take effect (~$600M/yr savings estimate).',
    ],
    yesBut:
      'Prices genuinely fell after the Vidéotron remedy — CRTC data shows ~25-40% declines on popular tiers between 2023 and 2025, and the June 12 fee bans are a real, bankable consumer win. The Big Three also carry genuine costs peer carriers don\'t: building networks across the second-largest, sparsely-populated landmass on Earth. And the foreign-ownership rules exist for articulable reasons — network security and Canadian control of critical infrastructure — not pure protectionism. The question this article documents isn\'t whether those rationales exist; it\'s whether Canadians have ever been told the price tag.',
    bottomLine:
      'Every federal attempt to fix Canadian wireless since 2008 has run through the same playbook — seed or protect a fourth carrier — and the Big Three have absorbed or outlasted every challenger except, so far, Vidéotron. The Vidéotron exception is held in place by a 10-year ministerial condition that expires in 2033. What happens to prices after that is the question nobody in Ottawa has answered.',
  },
  methodology:
    'Market-share and flanker-brand structure are from the CRTC\'s Canadian Telecommunications Market Reports (2025, 2026) and contemporaneous analyst coverage (Morningstar, McGill Business Review); the "roughly 90%" figure reflects the documented 89-91% range for the Big Three including subsidiaries. The consolidation timeline is from contemporaneous reporting and official records: Telus-Public Mobile (October 2013), Rogers-Mobilicity (2015, via creditor protection), Shaw-Wind (2016), Bell-MTS (2017), Rogers-Shaw (Competition Tribunal decision December 2022; Federal Court of Appeal January 2023; closing April 2023). The 2008 AWS auction set-aside results are from Globe and Mail and ISED records. The Verizon 2013 episode and "Fair for Canada" campaign are from contemporaneous CBC and Globe coverage. Foreign-ownership rules (80/80, 10% market-share) are from the Telecommunications Act and The Hub\'s 2024 explainer, as documented in our June 4 streaming-tax article. Champagne\'s merger conditions are from his public statements as reported by CBC and the Globe. NDP price-cap pledges are from NDP platform documents (2019, 2021). CRTC fee-ban details are from Telecom Regulatory Policy CRTC 2026-43 (March 12, 2026) and the April 24, 2026 self-service ruling, with the $600M annual savings estimate from the CRTC\'s own announcement. Price-trend data: CRTC market reports (25-40% declines on popular tiers, 2023-2025) and Statistics Canada CPI via Globe and Mail reporting (first year-over-year increases in ~30 months, October-November 2025). We did not contact Bell, Rogers, Telus, Quebecor, the CRTC, ISED, or the Competition Bureau; all data is from on-record public sources cited at the foot.',
  sections: [
    {
      title: 'What Canadians call the monopoly is actually three companies — and their costumes',
      body: `Call it what most Canadians call it: the cell phone monopoly. Technically, it\'s an oligopoly — and the distinction matters because the structure is the story.\n\nBell, Rogers, and Telus, together with the brands they own, control **roughly 90%** of the Canadian wireless market. The store-shelf "competition" is mostly the same three companies wearing different costumes:\n\n- **Rogers** owns Fido, Chatr, and Cityfone.\n- **Telus** owns Koodo and Public Mobile.\n- **Bell** owns Virgin Plus and Lucky Mobile.\n\nA Canadian comparison-shopping between Fido, Koodo, and Virgin is comparing three subsidiaries of the three incumbents. The flanker-brand strategy lets the Big Three compete for price-sensitive customers without lowering the parent brands\' prices — the discount brand absorbs the price-shopper, and the premium brand keeps its margin.\n\nThe one major exception is **Freedom Mobile**, owned by Quebecor\'s Vidéotron — and as this article documents, Freedom exists in its current form only because the federal government forced Rogers to sell it as the price of swallowing Shaw.`,
    },
    {
      title: 'How it was built, part 1: the statutory wall',
      body: `Our June 4 piece on the streaming tax documented the architecture in detail; here is the short version.\n\nUnder the Telecommunications Act and Radiocommunication Act, a Canadian carrier with **10% or more market share** must be Canadian-controlled: at least **80% of voting shares Canadian-owned and 80% of board members Canadian citizens** — the "80/80 rule." The rules were loosened in 2012, but only for small players below the 10% threshold.\n\nThe practical effect: AT&T, Verizon, T-Mobile, or any other deep-pocketed foreign carrier cannot buy one of the Big Three, and cannot build a challenger past 10% market share without surrendering control of it. Foreign competition at the scale that would actually discipline Big Three pricing is structurally foreclosed.\n\nThe one moment the wall was tested: in 2013, **Verizon explored entering Canada** — looking at acquiring the struggling new entrants and bidding in the 700 MHz spectrum auction. The Harper government openly welcomed it. The Big Three responded with the coordinated **"Fair for Canada" advertising and lobbying campaign**, framing the second-largest carrier in the United States as a threat to Canadian jobs and rural networks. Within months, Verizon walked. No foreign carrier of comparable scale has looked at Canada since.`,
    },
    {
      title: 'How it was built, part 2: every challenger got eaten',
      body: `Ottawa has understood the competition problem for at least 18 years — and tried to fix it by manufacturing a fourth carrier. The 2008 AWS spectrum auction **set aside spectrum that incumbents could not bid on**, and three new carriers launched on it in 2009-2010: **Wind Mobile, Mobilicity, and Public Mobile**.\n\nHere is what happened to every one of them:\n\n- **Public Mobile** — sold to **Telus**, October 2013. Telus now uses the name as a flanker brand.\n- **Mobilicity** — filed for creditor protection in 2013 after a blocked Telus deal; sold to **Rogers** in 2015.\n- **Wind Mobile** — sold to **Shaw** in 2016 and renamed Freedom Mobile.\n- **MTS (Manitoba Telecom Services)** — not a 2008 entrant but Manitoba\'s independent fourth carrier, whose presence made Manitoba one of Canada\'s cheapest wireless provinces. Sold to **Bell** in 2017. Manitoba\'s discount eroded.\n- **Shaw itself** — acquired by **Rogers** in the $26-billion merger completed in April 2023, with Freedom Mobile divested to Vidéotron as the regulatory price.\n\nThe pattern is total. Every carrier created or sustained as a check on the Big Three was eventually acquired by the Big Three or consolidated into the existing oligopoly structure. The set-aside policy succeeded at creating competitors and failed completely at keeping them alive.`,
    },
    {
      title: 'Who fought back — the honour roll, across party lines',
      body: `The operator-class answer to "is any politician fighting this?" is: several have tried, from every major party, plus both watchdogs. The record:\n\n**The Harper Conservatives (2008-2014).** The 2008 spectrum set-asides were their policy. In 2013 they actively courted Verizon and ran on "More choices, lower prices." They lost — not to an opposition party, but to the Big Three\'s lobbying campaign and Verizon\'s cost-benefit math.\n\n**The NDP (2019-2021).** Jagmeet Singh campaigned twice on **capping cell phone and internet prices**, pegging Canadian rates to global averages and mandating affordable basic plans. The NDP never held government; the pledge was never tested.\n\n**The Competition Bureau (2021-2023).** Commissioner Matthew Boswell took the Rogers-Shaw merger to a full Competition Tribunal hearing — the most aggressive merger challenge in the Bureau\'s modern history. The Tribunal ruled against the Bureau in December 2022; the Federal Court of Appeal dismissed the appeal in January 2023. The watchdog used every legal tool it had, and lost.\n\n**François-Philippe Champagne (Liberal, Industry Minister).** Approved the merger — but extracted binding conditions: **Vidéotron must hold Freedom Mobile for at least 10 years** and must offer prices in Ontario and Western Canada **comparable to its Quebec pricing, roughly 20% below incumbent levels**. Whatever one thinks of approving the merger, the conditions are the single policy act of the last decade that demonstrably moved national prices.\n\n**The CRTC (2021-present).** Opened wholesale MVNO access to regional carriers; opened incumbent fibre networks to competitors in February 2025; and in March 2026 issued Telecom Regulatory Policy 2026-43, which **bans activation fees, plan-change fees, and most early-cancellation fees effective June 12, 2026** — two days after this article publishes. The CRTC estimates the switching-friction rules will save Canadians **more than $600 million per year**.`,
    },
    {
      title: 'The scoreboard — and the worrying turn in the data',
      body: `Did any of it work? Honestly: partially, recently, and possibly temporarily.\n\n**The win.** After the Freedom-to-Vidéotron divestiture, a genuine price war broke out. CRTC data shows mobile prices on popular tiers **fell roughly 25-40% between 2023 and 2025**. The gap to U.S. pricing narrowed. This is the most sustained price decline in modern Canadian wireless history, and it traces directly to the Champagne conditions — a fourth carrier with mandated Quebec-level pricing, finally national.\n\n**The turn.** In **October and November 2025**, Statistics Canada\'s CPI recorded **year-over-year cellular price increases — the first in roughly 30 months**. StatCan attributes it to weaker seasonal discounting; analysts are blunter. Ivey Business School\'s Erik Bohlin: the competitive period is "stabilizing." The Canadian Anti-Monopoly Project\'s Keldon Bester: the competitive moment may prove "more temporary than we would like."\n\nTwo structural facts support the pessimists. First, the subscriber-growth engine that fuelled the price war — record immigration — has slowed, reducing the incentive to compete for new customers. Second, the Vidéotron pricing condition runs **10 years from 2023**. In 2033 it expires. Nothing in current law prevents the market from re-converging on oligopoly pricing afterward — and the entire 18-year history above suggests that is the default trajectory, not the tail risk.`,
    },
    {
      title: 'What this adds to our streaming-tax piece',
      body: `Six days ago we published [the streaming-tax article](/news/streaming-tax-40-per-service-wireless-protectionism-parallel), which used Canadian wireless as the historical warning for the CRTC\'s new 15% streaming levy: protect a market from foreign competition, and consumers pay the differential.\n\nThis deep-dive sharpens that warning in one important way. The wireless story is not just "protection caused high prices." It is **"protection plus consolidation defeated every remedy."** Ottawa did not ignore the wireless problem — it attacked it repeatedly, across three governments and two decades, with spectrum set-asides, foreign-entry overtures, merger litigation, ministerial conditions, and regulatory fee bans. Almost every remedy was absorbed, outlasted, or out-lobbied by the incumbents. The single remedy that moved prices — the Vidéotron conditions — is time-limited and already showing strain in the CPI data.\n\nApplied to streaming: the federal government has told the CRTC to revisit the 15% levy because of consumer-cost concerns. The wireless record says revisits, conditions, and consumer-protection rules tend to soften protected-market pricing only temporarily, while the underlying structure — who is allowed to compete — stays untouched. Watch the structure, not the press release.\n\nOne more parallel worth naming: in both files, the consumer-cost concession came only after the policy was locked in. In wireless, Ottawa spent years denying the price gap that its own department\'s studies later documented. In streaming, the government acknowledged the pass-through risk only after the CRTC had finalized the rate. The pattern is consistent: the price tag is admitted late, and paid by the same people both times.`,
    },
    {
      title: 'The bottom line',
      body: `On the documented record:\n\n- Canada\'s wireless market is roughly 90% controlled by three companies and their flanker brands.\n- The dominance was constructed by identifiable policy: foreign-ownership rules that wall out competitors at scale, and a merger-review system that ultimately approved every major consolidation put in front of it.\n- Politicians and watchdogs from every major party have fought it — Harper\'s set-asides and Verizon overture, Singh\'s price-cap pledges, the Competition Bureau\'s two-court war, Champagne\'s merger conditions, the CRTC\'s fee bans landing June 12.\n- The one remedy that worked — a mandated, price-conditioned fourth carrier — has an expiry date of 2033, and the price data already turned upward in late 2025.\n\nThe next chapter is being written now: whether the CRTC\'s June 12 switching rules let consumers punish price increases, whether the Carney government extends or strengthens the Vidéotron conditions before they lapse, and whether anyone in Parliament is willing to touch the foreign-ownership wall itself — the one structural lever no government has pulled.\n\nParliament Audit will track all three. Your MP\'s position on telecom competition is a matter of public record — [find yours](/find-your-mp).`,
    },
  ],
  sources: [
    { label: 'CRTC — Canadian Telecommunications Market Report 2026', url: 'https://crtc.gc.ca/eng/publications/reports/PolicyMonitoring/2026/ctmr.htm' },
    { label: 'CRTC — Telecom Regulatory Policy 2026-43 (fee bans, effective June 12, 2026)', url: 'https://crtc.gc.ca/eng/archive/2026/2026-43.htm' },
    { label: 'Canada.ca — CRTC eliminates fees to make it easier to switch Internet and cellphone plans', url: 'https://www.canada.ca/en/radio-television-telecommunications/news/2026/03/crtc-eliminates-fees-to-make-it-easier-to-switch-internet-and-cellphone-plans.html' },
    { label: 'Globe and Mail — Cellphone plans could be getting more expensive after years of falling prices (StatCan CPI)', url: 'https://www.theglobeandmail.com/investing/personal-finance/article-cell-phone-wireless-plan-prices-canada-increases-statistics-canada/' },
    { label: 'Competition Tribunal — Commissioner of Competition v Rogers/Shaw, 2023 Comp Trib 1', url: 'https://decisions.ct-tc.gc.ca/ct-tc/cdo/en/item/520353/index.do' },
    { label: 'CBC — Competition Bureau appealing tribunal decision on Rogers-Shaw', url: 'https://www.cbc.ca/news/business/rogers-shaw-merger-competition-tribunal-decision-1.6700146' },
    { label: 'Torys LLP — Competition Tribunal rejects the Bureau\'s challenge of the Rogers-Shaw merger', url: 'https://www.torys.com/en/our-latest-thinking/publications/2023/01/competition-tribunal-rejects-challenge-of-the-rogers-shaw-merger' },
    { label: 'Canada.ca — AWS Spectrum Licences Transfer (Mobilicity/Wind/Rogers, 2015)', url: 'https://www.canada.ca/en/news/archive/2015/06/aws-spectrum-licences-transfer.html' },
    { label: 'Globe and Mail — 2008/2015 spectrum auction records', url: 'https://www.theglobeandmail.com/report-on-business/spectrum-auction-results/article23327602/' },
    { label: 'Barroqueiro — Nation-Building, Oligopoly, and Wireless Prices in Canada: The Big 3 (2019)', url: 'https://logicalaw.ca/wp-content/uploads/2022/07/D-Barroqueiro-Nation-Building-Oligopoly-and-Wireless-Prices-in-Canada-30-Apr-2019.pdf' },
    { label: 'The Hub — Explainer: foreign ownership restrictions in Canada\'s telecom sector', url: 'https://thehub.ca/2024/10/18/explainer-why-is-canadas-telecoms-market-so-closed-to-competition/' },
    { label: 'NDP — Lower cell phone bills (price-cap pledge)', url: 'https://www.ndp.ca/lower-cell-phone-bills' },
    { label: 'OpenMedia — Election 2021: where the parties stand on cell phone affordability', url: 'https://openmedia.org/article/item/election-2021-where-the-parties-stand-on-cell-phone-affordability' },
    { label: 'Telecommunications Act (R.S.C., 1993, c. 38)', url: 'https://laws-lois.justice.gc.ca/eng/acts/t-3.4/' },
    { label: 'Parliament Audit — Canada\'s New Streaming Tax vs the Wireless Precedent (June 4, 2026)', url: 'https://parliamentaudit.ca/news/streaming-tax-40-per-service-wireless-protectionism-parallel' },
  ],
};
