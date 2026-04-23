/**
 * Pull Umami custom-event data — specifically the 8 events we wired
 * last night. Validates the instrumentation end-to-end.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const UMAMI_URL = 'https://umami-production-d170.up.railway.app';
const CREDS_FILE = resolve(process.cwd(), '.umami-creds.json');

async function main() {
  const creds = JSON.parse(readFileSync(CREDS_FILE, 'utf8'));
  const login = await fetch(`${UMAMI_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: creds.adminPassword }),
  });
  const { token } = await login.json();
  const auth = { authorization: `Bearer ${token}` };
  const websiteId = creds.websiteId;

  const endAt = Date.now();
  const startAt = endAt - 7 * 24 * 60 * 60 * 1000;

  // All events (aggregated)
  const eventsRes = await fetch(
    `${UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&unit=day&timezone=America%2FEdmonton&type=event&limit=50`,
    { headers: auth },
  );
  console.log('-- Event types captured (last 7 days) --');
  const eventsRaw = await eventsRes.text();
  try {
    const data = JSON.parse(eventsRaw);
    if (Array.isArray(data) && data.length > 0) {
      for (const e of data) console.log(`  ${String(e.y).padStart(4)}  ${e.x}`);
    } else {
      console.log('  (no events captured yet)');
    }
  } catch {
    console.log(eventsRaw.slice(0, 300));
  }

  // Event data (which event properties)
  const evDataRes = await fetch(
    `${UMAMI_URL}/api/websites/${websiteId}/event-data/fields?startAt=${startAt}&endAt=${endAt}`,
    { headers: auth },
  );
  console.log('\n-- Event property fields --');
  console.log((await evDataRes.text()).slice(0, 500));

  // Referrers this week
  const refRes = await fetch(
    `${UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&unit=day&timezone=America%2FEdmonton&type=referrer&limit=20`,
    { headers: auth },
  );
  console.log('\n-- Referrers (last 7d) --');
  console.log((await refRes.text()).slice(0, 500));

  // Query strings — UTMs will show up here
  const qRes = await fetch(
    `${UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&unit=day&timezone=America%2FEdmonton&type=query&limit=20`,
    { headers: auth },
  );
  console.log('\n-- Query strings (UTM payloads show up here) --');
  console.log((await qRes.text()).slice(0, 800));

  // Top URLs — with multiple url param shapes
  for (const type of ['title', 'host', 'os']) {
    const r = await fetch(
      `${UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&unit=day&timezone=America%2FEdmonton&type=${type}&limit=10`,
      { headers: auth },
    );
    console.log(`\n-- ${type} --`);
    console.log((await r.text()).slice(0, 300));
  }
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
