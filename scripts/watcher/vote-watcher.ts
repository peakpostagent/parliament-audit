/**
 * House of Commons recorded-vote watcher.
 *
 * Pattern borrowed from @govtrack.us (4,864 Bluesky followers, 2,290 posts):
 * post a breakdown of every recorded vote within hours of the division.
 * GovTrack's cadence is what compounds — at one post per division, the
 * archive itself becomes the brand.
 *
 * Data source:
 *   https://www.ourcommons.ca/Members/en/Votes/XML?parlSession=45-1&output=XML
 *
 * Each <Vote> element exposes:
 *   - DecisionDivisionNumber (unique id within the session)
 *   - DecisionEventDateTime (ISO without zone — assume ET / Ottawa time)
 *   - DecisionDivisionSubject (full motion text)
 *   - DecisionResultName ("Agreed To" / "Negatived" / "Tied")
 *   - DecisionDivisionNumberOfYeas / NumberOfNays / NumberOfPaired
 *   - DecisionDivisionDocumentTypeName + DocumentTypeId
 *     (e.g. "Legislative Process" / "Ways and means" / "Supply")
 *   - BillNumberCode (e.g. "C-11"; empty for non-bill motions)
 *
 * What this watcher does on each invocation:
 *   1. Fetch the XML feed
 *   2. Parse to vote records
 *   3. Diff against content/social-briefs/.vote-watcher-state.json
 *      (gitignored) — find unseen DecisionDivisionNumbers
 *   4. For each new vote, decide if it's worth a post:
 *      - skip Ways and Means motions (DocumentTypeName == "Ways and means")
 *      - skip Supply / Opposition Motions when not on a numbered bill
 *      - skip if yeas+nays < 50 (low quorum, often procedural)
 *      - flag interesting if: vote was close (within 10), unanimous,
 *        on a numbered bill, or had a meaningful subject keyword
 *   5. In --apply mode: draft a post via Sonnet, run proofread,
 *      post to Bluesky, queue X mirror.
 *      In dry-run (default): print what would be posted.
 *
 * Out of scope for this skeleton (deferred to follow-up):
 *   - Per-party vote splits (need per-vote detail XML at a different URL)
 *   - The full Sonnet draft + proofread + publish chain
 *
 * Usage:
 *   npx tsx scripts/watcher/vote-watcher.ts                    # dry-run
 *   npx tsx scripts/watcher/vote-watcher.ts --apply           # post live
 *   npx tsx scripts/watcher/vote-watcher.ts --since 100       # re-check from DDN 100
 *   npx tsx scripts/watcher/vote-watcher.ts --bootstrap       # mark all current as seen, post none
 */
import 'dotenv/config';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const BOOTSTRAP = args.includes('--bootstrap');
function arg(name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
}
const SINCE = arg('since') ? parseInt(arg('since')!, 10) : undefined;
const SESSION = arg('session') || '45-1';

const ROOT = process.cwd();
const STATE_DIR = resolve(ROOT, 'content/social-briefs');
mkdirSync(STATE_DIR, { recursive: true });
const STATE_PATH = join(STATE_DIR, '.vote-watcher-state.json');

const FEED_URL = `https://www.ourcommons.ca/Members/en/Votes/XML?parlSession=${SESSION}&output=XML`;

interface VoteRecord {
  /** ParliamentNumber-SessionNumber-DivisionNumber, e.g. "45-1-119". Globally unique. */
  id: string;
  parliament: number;
  session: number;
  divisionNumber: number;
  decisionAt: string; // ISO without zone (Ottawa time)
  subject: string;
  result: 'Agreed To' | 'Negatived' | 'Tied' | string;
  yeas: number;
  nays: number;
  paired: number;
  documentTypeName: string;
  documentTypeId: number;
  billNumberCode: string; // empty string if not a bill vote
}

interface WatcherState {
  lastSeenDivision: number; // highest divisionNumber we've decided about
  postedIds: Record<string, { postedAt: string; bskyUri?: string; note?: string }>;
  skippedIds: Record<string, { reason: string; at: string }>;
  lastPollAt: string | null;
}

function loadState(): WatcherState {
  const empty: WatcherState = {
    lastSeenDivision: 0,
    postedIds: {},
    skippedIds: {},
    lastPollAt: null,
  };
  if (!existsSync(STATE_PATH)) return empty;
  try {
    return { ...empty, ...JSON.parse(readFileSync(STATE_PATH, 'utf8')) };
  } catch {
    return empty;
  }
}
function saveState(s: WatcherState) {
  writeFileSync(STATE_PATH, JSON.stringify(s, null, 2));
}

// ── XML parsing (minimal, no library) ────────────────────────────────
// We extract <Vote>…</Vote> blocks then pull each field by tag name.
// Robust enough for the predictable shape ourcommons.ca emits.
function extractVotes(xml: string): VoteRecord[] {
  const votes: VoteRecord[] = [];
  const blockRe = /<Vote>[\s\S]*?<\/Vote>/g;
  const blocks = xml.match(blockRe) || [];
  for (const block of blocks) {
    const f = (tag: string): string => {
      const m = block.match(new RegExp(`<${tag}>([^<]*)</${tag}>|<${tag} ?/>`));
      return m ? (m[1] ?? '').trim() : '';
    };
    const fi = (tag: string): number => parseInt(f(tag) || '0', 10) || 0;
    const parliament = fi('ParliamentNumber');
    const session = fi('SessionNumber');
    const divisionNumber = fi('DecisionDivisionNumber');
    if (!divisionNumber) continue;
    votes.push({
      id: `${parliament}-${session}-${divisionNumber}`,
      parliament,
      session,
      divisionNumber,
      decisionAt: f('DecisionEventDateTime'),
      subject: f('DecisionDivisionSubject'),
      result: f('DecisionResultName'),
      yeas: fi('DecisionDivisionNumberOfYeas'),
      nays: fi('DecisionDivisionNumberOfNays'),
      paired: fi('DecisionDivisionNumberOfPaired'),
      documentTypeName: f('DecisionDivisionDocumentTypeName'),
      documentTypeId: fi('DecisionDivisionDocumentTypeId'),
      billNumberCode: f('BillNumberCode'),
    });
  }
  // Newest-first → reverse so we iterate chronologically
  votes.sort((a, b) => a.divisionNumber - b.divisionNumber);
  return votes;
}

// ── Worth-posting heuristic ──────────────────────────────────────────
interface Verdict {
  worth: boolean;
  category: 'close' | 'unanimous' | 'bill-vote' | 'noteworthy' | 'skip';
  reason: string;
}
function judge(vote: VoteRecord): Verdict {
  const total = vote.yeas + vote.nays;

  // Hard skips: procedural noise
  if (vote.documentTypeName === 'Ways and means') {
    return { worth: false, category: 'skip', reason: 'Ways-and-means motion (procedural)' };
  }
  // Skip Supply motions that aren't on a numbered bill
  if (vote.documentTypeName === 'Supply' && !vote.billNumberCode) {
    return { worth: false, category: 'skip', reason: 'Non-bill Supply / Opposition Motion (procedural)' };
  }
  // Skip very low quorum
  if (total < 50) {
    return { worth: false, category: 'skip', reason: `Low quorum (${total} ballots cast)` };
  }

  // Worth-posting cases
  const margin = Math.abs(vote.yeas - vote.nays);
  if (margin <= 10) {
    return { worth: true, category: 'close', reason: `Close vote (margin ${margin})` };
  }
  if (vote.nays === 0 && total >= 100) {
    return { worth: true, category: 'unanimous', reason: 'Unanimous (or near-unanimous) decision' };
  }
  if (vote.billNumberCode && /^(C|S)-\d+/.test(vote.billNumberCode)) {
    return { worth: true, category: 'bill-vote', reason: `Numbered bill vote (${vote.billNumberCode})` };
  }
  // Subject keywords that flag noteworthy
  const sub = vote.subject.toLowerCase();
  const keywords = [
    'time allocation',
    'closure',
    'concurrence at report stage',
    'royal assent',
    'concurrence in the budget',
    'amendment',
    'opposition motion',
    'main estimates',
    'supplementary estimates',
  ];
  if (keywords.some((k) => sub.includes(k))) {
    return { worth: true, category: 'noteworthy', reason: 'Subject keyword match' };
  }
  return { worth: false, category: 'skip', reason: 'No worth-posting signal' };
}

// ── Post drafting (deterministic format) ─────────────────────────────
function buildBlueskyDraft(v: VoteRecord, verdict: Verdict): string {
  const subject = v.subject.length > 140 ? v.subject.slice(0, 140) + '…' : v.subject;
  const resultEmoji = v.result === 'Agreed To' ? '✓' : v.result === 'Negatived' ? '✗' : '○';
  const tally = `${v.yeas}–${v.nays}${v.paired ? ` (paired ${v.paired})` : ''}`;
  const lead = v.billNumberCode
    ? `Bill ${v.billNumberCode}`
    : `Division ${v.divisionNumber}`;
  const flavour =
    verdict.category === 'close'
      ? 'Close vote.'
      : verdict.category === 'unanimous'
        ? 'Unanimous.'
        : verdict.category === 'bill-vote'
          ? ''
          : '';
  // Keep ≤ ~270 chars body so the auto-CTA fits on Bluesky.
  return [
    `${lead}: ${v.result} ${tally}.`,
    flavour ? `${flavour}` : null,
    '',
    subject,
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 270);
}

// ── Main ─────────────────────────────────────────────────────────────
async function main() {
  console.log(`[vote-watcher] polling ${FEED_URL}`);
  const xmlRes = await fetch(FEED_URL, {
    headers: { 'user-agent': 'ParliamentAuditVoteWatcher/1.0' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!xmlRes.ok) {
    console.error(`[vote-watcher] feed HTTP ${xmlRes.status}`);
    process.exit(1);
  }
  const xml = await xmlRes.text();
  const votes = extractVotes(xml);
  console.log(`[vote-watcher] feed has ${votes.length} votes (oldest DDN ${votes[0]?.divisionNumber}, newest ${votes[votes.length - 1]?.divisionNumber})`);

  const state = loadState();
  state.lastPollAt = new Date().toISOString();

  // Determine the threshold: only consider votes with divisionNumber
  // strictly greater than lastSeenDivision (or --since override).
  const cutoff =
    SINCE !== undefined
      ? SINCE
      : state.lastSeenDivision;

  const candidates = votes.filter((v) => v.divisionNumber > cutoff);
  console.log(`[vote-watcher] ${candidates.length} candidates after cutoff DDN ${cutoff}`);

  // BOOTSTRAP mode: mark everything as seen + skip without posting.
  // Run once when first wiring the watcher into a live cron, to avoid
  // back-posting weeks of historical votes.
  if (BOOTSTRAP) {
    for (const v of candidates) {
      state.skippedIds[v.id] = {
        reason: 'bootstrap: pre-existing vote at watcher install',
        at: state.lastPollAt!,
      };
    }
    if (votes.length) {
      state.lastSeenDivision = Math.max(state.lastSeenDivision, votes[votes.length - 1].divisionNumber);
    }
    saveState(state);
    console.log(`[vote-watcher] bootstrap done. lastSeenDivision=${state.lastSeenDivision}`);
    return;
  }

  let posted = 0;
  let skipped = 0;
  let wouldPost = 0;
  for (const v of candidates) {
    const verdict = judge(v);
    console.log(
      `\n[${v.id}] ${verdict.worth ? '✓' : '·'} ${verdict.category.padEnd(11)} | ${v.result.padEnd(10)} ${v.yeas}-${v.nays}${v.billNumberCode ? ` | Bill ${v.billNumberCode}` : ''} | ${verdict.reason}`,
    );
    console.log(`   subject: ${v.subject.slice(0, 140)}`);
    if (!verdict.worth) {
      state.skippedIds[v.id] = { reason: verdict.reason, at: state.lastPollAt! };
      skipped++;
      continue;
    }
    const draft = buildBlueskyDraft(v, verdict);
    console.log(`   ---DRAFT (${draft.length} chars)---`);
    console.log(
      draft
        .split('\n')
        .map((l) => `   ${l}`)
        .join('\n'),
    );
    if (!APPLY) {
      console.log(`   [DRY-RUN] would post to Bluesky + queue X mirror`);
      wouldPost++;
      continue;
    }
    // ── Apply mode: post Bluesky + queue X mirror ───────────────────
    // (Deferred: invoke post-arbitrary-bluesky.ts here + add to
    //  scripts/social-brief/x-mirror-queue.json. Sonnet proofread runs
    //  first; reject if BLOCK.)
    console.log(`   [APPLY] (publish chain not yet wired — placeholder)`);
    state.postedIds[v.id] = { postedAt: state.lastPollAt!, note: 'apply path not yet wired' };
    posted++;
  }

  if (candidates.length) {
    state.lastSeenDivision = Math.max(state.lastSeenDivision, candidates[candidates.length - 1].divisionNumber);
  }
  saveState(state);

  console.log(
    `\n[vote-watcher] done. posted=${posted}${APPLY ? '' : ` (would-post=${wouldPost})`}, skipped=${skipped}. lastSeenDivision=${state.lastSeenDivision}`,
  );
}

main().catch((e) => {
  console.error('[vote-watcher] fatal:', e?.message || e);
  process.exit(1);
});
