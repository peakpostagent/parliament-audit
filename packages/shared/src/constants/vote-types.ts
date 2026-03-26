/**
 * Vote type classification helpers.
 */

import type { VoteType, BillStage, Significance } from '../types/vote.js';

export const VOTE_TYPE_LABELS: Record<VoteType, string> = {
  bill_second_reading: 'Second Reading',
  bill_third_reading: 'Third Reading',
  bill_report_stage: 'Report Stage',
  amendment: 'Amendment',
  concurrence: 'Concurrence Motion',
  time_allocation: 'Time Allocation',
  closure: 'Closure',
  supply: 'Supply / Appropriation',
  ways_and_means: 'Ways and Means',
  committee_report: 'Committee Report',
  private_members_bill: "Private Member's Bill",
  senate_amendment: 'Senate Amendment',
  procedural: 'Procedural Motion',
  other: 'Other',
};

export const BILL_STAGE_LABELS: Record<BillStage, string> = {
  first_reading: 'First Reading',
  second_reading: 'Second Reading',
  committee: 'Committee Stage',
  report_stage: 'Report Stage',
  third_reading: 'Third Reading',
  senate_first_reading: 'Senate First Reading',
  senate_second_reading: 'Senate Second Reading',
  senate_committee: 'Senate Committee',
  senate_third_reading: 'Senate Third Reading',
  royal_assent: 'Royal Assent',
};

export const VOTE_TYPE_SIGNIFICANCE: Record<VoteType, Significance> = {
  bill_third_reading: 'high',
  bill_second_reading: 'high',
  bill_report_stage: 'medium',
  amendment: 'medium',
  concurrence: 'medium',
  time_allocation: 'medium',
  closure: 'medium',
  supply: 'high',
  ways_and_means: 'medium',
  committee_report: 'low',
  private_members_bill: 'medium',
  senate_amendment: 'medium',
  procedural: 'low',
  other: 'low',
};

/**
 * Plain-English explanations of vote types, for article generation.
 */
export const VOTE_TYPE_EXPLANATIONS: Record<VoteType, string> = {
  bill_second_reading:
    'A second reading vote is Parliament\'s first major debate on a bill\'s general principles. If it passes, the bill moves to committee for detailed study.',
  bill_third_reading:
    'A third reading vote is the final vote on a bill in this chamber. If it passes, the bill moves to the other chamber (or to Royal Assent if already passed by both).',
  bill_report_stage:
    'A report stage vote considers amendments proposed after committee study. It occurs between committee and third reading.',
  amendment:
    'An amendment vote decides whether to change the text of a bill or motion before the final vote.',
  concurrence:
    'A concurrence vote asks the House to agree with a committee report or with amendments made by the Senate.',
  time_allocation:
    'A time allocation motion limits the amount of debate time on a bill or motion. It is a procedural tool used by the government to advance legislation.',
  closure:
    'A closure motion ends debate on a question. It is a procedural tool that forces an immediate vote.',
  supply:
    'A supply vote authorizes government spending. These votes are part of the annual budget process.',
  ways_and_means:
    'A ways and means motion authorizes new taxes or changes to taxation. These are required before a tax bill can be introduced.',
  committee_report:
    'This vote considers whether to adopt a report produced by a parliamentary committee.',
  private_members_bill:
    'A vote on a bill introduced by an MP who is not a cabinet minister. Private members\' bills have limited debate time.',
  senate_amendment:
    'This vote considers amendments to a bill that were made by the Senate.',
  procedural:
    'A procedural vote deals with the rules or schedule of the House, rather than the substance of legislation.',
  other:
    'This vote does not fit neatly into standard categories.',
};
