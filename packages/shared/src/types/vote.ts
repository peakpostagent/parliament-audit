/**
 * Core vote types for Parliament Audit.
 * These represent the canonical normalized data model for parliamentary votes.
 */

export type Chamber = 'house' | 'senate';

export type VoteResult = 'passed' | 'failed' | 'tied';

export type RecordStatus = 'preliminary' | 'official' | 'corrected';

export type VoteType =
  | 'bill_second_reading'
  | 'bill_third_reading'
  | 'bill_report_stage'
  | 'amendment'
  | 'concurrence'
  | 'time_allocation'
  | 'closure'
  | 'supply'
  | 'ways_and_means'
  | 'committee_report'
  | 'private_members_bill'
  | 'senate_amendment'
  | 'procedural'
  | 'other';

export type BillStage =
  | 'first_reading'
  | 'second_reading'
  | 'committee'
  | 'report_stage'
  | 'third_reading'
  | 'senate_first_reading'
  | 'senate_second_reading'
  | 'senate_committee'
  | 'senate_third_reading'
  | 'royal_assent';

export type VoteCast = 'yea' | 'nay' | 'paired' | 'abstention' | 'absent';

export type Significance = 'high' | 'medium' | 'low';

export interface PartyResult {
  partyShort: string;
  partyName: string;
  yeas: number;
  nays: number;
  paired: number;
  abstentions: number;
  absent: number;
  caucusSize: number;
}

export interface MemberResult {
  memberName: string;
  memberId: string | null;
  partyShort: string;
  constituency: string | null;
  province: string | null;
  voteCast: VoteCast;
}

export interface SourceRef {
  label: string;
  url: string;
  type: 'official_vote' | 'bill_page' | 'hansard' | 'legisinfo' | 'journals' | 'supplementary';
}

export interface VoteClassification {
  voteType: VoteType;
  billStage: BillStage | null;
  isSubstantive: boolean;
  isConfidenceRelated: boolean;
  significance: Significance;
  reasoning: string;
}

export interface NormalizedVote {
  chamber: Chamber;
  parliament: number;
  session: number;
  voteNumber: number;
  voteDate: string;
  voteTime: string | null;

  subjectText: string;
  billNumber: string | null;
  billTitle: string | null;
  billStage: BillStage | null;
  voteType: VoteType;
  motionText: string | null;
  sponsorName: string | null;
  sponsorParty: string | null;

  result: VoteResult;
  yeasTotal: number;
  naysTotal: number;
  pairedTotal: number;
  abstentionsTotal: number;

  partyResults: PartyResult[];
  memberResults: MemberResult[];

  recordStatus: RecordStatus;
  sources: SourceRef[];

  sourceUrl: string;
  billUrl: string | null;
  hansardUrl: string | null;
  journalsUrl: string | null;
  legisinfoUrl: string | null;

  sittingNumber: number | null;
  rawXml: string | null;
}

export interface VoteSummary {
  id: string;
  chamber: Chamber;
  parliament: number;
  session: number;
  voteNumber: number;
  voteDate: string;
  subjectText: string;
  billNumber: string | null;
  billTitle: string | null;
  voteType: VoteType;
  result: VoteResult;
  yeasTotal: number;
  naysTotal: number;
  recordStatus: RecordStatus;
  slug: string | null;
  hasArticle: boolean;
}
