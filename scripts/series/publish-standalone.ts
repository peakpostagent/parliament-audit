/**
 * Publish a single standalone article (one that doesn't fit the
 * day-NN series-publisher pattern). Same article-extraction + ship
 * pipeline as scripts/series/publish-next-day.ts, but takes an
 * explicit article-file path and does NOT walk the series directory.
 *
 * Usage:
 *   npx tsx scripts/series/publish-standalone.ts \
 *     --file content/series/standalone/foo.article.ts \
 *     --apply
 *
 * Flow:
 *   1. Read the .article.ts file, extract the article object literal
 *      by brace-depth.
 *   2. Replace publishedAt: new Date().toISOString() with the current
 *      ISO timestamp at publish moment.
 *   3. Validate the slug isn't already in news-articles.ts.
 *   4. Prepend the article literal into newsArticles[].
 *   5. git add + commit + push.
 *   6. Poll the deploy until the article URL serves real content.
 *
 * Steps 7-8 (Bluesky post + X mirror queue) are NOT included here
 * because standalone-article posts often want custom flags
 * (--image, --no-cta, --url) that vary per piece. After this script
 * succeeds, the caller fires post-arbitrary-bluesky.ts + the
 * mirror-queue-apply.ts pipeline directly with the appropriate
 * options.
 */
import 'dotenv/config';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');

function arg(name: string, dflt?: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : dflt;
}

const FILE = arg('file');
if (!FILE) {
  console.error('usage: publish-standalone.ts --file <path-to-article.ts> [--apply]');
  process.exit(1);
}

const ROOT = process.cwd();
const ARTICLE_PATH = resolve(ROOT, FILE);
const NEWS_PATH = resolve(ROOT, 'apps/web/src/content/news-articles.ts');

if (!existsSync(ARTICLE_PATH)) {
  console.error(`file not found: ${ARTICLE_PATH}`);
  process.exit(1);
}

function bail(msg: string): never {
  console.error(`[publish-standalone] FAIL: ${msg}`);
  process.exit(1);
}

function sh(cmd: string, opts: { allowFailure?: boolean } = {}): string {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).toString();
  } catch (e: any) {
    if (opts.allowFailure) return '';
    bail(`shell failed: ${cmd}\n${(e?.stderr?.toString() || e?.message || '').slice(0, 400)}`);
  }
  return '';
}

async function main() {
  const articleSrc = readFileSync(ARTICLE_PATH, 'utf8');
  const startMatch = articleSrc.match(/export const article:\s*NewsArticle\s*=\s*/);
  if (!startMatch) bail('cannot find "export const article: NewsArticle =" in file');

  const startIdx = (startMatch.index ?? 0) + startMatch[0].length;
  let depth = 0, endIdx = -1, inString: string | null = null, escape = false;
  for (let i = startIdx; i < articleSrc.length; i++) {
    const ch = articleSrc[i];
    if (escape) { escape = false; continue; }
    if (inString) {
      if (ch === '\\') { escape = true; continue; }
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { inString = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) { endIdx = i + 1; break; }
    }
  }
  if (endIdx === -1) bail('could not find matching closing brace');

  let articleLiteral = articleSrc.slice(startIdx, endIdx);
  const nowIso = new Date().toISOString();
  articleLiteral = articleLiteral.replace(
    /publishedAt:\s*new Date\(\)\.toISOString\(\)/,
    `publishedAt: '${nowIso}'`,
  );

  const slugMatch = articleLiteral.match(/slug:\s*['"]([^'"]+)['"]/);
  const slug = slugMatch ? slugMatch[1] : null;
  if (!slug) bail('could not find slug in article');

  const newsSrc = readFileSync(NEWS_PATH, 'utf8');
  if (newsSrc.includes(`slug: '${slug}'`) || newsSrc.includes(`slug: "${slug}"`)) {
    bail(`slug already published: ${slug}`);
  }

  const articleUrl = `https://parliamentaudit.ca/news/${slug}`;
  console.log(`[publish-standalone] slug: ${slug}`);
  console.log(`[publish-standalone] publishedAt: ${nowIso}`);
  console.log(`[publish-standalone] target URL: ${articleUrl}`);
  console.log(`[publish-standalone] article literal: ${articleLiteral.length} chars`);

  if (!APPLY) {
    console.log('[publish-standalone] DRY RUN. Pass --apply to ship.');
    process.exit(0);
  }

  const marker = 'export const newsArticles: NewsArticle[] = [';
  const insertPoint = newsSrc.indexOf(marker) + marker.length;
  const newNewsContent =
    newsSrc.slice(0, insertPoint) + '\n  ' + articleLiteral + ',' + newsSrc.slice(insertPoint);
  writeFileSync(NEWS_PATH, newNewsContent);
  console.log(`[publish-standalone] ✓ prepended into news-articles.ts`);

  sh(`git add ${JSON.stringify(NEWS_PATH)} ${JSON.stringify(ARTICLE_PATH)}`);
  sh(`git commit -m ${JSON.stringify(`Publish standalone: ${slug}\n\nFired by scripts/series/publish-standalone.ts.\nSource: ${FILE}`)}`);
  sh('git push origin main');
  console.log('[publish-standalone] ✓ committed + pushed');

  async function pollDeploy(timeoutMs: number): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const res = await fetch(articleUrl + '?cb=' + Date.now(), { signal: AbortSignal.timeout(10_000) });
        if (res.ok) {
          const text = await res.text();
          if (!text.includes('Article Not Found')) return true;
        }
      } catch { /* keep polling */ }
      await new Promise((r) => setTimeout(r, 10_000));
    }
    return false;
  }

  console.log(`[publish-standalone] polling deploy at ${articleUrl}…`);
  const deployed = await pollDeploy(6 * 60 * 1000);
  if (!deployed) bail(`deploy didn't go live within 6 min`);
  console.log(`[publish-standalone] ✓ article is live`);
  console.log('');
  console.log('Next steps (run manually):');
  console.log(`  npx tsx scripts/post-arbitrary-bluesky.ts --text-file <bsky-txt> --slug "${slug}" --campaign "<campaign>"`);
  console.log(`  # Then prepend the X queue entry and run mirror-queue-apply`);
  process.exit(0);
}

main().catch((e) => {
  console.error('[publish-standalone] fatal:', e?.message || e);
  process.exit(1);
});
