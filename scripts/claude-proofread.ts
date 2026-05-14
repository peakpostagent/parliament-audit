/**
 * Claude-Sonnet-4.6 proofreader for Parliament Audit social drafts.
 *
 * Why this exists: the original proofread gate was Ollama qwen3:14b
 * running locally. It catches grammar but misses the harder editorial
 * issues — asymmetric comparisons (Alberta-petition signatures vs.
 * Quebec-referendum vote results), jargon ("59.6% NO"), or framing
 * that reads as partisan even when each fact is true. Sonnet 4.6 is
 * the recommended Anthropic-API model for writing/editing tasks
 * (98% of Opus 4.7 quality at ~40% lower cost) and consistently
 * catches the framing-class issues our brand can't ship.
 *
 * Usage:
 *   npx tsx scripts/claude-proofread.ts --text-file <path>
 *   npx tsx scripts/claude-proofread.ts --text-file <path> --context "topic ..."
 *
 * Cost note: each call processes ~1K input + ~500 output tokens.
 * At $3/$15 per M tokens that's ~$0.01 per proofread.
 */
// override: true is load-bearing here. dotenv defaults to `override: false`,
// which means a shell-level `ANTHROPIC_API_KEY=` (set empty by Claude Code's
// own auth flow on some Windows shells) silently shadows the value we have
// in .env. The user spent 10 minutes confused by this once — don't repeat.
import dotenv from 'dotenv';
dotenv.config({ override: true });
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

const TEXT_FILE = arg('text-file');
const TEXT_INLINE = arg('text');
const CONTEXT = arg('context') ?? '';
const PLATFORM = arg('platform') ?? 'bluesky-or-x';

let draft = '';
if (TEXT_FILE) draft = readFileSync(TEXT_FILE, 'utf8').trim();
else if (TEXT_INLINE) draft = TEXT_INLINE.trim();
else {
  console.error('Usage: --text-file <path> | --text "<draft>"  [--context "..."]  [--platform bluesky|x]');
  process.exit(1);
}

const SYSTEM = `You are reviewing draft social-media posts for @ParliamentAudit, a non-partisan Canadian civic-media account.

Voice rules (non-negotiable):
- Wire-reporter archetype: factual, no opinions, no engagement-bait openers.
- No loaded verbs (slams, guts, crushes), no rhetorical questions, no BREAKING, no emoji unless the author explicitly added them.
- Plain English over jargon. Numbers and percentages should be read-aloud-clear ("60% voted to stay", not "59.6% NO").
- Non-partisan framing: facts compared symmetrically. If two things are compared, the metrics must be the same kind of thing, or the post must explicitly flag the asymmetry.
- Every claim is verifiable. If a number lacks a source pointer, flag it.

Your job: Read the draft. Flag any of these issues in priority order:
1. ASYMMETRIC COMPARISON — comparing different units/stages/categories as if they were the same.
2. JARGON / UNCLEAR — phrasing that a smart layperson would have to re-read to parse.
3. FRAMING RISK — wording that reads as a "gotcha" against one side, even if each fact is true.
4. UNSOURCED CLAIM — number or quote with no link to a primary source.
5. LENGTH — does this fit X (280 char) and Bluesky (300 char) limits with the auto-CTA "Sources + full breakdown →" (26 chars) appended?

For each issue, return: severity (BLOCK / TUNE / NIT), one-line description, suggested fix.
End with a one-paragraph overall verdict and a rewritten version if you flagged any BLOCK-severity issues.
Reply under 350 words.`;

async function proofreadViaOllama(userText: string): Promise<void> {
  console.log('[claude-proofread] falling back to Ollama qwen3:14b (Anthropic API unreachable)');
  const { spawn } = await import('node:child_process');
  await new Promise<void>((resolve, reject) => {
    const proc = spawn('ollama', ['run', 'qwen3:14b'], { stdio: ['pipe', 'inherit', 'inherit'] });
    proc.on('error', reject);
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ollama exited ${code}`))));
    proc.stdin.write(`${SYSTEM}\n\n${userText}\n`);
    proc.stdin.end();
  });
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const userText = [
    `PLATFORM: ${PLATFORM}`,
    CONTEXT ? `CONTEXT: ${CONTEXT}` : null,
    `DRAFT (between <<< and >>>):`,
    `<<<`,
    draft,
    `>>>`,
  ]
    .filter(Boolean)
    .join('\n\n');

  if (!apiKey) {
    console.warn('[claude-proofread] ANTHROPIC_API_KEY not set — falling back to Ollama.');
    await proofreadViaOllama(userText);
    return;
  }

  const client = new Anthropic({ apiKey });
  console.log(`[claude-proofread] model=claude-sonnet-4-6  draft_len=${draft.length}`);

  try {
    const res = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM,
      messages: [{ role: 'user', content: userText }],
    });

    for (const block of res.content) {
      if (block.type === 'text') {
        process.stdout.write(block.text);
      }
    }
    console.log('\n');
    console.log(
      `[claude-proofread] usage: input=${res.usage.input_tokens} output=${res.usage.output_tokens}  approx cost: $${(
        (res.usage.input_tokens * 3 + res.usage.output_tokens * 15) /
        1_000_000
      ).toFixed(4)}`,
    );
  } catch (err: any) {
    // Fall back to Ollama on any Anthropic API failure (rate limit, network,
    // 5xx, etc.). The local model is slower and less precise, but it beats
    // posting blind. Per the user's preference (2026-05-13): Sonnet primary,
    // Ollama as transparent fallback if API unreachable.
    const isRateLimit = err instanceof Anthropic.RateLimitError;
    const isAPI = err instanceof Anthropic.APIError;
    if (isRateLimit || isAPI || /ENETUNREACH|ENOTFOUND|ECONNREFUSED|ETIMEDOUT/.test(String(err?.message))) {
      console.warn(`[claude-proofread] Anthropic API error (${err?.message?.slice(0, 100)}) — falling back to Ollama.`);
      await proofreadViaOllama(userText);
      return;
    }
    throw err;
  }
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
