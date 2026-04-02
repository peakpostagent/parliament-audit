/**
 * Confidence Scoring
 *
 * Computes a confidence score for an article based on data quality,
 * source reliability, and fact-check results. Used to determine
 * whether an article can be auto-published or needs human review.
 */

import type { NormalizedVote, FactCheckResult, ConfidenceScore } from '@parliament-audit/shared';

export const AUTO_PUBLISH_THRESHOLD = 0.85;

export function computeConfidence(
  vote: NormalizedVote,
  factCheck: FactCheckResult,
): ConfidenceScore {
  let score = 1.0;
  const flags: string[] = [];

  // ── Data Completeness ──
  let dataCompleteness = 1.0;

  if (!vote.billNumber) {
    score -= 0.05;
    dataCompleteness -= 0.1;
    flags.push('no_bill_number');
  }

  if (vote.memberResults.length === 0) {
    score -= 0.2;
    dataCompleteness -= 0.3;
    flags.push('no_member_breakdown');
  }

  if (!vote.billTitle) {
    score -= 0.03;
    dataCompleteness -= 0.1;
    flags.push('no_bill_title');
  }

  // ── Source Quality ──
  let sourceOfficial = 1.0;

  if (vote.recordStatus === 'preliminary') {
    score -= 0.1;
    sourceOfficial = 0.7;
    flags.push('preliminary_record');
  }

  if (vote.chamber === 'senate') {
    score -= 0.05;
    sourceOfficial -= 0.1;
    flags.push('senate_scraped_data');
  }

  // ── Fact-Check Results ──
  if (!factCheck.passed) {
    score -= 0.3;
    flags.push('fact_check_failed');
  }

  if (factCheck.unverifiedClaims > 0) {
    score -= 0.05 * factCheck.unverifiedClaims;
    flags.push(`${factCheck.unverifiedClaims}_unverified_claims`);
  }

  // Check for specific critical failures
  const partisanFail = factCheck.checks.find(c => c.name === 'no_partisan_language' && !c.passed);
  if (partisanFail) {
    score -= 0.2;
    flags.push('partisan_language_detected');
  }

  const totalsMatch = factCheck.checks.find(c => c.name === 'vote_totals_match');
  if (totalsMatch && !totalsMatch.passed) {
    score -= 0.2;
    flags.push('vote_totals_mismatch');
  }

  // ── Vote Type Confidence ──
  if (vote.voteType === 'other') {
    score -= 0.05;
    flags.push('unclassified_vote_type');
  }

  // Clamp score
  score = Math.max(0, Math.min(1, score));
  dataCompleteness = Math.max(0, Math.min(1, dataCompleteness));
  sourceOfficial = Math.max(0, Math.min(1, sourceOfficial));

  return {
    overall: parseFloat(score.toFixed(3)),
    dataCompleteness: parseFloat(dataCompleteness.toFixed(3)),
    sourceOfficial: parseFloat(sourceOfficial.toFixed(3)),
    factCheckPassed: factCheck.passed,
    claimsVerified: factCheck.verifiedRatio,
    flags,
  };
}

/**
 * Determine if an article should be auto-published based on confidence.
 */
export function shouldAutoPublish(
  confidence: ConfidenceScore,
  recordStatus: string,
): boolean {
  return (
    confidence.overall >= AUTO_PUBLISH_THRESHOLD &&
    confidence.factCheckPassed &&
    recordStatus === 'official' &&
    !confidence.flags.includes('partisan_language_detected') &&
    !confidence.flags.includes('vote_totals_mismatch')
  );
}
