/**
 * One-shot Bluesky bootstrap-follow batch for @ParliamentAudit.
 *
 * Reads a curated list of Canadian political-journalism / parliamentary
 * accounts (press gallery, watchdogs, outlets, primary-source institutional
 * accounts), resolves each handle to a DID via com.atproto.identity.resolveHandle
 * to reject typos / dead handles, skips anyone we already follow (graph.getFollows
 * paginated), and follows the remaining set with a small per-call sleep to stay
 * under Bluesky's rate budget.
 *
 * Why this exists: per content/distribution-plan-2026-05-15.md, "the actual lever
 * is replies to high-reach #cdnpoli accounts." That works iff our account is
 * discoverable to those accounts — which only happens once we follow them and
 * appear in their "new follower" notifications + people-you-may-know surfaces.
 *
 * Per voice playbook: this is a one-time bootstrap of ~60 hand-picked accounts,
 * NOT a reciprocal-follow farm. We follow accounts we'd cite as sources, not
 * accounts we hope will follow back.
 *
 * Usage:
 *   npx tsx scripts/social-brief/bootstrap-follows.ts            # dry-run (default)
 *   npx tsx scripts/social-brief/bootstrap-follows.ts --apply   # actually follow
 */
import dotenv from 'dotenv';
dotenv.config({ override: true });
import { AtpAgent } from '@atproto/api';

const APPLY = process.argv.includes('--apply');

// Curated bootstrap list. Hand-picked for: high-trust journalists, factual-feed
// commentators, parliamentary primary sources, civic watchdogs, and major
// news outlets. NO partisan commentary accounts, NO reciprocal-follow farms.
// If a handle doesn't resolve, we drop it silently — better to follow 40 real
// accounts than to try 60 with 20 typos.
const CANDIDATES: string[] = [
  // --- Press-gallery reporters (high-confidence handles from our watchlist) ---
  'aaronwherry.bsky.social',
  'althiaraj.bsky.social',
  'rosiebarton.bsky.social',
  'chebert18.bsky.social',
  'davidakin.bsky.social',
  'stephenmaher.bsky.social',
  'justinling.bsky.social',
  'mattgurney.bsky.social',
  'jesse-brown.bsky.social',
  // --- Additional press-gallery (more speculative but high-value if they resolve) ---
  'rfife.bsky.social',                  // Bob Fife — Globe and Mail bureau chief
  'kadyobmalley.bsky.social',           // Kady O'Malley — long-time parliament watcher
  'mercedesstephenson.bsky.social',     // Global TV
  'rachelaiello.bsky.social',           // CTV
  'evansolomon.bsky.social',
  'sabrinanan.bsky.social',
  'raisaapatel.bsky.social',            // Globe — energy/climate
  'leslieyoung.bsky.social',            // Global — investigations
  'amandacoletta.bsky.social',          // Washington Post Canada correspondent
  // --- Data + analysis ---
  '338canada.bsky.social',              // Philippe J. Fournier — #1 trusted in our list
  'ericgrenier.bsky.social',            // The Writ — polling
  // --- News outlets ---
  'cbcnews.bsky.social',
  'globeandmail.bsky.social',
  'hilltimes.bsky.social',
  'thelogic.bsky.social',
  'nationalobserver.bsky.social',
  'canadialand.bsky.social',
  'halifaxexaminer.bsky.social',
  'theline.bsky.social',
  'policymagazine.bsky.social',
  'thehub.ca',
  'thetyee.bsky.social',
  'macleansmag.bsky.social',
  'thewalrus.bsky.social',
  'canadianpress.bsky.social',
  'ctvnews.bsky.social',
  'torontostar.bsky.social',
  // --- Parliamentary / institutional primary sources ---
  'ourcommons.bsky.social',
  'pbo-dpb.bsky.social',                // Parliamentary Budget Officer
  'elections.ca',                       // Elections Canada
  'oag-bvg.bsky.social',                // Office of the Auditor General
  // --- Watchdogs + think tanks ---
  'democracywatch.bsky.social',
  'samaracanada.bsky.social',           // Samara Centre for Democracy
  'cdhowe.bsky.social',                 // C.D. Howe Institute — we cited them today
  'policyalternatives.ca',              // Canadian Centre for Policy Alternatives
  'irpp.bsky.social',                   // Institute for Research on Public Policy
  'broadbentinst.bsky.social',
  'publicpolicyforum.bsky.social',
  'fraserinstitute.bsky.social',
  // --- Party + leader accounts (factual primary-source amplification only) ---
  'markcarney.bsky.social',
  'pierrepoilievre.bsky.social',
  'jagmeetsingh.bsky.social',
  'yfblanchet.bsky.social',
  'liberal.bsky.social',
  'ndp.bsky.social',
  'blocquebecois.bsky.social',
  'canadiangreens.bsky.social',
];

async function main() {
  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) throw new Error('Bluesky creds missing');
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD });
  const ourDid = agent.session!.did;
  console.log(`[bootstrap] auth ok as @${agent.session!.handle} (${ourDid})`);
  console.log(`[bootstrap] candidate set: ${CANDIDATES.length}`);

  // --- 1. Resolve every candidate to a DID. Drop the unresolvable ones. ---
  type Resolved = { handle: string; did: string };
  const resolved: Resolved[] = [];
  const unresolved: string[] = [];
  for (const handle of CANDIDATES) {
    try {
      const res = await agent.com.atproto.identity.resolveHandle({ handle });
      resolved.push({ handle, did: res.data.did });
    } catch (e: any) {
      unresolved.push(handle);
    }
    // Tiny pause — resolveHandle is cheap but courteous.
    await new Promise((r) => setTimeout(r, 80));
  }
  console.log(`[bootstrap] resolved: ${resolved.length}/${CANDIDATES.length}`);
  if (unresolved.length) {
    console.log(`[bootstrap] unresolved (handle not found — likely speculative or moved):`);
    for (const h of unresolved) console.log(`  - ${h}`);
  }

  // --- 2. Pull our current follow graph so we don't re-follow anyone. ---
  const alreadyFollowing = new Set<string>();
  let cursor: string | undefined;
  for (let page = 0; page < 20; page++) {
    const r = await agent.getFollows({ actor: ourDid, limit: 100, cursor });
    for (const f of r.data.follows) alreadyFollowing.add(f.did);
    if (!r.data.cursor) break;
    cursor = r.data.cursor;
  }
  console.log(`[bootstrap] currently following ${alreadyFollowing.size} accounts`);

  const toFollow = resolved.filter((r) => !alreadyFollowing.has(r.did));
  console.log(`[bootstrap] to follow now: ${toFollow.length} (${resolved.length - toFollow.length} already followed)`);

  if (toFollow.length === 0) {
    console.log('[bootstrap] nothing to do.');
    return;
  }

  // --- 3. Preview ---
  console.log('\n[bootstrap] preview:');
  for (const r of toFollow) console.log(`  + @${r.handle}`);

  if (!APPLY) {
    console.log('\n[bootstrap] dry run. Pass --apply to actually follow.');
    return;
  }

  // --- 4. Apply with per-call sleep. Bluesky's published rate budget is
  //         generous but we sleep ~250ms between follows to stay polite. ---
  let ok = 0;
  let fail = 0;
  for (const r of toFollow) {
    try {
      await agent.follow(r.did);
      console.log(`  [ok]   @${r.handle}`);
      ok++;
    } catch (e: any) {
      console.log(`  [fail] @${r.handle}: ${(e?.message || String(e)).slice(0, 100)}`);
      fail++;
    }
    await new Promise((res) => setTimeout(res, 250));
  }
  console.log(`\n[bootstrap] done. followed ${ok}, failed ${fail}, unresolved ${unresolved.length}.`);
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
