/**
 * ourcommons.ca HTML Scraper
 *
 * Scrapes vote detail pages directly from the official Parliament of Canada
 * website. This gives us zero-lag, real-time data without depending on any
 * third-party API like OpenParliament (which lags by weeks).
 *
 * Target URL: https://www.ourcommons.ca/Members/en/votes/{parliament}/{session}/{voteNumber}
 *
 * Data extracted:
 *   - Vote metadata (number, date, sitting, parliament/session)
 *   - Bill number and title
 *   - Subject text and motion text
 *   - Result (Agreed To / Negatived / Tie)
 *   - Yea / Nay / Paired totals
 *   - Full per-MP ballot list with name, memberId, party, constituency, vote cast
 */

import * as cheerio from 'cheerio';
import { PARTY_NAME_MAP } from '@parliament-audit/shared';

const OC_BASE = 'https://www.ourcommons.ca';
const PARLIAMENT = 45;
const SESSION = 1;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface OurCommonsBallot {
  memberName: string;
  memberId: string;          // numeric ID from /Members/en/{id}
  party: string;             // canonical short code e.g. "CPC"
  partyRaw: string;          // raw text from page e.g. "Conservative"
  constituency: string;
  province: string | null;
  voteCast: 'Yea' | 'Nay' | 'Paired' | 'Abstain';
}

export interface OurCommonsVoteDetail {
  parliament: number;
  session: number;
  voteNumber: number;
  sittingNumber: number | null;
  voteDate: string;          // ISO date YYYY-MM-DD
  voteTime: string | null;
  billNumber: string | null;
  billTitle: string | null;
  subjectText: string;
  motionText: string | null;
  result: 'passed' | 'failed' | 'tie';
  resultRaw: string;         // "Agreed To" | "Negatived" | "Tie"
  yeasTotal: number;
  naysTotal: number;
  pairedTotal: number;
  sourceUrl: string;
  ballots: OurCommonsBallot[];
}

// ─── Province map (from page province-section anchors) ───────────────────────

const PROVINCE_ANCHOR_MAP: Record<string, string> = {
  'Alberta': 'AB',
  'BritishColumbia': 'BC',
  'Manitoba': 'MB',
  'NewBrunswick': 'NB',
  'NewfoundlandandLabrador': 'NL',
  'NorthwestTerritories': 'NT',
  'NovaScotia': 'NS',
  'Nunavut': 'NU',
  'Ontario': 'ON',
  'PrinceEdwardIsland': 'PE',
  'Quebec': 'QC',
  'Saskatchewan': 'SK',
  'Yukon': 'YT',
};

// Build province name-text → abbr map too
const PROVINCE_TEXT_MAP: Record<string, string> = {
  'Alberta': 'AB',
  'British Columbia': 'BC',
  'Manitoba': 'MB',
  'New Brunswick': 'NB',
  'Newfoundland and Labrador': 'NL',
  'Northwest Territories': 'NT',
  'Nova Scotia': 'NS',
  'Nunavut': 'NU',
  'Ontario': 'ON',
  'Prince Edward Island': 'PE',
  'Quebec': 'QC',
  'Saskatchewan': 'SK',
  'Yukon': 'YT',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseDate(text: string): string {
  // "Sitting No. 99 - Wednesday, March 25, 2026" → "2026-03-25"
  const match = text.match(/(\w+ \d+, \d{4})/);
  if (!match) return '';
  const d = new Date(match[1]);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

function parseSitting(text: string): number | null {
  const m = text.match(/Sitting No\.\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

function normalizeResult(raw: string): 'passed' | 'failed' | 'tie' {
  const r = raw.toLowerCase().trim();
  if (r.includes('agreed') || r.includes('passed')) return 'passed';
  if (r.includes('negatived') || r.includes('failed') || r.includes('defeated')) return 'failed';
  if (r.includes('tie')) return 'tie';
  return 'failed';
}

function normalizeParty(raw: string): string {
  const trimmed = raw.trim();
  return PARTY_NAME_MAP[trimmed] ?? PARTY_NAME_MAP[trimmed.split(' ')[0]] ?? trimmed.substring(0, 3).toUpperCase();
}

function normalizeVoteCast(raw: string): OurCommonsBallot['voteCast'] {
  const v = raw.trim().toLowerCase();
  if (v === 'yea') return 'Yea';
  if (v === 'nay') return 'Nay';
  if (v === 'paired') return 'Paired';
  return 'Abstain';
}

// ─── Main Scraper ─────────────────────────────────────────────────────────────

/**
 * Fetch and parse vote detail from ourcommons.ca.
 * Throws if the vote is not found (404) or parsing fails.
 */
export async function scrapeOurCommonsVote(
  voteNumber: number,
  parliament = PARLIAMENT,
  session = SESSION,
): Promise<OurCommonsVoteDetail> {
  const url = `${OC_BASE}/Members/en/votes/${parliament}/${session}/${voteNumber}`;

  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Parliament Audit / civic-media-platform (parliamentaudit.ca)',
      'Accept': 'text/html',
    },
  });

  if (!resp.ok) {
    throw new Error(`ourcommons.ca scrape failed: HTTP ${resp.status} for vote #${voteNumber}`);
  }

  const html = await resp.text();
  return parseVotePage(html, voteNumber, parliament, session, url);
}

/**
 * Parse the HTML of an ourcommons.ca vote page.
 * Exported for testing without network calls.
 */
export function parseVotePage(
  html: string,
  voteNumber: number,
  parliament: number,
  session: number,
  url: string,
): OurCommonsVoteDetail {
  const $ = cheerio.load(html);

  // ── Vote header ───────────────────────────────────────────────────────────
  const sittingText = $('.mip-vote-title-section p').first().text().trim();
  const voteDate = parseDate(sittingText);
  const sittingNumber = parseSitting(sittingText);

  // ── Bill info ─────────────────────────────────────────────────────────────
  const billSection = $('.mip-vote-bill-section');
  const billNumber = billSection.find('h2').first().text().trim() || null;
  const billTitle = billSection.find('p').first().text().trim() || null;

  // Filter out "no bill" placeholder text
  const cleanBillNumber = billNumber && /^Bill\s+[A-Z]-\d+/i.test(billNumber)
    ? billNumber.replace(/^Bill\s+/i, '')
    : (billNumber || null);
  const cleanBillTitle = billTitle && billTitle.length > 2 ? billTitle : null;

  // ── Subject and motion ────────────────────────────────────────────────────
  const subjectText = $('#mip-vote-desc').text().trim().replace(/\s+/g, ' ');
  const motionText = $('#mip-vote-text-collapsible-text').text().trim().replace(/\s+/g, ' ') || null;

  // ── Summary / result ──────────────────────────────────────────────────────
  // HTML: <span class="lead"><strong>Results:</strong> Agreed To <i ...></i></span>
  // The result text is a plain text node after the <strong> label, not inside it.
  const summarySection = $('.mip-vote-summary-section');
  const resultRaw = summarySection.find('span.lead').text()
    .replace(/Results?:/i, '').replace(/\s+/g, ' ').trim();

  let yeasTotal = 0, naysTotal = 0, pairedTotal = 0;
  summarySection.find('.col-sm-3').each((_, el) => {
    const text = $(el).text();
    const numMatch = text.match(/:\s*(\d+)/);
    if (!numMatch) return;
    const n = parseInt(numMatch[1], 10);
    if (text.includes('Yea')) yeasTotal = n;
    else if (text.includes('Nay')) naysTotal = n;
    else if (text.includes('Paired')) pairedTotal = n;
  });

  // ── Build province lookup from province panels ────────────────────────────
  // The province panels show each MP's province — we build a map memberId→province
  const memberProvinceMap: Record<string, string> = {};

  $('.ce-mip-vote-panel').each((_, panel) => {
    const anchor = $(panel).find('a[href^="#votes-"]').attr('href');
    if (!anchor) return;

    const anchorKey = anchor.replace('#votes-', '');
    const province = PROVINCE_ANCHOR_MAP[anchorKey];
    if (!province) return; // skip party panels

    $(panel).find('tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length < 3) return;
      const memberLink = $(cells[0]).find('a').attr('href');
      if (!memberLink) return;
      const idMatch = memberLink.match(/\/Members\/en\/(\d+)/);
      if (idMatch) {
        memberProvinceMap[idMatch[1]] = province;
      }
    });
  });

  // ── Parse ballots from FIRST panel (main all-MPs table, party column) ─────
  const ballots: OurCommonsBallot[] = [];
  const seenIds = new Set<string>();

  // The first .ce-mip-mp-vote-panel-body is the "all MPs" listing
  const firstPanel = $('.ce-mip-mp-vote-panel-body').first();
  firstPanel.find('tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length < 3) return;

    const memberCell = $(cells[0]);
    const memberLink = memberCell.find('a');
    const memberName = memberLink.text().trim();
    const href = memberLink.attr('href') || '';
    const idMatch = href.match(/\/Members\/en\/(\d+)/);
    const memberId = idMatch ? idMatch[1] : '';

    if (!memberName || seenIds.has(memberId + memberName)) return;
    seenIds.add(memberId + memberName);

    // Constituency from the text node after <br>
    const memberHtml = memberCell.html() || '';
    const constMatch = memberHtml.match(/<br[^>]*>\s*\(([^)]+)\)/);
    const constituency = constMatch ? constMatch[1].replace(/&#x2014;/g, '—').trim() : '';

    const partyRaw = $(cells[1]).text().trim();
    const party = normalizeParty(partyRaw);
    const voteCast = normalizeVoteCast($(cells[2]).text().trim());
    const province = memberProvinceMap[memberId] ?? null;

    ballots.push({
      memberName,
      memberId,
      party,
      partyRaw,
      constituency,
      province,
      voteCast,
    });
  });

  return {
    parliament,
    session,
    voteNumber,
    sittingNumber,
    voteDate,
    voteTime: null,
    billNumber: cleanBillNumber,
    billTitle: cleanBillTitle,
    subjectText,
    motionText,
    result: normalizeResult(resultRaw),
    resultRaw,
    yeasTotal,
    naysTotal,
    pairedTotal,
    sourceUrl: url,
    ballots,
  };
}
