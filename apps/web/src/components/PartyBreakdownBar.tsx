/**
 * Party Breakdown — Diverging Bar Chart
 *
 * Design rationale (based on parliamentary data viz best practices):
 *
 *   • Green = YEA (universal colour for "yes/agree")
 *   • Red   = NAY (universal colour for "no/disagree")
 *   • Party colour is ONLY used for the party name label
 *   • Bars grow outward from a shared centre line — instantly shows
 *     which side each caucus is on, even before reading numbers
 *   • Width is proportional to the TOTAL votes cast across all parties
 *     so you can compare caucus sizes at a glance
 *   • A vertical 50% threshold line anchors the split
 *
 * Inspired by: The Guardian, CBC News, UK Parliament vote pages,
 * and Flourish parliament chart best practices.
 */

import { PARTY_COLORS, PARTY_SHORT_NAMES } from '@parliament-audit/shared';

interface PartyResult {
  partyShort: string;
  partyName: string;
  yeas: number;
  nays: number;
  paired: number;
  abstentions: number;
  absent: number;
  caucusSize: number;
}

interface PartyBreakdownProps {
  partyResults: PartyResult[];
}

export function PartyBreakdown({ partyResults }: PartyBreakdownProps) {
  // Total votes cast across all parties — used as the scale denominator
  const totalVotes = partyResults.reduce(
    (sum, p) => sum + p.yeas + p.nays + p.paired,
    0,
  );

  if (totalVotes === 0) return null;

  // Sort: parties that voted YEA first, then parties that voted NAY
  const sorted = [...partyResults].sort((a, b) => {
    const aYeaLeaning = a.yeas >= a.nays;
    const bYeaLeaning = b.yeas >= b.nays;
    if (aYeaLeaning && !bYeaLeaning) return -1;
    if (!aYeaLeaning && bYeaLeaning) return 1;
    return (b.yeas + b.nays) - (a.yeas + a.nays);
  });

  return (
    <div className="space-y-1">
      {/* Column headers */}
      <div className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
        <div className="w-28 shrink-0" />
        <div className="flex-1 grid grid-cols-2 gap-0">
          <div className="text-right pr-4 text-green-600">← Yea</div>
          <div className="text-left pl-4 text-red-600">Nay →</div>
        </div>
        <div className="w-24 shrink-0" />
      </div>

      {sorted.map((party) => (
        <PartyRow key={party.partyShort} party={party} totalVotes={totalVotes} />
      ))}

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <span>Voted Yea (in favour)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-400" />
          <span>Voted Nay (against)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-200" />
          <span>Absent / Paired</span>
        </div>
      </div>
    </div>
  );
}

function PartyRow({
  party,
  totalVotes,
}: {
  party: PartyResult;
  totalVotes: number;
}) {
  const color = PARTY_COLORS[party.partyShort] || '#888';
  const name = PARTY_SHORT_NAMES[party.partyShort] || party.partyName;

  // Each side of the chart is half the total width
  // Bars are scaled so the widest bar fills one side
  const yeaPct = (party.yeas / totalVotes) * 100;
  const nayPct = (party.nays / totalVotes) * 100;
  const pairedPct = (party.paired / totalVotes) * 100;

  const isYeaParty = party.yeas >= party.nays;
  const isSplit = party.yeas > 0 && party.nays > 0;

  return (
    <div className="flex items-center gap-2 py-1">
      {/* Party name — coloured in party colour */}
      <div
        className="w-28 shrink-0 text-sm font-semibold truncate text-right pr-1"
        style={{ color }}
        title={name}
      >
        {name}
      </div>

      {/* The diverging bar — two halves */}
      <div className="flex-1 grid grid-cols-2 h-7 gap-px">
        {/* LEFT HALF — YEA side (right-aligned green bar) */}
        <div className="relative flex items-center justify-end bg-gray-50 rounded-l overflow-hidden border-r-2 border-gray-300">
          {party.yeas > 0 && (
            <div
              className="absolute right-0 h-full flex items-center justify-start pl-1.5 transition-all"
              style={{
                width: `${Math.min(yeaPct * 2, 100)}%`,
                backgroundColor: '#22c55e', // green-500
              }}
            >
              {party.yeas >= 5 && (
                <span className="text-xs font-bold text-white leading-none">
                  {party.yeas}
                </span>
              )}
            </div>
          )}
          {/* Yea count when bar is too small to label */}
          {party.yeas > 0 && party.yeas < 5 && (
            <span className="absolute right-1 text-xs font-bold text-green-700 z-10">
              {party.yeas}
            </span>
          )}
        </div>

        {/* RIGHT HALF — NAY side (left-aligned red bar) */}
        <div className="relative flex items-center justify-start bg-gray-50 rounded-r overflow-hidden">
          {party.nays > 0 && (
            <div
              className="absolute left-0 h-full flex items-center justify-end pr-1.5 transition-all"
              style={{
                width: `${Math.min(nayPct * 2, 100)}%`,
                backgroundColor: '#f87171', // red-400
              }}
            >
              {party.nays >= 5 && (
                <span className="text-xs font-bold text-white leading-none">
                  {party.nays}
                </span>
              )}
            </div>
          )}
          {party.nays > 0 && party.nays < 5 && (
            <span className="absolute left-1 text-xs font-bold text-red-600 z-10">
              {party.nays}
            </span>
          )}
          {/* Paired indicator */}
          {party.paired > 0 && (
            <div
              className="absolute right-0 h-full flex items-center"
              style={{
                width: `${Math.min(pairedPct * 2, 15)}%`,
                backgroundColor: '#d1d5db', // gray-300
                minWidth: '4px',
              }}
              title={`${party.paired} paired`}
            />
          )}
        </div>
      </div>

      {/* Count label */}
      <div className="w-24 shrink-0 text-xs text-gray-500 pl-1">
        {party.yeas > 0 && (
          <span className="text-green-700 font-semibold">{party.yeas}Y</span>
        )}
        {party.yeas > 0 && party.nays > 0 && <span className="text-gray-300 mx-0.5">/</span>}
        {party.nays > 0 && (
          <span className="text-red-600 font-semibold">{party.nays}N</span>
        )}
        {party.yeas === 0 && party.nays === 0 && (
          <span className="text-gray-400">absent</span>
        )}
        {party.paired > 0 && (
          <span className="text-gray-400 text-[10px] ml-0.5">+{party.paired}P</span>
        )}
      </div>
    </div>
  );
}
