/**
 * Parliament Audit — Bluesky Social Post Publisher
 *
 * Posts a specific draft tweet (by index) to Bluesky via the AT Protocol.
 * Designed to be called by scheduled-tasks, one task per tweet.
 *
 * Usage:
 *   npx tsx scripts/post-to-bluesky.ts --tweet 1             # Post draft #1
 *   npx tsx scripts/post-to-bluesky.ts --tweet 5 --dry-run   # Preview without posting
 *   npx tsx scripts/post-to-bluesky.ts --test                # Just test authentication
 *
 * Requirements:
 *   - BLUESKY_HANDLE and BLUESKY_APP_PASSWORD in .env
 *   - Create app password at bsky.app/settings/app-passwords
 */

import 'dotenv/config';
import { AtpAgent, RichText } from '@atproto/api';

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isTest = args.includes('--test');
const tweetIdx = args.indexOf('--tweet');
const tweetNum = tweetIdx !== -1 ? parseInt(args[tweetIdx + 1], 10) : null;

// ─── Tweet drafts (kept in sync with content/tweet-drafts.md) ────────────────
const TWEETS: { id: number; text: string; url: string }[] = [
  {
    id: 1,
    text: `Bill C-22 would require ISPs to store every Canadian's metadata for up to a year — who you called, when, and where you were. It's at second reading now.

What's in it →`,
    url: 'https://parliamentaudit.ca/news/bill-c-22-lawful-access-metadata-surveillance',
  },
  {
    id: 2,
    text: `The Privacy Commissioner has no oversight role in Bill C-22. The bill lets the Public Safety Minister issue secret orders forcing telecoms to build surveillance capabilities.

Full breakdown →`,
    url: 'https://parliamentaudit.ca/news/bill-c-22-lawful-access-metadata-surveillance',
  },
  {
    id: 3,
    text: `$60.6B in cuts over 4 years. 10,000 public service jobs eliminated. CRA loses 2,620 positions. Passport wait times projected to double by fall.

Department-by-department →`,
    url: 'https://parliamentaudit.ca/news/federal-budget-cuts-60-billion-public-service',
  },
  {
    id: 4,
    text: `The $10-a-day childcare expansion won't get new federal funding after 2027-28. Three climate labs consolidated into one. Canada's lunar program cut 40%.

Where the cuts land →`,
    url: 'https://parliamentaudit.ca/news/federal-budget-cuts-60-billion-public-service',
  },
  {
    id: 5,
    text: `4 Conservative MPs crossed the floor to the Liberals since November. Combined with 3 byelection wins, it gave them a majority — without a general election.

Full timeline →`,
    url: 'https://parliamentaudit.ca/news/floor-crossing-majority-without-election',
  },
  {
    id: 6,
    text: `74% of Canadians say floor-crossing MPs should face a byelection. That's consistent across party lines — 81% of CPC voters, 68% of LPC voters, 77% of NDP voters.

The polling →`,
    url: 'https://parliamentaudit.ca/news/floor-crossing-majority-without-election',
  },
  {
    id: 7,
    text: `Bill C-9 passed the House 186–137. Liberals + Bloc voted yes. Conservatives, NDP, and Greens voted no. The key issue: removing a decades-old religious speech defence.

What the bill does →`,
    url: 'https://parliamentaudit.ca/news/bill-c9-combatting-hate-act-religious-exemption',
  },
  {
    id: 8,
    text: `The NDP voted against an anti-hate bill. The Conservatives voted with them. Why? Both sides objected to removing the religious text defence — but for different reasons.

The vote breakdown →`,
    url: 'https://parliamentaudit.ca/news/bill-c9-combatting-hate-act-religious-exemption',
  },
  {
    id: 9,
    text: `Bill C-12 is now law. 30,000 refugee claimants have received letters saying their cases may be ineligible. A new one-year filing deadline is the reason.

What changed →`,
    url: 'https://parliamentaudit.ca/news/bill-c12-immigration-reform-refugee-rights',
  },
  {
    id: 10,
    text: `The government can now cancel permanent resident visas, work permits, and study permits if it's deemed in the "public interest." That term is not defined in the law.

Full analysis →`,
    url: 'https://parliamentaudit.ca/news/bill-c12-immigration-reform-refugee-rights',
  },
  {
    id: 11,
    text: `Bailey's Law would make killing an intimate partner automatic first-degree murder. It passed second reading with a standing ovation — rare all-party support.

What the bill does →`,
    url: 'https://parliamentaudit.ca/news/bill-c225-baileys-law-intimate-partner-violence',
  },
  {
    id: 12,
    text: `Bill C-225 is one of the few private member's bills to clear committee this Parliament. It would also let courts hold domestic violence suspects for 7-day risk assessments before bail.

The full story →`,
    url: 'https://parliamentaudit.ca/news/bill-c225-baileys-law-intimate-partner-violence',
  },
];

// ─── Bluesky client ───────────────────────────────────────────────────────────
async function createBlueskyAgent(): Promise<AtpAgent> {
  const { BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;

  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) {
    console.error('❌ Missing Bluesky credentials in .env');
    console.error('   Set: BLUESKY_HANDLE, BLUESKY_APP_PASSWORD');
    console.error('   Create app password at: bsky.app/settings/app-passwords');
    process.exit(1);
  }

  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: BLUESKY_HANDLE,
    password: BLUESKY_APP_PASSWORD,
  });

  return agent;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n[post-to-bluesky] Parliament Audit — Bluesky Publisher`);

  // Test mode: just verify auth
  if (isTest) {
    console.log('[post-to-bluesky] Test mode — verifying authentication...');
    try {
      const agent = await createBlueskyAgent();
      console.log(`[post-to-bluesky] ✓ Authenticated as @${agent.session?.handle}`);
      console.log(`[post-to-bluesky]   DID: ${agent.session?.did}`);
      process.exit(0);
    } catch (err: any) {
      console.error(`[post-to-bluesky] ❌ Auth failed: ${err?.message || err}`);
      process.exit(1);
    }
  }

  if (!tweetNum || tweetNum < 1 || tweetNum > TWEETS.length) {
    console.error(`❌ Invalid --tweet number. Must be 1-${TWEETS.length}.`);
    process.exit(1);
  }

  const tweet = TWEETS[tweetNum - 1];
  const postText = `${tweet.text} ${tweet.url}`;

  console.log(`[post-to-bluesky] Preparing tweet #${tweet.id}`);
  console.log(`──────────────────────────────────────────`);
  console.log(postText);
  console.log(`──────────────────────────────────────────`);
  console.log(`Length: ${postText.length} chars (Bluesky limit: 300)\n`);

  if (isDryRun) {
    console.log('[post-to-bluesky] DRY RUN — not posting.\n');
    process.exit(0);
  }

  if (postText.length > 300) {
    console.error('❌ Post exceeds Bluesky 300-char limit.');
    process.exit(1);
  }

  try {
    const agent = await createBlueskyAgent();
    console.log(`[post-to-bluesky] Authenticated as @${agent.session?.handle}`);

    // RichText handles URL detection and creates proper facets (clickable links)
    const rt = new RichText({ text: postText });
    await rt.detectFacets(agent);

    // Try to fetch an OG card for the URL for a rich link preview
    let embed: any = undefined;
    try {
      const linkRes = await fetch(tweet.url);
      const html = await linkRes.text();
      const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
      const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1];
      const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];

      if (ogTitle && ogDesc) {
        // Upload thumbnail if present
        let thumbBlob: any = undefined;
        if (ogImage) {
          try {
            console.log(`[post-to-bluesky] Fetching thumbnail: ${ogImage}`);
            const imgRes = await fetch(ogImage);
            if (!imgRes.ok) {
              console.warn(`[post-to-bluesky] Thumbnail fetch returned ${imgRes.status}`);
            } else {
              const imgBuf = new Uint8Array(await imgRes.arrayBuffer());
              const mime = imgRes.headers.get('content-type') || 'image/png';
              console.log(`[post-to-bluesky] Uploading thumbnail blob: ${imgBuf.length} bytes, ${mime}`);
              const upload = await agent.uploadBlob(imgBuf, { encoding: mime });
              thumbBlob = upload.data.blob;
              console.log(`[post-to-bluesky] Thumbnail blob uploaded:`, JSON.stringify(thumbBlob).slice(0, 200));
            }
          } catch (e: any) {
            console.warn(`[post-to-bluesky] Warn: thumbnail upload failed: ${e?.message || e}`);
            console.warn(e?.stack?.slice(0, 300));
          }
        }

        embed = {
          $type: 'app.bsky.embed.external',
          external: {
            uri: tweet.url,
            title: ogTitle,
            description: ogDesc,
            ...(thumbBlob ? { thumb: thumbBlob } : {}),
          },
        };
        console.log(`[post-to-bluesky] Link preview: "${ogTitle}"`);
      }
    } catch (err: any) {
      console.warn(`[post-to-bluesky] Warn: OG fetch failed (${err?.message || err}). Posting without preview card.`);
    }

    const res = await agent.post({
      text: rt.text,
      facets: rt.facets,
      ...(embed ? { embed } : {}),
      createdAt: new Date().toISOString(),
    });

    console.log(`[post-to-bluesky] ✓ Posted — URI: ${res.uri}`);
    const rkey = res.uri.split('/').pop();
    console.log(`[post-to-bluesky]   https://bsky.app/profile/${agent.session?.handle}/post/${rkey}`);

    // Optional: send ntfy notification
    const ntfyTopic = process.env.NTFY_TOPIC || 'parliamentaudit-posts';
    try {
      await fetch(`https://ntfy.sh/${ntfyTopic}`, {
        method: 'POST',
        headers: { 'Title': `Bluesky post #${tweet.id} sent` },
        body: postText.substring(0, 200),
      });
    } catch {
      // ntfy is best-effort
    }

    process.exit(0);
  } catch (err: any) {
    console.error(`[post-to-bluesky] ❌ Failed: ${err?.message || err}`);
    if (err?.status) console.error(`   HTTP status: ${err.status}`);
    process.exit(1);
  }
}

main();
