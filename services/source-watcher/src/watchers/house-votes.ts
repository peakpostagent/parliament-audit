/**
 * House of Commons Vote Watcher
 *
 * Polls the ourcommons.ca XML feed for recorded divisions.
 * Detects new votes by comparing against known vote numbers in the database.
 * Emits vote.discovered events for new votes.
 */

import { XMLParser } from 'fast-xml-parser';
import { PARLIAMENT_URLS } from '@parliament-audit/shared';
import { db, schema } from '@parliament-audit/db';
import { voteDiscoveredQueue } from '@parliament-audit/queue';
import { eq, and } from 'drizzle-orm';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
});

// Current parliament/session — update when a new session begins
const CURRENT_PARLIAMENT = 45;
const CURRENT_SESSION = 1;

interface HouseVoteXmlEntry {
  VoteNumber: number;
  Date: string;
  Description: string;
  Decision: string;
  YeaTotal: number;
  NayTotal: number;
  PairedTotal?: number;
  BillNumber?: string;
  SittingNumber?: number;
}

/**
 * Fetch the House of Commons votes XML for the current session.
 */
async function fetchHouseVotesXml(): Promise<string> {
  const parlSession = `${CURRENT_PARLIAMENT}-${CURRENT_SESSION}`;
  const url = PARLIAMENT_URLS.houseVotesXml(parlSession);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'ParliamentAudit/1.0 (civic media; contact@parliamentaudit.ca)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch House votes XML: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

/**
 * Parse the House votes XML into structured entries.
 */
function parseHouseVotesXml(xml: string): HouseVoteXmlEntry[] {
  const parsed = xmlParser.parse(xml);

  // The XML structure varies; handle both single vote and array cases
  const votesNode = parsed?.ArrayOfVoteDetails?.VoteDetails
    ?? parsed?.VoteDetails
    ?? [];

  const votesList = Array.isArray(votesNode) ? votesNode : [votesNode];

  return votesList
    .filter((v: any) => v && v.VoteNumber)
    .map((v: any) => ({
      VoteNumber: parseInt(v.VoteNumber, 10),
      Date: v.Date || v.VoteDate || '',
      Description: v.Description || v.Subject || '',
      Decision: v.Decision || v.Result || '',
      YeaTotal: parseInt(v.YeaTotal || v.TotalYeas || '0', 10),
      NayTotal: parseInt(v.NayTotal || v.TotalNays || '0', 10),
      PairedTotal: v.PairedTotal ? parseInt(v.PairedTotal, 10) : 0,
      BillNumber: v.BillNumber || v.RelatedBillNumber || undefined,
      SittingNumber: v.SittingNumber ? parseInt(v.SittingNumber, 10) : undefined,
    }));
}

/**
 * Get all known vote numbers for the current session from the database.
 */
async function getKnownVoteNumbers(): Promise<Set<number>> {
  const knownVotes = await db
    .select({ voteNumber: schema.votes.voteNumber })
    .from(schema.votes)
    .where(
      and(
        eq(schema.votes.chamber, 'house'),
        eq(schema.votes.parliament, CURRENT_PARLIAMENT),
        eq(schema.votes.session, CURRENT_SESSION),
      )
    );

  return new Set(knownVotes.map(v => v.voteNumber));
}

/**
 * Main poll function — called on schedule.
 * Fetches the latest House votes and emits events for any new ones.
 */
export async function pollHouseVotes(): Promise<{ newVotes: number; totalVotes: number }> {
  console.log(`[house-watcher] Polling House votes for Parliament ${CURRENT_PARLIAMENT}-${CURRENT_SESSION}...`);

  const xml = await fetchHouseVotesXml();
  const allVotes = parseHouseVotesXml(xml);
  const knownNumbers = await getKnownVoteNumbers();

  let newVoteCount = 0;

  for (const vote of allVotes) {
    if (!knownNumbers.has(vote.VoteNumber)) {
      console.log(`[house-watcher] New vote discovered: #${vote.VoteNumber} — ${vote.Description.substring(0, 80)}...`);

      await voteDiscoveredQueue.add(
        `house-vote-${vote.VoteNumber}`,
        {
          chamber: 'house' as const,
          parliament: CURRENT_PARLIAMENT,
          session: CURRENT_SESSION,
          voteNumber: vote.VoteNumber,
          rawData: xml, // Include full XML; parser will extract this specific vote
        },
        {
          jobId: `house-${CURRENT_PARLIAMENT}-${CURRENT_SESSION}-${vote.VoteNumber}`,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        }
      );

      newVoteCount++;
    }
  }

  console.log(`[house-watcher] Poll complete. ${allVotes.length} total votes, ${newVoteCount} new.`);

  return { newVotes: newVoteCount, totalVotes: allVotes.length };
}

/**
 * Fetch detailed vote data for a specific vote number.
 * This gets the per-member breakdown from the vote detail page.
 */
export async function fetchHouseVoteDetail(voteNumber: number): Promise<string> {
  const url = `https://www.ourcommons.ca/Members/en/votes/${CURRENT_PARLIAMENT}/${CURRENT_SESSION}/${voteNumber}?output=XML`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'ParliamentAudit/1.0 (civic media; contact@parliamentaudit.ca)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch vote detail XML: ${response.status}`);
  }

  return response.text();
}
