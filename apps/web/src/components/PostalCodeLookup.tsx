'use client';

import { useState, type FormEvent } from 'react';

interface Representative {
  name: string;
  party_name: string;
  district_name: string;
  province: string;
  photo_url: string | null;
  url: string;
  personal_url: string | null;
  email: string | null;
  elected_office: string;
}

interface LookupResult {
  mp: Representative | null;
  senators: Representative[];
  error: string | null;
}

export function PostalCodeLookup() {
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
    if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleaned)) {
      setResult({ mp: null, senators: [], error: 'Please enter a valid Canadian postal code (e.g. K1A 0A6).' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/lookup-mp?postalCode=${cleaned}`);
      const data = await res.json();

      if (!res.ok) {
        setResult({ mp: null, senators: [], error: data.error || 'Something went wrong. Please try again.' });
        return;
      }

      setResult(data);
    } catch {
      setResult({ mp: null, senators: [], error: 'Could not connect to the lookup service. Please try again later.' });
    } finally {
      setLoading(false);
    }
  }

  const partyColor = (party: string) => {
    const p = party.toLowerCase();
    if (p.includes('liberal')) return 'bg-red-600';
    if (p.includes('conservative')) return 'bg-blue-700';
    if (p.includes('ndp') || p.includes('new democratic')) return 'bg-orange-500';
    if (p.includes('bloc')) return 'bg-cyan-600';
    if (p.includes('green')) return 'bg-green-600';
    return 'bg-gray-500';
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Enter postal code (e.g. K1A 0A6)"
          maxLength={7}
          className="flex-1 border-2 border-gray-200 focus:border-red-600 rounded-lg px-4 py-3 text-lg outline-none transition-colors"
          aria-label="Canadian postal code"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          {loading ? 'Looking up...' : 'Find My MP'}
        </button>
      </form>

      {result?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{result.error}</p>
        </div>
      )}

      {result?.mp && (
        <div className="space-y-4">
          <div className="bg-white border-2 border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              {result.mp.photo_url && (
                <img
                  src={result.mp.photo_url}
                  alt={result.mp.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              )}
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Your Member of Parliament</p>
                <h3 className="text-xl font-bold">{result.mp.name}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`${partyColor(result.mp.party_name)} text-white text-xs px-2 py-0.5 rounded-full`}>
                    {result.mp.party_name}
                  </span>
                  <span className="text-sm text-gray-600">{result.mp.district_name}</span>
                </div>
                {result.mp.email && (
                  <p className="text-sm text-gray-500 mt-2">
                    {result.mp.email}
                  </p>
                )}
                <div className="flex gap-3 mt-3">
                  {result.mp.url && (
                    <a
                      href={result.mp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Official Profile
                    </a>
                  )}
                  <a
                    href={`/archive?q=${encodeURIComponent(result.mp.name)}`}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Search Voting Record
                  </a>
                </div>
              </div>
            </div>
          </div>

          {result.senators.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Your Senators ({result.mp.province})</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.senators.map((senator) => (
                  <div key={senator.name} className="bg-gray-50 border rounded-lg p-4">
                    <p className="font-medium">{senator.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`${partyColor(senator.party_name)} text-white text-xs px-2 py-0.5 rounded-full`}>
                        {senator.party_name}
                      </span>
                      <span className="text-xs text-gray-500">{senator.district_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#1a1a2e] text-white rounded-lg p-5 mt-4">
            <p className="font-medium mb-1">Want to know how {result.mp.name} votes?</p>
            <p className="text-gray-300 text-sm mb-3">
              Subscribe to get notified every time a recorded vote happens in Parliament.
            </p>
            <a
              href="/subscribe"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Subscribe for Vote Alerts
            </a>
          </div>
        </div>
      )}

      {result && !result.mp && !result.error && (
        <div className="text-center py-8 text-gray-500">
          <p>No MP found for this postal code. Please check and try again.</p>
        </div>
      )}
    </div>
  );
}
