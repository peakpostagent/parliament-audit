import type { Metadata } from 'next';
import Link from 'next/link';
import { db, schema } from '@parliament-audit/db';
import { eq, and, isNotNull } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Builders — Parliament Audit',
  description:
    'The readers who fund Parliament Audit. Non-partisan journalism is expensive to run and cheap to break. These are the people who keep it running.',
  alternates: { canonical: '/builders' },
};

export const revalidate = 300;

interface Supporter {
  tier: string;
  displayName: string | null;
  startedAt: Date | string;
}

async function loadSupporters(): Promise<Supporter[]> {
  try {
    const rows = await db
      .select({
        tier: schema.subscribers.supporterTier,
        displayName: schema.subscribers.supporterDisplayName,
        startedAt: schema.subscribers.supporterStartedAt,
      })
      .from(schema.subscribers)
      .where(
        and(
          eq(schema.subscribers.supporterDisplayPublicly, true),
          isNotNull(schema.subscribers.supporterTier),
        ),
      );
    const filtered: Supporter[] = [];
    for (const r of rows) {
      if (r.tier && r.startedAt) {
        filtered.push({
          tier: r.tier,
          displayName: r.displayName,
          startedAt: r.startedAt,
        });
      }
    }
    return filtered.sort((a, b) => {
      const rank: Record<string, number> = { founding: 0, builder: 1, supporter: 2 };
      const ra = rank[a.tier] ?? 3;
      const rb = rank[b.tier] ?? 3;
      if (ra !== rb) return ra - rb;
      return new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
    });
  } catch {
    // DB unavailable — render empty wall gracefully
    return [];
  }
}

export default async function BuildersPage() {
  const supporters = await loadSupporters();
  const founding = supporters.filter((s) => s.tier === 'founding');
  const builders = supporters.filter((s) => s.tier === 'builder');
  const monthlies = supporters.filter((s) => s.tier === 'supporter');

  return (
    <div className="max-w-3xl mx-auto">
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-red-600">
          Home
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <Link href="/support" className="hover:text-red-600">
          Support
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-gray-700">Builders</span>
      </nav>

      <header className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-2">
          The Builders
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          The readers who fund Parliament Audit. Non-partisan journalism is
          expensive to run and cheap to break. These are the people who keep it
          running.
        </p>
      </header>

      {supporters.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-10">
          <p className="text-gray-700 mb-2 font-medium">
            Builders opens soon.
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Nobody listed here yet — we haven&apos;t turned on paid tiers.
            This wall fills up the day we do.
          </p>
          <Link
            href="/support"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
          >
            Join the wait list →
          </Link>
        </div>
      )}

      {founding.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-1">
            Founding Builders
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            The first {founding.length} {founding.length === 1 ? 'reader' : 'readers'} to back Parliament Audit at launch. Listed first, forever.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2">
            {founding.map((s, i) => (
              <li
                key={i}
                className="px-3 py-2 bg-red-50 border border-red-200 rounded text-sm font-medium text-[#1a1a2e]"
              >
                {s.displayName ?? 'A Builder'}
              </li>
            ))}
          </ul>
        </section>
      )}

      {builders.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Builders</h2>
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {builders.map((s, i) => (
              <li
                key={i}
                className="px-3 py-2 bg-amber-50 border border-amber-200 rounded text-sm text-[#1a1a2e]"
              >
                {s.displayName ?? 'A Builder'}
              </li>
            ))}
          </ul>
        </section>
      )}

      {monthlies.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Supporters</h2>
          <ul className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {monthlies.map((s, i) => (
              <li
                key={i}
                className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-gray-700"
              >
                {s.displayName ?? 'A reader'}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="bg-[#1a1a2e] text-white rounded-lg p-6 mt-10">
        <h2 className="text-lg font-bold mb-2">Join them</h2>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          The wall is opt-in — you can become a Builder without being listed
          here. The independence is real either way. Three tiers, full
          tax-compliant billing, cancel any time.
        </p>
        <Link
          href="/support"
          className="inline-block bg-white text-[#1a1a2e] hover:bg-red-600 hover:text-white px-4 py-2 rounded font-semibold transition-colors"
        >
          See the tiers →
        </Link>
      </section>
    </div>
  );
}
