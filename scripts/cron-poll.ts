#!/usr/bin/env tsx
/**
 * Parliament Audit — Cron Vote Poller
 *
 * Lightweight, standalone polling script designed to run on a cron schedule.
 * Checks ourcommons.ca for new House of Commons recorded divisions,
 * discovers new votes, and runs them through the full pipeline.
 *
 * Unlike the source-watcher service (long-running daemon with node-cron),
 * this script runs once, does its work, and exits — suitable for
 * external schedulers (cron, Railway cron, systemd timers, Task Scheduler).
 *
 * Relies on the same pipeline as auto-poll.ts (normalize → article → store)
 * but adds structured logging, health-check output, and cleaner exit handling.
 *
 * Usage:
 *   npx tsx scripts/cron-poll.ts                   # normal poll
 *   npx tsx scripts/cron-poll.ts --dry-run          # detect only, no processing
 *   npx tsx scripts/cron-poll.ts --force 143        # re-process a specific vote
 *   npx tsx scripts/cron-poll.ts --discovery-only   # insert stub records, skip article gen
 *
 * Environment:
 *   DATABASE_URL          — PostgreSQL connection string (required)
 *   OPENAI_API_KEY        — For AI article generation (optional in discovery-only mode)
 *   X_API_KEY, etc.       — For social posting (optional)
 *
 * Exit codes:
 *   0 — Success (including "nothing to do")
 *   1 — Fatal error (fetch failed, DB unreachable, etc.)
 */

import 'dotenv/config';
import { db, schema } from '../packages/db/src/client.js';
import { eq, and, sql } from 'drizzle-orm';
import { XMLParser } from 'fast-xml-parser';

// ─── Configuration ───────────────────────────────────────────────────────────

const PARLIAMENT = 45;
const SESSION = 1;
const VOTE_LIST_URL = `https://www.ourcommons.ca/Members/en/Votes/XML?parlSession=${PARLIAMENT}-${SESSION}`;
const USER_AGENT = 'ParliamentAudit/1.0 (civic media; contact@parliamentaudit.ca)';
const INTER_VOTE_DELAY_MS = 2000;

// ─── CLI args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isDiscoveryOnly = args.includes('--discovery-only');
const forceIdx = args.indexOf('--force');
const forceVote = forceIdx !== -1 ? parseInt(args[forceIdx + 1], 10) : null;

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(message: string): void {
  const ts = new Date().toISOString();
  console.log(`[cron-poll ${ts}] ${message}`);
}

function logError(message: string, err?: unknown): void {
  const ts = new Date().toISOString();
  const detail = err instanceof Error ? err.message : String(err ?? '');
  console.error(`[cron-poll ${ts}] ERROR: ${message}${detail ? ' — ' + detail : ''}`);
}

// ─── XML parsing ─────────────────────────────────────────────────────────────

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
});

function sanitizeXml(xml: string): string {
  return xml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!--[\s\S]*/g, '')
    .replace(/\r\n/g, '\n')
    .trim();
}

interface VoteListEntry {
  voteNumber: number;
  date?: string;
  description?: string;
  decision?: string;
  yeaTotal?: number;
  nayTotal?: number;
  billNumber?: string;
}

/**
 * Fetch the list of all recorded divisions from ourcommons.ca XML feed.
 */
async function fetchVoteList(): Promise<VoteListEntry[]> {
  const resp = await fetch(VOTE_LIST_URL, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'application/xml, text/xml',
    },
    signal: AbortSignal.timeout(30_000),
  });

  if (!resp.ok) {
    throw new Error(`Vote list fetch failed: HTTP ${resp.status} ${resp.statusText}`);
  }

  const raw = await resp.text();
  const xml = sanitizeXml(raw);
  const parsed = xmlParser.parse(xml);

  // Handle varying XML structures from ourcommons.ca
  const votesNode = parsed?.ArrayOfVote?.Vote
    ?? parsed?.ArrayOfVoteDetails?.VoteDetails
    ?? parsed?.VoteDetails
    ?? [];

  const votesList = Array.isArray(votesNode) ? votesNode : [votesNode];

  return votesList
    .filter((v: any) => v && (v.DecisionDivisionNumber ?? v.VoteNumber))
    .map((v: any): VoteListEntry => ({
      voteNumber: parseInt(v.DecisionDivisionNumber ?? v.VoteNumber, 10),
      date: v.DecisionEventDateTime ?? v.Date ?? v.VoteDate,
      description: v.DecisionDivisionSubject ?? v.Description ?? v.Subject,
      decision: v.DecisionResultName ?? v.Decision ?? v.Result,
      yeaTotal: v.DecisionDivisionNumberOfYeas ? parseInt(v.DecisionDivisionNumberOfYeas, 10) : undefined,
      nayTotal: v.DecisionDivisionNumberOfNays ? parseInt(v.DecisionDivisionNumberOfNays, 10) : undefined,
      billNumber: v.BillNumberCode ?? v.BillNumber ?? v.RelatedBillNumber,
    }))
    .filter((e) => !isNaN(e.voteNumber))
    .sort((a, b) => a.voteNumber - b.voteNumber);
}

// ─── Database queries ────────────────────────────────────────────────────────

async function getKnownVoteNumbers(): Promise<Set<number>> {
  const rows = await db
    .select({ voteNumber: schema.votes.voteNumber })
    .from(schema.votes)
    .where(and(
      eq(schema.votes.chamber, 'house'),
      eq(schema.votes.parliament, PARLIAMENT),
      eq(schema.votes.session, SESSION),
    ));
  return new Set(rows.map(r => r.voteNumber));
}

/**
 * Insert a minimal "stub" vote record for discovery-only mode.
 * This records the vote number so it won't be re-discovered, but
 * defers the full pipeline (normalize + article) to a later run.
 */
async function insertStubVote(entry: VoteListEntry): Promise<void> {
  const voteDate = entry.date
    ? new Date(entry.date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  await db.insert(schema.votes).values({
    chamber: 'house',
    parliament: PARLIAMENT,
    session: SESSION,
    voteNumber: entry.voteNumber,
    voteDate,
    subjectText: entry.description || `House Vote #${entry.voteNumber}`,
    voteType: 'recorded_division',
    result: (entry.decision ?? 'unknown').toLowerCase().includes('agreed') ? 'passed' : 'unknown',
    yeasTotal: entry.yeaTotal ?? 0,
    naysTotal: entry.nayTotal ?? 0,
    recordStatus: 'stub',
    sourceUrl: `https://www.ourcommons.ca/Members/en/votes/${PARLIAMENT}/${SESSION}/${entry.voteNumber}`,
    billNumber: entry.billNumber ?? null,
  }).onConflictDoNothing();
}

// ─── Full pipeline processing ────────────────────────────────────────────────

type ProcessOutcome = 'published' | 'review' | 'error';

/**
 * Process a vote through the full pipeline: normalize, generate article, store.
 * Dynamically imports the heavy dependencies only when needed.
 */
async function processVoteFullPipeline(voteNumber: number): Promise<ProcessOutcome> {
  try {
    // Lazy-import heavy pipeline modules
    const { normalizeHouseVote } = await import('../services/vote-normalizer/src/normalize.js');
    const { generateArticle } = await import('../services/content-generator/src/chains/article-chain.js');
    const { shouldAutoPublish } = await import('../services/content-generator/src/confidence.js');

    // 1. Normalize (scrape + classify)
    const normalized = await normalizeHouseVote({ voteNumber });

    // 2. Upsert vote record
    const [voteRecord] = await db
      .insert(schema.votes)
      .values({
        chamber: normalized.chamber,
        parliament: normalized.parliament,
        session: normalized.session,
        voteNumber: normalized.voteNumber,
        voteDate: normalized.voteDate,
        voteTime: normalized.voteTime,
        subjectText: normalized.subjectText,
        billNumber: normalized.billNumber,
        billTitle: normalized.billTitle,
        billStage: normalized.billStage,
        voteType: normalized.voteType,
        motionText: normalized.motionText,
        sponsorName: normalized.sponsorName,
        sponsorParty: normalized.sponsorParty,
        result: normalized.result,
        yeasTotal: normalized.yeasTotal,
        naysTotal: normalized.naysTotal,
        pairedTotal: normalized.pairedTotal,
        abstentionsTotal: normalized.abstentionsTotal,
        recordStatus: normalized.recordStatus,
        sourceUrl: normalized.sourceUrl,
        billUrl: normalized.billUrl,
        hansardUrl: normalized.hansardUrl,
        legisinfoUrl: normalized.legisinfoUrl,
        sittingNumber: normalized.sittingNumber,
        rawXml: null,
      })
      .onConflictDoUpdate({
        target: [schema.votes.chamber, schema.votes.parliament, schema.votes.session, schema.votes.voteNumber],
        set: {
          subjectText: normalized.subjectText,
          result: normalized.result,
          yeasTotal: normalized.yeasTotal,
          naysTotal: normalized.naysTotal,
          recordStatus: normalized.recordStatus,
          updatedAt: new Date(),
        },
      })
      .returning();

    // 3. Upsert party results
    await db.delete(schema.votePartyResults)
      .where(eq(schema.votePartyResults.voteId, voteRecord.id));

    for (const party of normalized.partyResults as any[]) {
      await db.insert(schema.votePartyResults).values({
        voteId: voteRecord.id,
        partyShort: party.partyShort,
        partyName: party.partyName,
        yeas: party.yeas,
        nays: party.nays,
        paired: party.paired,
        abstentions: party.abstentions,
        absent: party.absent,
        caucusSize: party.caucusSize,
      });
    }

    // 4. Upsert member results
    for (const member of normalized.memberResults as any[]) {
      await db.insert(schema.voteMemberResults).values({
        voteId: voteRecord.id,
        memberName: member.memberName,
        memberId: member.memberId,
        partyShort: member.partyShort,
        constituency: member.constituency,
        province: member.province,
        voteCast: member.voteCast,
      }).onConflictDoNothing();
    }

    // 5. Generate article
    const result = await generateArticle({
      ...normalized,
      partyResults: normalized.partyResults as any[],
      memberResults: normalized.memberResults as any[],
      sources: normalized.sources ?? [],
      rawXml: null,
    });

    // 6. Determine publication status
    const autoOk = shouldAutoPublish(result.confidence, voteRecord.recordStatus);
    const status = autoOk ? 'published' : 'in_review';
    const publishedAt = autoOk ? new Date() : null;

    // 7. Upsert article
    const existing = await db.query.articles.findFirst({
      where: eq(schema.articles.voteId, voteRecord.id),
    });

    const articleData = {
      slug: result.article.slug,
      headline: result.article.headline,
      subheadline: result.article.subheadline,
      summary: result.article.summary,
      whatHappened: result.article.whatHappened,
      partyBreakdown: result.article.partyBreakdown,
      whyItMatters: result.article.whyItMatters,
      whatNext: result.article.whatNext,
      factBoxJson: result.article.factBox,
      sourcesJson: { sources: [{ label: 'Official vote record', url: voteRecord.sourceUrl }] },
      verificationText: `Vote data sourced directly from ourcommons.ca. Fact-check: ${result.factCheck.passed ? 'Passed' : 'Flagged'}.`,
      status,
      confidenceScore: result.confidence.overall,
      generationModel: result.model,
      generationPromptVersion: result.promptVersion,
      factCheckPassed: result.factCheck.passed,
      factCheckDetails: result.factCheck,
      publishedAt,
      updatedAt: new Date(),
    };

    if (existing) {
      await db.update(schema.articles)
        .set(articleData)
        .where(eq(schema.articles.id, existing.id));
    } else {
      await db.insert(schema.articles)
        .values({ voteId: voteRecord.id, ...articleData });
    }

    // 8. Create draft social posts
    const platforms = ['x', 'facebook', 'instagram', 'threads'] as const;
    const imageUrl = `https://parliamentaudit.ca/api/og/vote/${result.article.slug}`;
    for (const platform of platforms) {
      const content = result.social[platform];
      if (!content) continue;
      await db.insert(schema.socialPosts).values({
        articleId: existing?.id ?? (await db.query.articles.findFirst({
          where: eq(schema.articles.voteId, voteRecord.id),
        }))!.id,
        voteId: voteRecord.id,
        platform,
        captionText: 'text' in content ? content.text : content.caption,
        hashtags: 'hashtags' in content ? content.hashtags : [],
        linkUrl: `https://parliamentaudit.ca/vote/${result.article.slug}`,
        imageUrl,
        status: 'draft',
      }).onConflictDoNothing();
    }

    return status === 'published' ? 'published' : 'review';
  } catch (err) {
    logError(`Vote #${voteNumber} pipeline failed`, err);
    return 'error';
  }
}

// ─── Graceful shutdown ───────────────────────────────────────────────────────

let shuttingDown = false;

function setupShutdownHandlers(): void {
  const shutdown = (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    log(`Received ${signal}, finishing current work...`);
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const startedAt = Date.now();
  setupShutdownHandlers();

  log(`Parliament Audit cron poller starting`);
  log(`Parliament ${PARLIAMENT}-${SESSION} | mode: ${isDryRun ? 'dry-run' : isDiscoveryOnly ? 'discovery-only' : 'full-pipeline'}`);

  // Verify DB connectivity
  try {
    const [row] = await db.execute(sql`SELECT 1 as ok`);
    log('Database connection OK');
  } catch (err) {
    logError('Database connection failed', err);
    process.exit(1);
  }

  // Handle --force mode
  if (forceVote !== null && !isNaN(forceVote)) {
    log(`Force processing vote #${forceVote}`);
    if (!isDryRun) {
      const outcome = await processVoteFullPipeline(forceVote);
      log(`Vote #${forceVote} result: ${outcome}`);
    } else {
      log('Dry run — skipping');
    }
    log('Done');
    process.exit(0);
  }

  // Normal mode: discover new votes
  let feedEntries: VoteListEntry[];
  try {
    feedEntries = await fetchVoteList();
    log(`ourcommons.ca feed: ${feedEntries.length} recorded divisions for ${PARLIAMENT}-${SESSION}`);
  } catch (err) {
    logError('Failed to fetch vote list from ourcommons.ca', err);
    process.exit(1);
  }

  const knownNumbers = await getKnownVoteNumbers();
  const newEntries = feedEntries.filter(e => !knownNumbers.has(e.voteNumber));

  log(`Database: ${knownNumbers.size} known votes`);
  log(`New votes: ${newEntries.length}${newEntries.length > 0 ? ' — ' + newEntries.map(e => `#${e.voteNumber}`).join(', ') : ''}`);

  if (newEntries.length === 0) {
    log('Nothing to do. Exiting.');
    process.exit(0);
  }

  if (isDryRun) {
    log('Dry run — would process these votes. Exiting.');
    process.exit(0);
  }

  // Process new votes oldest-first
  const results = { published: 0, review: 0, discovered: 0, error: 0 };

  for (const entry of newEntries) {
    if (shuttingDown) {
      log('Shutdown requested — stopping after current vote');
      break;
    }

    log(`Processing vote #${entry.voteNumber}...`);

    if (isDiscoveryOnly) {
      try {
        await insertStubVote(entry);
        results.discovered++;
        log(`Vote #${entry.voteNumber} — stub inserted (discovery-only)`);
      } catch (err) {
        logError(`Vote #${entry.voteNumber} stub insert failed`, err);
        results.error++;
      }
    } else {
      const outcome = await processVoteFullPipeline(entry.voteNumber);
      results[outcome === 'published' ? 'published' : outcome === 'review' ? 'review' : 'error']++;
      log(`Vote #${entry.voteNumber} — ${outcome}`);
    }

    // Brief pause between votes to respect rate limits
    if (newEntries.indexOf(entry) < newEntries.length - 1 && !shuttingDown) {
      await new Promise(r => setTimeout(r, INTER_VOTE_DELAY_MS));
    }
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);

  if (isDiscoveryOnly) {
    log(`Complete in ${elapsed}s — discovered: ${results.discovered}, errors: ${results.error}`);
  } else {
    log(`Complete in ${elapsed}s — published: ${results.published}, in_review: ${results.review}, errors: ${results.error}`);
  }

  process.exit(0);
}

main().catch(err => {
  logError('Fatal error', err);
  process.exit(1);
});
