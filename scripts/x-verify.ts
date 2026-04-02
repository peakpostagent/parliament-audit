/**
 * Parliament Audit — X Credentials Verifier
 *
 * Quick check that your X API credentials are valid and the account is reachable.
 * Run this first after adding credentials to .env.
 *
 * Usage:
 *   npx tsx scripts/x-verify.ts
 */

import 'dotenv/config';
import { TwitterApi } from 'twitter-api-v2';

async function main() {
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET } = process.env;

  console.log('\n[x-verify] Checking X API credentials...\n');

  const missing = [
    !X_API_KEY && 'X_API_KEY',
    !X_API_SECRET && 'X_API_SECRET',
    !X_ACCESS_TOKEN && 'X_ACCESS_TOKEN',
    !X_ACCESS_TOKEN_SECRET && 'X_ACCESS_TOKEN_SECRET',
  ].filter(Boolean);

  if (missing.length > 0) {
    console.error(`❌ Missing credentials in .env:\n   ${missing.join(', ')}\n`);
    console.error('Steps:');
    console.error('  1. Go to developer.x.com');
    console.error('  2. Create a project + app (or use existing)');
    console.error('  3. In your app settings, set permissions to "Read and Write"');
    console.error('  4. Go to Keys and Tokens → generate Access Token and Secret');
    console.error('  5. Add all four values to your .env file\n');
    process.exit(1);
  }

  const client = new TwitterApi({
    appKey: X_API_KEY!,
    appSecret: X_API_SECRET!,
    accessToken: X_ACCESS_TOKEN!,
    accessSecret: X_ACCESS_TOKEN_SECRET!,
  });

  try {
    const me = await client.v2.me({ 'user.fields': ['name', 'username', 'public_metrics'] });
    const user = me.data;
    console.log('✅ Credentials valid!\n');
    console.log(`   Account  : @${user.username}`);
    console.log(`   Name     : ${user.name}`);
    if (user.public_metrics) {
      console.log(`   Followers: ${user.public_metrics.followers_count.toLocaleString()}`);
      console.log(`   Tweets   : ${user.public_metrics.tweet_count.toLocaleString()}`);
    }
    console.log('\n[x-verify] All good — ready to post!\n');
  } catch (err: any) {
    const detail = err?.data?.detail || err?.data?.errors?.[0]?.message || err?.message || String(err);
    console.error(`❌ Credential check failed: ${detail}\n`);

    if (detail.includes('401') || detail.toLowerCase().includes('unauthorized')) {
      console.error('This usually means one of:');
      console.error('  • Wrong API key/secret or access token/secret');
      console.error('  • App permissions not set to "Read and Write"');
      console.error('  • Access token was generated before changing permissions (regenerate it)');
    }
    process.exit(1);
  }
}

main().catch(err => {
  console.error('[x-verify] Fatal:', err);
  process.exit(1);
});
