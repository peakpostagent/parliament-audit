import { z } from 'zod';

export const ChamberSchema = z.enum(['house', 'senate']);
export const VoteResultSchema = z.enum(['passed', 'failed', 'tied']);
export const RecordStatusSchema = z.enum(['preliminary', 'official', 'corrected']);
export const VoteCastSchema = z.enum(['yea', 'nay', 'paired', 'abstention', 'absent']);

export const VoteTypeSchema = z.enum([
  'bill_second_reading',
  'bill_third_reading',
  'bill_report_stage',
  'amendment',
  'concurrence',
  'time_allocation',
  'closure',
  'supply',
  'ways_and_means',
  'committee_report',
  'private_members_bill',
  'senate_amendment',
  'procedural',
  'other',
]);

export const BillStageSchema = z.enum([
  'first_reading',
  'second_reading',
  'committee',
  'report_stage',
  'third_reading',
  'senate_first_reading',
  'senate_second_reading',
  'senate_committee',
  'senate_third_reading',
  'royal_assent',
]);

export const PartyResultSchema = z.object({
  partyShort: z.string().min(1),
  partyName: z.string().min(1),
  yeas: z.number().int().min(0),
  nays: z.number().int().min(0),
  paired: z.number().int().min(0),
  abstentions: z.number().int().min(0),
  absent: z.number().int().min(0),
  caucusSize: z.number().int().min(0),
});

export const MemberResultSchema = z.object({
  memberName: z.string().min(1),
  memberId: z.string().nullable(),
  partyShort: z.string().min(1),
  constituency: z.string().nullable(),
  province: z.string().nullable(),
  voteCast: VoteCastSchema,
});

export const SourceRefSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  type: z.enum(['official_vote', 'bill_page', 'hansard', 'legisinfo', 'journals', 'supplementary']),
});

export const NormalizedVoteSchema = z.object({
  chamber: ChamberSchema,
  parliament: z.number().int().min(1),
  session: z.number().int().min(1),
  voteNumber: z.number().int().min(1),
  voteDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  voteTime: z.string().nullable(),

  subjectText: z.string().min(1),
  billNumber: z.string().nullable(),
  billTitle: z.string().nullable(),
  billStage: BillStageSchema.nullable(),
  voteType: VoteTypeSchema,
  motionText: z.string().nullable(),
  sponsorName: z.string().nullable(),
  sponsorParty: z.string().nullable(),

  result: VoteResultSchema,
  yeasTotal: z.number().int().min(0),
  naysTotal: z.number().int().min(0),
  pairedTotal: z.number().int().min(0),
  abstentionsTotal: z.number().int().min(0),

  partyResults: z.array(PartyResultSchema),
  memberResults: z.array(MemberResultSchema),

  recordStatus: RecordStatusSchema,
  sources: z.array(SourceRefSchema),

  sourceUrl: z.string().url(),
  billUrl: z.string().url().nullable(),
  hansardUrl: z.string().url().nullable(),
  journalsUrl: z.string().url().nullable(),
  legisinfoUrl: z.string().url().nullable(),

  sittingNumber: z.number().int().nullable(),
  rawXml: z.string().nullable(),
});

export type NormalizedVoteInput = z.infer<typeof NormalizedVoteSchema>;
