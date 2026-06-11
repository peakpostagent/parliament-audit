/**
 * Cloudflare Email Routing setup for parliamentaudit.ca — API version.
 *
 * Wires the three published-but-dead site addresses to a real inbox:
 *   hello@parliamentaudit.ca        → DESTINATION
 *   corrections@parliamentaudit.ca  → DESTINATION
 *   alerts@parliamentaudit.ca       → DESTINATION
 *
 * Requires CLOUDFLARE_API_TOKEN in .env, scoped to the account/zone
 * that actually holds parliamentaudit.ca:
 *   - Zone → DNS → Edit
 *   - Zone → Email Routing Rules → Edit
 *   - Account → Email Routing Addresses → Edit
 * Create at: dash.cloudflare.com/profile/api-tokens (log in with the
 * account that owns the domain — NOT the kindlingandhammer SSO one).
 *
 * Flow:
 *   1. Resolve zone + account id
 *   2. Create the destination address (sends a verification email to
 *      DESTINATION — click it, then re-run this script)
 *   3. Enable Email Routing on the zone (adds MX + SPF records)
 *   4. Create the three forwarding rules
 *   5. Print final state
 *
 * Idempotent: safe to re-run; existing addresses/rules are detected.
 *
 *   npx tsx scripts/one-off/cf-email-routing-api.ts          # dry-run
 *   npx tsx scripts/one-off/cf-email-routing-api.ts --apply
 */
import dotenv from 'dotenv';
dotenv.config({ override: true });

const APPLY = process.argv.includes('--apply');
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_NAME = 'parliamentaudit.ca';
const DESTINATION = 'peakpostagent@gmail.com';
const ADDRESSES = ['hello', 'corrections', 'alerts'];

const API = 'https://api.cloudflare.com/client/v4';

async function cf(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${TOKEN}`,
      'content-type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  const body = await res.json();
  if (!body.success) {
    throw new Error(`${path}: ${JSON.stringify(body.errors).slice(0, 300)}`);
  }
  return body.result;
}

async function main() {
  if (!TOKEN) {
    console.error('CLOUDFLARE_API_TOKEN missing from .env — see header comment for the scopes to grant.');
    process.exit(1);
  }

  // 1 — zone + account
  const zones = await cf(`/zones?name=${ZONE_NAME}`);
  if (!zones.length) {
    console.error(`Zone ${ZONE_NAME} not visible to this token — wrong account or missing zone scope.`);
    process.exit(1);
  }
  const zone = zones[0];
  const accountId = zone.account.id;
  console.log(`[cf-api] zone ${zone.id} in account "${zone.account.name}" (${accountId})`);

  // 2 — destination address
  const dests = await cf(`/accounts/${accountId}/email/routing/addresses`);
  let dest = dests.find((d: any) => d.email.toLowerCase() === DESTINATION.toLowerCase());
  if (!dest) {
    if (!APPLY) {
      console.log(`[dry-run] would create destination address ${DESTINATION} (triggers verification email)`);
    } else {
      dest = await cf(`/accounts/${accountId}/email/routing/addresses`, {
        method: 'POST',
        body: JSON.stringify({ email: DESTINATION }),
      });
      console.log(`[cf-api] destination created — VERIFICATION EMAIL sent to ${DESTINATION}. Click it, then re-run.`);
    }
  } else {
    console.log(`[cf-api] destination ${DESTINATION}: ${dest.verified ? 'VERIFIED ✓' : 'NOT yet verified — click the email link and re-run'}`);
  }

  // 3 — enable routing on the zone (adds MX + SPF)
  const routing = await cf(`/zones/${zone.id}/email/routing`).catch(() => null);
  console.log(`[cf-api] routing status: ${routing?.status ?? 'unknown'} (enabled=${routing?.enabled ?? '?'})`);
  if (routing && routing.enabled !== true) {
    if (!APPLY) {
      console.log('[dry-run] would enable Email Routing (adds MX + SPF records to DNS)');
    } else {
      await cf(`/zones/${zone.id}/email/routing/enable`, { method: 'POST' });
      console.log('[cf-api] ✓ Email Routing enabled — MX + SPF records added');
    }
  }

  // 4 — forwarding rules
  const rules = await cf(`/zones/${zone.id}/email/routing/rules`);
  for (const local of ADDRESSES) {
    const addr = `${local}@${ZONE_NAME}`;
    const exists = rules.some((r: any) =>
      r.matchers?.some((m: any) => m.type === 'literal' && m.value?.toLowerCase() === addr),
    );
    if (exists) {
      console.log(`[cf-api] rule for ${addr} already present ✓`);
      continue;
    }
    if (!APPLY) {
      console.log(`[dry-run] would create rule ${addr} → ${DESTINATION}`);
      continue;
    }
    await cf(`/zones/${zone.id}/email/routing/rules`, {
      method: 'POST',
      body: JSON.stringify({
        name: `forward ${local}`,
        enabled: true,
        matchers: [{ type: 'literal', field: 'to', value: addr }],
        actions: [{ type: 'forward', value: [DESTINATION] }],
      }),
    });
    console.log(`[cf-api] ✓ rule created: ${addr} → ${DESTINATION}`);
  }

  console.log(`\n[cf-api] done${APPLY ? '' : ' (dry-run — pass --apply)'}.`);
  console.log('[cf-api] verify with: nslookup -type=MX parliamentaudit.ca  (expect route1/2/3.mx.cloudflare.net)');
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
