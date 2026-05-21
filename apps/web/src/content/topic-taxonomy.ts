/**
 * Topic taxonomy for per-MP voting summaries (idea #1 from the
 * 2026-05-20 competitive review — TheyWorkForYou / They Vote For You
 * pattern).
 *
 * The taxonomy is deliberately small (~12 buckets). Larger taxonomies
 * fragment too quickly with the volume of votes a single MP casts in
 * a session, producing per-MP-per-topic counts that are too small to
 * say anything meaningful. Twelve buckets is what TheyWorkForYou
 * actually uses on its public MP pages, and it works.
 *
 * Each bill or vote-subject can carry multiple tags. The aggregator
 * (scripts/analytics/per-mp-topical.ts — to come) will count each
 * vote once per tag, so a Bill C-22 vote contributes to both
 * "privacy-surveillance" AND "civil-liberties" simultaneously.
 *
 * What we DON'T have yet: per-MP vote data. The ourcommons.ca XML
 * feed exposes only totals, not per-member votes. To get per-MP
 * votes we either fetch the per-division detail XML (one HTTP per
 * vote) or query OpenParliament's API. The follow-up task (#23)
 * will wire that in.
 */

export const TOPICS = [
  'privacy-surveillance',
  'civil-liberties',
  'fiscal-budget',
  'immigration',
  'climate-energy',
  'healthcare',
  'indigenous',
  'accountability-ethics',
  'criminal-justice',
  'defence-foreign',
  'social-policy',
  'democratic-reform',
] as const;
export type Topic = (typeof TOPICS)[number];

/**
 * Human-readable labels for the UI. Kept short so they fit in the
 * "voted strongly for X" sentence template without truncation.
 */
export const TOPIC_LABELS: Record<Topic, { label: string; description: string }> = {
  'privacy-surveillance': {
    label: 'privacy & surveillance',
    description: 'Lawful-access powers, metadata retention, encryption, government data-collection.',
  },
  'civil-liberties': {
    label: 'civil liberties',
    description: 'Charter rights, due process, freedom of expression / assembly / association.',
  },
  'fiscal-budget': {
    label: 'fiscal & budget',
    description: 'Federal spending, taxation, deficit, departmental cuts, fiscal updates.',
  },
  immigration: {
    label: 'immigration',
    description: 'Refugee policy, citizenship, work / study permits, border, deportation.',
  },
  'climate-energy': {
    label: 'climate & energy',
    description: 'Greenhouse-gas policy, electricity, hydrocarbons, environmental review.',
  },
  healthcare: {
    label: 'healthcare',
    description: 'Drug benefits, Health Canada, federal transfers, dental and pharmacare.',
  },
  indigenous: {
    label: 'Indigenous matters',
    description: 'First Nations, Inuit, Métis policy, land, jurisdiction, child welfare.',
  },
  'accountability-ethics': {
    label: 'accountability & ethics',
    description: 'Conflict-of-interest, lobbying, access-to-information, in-camera votes, audit.',
  },
  'criminal-justice': {
    label: 'criminal justice',
    description: 'Criminal Code amendments, sentencing, bail, parole, victims, hate-related law.',
  },
  'defence-foreign': {
    label: 'defence & foreign affairs',
    description: 'CAF spending, NATO, treaties, foreign-interference response, trade.',
  },
  'social-policy': {
    label: 'social policy',
    description: 'Childcare, housing, EI, seniors, social transfers, labour.',
  },
  'democratic-reform': {
    label: 'democratic reform',
    description: 'Elections, nomination rules, floor crossing, byelections, parliamentary procedure.',
  },
};

/**
 * Bill-to-topic mapping for bills we've covered in articles or that
 * have shown up in recent recorded votes.
 *
 * The structure: keyed by the bill code as it appears on the
 * ourcommons.ca XML feed (e.g. "C-22", "S-7"). Values are arrays
 * of Topic tags — most bills cleanly map to 1–3 topics.
 *
 * Coverage philosophy: add a bill here as soon as we cover it OR
 * once we see it in a recorded vote (which the watcher exposes).
 * Aggregator skips any bill not tagged here — silent skipping is
 * the right behavior because un-tagged bills shouldn't pollute the
 * "voted strongly for X" numbers.
 */
export const BILL_TOPICS: Record<string, Topic[]> = {
  // Bills covered in our news articles (current as of 2026-05-20)
  'C-22': ['privacy-surveillance', 'civil-liberties'],       // Lawful Access Act, 2026
  'C-12': ['immigration', 'civil-liberties'],                 // Immigration overhaul (public-interest visa cancellation)
  'C-11': ['defence-foreign'],                                // National Defence Act amendments (in the live feed today)
  'C-9': ['criminal-justice'],                                // Combatting Hate Act (religious-exemption removal)
  'C-225': ['criminal-justice', 'social-policy'],             // Bailey's Law (IPV / first-degree-murder framing)

  // Add new bills here as we cover them. Format:
  //   'C-NN': ['topic-a', 'topic-b'],
};

/**
 * Subject-keyword fallback when a vote has no bill code (e.g. an
 * opposition motion, ways-and-means motion, ministerial statement).
 *
 * The aggregator scans the DecisionDivisionSubject text for these
 * substrings (case-insensitive) and tags the vote accordingly.
 * Order matters: first match wins; more-specific terms first.
 */
export const SUBJECT_KEYWORDS: Array<{ pattern: RegExp; topics: Topic[] }> = [
  // Privacy / surveillance
  { pattern: /lawful access|metadata retent|surveillance|wiretap|interception/i, topics: ['privacy-surveillance', 'civil-liberties'] },
  // Climate / energy
  { pattern: /carbon tax|carbon price|emissions|net[- ]zero|fossil|pipeline|petroleum|clean fuel|electricity grid/i, topics: ['climate-energy'] },
  // Fiscal / budget
  { pattern: /budget|estimates|appropriation|ways and means|fiscal update|spending|deficit|debt ceiling/i, topics: ['fiscal-budget'] },
  // Healthcare
  { pattern: /pharmacare|dental care|drug benefit|health canada|opioid|hospital fund|medical assist/i, topics: ['healthcare'] },
  // Immigration
  { pattern: /immigration|refugee|asylum|citizenship|work permit|study permit|deport|safe third country/i, topics: ['immigration'] },
  // Indigenous
  { pattern: /first nation|inuit|métis|indigenous|residential school|treaty|self[- ]government|UNDRIP/i, topics: ['indigenous'] },
  // Defence / foreign
  { pattern: /national defence|canadian armed forces|caf|nato|nor[ad]|ukraine|israel|tariff|trade agreement/i, topics: ['defence-foreign'] },
  // Criminal justice
  { pattern: /criminal code|sentencing|bail reform|parole|firearm|young offender|mandatory minimum|hate (crime|propaganda)/i, topics: ['criminal-justice'] },
  // Democratic reform
  { pattern: /elections|nomination|electoral|byelection|floor.crossing|parliamentary procedure|standing orders/i, topics: ['democratic-reform'] },
  // Accountability / ethics
  { pattern: /conflict of interest|lobbying|access to information|ethics commissioner|auditor general|in[- ]camera|whistleblower/i, topics: ['accountability-ethics'] },
  // Social policy
  { pattern: /childcare|housing|employment insurance|EI claim|seniors|guaranteed income|minimum wage|labour code/i, topics: ['social-policy'] },
];

/**
 * Resolve a vote's tags. Used by the aggregator and (eventually)
 * by the post-drafting layer that decides what label to put on a
 * vote-of-the-day post.
 */
export function tagsForVote(billCode: string, subject: string): Topic[] {
  const tags = new Set<Topic>();
  if (billCode) {
    const fromBill = BILL_TOPICS[billCode.replace(/\s+/g, '')];
    if (fromBill) for (const t of fromBill) tags.add(t);
  }
  for (const { pattern, topics } of SUBJECT_KEYWORDS) {
    if (pattern.test(subject)) {
      for (const t of topics) tags.add(t);
    }
  }
  return Array.from(tags);
}
