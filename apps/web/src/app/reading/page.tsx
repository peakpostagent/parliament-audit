import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * /reading — curated civic-literacy reading list + digital-privacy
 * tools. This is Parliament Audit's affiliate-revenue surface.
 *
 * Editorial-integrity rules for this page (do not relax without an
 * operator decision):
 *   1. Affiliate links live ONLY on this page — never inside news
 *      articles. Reporting and revenue stay physically separated.
 *   2. Every recommendation must be something we would recommend at
 *      zero commission. The list is curated for civic value first.
 *   3. The disclosure block at the top is mandatory and load-bearing.
 *   4. rel="sponsored" on every affiliate link (Google webmaster
 *      guidelines require it; omitting it risks the SEO channel that
 *      is currently our top acquisition source).
 *
 * AFFILIATE STATUS (2026-06-10): placeholder mode. The links below
 * are plain retail/search links until the operator completes
 * sign-ups. To activate, fill in AFFILIATE config:
 *   - Bookshop.org: apply at bookshop.org/affiliates → set bookshopShop
 *     (links become https://bookshop.org/shop/<shopName> format or
 *     /a/<id>/<isbn9781234567890>). 10% commission per sale.
 *   - NordVPN: nordvpn.com/affiliate → set nordUrl. 40% on 1yr/2yr plans.
 *   - ExpressVPN: expressvpn.com/affiliates → set expressUrl. $13-36/signup.
 */
const AFFILIATE = {
  // e.g. 'parliament-audit' once the Bookshop.org shop is approved.
  bookshopShop: '' as string,
  // Full tracked URLs from the VPN affiliate dashboards, once approved.
  nordUrl: '' as string,
  expressUrl: '' as string,
};

interface Book {
  title: string;
  author: string;
  year: string;
  blurb: string;
  /** ISBN-13 digits only — used for Bookshop affiliate deep links. */
  isbn?: string;
}

const BOOKS: Book[] = [
  {
    title: 'Tragedy in the Commons',
    author: 'Alison Loat & Michael MacMillan',
    year: '2014',
    blurb:
      'Eighty exit interviews with former MPs from every party, conducted by the Samara Centre for Democracy. The most candid record in print of what the job of MP actually is — and how party discipline hollows it out. If you read one book on this list, read this one.',
    isbn: '9780307361332',
  },
  {
    title: 'Whipped: Party Discipline in Canada',
    author: 'Alex Marland',
    year: '2020',
    blurb:
      'The definitive study of how Canadian parties control their MPs — message scripts, vote whipping, nomination threats. Essential context for every recorded division we cover: most MPs vote the way they are told, and this book documents the machinery that tells them.',
    isbn: '9780774864961',
  },
  {
    title: 'Governing from the Centre',
    author: 'Donald J. Savoie',
    year: '1999',
    blurb:
      'Savoie\'s landmark argument that power in Ottawa has concentrated in the Prime Minister\'s Office at the expense of cabinet and Parliament. Older now, but the dynamic it documents has only intensified — it explains why Question Period theatre and PMO message control look the way they do.',
    isbn: '9780802082527',
  },
  {
    title: 'Democracy in Canada: The Disintegration of Our Institutions',
    author: 'Donald J. Savoie',
    year: '2019',
    blurb:
      'Savoie twenty years on: Parliament, the public service, and federalism are all losing the capacity to hold power to account. A sobering institutional diagnosis from the country\'s leading scholar of public administration.',
    isbn: '9780773559011',
  },
  {
    title: 'Two Cheers for Minority Government',
    author: 'Peter H. Russell',
    year: '2008',
    blurb:
      'Why minority parliaments — like the one Canada has now — are not a malfunction but arguably Parliament working as designed: governments that must actually negotiate for every vote. Directly relevant to reading the vote math we publish.',
    isbn: '9781552393680',
  },
  {
    title: 'The People\'s House of Commons',
    author: 'David E. Smith',
    year: '2007',
    blurb:
      'A constitutional scholar\'s examination of what the House of Commons is actually for — representation, accountability, legitimacy — and the gap between the theory and the practice. Good companion to our procedural explainers.',
    isbn: '9780802094650',
  },
];

function bookLink(b: Book): string {
  if (AFFILIATE.bookshopShop && b.isbn) {
    return `https://bookshop.org/a/${AFFILIATE.bookshopShop}/${b.isbn}`;
  }
  // Placeholder mode: plain Bookshop search link (no commission, always works).
  return `https://bookshop.org/search?keywords=${encodeURIComponent(`${b.title} ${b.author}`)}`;
}

export const metadata: Metadata = {
  // Root layout template appends "— Parliament Audit".
  title: 'Reading List: Understand Parliament',
  description:
    'Six books that explain how Canadian Parliament actually works — party discipline, the PMO, minority government — plus the digital-privacy tools we use.',
  alternates: { canonical: '/reading' },
};

export default function ReadingPage() {
  const affiliateActive = Boolean(AFFILIATE.bookshopShop || AFFILIATE.nordUrl || AFFILIATE.expressUrl);
  return (
    <div className="max-w-3xl mx-auto">
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-red-600">Home</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span className="text-gray-700">Reading</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Understand Parliament: a reading list
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        The six books we reach for most when writing our explainers — on party
        discipline, the concentration of power in the PMO, and what MPs can and
        can&apos;t actually do. Plus the digital-privacy tools relevant to our
        surveillance-legislation coverage.
      </p>

      {/* Disclosure — mandatory, load-bearing. */}
      <aside className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
        <span className="font-semibold">How this page is funded:</span>{' '}
        {affiliateActive ? (
          <>
            some links on this page are affiliate links — if you buy through
            them, Parliament Audit earns a commission at no extra cost to you.
            Book links go to Bookshop.org, which also gives 10% of every sale
            to independent Canadian bookstores.
          </>
        ) : (
          <>
            links on this page are currently plain retail links — we earn
            nothing from them. We may add affiliate links in the future; if we
            do, this notice will say so plainly.
          </>
        )}{' '}
        Every recommendation here is something we would recommend at zero
        commission, and affiliate links never appear inside our news
        reporting. See our{' '}
        <Link href="/methodology" className="underline hover:text-red-700">
          methodology
        </Link>{' '}
        for the full editorial-independence policy.
      </aside>

      {/* Books */}
      <section className="mb-12" aria-labelledby="books-heading">
        <h2 id="books-heading" className="text-xl font-bold mb-5">
          The books
        </h2>
        <ol className="space-y-6">
          {BOOKS.map((b, i) => (
            <li key={b.title} className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-red-700 font-bold" aria-hidden="true">
                  {i + 1}.
                </span>
                <h3 className="font-bold text-lg text-[#1a1a2e]">
                  {b.title}
                  <span className="font-normal text-gray-500 text-sm ml-2">
                    {b.author} · {b.year}
                  </span>
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3 ml-7">{b.blurb}</p>
              <a
                href={bookLink(b)}
                target="_blank"
                rel={AFFILIATE.bookshopShop ? 'sponsored noopener' : 'noopener'}
                className="ml-7 inline-block text-sm font-medium text-red-700 hover:text-red-800 underline"
              >
                Find it on Bookshop.org →
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* Privacy tools — relevant to our C-22 / lawful-access beat */}
      <section className="mb-12" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="text-xl font-bold mb-2">
          Digital-privacy tools
        </h2>
        <p className="text-gray-600 mb-5 text-sm leading-relaxed">
          We cover Canadian surveillance and lawful-access legislation (Bill
          C-22) extensively. Readers regularly ask what tools are relevant. Two
          notes first: a VPN does <em>not</em> protect you from lawful-access
          orders served on the services you use, and Canadian law does not
          prohibit VPN use. What a VPN does is limit what your internet
          provider — and anyone with access to its records — can see about
          your browsing.
        </p>
        <ul className="space-y-4">
          <li className="border border-gray-200 rounded-lg p-5">
            <h3 className="font-bold text-[#1a1a2e] mb-1">Signal (free)</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-2">
              End-to-end encrypted messaging, open-source, runs on donations —
              and the service that told Parliament it would exit Canada rather
              than build a Bill C-22 backdoor. Not an affiliate link; there is
              no commercial relationship. It is simply the correct default
              recommendation.
            </p>
            <a
              href="https://signal.org"
              target="_blank"
              rel="noopener"
              className="text-sm font-medium text-red-700 hover:text-red-800 underline"
            >
              signal.org →
            </a>
          </li>
          <li className="border border-gray-200 rounded-lg p-5">
            <h3 className="font-bold text-[#1a1a2e] mb-1">A reputable VPN</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-2">
              If you want one, pick a provider with a published no-logs policy
              that has survived an independent audit. NordVPN and ExpressVPN
              both qualify; privacy-maximalists often prefer Mullvad, which
              takes cash payments and runs no affiliate program at all — a
              recommendation that costs us money to make, which is rather the
              point of this page&apos;s editorial policy.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={AFFILIATE.nordUrl || 'https://nordvpn.com'}
                target="_blank"
                rel={AFFILIATE.nordUrl ? 'sponsored noopener' : 'noopener'}
                className="text-sm font-medium text-red-700 hover:text-red-800 underline"
              >
                NordVPN →
              </a>
              <a
                href={AFFILIATE.expressUrl || 'https://www.expressvpn.com'}
                target="_blank"
                rel={AFFILIATE.expressUrl ? 'sponsored noopener' : 'noopener'}
                className="text-sm font-medium text-red-700 hover:text-red-800 underline"
              >
                ExpressVPN →
              </a>
              <a
                href="https://mullvad.net"
                target="_blank"
                rel="noopener"
                className="text-sm font-medium text-red-700 hover:text-red-800 underline"
              >
                Mullvad (no affiliate program) →
              </a>
            </div>
          </li>
        </ul>
      </section>

      {/* Cross-link into the reporting that motivates the tools section */}
      <section className="mb-8 bg-gray-50 border-l-4 border-red-600 rounded-r-lg p-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          Why we cover this: start with our Bill C-22 series on{' '}
          <Link
            href="/tag/bill-c-22"
            className="underline font-medium hover:text-red-700"
          >
            lawful access and surveillance capability orders
          </Link>
          , or find out{' '}
          <Link href="/find-your-mp" className="underline font-medium hover:text-red-700">
            how your MP voted
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
