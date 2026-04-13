import type { Metadata } from 'next';
import { db, schema } from '@parliament-audit/db';
import { desc, eq } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Corrections',
  description: 'A public log of all corrections made to Parliament Audit articles.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function CorrectionsPage() {
  const corrections = await db.query.corrections.findMany({
    where: eq(schema.corrections.visibleToPublic, true),
    orderBy: desc(schema.corrections.correctedAt),
    limit: 100,
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Corrections</h1>
      <p className="text-gray-600 mb-8">
        When we get something wrong, we fix it publicly. This page lists every correction
        we have made, in reverse chronological order.
      </p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <h2 className="font-bold text-green-800 mb-1">Our Correction Policy</h2>
        <p className="text-sm text-green-700">
          Parliament Audit is committed to accuracy. When official records are updated or we
          identify an error, we correct the article and post a visible notice. We never
          silently edit published articles. Report errors to{' '}
          <a href="mailto:corrections@parliamentaudit.ca" className="underline">
            corrections@parliamentaudit.ca
          </a>.
        </p>
      </div>

      {corrections.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No corrections have been issued.</p>
      ) : (
        <div className="space-y-4">
          {corrections.map((c) => (
            <div key={c.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                  {c.correctionType.replace(/_/g, ' ')}
                </span>
                <span>{new Date(c.correctedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <p className="text-gray-800">{c.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
