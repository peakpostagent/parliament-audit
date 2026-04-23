/**
 * Monday weekly-review helper.
 *
 * Pulls last 7 days of Umami data + diffs vs. the previous 7 days.
 * Prints a terminal dashboard in the shape prescribed by the analytics
 * playbook (content/analytics-playbook.md §5).
 *
 * Usage: npx tsx scripts/weekly-review.ts
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const UMAMI_URL = 'https://umami-production-d170.up.railway.app';
const CREDS_FILE = resolve(process.cwd(), '.umami-creds.json');

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

type Stats = {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
};

function pct(a: number, b: number): string {
  if (b === 0) return a === 0 ? '—' : '∞';
  const delta = ((a - b) / b) * 100;
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(1)}%`;
}

function durStr(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

async function main() {
  const creds = JSON.parse(readFileSync(CREDS_FILE, 'utf8'));
  const login = await fetch(`${UMAMI_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: creds.adminUsername || 'admin',
      password: creds.adminPassword,
    }),
  });
  if (!login.ok) {
    console.error('Login failed. Is .umami-creds.json current?');
    process.exit(1);
  }
  const { token } = await login.json();
  const auth = { authorization: `Bearer ${token}` } as const;
  const websiteId = creds.websiteId;
  const now = Date.now();

  async function stats(startAt: number, endAt: number): Promise<Stats> {
    const r = await fetch(
      `${UMAMI_URL}/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
      { headers: auth },
    );
    return r.json();
  }

  async function top(type: string, startAt: number, endAt: number) {
    const r = await fetch(
      `${UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&unit=day&timezone=America%2FEdmonton&type=${type}&limit=10`,
      { headers: auth },
    );
    const text = await r.text();
    try {
      return JSON.parse(text);
    } catch {
      return [];
    }
  }

  const thisWeek = await stats(now - WEEK_MS, now);
  const lastWeek = await stats(now - 2 * WEEK_MS, now - WEEK_MS);
  const referrers = await top('referrer', now - WEEK_MS, now);

  console.log('\nParliament Audit — Weekly Review');
  console.log('═════════════════════════════════════════════════════');
  console.log(`Window: last 7 days vs. previous 7 days`);
  console.log(`Pulled: ${new Date().toISOString()}`);
  console.log('');
  console.log(
    `Pageviews   ${String(thisWeek.pageviews).padStart(5)}    (${pct(thisWeek.pageviews, lastWeek.pageviews)} vs prev)`,
  );
  console.log(
    `Visitors    ${String(thisWeek.visitors).padStart(5)}    (${pct(thisWeek.visitors, lastWeek.visitors)} vs prev)`,
  );
  console.log(
    `Visits      ${String(thisWeek.visits).padStart(5)}    (${pct(thisWeek.visits, lastWeek.visits)} vs prev)`,
  );
  console.log(
    `Bounces     ${String(thisWeek.bounces).padStart(5)}    (${pct(thisWeek.bounces, lastWeek.bounces)} vs prev)`,
  );
  console.log(
    `Time on site  ${String(durStr(thisWeek.totaltime)).padStart(9)}  (avg ${thisWeek.visits > 0 ? durStr(Math.round(thisWeek.totaltime / thisWeek.visits)) : '—'} per visit)`,
  );
  console.log('');

  console.log('Top referrers');
  if (Array.isArray(referrers) && referrers.length > 0) {
    for (const r of referrers.slice(0, 5)) {
      console.log(`  ${String(r.y).padStart(5)}  ${r.x || '(direct)'}`);
    }
  } else {
    console.log('  (none this week)');
  }
  console.log('');

  console.log('Monday checklist (analytics-playbook §5)');
  console.log('  [ ] Check top 5 referrers — any surprise platforms?');
  console.log('  [ ] Check top 3 articles — are we surfacing what readers want?');
  console.log('  [ ] Subscriber delta — how many signups this week?');
  console.log('  [ ] Bounce rate on new posts — are openers finishing?');
  console.log('  [ ] Social referral quality — long sessions or bounces?');
  console.log('  [ ] One experiment update — what are we testing right now?');
  console.log('  [ ] One content bet for next week — what article goes first?');
  console.log('  [ ] Search Console queries (once verified) — any new terms ranking?');
  console.log('');
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
