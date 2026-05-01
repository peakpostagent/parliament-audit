/**
 * Pre-publish voice refiner — runs a draft post or article section through
 * local Ollama (qwen3:14b) using our voice playbook as a constraint.
 * Returns a polished version + a brief diff explanation.
 *
 * Use cases:
 *   1. Polish a draft .txt before posting:
 *        npx tsx scripts/voice-refiner.ts --file content/social-drafts/foo.txt
 *      Prints the refined text + reasoning. Saves alongside as foo.refined.txt.
 *
 *   2. Refine an inline string:
 *        npx tsx scripts/voice-refiner.ts --text "Big news! NDP CRUSHED it tonight!"
 *
 *   3. Apply playbook checklist only (no rewrite — just feedback):
 *        npx tsx scripts/voice-refiner.ts --file foo.txt --feedback-only
 *
 * Ollama is required to be running locally (default: http://localhost:11434).
 * If unavailable, the script prints a warning and exits 0 — never blocks
 * the rest of the pipeline.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

const FILE = arg('file');
const TEXT_INLINE = arg('text');
const MODE = process.argv.includes('--feedback-only') ? 'feedback' : 'rewrite';
const MODEL = arg('model') || 'qwen3:14b';
const QUIET = process.argv.includes('--quiet');

if (!FILE && !TEXT_INLINE) {
  console.error('Usage: --file <path> | --text "<inline>" [--feedback-only]');
  process.exit(1);
}

const ROOT = process.cwd();
const playbookPath = resolve(ROOT, 'content/voice-playbook.md');
const playbook = existsSync(playbookPath) ? readFileSync(playbookPath, 'utf8') : '';

let draft = '';
if (FILE) {
  const p = resolve(ROOT, FILE);
  if (!existsSync(p)) {
    console.error(`File not found: ${p}`);
    process.exit(1);
  }
  draft = readFileSync(p, 'utf8').trim();
} else {
  draft = TEXT_INLINE!.trim();
}

const prompt =
  MODE === 'rewrite'
    ? `You are an editor at Parliament Audit, a Canadian non-partisan accountability news outlet. Apply the voice playbook to this draft post / article section. Return ONLY the polished version, in plain text, ready to ship. No reasoning, no <think> tags, no preamble.

Constraints (from the playbook):
- Wire-reporter voice (the "late-shift CP/Reuters desk hand" archetype).
- Lead with a concrete fact (a number, a date, a person, a bill) — not a framing word.
- No "BREAKING," no exclamation points, no rhetorical questions, no engagement-bait openers.
- No loaded verbs (slams / crushes / guts / blasts / torches).
- No partisan adjectives. The posts must read fair when each party name is swapped.
- Numbers replace adjectives wherever possible.
- The "quiet close" — last sentence before the link is a declarative fact, not a hook.

Hard limits:
- X posts: ≤ 280 grapheme effective characters (URL = 23 on X).
- Bluesky posts: ≤ 300 graphemes.

# Voice playbook (binding)

${playbook}

# Draft to polish

${draft}

# Polished version (return only this — plain text):`
    : `You are an editor at Parliament Audit. Apply the voice playbook's pre-post checklist to the draft below and return ONLY a numbered list of issues + suggested fixes. No reasoning, no preamble. If the draft passes all checks, return "PASS — ship as-is."

# Voice playbook (binding)

${playbook}

# Draft to evaluate

${draft}

# Numbered issues + fixes:`;

async function run() {
  if (!QUIET) {
    console.log(`[voice-refiner] mode=${MODE} model=${MODEL} draft=${draft.length} chars`);
    console.log('---');
  }
  let res;
  try {
    res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        think: false,
        options: { temperature: 0.3, num_ctx: 32768 },
      }),
      signal: AbortSignal.timeout(120000),
    });
  } catch (e: any) {
    console.error(`[voice-refiner] Ollama unreachable: ${e?.message || e}`);
    console.error('[voice-refiner] Skipping — original draft unchanged.');
    process.exit(0);
  }
  if (!res.ok) {
    console.error(`[voice-refiner] Ollama HTTP ${res.status}`);
    process.exit(0);
  }
  const data = (await res.json()) as { response: string };
  const polished = data.response.trim();
  console.log(polished);

  // If we read from a file in rewrite mode, save alongside as .refined.txt
  if (FILE && MODE === 'rewrite') {
    const refinedPath = resolve(ROOT, FILE.replace(/\.txt$/, '.refined.txt'));
    writeFileSync(refinedPath, polished, 'utf8');
    if (!QUIET) console.error(`\n[voice-refiner] Wrote ${refinedPath}`);
  }
}

run();
