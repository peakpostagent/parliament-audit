import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'Parliament Audit is an independent, non-partisan project that tracks every recorded vote in Canada\'s Parliament.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About Parliament Audit</h1>

      <section className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          Parliament Audit is an independent civic project that tracks every recorded vote in
          Canada's House of Commons and Senate. We make parliamentary voting accessible,
          understandable, and transparent for all Canadians.
        </p>

        <div className="bg-gray-50 border-l-4 border-[#1a1a2e] rounded-r-lg p-5 mb-8 not-prose">
          <h2 className="font-bold text-[#1a1a2e] mb-2">How Parliament Audit is built</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            Parliament Audit is an <strong>AI-assisted, human-edited</strong> publication. AI tools
            ingest parliamentary records, draft analysis, and prepare social posts. Every published
            article is reviewed, fact-checked against primary sources (Hansard, LEGISinfo,
            ourcommons.ca), and approved by a human editor before it goes out.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Quotation marks are reserved for verbatim text from a primary source — we never put
            words in an MP's mouth. Photographs of MPs are official Library of Parliament portraits,
            used as-is. Errors get a public, dated correction.
          </p>
          <p className="text-sm mt-3">
            <Link href="/methodology" className="text-red-600 hover:text-red-800 underline font-semibold">
              Read our full methodology →
            </Link>
          </p>
        </div>

        <h2 className="text-xl font-bold mt-8 mb-3">Our Mission</h2>
        <p>
          We believe Canada deserves to know what its elected representatives are doing. Every vote
          in Parliament is part of the public record, but that record can be hard to find, hard to
          read, and hard to understand. We change that.
        </p>
        <p>
          For every recorded division, we publish a clear, factual breakdown: what was voted on,
          how each party voted, and why it matters. No spin. No agenda. Just the record.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Our Principles</h2>
        <ul className="space-y-2">
          <li><strong>Non-partisan.</strong> We treat every party with equal scrutiny and equal respect. We never tell you who to vote for.</li>
          <li><strong>Factual.</strong> Every claim we make is grounded in official parliamentary data. We cite our sources on every article.</li>
          <li><strong>Transparent.</strong> We publish our methodology, our correction policy, and a log of every correction we make.</li>
          <li><strong>Accessible.</strong> We explain parliamentary jargon in plain English so every Canadian can follow along.</li>
          <li><strong>Patriotic.</strong> We love Canadian democracy. We believe informed citizens make it stronger.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">What We Are Not</h2>
        <ul className="space-y-2">
          <li>We are <strong>not</strong> affiliated with the Government of Canada or any political party.</li>
          <li>We are <strong>not</strong> an advocacy organization.</li>
          <li>We are <strong>not</strong> trying to persuade you to support or oppose any policy.</li>
          <li>We <strong>do not</strong> accept payment from political parties, PACs, or advocacy groups.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">How It Works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6 not-prose">
          <div className="bg-gray-50 border rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">1</div>
            <h3 className="font-bold text-sm mb-1">Monitor</h3>
            <p className="text-xs text-gray-600">
              We automatically check official parliamentary data sources every 15 minutes during sitting days.
            </p>
          </div>
          <div className="bg-gray-50 border rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">2</div>
            <h3 className="font-bold text-sm mb-1">Verify</h3>
            <p className="text-xs text-gray-600">
              Vote totals are cross-checked against official records. Party breakdowns are validated.
            </p>
          </div>
          <div className="bg-gray-50 border rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">3</div>
            <h3 className="font-bold text-sm mb-1">Explain</h3>
            <p className="text-xs text-gray-600">
              We generate a plain-language article explaining what was voted on and why it matters.
            </p>
          </div>
          <div className="bg-gray-50 border rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">4</div>
            <h3 className="font-bold text-sm mb-1">Publish</h3>
            <p className="text-xs text-gray-600">
              After editorial review, the article goes live with full sources and verification details.
            </p>
          </div>
        </div>
        <p>
          Read more about our process on our <Link href="/methodology" className="text-red-600 hover:text-red-800 underline">Methodology page</Link>.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Contact</h2>
        <p>
          Found an error? <a href="mailto:corrections@parliamentaudit.ca" className="text-red-600 hover:text-red-800 underline">corrections@parliamentaudit.ca</a>
        </p>
        <p>
          General inquiries: <a href="mailto:hello@parliamentaudit.ca" className="text-red-600 hover:text-red-800 underline">hello@parliamentaudit.ca</a>
        </p>
      </section>

      <div className="mt-12 grid sm:grid-cols-2 gap-4">
        <Link href="/find-your-mp" className="block bg-[#1a1a2e] text-white rounded-lg p-6 hover:bg-[#2a2a4e] transition-colors">
          <h3 className="font-bold text-lg mb-1">Find Your MP</h3>
          <p className="text-gray-300 text-sm">Enter your postal code to see who represents you in Ottawa.</p>
        </Link>
        <Link href="/subscribe" className="block bg-red-600 text-white rounded-lg p-6 hover:bg-red-700 transition-colors">
          <h3 className="font-bold text-lg mb-1">Subscribe</h3>
          <p className="text-red-100 text-sm">Get notified every time Parliament votes on the issues that matter.</p>
        </Link>
      </div>
    </div>
  );
}
