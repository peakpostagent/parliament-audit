interface VerificationBoxProps {
  verificationText: string;
  sources: Array<{ label: string; url: string }>;
  recordStatus: string;
  lastVerifiedAt: string | null;
}

export function VerificationBox({ verificationText, sources, recordStatus, lastVerifiedAt }: VerificationBoxProps) {
  return (
    <div className="border-2 border-green-200 bg-green-50 rounded-lg p-5 mt-6">
      <h3 className="font-bold text-green-800 mb-2 text-sm uppercase tracking-wide">
        How We Verified This Vote
      </h3>
      <p className="text-sm text-green-900 mb-4">{verificationText}</p>

      <div className="border-t border-green-200 pt-3">
        <h4 className="font-semibold text-sm text-green-800 mb-2">Sources</h4>
        <ul className="space-y-1">
          {sources.map((source, i) => (
            <li key={i} className="text-sm">
              <a
                href={source.url}
                className="text-green-700 hover:text-green-900 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 pt-3 border-t border-green-200 text-xs text-green-700">
        <p>Parliament Pulse uses official parliamentary data sources. We never fabricate vote counts, party positions, or bill details.</p>
        <p className="mt-1">
          See our full{' '}
          <a href="/methodology" className="underline">methodology</a>.
          {' '}Report errors:{' '}
          <a href="mailto:corrections@parliamentpulse.ca" className="underline">corrections@parliamentpulse.ca</a>
        </p>
      </div>
    </div>
  );
}
