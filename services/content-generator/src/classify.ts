/**
 * Vote Classification — local copy for content-generator.
 * Avoids cross-service src/ imports from vote-normalizer.
 */

import type { VoteType, BillStage, Significance, VoteClassification } from '@parliament-pulse/shared';
import { VOTE_TYPE_SIGNIFICANCE } from '@parliament-pulse/shared';

export function classifyVote(subjectText: string, billNumber?: string | null): VoteClassification {
  const lower = subjectText.toLowerCase();
  let voteType: VoteType = 'other';
  let billStage: BillStage | null = null;
  let isSubstantive = false;
  let isConfidenceRelated = false;
  let reasoning = '';

  if (lower.includes('time allocation')) {
    voteType = 'time_allocation';
    reasoning = 'Subject text contains "time allocation".';
  } else if (lower.includes('closure')) {
    voteType = 'closure';
    reasoning = 'Subject text contains "closure".';
  } else if (lower.includes('3rd reading') || lower.includes('third reading')) {
    voteType = 'bill_third_reading';
    billStage = 'third_reading';
    isSubstantive = true;
    reasoning = 'Third reading vote — final stage in this chamber.';
  } else if (lower.includes('2nd reading') || lower.includes('second reading')) {
    voteType = 'bill_second_reading';
    billStage = 'second_reading';
    isSubstantive = true;
    reasoning = 'Second reading vote.';
  } else if (lower.includes('report stage')) {
    voteType = 'bill_report_stage';
    billStage = 'report_stage';
    isSubstantive = true;
    reasoning = 'Report stage vote.';
  } else if (lower.includes('senate amendment')) {
    voteType = 'senate_amendment';
    isSubstantive = true;
    reasoning = 'Vote on a Senate amendment.';
  } else if (lower.includes('amendment')) {
    voteType = 'amendment';
    isSubstantive = true;
    reasoning = 'Vote on an amendment.';
  } else if (lower.includes('concurrence')) {
    voteType = 'concurrence';
    isSubstantive = true;
    reasoning = 'Concurrence motion.';
  } else if (lower.includes('supply') || lower.includes('appropriation') || lower.includes('estimates')) {
    voteType = 'supply';
    isSubstantive = true;
    isConfidenceRelated = true;
    reasoning = 'Supply/appropriation vote.';
  } else if (lower.includes('ways and means')) {
    voteType = 'ways_and_means';
    isSubstantive = true;
    reasoning = 'Ways and means motion.';
  } else if (lower.includes('committee report') || lower.includes('report of the')) {
    voteType = 'committee_report';
    reasoning = 'Vote on a committee report.';
  } else if (billNumber) {
    const num = parseInt(billNumber.replace(/[^0-9]/g, ''), 10);
    if (billNumber.toUpperCase().startsWith('C-') && num >= 200) {
      voteType = 'private_members_bill';
      isSubstantive = true;
      reasoning = `Bill ${billNumber} is a private member's bill.`;
    } else if (billNumber.toUpperCase().startsWith('C-') || billNumber.toUpperCase().startsWith('S-')) {
      isSubstantive = true;
      reasoning = `Vote involves bill ${billNumber}.`;
    }
  }

  if (lower.includes('confidence') || lower.includes('non-confidence') || lower.includes('want of confidence')) {
    isConfidenceRelated = true;
  }
  if (lower.includes('budget') || lower.includes('throne speech') || lower.includes('address in reply')) {
    isConfidenceRelated = true;
  }

  const significance: Significance = VOTE_TYPE_SIGNIFICANCE[voteType] || 'low';

  return { voteType, billStage, isSubstantive, isConfidenceRelated, significance, reasoning };
}
