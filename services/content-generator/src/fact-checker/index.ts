/**
 * Automated Fact-Checker
 *
 * Validates AI-generated article content against the source vote data.
 * Every claim in the article must be traceable to the normalized vote data.
 */

import type { ArticleDraft, NormalizedVote, FactCheck, FactCheckResult } from '@parliament-audit/shared';

/**
 * Run all fact-checks on an article draft against source vote data.
 */
export function runFactCheck(article: ArticleDraft, vote: NormalizedVote): FactCheckResult {
  const checks: FactCheck[] = [
    checkVoteTotals(article, vote),
    checkResultStatement(article, vote),
    checkPartyPositions(article, vote),
    checkBillDetails(article, vote),
    checkPartisanLanguage(article),
    checkFactBoxAccuracy(article, vote),
  ];

  const failedErrors = checks.filter(c => !c.passed && c.severity === 'error');
  const passedChecks = checks.filter(c => c.passed);

  return {
    passed: failedErrors.length === 0,
    verifiedRatio: passedChecks.length / checks.length,
    checks,
    unverifiedClaims: failedErrors.length,
  };
}

/**
 * Check that vote totals mentioned in the article match source data.
 */
function checkVoteTotals(article: ArticleDraft, vote: NormalizedVote): FactCheck {
  const fullText = `${article.summary} ${article.whatHappened} ${article.partyBreakdown}`;

  // Look for the total yea/nay counts in the text
  const yeasStr = vote.yeasTotal.toString();
  const naysStr = vote.naysTotal.toString();

  const hasCorrectYeas = fullText.includes(yeasStr);
  const hasCorrectNays = fullText.includes(naysStr);

  if (hasCorrectYeas && hasCorrectNays) {
    return { name: 'vote_totals_match', passed: true, severity: 'pass', details: 'Vote totals correctly stated.' };
  }

  return {
    name: 'vote_totals_match',
    passed: false,
    severity: 'error',
    details: `Expected yeas=${yeasStr} and nays=${naysStr} in article text. Found yeas: ${hasCorrectYeas}, nays: ${hasCorrectNays}.`,
  };
}

/**
 * Check that the result (passed/failed) is correctly stated.
 */
function checkResultStatement(article: ArticleDraft, vote: NormalizedVote): FactCheck {
  const fullText = `${article.headline} ${article.summary} ${article.whatHappened}`.toLowerCase();

  const resultWords: Record<string, string[]> = {
    passed: ['passed', 'passes', 'adopted', 'agreed', 'approved', 'carried', 'clears', 'cleared'],
    failed: ['failed', 'defeated', 'negatived', 'rejected', 'lost'],
    tied: ['tied', 'tie'],
  };

  const expectedWords = resultWords[vote.result] || [];
  const found = expectedWords.some(word => fullText.includes(word));

  if (found) {
    return { name: 'result_statement_correct', passed: true, severity: 'pass', details: `Result "${vote.result}" correctly reflected.` };
  }

  return {
    name: 'result_statement_correct',
    passed: false,
    severity: 'error',
    details: `Vote result is "${vote.result}" but none of these terms found in text: ${expectedWords.join(', ')}.`,
  };
}

/**
 * Check that party position claims match the data.
 */
function checkPartyPositions(article: ArticleDraft, vote: NormalizedVote): FactCheck {
  const text = article.partyBreakdown;
  const errors: string[] = [];

  for (const party of vote.partyResults) {
    // Check if the party's yea/nay numbers appear in the text
    if (party.yeas + party.nays > 0) {
      const yeasStr = party.yeas.toString();
      const naysStr = party.nays.toString();

      if (!text.includes(yeasStr) && party.yeas > 0) {
        errors.push(`${party.partyName} yeas (${party.yeas}) not found in breakdown`);
      }
      if (!text.includes(naysStr) && party.nays > 0) {
        errors.push(`${party.partyName} nays (${party.nays}) not found in breakdown`);
      }
    }
  }

  if (errors.length === 0) {
    return { name: 'party_positions_accurate', passed: true, severity: 'pass', details: 'All party positions correctly stated.' };
  }

  return {
    name: 'party_positions_accurate',
    passed: false,
    severity: errors.length > 2 ? 'error' : 'warning',
    details: errors.join('; '),
  };
}

/**
 * Check that bill number/title match the source data.
 */
function checkBillDetails(article: ArticleDraft, vote: NormalizedVote): FactCheck {
  if (!vote.billNumber) {
    return { name: 'bill_details_correct', passed: true, severity: 'pass', details: 'No bill number in source data; nothing to verify.' };
  }

  const fullText = `${article.headline} ${article.summary} ${article.whatHappened}`;
  const hasBillNumber = fullText.includes(vote.billNumber);

  if (hasBillNumber) {
    return { name: 'bill_details_correct', passed: true, severity: 'pass', details: `Bill ${vote.billNumber} correctly referenced.` };
  }

  return {
    name: 'bill_details_correct',
    passed: false,
    severity: 'error',
    details: `Source bill number "${vote.billNumber}" not found in article text.`,
  };
}

/**
 * Check for partisan or loaded language.
 */
function checkPartisanLanguage(article: ArticleDraft): FactCheck {
  const fullText = `${article.headline} ${article.subheadline} ${article.summary} ${article.whatHappened} ${article.partyBreakdown} ${article.whyItMatters} ${article.whatNext}`;

  const PARTISAN_PATTERNS = [
    /betray(ed|ing|s)?\s+(canadians|the\s+country|voters)/i,
    /hate(s)?\s+(freedom|democracy|canadians)/i,
    /destroy(ing|ed|s)?\s+(canada|the\s+country|our)/i,
    /radical\s+(left|right|agenda)/i,
    /extremist/i,
    /must\s+be\s+(punished|stopped|defeated)/i,
    /vote\s+(for|against)\s+(them|this\s+party)/i,
    /canadians\s+should\s+(vote|support|oppose)/i,
    /remember\s+this\s+(at|on)\s+(election|voting)\s+day/i,
    /so-called/i,
    /disastrous/i,
    /catastroph(e|ic)/i,
    /ramm?ed\s+through/i,
    /scheme\s/i,
    /slammed/i,
    /blasted/i,
  ];

  const matches = PARTISAN_PATTERNS
    .map(p => fullText.match(p))
    .filter(Boolean);

  if (matches.length === 0) {
    return { name: 'no_partisan_language', passed: true, severity: 'pass', details: 'No partisan language detected.' };
  }

  return {
    name: 'no_partisan_language',
    passed: false,
    severity: 'error',
    details: `Found ${matches.length} partisan phrase(s): ${matches.map(m => `"${m![0]}"`).join(', ')}`,
  };
}

/**
 * Check that the fact box matches the source data.
 */
function checkFactBoxAccuracy(article: ArticleDraft, vote: NormalizedVote): FactCheck {
  const fb = article.factBox;
  const errors: string[] = [];

  if (fb.yeas !== vote.yeasTotal) errors.push(`factBox yeas=${fb.yeas}, expected ${vote.yeasTotal}`);
  if (fb.nays !== vote.naysTotal) errors.push(`factBox nays=${fb.nays}, expected ${vote.naysTotal}`);
  if (fb.voteNumber !== String(vote.voteNumber)) errors.push(`factBox voteNumber="${fb.voteNumber}", expected "${vote.voteNumber}"`);

  if (errors.length === 0) {
    return { name: 'fact_box_accurate', passed: true, severity: 'pass', details: 'Fact box matches source data.' };
  }

  return {
    name: 'fact_box_accurate',
    passed: false,
    severity: 'error',
    details: errors.join('; '),
  };
}
