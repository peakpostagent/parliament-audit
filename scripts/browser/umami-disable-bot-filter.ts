/**
 * Disable Umami's bot filter so automation-UA test traffic AND real
 * readers both get tracked. Default behaviour silently drops anything
 * Umami flags as a bot — which, for a zero-follower Canadian civic
 * news site, is more likely to be a false positive than a real bot
 * saving us pennies of storage.
 *
 * Upstream default: `DISABLE_BOT_CHECK=false` (filter ON).
 * We flip to `DISABLE_BOT_CHECK=true` (filter OFF).
 *
 * Safe to reverse once traffic grows and bot noise becomes a problem.
 */
import { chromium } from 'playwright';
import { resolve } from 'node:path';

const PROFILE_DIR = resolve(process.cwd(), '.browser-profile');
const PROJECT_ID = 'e8c45154-387b-4aa1-8bd1-6282d37128a6';
const UMAMI_SERVICE_ID = 'de36702b-ed9f-4daf-94ee-db0f7b68cadd';
const ENVIRONMENT_ID = 'ed19dfb2-7ade-4a14-aecf-b6045f550c74';
const API = 'https://backboard.railway.com/graphql/v2';

async function gql(cookie: string, query: string, variables: any) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie, 'x-requested-with': 'XMLHttpRequest', origin: 'https://railway.com', referer: 'https://railway.com/' },
    body: JSON.stringify({ query, variables }),
  });
  return JSON.parse(await res.text());
}

async function main() {
  const ctx = await chromium.launchPersistentContext(PROFILE_DIR, { headless: true, channel: 'chrome' });
  const cookies = await ctx.cookies(['https://railway.com', 'https://backboard.railway.com']);
  await ctx.close();
  const cookie = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

  console.log('Setting DISABLE_BOT_CHECK=true on Umami service...');
  const r = await gql(
    cookie,
    `mutation VarUpsert($input: VariableUpsertInput!) { variableUpsert(input: $input) }`,
    {
      input: {
        projectId: PROJECT_ID,
        environmentId: ENVIRONMENT_ID,
        serviceId: UMAMI_SERVICE_ID,
        name: 'DISABLE_BOT_CHECK',
        value: 'true',
      },
    },
  );
  console.log('  variable upsert:', JSON.stringify(r));

  console.log('\nRedeploying Umami...');
  const d = await gql(
    cookie,
    `mutation Deploy($environmentId: String!, $serviceId: String!, $commit: Boolean) {
      serviceInstanceDeploy(environmentId: $environmentId, serviceId: $serviceId, latestCommit: $commit)
    }`,
    { environmentId: ENVIRONMENT_ID, serviceId: UMAMI_SERVICE_ID, commit: true },
  );
  console.log('  deploy:', JSON.stringify(d));
}

main().catch((e) => { console.error(e.message); process.exit(1); });
