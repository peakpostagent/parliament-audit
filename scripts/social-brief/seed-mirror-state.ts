/**
 * One-off seeder for .x-mirror-state.json.
 *
 * The mirror script tracks which Bluesky posts have been mirrored to X
 * by URI. But X cross-posts done manually (e.g. via the
 * post-floor-crossing-x.ts batch) don't carry the Bluesky URI, so the
 * mirror script can't know they're already on X.
 *
 * This helper walks recent Bluesky posts and lets you mark a slice as
 * "already mirrored" without actually posting anything — solves the
 * dedupe problem when manual and automated cross-posts mix.
 *
 * Usage:
 *   npx tsx scripts/social-brief/seed-mirror-state.ts \
 *     --since 2d \
 *     --containing "team feudalism,533 votes,Resigning,Marilyn Gladu told a local"
 *
 *   --since        time window (default 7d)
 *   --containing   comma-separated text snippets; any matching post is marked mirrored
 *   --apply        actually write state (dry-run by default)
 */

import 'dotenv/config';
import { AtpAgent } from '@atproto/api';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
function arg(name: string, dflt?: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : dflt;
}
const SINCE = arg('since', '7d')!;
const CONTAINING = (arg('containing') || '').split(',').map((s) => s.trim()).filter(Boolean);

if (CONTAINING.length === 0) {
  console.error('--containing is required (comma-separated text snippets)');
  process.exit(1);
}

const STATE_PATH = resolve(process.cwd(), 'content/social-briefs/.x-mirror-state.json');

function parseSince(s: string): number {
  const m = s.match(/^(\d+)([dh])$/);
  if (!m) throw new Error('--since must be like "7d" or "48h"');
  const n = parseInt(m[1], 10);
  return m[2] === 'd' ? n * 24 * 3600 * 1000 : n * 3600 * 1000;
}

interface MirrorState {
  mirrored: Record<string, { mirroredAt: string; finalText: string }>;
  skipped: Record<string, { reason: string; skippedAt: string }>;
  todayCount: number;
  todayDate: string;
  lastPostedAt: string | null;
}

async function main() {
  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) throw new Error('Bluesky creds missing');
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD });

  const sinceMs = parseSince(SINCE);
  const did = agent.session!.did;

  let cursor: string | undefined;
  const matches: Array<{ uri: string; createdAt: string; text: string }> = [];
  for (let p = 0; p < 5; p++) {
    const res = await agent.getAuthorFeed({ actor: did, limit: 50, filter: 'posts_no_replies', cursor });
    cursor = res.data.cursor;
    if (!res.data.feed?.length) break;

    let stop = false;
    for (const item of res.data.feed) {
      if ((item.reason as any)?.$type === 'app.bsky.feed.defs#reasonRepost') continue;
      const post = item.post;
      const r = post.record as any;
      if (!r?.text || r.reply) continue;
      const ts = new Date(r.createdAt).getTime();
      if (ts < Date.now() - sinceMs) {
        stop = true;
        break;
      }
      const text = r.text as string;
      if (CONTAINING.some((s) => text.toLowerCase().includes(s.toLowerCase()))) {
        matches.push({ uri: post.uri, createdAt: r.createdAt, text });
      }
    }
    if (stop || !cursor) break;
  }

  console.log(`[seed] matched ${matches.length} posts in last ${SINCE} containing any of:`);
  for (const c of CONTAINING) console.log(`         "${c}"`);
  console.log('');
  for (const m of matches) {
    console.log(`  ${m.createdAt}  "${m.text.slice(0, 90).replace(/\n/g, ' ')}…"`);
  }

  if (!APPLY) {
    console.log('\n[seed] Dry run. Add --apply to write to .x-mirror-state.json.');
    return;
  }

  const state: MirrorState = existsSync(STATE_PATH)
    ? JSON.parse(readFileSync(STATE_PATH, 'utf8'))
    : {
        mirrored: {},
        skipped: {},
        todayCount: 0,
        todayDate: new Date().toISOString().slice(0, 10),
        lastPostedAt: null,
      };

  let added = 0;
  for (const m of matches) {
    if (state.mirrored[m.uri]) continue;
    state.mirrored[m.uri] = {
      mirroredAt: new Date().toISOString(),
      finalText: m.text + '  [seeded — already-on-X manually]',
    };
    added += 1;
  }

  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  console.log(`\n[seed] Marked ${added} additional Bluesky URIs as already-mirrored.`);
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
