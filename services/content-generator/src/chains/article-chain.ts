/**
 * Article Generation Chain
 *
 * Orchestrates the full content generation pipeline for a single vote:
 * 1. Classify the vote
 * 2. Generate article via AI
 * 3. Generate social posts via AI
 * 4. Run fact-check
 * 5. Compute confidence score
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  NormalizedVote,
  ArticleDraft,
  SocialDrafts,
  VoteClassification,
  ConfidenceScore,
  FactCheckResult,
} from '@parliament-pulse/shared';
import {
  ArticleDraftSchema,
  SocialDraftsSchema,
} from '@parliament-pulse/shared';
import { classifyVote } from '../classify.js';
import { buildArticlePrompt } from '../prompts/compose.prompt.js';
import { buildSocialPrompt } from '../prompts/social.prompt.js';
import { runFactCheck } from '../fact-checker/index.js';
import { computeConfidence } from '../confidence.js';

const anthropic = new Anthropic();

const MODEL = 'claude-sonnet-4-20250514';
const PROMPT_VERSION = 'v1.0';

export interface GenerationResult {
  article: ArticleDraft;
  social: SocialDrafts;
  classification: VoteClassification;
  factCheck: FactCheckResult;
  confidence: ConfidenceScore;
  model: string;
  promptVersion: string;
}

/**
 * Run the full article generation chain for a vote.
 */
export async function generateArticle(vote: NormalizedVote): Promise<GenerationResult> {
  // Step 1: Classify the vote
  const classification = classifyVote(vote.subjectText, vote.billNumber);
  console.log(`[content-gen] Vote #${vote.voteNumber} classified as: ${classification.voteType} (${classification.significance})`);

  // Step 2: Generate article
  const articlePrompt = buildArticlePrompt(vote, classification);
  const articleResponse = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: articlePrompt }],
  });

  const articleText = articleResponse.content[0].type === 'text'
    ? articleResponse.content[0].text
    : '';

  // Parse and validate the article JSON
  let articleDraft: ArticleDraft;
  try {
    const parsed = JSON.parse(articleText);
    articleDraft = ArticleDraftSchema.parse(parsed);
  } catch (err) {
    console.error('[content-gen] Failed to parse article response:', err);
    console.error('[content-gen] Raw response:', articleText.substring(0, 500));
    throw new Error(`Article generation produced invalid JSON: ${err}`);
  }

  console.log(`[content-gen] Article generated: "${articleDraft.headline}"`);

  // Step 3: Generate social posts
  const articleUrl = `https://parliamentpulse.ca/vote/${articleDraft.slug}`;
  const socialPrompt = buildSocialPrompt({
    headline: articleDraft.headline,
    summary: articleDraft.summary,
    partyResults: vote.partyResults,
    result: vote.result,
    articleUrl,
    chamber: vote.chamber === 'house' ? 'House of Commons' : 'Senate',
    voteNumber: vote.voteNumber,
    voteDate: vote.voteDate,
  });

  const socialResponse = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: 'user', content: socialPrompt }],
  });

  const socialText = socialResponse.content[0].type === 'text'
    ? socialResponse.content[0].text
    : '';

  let social: SocialDrafts;
  try {
    const parsed = JSON.parse(socialText);
    // Enforce platform character limits before schema validation
    if (parsed.x?.text && parsed.x.text.length > 280) {
      // Trim to last word boundary before 277 chars, then add "…"
      parsed.x.text = parsed.x.text.substring(0, 277).replace(/\s+\S*$/, '') + '…';
    }
    social = SocialDraftsSchema.parse(parsed);
  } catch (err) {
    console.error('[content-gen] Failed to parse social response:', err);
    throw new Error(`Social post generation produced invalid JSON: ${err}`);
  }

  console.log(`[content-gen] Social posts generated for ${Object.keys(social).length} platforms`);

  // Step 4: Fact-check the article against source data
  const factCheck = runFactCheck(articleDraft, vote);
  console.log(`[content-gen] Fact-check ${factCheck.passed ? 'PASSED' : 'FAILED'} (${factCheck.verifiedRatio * 100}% verified)`);

  // Step 5: Compute confidence score
  const confidence = computeConfidence(vote, factCheck);
  console.log(`[content-gen] Confidence: ${(confidence.overall * 100).toFixed(0)}% ${confidence.flags.length > 0 ? `(flags: ${confidence.flags.join(', ')})` : ''}`);

  return {
    article: articleDraft,
    social,
    classification,
    factCheck,
    confidence,
    model: MODEL,
    promptVersion: PROMPT_VERSION,
  };
}
