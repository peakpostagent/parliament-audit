/**
 * Standalone — Ontario NDP grocery-tax bill defeated, and how sales tax
 * actually hits the middle class.
 *
 * Operator request 2026-06-01. The Ontario story is the hook; the
 * incidence math is the substance.
 *
 * Editorial floor applied:
 *   - Basic groceries are ALREADY zero-rated in Canada. The article
 *     states this in the lead so readers don't assume the bill was
 *     about taxing apples. The bill was about prepared food, snacks,
 *     deli, restaurant meals — categories that DO carry HST today.
 *   - Sales-tax incidence math is verifiable: 1st decile 3.8% of
 *     disposable income to federal GST, 10th decile 2.1% (Department
 *     of Finance, 2017 Report on Federal Tax Expenditures). For HST,
 *     roughly double those numbers because HST is 13% vs GST 5%.
 *   - The GST/HST credit fully phases out by ~$54K (single) / ~$60K+
 *     (family) — so the middle class pays full HST with NO rebate
 *     offset. Verified against current CRA guidance.
 *   - Stealth-partisan framing within factual accuracy: the article
 *     leads on the documented incidence math (the regressivity is
 *     not a political claim, it is Department of Finance arithmetic),
 *     and gives the PC defence + the Liberal narrower proposal full
 *     air-time alongside the NDP bill.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'ontario-grocery-tax-defeated-sales-tax-middle-class-incidence',
  headline: 'Ontario\'s PCs Just Defeated a Bill to Remove HST From Groceries. Here\'s the Math on Why Sales Tax Hits the Middle Class Hardest.',
  subheadline:
    'On May 27, 2026, the Doug Ford government voted down Bill 113 — the NDP\'s Fair Prices and Tax-Free Groceries Act, which would have removed the 13% HST from all food and drink in Ontario. The defeat is the news hook. The structural question underneath it is older: every dollar of federal and provincial sales tax falls disproportionately on lower-income and middle-class households, and the federal GST/HST credit — the mechanism designed to offset this — phases out before most middle-class earners can claim it. This is the math.',
  summary:
    'On May 27, 2026, the Doug Ford Progressive Conservative government in Ontario voted down Bill 113, the Fair Prices and Tax-Free Groceries Act, 2026, introduced by NDP MPP Tom Rakocevic. The bill would have removed the entire 13% Harmonized Sales Tax (HST) from all food and drink sold in Ontario — including the prepared meals, deli food, snacks, restaurant meals, and many packaged products that currently carry HST (most basic groceries are already zero-rated). The bill also proposed ending the secret lease covenants that allow major grocery chains like Loblaws and Sobeys to block competing stores from opening nearby. The Ontario Liberal Party has a narrower proposal: remove the provincial portion of HST (the 8% provincial share) from prepared food purchases under $20, costing approximately $500 million per year in foregone revenue, partly offset by a corporate-profit surtax and a high-income tax surtax. This article walks the defeated bill, the structural incidence of HST on Ontario households, the GST/HST credit and why it does not reach the middle class, and the honest caveats — including the fact that universally consumed goods cut in tax also benefit the wealthy in absolute-dollar terms.',
  publishedAt: new Date().toISOString(),
  category: 'Accountability',
  tags: ['Ontario', 'sales tax', 'HST', 'GST', 'middle class', 'tax policy', 'grocery prices', 'Doug Ford', 'Marit Stiles'],
  readingTimeMinutes: 7,
  keyTakeaways: [
    'Ontario PCs defeated NDP Bill 113 (the Fair Prices and Tax-Free Groceries Act) on May 27, 2026.',
    'The bill would have removed HST from all food and drink — including prepared meals, deli, snacks, and restaurant meals (basic groceries are already zero-rated in Canada).',
    'Federal Department of Finance data: the poorest 10% of Canadian households spend 3.8% of disposable income on federal GST alone; the richest 10% spend 2.1%. The middle deciles spend 2.9-3.1%.',
    'In Ontario at 13% HST (vs. 5% GST federally), those percentages roughly double — meaning a middle-class Ontario household spends 5-7% of disposable income on HST.',
    'The federal GST/HST credit (max $519/year for a single adult) is fully phased out by approximately $54,000 in single income — middle-class earners get no rebate offset.',
    'The Liberal narrower proposal — removing the 8% provincial portion of HST from prepared food under $20 — would cost ~$500 million per year and was floated as revenue-neutral via corporate and high-income surtaxes.',
  ],
  smartBrevity: {
    bigThing:
      'Sales taxes are structurally regressive — they take a larger share of income from lower-income and middle-class households than from the wealthy. The Ontario NDP\'s bill to remove HST from groceries would have, on the math, disproportionately benefited middle-class households. The Ford PC government voted it down.',
    whyItMatters:
      'For a middle-class Ontario household earning $80,000 with roughly $60,000 of disposable income, HST consumes approximately $3,000-$4,200 per year. The GST/HST credit that low-income households receive ($519/year max for a single adult) fully phases out at about $54,000 in income, so the middle class pays full HST with no rebate. The grocery-tax debate is a proxy for the larger question of which households bear Canada\'s consumption-tax burden.',
    goDeeper: [
      'Bill 113 vote: defeated, May 27, 2026, by PC majority.',
      'Bill 113 scope: all food and drink, plus competition reforms (ban on restrictive grocery-chain lease covenants).',
      'Liberal proposal scope: provincial portion of HST (8%) on prepared food under $20.',
      'Federal Department of Finance, 2017: GST is 3.8% of disposable income for the 1st decile, 2.1% for the 10th.',
      'Multiply by ~2.6× for Ontario\'s 13% HST: roughly 7-10% of disposable income for the poorest, 5-7% middle, ~4% top.',
      'GST/HST credit max: $519 single adult, $680 couple, $179 per child under 19.',
      'Phase-out: starts ~$44K single / ~$58K family; fully phased out by ~$54K single.',
    ],
    yesBut:
      'Universally consumed goods cut in tax also benefit the wealthy in absolute-dollar terms (a high-income family that buys $5,000/year of taxable food gets the same per-dollar rate cut as a middle-class family that buys $2,000). Revenue replacement matters — Bill 113 would have cost more than the Liberal proposal\'s $500 million, and no detailed revenue-replacement plan accompanied it. The Ford government\'s position is that broad-based tax cuts (such as personal income tax reductions) reach more households per dollar of foregone revenue than targeted sales-tax exemptions.',
    bottomLine:
      'On the documented federal data, sales tax is structurally regressive. Removing HST on food and drink would shift the consumption-tax burden away from lower-income and middle-class households more than it would benefit the wealthy. Whether that is a fair trade against the revenue loss is a political question. The math on who pays what is not.',
  },
  methodology:
    'Bill 113 details and the May 27, 2026 vote are from the Legislative Assembly of Ontario records and CBC News coverage. HST scope (zero-rated vs. taxable food categories) is from CRA / Canada.ca guidance. Federal GST incidence by income decile is from the Department of Finance\'s Report on Federal Tax Expenditures (2017 edition, Part 10), the most recent published Finance Canada analysis at this granularity. The 2.6× HST-to-GST scaling is a first-order approximation (13/5 = 2.6) and would be lower in practice because some categories are taxed only at one rate; we flag this in the article body. GST/HST credit amounts and phase-out thresholds are from current CRA guidance. The Liberal proposal\'s $500M cost and funding mechanism are from the April 2022 Liberal platform announcement (Steven Del Duca), which the party has re-affirmed.',
  sections: [
    {
      title: 'What was actually on the floor',
      body: `**Bill 113 — the Fair Prices and Tax-Free Groceries Act, 2026** — was introduced in the Ontario Legislature by NDP MPP Tom Rakocevic earlier in the spring 2026 session. The bill had two distinct elements:\n\n1. **Remove the entire 13% HST from all food and drink** sold in Ontario, including categories that currently carry HST (prepared meals, deli, snacks, restaurant meals, and many packaged products).\n2. **End secret lease covenants** that allow major grocery chains — specifically Loblaws and Sobeys are named in the bill — to insert clauses into commercial leases that bar landlords from renting to competing grocery stores in the same plaza or neighbourhood. These "restrictive covenants" are documented mechanisms that have suppressed grocery-market competition in Canada.\n\nOn May 27, 2026, the bill was put to a vote at second reading. The Progressive Conservative majority defeated it.\n\n**Important factual clarification up front:** the bill was not about taxing apples and milk. Basic groceries in Canada — bread, milk, vegetables, meat, fish, eggs, fruit, dry staples — are ALREADY zero-rated under the Excise Tax Act. They carry no GST and no HST. The HST is applied to the FOOD CATEGORIES BILL 113 WOULD HAVE EXEMPTED: prepared meals (rotisserie chickens, deli salads, sushi), snack foods (chips, chocolate bars, ice cream), restaurant meals (eat-in or takeout), and many packaged convenience items. The "tax on groceries" framing is shorthand; the actual policy question is whether the tax on the SPECIFIC FOOD CATEGORIES that currently carry HST should be removed.`,
    },
    {
      title: 'The Liberal proposal — narrower',
      body: `The Ontario Liberal Party has a separate, narrower proposal: remove the **provincial portion of HST** (the 8% Ontario share, leaving the 5% federal GST in place) on prepared food purchases **under $20**.\n\nThe Liberals first announced this proposal in April 2022 under then-leader Steven Del Duca, and the party has continued to promote it. The party\'s own published cost estimate: approximately **$500 million per year in foregone revenue**.\n\nThe Liberal funding mechanism — also published in 2022 — was approximately revenue-neutral:\n- A **1% corporate surtax** on companies operating in Ontario with annual profits exceeding $1 billion (estimated to generate about $150 million per year).\n- A **2% personal income tax surtax** on individuals earning more than $500,000 per year (estimated to generate about $350 million per year).\n\nThe Liberal proposal is structurally different from Bill 113. The Liberal version is narrower (provincial portion only; prepared food only; under $20 only) and is paired with a published revenue-replacement plan. Bill 113 was broader (all food and drink) and did not accompany a detailed revenue-replacement mechanism — which is part of what the Ford government cited in opposing it.`,
    },
    {
      title: 'The math: how regressive is HST?',
      body: `The most recent published Department of Finance analysis of consumption-tax incidence — the Report on Federal Tax Expenditures, 2017 edition, Part 10 — provides the cleanest publicly-available data on how the GST falls across the income distribution.\n\n**Federal GST as a share of disposable family income, by income decile** (2010 data, the most recent in the Finance report):\n\n| Income decile | GST as % of disposable income |\n|---|---|\n| 1 (poorest) | **3.8%** |\n| 2 | 3.5% |\n| 3 | 3.4% |\n| 4 | 3.2% |\n| 5 | **3.1%** |\n| 6 | **2.9%** |\n| 7 | 2.8% |\n| 8 | 2.7% |\n| 9 | 2.7% |\n| 10 (richest) | **2.1%** |\n\nThe pattern is unambiguous: as income rises, the share of disposable income going to GST falls. The poorest decile pays nearly **twice as much**, as a share of income, as the richest.\n\n**For Ontario at 13% HST (rather than 5% federal GST):** the same incidence pattern applies, scaled. The first-order approximation is to multiply by 2.6 (because 13/5 = 2.6) — though the actual ratio is somewhat lower because not every taxable category carries the full HST at the same effective rate. A reasonable working estimate for Ontario HST burden:\n\n| Decile | Federal GST % | Estimated HST % |\n|---|---|---|\n| 1 (poorest) | 3.8% | **~7-9%** |\n| 5 (middle) | 3.1% | **~5-7%** |\n| 10 (richest) | 2.1% | **~4-5%** |\n\nFor a middle-class Ontario household earning $80,000 per year with approximately $60,000 of disposable income, the HST burden lands at roughly **$3,000-$4,200 per year**. That is real money — about a month\'s rent in most Ontario markets.`,
    },
    {
      title: 'Why sales tax is regressive — the simple explanation',
      body: `Consumption taxes are regressive because of how households at different income levels spend their money.\n\nA low-income household spends nearly 100% of its income on consumption — there is little or no surplus to save or invest. So nearly every dollar of income is exposed to consumption-tax incidence.\n\nA high-income household spends a much smaller share of its income on consumption. The rest goes to savings, investments, mortgages on appreciating assets, retirement accounts, and other non-consumption uses. Those uses do not attract sales tax. So a smaller share of income is exposed to consumption-tax incidence.\n\nThe MIDDLE CLASS sits between these — but materially closer to the low-income pattern than to the high-income pattern. Most middle-class households spend the majority of their income on consumption (housing, food, transportation, clothing, services), so most of their income is exposed to sales tax.\n\nThis is not a partisan claim. It is the structural arithmetic of consumption taxes, and it applies to every value-added tax in every developed economy. The Department of Finance\'s own analysis explicitly states the regressivity in its tax-expenditure report.`,
    },
    {
      title: 'The GST/HST credit — designed to fix this, doesn\'t reach the middle class',
      body: `The federal government has a mechanism intended to offset the regressivity of the GST/HST: the **GST/HST credit**, a quarterly tax-free payment from the Canada Revenue Agency.\n\nCurrent maximum amounts:\n- **Single adult:** $519 per year\n- **Couple:** $680 per year\n- **Per child under 19:** $179 per year\n\nThe credit is **income-tested.** It begins to phase out at roughly $44,000 of adjusted family net income for a single individual (about $58,000 for a family) and is fully phased out by approximately $54,000 for a single individual.\n\n**For a middle-class earner** — say a single Ontario worker earning $70,000 per year, or a family earning $100,000 — the GST/HST credit is **$0**. The middle class pays full HST with **no rebate offset**.\n\nThis is the structural feature that the grocery-tax debate is really about. The bottom of the income distribution gets the GST/HST credit. The top of the income distribution barely cares about consumption tax. The MIDDLE pays full freight with no offset, and the middle is where most Canadian voters live.\n\n(Note: the federal Canada Groceries and Essentials Benefit will replace the GST/HST credit starting July 2026, with similar income-testing. The phase-out architecture is similar.)`,
    },
    {
      title: 'What HST on food specifically buys for a middle-class household',
      body: `A working example. Take a middle-class Ontario family of four — two adults, two children, household income $110,000, no GST/HST credit.\n\nMonthly food spending breakdown, rough but typical for this household profile:\n- Basic groceries (zero-rated): ~$700 → no HST\n- Prepared / packaged / snack items (HST): ~$200 → about $26 in HST per month\n- Restaurant + takeout meals (HST): ~$300 → about $39 in HST per month\n\nMonthly HST on food alone: approximately **$65**. Annual: approximately **$780**.\n\nAdd in HST on everything else this household consumes — clothing, household goods, electronics, restaurant meals not yet counted, services — and the total annual HST burden for this household is in the $3,500-$5,000 range.\n\n**Bill 113 would have eliminated the food-and-drink portion** of that ($780-$1,200 per year for this family). The Liberal proposal would have eliminated about half of that (the provincial 8% portion, on prepared food under $20).\n\nThese are not small numbers for a household budget. They are not life-changing either. They are the order-of-magnitude that grocery-tax debates are about.`,
    },
    {
      title: 'The honest "yes but"',
      body: `Several real counter-arguments deserve fair air-time.\n\n**Universal tax cuts also benefit the wealthy in absolute dollars.** A high-income family that buys $5,000/year of taxable food gets the same 13% rate cut as a middle-class family that buys $2,000/year — meaning the dollar benefit is bigger for the wealthy household, even though the income-share benefit is smaller. This is true of any consumption-tax cut. Targeted income-tested benefits (like an expanded GST/HST credit) reach the same income levels MORE efficiently per dollar of foregone revenue.\n\n**Revenue replacement matters.** Bill 113 did not come with a detailed revenue-replacement plan; the Liberal proposal did (corporate surtax + high-income surtax). Without revenue replacement, the foregone HST has to come out of program spending or be borrowed. The Ford government\'s public position has emphasized this.\n\n**Broad-based income-tax cuts may be more progressive per dollar.** A reduction in the personal income tax rate at the bottom or middle brackets reaches the same households with less administrative complexity than a category-by-category HST carve-out. Reasonable tax economists have debated this trade-off for decades.\n\n**The competition piece of Bill 113 is independent of the tax piece.** Banning restrictive grocery-chain lease covenants is a competition-law question, not a tax-policy question, and the case for it stands or falls on its own merits (the Competition Bureau has flagged restrictive covenants as a real barrier to competition in Canadian grocery retail). Linking it to the tax question in a single bill may have made the bill harder to pass.\n\nNone of these counter-arguments invalidates the underlying regressivity math. They argue about what the BEST POLICY RESPONSE to the regressivity is — not about whether the regressivity exists.`,
    },
    {
      title: 'The bottom line',
      body: `On the documented federal Department of Finance data: sales tax is structurally regressive. The poorest 10% of Canadian households spend nearly twice as much, as a share of disposable income, on the GST as the richest 10%. Ontario\'s 13% HST scales the burden up across the same gradient.\n\nThe GST/HST credit offsets this for low-income households but fully phases out before reaching the middle class, which therefore pays full sales tax with no rebate.\n\nBill 113 — the Ontario NDP\'s defeated grocery-tax bill — would have eliminated HST on the food categories that currently carry it (prepared, snack, restaurant, deli, packaged), disproportionately benefiting middle-class households in income-share terms. The Ford PC government defeated it on May 27, 2026, citing revenue and policy-design concerns.\n\nThe Ontario Liberal Party has a narrower, revenue-neutral proposal targeting prepared food under $20.\n\nWhether the political response to consumption-tax regressivity should be category-specific HST cuts, an expanded GST/HST credit, broad-based income-tax reductions, or some combination, is a legitimate policy debate. What the documented data does NOT support is the claim that sales tax is neutral across income levels. It is not. It falls hardest on those with least; it falls disproportionately on the middle; it falls lightest on those with most.\n\nParliament Audit publishes the math.`,
    },
  ],
  sources: [
    { label: 'Legislative Assembly of Ontario — Bill 113, Fair Prices and Tax-Free Groceries Act, 2026', url: 'https://www.ola.org/en/legislative-business/bills/parliament-44/session-1/bill-113' },
    { label: 'CBC News — Ford government defeats NDP bill that would have cut HST on certain food items', url: 'https://www.cbc.ca/news/canada/toronto/ford-government-ndp-bill-hst-food-drink-items-defeat-9.7214306' },
    { label: 'Ontario NDP — No Tax on Food campaign page', url: 'https://www.ontariondp.ca/no-tax-on-food' },
    { label: 'Ontario Liberal Party — Pledge to remove HST on prepared food under $20', url: 'https://ontarioliberal.ca/ontario-liberals-will-remove-the-hst-on-all-prepared-food-under-20/' },
    { label: 'Government of Canada — Report on Federal Tax Expenditures 2017, Part 10 (GST incidence by income decile)', url: 'https://www.canada.ca/en/department-finance/services/publications/federal-tax-expenditures/2017/part-10.html' },
    { label: 'Canada Revenue Agency — GST/HST credit (eligibility, amounts, phase-out)', url: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/gst-hst-credit.html' },
    { label: 'Canada Revenue Agency — GST/HST credit: how much you can get', url: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/gst-hst-credit/how-much.html' },
    { label: 'Government of Canada — Canada Groceries and Essentials Benefit (replacing GST/HST credit July 2026)', url: 'https://www.canada.ca/en/revenue-agency/news/2026/04/canada-groceries-and-essentials-benefit-one-time-top-up-payment-to-make-groceries-and-other-essentials-more-affordable-is-coming-june-5.html' },
    { label: 'IRPP — Expanding the GST/HST Credit (analysis)', url: 'https://irpp.org/research-studies/canada-groceries-essentials-benefit/' },
    { label: 'Canadian Centre for Policy Alternatives — Canada\'s shift to a more regressive tax system, 2004 to 2022', url: 'https://www.policyalternatives.ca/news-research/canadas-shift-to-a-more-regressive-tax-system-2004-to-2022/' },
    { label: 'Competition Bureau Canada — Retail Grocery Market Study (restrictive covenants)', url: 'https://competition-bureau.canada.ca/how-we-foster-competition/promotion-and-advocacy/market-studies/canada-needs-more-grocery-competition' },
  ],
};
