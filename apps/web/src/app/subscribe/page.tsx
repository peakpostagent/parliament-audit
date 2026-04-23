import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SubscribeForm } from '@/components/SubscribeForm';

export const metadata: Metadata = {
  title: 'Subscribe',
  description: 'Get notified when Parliament votes on the issues that matter to you.',
};

export default function SubscribePage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Stay Informed</h1>
      <p className="text-gray-600 mb-6">
        Get notified when Parliament votes. We&apos;ll send you a brief summary of each recorded
        division so you always know what&apos;s happening in Ottawa.
      </p>

      <Suspense fallback={<div className="bg-gray-50 border rounded-lg p-6 animate-pulse h-80" />}>
        <SubscribeForm />
      </Suspense>

      {/* Social follow */}
      <div className="mt-8 bg-[#1a1a2e] text-white rounded-lg p-6">
        <h2 className="font-bold mb-3">Follow Us on Social Media</h2>
        <p className="text-gray-300 text-sm mb-4">
          Get vote summaries in your feed. Every recorded division, explained in plain English.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://x.com/ParliamentAudit"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-sm transition-colors"
          >
            X / Twitter
          </a>
        </div>
      </div>
    </div>
  );
}
