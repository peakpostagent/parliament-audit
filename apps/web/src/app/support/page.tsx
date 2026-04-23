import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Become a Builder — Parliament Audit',
  description:
    'Parliament Audit is independent, non-partisan, and reader-funded. Builders keep it that way. Monthly or annual support, with a supporters-only newsletter and public thanks.',
  alternates: { canonical: '/support' },
};

/**
 * Marketing page for the "Parliament Audit Builders" supporter tier.
 * Intentionally does NOT include a Stripe checkout yet — tier pricing,
 * perks, and billing cadence need a human decision. Every CTA links
 * to /support#join-wait-list which is just a subscribe form today;
 * swap the button to a Stripe Checkout URL once the tier is finalized.
 */
export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-red-600">
          Home
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-gray-700">Support</span>
      </nav>

      {/* Hero */}
      <header className="border-b border-gray-200 pb-6 mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-red-700 mb-2">
          Parliament Audit Builders
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-3">
          Keep the record public.
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Parliament Audit is independent, non-partisan, and reader-funded. We
          do not take political-party money. We do not sell reader data. We
          publish every recorded vote and the context you need to read it.
          Builders are the readers who make that possible.
        </p>
      </header>

      {/* The ask */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">
          What your support pays for
        </h2>
        <ul className="space-y-3 text-gray-800 leading-relaxed">
          <li className="flex gap-3">
            <span className="text-red-700 font-bold mt-0.5" aria-hidden="true">
              →
            </span>
            <span>
              <strong>Infrastructure.</strong> Servers, domain, email delivery,
              analytics. Real costs, every month.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-red-700 font-bold mt-0.5" aria-hidden="true">
              →
            </span>
            <span>
              <strong>Reporting time.</strong> Reading Hansard, cross-checking
              vote results, writing accountability pieces that nobody is paying
              us to write.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-red-700 font-bold mt-0.5" aria-hidden="true">
              →
            </span>
            <span>
              <strong>Legal and research tools.</strong> Subscription databases,
              legal review when we publish accountability pieces.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-red-700 font-bold mt-0.5" aria-hidden="true">
              →
            </span>
            <span>
              <strong>Staying independent.</strong> We are not taking foundation
              money that comes with editorial strings, and we will not run
              political-party advertising. Builders let us keep those lines.
            </span>
          </li>
        </ul>
      </section>

      {/* Builder perks */}
      <section className="mb-10 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">
          What Builders get
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <h3 className="font-semibold text-[#1a1a2e] mb-2">
              A supporters-only newsletter
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Once every two weeks. Behind-the-scenes on the accountability
              pieces we&apos;re working on, the tips we&apos;re chasing, the
              stories that didn&apos;t survive the reporting process and why.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1a1a2e] mb-2">
              Public thanks (if you want it)
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              A named supporter wall on the site. Opt out and stay anonymous at
              any time — no membership tier requires public acknowledgement.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1a1a2e] mb-2">
              A vote sent your way
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Builders get priority access to vote-alert emails: be the first
              to know when your MP takes a recorded vote, before the post goes
              public.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1a1a2e] mb-2">
              An open record of our funding
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Every quarter we publish a short breakdown: how much came from
              Builders, how much from grants, what it went to. You can see where
              your money lands.
            </p>
          </div>
        </div>
      </section>

      {/* Tier placeholder — filled in when you set prices */}
      <section className="mb-10" id="tiers">
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Builder tiers</h2>
        <p className="text-sm text-gray-600 italic mb-5">
          Tiers, pricing, and checkout are launching soon. If you want a
          heads-up the moment they open, leave your email below — we&apos;ll
          tell you once and then leave you alone until you decide.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              name: 'Supporter',
              subtitle: 'Monthly',
              description:
                'Covers a month of infrastructure and a slice of reporting time.',
              price: 'TBD',
            },
            {
              name: 'Builder',
              subtitle: 'Annual',
              description:
                'The core tier. Supporters newsletter, named wall, vote alerts, open-books report.',
              price: 'TBD',
              highlighted: true,
            },
            {
              name: 'Founding Builder',
              subtitle: 'One-time',
              description:
                'A lump-sum launch contribution. Listed first and forever on the supporter wall.',
              price: 'TBD',
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className={
                tier.highlighted
                  ? 'border-2 border-red-600 rounded-lg p-5 bg-white'
                  : 'border border-gray-200 rounded-lg p-5 bg-white'
              }
            >
              <h3 className="font-bold text-[#1a1a2e] mb-0.5">{tier.name}</h3>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
                {tier.subtitle}
              </p>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {tier.description}
              </p>
              <p className="text-2xl font-bold text-[#1a1a2e]">{tier.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Wait list */}
      <section className="mb-10" id="join-wait-list">
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3">
          Hear when Builders opens
        </h2>
        <p className="text-gray-700 mb-5 leading-relaxed">
          Until tiers go live, the best thing you can do is subscribe to the
          free newsletter. We&apos;ll tell subscribers first.
        </p>
        <Link
          href="/subscribe"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded font-semibold transition-colors"
        >
          Subscribe →
        </Link>
      </section>

      {/* Alternatives */}
      <section className="mb-10 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-3">
          Other ways to help right now
        </h2>
        <ul className="space-y-2 text-gray-800 leading-relaxed text-sm">
          <li>
            <strong>Share an article</strong> with someone in your riding who
            should know what their MP is voting on.
          </li>
          <li>
            <strong>Follow on{' '}
              <a
                href="https://x.com/ParliamentAudit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 hover:underline"
              >
                X
              </a>{' '}
              and{' '}
              <a
                href="https://bsky.app/profile/parliamentaudit.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 hover:underline"
              >
                Bluesky
              </a>
            </strong>{' '}
            — algorithms treat engagement as a signal that accountability
            journalism matters.
          </li>
          <li>
            <strong>If you run a newsroom, podcast, or newsletter,</strong> our
            stories are free to{' '}
            <Link href="/republish" className="text-red-700 hover:underline">
              republish
            </Link>
            .
          </li>
          <li>
            <strong>Tip us.</strong> See a vote we missed? An MP whose record
            deserves a closer look? Email{' '}
            <a
              href="mailto:hello@parliamentaudit.ca"
              className="text-red-700 hover:underline"
            >
              hello@parliamentaudit.ca
            </a>
            .
          </li>
        </ul>
      </section>

      {/* The honest footer */}
      <section className="bg-[#1a1a2e] text-white rounded-lg p-6">
        <h2 className="text-lg font-bold mb-2">A note on non-partisan funding</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          We will not take money from a political party, a political riding
          association, or a registered third-party advertiser. We will not take
          money conditional on specific coverage. We will cap any single
          contributor at 20% of annual revenue. If those lines ever shift, you
          will see the new policy before the money does.
        </p>
      </section>
    </div>
  );
}
