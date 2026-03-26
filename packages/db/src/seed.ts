/**
 * Database seed script — inserts a sample vote for development/testing.
 */
import { db, schema } from './client.js';

async function seed() {
  console.log('Seeding database...');

  // Insert a sample vote
  const [vote] = await db.insert(schema.votes).values({
    chamber: 'house',
    parliament: 45,
    session: 1,
    voteNumber: 143,
    voteDate: '2026-03-24',
    voteTime: '18:30:00',
    subjectText: '3rd reading and adoption of Bill C-76, An Act respecting housing affordability and the national housing strategy',
    billNumber: 'C-76',
    billTitle: 'Housing Affordability Act',
    billStage: 'third_reading',
    voteType: 'bill_third_reading',
    motionText: 'That the Bill be now read a third time and do pass.',
    sponsorName: 'Hon. Member for Ottawa Centre',
    sponsorParty: 'LPC',
    result: 'passed',
    yeasTotal: 201,
    naysTotal: 152,
    pairedTotal: 4,
    abstentionsTotal: 0,
    recordStatus: 'official',
    sourceUrl: 'https://www.ourcommons.ca/Members/en/votes/45/1/143',
    billUrl: 'https://www.parl.ca/legisinfo/en/bill/45-1/c-76',
    hansardUrl: 'https://www.ourcommons.ca/DocumentViewer/en/45-1/house/sitting-87/hansard',
    sittingNumber: 87,
  }).returning();

  // Insert party results
  const partyData = [
    { partyShort: 'LPC', partyName: 'Liberal', yeas: 175, nays: 3, paired: 2, abstentions: 0, absent: 0, caucusSize: 180 },
    { partyShort: 'CPC', partyName: 'Conservative', yeas: 2, nays: 117, paired: 2, abstentions: 0, absent: 0, caucusSize: 121 },
    { partyShort: 'NDP', partyName: 'NDP', yeas: 24, nays: 0, paired: 0, abstentions: 0, absent: 0, caucusSize: 24 },
    { partyShort: 'BQ', partyName: 'Bloc Québécois', yeas: 0, nays: 32, paired: 0, abstentions: 0, absent: 0, caucusSize: 32 },
    { partyShort: 'GPC', partyName: 'Green', yeas: 0, nays: 0, paired: 0, abstentions: 0, absent: 2, caucusSize: 2 },
  ];

  for (const party of partyData) {
    await db.insert(schema.votePartyResults).values({
      voteId: vote.id,
      ...party,
    });
  }

  console.log(`Seeded vote: ${vote.id}`);
  console.log('Done!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
