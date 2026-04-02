/**
 * Article types for Parliament Audit.
 */

export type ArticleStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'published'
  | 'correction_pending'
  | 'archived';

export interface FactBox {
  chamber: string;
  voteNumber: string;
  date: string;
  bill: string | null;
  stage: string | null;
  result: string;
  yeas: number;
  nays: number;
  parliamentSession: string;
}

export interface ArticleSources {
  sources: Array<{
    label: string;
    url: string;
  }>;
}

export interface ConfidenceScore {
  overall: number;
  dataCompleteness: number;
  sourceOfficial: number;
  factCheckPassed: boolean;
  claimsVerified: number;
  flags: string[];
}

export interface FactCheck {
  name: string;
  passed: boolean;
  severity: 'error' | 'warning' | 'pass';
  details: string;
}

export interface FactCheckResult {
  passed: boolean;
  verifiedRatio: number;
  checks: FactCheck[];
  unverifiedClaims: number;
}

export interface ArticleDraft {
  headline: string;
  subheadline: string;
  summary: string;
  whatHappened: string;
  partyBreakdown: string;
  whyItMatters: string;
  whatNext: string;
  factBox: FactBox;
  slug: string;
}

export interface PublishedArticle extends ArticleDraft {
  id: string;
  voteId: string;
  status: ArticleStatus;
  confidenceScore: number | null;
  factCheckPassed: boolean;
  factCheckDetails: FactCheckResult | null;
  sourcesJson: ArticleSources;
  verificationText: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  publishedAt: string | null;
  lastVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CorrectionRecord {
  id: string;
  voteId: string;
  articleId: string | null;
  correctionType: 'vote_data_update' | 'editorial_fix' | 'factual_error' | 'source_update';
  description: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  correctedBy: string | null;
  correctedAt: string;
  visibleToPublic: boolean;
}
