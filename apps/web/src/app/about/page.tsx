import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Parliament Pulse',
  description: 'Parliament Pulse is an independent, non-partisan project that tracks every recorded vote in Canada\'s Parliament.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About Parliament Pulse</h1>

      <section className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          Parliament Pulse is an independent civic project that tracks every recorded vote in
          Canada's House of Commons and Senate. We make parliamentary voting accessible,
          understandable, and transparent for all Canadians.
        </p>

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
        <p>
          Parliament Pulse automatically monitors official parliamentary data sources. When a new
          recorded vote is published, our system ingests the data, verifies it against official
          records, generates a factual article, and publishes it after editorial review.
        </p>
        <p>
          Read more about our process on our <a href="/methodology" className="text-red-600 hover:text-red-800 underline">Methodology page</a>.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Contact</h2>
        <p>
          Found an error? <a href="mailto:corrections@parliamentpulse.ca" className="text-red-600 hover:text-red-800 underline">corrections@parliamentpulse.ca</a>
        </p>
        <p>
          General inquiries: <a href="mailto:hello@parliamentpulse.ca" className="text-red-600 hover:text-red-800 underline">hello@parliamentpulse.ca</a>
        </p>
      </section>
    </div>
  );
}
