/**
 * House of Commons Vote XML Parser
 *
 * Parses the detailed vote XML from ourcommons.ca into structured vote data
 * including per-member vote records.
 */

import { XMLParser } from 'fast-xml-parser';
import type { VoteCast, MemberResult } from '@parliament-pulse/shared';
import { PARTY_NAME_MAP } from '@parliament-pulse/shared';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  isArray: (name: string) => {
    // Force these nodes to always be arrays even with single items
    return ['Participant', 'VoteParticipant', 'Member'].includes(name);
  },
});

export interface ParsedHouseVote {
  voteNumber: number;
  date: string;
  time: string | null;
  description: string;
  decision: string;  // "Agreed To" | "Negatived" etc.
  yeasTotal: number;
  naysTotal: number;
  pairedTotal: number;
  billNumber: string | null;
  sittingNumber: number | null;
  members: ParsedMemberVote[];
}

export interface ParsedMemberVote {
  name: string;
  personId: string | null;
  party: string;
  constituency: string | null;
  province: string | null;
  vote: string; // "Yea" | "Nay" | "Paired" etc.
}

/**
 * Sanitize XML from ourcommons.ca before parsing.
 * The API occasionally returns HTML comments (<!-- ... -->) and other
 * non-standard constructs that break strict XML parsers.
 */
function sanitizeXml(xml: string): string {
  // Remove XML/HTML comments (including unclosed ones)
  return xml
    .replace(/<!--[\s\S]*?-->/g, '')   // closed comments
    .replace(/<!--[\s\S]*/g, '')        // unclosed comments (truncate)
    .replace(/\r\n/g, '\n')             // normalize line endings
    .trim();
}

/**
 * Parse a detailed House vote XML document.
 */
export function parseHouseVoteDetailXml(xml: string): ParsedHouseVote {
  const parsed = xmlParser.parse(sanitizeXml(xml));

  // Navigate the XML tree — structure varies between endpoints
  const voteData = parsed?.VoteDetails
    ?? parsed?.ArrayOfVoteDetails?.VoteDetails
    ?? parsed;

  const voteInfo = Array.isArray(voteData) ? voteData[0] : voteData;

  // Extract member votes
  const participants = voteInfo?.Participants?.Participant
    ?? voteInfo?.VoteParticipants?.VoteParticipant
    ?? voteInfo?.Members?.Member
    ?? [];

  const members: ParsedMemberVote[] = participants.map((p: any) => ({
    name: p.Name || p.PersonOfficialFirstName + ' ' + p.PersonOfficialLastName || '',
    personId: p.PersonId || p['@_PersonId'] || null,
    party: p.Party || p.PoliticalAffiliation || p.CaucusShortName || '',
    constituency: p.Constituency || p.ConstituencyName || null,
    province: p.Province || p.ConstituencyProvinceTerritoryName || null,
    vote: p.Vote || p.VoteValueName || p.RecordedVote || '',
  }));

  return {
    voteNumber: parseInt(voteInfo.VoteNumber || voteInfo.DecisionDivisionNumber || '0', 10),
    date: voteInfo.Date || voteInfo.DecisionEventDateTime || '',
    time: extractTime(voteInfo.Date || voteInfo.DecisionEventDateTime || ''),
    description: voteInfo.Description || voteInfo.DecisionDivisionSubject || '',
    decision: voteInfo.Decision || voteInfo.DecisionResultName || '',
    yeasTotal: parseInt(voteInfo.YeaTotal || voteInfo.TotalYeas || '0', 10),
    naysTotal: parseInt(voteInfo.NayTotal || voteInfo.TotalNays || '0', 10),
    pairedTotal: parseInt(voteInfo.PairedTotal || '0', 10),
    billNumber: voteInfo.BillNumber || voteInfo.BillNumberCode || null,
    sittingNumber: voteInfo.SittingNumber ? parseInt(voteInfo.SittingNumber, 10) : null,
    members,
  };
}

/**
 * Parse the vote list XML (which has less detail per vote, but all votes).
 */
export function parseHouseVoteListXml(xml: string): ParsedHouseVote[] {
  const parsed = xmlParser.parse(sanitizeXml(xml));

  const votesNode = parsed?.ArrayOfVoteDetails?.VoteDetails
    ?? parsed?.VoteDetails
    ?? [];

  const votesList = Array.isArray(votesNode) ? votesNode : [votesNode];

  return votesList
    .filter((v: any) => v && v.VoteNumber)
    .map((v: any) => ({
      voteNumber: parseInt(v.VoteNumber, 10),
      date: v.Date || '',
      time: extractTime(v.Date || ''),
      description: v.Description || '',
      decision: v.Decision || '',
      yeasTotal: parseInt(v.YeaTotal || '0', 10),
      naysTotal: parseInt(v.NayTotal || '0', 10),
      pairedTotal: parseInt(v.PairedTotal || '0', 10),
      billNumber: v.BillNumber || null,
      sittingNumber: v.SittingNumber ? parseInt(v.SittingNumber, 10) : null,
      members: [], // List endpoint doesn't include member data
    }));
}

/**
 * Normalize a raw vote string from XML to our canonical VoteCast type.
 */
export function normalizeVoteCast(rawVote: string): VoteCast {
  const lower = rawVote.toLowerCase().trim();
  if (lower === 'yea' || lower === 'yes' || lower === 'pour') return 'yea';
  if (lower === 'nay' || lower === 'no' || lower === 'contre') return 'nay';
  if (lower === 'paired' || lower === 'pairé') return 'paired';
  if (lower === 'abstention' || lower === 'abstention') return 'abstention';
  return 'absent';
}

/**
 * Normalize a party name from XML to our canonical short code.
 */
export function normalizePartyName(rawParty: string): string {
  const trimmed = rawParty.trim();
  return PARTY_NAME_MAP[trimmed] || trimmed;
}

/**
 * Convert parsed member votes to our MemberResult format.
 */
export function toMemberResults(parsedMembers: ParsedMemberVote[]): MemberResult[] {
  return parsedMembers.map(m => ({
    memberName: m.name.trim(),
    memberId: m.personId,
    partyShort: normalizePartyName(m.party),
    constituency: m.constituency,
    province: m.province,
    voteCast: normalizeVoteCast(m.vote),
  }));
}

function extractTime(dateStr: string): string | null {
  // If the date string contains a time component (e.g., "2026-03-24T18:30:00")
  if (dateStr.includes('T')) {
    const timePart = dateStr.split('T')[1];
    return timePart ? timePart.substring(0, 8) : null;
  }
  return null;
}
