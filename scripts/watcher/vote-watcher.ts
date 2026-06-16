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
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const BOOTSTRAP = args.includes('--bootstrap');
function arg(name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
}
const SINCE = arg('since') ? parseInt(arg('since')!, 10) : undefined;
const SESSION = arg('session') || '45-1';
// Cap live posts per invocation. A sitting day can produce 10+
// divisions; with two cron ticks/day this keeps vote posts to ≤2/day so
// they don't crowd out the accountability content that actually drives
// engagement. Overflow is DROPPED (marked seen), not backlogged — a
// vote tally posted 3 days late is worthless, and a stale backlog was
// the old failure mode. Lowered 2→1 on 2026-06-16 alongside the
// stricter judge().
const MAX_POSTS_PER_RUN = 1;

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

/**
 * Bills we've covered editorially — any recorded division on these is
 * worth posting, at any stage. Keep in sync with the articles we've
 * shipped + topic-taxonomy BILL_TOPICS.
 */
const TRACKED_BILLS = new Set(['C-9', 'C-22', 'C-12', 'C-11', 'C-225']);

/**
 * Selective worth-posting heuristic (tightened 2026-06-16).
 *
 * Earlier version posted EVERY numbered-bill vote and every procedural
 * motion with a keyword match (time allocation, concurrence, estimates).
 * Result: the Bluesky feed filled with low-value tally posts that drew
 * literally zero engagement (0♥/0↻/0💬 across a week) and crowded out
 * the accountability content that actually grows followers. We now post
 * only genuinely notable divisions:
 *   - close votes (margin ≤ 10) — always news, even procedural
 *   - bills we cover editorially (TRACKED_BILLS) — any stage
 *   - final passage of a bill (3rd reading / adoption / royal assent)
 *   - lopsided-but-notable: a bill defeated, or unanimous on a bill
 * Everything else — time allocation, report-stage churn, routine 2nd
 * readings, estimates, opposition motions — is skipped.
 */
function judge(vote: VoteRecord): Verdict {
  const total = vote.yeas + vote.nays;
  const margin = Math.abs(vote.yeas - vote.nays);
  const sub = vote.subject.toLowerCase();
  const bill = (vote.billNumberCode || '').replace(/\s+/g, '').toUpperCase();

  // ── Hard skips ──────────────────────────────────────────────────
  if (vote.documentTypeName === 'Ways and means') {
    return { worth: false, category: 'skip', reason: 'Ways-and-means motion (procedural)' };
  }
  if (vote.documentTypeName === 'Supply' && !vote.billNumberCode) {
    return { worth: false, category: 'skip', reason: 'Non-bill Supply / Opposition Motion (procedural)' };
  }
  if (total < 50) {
    return { worth: false, category: 'skip', reason: `Low quorum (${total} ballots cast)` };
  }

  // ── 1. Genuinely close votes. In a minority Parliament the routine
  //       whipped government margin is ~7, so ≤5 means it was actually
  //       tight (a few absences could have flipped it) — that's news.
  if (margin <= 5) {
    return { worth: true, category: 'close', reason: `Close vote (margin ${margin})` };
  }

  // Procedural motions that flood the feed: only the close ones (caught
  // above) get through. Everything else here is skipped.
  const procedural =
    /time allocation|closure|main estimates|supplementary estimates|concurrence in the budget|opposition motion/.test(sub);
  if (procedural) {
    return { worth: false, category: 'skip', reason: 'Procedural motion, not close' };
  }

  // ── 2. Bills we cover editorially — any stage.
  if (TRACKED_BILLS.has(bill)) {
    return { worth: true, category: 'bill-vote', reason: `Tracked bill (${bill})` };
  }

  // ── 3. Final passage of a bill (becomes law or dies). Skip the
  //       earlier-stage / report-stage churn.
  if (bill && /third reading|3rd reading|and adoption|royal assent/.test(sub)) {
    return { worth: true, category: 'bill-vote', reason: `Final passage (${bill})` };
  }

  // ── 4. A bill actually defeated is news regardless of stage.
  if (bill && vote.result === 'Negatived') {
    return { worth: true, category: 'bill-vote', reason: `Bill defeated (${bill})` };
  }

  // ── 5. Unanimous on a substantive bill.
  if (bill && vote.nays === 0 && total >= 150) {
    return { worth: true, category: 'unanimous', reason: 'Unanimous on a bill' };
  }

  return { worth: false, category: 'skip', reason: 'Not notable enough to post' };
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
      console.log(`   [DRY-RUN] would post to Bluesky`);
      wouldPost++;
      continue;
    }
    // ── Apply mode: post to Bluesky ──────────────────────────────────
    // No Sonnet proofread gate here by design: the draft is a
    // deterministic template fill from the official ourcommons XML
    // (result, tally, subject verbatim) — there is no generated prose
    // to mis-frame. The link card points at the official division
    // page; vote posts get no X mirror for now (feed-card images need
    // an article slug; X cadence is covered by the article pipeline).
    if (posted >= MAX_POSTS_PER_RUN) {
      // DROP overflow rather than backlog it. Marking seen advances
      // lastSeenDivision past these so they never post stale days later.
      // We accept losing coverage of the excess notable votes — a media
      // account posts the day's most-timely division, not all of them.
      state.skippedIds[v.id] = {
        reason: 'over per-run cap — dropped to avoid stale backlog',
        at: state.lastPollAt!,
      };
      skipped++;
      console.log(`   [APPLY] per-run cap reached — dropping ${v.id} (no stale backlog)`);
      continue;
    }
    try {
      const tmpFile = join(tmpdir(), `vote-${v.id}-${Date.now()}.txt`);
      writeFileSync(tmpFile, draft, 'utf8');
      const officialUrl = `https://www.ourcommons.ca/members/en/votes/${v.parliament}/${v.session}/${v.divisionNumber}`;
      const out = execSync(
        `npx tsx scripts/post-arbitrary-bluesky.ts --text-file ${JSON.stringify(tmpFile)} --url ${JSON.stringify(officialUrl)} --campaign ${JSON.stringify(`vote-${v.id}`)} --no-cta`,
        { cwd: ROOT, encoding: 'utf8', timeout: 120_000 },
      );
      const uriMatch = out.match(/uri=(at:\/\/\S+)/);
      if (!out.includes('verified live')) {
        console.error(`   [APPLY] ✗ Bluesky post not verified for ${v.id} — will retry next poll`);
        continue; // not marked seen; retried next run
      }
      state.postedIds[v.id] = {
        postedAt: state.lastPollAt!,
        bskyUri: uriMatch?.[1],
      };
      posted++;
      console.log(`   [APPLY] ✓ posted ${v.id} → ${uriMatch?.[1] ?? '(uri not captured)'}`);
    } catch (e: any) {
      console.error(`   [APPLY] ✗ post failed for ${v.id}: ${(e?.message || String(e)).slice(0, 160)}`);
      continue; // not marked seen; retried next run
    }
  }

  // Advance lastSeenDivision only through the CONTIGUOUS prefix of
  // decided candidates (posted or skipped). A capped or failed post
  // must stay below the cutoff so the next poll retries it — blanket
  // advancing to the newest division would silently orphan them.
  for (const v of candidates) {
    const decided = state.postedIds[v.id] || state.skippedIds[v.id];
    if (!decided) break;
    state.lastSeenDivision = Math.max(state.lastSeenDivision, v.divisionNumber);
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
