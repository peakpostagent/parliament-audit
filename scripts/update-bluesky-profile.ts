/**
 * Update Parliament Audit's Bluesky display name + bio via the AT Protocol API.
 * Matches the brand voice used on X after the Apr 15 rebrand.
 */

import 'dotenv/config';
import { AtpAgent } from '@atproto/api';

const NEW_DISPLAY_NAME = 'Parliament Audit';
const NEW_DESCRIPTION =
  'Canadian parliamentary votes, legislation, and accountability — tracked and explained. Non-partisan. Factual. Transparent.\n\nparliamentaudit.ca';

async function main() {
  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) {
    console.error('Missing BLUESKY_HANDLE / BLUESKY_APP_PASSWORD in .env');
    process.exit(1);
  }

  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD });
  const did = agent.session!.did;
  console.log(`Authenticated as @${agent.session?.handle} (${did})`);

  const res = await agent.api.com.atproto.repo.getRecord({
    repo: did,
    collection: 'app.bsky.actor.profile',
    rkey: 'self',
  });
  const existing = res.data.value as Record<string, unknown>;
  console.log('Current fields:', {
    displayName: existing.displayName,
    descriptionLen: (existing.description as string | undefined)?.length,
  });

  const newRecord = {
    ...existing,
    $type: 'app.bsky.actor.profile',
    displayName: NEW_DISPLAY_NAME,
    description: NEW_DESCRIPTION,
  };

  await agent.api.com.atproto.repo.putRecord({
    repo: did,
    collection: 'app.bsky.actor.profile',
    rkey: 'self',
    record: newRecord,
  });

  console.log('Profile updated.');
  console.log(`  Display name: ${NEW_DISPLAY_NAME}`);
  console.log(`  Description: ${NEW_DESCRIPTION.slice(0, 80)}...`);
  console.log(`  View: https://bsky.app/profile/${agent.session?.handle}`);
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
