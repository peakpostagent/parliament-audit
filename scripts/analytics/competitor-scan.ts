import 'dotenv/config';
import { AtpAgent } from '@atproto/api';
async function main() {
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: process.env.BLUESKY_HANDLE!, password: process.env.BLUESKY_APP_PASSWORD! });
  // Search for Canadian civic accountability / vote-tracking accounts
  const candidates = [
    'openparliament.bsky.social',
    'openparliament.ca',
    'opencanada.bsky.social',
    'theyworkforyou.bsky.social',
    'mysociety.bsky.social',
    'mysociety.org',
    'theyvoteforyou.bsky.social',
    'govtrack.us',
    'govtrack.bsky.social',
    'democracywatch.bsky.social',
    'samaracanada.bsky.social',
    'samaracentre.bsky.social',
    'readthemaple.bsky.social',
    'themaple.bsky.social',
    'pressprogress.bsky.social',
    'canadaland.bsky.social',
    'cjfe.bsky.social',
    'cdnpress.bsky.social',
    'hilltimes.bsky.social',
    'pbo-dpb.bsky.social',
    'openmedia.bsky.social',
    'michaelgeist.bsky.social',
    'michaelgeist.ca',
    'punchbowl.news',
    'punchbowlnews.bsky.social',
    'fivecalls.bsky.social',
    '5calls.org',
  ];
  console.log('=== Bluesky resolveable check + profiles ===\n');
  for (const handle of candidates) {
    try {
      const r = await agent.com.atproto.identity.resolveHandle({ handle });
      const did = r.data.did;
      const p = await agent.getProfile({ actor: did });
      console.log(`✓ @${p.data.handle}`);
      console.log(`   "${p.data.displayName}" — ${p.data.followersCount} followers, ${p.data.postsCount} posts`);
      console.log(`   bio: ${(p.data.description || '').replace(/\n/g,' ').slice(0, 140)}`);
    } catch {
      // Not found, skip silently
    }
    await new Promise(r => setTimeout(r, 80));
  }
}
main().catch(e => { console.error('err:', e.message); process.exit(1); });
