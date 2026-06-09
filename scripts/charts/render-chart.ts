/**
 * Reusable chart-rendering utility.
 *
 * Renders an HTML+SVG/CSS chart to a PNG via Playwright (already in
 * the repo dependency set). Charts saved to apps/web/public/charts/
 * so they're servable at https://parliamentaudit.ca/charts/<name>.png
 * for inline-image use on social posts.
 *
 * Why Playwright and not @vercel/og or node-canvas?
 *   - Playwright is already a dep (for the X browser-poster fallback).
 *   - HTML/CSS rendering is the most flexible chart format; Chart.js
 *     and bar/line/area charts all render natively without
 *     additional libraries.
 *   - PNG output via screenshot is exact-pixel; no font-rendering
 *     surprises across machines.
 *
 * Usage:
 *   npx tsx scripts/charts/render-chart.ts auto-industry-2014-vs-2024
 *   (script picks the named template from the templates() map below)
 */
import 'dotenv/config';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, 'apps/web/public/charts');
mkdirSync(OUT_DIR, { recursive: true });

interface ChartTemplate {
  filename: string;       // e.g. 'auto-industry-2014-vs-2024.png'
  width: number;
  height: number;
  html: string;           // standalone HTML doc (no remote deps)
}

/**
 * Chart template: Canadian vehicle production 2014 vs 2024.
 *
 * Two big bars + a subtle "-44%" callout. Inline CSS only — no
 * external fonts or CDN dependencies so the render is deterministic.
 * Brand colors approximate parliamentaudit.ca's primary palette.
 */
function autoIndustry2014vs2024(): ChartTemplate {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    background: #ffffff;
    font-family: 'Inter', -apple-system, system-ui, sans-serif;
    color: #1a2332;
    width: 1200px;
    height: 675px;
    overflow: hidden;
  }
  .card { padding: 56px 64px 48px 64px; height: 100%; display: flex; flex-direction: column; }
  .label { font-size: 14px; font-weight: 600; color: #6b7280; letter-spacing: 0.08em; text-transform: uppercase; }
  .title { font-size: 38px; font-weight: 800; color: #0f172a; line-height: 1.15; margin-top: 8px; max-width: 880px; }
  .chart-wrap { flex: 1; margin-top: 32px; display: flex; gap: 80px; align-items: flex-end; justify-content: center; padding: 0 40px 0 40px; }
  .bar-col { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .year { font-size: 18px; font-weight: 700; color: #475569; letter-spacing: 0.06em; }
  .bar { width: 220px; background: linear-gradient(180deg, #1e3a8a 0%, #0c1e4f 100%); border-radius: 8px 8px 0 0; position: relative; box-shadow: 0 6px 24px rgba(30,58,138,0.16); }
  .bar.before { height: 360px; }
  .bar.after  { height: 202px; }
  .bar .num { position: absolute; top: -42px; left: 50%; transform: translateX(-50%); font-size: 26px; font-weight: 800; color: #0f172a; white-space: nowrap; }
  .bar .sub { position: absolute; top: -16px; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: 600; color: #6b7280; }
  .bar.after { background: linear-gradient(180deg, #b91c1c 0%, #7f1d1d 100%); box-shadow: 0 6px 24px rgba(185,28,28,0.18); }
  .delta { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 16px; }
  .delta .arrow { font-size: 32px; color: #b91c1c; font-weight: 800; }
  .delta .pct { font-size: 48px; font-weight: 800; color: #b91c1c; line-height: 1; }
  .delta .pct-label { font-size: 13px; font-weight: 600; color: #6b7280; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 4px; }
  .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px; padding-top: 18px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280; }
  .footer .src { font-weight: 600; }
  .footer .brand { font-weight: 800; color: #0f172a; letter-spacing: 0.04em; }
</style>
</head>
<body>
  <div class="card">
    <div class="label">Canadian vehicle production · before and after 10 years of Liberal government</div>
    <div class="title">Canada produced 2.39 million vehicles in 2014.<br/>In 2024, it produced 1.34 million.</div>

    <div class="chart-wrap">
      <div class="bar-col">
        <div class="bar before">
          <div class="num">2,393,890</div>
          <div class="sub">units</div>
        </div>
        <div class="year">2014 · last full year before Liberal government</div>
      </div>

      <div class="delta">
        <div class="arrow">→</div>
        <div class="pct">−44%</div>
        <div class="pct-label">over 10 years</div>
      </div>

      <div class="bar-col">
        <div class="bar after">
          <div class="num">1,339,288</div>
          <div class="sub">units</div>
        </div>
        <div class="year">2024 · most recent full year</div>
      </div>
    </div>

    <div class="footer">
      <div class="src">Source: International Organization of Motor Vehicle Manufacturers (OICA) · Statistics Canada</div>
      <div class="brand">parliamentaudit.ca</div>
    </div>
  </div>
</body>
</html>`;
  return {
    filename: 'auto-industry-2014-vs-2024.png',
    width: 1200,
    height: 675,
    html,
  };
}

/**
 * Chart template: Tax Freedom Day 2026 — full category breakdown table
 * of the $72,539 tax bill paid by the average Canadian family on
 * $166,790 in cash income. All ten line items are directly from the
 * Fraser Institute's "Canadians Celebrate Tax Freedom Day on June 9,
 * 2026" study, Table 2 (Canada column, preliminary 2026 estimates).
 *
 * The "What it hits" column is editorial color — the Fraser
 * categories themselves are the official tax-type names.
 */
function taxFreedomDay2026(): ChartTemplate {
  const rows = [
    { tax: 'Income taxes',                       hits: 'Every paycheque (federal + provincial)',  dollars: 25352 },
    { tax: 'Payroll &amp; health taxes',         hits: 'CPP, EI, employer share, health levies',   dollars: 17069 },
    { tax: 'Sales taxes',                        hits: 'GST/HST/PST on almost everything you buy', dollars: 10519 },
    { tax: 'Profit taxes',                       hits: 'Corporate tax — hidden in every price',    dollars: 7819 },
    { tax: 'Property taxes',                     hits: 'Your home (or baked into your rent)',      dollars: 4939 },
    { tax: 'Other taxes',                        hits: 'Misc. licence fees and levies',            dollars: 2219 },
    { tax: 'Liquor, tobacco, amusement',         hits: 'Drinks, smokes, entertainment',            dollars: 2182 },
    { tax: 'Auto, fuel &amp; carbon taxes',      hits: 'Every fill-up + vehicle reg + carbon',     dollars: 1137 },
    { tax: 'Natural resource levies',            hits: 'Embedded in resource-sector products',     dollars: 706 },
    { tax: 'Import duties',                      hits: 'Anything brought across the border',       dollars: 597 },
  ];
  const fmt = (n: number) => '$' + n.toLocaleString('en-CA');
  const rowsHtml = rows.map((r, i) => `
    <tr class="${i % 2 === 0 ? 'r-even' : 'r-odd'}">
      <td class="c-tax">${r.tax}</td>
      <td class="c-hits">${r.hits}</td>
      <td class="c-dollar">${fmt(r.dollars)}</td>
    </tr>`).join('');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    background: #ffffff;
    font-family: 'Inter', -apple-system, system-ui, sans-serif;
    color: #0f172a;
    width: 1200px;
    height: 1100px;
    overflow: hidden;
  }
  .card { padding: 44px 56px 38px 56px; height: 100%; display: flex; flex-direction: column; }
  .eyebrow { font-size: 13px; font-weight: 700; color: #b91c1c; letter-spacing: 0.12em; text-transform: uppercase; }
  .title { font-size: 38px; font-weight: 800; color: #0f172a; line-height: 1.15; margin-top: 8px; max-width: 1080px; }
  .subtitle { font-size: 18px; font-weight: 500; color: #475569; line-height: 1.45; margin-top: 14px; max-width: 1060px; }
  table { width: 100%; border-collapse: collapse; margin-top: 28px; font-size: 18px; }
  th { text-align: left; padding: 14px 18px; background: #0f172a; color: #fff; font-weight: 700; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; }
  th.c-dollar { text-align: right; }
  td { padding: 13px 18px; border-bottom: 1px solid #e5e7eb; }
  td.c-tax { font-weight: 700; color: #0f172a; width: 28%; }
  td.c-hits { font-weight: 400; color: #475569; width: 52%; }
  td.c-dollar { text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; color: #0f172a; width: 20%; }
  tr.r-odd  { background: #f8fafc; }
  tr.r-even { background: #ffffff; }
  tr.total td { background: #fef2f2; border-top: 2px solid #b91c1c; border-bottom: 2px solid #b91c1c; padding: 16px 18px; font-size: 22px; }
  tr.total td.c-tax { color: #7f1d1d; font-weight: 800; }
  tr.total td.c-hits { color: #7f1d1d; font-weight: 600; }
  tr.total td.c-dollar { color: #7f1d1d; font-weight: 800; }
  .stats { display: flex; justify-content: space-between; margin-top: 28px; gap: 24px; }
  .stat { flex: 1; padding: 18px 22px; background: #f1f5f9; border-left: 4px solid #b91c1c; border-radius: 6px; }
  .stat .k { font-size: 12px; font-weight: 700; color: #64748b; letter-spacing: 0.08em; text-transform: uppercase; }
  .stat .v { font-size: 26px; font-weight: 800; color: #0f172a; margin-top: 4px; font-variant-numeric: tabular-nums; }
  .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 22px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #64748b; }
  .footer .src { font-weight: 600; }
  .footer .brand { font-weight: 800; color: #0f172a; letter-spacing: 0.04em; }
</style>
</head>
<body>
  <div class="card">
    <div class="eyebrow">Tax Freedom Day 2026 · June 9</div>
    <div class="title">The average Canadian family will pay $72,539 in tax this year — 43.5% of its income.</div>
    <div class="subtitle">Every dollar earned from January 1 through June 8 goes to government. The bill, by category, on a $166,790 family income:</div>

    <table>
      <thead>
        <tr>
          <th class="c-tax">Tax category</th>
          <th class="c-hits">What it hits</th>
          <th class="c-dollar">2026 cost</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
        <tr class="total">
          <td class="c-tax">TOTAL TAX BILL</td>
          <td class="c-hits">Federal + provincial + local, all sources combined</td>
          <td class="c-dollar">${fmt(72539)}</td>
        </tr>
      </tbody>
    </table>

    <div class="stats">
      <div class="stat">
        <div class="k">Family cash income</div>
        <div class="v">$166,790</div>
      </div>
      <div class="stat">
        <div class="k">Effective tax rate</div>
        <div class="v">43.5%</div>
      </div>
      <div class="stat">
        <div class="k">Days worked for gov't</div>
        <div class="v">159 days</div>
      </div>
    </div>

    <div class="footer">
      <div class="src">Source: Fraser Institute, Canadians Celebrate Tax Freedom Day on June 9, 2026 (Table 2, Canada column)</div>
      <div class="brand">parliamentaudit.ca</div>
    </div>
  </div>
</body>
</html>`;
  return {
    filename: 'tax-freedom-day-2026.png',
    width: 1200,
    height: 1100,
    html,
  };
}

const templates: Record<string, () => ChartTemplate> = {
  'auto-industry-2014-vs-2024': autoIndustry2014vs2024,
  'tax-freedom-day-2026': taxFreedomDay2026,
};

async function main() {
  const name = process.argv[2];
  if (!name || !templates[name]) {
    console.error(`usage: tsx scripts/charts/render-chart.ts <template>\n  templates: ${Object.keys(templates).join(', ')}`);
    process.exit(1);
  }
  const tmpl = templates[name]();
  const outPath = resolve(OUT_DIR, tmpl.filename);

  console.log(`[charts] rendering ${name} → ${outPath}`);
  const browser = await chromium.launch({ headless: true });
  try {
    const ctx = await browser.newContext({
      viewport: { width: tmpl.width, height: tmpl.height },
      deviceScaleFactor: 2, // retina-grade output
    });
    const page = await ctx.newPage();
    await page.setContent(tmpl.html, { waitUntil: 'networkidle' });
    // Allow font loading to settle.
    await page.waitForTimeout(500);
    await page.screenshot({
      path: outPath,
      type: 'png',
      fullPage: false,
      clip: { x: 0, y: 0, width: tmpl.width, height: tmpl.height },
    });
    console.log(`[charts] ✓ wrote ${outPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error('[charts] fatal:', e?.message || e);
  process.exit(1);
});
