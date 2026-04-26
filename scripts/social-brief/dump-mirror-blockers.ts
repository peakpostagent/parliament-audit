/**
 * Dump full text of every Bluesky post currently blocked by mirror-to-x.ts
 * (too-long, placeholder, or loaded-language). Used to build the trimmed
 * X queue.
 */
import 'dotenv/config';
import { AtpAgent } from '@atproto/api';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const STATE_PATH = resolve(process.cwd(), 'content/social-briefs/.x-mirror-state.json');
const OUT_PATH = resolve(process.cwd(), 'content/social-briefs/x-mirror-blockers.json');

async function main() {
  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) throw new Error('Bluesky creds missing');
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD });

  const state = existsSync(STATE_PATH) ? JSON.parse(readFileSync(STATE_PATH, 'utf8')) : {};
  const alreadyMirrored = new Set(Object.keys(state.mirrored || {}));

  const did = agent.session!.did;
  let cursor: string | undefined;
  const sinceMs = 7 * 24 * 3600 * 1000;
  const out: any[] = [];

  for (let p = 0; p < 5; p++) {
    const res = await agent.getAuthorFeed({ actor: did, limit: 50, filter: 'posts_no_replies', cursor });
    cursor = res.data.cursor;
    if (!res.data.feed?.length) break;
    let stop = false;
    for (const item of res.data.feed) {
      if ((item.reason as any)?.$type === 'app.bsky.feed.defs#reasonRepost') continue;
      const post = item.post;
      const r = post.record as any;
      if (!r?.text || r.reply) continue;
      const ts = new Date(r.createdAt).getTime();
      if (ts < Date.now() - sinceMs) {
        stop = true;
        break;
      }
      if (alreadyMirrored.has(post.uri)) continue;
      const text: string = r.text;
      const embed = r.embed;
      let embedUrl: string | undefined;
      if (embed?.$type === 'app.bsky.embed.external' && embed.external?.uri) {
        const u = embed.external.uri as string;
        if (/parliamentaudit\.ca/.test(u)) embedUrl = u;
      }
      const effLen = embedUrl ? text.length + 2 + 23 : text.length;
      if (effLen <= 280) continue; // not a blocker
      out.push({
        uri: post.uri,
        cid: post.cid,
        createdAt: r.createdAt,
        textLen: text.length,
        effLen,
        embedUrl,
        text,
      });
    }
    if (stop || !cursor) break;
  }

  out.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  console.log(`Dumped ${out.length} blocked posts to ${OUT_PATH}`);
  for (const p of out) {
    console.log(`\n--- ${p.createdAt}  (text ${p.textLen}, effective ${p.effLen})  link: ${p.embedUrl || '<none>'} ---`);
    console.log(p.text);
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
