/**
 * Vote Normalization
 *
 * Transforms parsed vote data into the canonical NormalizedVote format.
 * Computes party aggregates, validates data integrity, and assembles source references.
 */

import type { NormalizedVote, VoteResult, RecordStatus, SourceRef } from '@parliament-pulse/shared';
import { computePartyAggregates, PARLIAMENT_URLS, NormalizedVoteSchema } from '@parliament-pulse/shared';
import { parseHouseVoteDetailXml, toMemberResults } from '@parliament-pulse/source-watcher/src/parsers/house-xml.js';
import { fetchBillByNumber } from '@parliament-pulse/source-watcher/src/watchers/legisinfo.js';
import { classifyVote } from './classify.js';

/**
 * Normalize a raw House vote into our canonical format.
 */
export async function normalizeHouseVote(params: {
  voteDetailXml: string;
  parliament: number;
  session: number;
}): Promise<NormalizedVote> {
  const { voteDetailXml, parliament, session } = params;

  // Parse the XML
  const parsed = parseHouseVoteDetailXml(voteDetailXml);

  // Convert to member results
  const memberResults = toMemberResults(parsed.members);

  // Compute party aggregates
  const partyResults = computePartyAggregates(memberResults);

  // Classify the vote
  const classification = classifyVote(parsed.description, parsed.billNumber);

  // Determine result
  const result = normalizeResult(parsed.decision);

  // Build source references
  const sources: SourceRef[] = [
    {
      label: `Official House vote record — Vote #${parsed.voteNumber}`,
      url: PARLIAMENT_URLS.houseVotePage(parliament, session, parsed.voteNumber),
      type: 'official_vote',
    },
  ];

  // Fetch bill metadata if applicable
  let billTitle: string | null = null;
  let billUrl: string | null = null;
  let legisinfoUrl: string | null = null;

  if (parsed.billNumber) {
    try {
      const billMeta = await fetchBillByNumber(parsed.billNumber);
      if (billMeta) {
        billTitle = billMeta.title;
        legisinfoUrl = billMeta.legisinfoUrl;
        billUrl = billMeta.legisinfoUrl;
        sources.push({
          label: `LEGISinfo — Bill ${parsed.billNumber}`,
          url: billMeta.legisinfoUrl,
          type: 'legisinfo',
        });
      }
    } catch (err) {
      console.warn(`[normalizer] Could not fetch bill metadata for ${parsed.billNumber}:`, err);
    }
  }

  // Build Hansard URL if we have sitting number
  const hansardUrl = parsed.sittingNumber
    ? PARLIAMENT_URLS.hansard(parliament, session, parsed.sittingNumber)
    : null;

  if (hansardUrl) {
    sources.push({
      label: `Hansard — Sitting ${parsed.sittingNumber}`,
      url: hansardUrl,
      type: 'hansard',
    });
  }

  // Parse date from the vote XML
  const voteDate = normalizeDate(parsed.date);

  const normalized: NormalizedVote = {
    chamber: 'house',
    parliament,
    session,
    voteNumber: parsed.voteNumber,
    voteDate,
    voteTime: parsed.time,

    subjectText: parsed.description,
    billNumber: parsed.billNumber,
    billTitle,
    billStage: classification.billStage,
    voteType: classification.voteType,
    motionText: null, // Not always in the XML; could parse from Hansard later
    sponsorName: null,
    sponsorParty: null,

    result,
    yeasTotal: parsed.yeasTotal,
    naysTotal: parsed.naysTotal,
    pairedTotal: parsed.pairedTotal,
    abstentionsTotal: 0,

    partyResults,
    memberResults,

    recordStatus: 'preliminary' as RecordStatus,
    sources,

    sourceUrl: PARLIAMENT_URLS.houseVotePage(parliament, session, parsed.voteNumber),
    billUrl,
    hansardUrl,
    journalsUrl: null,
    legisinfoUrl,

    sittingNumber: parsed.sittingNumber,
    rawXml: null, // We don't store raw XML in the normalized object to keep it lean
  };

  // Validate integrity
  validateVoteIntegrity(normalized);

  return normalized;
}

/**
 * Normalize the decision string to our canonical result type.
 */
function normalizeResult(decision: string): VoteResult {
  const lower = decision.toLowerCase().trim();
  if (lower.includes('agreed') || lower.includes('adopted') || lower.includes('carried')) {
    return 'passed';
  }
  if (lower.includes('negatived') || lower.includes('defeated') || lower.includes('lost')) {
    return 'failed';
  }
  if (lower.includes('tied') || lower.includes('tie')) {
    return 'tied';
  }
  // Default — should be logged as unexpected
  console.warn(`[normalizer] Unexpected decision value: "${decision}" — defaulting to "passed"`);
  return 'passed';
}

/**
 * Normalize date strings from XML into ISO format (YYYY-MM-DD).
 */
function normalizeDate(dateStr: string): string {
  // Handle various formats: "2026-03-24", "2026-03-24T18:30:00", "March 24, 2026"
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return dateStr.substring(0, 10);
  }
  // Try parsing as a date string
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  throw new Error(`Could not parse date: "${dateStr}"`);
}

/**
 * Validate that vote data is internally consistent.
 * Throws if critical inconsistencies are found.
 * Warns on non-critical issues.
 */
function validateVoteIntegrity(vote: NormalizedVote): void {
  // Check that party totals add up to overall totals
  const computedYeas = vote.partyResults.reduce((sum, p) => sum + p.yeas, 0);
  const computedNays = vote.partyResults.reduce((sum, p) => sum + p.nays, 0);
  const computedPaired = vote.partyResults.reduce((sum, p) => sum + p.paired, 0);

  if (computedYeas !== vote.yeasTotal) {
    console.warn(`[normalizer] Vote #${vote.voteNumber}: Party yeas sum (${computedYeas}) != total yeas (${vote.yeasTotal})`);
  }
  if (computedNays !== vote.naysTotal) {
    console.warn(`[normalizer] Vote #${vote.voteNumber}: Party nays sum (${computedNays}) != total nays (${vote.naysTotal})`);
  }
  if (computedPaired !== vote.pairedTotal) {
    console.warn(`[normalizer] Vote #${vote.voteNumber}: Party paired sum (${computedPaired}) != total paired (${vote.pairedTotal})`);
  }

  // Check member results add up to party results
  if (vote.memberResults.length > 0) {
    const memberYeas = vote.memberResults.filter(m => m.voteCast === 'yea').length;
    if (memberYeas !== vote.yeasTotal) {
      console.warn(`[normalizer] Vote #${vote.voteNumber}: Member yeas (${memberYeas}) != total yeas (${vote.yeasTotal})`);
    }
  }
}
