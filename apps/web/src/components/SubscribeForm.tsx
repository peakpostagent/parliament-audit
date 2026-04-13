'use client';

import { useState, type FormEvent } from 'react';

export function SubscribeForm() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800 font-bold text-lg mb-2">You're on the list!</p>
        <p className="text-green-700 text-sm">
          We'll notify you at <strong>{email}</strong> once vote alerts go live.
          Email delivery is coming soon — we're finishing the final setup.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border rounded-lg p-6">
      <h2 className="font-bold mb-3">Email Alerts</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
  );
}
