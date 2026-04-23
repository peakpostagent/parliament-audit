import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Republish our stories — Parliament Audit',
  description:
    'Parliament Audit articles are available for republication under a Creative Commons license. Local and community news outlets are explicitly welcome to use them.',
  alternates: { canonical: '/republish' },
};

export default function RepublishPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-red-600">
          Home
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-gray-700">Republish</span>
      </nav>

      <header className="border-b border-gray-200 pb-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-2">
          Republish our stories
        </h1>
        <p className="text-lg text-gray-600">
          Our journalism is yours to run. No fee, no permission required.
        </p>
      </header>

      <section className="prose prose-gray max-w-none mb-10">
        <p className="text-gray-800 leading-relaxed mb-4">
          Parliament Audit is non-partisan, independent coverage of the Canadian
          Parliament. We want this reporting in front of as many Canadians as
          possible — especially in communities served by local and regional
          newspapers that cannot staff their own Ottawa beat. If you run a
          newspaper, newsletter, community paper, blog, or radio show, you are
          welcome to republish our articles under the terms below.
        </p>
      </section>

      <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">The terms</h2>
        <ul className="space-y-3 text-gray-800">
          <li className="flex gap-3">
            <span className="text-red-700 font-bold mt-0.5" aria-hidden="true">
              ✓
            </span>
            <span>
              <strong>You can republish in full</strong> — online, in print, or
              in broadcast-style summary. No adjustment to length required.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-red-700 font-bold mt-0.5" aria-hidden="true">
              ✓
            </span>
            <span>
              <strong>Free of charge</strong> — commercial and non-commercial
              outlets both welcome. Put the story in your paid products if that
              helps you survive.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-red-700 font-bold mt-0.5" aria-hidden="true">
              ✓
            </span>
            <span>
              <strong>You can translate</strong> into French or any other
              language. Please note the translation was not vetted by us.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-gray-700 font-bold mt-0.5" aria-hidden="true">
              —
            </span>
            <span>
              <strong>Keep the byline and credit.</strong> Attribute to{' '}
              <em>Parliament Audit</em> and include a link back to the original
              article URL on parliamentaudit.ca.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-gray-700 font-bold mt-0.5" aria-hidden="true">
              —
            </span>
            <span>
              <strong>Do not substantively edit</strong> to change meaning. Light
              edits for length, local style, or clarity are fine. If you must
              add editor&apos;s notes or corrections, mark them clearly as yours.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-gray-700 font-bold mt-0.5" aria-hidden="true">
              —
            </span>
            <span>
              <strong>Do not sell as a standalone product.</strong> Running it
              inside your paper, site, or newsletter is fine. Reselling the
              article itself as a licensed asset is not.
            </span>
          </li>
        </ul>
        <p className="text-sm text-gray-600 mt-4">
          This is a plain-language summary of the license below. If you&apos;re a
          lawyer, use the link.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">The license</h2>
        <p className="text-gray-800 leading-relaxed">
          Parliament Audit articles are offered under the{' '}
          <a
            href="https://creativecommons.org/licenses/by-nd/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-700 hover:underline"
          >
            Creative Commons Attribution-NoDerivatives 4.0 International license
            (CC&nbsp;BY-ND&nbsp;4.0)
          </a>
          . Photos, charts, and graphics require separate permission unless a
          caption explicitly states they are CC-licensed too.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">
          How to grab an article cleanly
        </h2>
        <ol className="list-decimal list-outside ml-5 space-y-2 text-gray-800">
          <li>
            Open any article on{' '}
            <Link href="/news" className="text-red-700 hover:underline">
              parliamentaudit.ca/news
            </Link>
            .
          </li>
          <li>
            Scroll to the bottom and click the{' '}
            <strong>&ldquo;Republish this story&rdquo;</strong> box for a
            plain-HTML version you can copy straight into your CMS.
          </li>
          <li>
            The HTML includes the byline, canonical-source link, and a tracking
            pixel that lets us know it&apos;s been picked up — it does not
            collect reader data.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">Questions</h2>
        <p className="text-gray-800 leading-relaxed">
          If your situation doesn&apos;t fit any of the above — podcast read,
          textbook, documentary use, translation into a widely-distributed
          commercial edition — write to{' '}
          <a href="mailto:hello@parliamentaudit.ca" className="text-red-700 hover:underline">
            hello@parliamentaudit.ca
          </a>
          . We&apos;ll almost always say yes.
        </p>
      </section>
    </div>
  );
}
