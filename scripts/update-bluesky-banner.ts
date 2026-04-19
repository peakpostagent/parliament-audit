/**
 * Update Parliament Audit's Bluesky profile banner via the AT Protocol API.
 * No browser needed — direct upload + profile-record put.
 *
 * Reads:
 *   - BLUESKY_HANDLE
 *   - BLUESKY_APP_PASSWORD
 * from .env.
 *
 * Usage:
 *   npx tsx scripts/update-bluesky-banner.ts                     # uses docs/banner.png
 *   npx tsx scripts/update-bluesky-banner.ts --file ./other.png  # custom file
 */

import 'dotenv/config';
import { AtpAgent, type BlobRef } from '@atproto/api';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const fileIdx = args.indexOf('--file');
const filePath = resolve(
  process.cwd(),
  fileIdx !== -1 ? args[fileIdx + 1] : 'docs/banner.png',
);

async function main() {
  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) {
    console.error('❌ Missing BLUESKY_HANDLE / BLUESKY_APP_PASSWORD in .env');
    process.exit(1);
  }

  console.log(`[update-banner] Reading banner: ${filePath}`);
  const bytes = new Uint8Array(await readFile(filePath));
  console.log(`[update-banner] File size: ${bytes.length} bytes`);

  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: BLUESKY_HANDLE,
    password: BLUESKY_APP_PASSWORD,
  });
  console.log(`[update-banner] Authenticated as @${agent.session?.handle}`);

  console.log('[update-banner] Uploading banner blob...');
  const upload = await agent.uploadBlob(bytes, { encoding: 'image/png' });
  const bannerBlob: BlobRef = upload.data.blob;
  console.log(`[update-banner] Blob uploaded:`, JSON.stringify(bannerBlob).slice(0, 200));

  console.log('[update-banner] Fetching current profile record...');
  const did = agent.session!.did;
  let existingRecord: any = null;
  try {
    const res = await agent.api.com.atproto.repo.getRecord({
      repo: did,
      collection: 'app.bsky.actor.profile',
      rkey: 'self',
    });
    existingRecord = res.data.value;
    console.log('[update-banner] Existing profile fields:', Object.keys(existingRecord || {}));
  } catch (e: any) {
    console.log('[update-banner] No existing profile record (will create).');
  }

  const newRecord = {
    ...(existingRecord ?? {}),
    $type: 'app.bsky.actor.profile',
    banner: bannerBlob,
  };

  console.log('[update-banner] Putting updated profile record...');
  await agent.api.com.atproto.repo.putRecord({
    repo: did,
    collection: 'app.bsky.actor.profile',
    rkey: 'self',
    record: newRecord,
  });

  console.log(`[update-banner] ✓ Banner updated.`);
  console.log(`   View: https://bsky.app/profile/${agent.session?.handle}`);
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  if (e?.stack) console.error(e.stack.slice(0, 500));
  process.exit(1);
});
