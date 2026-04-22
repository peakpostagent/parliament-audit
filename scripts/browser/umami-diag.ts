/**
 * Diagnostic: figure out why Umami isn't showing pageviews despite
 * successful /api/send responses. Checks:
 *   - direct event table (if accessible via admin APIs)
 *   - stats with wider window
 *   - pageviews aggregate with unit/timezone
 *   - send a clean-shot event with complete fields
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const UMAMI_URL = 'https://umami-production-d170.up.railway.app';
const CREDS_FILE = resolve(process.cwd(), '.umami-creds.json');

async function main() {
  const creds = JSON.parse(readFileSync(CREDS_FILE, 'utf8'));
  const login = await fetch(`${UMAMI_URL}/api/auth/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: creds.adminPassword }),
  });
  const { token } = await login.json();
  const auth = { authorization: `Bearer ${token}` };
  const websiteId = creds.websiteId;

  // Send a clean event with a realistic UA
  console.log('-- Sending clean-shot pageview event --');
  const sendRes = await fetch(`${UMAMI_URL}/api/send`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    },
    body: JSON.stringify({
      type: 'event',
      payload: {
        website: websiteId,
        hostname: 'parliamentaudit.ca',
        screen: '1920x1080',
        language: 'en-CA',
        title: 'Diagnostic Pageview',
        url: '/?diag=1',
        referrer: 'https://google.com/',
      },
    }),
  });
  console.log(`  HTTP ${sendRes.status}: ${(await sendRes.text()).slice(0, 200)}`);

  // Wait a few seconds for write
  await new Promise((r) => setTimeout(r, 4000));

  // Stats — last hour
  const endAt = Date.now();
  const startAt = endAt - 3600_000;
  const statsRes = await fetch(`${UMAMI_URL}/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`, { headers: auth });
  console.log('\n-- last hour stats --');
  console.log(await statsRes.text());

  // Stats — last 48 hours
  const statsWide = await fetch(`${UMAMI_URL}/api/websites/${websiteId}/stats?startAt=${endAt - 172800000}&endAt=${endAt}`, { headers: auth });
  console.log('\n-- last 48h stats --');
  console.log(await statsWide.text());

  // Pageviews aggregate with unit + timezone (required in v3)
  const pv = await fetch(
    `${UMAMI_URL}/api/websites/${websiteId}/pageviews?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=America%2FEdmonton`,
    { headers: auth },
  );
  console.log('\n-- pageviews hourly --');
  console.log((await pv.text()).slice(0, 500));

  // Try metrics with explicit unit+timezone
  const m = await fetch(
    `${UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=America%2FEdmonton&type=url`,
    { headers: auth },
  );
  console.log('\n-- metrics by url --');
  console.log((await m.text()).slice(0, 500));

  // Check website config
  const site = await fetch(`${UMAMI_URL}/api/websites/${websiteId}`, { headers: auth });
  console.log('\n-- website config --');
  console.log(await site.text());
}

main().catch((e) => { console.error(e.message); process.exit(1); });
