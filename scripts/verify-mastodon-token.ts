/**
 * One-shot Mastodon token sanity check.
 *
 * Confirms MASTODON_ACCESS_TOKEN is present, the instance URL is set,
 * and the token actually authenticates against the instance. Prints
 * the account it resolves to so we catch any "I pasted the wrong
 * token" mistakes before the bootstrap runs.
 *
 * Usage:
 *   npx tsx scripts/verify-mastodon-token.ts
 */
import dotenv from 'dotenv';
dotenv.config({ override: true });

async function main() {
  const token = process.env.MASTODON_ACCESS_TOKEN;
  const url = process.env.MASTODON_INSTANCE_URL;
  if (!token) {
    console.error('FAIL: MASTODON_ACCESS_TOKEN not set in .env');
    process.exit(1);
  }
  if (!url) {
    console.error('FAIL: MASTODON_INSTANCE_URL not set in .env');
    process.exit(1);
  }
  console.log('instance:', url);
  console.log('token preview:', token.slice(0, 6) + '…' + token.slice(-4), '·', token.length, 'chars');

  const verifyUrl = url.replace(/\/+$/, '') + '/api/v1/accounts/verify_credentials';
  const res = await fetch(verifyUrl, {
    headers: { authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(10_000),
  });
  console.log('verify_credentials HTTP', res.status);

  if (!res.ok) {
    const body = await res.text();
    console.error('FAIL body:', body.slice(0, 500));
    process.exit(2);
  }

  const j: any = await res.json();
  const host = new URL(url).host;
  console.log('username:    @' + j.username + '@' + host);
  console.log('display:     ', j.display_name || '(unset)');
  console.log('statuses:    ', j.statuses_count);
  console.log('followers:   ', j.followers_count);
  console.log('following:   ', j.following_count);
  console.log('created_at:  ', j.created_at);
  console.log('locked:      ', j.locked);
  console.log('\n✓ Token is valid and resolves to the right account.');
}

main().catch((e) => {
  console.error('FAIL:', e?.message || e);
  process.exit(3);
});
