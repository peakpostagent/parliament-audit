/**
 * Quick DB status check — lists all votes and articles.
 * Usage: npx tsx scripts/db-status.ts
 */
import { db, schema } from '../packages/db/src/client.js';

async function run() {
  const articles = await db.select({
    status: schema.articles.status,
    confidence: schema.articles.confidenceScore,
    headline: schema.articles.headline,
    id: schema.articles.id,
    slug: schema.articles.slug,
  }).from(schema.articles).orderBy(schema.articles.createdAt);

  const votes = await db.select({
    voteNumber: schema.votes.voteNumber,
    result: schema.votes.result,
    voteDate: schema.votes.voteDate,
    subject: schema.votes.subjectText,
  }).from(schema.votes).orderBy(schema.votes.voteNumber);

  console.log('=== VOTES IN DATABASE ===');
  for (const v of votes) {
    console.log(`#${v.voteNumber} [${v.voteDate}] ${v.result?.toUpperCase()} — ${v.subject?.substring(0, 60)}`);
  }
  console.log(`\nTotal votes: ${votes.length}`);

  console.log('\n=== ARTICLES IN DATABASE ===');
  for (const a of articles) {
    console.log(`[${a.status?.padEnd(10)}] ${Math.round((a.confidence || 0) * 100)}% | ${a.headline?.substring(0, 65)}`);
    console.log(`  ID: ${a.id}`);
    console.log(`  Slug: ${a.slug}`);
  }
  console.log(`\nTotal articles: ${articles.length}`);

  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
