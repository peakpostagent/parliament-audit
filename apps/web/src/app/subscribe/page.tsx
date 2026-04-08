import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscribe — Parliament Audit',
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

      {/* Email signup form — Phase 2 will connect to Resend */}
      <div className="bg-gray-50 border rounded-lg p-6">
        <h2 className="font-bold mb-3">Email Alerts</h2>
        <form className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to hear about?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="pref_all" defaultChecked className="rounded" />
                All recorded votes
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="pref_bills" className="rounded" />
                Bill votes only (skip procedural)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="pref_weekly" className="rounded" />
                Weekly digest instead of per-vote
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-md font-medium transition-colors"
          >
            Subscribe
          </button>

          <p className="text-xs text-gray-500 mt-2">
            We respect your inbox. Unsubscribe anytime. We never share your email.
            Parliament Audit is a civic project, not a political campaign.
          </p>
        </form>
      </div>

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
