/**
 * One-off — post the Bill C-9 call-to-action tweet to X via the
 * existing browser-automation path (since the X v2 API write
 * permissions on this account are read-only).
 */
import 'dotenv/config';
import { postToX } from '../browser/post-x-lib.js';

async function main() {
  const text = `Senate report stage on the residential-school denialism amendment could be tomorrow. If it passes, the bill goes back to the House for a final vote.

Your MP is who decides whether to accept it. Find them by postal code →`;

  const result = await postToX({
    text,
    url: 'https://parliamentaudit.ca/find-your-mp',
    utmCampaign: 'c9-cta-2026-06-02',
  });

  console.log('✓ posted');
  console.log('  finalText:', result.finalText);
  console.log('  profileUrl:', result.profileUrl);
}

main().catch((e: any) => {
  console.error('err message:', e?.message);
  console.error('err code:   ', e?.code);
  if (e?.data) console.error('err data:   ', JSON.stringify(e.data, null, 2));
  process.exit(1);
});
