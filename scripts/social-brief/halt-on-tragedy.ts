/**
 * Tragedy-halt circuit breaker.
 *
 * Polls the headlines of CBC, AP, Reuters, Globe and Mail, and CP wire
 * (Yahoo News Canada syndicate); matches them against a curated lexicon
 * of mass-casualty / tragedy / acute-crisis keywords. If TWO OR MORE
 * sources tripped the SAME keyword family in the last poll window,
 * writes `content/AUTO_PAUSE_TRAGEDY` so daily-ops + auto-amplify halt
 * publishing.
 *
 * The 2-of-N corroboration rule is the key safety check. Any single
 * source can use the word "tragedy" loosely — we only halt when the
 * Canadian newswire as a whole clearly is on a major incident.
 *
 * The flag is auto-cleared on the next clean poll, BUT only after a
 * 6-hour cool-down from the last hit. That avoids whipsaw if the news
 * cycle dips for 30 minutes mid-event.
 *
 * Per content/research/agentic-operators-2026.md §3.2:
 *   - Epicurious tweeted recipes during the Boston Marathon bombing
 *   - SKIMS pushed sales during LA wildfires
 *   - Gap shipped a half-blue half-red sweatshirt as election results
 *     were uncertain
 *
 * These are the failure-mode prototypes. Brand damage is permanent and
 * hour-zero — the pause must be automatic, not waiting on the operator.
 *
 * Usage (cron-friendly):
 *   npx tsx scripts/social-brief/halt-on-tragedy.ts             # poll + decide
 *   npx tsx scripts/social-brief/halt-on-tragedy.ts --status    # show last decision
 *   npx tsx scripts/social-brief/halt-on-tragedy.ts --clear     # manual override
 */

// override: true is load-bearing — see scripts/claude-proofread.ts for
// the Windows empty-shell-var story.
import dotenv from 'dotenv';
dotenv.config({ override: true });
import { writeFileSync, readFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';

const ROOT = process.cwd();
const FLAG_PATH = resolve(ROOT, 'content/AUTO_PAUSE_TRAGEDY');
const STATE_DIR = resolve(ROOT, 'content/social-briefs');
const STATE_PATH = join(STATE_DIR, '.tragedy-state.json');
mkdirSync(STATE_DIR, { recursive: true });

const ARG_STATUS = process.argv.includes('--status');
const ARG_CLEAR = process.argv.includes('--clear');
const ARG_TEST_SONNET = process.argv.includes('--test-sonnet');
const QUIET = process.argv.includes('--quiet');

const NTFY_TOPIC = process.env.NTFY_TOPIC || 'parliamentaudit-posts';
const log = (...args: any[]) => {
  if (!QUIET) console.log(...args);
};

interface TragedyState {
  /** ISO timestamp of last poll */
  lastPolledAt: string | null;
  /** ISO timestamp of last "tripped" decision */
  lastTrippedAt: string | null;
  /** Last keyword family that tripped */
  lastTrippedKey: string | null;
  /** Last list of source-headlines that contributed to the trip */
  lastEvidence: Array<{ source: string; title: string; matched: string }>;
  /**
   * Sonnet second-opinion cache, keyed by a hash of the evidence
   * headlines. Prevents re-calling the API every 30-minute poll while
   * the same event sits in the feeds. Entries are tiny; we keep the
   * last 20.
   */
  sonnetVerdicts?: Record<
    string,
    { verdict: 'real' | 'false_positive'; reasoning: string; at: string }
  >;
}

function loadState(): TragedyState {
  const empty: TragedyState = {
    lastPolledAt: null,
    lastTrippedAt: null,
    lastTrippedKey: null,
    lastEvidence: [],
  };
  if (!existsSync(STATE_PATH)) return empty;
  try {
    return { ...empty, ...JSON.parse(readFileSync(STATE_PATH, 'utf8')) };
  } catch {
    return empty;
  }
}
function saveState(s: TragedyState) {
  writeFileSync(STATE_PATH, JSON.stringify(s, null, 2));
}

interface FeedSource {
  name: string;
  url: string;
}

/**
 * Curated Canadian + international wire feeds. RSS / Atom only — no
 * scraping HTML. Poll order is deterministic so the state file's
 * "evidence" array is stable run-over-run.
 */
const FEEDS: FeedSource[] = [
  { name: 'cbc-top', url: 'https://www.cbc.ca/webfeed/rss/rss-topstories' },
  { name: 'cbc-canada', url: 'https://www.cbc.ca/webfeed/rss/rss-canada' },
  { name: 'cbc-world', url: 'https://www.cbc.ca/webfeed/rss/rss-world' },
  { name: 'globe-canada', url: 'https://www.theglobeandmail.com/arc/outboundfeeds/rss/category/canada/' },
  // Reuters RSS was sunset by Thomson Reuters ~2020; AP RSS endpoints
  // are inconsistent. We keep the polling list to four reliable
  // Canadian sources for now — the 2-of-N corroboration rule still
  // works at 2-of-4. If a future poll proves an additional source
  // stable, add it here.
];

/**
 * Tragedy keyword families. Each "family" must be tripped by ≥2 different
 * feeds within the same poll for the halt to fire. Phrases here should
 * be specific to acute incidents — "war" alone trips on background
 * coverage of any ongoing conflict, so we use "civilians killed",
 * "casualties confirmed", etc.
 *
 * False-positive minimization is more important than recall. The cost
 * of a missed pause is a single off-tone post; the cost of false halts
 * is permanent feed silence + missed cadence.
 */
interface KeywordFamily {
  key: string;
  patterns: RegExp[];
}
const TRAGEDY_FAMILIES: KeywordFamily[] = [
  {
    key: 'mass-casualty',
    patterns: [
      /\bmass shooting\b/i,
      /\bmass casualt(y|ies)\b/i,
      // Tightened 2026-05-12: require ≥5 dead/killed. The old `\d+ dead`
      // pattern tripped on routine single-victim crime ("1 dead in
      // shooting") and historic court rulings ("9 dead in 2009 case
      // smuggling guilty plea"). Mass-casualty definitions in Canadian
      // public-safety literature typically use ≥4–5; we pick 5 to bias
      // toward false-negative over false-positive.
      /\b(at least )?(\d{2,}|[5-9]) (people |civilians |children |students |workers |passengers )?(killed|dead)\b/i,
      /\b(school|workplace) shooting\b/i,
      /\bdeath toll\b/i,
      // Multi-victim stabbing — single fatal stabbings now excluded.
      /\bstabbing (spree|rampage)\b/i,
      /\b(at least )?(\d{2,}|[3-9]) (people |students |children )?(stabbed|injured)\b.*\b(critical|fatal|dead|killed)\b/i,
    ],
  },
  {
    key: 'wildfire-disaster',
    patterns: [
      // Tightened 2026-05-12 (twice): Canadian wildfire season produces
      // weekly single-town evacuation orders. Those don't warrant
      // halting non-partisan vote-tracking content — the brand-damage
      // prototypes (LA wildfires shutting brands down) were
      // multi-region, multi-day, deaths-on-the-newswire events.
      // Require scale signals: state of emergency, fatalities,
      // thousands evacuated, or a destroyed community.
      /\bstate of emergency\b/i,
      /\bhomes destroyed\b/i,
      /\b(town|community|village|city) (destroyed|burned (down|to the ground)|in ruins)\b/i,
      /\b(thousands|tens of thousands) (evacuated|forced to flee|lose their homes|flee)\b/i,
      /\bwildfire (death(s)?|fatalit(y|ies)|kills?)\b/i,
      /\b(wildfire|forest fire) (rages|spreads).*\b(deaths?|killed|fatal|destroyed)\b/i,
    ],
  },
  {
    key: 'flood-disaster',
    patterns: [
      /\bcatastrophic flooding\b/i,
      /\bflash flood\b.*\b(killed|missing|dead)\b/i,
      /\bevacuated due to flooding\b/i,
    ],
  },
  {
    key: 'plane-train-bus',
    patterns: [
      /\bplane crash(es|ed)?\b/i,
      /\btrain derailment\b/i,
      /\bbus crash\b.*\b(killed|dead|fatal)\b/i,
    ],
  },
  {
    key: 'terror-attack',
    patterns: [
      /\bterror(ist)? attack\b/i,
      /\bbombing kills?\b/i,
      // Tightened 2026-05-15: naked /\bvehicle ramming\b/ tripped on
      // single-victim Vancouver West End pedestrian incident with no
      // terror/political intent. Now requires multi-victim or intent signal.
      /\bvehicle ramming\b.*\b(killed|dead|multiple|deaths?|claimed by|terror|attack)\b/i,
      /\b(killed|dead|multiple|deaths?|terror|attack)\b.*\bvehicle ramming\b/i,
      /\bhostage(s|-taking)\b/i,
      /\bsuicide bomber\b/i,
    ],
  },
  {
    key: 'public-figure-death',
    patterns: [
      /\b(prime minister|premier|mp)\b.*\b(dies|death|killed|assassinated)\b/i,
      /\b(governor general|chief justice)\b.*\b(dies|death)\b/i,
      // Indigenous-specific tragedy framing: residential-school discoveries
      /\b(unmarked graves?|residential school) (discovered|confirmed|announcement)\b/i,
    ],
  },
];

/**
 * Universal anti-patterns: if a headline matches a tragedy family AND
 * any of these, it is NOT counted toward the trip threshold. This
 * filters out retrospective / legal-process / anniversary coverage of
 * historic events, which were the primary cause of false halts.
 *
 * Examples that now correctly DON'T halt:
 *   - "Akwesasne man pleads guilty in case that left 9 dead in 2009"
 *   - "10 years after the Humboldt bus crash, families gather"
 *   - "Inquiry finds 5 children died in Manitoba foster care over decade"
 *
 * Tuning note: kept "trial"/"hearing" out — they could plausibly appear
 * in live coverage of an unfolding event (e.g. "hostage hearing begins
 * after standoff"). The retrospective filter relies on guilty pleas,
 * convictions, sentencing, anniversaries, inquiry findings.
 */
const ANTI_PATTERNS: RegExp[] = [
  /\bpleads? guilty\b/i,
  /\bguilty plea\b/i,
  /\bconvicted\b/i,
  /\bsentenced\b/i,
  /\bverdict\b/i,
  /\bcharged with\b/i,
  /\banniversary\b/i,
  /\b(\d+\s+)?(years|decades|months) (after|ago|later|on|since)\b/i,
  /\b(inquir(y|ies)|coroner)\b.*\b(finds|finding|concludes|hearing|report)\b/i,
  /\b(report|study|review) (finds|finds that|shows|concludes|reveals)\b/i,
  /\b(commemorat|remembrance|memorial service|vigil held)\b/i,
];

/**
 * Tiny RSS/Atom title extractor. Avoids pulling a parser library; we
 * only need <title> elements that follow <item> / <entry> tags.
 *
 * Returns an array of plain-text titles (decoded for the common HTML
 * entities). Skips the channel/feed-level title (the first match).
 */
function extractTitles(xml: string): string[] {
  const titles: string[] = [];
  // Match <title>...</title> within either <item> or <entry> blocks.
  const itemRe = /<(item|entry)[\s>][\s\S]*?<\/\1>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[0];
    const t = block.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i);
    if (t) {
      let s = t[1];
      // Strip CDATA
      s = s.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');
      // Decode the common entities
      s = s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');
      titles.push(s.trim());
    }
  }
  return titles;
}

async function fetchTitles(feed: FeedSource): Promise<string[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { 'user-agent': 'ParliamentAuditTragedyMonitor/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      log(`  [warn] ${feed.name}: HTTP ${res.status}`);
      return [];
    }
    const xml = await res.text();
    return extractTitles(xml).slice(0, 30); // top 30 headlines is plenty
  } catch (e: any) {
    log(`  [warn] ${feed.name}: ${(e?.message || String(e)).slice(0, 80)}`);
    return [];
  }
}

async function notify(title: string, body: string, click?: string) {
  try {
    const headers: Record<string, string> = {
      Title: title,
      Tags: 'siren,parliament_audit,tragedy_halt',
      Priority: '5',
    };
    if (click) headers.Click = click;
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, { method: 'POST', headers, body });
  } catch {}
}

/**
 * Sonnet second opinion on a keyword trip.
 *
 * The regex layer optimizes for recall (never miss a real national
 * moment); this layer restores precision. Operator-approved policy
 * (2026-05-17 editorial direction): the halt may be auto-overridden
 * when Sonnet confirms a false positive. The week of June 2 alone had
 * two false halts (an obituary, a single-victim collision) and one
 * real one (mass-casualty strikes on Ukrainian cities) — the
 * distinction is consistently a judgment call regexes can't make.
 *
 * Judgment standard given to the model: "would a reasonable Canadian
 * reader find a parliamentary vote-tracking post jarring right now?"
 * — NOT "is this event sad." Distant natural disasters with routine
 * coverage: post. Events dominating Canadian front pages with national
 * grief or mass casualties (domestic OR foreign): halt.
 *
 * Fail-safe: any API error, missing key, or ambiguous output returns
 * 'real' (keep the halt). The cost of a wrong clear is brand damage;
 * the cost of a wrong keep is one quiet day. Verdicts are cached by
 * evidence hash so a persisting event costs one API call, not one per
 * 30-minute poll. ~$0.01/call at Sonnet pricing.
 */
async function sonnetSecondOpinion(
  state: TragedyState,
  trippedKey: string,
  evidence: Array<{ source: string; title: string; matched: string }>,
): Promise<{ verdict: 'real' | 'false_positive'; reasoning: string; cached: boolean }> {
  const keep = (reasoning: string, cached = false) =>
    ({ verdict: 'real' as const, reasoning, cached });

  const hash = createHash('sha256')
    .update(evidence.map((e) => e.title).sort().join('\n'))
    .digest('hex')
    .slice(0, 16);
  const cached = state.sonnetVerdicts?.[hash];
  if (cached) return { ...cached, cached: true };

  if (!process.env.ANTHROPIC_API_KEY) {
    return keep('no ANTHROPIC_API_KEY — regex verdict stands');
  }

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic();
    const res = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: [
        'You are the tone-safety judge for @ParliamentAudit, a non-partisan Canadian civic-media account that posts factual parliamentary vote-tracking content.',
        'A keyword monitor paused all posting because tragedy-related headlines appeared in 2+ Canadian news feeds. Your job is to judge whether the pause is warranted.',
        '',
        'The standard is NOT "is this event sad" — it is: "would a reasonable Canadian reader find a dry parliamentary-data post jarring or disrespectful in this news cycle?"',
        '',
        'HALT IS WARRANTED (verdict: real) when the event plausibly dominates Canadian attention with grief or shock: any Canadian mass-casualty event; death/assassination of a major Canadian public figure; a major disaster in Canada; OR a foreign event of front-page-dominating scale (mass-casualty attacks in an active war, a 9/11-scale event, a disaster with major Canadian victims or response).',
        'HALT IS A FALSE POSITIVE when the headlines are: routine ongoing-conflict background coverage; a distant natural disaster receiving ordinary world-news coverage with no Canadian nexus; single-victim crime; retrospective/legal-process/anniversary coverage; or sports/entertainment uses of tragedy vocabulary.',
        '',
        'When genuinely uncertain, answer real (keep the pause) — a wrong clear damages the brand permanently; a wrong keep costs one quiet day.',
        '',
        'Answer in exactly this format:',
        'VERDICT: real | false_positive',
        'REASONING: <one or two sentences>',
      ].join('\n'),
      messages: [
        {
          role: 'user',
          content: `Keyword family tripped: "${trippedKey}"\n\nHeadlines that tripped it:\n${evidence
            .map((e) => `- [${e.source}] "${e.title}" (matched: "${e.matched}")`)
            .join('\n')}\n\nIs this halt warranted?`,
        },
      ],
    });
    const text = res.content
      .filter((b): b is { type: 'text'; text: string } => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
    const vm = text.match(/VERDICT:\s*(real|false_positive)/i);
    const rm = text.match(/REASONING:\s*([\s\S]+)/i);
    if (!vm) return keep('Sonnet output unparseable — regex verdict stands');
    const verdict = vm[1].toLowerCase() as 'real' | 'false_positive';
    const reasoning = (rm?.[1] || '').trim().slice(0, 400) || '(no reasoning returned)';

    state.sonnetVerdicts = state.sonnetVerdicts || {};
    state.sonnetVerdicts[hash] = { verdict, reasoning, at: new Date().toISOString() };
    // Keep the cache bounded.
    const keys = Object.keys(state.sonnetVerdicts);
    if (keys.length > 20) {
      for (const k of keys
        .sort((a, b) =>
          (state.sonnetVerdicts![a].at || '').localeCompare(state.sonnetVerdicts![b].at || ''),
        )
        .slice(0, keys.length - 20)) {
        delete state.sonnetVerdicts[k];
      }
    }
    return { verdict, reasoning, cached: false };
  } catch (e: any) {
    return keep(`Sonnet check failed (${(e?.message || String(e)).slice(0, 80)}) — regex verdict stands`);
  }
}

async function main() {
  if (ARG_CLEAR) {
    if (existsSync(FLAG_PATH)) {
      unlinkSync(FLAG_PATH);
      console.log(`[tragedy-halt] cleared ${FLAG_PATH}`);
      await notify(
        'Tragedy halt CLEARED (manual override)',
        'content/AUTO_PAUSE_TRAGEDY removed by --clear. Auto-publish gate will resume on next daily-ops run.',
      );
    } else {
      console.log('[tragedy-halt] flag not present; nothing to clear');
    }
    return;
  }
  if (ARG_TEST_SONNET) {
    // Exercise the second-opinion path with two known cases from the
    // week of June 2 — one that SHOULD clear, one that SHOULD hold.
    // Uses a throwaway state object so verdicts aren't cached to disk.
    const scratch: TragedyState = { lastPolledAt: null, lastTrippedAt: null, lastTrippedKey: null, lastEvidence: [] };
    const cases = [
      {
        label: 'expect false_positive (distant natural disaster, routine coverage)',
        key: 'mass-casualty',
        evidence: [
          { source: 'cbc-top', title: 'Philippines earthquake leads to landslides, raising death toll to at least 32', matched: 'death toll' },
          { source: 'cbc-world', title: 'Philippines earthquake leads to landslides, raising death toll to at least 32', matched: 'death toll' },
        ],
      },
      {
        label: 'expect real (mass-casualty strikes in active war, front-page scale)',
        key: 'mass-casualty',
        evidence: [
          { source: 'cbc-top', title: 'Russian missile strikes on Kyiv apartment blocks kill at least 28, including children', matched: 'killed' },
          { source: 'globe-canada', title: 'Death toll climbs after overnight strikes across Ukraine; Canada condemns attacks', matched: 'death toll' },
        ],
      },
    ];
    for (const c of cases) {
      const o = await sonnetSecondOpinion(scratch, c.key, c.evidence);
      console.log(`\n[test] ${c.label}`);
      console.log(`  verdict: ${o.verdict}${o.cached ? ' (cached)' : ''}`);
      console.log(`  reasoning: ${o.reasoning}`);
    }
    return;
  }
  if (ARG_STATUS) {
    const s = loadState();
    console.log(`flag-present: ${existsSync(FLAG_PATH)}`);
    console.log(`last-polled: ${s.lastPolledAt ?? 'never'}`);
    console.log(`last-tripped: ${s.lastTrippedAt ?? 'never'}`);
    console.log(`last-key: ${s.lastTrippedKey ?? 'n/a'}`);
    if (s.lastEvidence?.length) {
      console.log('evidence:');
      for (const e of s.lastEvidence) {
        console.log(`  - [${e.source}] ${e.matched} :: ${e.title}`);
      }
    }
    return;
  }

  const state = loadState();
  log(`[tragedy-halt] polling ${FEEDS.length} feeds…`);

  // Pull all feeds in parallel
  const feedTitles = await Promise.all(
    FEEDS.map(async (f) => ({ feed: f, titles: await fetchTitles(f) })),
  );

  // For each family, count distinct sources tripped
  type Hit = { source: string; title: string; matched: string };
  const familyHits: Record<string, Hit[]> = {};
  const antiSkipped: Array<{ source: string; title: string; matched: string; antiMatch: string }> = [];
  for (const fam of TRAGEDY_FAMILIES) {
    familyHits[fam.key] = [];
    const seenSources = new Set<string>();
    for (const ft of feedTitles) {
      // One contributing source per feed-title (don't double-count if
      // a feed has multiple matching headlines — that already raises
      // signal but per the 2-of-N rule we want SOURCE diversity).
      if (seenSources.has(ft.feed.name)) continue;
      for (const title of ft.titles) {
        for (const re of fam.patterns) {
          const m = title.match(re);
          if (m) {
            // Anti-pattern check: skip retrospective / legal-process /
            // anniversary coverage. The headline is still "about" a
            // tragedy keyword but it's not breaking news.
            const anti = ANTI_PATTERNS.map((r) => title.match(r)).find((x) => x);
            if (anti) {
              antiSkipped.push({
                source: ft.feed.name,
                title,
                matched: m[0],
                antiMatch: anti[0],
              });
              continue;
            }
            familyHits[fam.key].push({
              source: ft.feed.name,
              title,
              matched: m[0],
            });
            seenSources.add(ft.feed.name);
            break;
          }
        }
        if (seenSources.has(ft.feed.name)) break;
      }
    }
  }
  if (antiSkipped.length && !QUIET) {
    log(`[tragedy-halt] anti-pattern skipped ${antiSkipped.length} retrospective/legal-process headlines:`);
    for (const a of antiSkipped.slice(0, 5)) {
      log(`  - [${a.source}] "${a.matched}" (anti: "${a.antiMatch}") :: ${a.title}`);
    }
  }

  // Decide: trip if ANY family hit by ≥2 distinct sources
  let tripped: { key: string; evidence: Hit[] } | null = null;
  for (const [key, hits] of Object.entries(familyHits)) {
    if (hits.length >= 2) {
      tripped = { key, evidence: hits };
      break;
    }
  }

  state.lastPolledAt = new Date().toISOString();

  if (tripped) {
    // ── Sonnet second opinion (operator-approved auto-override) ──────
    // Runs on every trip decision, new or persisting. Cached by
    // evidence hash, so a persisting event costs one API call total.
    const opinion = await sonnetSecondOpinion(state, tripped.key, tripped.evidence);
    if (opinion.verdict === 'false_positive') {
      // Do NOT trip. Record the poll, clear any existing flag, move on.
      saveState(state);
      const hadFlag = existsSync(FLAG_PATH);
      if (hadFlag) unlinkSync(FLAG_PATH);
      console.log(
        `[tragedy-halt] regex tripped "${tripped.key}" but Sonnet ruled FALSE POSITIVE${opinion.cached ? ' (cached)' : ''} — ${hadFlag ? 'flag cleared' : 'no flag written'}`,
      );
      console.log(`  reasoning: ${opinion.reasoning}`);
      if (!opinion.cached) {
        await notify(
          'Tragedy halt auto-overridden (Sonnet: false positive)',
          `Family "${tripped.key}" tripped on: "${tripped.evidence[0].title}"\nSonnet: ${opinion.reasoning}`,
        );
      }
      return;
    }
    if (!opinion.cached) {
      log(`[tragedy-halt] Sonnet second opinion: REAL — ${opinion.reasoning}`);
    }

    state.lastTrippedAt = state.lastPolledAt;
    state.lastTrippedKey = tripped.key;
    state.lastEvidence = tripped.evidence;
    saveState(state);
    if (!existsSync(FLAG_PATH)) {
      // First trip — write the flag and ntfy
      const banner = [
        `Parliament Audit auto-publishing PAUSED.`,
        `Reason: tragedy-halt detected family "${tripped.key}" in ≥2 sources.`,
        ``,
        `Evidence:`,
        ...tripped.evidence.map((e) => `- [${e.source}] ${e.matched} :: ${e.title}`),
        ``,
        `This file is auto-cleared by halt-on-tragedy.ts after a 6h clean-poll cool-down.`,
        `To clear manually: npx tsx scripts/social-brief/halt-on-tragedy.ts --clear`,
        `Created: ${state.lastTrippedAt}`,
      ].join('\n');
      writeFileSync(FLAG_PATH, banner);
      console.log(`\n[tragedy-halt] 🚨 TRIPPED — ${tripped.key}`);
      for (const e of tripped.evidence) {
        console.log(`  [${e.source}] "${e.matched}" :: ${e.title}`);
      }
      console.log(`\n[tragedy-halt] wrote ${FLAG_PATH}`);
      await notify(
        '🚨 Auto-publish PAUSED — tragedy halt tripped',
        `${tripped.key}: ${tripped.evidence.map((e) => e.source).join(', ')} corroborated.\nFirst headline: "${tripped.evidence[0].title}"`,
      );
    } else {
      console.log(`[tragedy-halt] still tripped (${tripped.key}); flag remains.`);
    }
    return;
  }

  // No trip on this poll. If a flag is present, check the cool-down.
  if (existsSync(FLAG_PATH)) {
    const minsSinceTrip = state.lastTrippedAt
      ? (Date.now() - new Date(state.lastTrippedAt).getTime()) / 60_000
      : 9999;
    const COOL_DOWN_MIN = 6 * 60; // 6 hours per editorial-autonomy v3
    if (minsSinceTrip >= COOL_DOWN_MIN) {
      unlinkSync(FLAG_PATH);
      console.log(
        `[tragedy-halt] ✓ clean poll + ${Math.round(minsSinceTrip)}m since last trip ≥ ${COOL_DOWN_MIN}m cool-down — flag cleared`,
      );
      await notify(
        '✓ Tragedy halt cleared — auto-publish resuming',
        `${Math.round(minsSinceTrip / 60)}h cool-down complete; news cycle clear of tracked keyword families.`,
      );
    } else {
      console.log(
        `[tragedy-halt] clean poll, but only ${Math.round(minsSinceTrip)}m since last trip — wait for ${COOL_DOWN_MIN}m cool-down. Flag remains.`,
      );
    }
  } else {
    log('[tragedy-halt] ✓ clean poll, no flag.');
  }

  saveState(state);
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
