/**
 * Standalone — Tax Freedom Day 2026 (June 9), with the full Fraser
 * Institute Table 2 category-by-category breakdown of the $72,539
 * average-family tax bill.
 *
 * Operator hook 2026-06-08: "Tax Free Day, when the average Canadian
 * pays for all the taxes they owe the governments and from now on
 * gets to take home the rest of the money. Posts have images that
 * come from the link, for this post instead of an image with text I
 * want to create a table that shows how much tax the average family
 * pays for things like gas groceries and entertainment."
 *
 * Editorial floor:
 *   - All ten dollar amounts in the table are DIRECTLY from Fraser
 *     Institute Table 2 (Canada column), 2026 preliminary estimates.
 *     Total verifies to $72,539 exactly. No estimation.
 *   - Provincial Tax Freedom Days verified from Fraser Table 1.
 *   - Year-over-year deltas ($1,057 income tax, $569 payroll & health,
 *     $446 sales, $189 property, $283 other; declines in profit,
 *     amusement, import, natural resources) verified from the report.
 *   - Honest "yes but" framing: Tax Freedom Day is a price-of-
 *     government measure, NOT a value-received measure. The Fraser
 *     methodology counts business taxes as borne ultimately by
 *     households (which is contested but standard for this style of
 *     analysis). Article notes both points.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'tax-freedom-day-2026-full-category-breakdown',
  headline: 'Tax Freedom Day Is June 9, 2026. The Average Canadian Family Will Hand $72,539 to Government This Year — 43.5% of Its Income. Here\'s the Full Breakdown.',
  subheadline:
    'Tax Freedom Day is the day the average Canadian family finally finishes paying its annual tax bill and starts working for itself. In 2026, that day is June 9 — one day later than 2025, and almost two months later than 1961. The Fraser Institute\'s breakdown of the $72,539 bill: $25,352 in income tax, $17,069 in payroll and health taxes, $10,519 in sales tax, $7,819 in corporate tax passed through in prices, $4,939 in property tax, plus fuel, carbon, liquor, tobacco, amusement, import, and natural-resource levies. The chart shows every line.',
  summary:
    'Tax Freedom Day is the Fraser Institute\'s annual calculation of the day the average Canadian family has earned enough money to pay the taxes it owes to federal, provincial, and local governments combined. In 2026, that day is June 9. By the Fraser methodology, the average Canadian family (two or more individuals) will earn $166,790 in cash income this year and pay $72,539 in total taxes — 43.5% of its income. Tax Freedom Day arrives one day later than 2025 (June 8) because total taxes are growing faster (+3.0%, +$2,098) than cash income (+2.2%, +$3,575). The single largest year-over-year increase was income taxes (+$1,057 per family), followed by payroll & health taxes (+$569), sales taxes (+$446), property taxes (+$189), and "other taxes" (+$283). Profit taxes, import duties, alcohol/tobacco/amusement taxes, and natural-resource levies all declined slightly. Two provinces raised personal income tax rates for 2026: British Columbia raised its lowest bracket from 5.06% to 5.60%, and Prince Edward Island introduced a new top bracket for income over $200,000 at 20.0%. The earliest provincial Tax Freedom Day falls on May 20 in Saskatchewan; the latest is June 27 in Quebec, with Ontario at June 8. The full category-by-category breakdown of the $72,539 tax bill — every line from the Fraser Table 2 Canada column, summing exactly to $72,539 — is in the chart attached to this article.',
  publishedAt: new Date().toISOString(),
  category: 'Accountability',
  tags: ['Tax Freedom Day', 'Fraser Institute', 'taxes', 'cost of living', 'budget', 'CPP', 'GST', 'HST', 'carbon tax', 'property tax'],
  readingTimeMinutes: 6,
  heroImage: '/charts/tax-freedom-day-2026.png',
  keyTakeaways: [
    'Tax Freedom Day 2026 is June 9 — one day later than 2025.',
    'The average Canadian family will earn $166,790 and pay $72,539 in tax — 43.5% of income.',
    'Income tax is the single biggest line: $25,352 per family.',
    'Payroll + health taxes (CPP, EI, employer share, provincial health levies) are the second-biggest: $17,069.',
    'Sales taxes (GST/HST/PST) on almost every purchase: $10,519 per family.',
    'Corporate / profit tax that businesses pass through in higher prices: $7,819.',
    'Property tax (paid directly or baked into rent): $4,939.',
    'Liquor, tobacco, and amusement taxes (drinks, smokes, entertainment): $2,182.',
    'Auto, fuel, carbon, and motor-vehicle taxes: $1,137. (Lower than sales tax because this is the direct excise — sales tax on fuel sits in the sales-tax line.)',
    'Tax Freedom Day arrived earliest in Saskatchewan (May 20); latest in Quebec (June 27); Ontario was June 8.',
    'BC raised its lowest personal income tax bracket from 5.06% to 5.60% in 2026. PEI added a new bracket at 20.0% on income over $200,000.',
    'In 1961, Tax Freedom Day was May 3. The average family then paid 33.5% of income in tax. The shift is 33.5% → 43.5% over 65 years.',
  ],
  smartBrevity: {
    bigThing:
      'June 9 is the day the average Canadian family stops working for government and starts working for itself. The total bill — federal + provincial + local + business taxes passed through in prices — is $72,539 on $166,790 of family income. That is 43.5 percent of everything the average family earns this year.',
    whyItMatters:
      'Most Canadians can recite their income-tax bill from their pay stub. Almost no one can recite the full bill, because most of it is hidden — CPP and EI auto-deductions, sales tax on every purchase, property tax baked into rent, fuel tax inside the per-litre price, corporate tax passed through in everything from groceries to insurance. Tax Freedom Day strips away the hiding places and stacks every line into one number. That number is now 43.5 cents of every dollar earned. In 1961, it was 33.5 cents.',
    goDeeper: [
      'Income tax: $25,352 — biggest single line.',
      'Payroll & health: $17,069 — includes employer-side CPP/EI Canadians never see.',
      'Sales taxes: $10,519.',
      'Profit/corporate: $7,819 — passed through in prices.',
      'Property: $4,939.',
      'Liquor, tobacco, amusement: $2,182.',
      'Auto, fuel, carbon: $1,137 direct excise (sales tax on top is in the sales tax line).',
      'Other taxes, natural resource levies, import duties: ~$3,522 combined.',
      'Total: $72,539 on $166,790 income = 43.5 percent.',
      'YoY: total tax +3.0% ($2,098); cash income only +2.2%.',
    ],
    yesBut:
      'Tax Freedom Day is a measure of what government costs, not of what it delivers. The same $72,539 funds healthcare, education, OAS, GIS, the Canada Child Benefit, the military, the courts, infrastructure, and the social safety net. Whether the value received is worth the price is a separate judgment each Canadian gets to make. The Fraser methodology also counts business taxes (corporate income tax, employer-side payroll, etc.) as ultimately falling on households — this is the standard "tax incidence" assumption used in economics, but it does inflate the household-borne number compared to what shows up directly on a personal tax return. And the 43.5% number is averaged across all family types — the actual burden varies sharply by income, by province (Saskatchewan vs Quebec is a five-week gap), and by household composition.',
    bottomLine:
      'On the published Fraser numbers: the average Canadian family hands $72,539 — 43.5% of its income — to all levels of government in 2026. Tax Freedom Day arrives June 9. The full category breakdown is in the chart. Whether that price is fair, whether it buys good value, and whether it is sustainable are the next set of questions — and they belong with voters and Parliament, not with the calculation itself.',
  },
  methodology:
    'All ten line items in the breakdown table are taken directly from Table 2 (Canada column) of the Fraser Institute\'s "Canadians Celebrate Tax Freedom Day on June 9, 2026" report (Palacios, Fuss, and Li, 2026). The numbers are preliminary estimates based on private-sector forecasts of personal income, federal and provincial budget tax revenue projections, and the Fraser Institute\'s Canadian Tax Simulator 2026, which draws on the Statistics Canada Social Policy Simulation Database and Model (SPSD/M) version 34.0 (based on the 2022 Canadian Income Survey). The total verifies to $72,539 exactly. Year-over-year changes ($1,057 income tax, $569 payroll & health, $446 sales, $189 property, $283 other; declines in profit, amusement, import duties, and natural-resource levies) are from the report\'s commentary on Table 4. The provincial Tax Freedom Day list is from Table 1 of the same report. The 1961 baseline ($1,675 tax on $5,000 income, 33.5%) is from the Fraser Canadian Consumer Tax Index 2025 edition (Fuss and Munro, 2025), Table 2. The Fraser methodology counts business taxes (corporate income tax, employer-side payroll, etc.) as ultimately borne by households — the standard tax-incidence assumption in economics — which is why the household-level total ($72,539) is higher than what appears on a personal tax return. The article notes this in the "yes but" section. We did not contact the Fraser Institute, the Department of Finance, the Canada Revenue Agency, or any provincial government for this article; the data is public and cited at the foot.',
  sections: [
    {
      title: 'What Tax Freedom Day actually measures',
      body: `Tax Freedom Day is a single calculation, run every year by the Fraser Institute, that asks one question: **if the average Canadian family had to pay its entire annual tax bill before keeping a single dollar of its earnings, on what day of the year would it finish?**\n\nIn 2026, that day is **June 9**. The day before is the last day every dollar earned goes to government. June 9 is the first day the family starts keeping what it makes.\n\nThe methodology counts every level of government and every type of tax. That means:\n\n- Federal income tax + every provincial income tax\n- CPP and EI premiums (both the employee side and the employer side, because the employer side is part of compensation the employee would otherwise receive)\n- Provincial health premiums and payroll taxes\n- GST + every provincial sales tax (HST in Atlantic Canada and Ontario; PST in BC, Saskatchewan, Manitoba; QST in Quebec)\n- Municipal property tax (paid directly by homeowners, baked into rent for renters)\n- Federal and provincial fuel excise + the carbon tax + motor vehicle licence fees\n- Liquor markups + tobacco excise + amusement/entertainment levies\n- Corporate income tax (counted at the household level because businesses pass it through in prices)\n- Import duties\n- Natural resource royalties and fees\n- Other miscellaneous excise and levies\n\nAdded together, the Fraser methodology calculates the average Canadian family (two or more individuals) will pay **$72,539** in total taxes in 2026 on **$166,790** in cash income — **43.5 percent**. That works out to 159 days of the year, ending June 8. June 9 is liberation day.`,
    },
    {
      title: 'The full breakdown — every dollar, every category',
      body: `The chart attached to this article shows the full Fraser Institute Table 2 for Canada in 2026. Every line is the official preliminary estimate. The ten line items sum to exactly $72,539. Reading them in order of size:\n\n- **Income taxes: $25,352** — federal and provincial combined. The biggest single line.\n- **Payroll & health taxes: $17,069** — CPP and EI (employee side AND employer side, which is the part most Canadians don\'t see on their pay stub), provincial health levies, payroll levies for things like Quebec\'s QPIP. Together these are the second-biggest line, and almost two-thirds the size of income tax.\n- **Sales taxes: $10,519** — GST, HST, PST, QST combined. This is the tax you pay on almost every transaction. Groceries are mostly exempt; restaurants, prepared foods, snacks, alcohol, entertainment, clothing, electronics, services — all in.\n- **Profit taxes: $7,819** — corporate income tax that businesses pay directly, but which is passed through to consumers in higher prices. The Fraser methodology counts this as a household-borne tax. This is the standard "tax incidence" assumption in economics (with caveats — see "yes but" below).\n- **Property taxes: $4,939** — paid directly if you own, baked into rent if you don\'t.\n- **Other taxes: $2,219** — miscellaneous licence fees and minor levies.\n- **Liquor, tobacco, amusement, & other excise: $2,182** — the "sin tax" line. Provincial alcohol markups, federal and provincial tobacco excise, amusement-tax levies on entertainment.\n- **Auto, fuel, motor vehicle licence & carbon taxes: $1,137** — federal excise on gasoline (10¢/L), provincial fuel taxes (variable by province), the carbon tax, plus motor vehicle registration. (Important footnote: the GST/HST you pay on fuel is in the sales-tax line above, not here. This line is the direct excise only.)\n- **Natural resource levies: $706** — embedded in resource-sector products.\n- **Import duties: $597** — anything brought across the border carries an import-duty component.\n\nFor the "things like gas, groceries, and entertainment" framing: gas is $1,137 in direct excise plus a share of the $10,519 sales-tax line (the GST/HST levied on top of the per-litre price). Most basic groceries are GST/HST-exempt, but the prepared, snack, restaurant, and beverage portion of the food budget sits in the sales-tax line. Entertainment — concerts, streaming subscriptions, restaurant meals, movies — sits in the sales-tax line plus a portion of the amusement excise.`,
    },
    {
      title: 'Tax Freedom Day is moving later, not earlier',
      body: `Between 2025 and 2026, the average family\'s total tax bill **rose 3.0 percent** ($2,098). Cash income rose only **2.2 percent** ($3,575). When taxes grow faster than income, Tax Freedom Day arrives later. June 9 is one day later than 2025.\n\nThe largest year-over-year increase, by category:\n\n- Income taxes: **+$1,057**\n- Payroll & health taxes: +$569\n- Sales taxes: +$446\n- Property taxes: +$189\n- Other taxes: +$283\n\nFour categories actually declined: profit taxes (corporate tax revenue projected to fall), import duties, alcohol/tobacco/amusement taxes, and natural resource levies. But the income-tax increase alone is bigger than all four declines combined.\n\nTwo provinces explicitly raised personal income tax rates for 2026:\n\n- **British Columbia** raised its lowest personal income tax bracket from **5.06% to 5.60%**.\n- **Prince Edward Island** introduced a **new top bracket** at **20.0% on income over $200,000**.\n\nNo province cut a major personal income tax rate this year.`,
    },
    {
      title: 'The provincial gap is five weeks wide',
      body: `Tax Freedom Day is a national average. The provincial reality is much more variable. From the Fraser Table 1, the 2026 Tax Freedom Day in each province:\n\n- **Saskatchewan: May 20** (earliest)\n- Alberta: May 25\n- Manitoba: May 28\n- British Columbia: June 4\n- Prince Edward Island: June 5\n- New Brunswick: June 6\n- **Ontario: June 8**\n- Nova Scotia: June 9\n- Newfoundland & Labrador: June 19\n- **Quebec: June 27** (latest)\n\nThe gap between Saskatchewan and Quebec is **38 days** — over five weeks. A family living in Quebec works five more weeks of the year for government than a family in Saskatchewan does.\n\nWhy? Higher provincial income tax rates and steeper progressive brackets in Quebec (top combined federal-provincial marginal rate above 53%), plus a higher provincial sales tax (QST at 9.975% versus PST at 6-7%), plus higher payroll levies (QPIP, the Health Services Fund, etc.). The Quebec provincial government delivers a broader basket of social programs (subsidized $9/day daycare, lower post-secondary tuition for Quebec residents, broader pharmacare) — but the tax bill side of the ledger is what Tax Freedom Day measures.`,
    },
    {
      title: 'The historical arc — 1961 to 2026',
      body: `Tax Freedom Day is not a new measure. The Fraser Institute has calculated it every year since 1961.\n\nThe trajectory:\n\n- **1961: May 3.** Average family income $5,000; tax bill $1,675; **33.5%** of income.\n- **1981: May 30.** Tax bill had reached $11,429.\n- **2000: June 28.** The latest Tax Freedom Day in Canadian history — every dollar earned through almost the end of June went to government. Tax bill: $25,268.\n- **2010: June 10.** Two decades of federal GST cuts (7% → 6% → 5%), corporate income tax cuts, and BC, Manitoba, and Saskatchewan personal-tax relief had pulled the date back almost three weeks from the 2000 peak.\n- **2024: June 12.**\n- **2025: June 8.**\n- **2026: June 9.**\n\nThe total tax bill of the average Canadian family has grown **2,784 percent** since 1961 — faster than the consumer price index (+925%), faster than housing costs (+2,129%), faster than food (+927%), faster than clothing (+460%). The average family\'s share of income going to tax has shifted from one-third in 1961 to nearly half (43.5%) in 2026.\n\nIncomes grew too — by about 2,186% over the period — so the inflation-adjusted real tax bill is up roughly 181%, not 2,784%. But the share of income captured by tax has unambiguously risen across that 65-year window.`,
    },
    {
      title: 'The honest "yes but"',
      body: `Three legitimate qualifications belong with this analysis.\n\n**Tax Freedom Day measures price, not value.** The $72,539 funds healthcare, public schools, OAS and CPP retirement income, the Canada Child Benefit, the military, the RCMP and provincial police, the courts, roads and bridges, EI when you lose your job, and the social safety net. Whether the value received is worth the price is a question each Canadian gets to answer based on their own use of those services. Tax Freedom Day, by its authors\' own description, is "not intended to measure the benefits Canadians receive from governments in return for their taxes." It is a sticker price, not a value judgment.\n\n**The Fraser methodology counts business taxes as borne by households.** Corporate income tax, employer-side CPP and EI, and other taxes levied directly on businesses are assumed to be passed through to households in the form of higher consumer prices and lower wages. This is the standard "tax incidence" assumption in economics — it has solid empirical backing — but it is the reason the Fraser household tax bill ($72,539) is higher than what would appear on any individual tax return summed across a family. A different methodology that counted only direct household taxes would produce a smaller number. Both methodologies are defensible; Fraser\'s is the standard for this style of analysis.\n\n**The 43.5% number is an average, not a universal.** Income tax is progressive — a family at $80,000 pays a much smaller share than a family at $250,000. Sales tax is somewhat regressive — it hits low-income households harder as a share of their income because they spend a higher share of income on taxable goods. Property tax depends entirely on where you live and what you own. The "average family" is a statistical construct; no individual family is precisely the average. Personal Tax Freedom Day varies sharply by income, province, household composition, and life stage.\n\nNone of those qualifiers changes the headline number. The average Canadian family is calculated to pay 43.5% of its income in tax in 2026. June 9 is the day the average family is calculated to finish paying it.`,
    },
    {
      title: 'The bottom line',
      body: `On the published Fraser Institute calculation, in 2026:\n\n- The average Canadian family will earn **$166,790**.\n- It will pay **$72,539** in total taxes — federal + provincial + local + business taxes passed through.\n- That is **43.5%** of its income.\n- It works the first **159 days of the year** for government.\n- **June 9** is the first day it starts keeping what it earns.\n\nThe gap between provinces is over five weeks. The trend over 65 years is from one-third of income going to tax (1961) to nearly half (2026). The single largest line is income tax ($25,352), followed by payroll & health ($17,069), sales tax ($10,519), and corporate tax embedded in prices ($7,819).\n\nWhether 43.5% is the right price for the basket of government services Canadians receive is a question worth asking — and it belongs in front of voters and Parliament, not in front of an accounting firm. Parliament Audit publishes the breakdown. The judgment is yours.`,
    },
  ],
  sources: [
    { label: 'Fraser Institute — Canadians Celebrate Tax Freedom Day on June 9, 2026 (Palacios, Fuss, Li, 2026)', url: 'https://www.fraserinstitute.org/studies/canadians-celebrate-tax-freedom-day-on-june-9-2026' },
    { label: 'Fraser Institute — Tax Freedom Day 2026 report PDF', url: 'https://www.fraserinstitute.org/sites/default/files/2026-06/canadians-celebrate-tax-freedom-day-on-june-9-2026.pdf' },
    { label: 'Fraser Institute — Taxes versus the Necessities of Life: Canadian Consumer Tax Index 2025 (Fuss, Munro, 2025)', url: 'https://www.fraserinstitute.org/studies/taxes-versus-necessities-life-canadian-consumer-tax-index-2025-edition' },
    { label: 'Fraser Institute — Canadian Consumer Tax Index 2025 PDF', url: 'https://www.fraserinstitute.org/sites/default/files/2025-07/canadian-consumer-tax-index-2025.pdf' },
    { label: 'CNW — Tax Freedom Day is tomorrow June 9', url: 'https://www.newswire.ca/news-releases/tax-freedom-day-is-tomorrow-june-9-when-canadians-finally-start-working-for-themselves-819834065.html' },
    { label: 'Wealth Professional — One more day of working for the government', url: 'https://www.wealthprofessional.ca/news/industry-news/one-more-day-of-working-for-the-government-says-fraser-institute/392657' },
    { label: 'Fraser Institute — Personal Tax Freedom Day Calculator', url: 'https://www.fraserinstitute.org/tax-freedom-day-calculator' },
    { label: 'Statistics Canada — Social Policy Simulation Database and Model (SPSD/M)', url: 'https://www150.statcan.gc.ca/n1/pub/89-621-x/89-621-x2010001-eng.htm' },
  ],
};
