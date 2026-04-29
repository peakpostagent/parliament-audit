/**
 * Run a brutal editorial review of a draft article via local Ollama
 * (qwen3:14b). Returns model output as critique. Used as a pre-publish
 * second-opinion gate for sensitive accountability stories.
 *
 * Usage:
 *   npx tsx scripts/ollama-review.ts <slug>
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: ollama-review.ts <slug>');
  process.exit(1);
}

// Pull the article from news-articles.ts
const articlesPath = resolve(process.cwd(), 'apps/web/src/content/news-articles.ts');
const file = readFileSync(articlesPath, 'utf8');

// Find the article block by slug
const slugMarker = `slug: '${slug}'`;
const startIdx = file.indexOf(slugMarker);
if (startIdx < 0) {
  console.error(`Could not find article with slug "${slug}"`);
  process.exit(1);
}

// Walk back to the opening { of this article object
let openIdx = startIdx;
while (openIdx > 0 && file[openIdx] !== '{') openIdx--;

// Walk forward through balanced braces to the closing }
let depth = 0;
let endIdx = openIdx;
for (let i = openIdx; i < file.length; i++) {
  const c = file[i];
  if (c === '{') depth++;
  if (c === '}') {
    depth--;
    if (depth === 0) {
      endIdx = i + 1;
      break;
    }
  }
}

const articleSrc = file.slice(openIdx, endIdx);

// Pull research files for cross-reference
const researchFiles = [
  'content/research-300m-health-software.md',
  'content/research-prescribeit.md',
  'content/research-in-camera-hearing.md',
];
const researchBlobs: string[] = [];
for (const rf of researchFiles) {
  const p = resolve(process.cwd(), rf);
  if (existsSync(p)) {
    researchBlobs.push(`### ${rf}\n\n${readFileSync(p, 'utf8')}`);
  }
}

// Voice playbook
const playbookPath = resolve(process.cwd(), 'content/voice-playbook.md');
const playbook = existsSync(playbookPath) ? readFileSync(playbookPath, 'utf8') : '';

const prompt = `You are a brutal but fair senior editor at Parliament Audit, a Canadian non-partisan accountability news outlet. You are reviewing a draft article BEFORE it goes live.

Your job: identify any claim that is unsupported, exaggerated, or partisan-framed. The brand depends on accuracy — readers attack any article that makes a claim the source doesn't support. You want this article to hold up to a hostile cross-examination by a partisan reader on either side.

# Voice playbook (must follow)

${playbook}

# Research source files (the only facts the article is allowed to use)

${researchBlobs.join('\n\n---\n\n')}

# Draft article

\`\`\`typescript
${articleSrc}
\`\`\`

# Your task

Output ONLY the following sections, in this order:

## VERDICT
One of: PUBLISH / PUBLISH WITH FIXES / DO NOT PUBLISH

## STRONGEST CLAIMS
List the 2-3 facts in the article that hit hardest. For each, confirm they're properly sourced.

## WEAKNESSES
List specific weak spots:
- Claims that aren't sourced in the research files
- Voice violations (BREAKING, exclamation, loaded verbs, partisan framing)
- Headline overreach
- Anything that could be screenshot-attacked

## REQUIRED FIXES
Numbered list. For each: specify the change as a precise edit (which sentence, what to change to).

## OPTIONAL POLISH
Things that would improve the article but aren't disqualifying.

Be terse. No /think tags. No reasoning. Just the editor's verdict.`;

async function run() {
  console.log('[ollama-review] Sending to qwen3:14b…');
  console.log(`[ollama-review]  article src bytes: ${articleSrc.length}`);
  console.log(`[ollama-review]  research blobs: ${researchBlobs.length}`);
  console.log(`[ollama-review]  playbook bytes: ${playbook.length}`);
  console.log('---');

  const startTs = Date.now();
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen3:14b',
      prompt,
      stream: false,
      think: false,
      options: {
        temperature: 0.2,
        num_ctx: 32768,
      },
    }),
  });

  if (!res.ok) {
    console.error(`Ollama HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    process.exit(1);
  }

  const data = (await res.json()) as { response: string; done: boolean };
  const dur = ((Date.now() - startTs) / 1000).toFixed(1);
  console.log(`(took ${dur}s)\n`);
  console.log(data.response);
}

run().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
