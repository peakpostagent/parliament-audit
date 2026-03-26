interface FactBoxProps {
  chamber: string;
  voteNumber: string;
  date: string;
  bill: string | null;
  stage: string | null;
  result: string;
  yeas: number;
  nays: number;
  parliamentSession: string;
}

export function FactBox(props: FactBoxProps) {
  const rows = [
    { label: 'Chamber', value: props.chamber },
    { label: 'Vote #', value: props.voteNumber },
    { label: 'Date', value: props.date },
    ...(props.bill ? [{ label: 'Bill', value: props.bill }] : []),
    ...(props.stage ? [{ label: 'Stage', value: props.stage }] : []),
    { label: 'Result', value: props.result },
    { label: 'Yeas', value: String(props.yeas) },
    { label: 'Nays', value: String(props.nays) },
    { label: 'Parliament', value: props.parliamentSession },
  ];

  return (
    <div className="border rounded-lg bg-gray-50 p-5 mt-6">
      <h3 className="font-bold text-sm uppercase tracking-wide text-gray-600 mb-3">
        Vote at a Glance
      </h3>
      <dl className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex text-sm">
            <dt className="w-28 text-gray-500 font-medium">{row.label}</dt>
            <dd className="text-gray-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
