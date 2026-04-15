import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Methodology',
  description: 'How Parliament Audit collects, verifies, and publishes parliamentary vote data.',
};

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Our Methodology</h1>

      <section className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          Accuracy is our highest priority. Here is exactly how we collect, verify, and publish
          parliamentary vote data.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">1. Data Sources</h2>
        <p>We use official parliamentary sources exclusively for vote data:</p>
        <ul>
          <li><strong>House of Commons:</strong> Official XML vote feeds from ourcommons.ca, including per-member recorded divisions.</li>
          <li><strong>Senate:</strong> Official vote records from sencanada.ca.</li>
          <li><strong>Bill information:</strong> LEGISinfo (parl.ca), the official legislative tracking tool maintained by the Library of Parliament.</li>
          <li><strong>Debates:</strong> Hansard transcripts from ourcommons.ca when additional context is needed.</li>
        </ul>
        <p>
          We do not use social media, news reports, or unofficial sources as primary data for vote records.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">2. Data Collection</h2>
        <p>
          Our system automatically polls official parliamentary data sources at regular intervals.
          During sitting days, we check for new House votes every 15 minutes between 10:00 AM and
          10:00 PM Eastern. On non-sitting days, we check hourly for corrections or updates.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">3. Verification</h2>
        <p>Every vote we publish goes through multiple verification steps:</p>
        <ol>
          <li><strong>Data integrity check:</strong> We verify that the sum of individual member votes matches the published totals.</li>
          <li><strong>Party aggregate validation:</strong> We compute party-level vote breakdowns from individual records and cross-check against published aggregates.</li>
          <li><strong>Automated fact-check:</strong> Every claim in our articles is programmatically validated against the source data.</li>
          <li><strong>Partisan language scan:</strong> We automatically flag any content that contains loaded or partisan language.</li>
          <li><strong>Human review:</strong> An editor reviews every article before publication, verifying key facts against official records.</li>
        </ol>

        <h2 className="text-xl font-bold mt-8 mb-3">4. Record Status</h2>
        <p>We clearly label the status of every vote record:</p>
        <ul>
          <li><strong>Preliminary:</strong> The vote data comes from initial parliamentary records that may be updated. We publish with a visible "Preliminary" badge.</li>
          <li><strong>Official:</strong> The vote data matches the finalized official record in the Journals of the House or Senate proceedings.</li>
          <li><strong>Corrected:</strong> The article was updated after the official record changed or an error was identified. A correction notice is displayed.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">5. Article Generation</h2>
        <p>
          Our articles are generated using AI (Claude by Anthropic) with strict editorial constraints.
          The AI receives only the verified vote data — it cannot search the internet or invent
          information. Every generated article must pass our automated fact-check before an editor
          sees it.
        </p>
        <p>
          We are transparent about our use of AI. We use it to scale our coverage, not to replace
          editorial judgment.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">6. What We Don't Do</h2>
        <ul>
          <li>We do not fabricate vote data or party positions.</li>
          <li>We do not attribute motives to parties or MPs beyond their recorded votes.</li>
          <li>We do not editorialize about whether a vote outcome is good or bad.</li>
          <li>We do not use language designed to make readers angry at any party.</li>
          <li>We do not tell Canadians how to vote.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">7. Corrections</h2>
        <p>
          When we get something wrong, we fix it publicly. See our{' '}
          <Link href="/corrections" className="text-red-600 hover:text-red-800 underline">corrections page</Link>{' '}
          for a full log.
        </p>
      </section>
    </div>
  );
}
