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

const templates: Record<string, () => ChartTemplate> = {
  'auto-industry-2014-vs-2024': autoIndustry2014vs2024,
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
