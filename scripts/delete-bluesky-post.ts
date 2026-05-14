/**
 * Delete a single Bluesky post by its AT URI. Use when a post went
 * out with content that we need to retract (e.g. misleading image
 * card attached via the OG render).
 *
 * Usage:
 *   npx tsx scripts/delete-bluesky-post.ts --uri at://did:plc:.../app.bsky.feed.post/<rkey>
 *   npx tsx scripts/delete-bluesky-post.ts --uri <uri> --dry-run
 *
 * The user-facing tradeoff of deletion: views and engagement on the
 * deleted post are lost. Only do this when leaving the post up causes
 * larger reputational harm than the lost engagement.
 */
import 'dotenv/config';
import { AtpAgent } from '@atproto/api';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const uri = arg('uri');
  const dry = process.argv.includes('--dry-run');
  if (!uri) {
    console.error('Usage: --uri at://did:plc:.../app.bsky.feed.post/<rkey> [--dry-run]');
    process.exit(1);
  }

  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) {
    throw new Error('Bluesky creds missing');
  }
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD });
  console.log(`[bsky-delete] auth ok as @${agent.session?.handle}`);

  if (dry) {
    console.log(`[bsky-delete] DRY-RUN — would delete: ${uri}`);
    return;
  }

  await agent.deletePost(uri);
  console.log(`[bsky-delete] deleted ${uri}`);
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
