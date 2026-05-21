/**
 * Per-MP topical voting aggregator.
 *
 * Joins the topic taxonomy (apps/web/src/content/topic-taxonomy.ts)
 * with per-MP vote data to produce the "voted strongly for X" summary
 * sentences that TheyWorkForYou / They Vote For You put on every MP
 * page. The summary sentence is the most-distinctive feature of those
 * sites; turning our raw vote data into per-MP-per-topic counts is
 * the data layer that everything else hangs off.
 *
 * Data sources:
 *   - ourcommons.ca XML votes feed (the vote-watcher already polls
 *     this) → totals + bill code + subject
 *   - OpenParliament API: GET https://api.openparliament.ca/votes/
 *     → per-MP yea/nay/paired/absent for each division. Free, no
 *       auth, well-documented.
 *
 * Output:
 *   - content/analytics/per-mp-topical.json (gitignored). Structure:
 *       {
 *         generatedAt: '2026-05-20T...',
 *         session: '45-1',
 *         topics: { '<topic>': { totalVotes: N } },
 *         mps: {
 *           '<mp slug>': {
 *             name, party, riding,
 *             topical: {
 *               '<topic>': { yea: N, nay: N, abstain: N, total: N,
 *                            label: 'voted strongly for X' }
 *             }
 *           }
 *         }
 *       }
 *
 * The "voted strongly for X" label is derived deterministically from
 * the yea/nay ratio:
 *   ≥ 80% yea  → "voted strongly for"
 *   60–79% yea → "voted for"
 *   40–59%     → "mixed votes on"
 *   20–39% yea → "voted against"
 *   < 20% yea  → "voted strongly against"
 *   < 5 votes  → "too few votes to summarize" (suppress in UI)
 *
 * Status as of 2026-05-20: SKELETON — the per-MP data source is not
 * yet wired. Today's runs produce an empty `mps` map and a populated
 * `topics` block (because total counts come from the totals-only
 * XML feed which we DO have). The follow-up task #23 wires
 * OpenParliament's API + the per-MP rendering on /find-your-mp.
 *
 * Usage:
 *   npx tsx scripts/analytics/per-mp-topical.ts
 *   npx tsx scripts/analytics/per-mp-topical.ts --session 45-1
 */
import 'dotenv/config';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

// Re-export the taxonomy from the web app (importing across the
// monorepo). tsx handles the path-alias resolution implicitly via
// tsconfig.
import {
  type Topic,
  TOPICS,
  TOPIC_LABELS,
  tagsForVote,
} from '../../apps/web/src/content/topic-taxonomy';

const args = process.argv.slice(2);
function arg(name: string, dflt: string): string {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : dflt;
}
const SESSION = arg('session', '45-1');

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, 'content/analytics');
mkdirSync(OUT_DIR, { recursive: true });
const OUT_PATH = join(OUT_DIR, 'per-mp-topical.json');

interface VoteRow {
  divisionNumber: number;
  subject: string;
  result: string;
  yeas: number;
  nays: number;
  billNumberCode: string;
  decisionAt: string;
  topics: Topic[];
}

// ── Pull totals from ourcommons.ca (we already have a parser; this is
//    a smaller standalone copy to avoid a circular import) ─────────────
async function fetchVotes(): Promise<VoteRow[]> {
  const url = `https://www.ourcommons.ca/Members/en/Votes/XML?parlSession=${SESSION}&output=XML`;
  const res = await fetch(url, {
    headers: { 'user-agent': 'ParliamentAuditPerMPTopical/1.0' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`feed HTTP ${res.status}`);
  const xml = await res.text();
  const blocks = xml.match(/<Vote>[\s\S]*?<\/Vote>/g) || [];
  const out: VoteRow[] = [];
  for (const b of blocks) {
    const f = (tag: string) =>
      (b.match(new RegExp(`<${tag}>([^<]*)</${tag}>|<${tag} ?/>`)) || ['', ''])[1] || '';
    const fi = (tag: string) => parseInt(f(tag) || '0', 10) || 0;
    const subject = f('DecisionDivisionSubject');
    const billNumberCode = f('BillNumberCode');
    out.push({
      divisionNumber: fi('DecisionDivisionNumber'),
      subject,
      result: f('DecisionResultName'),
      yeas: fi('DecisionDivisionNumberOfYeas'),
      nays: fi('DecisionDivisionNumberOfNays'),
      billNumberCode,
      decisionAt: f('DecisionEventDateTime'),
      topics: tagsForVote(billNumberCode, subject),
    });
  }
  return out.sort((a, b) => a.divisionNumber - b.divisionNumber);
}

// ── Label maker: turn a yea/nay ratio into a TheyWorkForYou phrase ───
export function labelFor(yea: number, nay: number, abstain = 0): string {
  const decisive = yea + nay;
  if (decisive < 5) return 'too few votes to summarize';
  const ratio = yea / decisive;
  if (ratio >= 0.8) return 'voted strongly for';
  if (ratio >= 0.6) return 'voted for';
  if (ratio >= 0.4) return 'mixed votes on';
  if (ratio >= 0.2) return 'voted against';
  return 'voted strongly against';
}

// ── Aggregate ────────────────────────────────────────────────────────
interface TopicSummary {
  totalVotes: number;
  billCount: number;
  closeVotes: number; // margin ≤ 10
}
interface MPTopicSummary {
  yea: number;
  nay: number;
  abstain: number;
  total: number;
  label: string;
}
interface PerMPTopical {
  generatedAt: string;
  session: string;
  topics: Record<Topic, TopicSummary>;
  mps: Record<
    string,
    {
      name: string;
      party: string;
      riding: string;
      topical: Record<Topic, MPTopicSummary>;
    }
  >;
  meta: {
    totalDivisions: number;
    taggedDivisions: number;
    untaggedDivisions: number;
    perMpDataSource: 'openparliament-api' | 'not-yet-wired';
  };
}

function emptyTopicSummary(): TopicSummary {
  return { totalVotes: 0, billCount: 0, closeVotes: 0 };
}

async function main() {
  console.log('[per-mp-topical] fetching ourcommons totals…');
  const votes = await fetchVotes();
  console.log(`[per-mp-topical] feed has ${votes.length} votes`);

  const topics: Record<Topic, TopicSummary> = {} as any;
  for (const t of TOPICS) topics[t] = emptyTopicSummary();

  let taggedDivisions = 0;
  let untaggedDivisions = 0;
  const billSeen = new Set<string>();

  for (const v of votes) {
    if (v.topics.length === 0) {
      untaggedDivisions++;
      continue;
    }
    taggedDivisions++;
    const close = Math.abs(v.yeas - v.nays) <= 10;
    for (const t of v.topics) {
      topics[t].totalVotes += 1;
      if (close) topics[t].closeVotes += 1;
      if (v.billNumberCode) {
        const key = `${t}:${v.billNumberCode}`;
        if (!billSeen.has(key)) {
          billSeen.add(key);
          topics[t].billCount += 1;
        }
      }
    }
  }

  // Per-MP data is not yet wired. The follow-up task will pull from
  // OpenParliament's API. For now, the `mps` map is empty but the
  // taxonomy + totals are correct, so the rendering layer can be
  // built against this shape now.
  const result: PerMPTopical = {
    generatedAt: new Date().toISOString(),
    session: SESSION,
    topics,
    mps: {},
    meta: {
      totalDivisions: votes.length,
      taggedDivisions,
      untaggedDivisions,
      perMpDataSource: 'not-yet-wired',
    },
  };

  writeFileSync(OUT_PATH, JSON.stringify(result, null, 2));
  console.log(`[per-mp-topical] wrote ${OUT_PATH}`);
  console.log(`[per-mp-topical] coverage: ${taggedDivisions}/${votes.length} divisions tagged (${untaggedDivisions} fell through both the bill map and the subject keyword map)`);
  console.log(`\n[per-mp-topical] topical breakdown (session ${SESSION}):`);
  const rows = TOPICS.map((t) => ({
    topic: t,
    label: TOPIC_LABELS[t].label,
    ...topics[t],
  })).sort((a, b) => b.totalVotes - a.totalVotes);
  for (const r of rows) {
    if (r.totalVotes === 0) continue;
    console.log(
      `  ${r.topic.padEnd(24)} ${String(r.totalVotes).padStart(3)} votes  ${String(r.billCount).padStart(2)} bills  ${String(r.closeVotes).padStart(2)} close`,
    );
  }
}

main().catch((e) => {
  console.error('[per-mp-topical] fatal:', e?.message || e);
  process.exit(1);
});
