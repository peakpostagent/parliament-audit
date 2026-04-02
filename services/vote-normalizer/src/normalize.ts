/**
 * Vote Normalization
 *
 * Transforms raw vote data into the canonical NormalizedVote format.
 *
 * Data source priority:
 *   1. ourcommons.ca HTML scraper  — zero-lag, real-time, official source
 *   2. OpenParliament JSON API     — fallback (lags weeks behind; older votes)
 *
 * The ourcommons.ca scraper gives us exact per-MP ballots with party, constituency,
 * and province — far more accurate than the OpenParliament approximations.
 */

import type { NormalizedVote, VoteResult, RecordStatus, SourceRef, MemberResult, PartyResult } from '@parliament-audit/shared';
import { PARLIAMENT_URLS, PARTY_SHORT_NAMES, PARTY_SORT_ORDER } from '@parliament-audit/shared';
import { scrapeOurCommonsVote, type OurCommonsVoteDetail, type OurCommonsBallot } from './scrapers/ourcommons-html.js';
import {
  fetchVoteDetail,
  fetchVoteBallots,
  buildSourceUrl,
  type OpenParliamentVote,
  type OpenParliamentBallot,
} from './fetch-vote.js';
import { classifyVote } from './classify.js';

const PARLIAMENT = 45;
const SESSION = 1;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Normalize a House of Commons vote.
 * Tries ourcommons.ca scraper first, falls back to OpenParliament.
 */
export async function normalizeHouseVote(params: {
  voteNumber: number;
}): Promise<NormalizedVote> {
  const { voteNumber } = params;

  // ── Try ourcommons.ca scraper first ─────────────────────────────────────
  try {
    console.log(`[normalizer] Scraping vote #${voteNumber} from ourcommons.ca...`);
    const scraped = await scrapeOurCommonsVote(voteNumber, PARLIAMENT, SESSION);
    console.log(`[normalizer] Got ${scraped.ballots.length} MP ballots from ourcommons.ca`);
    return normalizeFromScrape(voteNumber, scraped);
  } catch (scrapeErr: any) {
    const msg = scrapeErr?.message ?? String(scrapeErr);
    console.warn(`[normalizer] ourcommons.ca scrape failed (${msg}), trying OpenParliament...`);
  }

  // ── Fallback: OpenParliament JSON API ────────────────────────────────────
  console.log(`[normalizer] Fetching vote #${voteNumber} from OpenParliament API...`);
  const voteData = await fetchVoteDetail(voteNumber);

  console.log(`[normalizer] Fetching member ballots for vote #${voteNumber}...`);
  const ballots = await fetchVoteBallots(voteNumber);
  console.log(`[normalizer] Got ${ballots.length} member ballots from OpenParliament`);

  return normalizeFromOpenParliament(voteNumber, voteData, ballots);
}

// ─── ourcommons.ca normalizer ─────────────────────────────────────────────────

async function normalizeFromScrape(
  voteNumber: number,
  scraped: OurCommonsVoteDetail,
): Promise<NormalizedVote> {
  const billNumber = scraped.billNumber;
  const classification = classifyVote(scraped.subjectText, billNumber);

  // Build member results directly from scrape — exact names, parties, provinces
  const memberResults = scraped.ballots.map((b): MemberResult => ({
    memberName: b.memberName,
    memberId: b.memberId,
    partyShort: b.party,
    constituency: b.constituency || null,
    province: b.province,
    voteCast: b.voteCast.toLowerCase() as MemberResult['voteCast'],
  }));

  // Build exact party results from ballot data (no estimation needed!)
  const partyResults = buildExactPartyResults(scraped.ballots);

  // Try to fetch bill title from LEGISinfo
  const { billTitle, billUrl, legisinfoUrl } = await fetchBillMetadata(billNumber);

  // Build source references
  const sources: SourceRef[] = [
    {
      label: `Official House of Commons recorded division — Vote #${voteNumber}`,
      url: scraped.sourceUrl,
      type: 'official_vote',
    },
  ];
  if (legisinfoUrl) {
    sources.push({ label: `LEGISinfo — Bill ${billNumber}`, url: legisinfoUrl, type: 'legisinfo' });
  }

  const result: VoteResult = scraped.result === 'passed'
    ? 'passed'
    : scraped.result === 'tie'
    ? 'tied'
    : 'failed';

  const normalized: NormalizedVote = {
    chamber: 'house',
    parliament: PARLIAMENT,
    session: SESSION,
    voteNumber,
    voteDate: scraped.voteDate,
    voteTime: scraped.voteTime,

    subjectText: scraped.subjectText,
    billNumber,
    billTitle,
    billStage: classification.billStage,
    voteType: classification.voteType,
    motionText: scraped.motionText,
    sponsorName: null,
    sponsorParty: null,

    result,
    yeasTotal: scraped.yeasTotal,
    naysTotal: scraped.naysTotal,
    pairedTotal: scraped.pairedTotal,
    abstentionsTotal: 0,

    partyResults,
    memberResults,

    recordStatus: 'preliminary' as RecordStatus,
    sources,

    sourceUrl: scraped.sourceUrl,
    billUrl,
    hansardUrl: null,
    journalsUrl: null,
    legisinfoUrl,
    sittingNumber: scraped.sittingNumber,
    rawXml: null,
  };

  validateVoteIntegrity(normalized);
  return normalized;
}

// ─── OpenParliament fallback normalizer ───────────────────────────────────────

async function normalizeFromOpenParliament(
  voteNumber: number,
  voteData: OpenParliamentVote,
  ballots: OpenParliamentBallot[],
): Promise<NormalizedVote> {
  const description = voteData.description.en;
  const billNumber = extractBillNumber(voteData.bill_url);
  const classification = classifyVote(description, billNumber);
  const result = normalizeOPResult(voteData.result);
  const sourceUrl = buildSourceUrl(voteNumber);

  const { billTitle, billUrl, legisinfoUrl } = await fetchBillMetadata(billNumber);

  const sources: SourceRef[] = [
    { label: `Official House of Commons recorded division — Vote #${voteNumber}`, url: sourceUrl, type: 'official_vote' },
  ];
  if (legisinfoUrl) {
    sources.push({ label: `LEGISinfo — Bill ${billNumber}`, url: legisinfoUrl, type: 'legisinfo' });
  }

  // Build member results from OpenParliament slugs (limited — no party/province)
  const memberResults: MemberResult[] = ballots.map((b) => {
    const slug = b.politician_url.replace('/politicians/', '').replace(/\//g, '');
    const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const membershipId = b.politician_membership_url.replace(/[^0-9]/g, '');
    return {
      memberName: name,
      memberId: membershipId,
      partyShort: 'UNK',
      constituency: null,
      province: null,
      voteCast: normalizeOPBallot(b.ballot),
    };
  });

  // Build approximate party results from OpenParliament party_votes
  const partyResults = buildApproxPartyResults(voteData, ballots);

  const normalized: NormalizedVote = {
    chamber: 'house',
    parliament: PARLIAMENT,
    session: SESSION,
    voteNumber,
    voteDate: voteData.date,
    voteTime: null,

    subjectText: description,
    billNumber,
    billTitle,
    billStage: classification.billStage,
    voteType: classification.voteType,
    motionText: null,
    sponsorName: null,
    sponsorParty: null,

    result,
    yeasTotal: voteData.yea_total,
    naysTotal: voteData.nay_total,
    pairedTotal: voteData.paired_total,
    abstentionsTotal: 0,

    partyResults,
    memberResults,

    recordStatus: 'preliminary' as RecordStatus,
    sources,

    sourceUrl,
    billUrl,
    hansardUrl: null,
    journalsUrl: null,
    legisinfoUrl,
    sittingNumber: null,
    rawXml: null,
  };

  validateVoteIntegrity(normalized);
  return normalized;
}

// ─── Party results builders ────────────────────────────────────────────────────

/**
 * Build EXACT party results from ourcommons.ca ballot data.
 * Every MP has a party label — we count directly. No estimation.
 */
function buildExactPartyResults(ballots: OurCommonsBallot[]): PartyResult[] {
  const partyMap = new Map<string, { name: string; yeas: number; nays: number; paired: number }>();

  for (const b of ballots) {
    const short = b.party;
    const name = PARTY_SHORT_NAMES[short] || b.partyRaw;
    if (!partyMap.has(short)) {
      partyMap.set(short, { name, yeas: 0, nays: 0, paired: 0 });
    }
    const entry = partyMap.get(short)!;
    if (b.voteCast === 'Yea') entry.yeas++;
    else if (b.voteCast === 'Nay') entry.nays++;
    else if (b.voteCast === 'Paired') entry.paired++;
  }

  // Sort in canonical order
  return PARTY_SORT_ORDER
    .filter(code => partyMap.has(code))
    .concat([...partyMap.keys()].filter(k => !PARTY_SORT_ORDER.includes(k)))
    .map((code): PartyResult => {
      const e = partyMap.get(code)!;
      return {
        partyShort: code,
        partyName: e.name,
        yeas: e.yeas,
        nays: e.nays,
        paired: e.paired,
        abstentions: 0,
        absent: 0,
        caucusSize: e.yeas + e.nays + e.paired,
      };
    });
}

/**
 * Build APPROXIMATE party results from OpenParliament party_votes.
 * Uses majority direction + disagreement rate to estimate per-party yea/nay.
 * Less accurate than exact counting — only used as OpenParliament fallback.
 */
function buildApproxPartyResults(voteData: OpenParliamentVote, ballots: OpenParliamentBallot[]): PartyResult[] {
  const totalParties = voteData.party_votes.length;

  return voteData.party_votes.map((pv): PartyResult => {
    const partyShort = normalizePartyCode(pv.party.short_name.en);
    const partyName = PARTY_SHORT_NAMES[partyShort] || pv.party.name.en;
    const inFavour = pv.vote === 'Yes';

    const estCaucus = Math.round((inFavour ? voteData.yea_total : voteData.nay_total) / totalParties);
    const partyYeas = inFavour
      ? Math.round(estCaucus * (1 - pv.disagreement))
      : Math.round(estCaucus * pv.disagreement);
    const partyNays = inFavour
      ? Math.round(estCaucus * pv.disagreement)
      : Math.round(estCaucus * (1 - pv.disagreement));

    return {
      partyShort,
      partyName,
      yeas: partyYeas,
      nays: partyNays,
      paired: 0,
      abstentions: 0,
      absent: 0,
      caucusSize: partyYeas + partyNays,
    };
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchBillMetadata(billNumber: string | null): Promise<{
  billTitle: string | null;
  billUrl: string | null;
  legisinfoUrl: string | null;
}> {
  if (!billNumber) return { billTitle: null, billUrl: null, legisinfoUrl: null };

  const parlSession = `${PARLIAMENT}-${SESSION}`;
  const legisinfoUrl = PARLIAMENT_URLS.legisinfoBillPage(parlSession, billNumber);

  let billTitle: string | null = null;
  try {
    const legisUrl = `https://www.parl.ca/legisinfo/en/bills/json?parlsession=${parlSession}`;
    const resp = await fetch(legisUrl, {
      headers: { 'User-Agent': 'ParliamentAudit/1.0 (civic media; contact@parliamentaudit.ca)', 'Accept': 'application/json' },
    });
    if (resp.ok) {
      const bills = await resp.json();
      const billList = Array.isArray(bills) ? bills : bills.Bills || bills.bills || [];
      const match = billList.find((b: any) => {
        const num = (b.NumberCode || b.BillNumberCode || '').toUpperCase().replace(/\s/g, '');
        return num === billNumber.toUpperCase().replace(/\s/g, '');
      });
      if (match) billTitle = match.LongTitleEn || match.ShortTitleEn || match.Title || null;
    }
  } catch {
    // Bill title is optional
  }

  return { billTitle, billUrl: legisinfoUrl, legisinfoUrl };
}

function extractBillNumber(billUrl: string | null): string | null {
  if (!billUrl) return null;
  const match = billUrl.match(/\/bills\/\d+-\d+\/([^/]+)\//);
  return match ? match[1].toUpperCase() : null;
}

function normalizePartyCode(name: string): string {
  const { PARTY_NAME_MAP } = require('@parliament-audit/shared');
  return PARTY_NAME_MAP[name] || PARTY_NAME_MAP[name.trim()] || name.substring(0, 3).toUpperCase();
}

function normalizeOPResult(result: OpenParliamentVote['result']): VoteResult {
  if (result === 'Passed') return 'passed';
  if (result === 'Failed') return 'failed';
  if (result === 'Tie') return 'tied';
  return 'passed';
}

function normalizeOPBallot(ballot: string): MemberResult['voteCast'] {
  const lower = ballot.toLowerCase();
  if (lower === 'yes' || lower === 'yea') return 'yea';
  if (lower === 'no' || lower === 'nay') return 'nay';
  if (lower === 'paired') return 'paired';
  if (lower === 'abstain' || lower === 'abstention') return 'abstention';
  return 'absent';
}

function validateVoteIntegrity(vote: NormalizedVote): void {
  if (!vote.voteDate) {
    throw new Error(`Vote #${vote.voteNumber}: missing voteDate`);
  }
  if (vote.yeasTotal + vote.naysTotal === 0) {
    console.warn(`[normalizer] Vote #${vote.voteNumber}: zero totals — data may be incomplete`);
  }
}
