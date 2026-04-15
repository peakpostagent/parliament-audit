import type { Metadata } from 'next';
import Link from 'next/link';
import { db, schema } from '@parliament-audit/db';
import { eq } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Unsubscribe',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-3">Invalid link</h1>
        <p className="text-gray-600">This unsubscribe link is missing a token. Please use the link from your email.</p>
        <Link href="/" className="inline-block mt-6 text-red-600 hover:text-red-800 underline">Go to Homepage</Link>
      </div>
    );
  }

  const subscriber = await db.query.subscribers.findFirst({
    where: eq(schema.subscribers.unsubscribeToken, token),
  });

  if (!subscriber) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-3">Token not found</h1>
        <p className="text-gray-600">We couldn&apos;t find this unsubscribe link. It may have already been used or is invalid.</p>
        <Link href="/" className="inline-block mt-6 text-red-600 hover:text-red-800 underline">Go to Homepage</Link>
      </div>
    );
  }

  if (!subscriber.unsubscribedAt) {
    await db
      .update(schema.subscribers)
      .set({ unsubscribedAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.subscribers.id, subscriber.id));
  }

  return (
    <div className="max-w-xl mx-auto text-center py-16">
      <h1 className="text-2xl font-bold mb-3">You&apos;ve been unsubscribed</h1>
      <p className="text-gray-600 mb-4">
        We&apos;ve removed <strong>{subscriber.email}</strong> from our mailing list.
        You won&apos;t receive any more vote alerts from us.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Changed your mind? You can always resubscribe on the subscribe page.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/subscribe"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Resubscribe
        </Link>
        <Link
          href="/"
          className="inline-block border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
