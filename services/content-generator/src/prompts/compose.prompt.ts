/**
 * Article Composition Prompt
 *
 * This is the main content generation prompt. It receives normalized vote data
 * and produces a complete article draft in structured JSON format.
 */

import type { NormalizedVote, VoteClassification } from '@parliament-audit/shared';
import { VOTE_TYPE_EXPLANATIONS, CHAMBERS, PARTY_SHORT_NAMES } from '@parliament-audit/shared';

export function buildArticlePrompt(
  vote: NormalizedVote,
  classification: VoteClassification,
): string {
  const chamberName = CHAMBERS[vote.chamber].name;
  const voteTypeExplanation = VOTE_TYPE_EXPLANATIONS[vote.voteType] || '';

  // Build party summary for the prompt
  const partySummary = vote.partyResults
    .map(p => `  ${p.partyName} (${p.partyShort}): ${p.yeas} Yea, ${p.nays} Nay, ${p.paired} Paired, ${p.absent} Absent (caucus: ${p.caucusSize})`)
    .join('\n');

  return `You are a civic journalist for Parliament Audit, a non-partisan Canadian parliamentary vote tracker.

EDITORIAL RULES — NON-NEGOTIABLE:
1. Use ONLY the vote data provided below. Do not invent ANY facts, names, numbers, or context not present in the data.
2. NEVER use partisan language. Treat all parties with equal respect.
3. NEVER tell readers how to feel, whom to blame, or how to vote.
4. Distinguish fact from analysis. When explaining significance, frame as "This vote would [effect]" not "This is good/bad."
5. Explain parliamentary jargon in plain English.
6. If any data is missing or uncertain, say so explicitly.

TONE: Patriotic, clear, respectful, firm, plainspoken, trustworthy. "Canada deserves to know."

═══════════════════════════════════════
VOTE DATA (Ground Truth — use ONLY this)
═══════════════════════════════════════

Chamber: ${chamberName}
Parliament: ${vote.parliament}th Parliament, Session ${vote.session}
Vote Number: ${vote.voteNumber}
Date: ${vote.voteDate}${vote.voteTime ? ` at ${vote.voteTime}` : ''}
Subject: ${vote.subjectText}
${vote.billNumber ? `Bill: ${vote.billNumber}` : 'Bill: N/A'}
${vote.billTitle ? `Bill Title: ${vote.billTitle}` : ''}
Vote Type: ${classification.voteType} (${classification.significance} significance)
${voteTypeExplanation ? `Type Explanation: ${voteTypeExplanation}` : ''}
Bill Stage: ${classification.billStage || 'N/A'}
Result: ${vote.result.toUpperCase()}
Yeas: ${vote.yeasTotal}
Nays: ${vote.naysTotal}
Paired: ${vote.pairedTotal}
Record Status: ${vote.recordStatus}

Party Breakdown:
${partySummary}

Classification:
- Substantive: ${classification.isSubstantive}
- Confidence-related: ${classification.isConfidenceRelated}
- Reasoning: ${classification.reasoning}

Source URL: ${vote.sourceUrl}
${vote.billUrl ? `Bill URL: ${vote.billUrl}` : ''}
${vote.hansardUrl ? `Hansard URL: ${vote.hansardUrl}` : ''}
${vote.legisinfoUrl ? `LEGISinfo URL: ${vote.legisinfoUrl}` : ''}

═══════════════════════════════════════

TASK: Write a complete article about this vote. Return a JSON object with these exact fields:

{
  "headline": "Max 100 chars. Factual. State what happened. No clickbait.",
  "subheadline": "Max 150 chars. Adds context beyond the headline.",
  "summary": "2-3 sentences. What happened and the result. Plain English.",
  "whatHappened": "2-3 paragraphs. Factual context. What was voted on, the stage, and basic procedural context. Explain what ${classification.voteType.replace(/_/g, ' ')} means if relevant.",
  "partyBreakdown": "How each party voted. Use ONLY the numbers from the data above. Acceptable: 'Most Liberal MPs voted in favour (175 of 180).' Unacceptable: 'The Conservatives betrayed Canadians.' Include all parties. Note any notable cross-party votes (e.g., MPs voting against their caucus) using only the data provided.",
  "whyItMatters": "1-2 paragraphs. Factual significance. What does this vote mean in practical terms? What would the bill do if it becomes law? Frame as effects and consequences, not opinions.",
  "whatNext": "1 paragraph. What happens next in the parliamentary process based on the vote type and result.",
  "factBox": {
    "chamber": "${chamberName}",
    "voteNumber": "${vote.voteNumber}",
    "date": "${vote.voteDate}",
    "bill": ${vote.billNumber ? `"${vote.billNumber}${vote.billTitle ? ` — ${vote.billTitle}` : ''}"` : 'null'},
    "stage": ${classification.billStage ? `"${classification.billStage.replace(/_/g, ' ')}"` : 'null'},
    "result": "${vote.result.toUpperCase()} (${vote.yeasTotal}–${vote.naysTotal})",
    "yeas": ${vote.yeasTotal},
    "nays": ${vote.naysTotal},
    "parliamentSession": "${vote.parliament}th Parliament, ${vote.session}${vote.session === 1 ? 'st' : vote.session === 2 ? 'nd' : 'rd'} Session"
  },
  "slug": "url-safe-slug-like-bill-c-76-third-reading-passed-march-2026"
}

Return ONLY the JSON object. No markdown, no code fences, no extra text.`;
}
