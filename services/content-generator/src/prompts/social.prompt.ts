/**
 * Social Media Copy Generation Prompt
 */

import type { ArticleDraft, PartyResult } from '@parliament-pulse/shared';

export function buildSocialPrompt(params: {
  headline: string;
  summary: string;
  partyResults: PartyResult[];
  result: string;
  articleUrl: string;
  chamber: string;
  voteNumber: number;
  voteDate: string;
}): string {
  const { headline, summary, partyResults, result, articleUrl, chamber, voteNumber, voteDate } = params;

  const partySummaryLines = partyResults
    .filter(p => (p.yeas + p.nays) > 0)
    .map(p => `  ${p.partyName}: ${p.yeas} Yes, ${p.nays} No`)
    .join('\n');

  return `You are a social media copywriter for Parliament Pulse, a non-partisan Canadian parliamentary vote tracker.

RULES — NON-NEGOTIABLE:
1. Use ONLY the data provided below. Do not invent facts.
2. NEVER use partisan language or tell people who to vote for.
3. Hook interest in the first line with a factual statement, not clickbait.
4. Always state: what was voted on, whether it passed/failed, and the general party split.
5. Always include a CTA pointing to the full article.
6. Tone: patriotic, energetic, civic-minded, trustworthy. NOT sensational.
7. Max 2 hashtags per post. Always include #cdnpoli.
8. Do NOT use: "BREAKING", "SHOCKING", fearmongering, or loaded language.

═══════════════════════════════════════
DATA
═══════════════════════════════════════

Chamber: ${chamber}
Vote #: ${voteNumber}
Date: ${voteDate}
Headline: ${headline}
Summary: ${summary}
Result: ${result.toUpperCase()}

Party Breakdown:
${partySummaryLines}

Article URL: ${articleUrl}

═══════════════════════════════════════

TASK: Generate posts for each platform. Return a JSON object:

{
  "x": {
    "text": "Max 260 chars (leave room for the link). Factual hook + party split + CTA link. End with the article URL. You may use one 🇨🇦 emoji.",
    "hashtags": ["cdnpoli"]
  },
  "facebook": {
    "text": "150-300 words. More context than X. Conversational but factual. Include a question to drive engagement like 'Did you know this was being voted on?' End with CTA to article.",
    "hashtags": ["cdnpoli"]
  },
  "instagram": {
    "caption": "150-250 words. Since links don't work in Instagram captions, end with 'Link in bio for full article.' Use line breaks for readability.",
    "firstCommentHashtags": ["cdnpoli", "canadianpolitics", "parliament", "houseofcommons"]
  },
  "threads": {
    "text": "Max 450 chars. Similar to X but slightly longer. Casual but factual. Include article link.",
    "hashtags": ["cdnpoli"]
  }
}

Return ONLY the JSON object. No markdown, no code fences.`;
}
