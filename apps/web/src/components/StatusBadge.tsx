interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<string, { label: string; className: string }> = {
    official: {
      label: 'OFFICIAL',
      className: 'bg-green-100 text-green-800 border-green-300',
    },
    preliminary: {
      label: 'PRELIMINARY',
      className: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    corrected: {
      label: 'CORRECTED',
      className: 'bg-blue-100 text-blue-800 border-blue-300',
    },
  };

  const { label, className } = config[status] || config.preliminary;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded ${className}`}>
      {status === 'official' && <span className="mr-1">&#10003;</span>}
      {status === 'preliminary' && <span className="mr-1">&#9203;</span>}
      {label}
    </span>
  );
}

interface ResultBadgeProps {
  result: string;
  yeas: number;
  nays: number;
}

export function ResultBadge({ result, yeas, nays }: ResultBadgeProps) {
  const isPassed = result === 'passed';
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-bold text-white text-sm ${isPassed ? 'bg-green-700' : 'bg-red-700'}`}>
      <span>{result.toUpperCase()}</span>
      <span className="font-normal">{yeas} – {nays}</span>
    </div>
  );
}
