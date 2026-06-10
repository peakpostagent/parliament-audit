/**
 * Emergency-recycle post generator.
 *
 * Last-resort cadence tool: when there is no new article, the mirror
 * queue is empty, and the day would otherwise go silent on Bluesky,
 * re-promote one of our own back-catalogue articles with a FRESH post
 * body (never a verbatim repeat of the original promo).
 *
 * Selection rules (per project_growth_strategy 2026-06-10):
 *   - Accountability-category articles only (7.0 engagements/post vs
 *     2.3 for Legislation explainers — recycling is for impact).
 *   - Older than RECYCLE_MIN_AGE_DAYS (don't re-promote something the
 *     feed saw last week).
 *   - Not recycled within RECYCLE_COOLDOWN_DAYS (state-tracked).
 *   - Least-recently-recycled first; never-recycled before any
 *     recycled.
 *
 * Generation: Sonnet writes the fresh body under the same wire-reporter
 * voice rules as claude-proofread.ts. Hard 270-char cap (Bluesky 300
 * minus CTA headroom); one retry with a "shorter" instruction, then
 * bail rather than ship something trimmed mid-sentence. ~$0.01/run.
 *
 * Usage:
 *   npx tsx scripts/social-brief/emergency-recycle.ts            # dry-run
 *   npx tsx scripts/social-brief/emergency-recycle.ts --apply    # post it
 */
import dotenv from 'dotenv';
dotenv.config({ override: true });
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const ROOT = process.cwd();
const STATE_PATH = resolve(ROOT, 'content/social-briefs/.recycle-state.json');
const APPLY = process.argv.includes('--apply');

const RECYCLE_MIN_AGE_DAYS = 14;
const RECYCLE_COOLDOWN_DAYS = 60;
const CHAR_CAP = 270;

interface RecycleState {
  /** slug → ISO date of last recycle */
  recycled: Record<string, string>;
}

function loadState(): RecycleState {
  if (!existsSync(STATE_PATH)) return { recycled: {} };
  try {
    return { recycled: {}, ...JSON.parse(readFileSync(STATE_PATH, 'utf8')) };
  } catch {
    return { recycled: {} };
  }
}

async function main() {
  // Import the article catalogue directly — pure data module, same
  // import path the series staging files use.
  const mod = await import('../../apps/web/src/content/news-articles.js');
  const articles: any[] = mod.newsArticles;
  const state = loadState();
  const now = Date.now();

  const candidates = articles
    .filter((a) => a.category === 'Accountability')
    .filter((a) => now - new Date(a.publishedAt).getTime() >= RECYCLE_MIN_AGE_DAYS * 86400e3)
    .filter((a) => {
      const last = state.recycled[a.slug];
      return !last || now - new Date(last).getTime() >= RECYCLE_COOLDOWN_DAYS * 86400e3;
    })
    .sort((a, b) => {
      const la = state.recycled[a.slug] || '';
      const lb = state.recycled[b.slug] || '';
      if (la !== lb) return la.localeCompare(lb); // never-recycled ('' sorts first)
      // tie-break: oldest article first
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    });

  if (candidates.length === 0) {
    console.log('[recycle] no eligible candidates (age/cooldown filters) — nothing to do');
    return;
  }
  const pick = candidates[0];
  console.log(`[recycle] candidate: ${pick.slug} (published ${pick.publishedAt.slice(0, 10)}, last recycled: ${state.recycled[pick.slug] || 'never'})`);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[recycle] ANTHROPIC_API_KEY missing — cannot generate fresh body. Aborting.');
    process.exit(1);
  }

  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic();

  const SYSTEM = `You write social posts for @ParliamentAudit, a non-partisan Canadian civic-media account.
Voice rules (non-negotiable):
- Wire-reporter archetype: factual, no opinions, no engagement-bait openers, no rhetorical questions, no BREAKING, no emoji, no hashtags.
- Plain English. Numbers read-aloud-clear.
- Every claim must come from the article material provided. Do not add facts.
- The hook lives in the first 8 words: open with the named actor or the verdict-number, never with background.
- This is a RE-PROMOTION of an older article. Do NOT pretend it is new ("today", "just", "breaking" are banned). Timeless framing: the documented facts stand on their own.
Output ONLY the post body. No preamble, no quotes around it. HARD LIMIT: ${CHAR_CAP} characters.`;

  const material = [
    `Headline: ${pick.headline}`,
    pick.smartBrevity?.bigThing ? `Big thing: ${pick.smartBrevity.bigThing}` : '',
    pick.keyTakeaways?.length ? `Key facts:\n${pick.keyTakeaways.slice(0, 6).map((k: string) => `- ${k}`).join('\n')}` : '',
  ].filter(Boolean).join('\n\n');

  const ask = `Write a fresh promo post for this article:\n\n${material}`;
  let body = '';
  for (let attempt = 1; attempt <= 2; attempt++) {
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> =
      attempt === 1
        ? [{ role: 'user', content: ask }]
        : [
            { role: 'user', content: ask },
            { role: 'assistant', content: body },
            { role: 'user', content: `That was ${body.length} characters — over the ${CHAR_CAP} hard limit. Rewrite tighter. Same rules.` },
          ];
    const res = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: SYSTEM,
      messages,
    });
    body = res.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('')
      .trim()
      .replace(/^["']|["']$/g, '');
    if (body.length <= CHAR_CAP) break;
  }
  if (!body || body.length > CHAR_CAP) {
    console.error(`[recycle] generation failed to fit ${CHAR_CAP} chars after retry (${body.length}). Aborting — do not ship a mid-sentence trim.`);
    process.exit(1);
  }

  console.log(`[recycle] generated body (${body.length} chars):\n---\n${body}\n---`);

  if (!APPLY) {
    console.log('[recycle] dry-run (pass --apply to post). State not updated.');
    return;
  }

  // Post via the standard Bluesky path (link card, UTM campaign).
  const tmpFile = join(tmpdir(), `recycle-${Date.now()}.txt`);
  writeFileSync(tmpFile, body, 'utf8');
  const campaign = `recycle-${pick.slug.slice(0, 40)}-${new Date().toISOString().slice(0, 10)}`;
  const out = execSync(
    `npx tsx scripts/post-arbitrary-bluesky.ts --text-file ${JSON.stringify(tmpFile)} --slug ${JSON.stringify(pick.slug)} --campaign ${JSON.stringify(campaign)} --no-cta`,
    { cwd: ROOT, encoding: 'utf8', timeout: 120_000 },
  );
  console.log(out.trim().split('\n').slice(-3).join('\n'));
  if (!out.includes('verified live')) {
    console.error('[recycle] Bluesky post not verified — state NOT updated (will retry next run).');
    process.exit(1);
  }

  state.recycled[pick.slug] = new Date().toISOString();
  mkdirSync(resolve(ROOT, 'content/social-briefs'), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  console.log(`[recycle] ✓ posted + state updated for ${pick.slug}`);
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
