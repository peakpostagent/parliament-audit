/**
 * Resolve speculative handles in watchlist.json against live Bluesky.
 *
 * For each entry marked `resolveable: true`:
 *   1. Try to resolve the handle as-is (com.atproto.identity.resolveHandle)
 *   2. If that fails, search Bluesky by name (app.bsky.actor.searchActors)
 *      and surface the top 3 candidates for human confirmation
 *
 * Writes a patch suggestion to scripts/social-brief/watchlist-suggestions.md
 * that the user can review + use to edit watchlist.json manually. We do
 * NOT auto-edit the watchlist — handle collisions and impersonators are a
 * real risk and we want human eyeballs before committing a handle change.
 *
 * Usage:
 *   npx tsx scripts/social-brief/resolve-watchlist.ts
 */

import 'dotenv/config';
import { AtpAgent } from '@atproto/api';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface Entry {
  handle: string;
  name: string;
  outlet?: string;
  party?: string;
  weight: number;
  notes?: string;
  resolveable?: boolean;
}

interface SearchHit {
  handle: string;
  did: string;
  displayName?: string;
  description?: string;
  followersCount?: number;
}

async function createAgent(): Promise<AtpAgent> {
  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) {
    throw new Error('BLUESKY_HANDLE and BLUESKY_APP_PASSWORD must be set');
  }
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: BLUESKY_HANDLE,
    password: BLUESKY_APP_PASSWORD,
  });
  return agent;
}

async function tryResolve(agent: AtpAgent, handle: string): Promise<string | null> {
  try {
    const res = await agent.com.atproto.identity.resolveHandle({ handle });
    return res.data.did;
  } catch {
    return null;
  }
}

async function searchActors(
  agent: AtpAgent,
  query: string,
  limit = 5,
): Promise<SearchHit[]> {
  try {
    const res = await agent.app.bsky.actor.searchActors({ term: query, limit });
    return (res.data.actors || []).map((a: any) => ({
      handle: a.handle,
      did: a.did,
      displayName: a.displayName,
      description: a.description,
      followersCount: a.followersCount,
    }));
  } catch {
    return [];
  }
}

async function main() {
  const ROOT = process.cwd();
  const watchlistPath = resolve(ROOT, 'scripts/social-brief/watchlist.json');
  const outputPath = resolve(ROOT, 'scripts/social-brief/watchlist-suggestions.md');

  const watchlist = JSON.parse(readFileSync(watchlistPath, 'utf8'));
  const agent = await createAgent();

  const allEntries: Array<Entry & { group: string }> = [
    ...watchlist.journalists.map((e: Entry) => ({ ...e, group: 'journalists' })),
    ...watchlist.mps_leaders.map((e: Entry) => ({ ...e, group: 'mps_leaders' })),
    ...watchlist.parties.map((e: Entry) => ({ ...e, group: 'parties' })),
    ...watchlist.advocacy_watchdogs.map((e: Entry) => ({ ...e, group: 'advocacy_watchdogs' })),
    ...watchlist.primary_sources.map((e: Entry) => ({ ...e, group: 'primary_sources' })),
  ];

  const lines: string[] = [];
  lines.push('# Watchlist handle resolution — ' + new Date().toISOString().slice(0, 10));
  lines.push('');
  lines.push(
    `Ran \`resolve-watchlist.ts\` against ${allEntries.length} watchlist entries. For each speculative handle, either confirms it resolves or surfaces the top Bluesky search hits for manual selection.`,
  );
  lines.push('');
  lines.push('For each suggestion you agree with: edit `scripts/social-brief/watchlist.json` to swap the handle + drop the `resolveable: true` flag.');
  lines.push('');
  lines.push('---');
  lines.push('');

  let resolved = 0;
  let stillMissing = 0;

  for (const e of allEntries) {
    const did = await tryResolve(agent, e.handle);
    if (did) {
      resolved += 1;
      if (e.resolveable) {
        lines.push(`## ✅ \`${e.handle}\` (${e.name}) — resolves`);
        lines.push('');
        lines.push(`- did: \`${did}\``);
        lines.push(`- action: drop \`resolveable: true\` from \`${e.group}\` entry`);
        lines.push('');
      }
      continue;
    }
    // Only search when we marked it speculative
    if (!e.resolveable) continue;
    stillMissing += 1;

    lines.push(`## ❌ \`${e.handle}\` (${e.name}) — no resolve`);
    lines.push('');
    lines.push(`Searching Bluesky for "${e.name}"…`);
    lines.push('');

    const hits = await searchActors(agent, e.name, 5);
    if (hits.length === 0) {
      lines.push('_No search hits. Might not be on Bluesky yet._');
    } else {
      lines.push('| Handle | Display name | Followers | Bio snippet |');
      lines.push('|---|---|---|---|');
      for (const hit of hits) {
        const bio = (hit.description || '').slice(0, 80).replace(/\|/g, '\\|').replace(/\n/g, ' ');
        lines.push(
          `| @${hit.handle} | ${hit.displayName || '—'} | ${hit.followersCount ?? '—'} | ${bio} |`,
        );
      }
    }
    lines.push('');
    lines.push(`- action: if any of the above is the real person, edit \`${e.group}\` entry in \`watchlist.json\`:`);
    lines.push(`    - change \`handle\` to the correct Bluesky handle`);
    lines.push(`    - drop the \`resolveable: true\` flag`);
    lines.push('- if none match: leave as-is (person may not be on Bluesky)');
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(`## Summary`);
  lines.push('');
  lines.push(`- Resolved: **${resolved} / ${allEntries.length}**`);
  lines.push(`- Still unresolved (marked speculative): **${stillMissing}**`);
  lines.push('');
  lines.push(`Watchlist totals by group:`);
  lines.push(`- journalists: ${watchlist.journalists.length}`);
  lines.push(`- mps_leaders: ${watchlist.mps_leaders.length}`);
  lines.push(`- parties: ${watchlist.parties.length}`);
  lines.push(`- advocacy_watchdogs: ${watchlist.advocacy_watchdogs.length}`);
  lines.push(`- primary_sources: ${watchlist.primary_sources.length}`);

  writeFileSync(outputPath, lines.join('\n'), 'utf8');
  console.log(`[resolve-watchlist] ${resolved}/${allEntries.length} resolved, ${stillMissing} still speculative.`);
  console.log(`[resolve-watchlist] Suggestions written to ${outputPath}`);
}

main().catch((e) => {
  console.error('[resolve-watchlist] Fatal:', e?.message || e);
  process.exit(1);
});
