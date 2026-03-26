/**
 * Editorial review types for Parliament Pulse.
 */

export type ReviewDecision = 'approve' | 'needs_edits' | 'reject';

export interface ReviewChecklist {
  voteTotalsVerified: boolean;
  partyPositionsVerified: boolean;
  billDetailsVerified: boolean;
  noPartisanLanguage: boolean;
  sourcesVerified: boolean;
  headlineAccurate: boolean;
  summaryAccurate: boolean;
}

export interface ReviewSubmission {
  articleId: string;
  decision: ReviewDecision;
  checklist: ReviewChecklist;
  notes: string | null;
  edits: Record<string, string> | null;
  reviewerName: string;
}

export interface EditorAssistantMemo {
  recommendation: ReviewDecision;
  keyConcerns: string[];
  suggestedEdits: string[];
  verificationItems: string[];
  summary: string;
}

export interface AuditLogEntry {
  id: string;
  entityType: 'vote' | 'article' | 'social_post' | 'correction';
  entityId: string;
  action: string;
  actor: string;
  details: Record<string, unknown> | null;
  createdAt: string;
}
