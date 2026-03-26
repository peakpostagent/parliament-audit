import { PARTY_COLORS, PARTY_SHORT_NAMES } from '@parliament-pulse/shared';

interface PartyBarProps {
  partyShort: string;
  yeas: number;
  nays: number;
  paired: number;
  absent: number;
  caucusSize: number;
}

export function PartyBreakdownBar({ partyShort, yeas, nays, paired, absent, caucusSize }: PartyBarProps) {
  const color = PARTY_COLORS[partyShort] || '#888';
  const partyName = PARTY_SHORT_NAMES[partyShort] || partyShort;
  const total = yeas + nays;
  const yeaPct = total > 0 ? (yeas / caucusSize) * 100 : 0;
  const nayPct = total > 0 ? (nays / caucusSize) * 100 : 0;

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-28 text-sm font-medium truncate" style={{ color }}>
        {partyName}
      </div>
      <div className="flex-1 flex h-6 bg-gray-100 rounded overflow-hidden">
        {yeas > 0 && (
          <div
            className="party-bar flex items-center justify-center text-xs text-white font-medium"
            style={{ width: `${yeaPct}%`, backgroundColor: color }}
          >
            {yeas > 5 && yeas}
          </div>
        )}
        {nays > 0 && (
          <div
            className="party-bar flex items-center justify-center text-xs text-white font-medium opacity-40"
            style={{ width: `${nayPct}%`, backgroundColor: color }}
          >
            {nays > 5 && nays}
          </div>
        )}
      </div>
      <div className="w-32 text-xs text-gray-600 text-right">
        {yeas}Y / {nays}N{paired > 0 ? ` / ${paired}P` : ''}{absent > 0 ? ` / ${absent}A` : ''}
      </div>
    </div>
  );
}

interface PartyBreakdownProps {
  partyResults: Array<{
    partyShort: string;
    partyName: string;
    yeas: number;
    nays: number;
    paired: number;
    abstentions: number;
    absent: number;
    caucusSize: number;
  }>;
}

export function PartyBreakdown({ partyResults }: PartyBreakdownProps) {
  return (
    <div className="space-y-0.5">
      {partyResults.map((party) => (
        <PartyBreakdownBar
          key={party.partyShort}
          partyShort={party.partyShort}
          yeas={party.yeas}
          nays={party.nays}
          paired={party.paired}
          absent={party.absent}
          caucusSize={party.caucusSize}
        />
      ))}
    </div>
  );
}
