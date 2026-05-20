/**
 * Probe Umami's API surface to find which endpoint returns top URLs.
 * The "metrics?type=url" form returns 400 on our deployment. This script
 * tries every documented endpoint variant + parameter combo and prints
 * which ones return data.
 *
 * One-shot diagnostic. Once we know the right query, the main
 * analytics-snapshot.ts uses it.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const creds = JSON.parse(readFileSync(resolve(ROOT, '.umami-creds.json'), 'utf8'));
const UMAMI = 'https://umami-production-d170.up.railway.app';

async function main() {
  const login = await fetch(`${UMAMI}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: creds.adminUsername || 'admin',
      password: creds.adminPassword,
    }),
  });
  if (!login.ok) {
    console.error('auth failed', login.status, await login.text());
    process.exit(1);
  }
  const { token } = await login.json();
  const endAt = Date.now();
  const startAt = endAt - 7 * 24 * 60 * 60 * 1000;
  const wid = creds.websiteId;

  const probes: Array<{ label: string; url: string }> = [
    // metrics endpoint with all known type values
    { label: 'metrics type=url', url: `/api/websites/${wid}/metrics?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=America%2FEdmonton&type=url&limit=15` },
    { label: 'metrics type=page', url: `/api/websites/${wid}/metrics?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=America%2FEdmonton&type=page&limit=15` },
    { label: 'metrics type=pageview', url: `/api/websites/${wid}/metrics?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=America%2FEdmonton&type=pageview&limit=15` },
    { label: 'metrics type=pageviews', url: `/api/websites/${wid}/metrics?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=America%2FEdmonton&type=pageviews&limit=15` },
    { label: 'metrics type=title', url: `/api/websites/${wid}/metrics?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=America%2FEdmonton&type=title&limit=15` },
    { label: 'metrics type=path', url: `/api/websites/${wid}/metrics?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=America%2FEdmonton&type=path&limit=15` },
    { label: 'metrics type=route', url: `/api/websites/${wid}/metrics?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=America%2FEdmonton&type=route&limit=15` },
    { label: 'metrics type=host', url: `/api/websites/${wid}/metrics?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=America%2FEdmonton&type=host&limit=15` },
    // Dedicated pageviews endpoint
    { label: 'pageviews', url: `/api/websites/${wid}/pageviews?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=America%2FEdmonton` },
    // Sessions endpoint
    { label: 'sessions', url: `/api/websites/${wid}/sessions?startAt=${startAt}&endAt=${endAt}` },
    // Events endpoint
    { label: 'events', url: `/api/websites/${wid}/events?startAt=${startAt}&endAt=${endAt}&unit=hour&timezone=America%2FEdmonton` },
    // Active stats
    { label: 'active', url: `/api/websites/${wid}/active` },
    // Reports endpoints (Umami v2 introduced these)
    { label: 'reports', url: `/api/reports` },
  ];

  for (const p of probes) {
    try {
      const r = await fetch(`${UMAMI}${p.url}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const text = await r.text();
      const preview = text.slice(0, 220);
      const status = r.ok ? `✓ ${r.status}` : `✗ ${r.status}`;
      console.log(`\n[${status}] ${p.label}`);
      console.log(`  ${preview}`);
    } catch (e: any) {
      console.log(`\n[err] ${p.label}: ${e.message}`);
    }
  }
}

main().catch((e) => {
  console.error('fatal', e?.message || e);
  process.exit(1);
});
