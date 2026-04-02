/**
 * Fetches vote data from the OpenParliament.ca JSON API.
 *
 * OpenParliament sources its data from ourcommons.ca (official) and
 * provides a clean, developer-friendly JSON interface with party breakdowns.
 * We use it as our primary data source for vote details.
 *
 * Official source verification: every normalized vote includes the
 * ourcommons.ca canonical URL for source transparency.
 */

const PARLIAMENT = 45;
const SESSION = 1;
const BASE_URL = 'https://api.openparliament.ca';
const USER_AGENT = 'ParliamentAudit/1.0 (civic media; contact@parliamentaudit.ca)';

const headers = {
  'User-Agent': USER_AGENT,
  'Accept': 'application/json',
};

export interface OpenParliamentVote {
  number: number;
  session: string;
  date: string;
  description: { en: string; fr: string };
  result: 'Passed' | 'Failed' | 'Tie';
  yea_total: number;
  nay_total: number;
  paired_total: number;
  bill_url: string | null;
  party_votes: Array<{
    vote: 'Yes' | 'No';
    disagreement: number;
    party: {
      name: { en: string };
      short_name: { en: string };
    };
  }>;
  url: string;
}

export interface OpenParliamentBallot {
  politician_url: string;
  politician_membership_url: string;
  ballot: 'Yes' | 'No' | 'Paired' | 'Abstain';
}

export interface OpenParliamentMembership {
  politician_url: string;
  party: { name: { en: string }; short_name: { en: string } };
  riding: { name: { en: string } };
  province: string;
}

/**
 * Fetch all votes for the current session from ourcommons.ca XML feed.
 * Used for detecting new votes (polling).
 */
export async function fetchHouseVoteList(): Promise<Array<{ voteNumber: number; date: string; description: string }>> {
  const url = `https://www.ourcommons.ca/Members/en/Votes/XML?parlSession=${PARLIAMENT}-${SESSION}`;
  const resp = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!resp.ok) throw new Error(`ourcommons.ca vote list failed: ${resp.status}`);

  const xml = await resp.text();
  // Strip comments and extract vote numbers quickly with regex
  const clean = xml.replace(/<!--[\s\S]*?-->/g, '').replace(/<!--[\s\S]*/g, '');

  const votes: Array<{ voteNumber: number; date: string; description: string }> = [];
  const voteMatches = clean.matchAll(/<DecisionDivisionNumber>(\d+)<\/DecisionDivisionNumber>[\s\S]*?<DecisionEventDateTime>([^<]+)<\/DecisionEventDateTime>[\s\S]*?<DecisionDivisionSubject>([^<]+)<\/DecisionDivisionSubject>/g);

  for (const m of voteMatches) {
    votes.push({
      voteNumber: parseInt(m[1], 10),
      date: m[2].split('T')[0],
      description: m[3],
    });
  }

  // Also catch any we might have missed with alternate ordering
  if (votes.length === 0) {
    const numberMatches = clean.matchAll(/<DecisionDivisionNumber>(\d+)<\/DecisionDivisionNumber>/g);
    for (const m of numberMatches) {
      votes.push({ voteNumber: parseInt(m[1], 10), date: '', description: '' });
    }
  }

  return votes;
}

/**
 * Fetch full vote detail from OpenParliament API.
 */
export async function fetchVoteDetail(voteNumber: number): Promise<OpenParliamentVote> {
  const url = `${BASE_URL}/votes/${PARLIAMENT}-${SESSION}/${voteNumber}/`;
  const resp = await fetch(url, { headers });
  if (!resp.ok) throw new Error(`OpenParliament vote detail failed: ${resp.status} for vote #${voteNumber}`);
  return resp.json();
}

/**
 * Fetch individual member ballots from OpenParliament API.
 * Uses pagination to get all ballots.
 */
export async function fetchVoteBallots(voteNumber: number): Promise<OpenParliamentBallot[]> {
  const ballots: OpenParliamentBallot[] = [];
  let url: string | null = `${BASE_URL}/votes/ballots/?vote=/votes/${PARLIAMENT}-${SESSION}/${voteNumber}/&limit=500`;

  while (url) {
    const resp = await fetch(url, { headers });
    if (!resp.ok) throw new Error(`OpenParliament ballots failed: ${resp.status}`);
    const data: { objects: OpenParliamentBallot[]; pagination?: { next_url?: string } } = await resp.json();
    ballots.push(...data.objects);
    url = data.pagination?.next_url ? `${BASE_URL}${data.pagination.next_url}` : null;
  }

  return ballots;
}

/**
 * Fetch MP membership info (party, riding, province).
 */
export async function fetchMembership(membershipUrl: string): Promise<OpenParliamentMembership | null> {
  try {
    const url = `${BASE_URL}${membershipUrl}`;
    const resp = await fetch(url, { headers });
    if (!resp.ok) return null;
    return resp.json();
  } catch {
    return null;
  }
}

/**
 * Build the canonical ourcommons.ca URL for a vote (for source attribution).
 */
export function buildSourceUrl(voteNumber: number): string {
  return `https://www.ourcommons.ca/members/en/votes/${PARLIAMENT}/${SESSION}/${voteNumber}`;
}
