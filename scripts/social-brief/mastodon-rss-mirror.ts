/**
 * RSS → Mastodon mirror for parliamentaudit.ca.
 *
 * Reads the public RSS feed, posts any unseen articles to our Mastodon
 * account (typically @parliamentaudit@mstdn.ca), and tracks which
 * articles have been posted so we never double-toot.
 *
 * Why: per content/distribution-plan-2026-05-15.md, the Canadian-news
 * Mastodon audience is small but high-quality (journalists, academics,
 * watchdog staff). Zero-maintenance auto-mirror is a low-cost hedge —
 * we pay one 30-min setup tax once, then articles flow forever.
 *
 * Trigger:
 *   Cron — wired into the existing 5 AM MDT + 1 PM MDT daily-ops ticks
 *   so we don't create another scheduled task. The script is idempotent:
 *   if there's nothing new since the last run, it exits clean and quiet.
 *
 * State:
 *   content/social-briefs/.mastodon-state.json (git-ignored — local,
 *   per-machine, like the Bluesky and X mirror state files).
 *
 * Usage:
 *   npx tsx scripts/social-brief/mastodon-rss-mirror.ts           # dry-run
 *   npx tsx scripts/social-brief/mastodon-rss-mirror.ts --apply   # post live
 *   npx tsx scripts/social-brief/mastodon-rss-mirror.ts --apply --limit 1
 *
 * Required env vars (in .env):
 *   MASTODON_INSTANCE_URL   e.g. https://mstdn.ca
 *   MASTODON_ACCESS_TOKEN   from Preferences → Development → New Application
 *                           with scope: write:statuses
 */
import dotenv from 'dotenv';
dotenv.config({ override: true });
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { isTragedyPaused } from './guard-rails.js';

const APPLY = process.argv.includes('--apply');
const LIMIT_ARG = process.argv.indexOf('--limit');
const LIMIT = LIMIT_ARG !== -1 ? parseInt(process.argv[LIMIT_ARG + 1], 10) : 5;

const ROOT = process.cwd();
const RSS_URL = 'https://parliamentaudit.ca/rss.xml';
const STATE_DIR = resolve(ROOT, 'content/social-briefs');
const STATE_PATH = join(STATE_DIR, '.mastodon-state.json');
mkdirSync(STATE_DIR, { recursive: true });

interface State {
  /** GUID/URL → ISO timestamp of when we tooted it. */
  posted: Record<string, string>;
}

function loadState(): State {
  if (!existsSync(STATE_PATH)) return { posted: {} };
  try {
    return { posted: {}, ...JSON.parse(readFileSync(STATE_PATH, 'utf8')) };
  } catch {
    return { posted: {} };
  }
}

function saveState(s: State) {
  writeFileSync(STATE_PATH, JSON.stringify(s, null, 2));
}

interface Item {
  title: string;
  link: string;
  guid: string;
  pubDate: string;
}

function extractItems(xml: string): Item[] {
  const items: Item[] = [];
  const itemRe = /<item[\s>][\s\S]*?<\/item>/g;
  const tagRe = (tag: string) =>
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const decode = (s: string) =>
    s
      .replace(/^<!\[CDATA\[/, '')
      .replace(/\]\]>$/, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .trim();
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[0];
    const title = block.match(tagRe('title'));
    const link = block.match(tagRe('link'));
    const guid = block.match(tagRe('guid'));
    const pubDate = block.match(tagRe('pubDate'));
    if (!title || !link) continue;
    items.push({
      title: decode(title[1]),
      link: decode(link[1]),
      guid: guid ? decode(guid[1]) : decode(link[1]),
      pubDate: pubDate ? decode(pubDate[1]) : '',
    });
  }
  return items;
}

async function fetchRss(): Promise<Item[]> {
  const res = await fetch(RSS_URL, {
    headers: { 'user-agent': 'ParliamentAuditMastodonMirror/1.0' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`RSS fetch ${res.status}`);
  const xml = await res.text();
  return extractItems(xml);
}

/**
 * Build the toot body. Mastodon's default character limit is 500 — much
 * more generous than X/Bluesky, so we can fit headline + URL + a few
 * hashtags comfortably. We deliberately keep it minimal — the headline
 * already does the work; we're not trying to re-write a social post here.
 */
function buildToot(item: Item): string {
  const tags = '#cdnpoli #cdnmedia';
  // The headline already runs on parliamentaudit.ca; we don't need to
  // reframe it. URL becomes its own line so Mastodon link-previews
  // render cleanly.
  return `${item.title}\n\n${item.link}\n\n${tags}`;
}

async function postToMastodon(instance: string, token: string, status: string): Promise<string> {
  const url = `${instance.replace(/\/$/, '')}/api/v1/statuses`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      // Idempotency-Key prevents duplicate posts if the request retries
      // mid-flight (Mastodon honors this per the API docs).
      'idempotency-key': Buffer.from(status).toString('base64').slice(0, 50),
    },
    body: JSON.stringify({ status, visibility: 'public', language: 'en' }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mastodon ${res.status}: ${body.slice(0, 200)}`);
  }
  const data: any = await res.json();
  return data.url || data.uri || '(posted)';
}

async function main() {
  const instance = process.env.MASTODON_INSTANCE_URL;
  const token = process.env.MASTODON_ACCESS_TOKEN;
  if (!instance || !token) {
    if (APPLY) {
      throw new Error(
        'MASTODON_INSTANCE_URL and MASTODON_ACCESS_TOKEN must be set in .env. See scripts/social-brief/mastodon-setup.md for instance signup + token instructions.',
      );
    }
    console.log('[mastodon-mirror] no Mastodon creds set — will dry-run RSS parse only.');
  }

  // RSS parse first — we always want to know what's on the feed even
  // during a halt, so the dry-run output is useful for debugging.
  const state = loadState();
  const items = await fetchRss();
  console.log(`[mastodon-mirror] RSS: ${items.length} items`);

  const unseen = items.filter((i) => !state.posted[i.guid]);
  console.log(`[mastodon-mirror] ${unseen.length} unseen items.`);

  if (unseen.length === 0) {
    console.log('[mastodon-mirror] nothing to do.');
    return;
  }

  // First-run bootstrap: when the state file is empty, we treat ALL
  // currently-on-feed items as "already seen" and do not mass-mail the
  // existing back catalog (avoids tooting 16 articles in a row, which
  // would look like spam on first launch).
  const isFirstRun = Object.keys(state.posted).length === 0 && unseen.length > 3;
  if (isFirstRun && APPLY) {
    console.log(`[mastodon-mirror] first-run bootstrap — marking ${unseen.length} historic items as seen, NOT posting them.`);
    for (const it of unseen) state.posted[it.guid] = new Date().toISOString();
    saveState(state);
    console.log('[mastodon-mirror] subsequent runs will only post genuinely NEW items.');
    return;
  }

  // Order oldest-first so a multi-publish day tweets in publish order.
  unseen.sort((a, b) => new Date(a.pubDate || 0).getTime() - new Date(b.pubDate || 0).getTime());

  const toPost = unseen.slice(0, LIMIT);
  console.log(`\n[mastodon-mirror] would post ${toPost.length}:`);
  for (const it of toPost) {
    console.log(`\n  TITLE: ${it.title}`);
    console.log(`  LINK:  ${it.link}`);
    console.log(`  ---`);
    console.log(buildToot(it));
  }

  if (!APPLY) {
    console.log('\n[mastodon-mirror] dry-run. Pass --apply to ship.');
    return;
  }

  // Brand-safety: respect the same tragedy halt our other publish paths
  // honor. RSS-driven mirroring is auto, so if breaking news has tripped
  // the halt, we should not be cheerfully tooting article links into a
  // #cdnpoli feed processing a mass-casualty event. Checked HERE (after
  // dry-run preview) so debugging output is always available.
  const tragedy = isTragedyPaused(ROOT);
  if (tragedy.severity === 'block') {
    console.log(`[mastodon-mirror] ⏸ ${tragedy.reason} — would post ${toPost.length} once halt clears.`);
    return;
  }

  let ok = 0;
  let fail = 0;
  for (const it of toPost) {
    try {
      const url = await postToMastodon(instance!, token!, buildToot(it));
      console.log(`  [ok] ${url}`);
      state.posted[it.guid] = new Date().toISOString();
      saveState(state);
      ok++;
    } catch (e: any) {
      console.error(`  [fail] ${it.guid}: ${e?.message?.slice(0, 200)}`);
      fail++;
    }
    // Polite 2s between toots — Mastodon's default rate is generous,
    // but our cadence is ≤ 5 items/run so we never approach the limit.
    await new Promise((r) => setTimeout(r, 2000));
  }
  console.log(`\n[mastodon-mirror] done. posted ${ok}, failed ${fail}.`);
}

main().catch((e) => {
  console.error('Fatal:', e?.message || e);
  process.exit(1);
});
