/**
 * Vote Classification
 *
 * Classifies votes by type, stage, significance, and whether they are
 * substantive (about legislation) or procedural.
 */

import type { VoteType, BillStage, Significance, VoteClassification } from '@parliament-audit/shared';
import { VOTE_TYPE_SIGNIFICANCE } from '@parliament-audit/shared';

/**
 * Classify a vote based on its subject text and bill number.
 */
export function classifyVote(subjectText: string, billNumber?: string | null): VoteClassification {
  const lower = subjectText.toLowerCase();
  let voteType: VoteType = 'other';
  let billStage: BillStage | null = null;
  let isSubstantive = false;
  let isConfidenceRelated = false;
  let reasoning = '';

  // Time allocation / closure (procedural but significant)
  if (lower.includes('time allocation')) {
    voteType = 'time_allocation';
    reasoning = 'Subject text contains "time allocation" — a government procedural motion to limit debate.';
  } else if (lower.includes('closure')) {
    voteType = 'closure';
    reasoning = 'Subject text contains "closure" — a procedural motion to end debate.';
  }
  // Bill stage votes
  else if (lower.includes('3rd reading') || lower.includes('third reading')) {
    voteType = 'bill_third_reading';
    billStage = 'third_reading';
    isSubstantive = true;
    reasoning = 'Third reading vote — final stage in this chamber.';
  } else if (lower.includes('2nd reading') || lower.includes('second reading')) {
    voteType = 'bill_second_reading';
    billStage = 'second_reading';
    isSubstantive = true;
    reasoning = 'Second reading vote — debate on the bill\'s general principles.';
  } else if (lower.includes('report stage')) {
    voteType = 'bill_report_stage';
    billStage = 'report_stage';
    isSubstantive = true;
    reasoning = 'Report stage vote — considering amendments after committee study.';
  }
  // Amendments
  else if (lower.includes('amendment')) {
    voteType = 'amendment';
    isSubstantive = true;
    reasoning = 'Vote on an amendment to a bill or motion.';
    if (lower.includes('senate amendment')) {
      voteType = 'senate_amendment';
      reasoning = 'Vote on an amendment proposed by the Senate.';
    }
  }
  // Concurrence
  else if (lower.includes('concurrence')) {
    voteType = 'concurrence';
    isSubstantive = true;
    reasoning = 'Concurrence motion — House asked to agree with a report or Senate action.';
  }
  // Supply / budget
  else if (lower.includes('supply') || lower.includes('appropriation') || lower.includes('estimates')) {
    voteType = 'supply';
    isSubstantive = true;
    isConfidenceRelated = true;
    reasoning = 'Supply/appropriation vote — authorizes government spending. Traditionally a confidence matter.';
  }
  // Ways and means
  else if (lower.includes('ways and means')) {
    voteType = 'ways_and_means';
    isSubstantive = true;
    reasoning = 'Ways and means motion — precedes introduction of a tax bill.';
  }
  // Committee report
  else if (lower.includes('committee report') || lower.includes('report of the')) {
    voteType = 'committee_report';
    reasoning = 'Vote on a committee report.';
  }
  // Private members' bill detection
  else if (billNumber) {
    const num = parseInt(billNumber.replace(/[^0-9]/g, ''), 10);
    if (billNumber.toUpperCase().startsWith('C-') && num >= 200) {
      voteType = 'private_members_bill';
      isSubstantive = true;
      reasoning = `Bill ${billNumber} is numbered 200+, indicating a private member's bill.`;
    } else if (billNumber.toUpperCase().startsWith('C-') || billNumber.toUpperCase().startsWith('S-')) {
      isSubstantive = true;
      reasoning = `Vote involves bill ${billNumber} but stage could not be determined from subject text.`;
    }
  }
  // Confidence detection
  if (lower.includes('confidence') || lower.includes('non-confidence') || lower.includes('want of confidence')) {
    isConfidenceRelated = true;
    reasoning += ' Explicitly mentions confidence.';
  }
  // Budget / throne speech — also confidence-related
  if (lower.includes('budget') || lower.includes('throne speech') || lower.includes('address in reply')) {
    isConfidenceRelated = true;
  }

  if (voteType === 'other' && !reasoning) {
    reasoning = 'Could not determine a specific vote type from the subject text. Classified as "other".';
  }

  const significance: Significance = VOTE_TYPE_SIGNIFICANCE[voteType] || 'low';

  return {
    voteType,
    billStage,
    isSubstantive,
    isConfidenceRelated,
    significance,
    reasoning,
  };
}
