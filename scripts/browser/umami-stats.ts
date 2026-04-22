/**
 * Pull current Umami stats: pageviews, sessions, bounces for the last 24h.
 * Uses admin creds from .umami-creds.json.
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
    body: JSON.stringify({ username: creds.adminUsername || 'admin', password: creds.adminPassword }),
  });
  if (!login.ok) {
    console.error('Login failed:', login.status, (await login.text()).slice(0, 200));
    process.exit(1);
  }
  const { token } = await login.json();

  const endAt = Date.now();
  const startAt = endAt - 24 * 60 * 60 * 1000; // last 24h
  const websiteId = creds.websiteId;

  const url = `${UMAMI_URL}/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  const text = await res.text();
  console.log(`GET ${url}`);
  console.log(`HTTP ${res.status}`);
  console.log(text.slice(0, 800));

  // Also pull pageviews by URL
  const urlsRes = await fetch(
    `${UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=url&limit=20`,
    { headers: { authorization: `Bearer ${token}` } },
  );
  console.log('\n-- top URLs --');
  console.log(await urlsRes.text().then((t) => t.slice(0, 800)));

  // And by referrer
  const refRes = await fetch(
    `${UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=referrer&limit=10`,
    { headers: { authorization: `Bearer ${token}` } },
  );
  console.log('\n-- top referrers --');
  console.log(await refRes.text().then((t) => t.slice(0, 400)));

  console.log('\n-- active visitors --');
  const active = await fetch(`${UMAMI_URL}/api/websites/${websiteId}/active`, {
    headers: { authorization: `Bearer ${token}` },
  });
  console.log(await active.text());
}

main().catch((e) => { console.error(e.message); process.exit(1); });
