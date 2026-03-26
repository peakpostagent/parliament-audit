import type { MemberResult, PartyResult } from '../types/vote.js';
import { PARTY_SHORT_NAMES, PARTY_SORT_ORDER } from '../constants/parties.js';

/**
 * Compute party-level vote aggregates from individual member results.
 */
export function computePartyAggregates(memberResults: MemberResult[]): PartyResult[] {
  const grouped = new Map<string, MemberResult[]>();

  for (const member of memberResults) {
    const existing = grouped.get(member.partyShort) || [];
    existing.push(member);
    grouped.set(member.partyShort, existing);
  }

  const results: PartyResult[] = [];

  for (const [partyShort, members] of grouped) {
    results.push({
      partyShort,
      partyName: PARTY_SHORT_NAMES[partyShort] || partyShort,
      yeas: members.filter(m => m.voteCast === 'yea').length,
      nays: members.filter(m => m.voteCast === 'nay').length,
      paired: members.filter(m => m.voteCast === 'paired').length,
      abstentions: members.filter(m => m.voteCast === 'abstention').length,
      absent: members.filter(m => m.voteCast === 'absent').length,
      caucusSize: members.length,
    });
  }

  // Sort by canonical party order
  results.sort((a, b) => {
    const aIdx = PARTY_SORT_ORDER.indexOf(a.partyShort);
    const bIdx = PARTY_SORT_ORDER.indexOf(b.partyShort);
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
  });

  return results;
}

/**
 * Describe a party's voting position in plain English.
 * Returns phrasing like "175 of 178 Liberal MPs voted in favour"
 */
export function describePartyPosition(party: PartyResult): string {
  const total = party.yeas + party.nays;
  if (total === 0) {
    if (party.paired > 0) return `All ${party.caucusSize} ${party.partyName} members were paired.`;
    if (party.absent === party.caucusSize) return `All ${party.caucusSize} ${party.partyName} members were absent.`;
    return `No ${party.partyName} members voted.`;
  }

  if (party.yeas === total) {
    return `All ${party.yeas} ${party.partyName} MPs voted in favour.`;
  }
  if (party.nays === total) {
    return `All ${party.nays} ${party.partyName} MPs voted against.`;
  }

  const majority = party.yeas > party.nays ? 'in favour' : 'against';
  const majorityCount = Math.max(party.yeas, party.nays);
  const minorityCount = Math.min(party.yeas, party.nays);
  const minorityDirection = party.yeas > party.nays ? 'against' : 'in favour';

  return `${majorityCount} of ${total} ${party.partyName} MPs voted ${majority}; ${minorityCount} voted ${minorityDirection}.`;
}
