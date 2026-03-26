import { PartyBreakdown } from './PartyBreakdownBar';
import { StatusBadge, ResultBadge } from './StatusBadge';
import { VOTE_TYPE_LABELS } from '@parliament-pulse/shared';

interface VoteCardProps {
  slug: string;
  chamber: string;
  voteNumber: number;
  voteDate: string;
  headline: string;
  summary: string;
  result: string;
  yeasTotal: number;
  naysTotal: number;
  voteType: string;
  recordStatus: string;
  billNumber: string | null;
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

export function VoteCard(props: VoteCardProps) {
  const chamberLabel = props.chamber === 'house' ? 'House Vote' : 'Senate Vote';
  const typeLabel = VOTE_TYPE_LABELS[props.voteType as keyof typeof VOTE_TYPE_LABELS] || props.voteType;

  return (
    <a
      href={`/vote/${props.slug}`}
      className="block border rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium uppercase">{chamberLabel} #{props.voteNumber}</span>
          <span>|</span>
          <span>{props.voteDate}</span>
          {props.billNumber && (
            <>
              <span>|</span>
              <span className="font-medium">{props.billNumber}</span>
            </>
          )}
        </div>
        <StatusBadge status={props.recordStatus} />
      </div>

      {/* Headline */}
      <h2 className="text-lg font-bold mb-1">{props.headline}</h2>
      <p className="text-sm text-gray-600 mb-3">{props.summary}</p>

      {/* Party Breakdown */}
      <PartyBreakdown partyResults={props.partyResults} />

      {/* Result */}
      <div className="mt-3 flex items-center justify-between">
        <ResultBadge result={props.result} yeas={props.yeasTotal} nays={props.naysTotal} />
        <span className="text-xs text-gray-400">{typeLabel}</span>
      </div>
    </a>
  );
}
