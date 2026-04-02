import { db, schema } from '@parliament-audit/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ReviewActions } from './ReviewActions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewDetailPage({ params }: PageProps) {
  const { id } = await params;

  const article = await db.query.articles.findFirst({
    where: eq(schema.articles.id, id),
    with: {
      vote: {
        with: {
          partyResults: true,
        },
      },
    },
  });

  if (!article) {
    notFound();
  }

  const factCheck = article.factCheckDetails as any;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main content — 2 cols */}
      <div className="col-span-2 space-y-6">
        <div>
          <h1 className="text-xl font-bold mb-1">Review: {article.headline}</h1>
          <p className="text-sm text-gray-500">
            Vote #{article.vote.voteNumber} | {article.vote.voteDate} | {article.vote.chamber === 'house' ? 'House' : 'Senate'}
          </p>
        </div>

        {/* Article preview */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Headline</label>
            <p className="font-bold text-lg">{article.headline}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Subheadline</label>
            <p className="text-gray-700">{article.subheadline}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Summary</label>
            <p className="text-gray-700">{article.summary}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">What Happened</label>
            <div className="text-gray-700 text-sm whitespace-pre-line">{article.whatHappened}</div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Party Breakdown</label>
            <div className="text-gray-700 text-sm whitespace-pre-line">{article.partyBreakdown}</div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Why It Matters</label>
            <div className="text-gray-700 text-sm whitespace-pre-line">{article.whyItMatters}</div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">What Happens Next</label>
            <div className="text-gray-700 text-sm whitespace-pre-line">{article.whatNext}</div>
          </div>
        </div>

        {/* Source vote data comparison */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-bold mb-3">Source Vote Data (Ground Truth)</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Result:</span>{' '}
              <span className="font-medium">{article.vote.result.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-gray-500">Totals:</span>{' '}
              <span className="font-medium">{article.vote.yeasTotal} Yea – {article.vote.naysTotal} Nay</span>
            </div>
            <div>
              <span className="text-gray-500">Bill:</span>{' '}
              <span className="font-medium">{article.vote.billNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Type:</span>{' '}
              <span className="font-medium">{article.vote.voteType}</span>
            </div>
          </div>

          <h3 className="font-bold mt-4 mb-2">Party Results</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-1">Party</th>
                <th className="pb-1">Yea</th>
                <th className="pb-1">Nay</th>
                <th className="pb-1">Paired</th>
                <th className="pb-1">Absent</th>
                <th className="pb-1">Caucus</th>
              </tr>
            </thead>
            <tbody>
              {article.vote.partyResults.map((p: any) => (
                <tr key={p.partyShort} className="border-b">
                  <td className="py-1 font-medium">{p.partyName}</td>
                  <td className="py-1">{p.yeas}</td>
                  <td className="py-1">{p.nays}</td>
                  <td className="py-1">{p.paired}</td>
                  <td className="py-1">{p.absent}</td>
                  <td className="py-1">{p.caucusSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sidebar — 1 col */}
      <div className="space-y-4">
        {/* Confidence */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-bold text-sm mb-2">Confidence Score</h3>
          <div className="text-3xl font-bold text-center py-2">
            {Math.round((article.confidenceScore || 0) * 100)}%
          </div>
        </div>

        {/* Fact-check results */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-bold text-sm mb-2">Fact-Check Results</h3>
          {factCheck?.checks ? (
            <ul className="space-y-1">
              {factCheck.checks.map((check: any, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span>{check.passed ? '✅' : check.severity === 'error' ? '❌' : '⚠️'}</span>
                  <span className={check.passed ? 'text-gray-600' : 'text-red-700 font-medium'}>
                    {check.name.replace(/_/g, ' ')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No fact-check data available.</p>
          )}
        </div>

        {/* Interactive review actions (checklist + approve/reject/edit) */}
        <ReviewActions articleId={article.id} />

        {/* Metadata */}
        <div className="bg-white border rounded-lg p-4 text-xs text-gray-500 space-y-1">
          <p>Model: {article.generationModel}</p>
          <p>Prompt: {article.generationPromptVersion}</p>
          <p>Created: {article.createdAt.toLocaleString()}</p>
          <p>Slug: {article.slug}</p>
        </div>
      </div>
    </div>
  );
}
