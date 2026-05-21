'use client';

/**
 * Action embed component — appears at the bottom of every news article.
 *
 * Pattern borrowed from 5 Calls (41K Bluesky followers, 10M+ calls
 * routed): convert civic-content attention into a single low-friction
 * action. Canadian context: MPs respond to constituent EMAIL much more
 * than to call volume, so this is email-first, with optional mailto:
 * deep-link.
 *
 * Three states:
 *   1. Idle — postal-code input + CTA
 *   2. Looked up — show the resolved MP + a pre-drafted message template
 *      built from the article's headline + summary
 *   3. Copied / opened email — analytics fires, confirmation message
 *
 * Reuses /api/lookup-mp (already powers /find-your-mp).
 * Analytics events:
 *   - contact-mp-lookup-submitted
 *   - contact-mp-lookup-success / error
 *   - contact-mp-message-copied
 *   - contact-mp-email-opened
 */
import { useState, type FormEvent } from 'react';
import { track } from '@/lib/analytics';

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

interface ContactYourMPProps {
  articleSlug: string;
  articleHeadline: string;
  /** A short topic phrase that fits in a sentence — e.g. "Bill C-22". */
  articleTopic?: string;
}

export function ContactYourMP({ articleSlug, articleHeadline, articleTopic }: ContactYourMPProps) {
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [mp, setMp] = useState<Representative | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Topic fallback: try to extract a Bill-name-ish phrase from the
  // headline, otherwise use the first clause (split on em-dash, colon,
  // or period) of the headline up to 80 chars.
  const topic =
    articleTopic ||
    articleHeadline.match(/(Bill C-?\d+|Bill S-?\d+)/i)?.[1] ||
    articleHeadline.split(/[—:.]/)[0].slice(0, 80).trim();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
    if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleaned)) {
      setError('Please enter a valid Canadian postal code (e.g. K1A 0A6).');
      setMp(null);
      return;
    }
    setLoading(true);
    setError(null);
    setMp(null);
    track('contact-mp-lookup-submitted', {
      slug: articleSlug,
      postalPrefix: cleaned.slice(0, 3),
    });
    try {
      const res = await fetch(`/api/lookup-mp?postalCode=${cleaned}`);
      const data = await res.json();
      if (!res.ok || !data.mp) {
        setError(data.error || 'We could not find your MP. Try a different postal code.');
        track('contact-mp-lookup-error', { slug: articleSlug });
      } else {
        setMp(data.mp);
        track('contact-mp-lookup-success', {
          slug: articleSlug,
          mpParty: data.mp.party_name,
        });
      }
    } catch {
      setError('Lookup failed. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  function buildSubject(mpName: string): string {
    return `Constituent feedback on ${topic}`;
  }

  function buildBody(mpName: string): string {
    return [
      `Dear ${mpName.split(' ')[mpName.split(' ').length - 1] ? `${mpName.split(' ')[0]} ${mpName.split(' ').slice(-1)[0]}` : mpName},`,
      '',
      `I'm a constituent in ${mp?.district_name || 'your riding'}.`,
      '',
      `I read about ${topic} on Parliament Audit:`,
      `https://parliamentaudit.ca/news/${articleSlug}`,
      '',
      `As your constituent, I wanted to share my view: [Replace this line with your view in your own words. Specific is better than general.]`,
      '',
      `Thank you for considering this.`,
      '',
      `Sincerely,`,
      `[Your name]`,
      `[Your postal code]`,
    ].join('\n');
  }

  async function copyMessage() {
    if (!mp) return;
    const text = buildBody(mp.name);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      track('contact-mp-message-copied', { slug: articleSlug, mpParty: mp.party_name });
      setTimeout(() => setCopied(false), 3500);
    } catch {
      /* clipboard denied; user can still select text */
    }
  }

  function openEmail() {
    if (!mp || !mp.email) return;
    const subject = encodeURIComponent(buildSubject(mp.name));
    const body = encodeURIComponent(buildBody(mp.name));
    track('contact-mp-email-opened', { slug: articleSlug, mpParty: mp.party_name });
    window.location.href = `mailto:${mp.email}?subject=${subject}&body=${body}`;
  }

  return (
    <section className="mt-8 border-2 border-red-100 rounded-lg bg-gradient-to-br from-red-50/40 to-white p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="text-3xl leading-none" aria-hidden="true">
          ✉️
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 m-0">Tell your MP what you think</h2>
          <p className="text-sm text-gray-600 mt-1 mb-0">
            Your MP votes on this. Their constituency inbox is the most-read channel for feedback on bills in committee.
          </p>
        </div>
      </div>

      {!mp ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1">
            <span className="sr-only">Postal code</span>
            <input
              type="text"
              inputMode="text"
              autoComplete="postal-code"
              maxLength={7}
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Postal code (e.g. K1A 0A6)"
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Postal code"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded transition-colors"
          >
            {loading ? 'Looking up…' : 'Find my MP'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded bg-white border border-gray-200">
            {mp.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mp.photo_url}
                alt={`${mp.name}`}
                width={56}
                height={56}
                className="rounded object-cover"
              />
            ) : null}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900">{mp.name}</div>
              <div className="text-sm text-gray-600">
                {mp.party_name} · {mp.district_name}, {mp.province}
              </div>
              {mp.email && (
                <div className="text-sm mt-1">
                  <a
                    href={`mailto:${mp.email}`}
                    className="text-red-700 hover:text-red-900 underline"
                  >
                    {mp.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Suggested message — personalize before sending
            </div>
            <textarea
              readOnly
              rows={10}
              value={buildBody(mp.name)}
              className="w-full font-mono text-xs leading-relaxed p-3 bg-gray-50 border border-gray-200 rounded text-gray-800"
              aria-label="Suggested message text"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copyMessage}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy message'}
            </button>
            {mp.email && (
              <button
                type="button"
                onClick={openEmail}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
              >
                Open email
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMp(null);
                setPostalCode('');
                setError(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Reset
            </button>
          </div>

          <p className="text-xs text-gray-500 m-0">
            Personalize the bracketed parts before sending. MP offices weigh personalized constituent letters significantly more than form-letter floods.
          </p>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

