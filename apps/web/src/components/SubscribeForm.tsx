'use client';

import { useState, type FormEvent } from 'react';

interface Props {
  source?: string;
}

export function SubscribeForm({ source = 'subscribe-page' }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string>('');
  const [prefAllVotes, setPrefAllVotes] = useState(true);
  const [prefBillsOnly, setPrefBillsOnly] = useState(false);
  const [prefWeeklyDigest, setPrefWeeklyDigest] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          prefAllVotes,
          prefBillsOnly,
          prefWeeklyDigest,
          source,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setMessage(data.message || 'You\'re subscribed!');
      setSubmitted(true);
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800 font-bold text-lg mb-2">You&apos;re on the list!</p>
        <p className="text-green-700 text-sm">
          {message} We&apos;ll send updates to <strong>{email}</strong>.
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
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What do you want to hear about?
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={prefAllVotes}
                onChange={(e) => setPrefAllVotes(e.target.checked)}
                className="rounded"
                disabled={loading}
              />
              All recorded votes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={prefBillsOnly}
                onChange={(e) => setPrefBillsOnly(e.target.checked)}
                className="rounded"
                disabled={loading}
              />
              Bill votes only (skip procedural)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={prefWeeklyDigest}
                onChange={(e) => setPrefWeeklyDigest(e.target.checked)}
                className="rounded"
                disabled={loading}
              />
              Weekly digest instead of per-vote
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2.5 rounded-md font-medium transition-colors"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>

        <p className="text-xs text-gray-500 mt-2">
          We respect your inbox. Unsubscribe anytime. We never share your email.
          Parliament Audit is a civic project, not a political campaign.
        </p>
      </form>
    </div>
  );
}
