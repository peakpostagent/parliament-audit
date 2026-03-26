import { z } from 'zod';

export const FactBoxSchema = z.object({
  chamber: z.string(),
  voteNumber: z.string(),
  date: z.string(),
  bill: z.string().nullable(),
  stage: z.string().nullable(),
  result: z.string(),
  yeas: z.number().int(),
  nays: z.number().int(),
  parliamentSession: z.string(),
});

export const ArticleDraftSchema = z.object({
  headline: z.string().min(10).max(120),
  subheadline: z.string().min(10).max(200),
  summary: z.string().min(50),
  whatHappened: z.string().min(100),
  partyBreakdown: z.string().min(50),
  whyItMatters: z.string().min(50),
  whatNext: z.string().min(30),
  factBox: FactBoxSchema,
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export const FactCheckSchema = z.object({
  name: z.string(),
  passed: z.boolean(),
  severity: z.enum(['error', 'warning', 'pass']),
  details: z.string(),
});

export const FactCheckResultSchema = z.object({
  passed: z.boolean(),
  verifiedRatio: z.number().min(0).max(1),
  checks: z.array(FactCheckSchema),
  unverifiedClaims: z.number().int().min(0),
});

export const ConfidenceScoreSchema = z.object({
  overall: z.number().min(0).max(1),
  dataCompleteness: z.number().min(0).max(1),
  sourceOfficial: z.number().min(0).max(1),
  factCheckPassed: z.boolean(),
  claimsVerified: z.number().min(0).max(1),
  flags: z.array(z.string()),
});
