/**
 * Database seed script — inserts sample vote + article for development/testing.
 */
import { db, schema } from './client';

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
    { partyShort: 'BQ', partyName: 'Bloc Qu��bécois', yeas: 0, nays: 32, paired: 0, abstentions: 0, absent: 0, caucusSize: 32 },
    { partyShort: 'GPC', partyName: 'Green', yeas: 0, nays: 0, paired: 0, abstentions: 0, absent: 2, caucusSize: 2 },
  ];

  for (const party of partyData) {
    await db.insert(schema.votePartyResults).values({
      voteId: vote.id,
      ...party,
    });
  }

  // Insert a published article so the homepage has content
  const [article] = await db.insert(schema.articles).values({
    voteId: vote.id,
    slug: 'bill-c-76-housing-affordability-act-third-reading-passed-march-2026-vote-143',
    headline: 'Housing Affordability Act Passes Third Reading in the House of Commons',
    subheadline: 'Bill C-76 advances to the Senate after a 201-152 vote, with Liberal and NDP support overcoming Conservative and Bloc opposition.',
    summary: 'The House of Commons passed Bill C-76, the Housing Affordability Act, at third reading on March 24, 2026, by a vote of 201 to 152. The bill, which aims to address Canada\'s housing crisis through a national housing strategy, received support from Liberal and NDP members, while Conservative and Bloc Québécois members voted against.',
    whatHappened: 'On March 24, 2026, the House of Commons held a recorded division on the third reading of Bill C-76, An Act respecting housing affordability and the national housing strategy. This was the final House vote required before the bill could be sent to the Senate for consideration.\n\nThe motion to read the bill a third time and pass it was adopted by a vote of 201 in favour to 152 against, with 4 members paired. The bill now proceeds to the Senate for first reading.',
    partyBreakdown: 'The Liberal caucus voted overwhelmingly in favour, with 175 of 180 members voting Yea and only 3 voting Nay.\nThe Conservative caucus voted overwhelmingly against, with 117 of 121 members voting Nay and 2 voting Yea.\nAll 24 NDP members present voted in favour of the bill.\nAll 32 Bloc Québécois members present voted against the bill.\nBoth Green Party members were absent for the vote.',
    whyItMatters: 'Bill C-76 represents a significant policy intervention in Canada\'s housing market. If it receives Royal Assent, the legislation would establish a national housing affordability framework, set targets for new housing construction, and create new federal funding mechanisms for affordable housing projects across Canada.\n\nThe cross-party dynamics of this vote are notable: while the Liberals relied on NDP support to pass the bill, the Conservative and Bloc Québécois opposition signals a significant policy disagreement that may continue during Senate consideration.',
    whatNext: 'Bill C-76 will now be introduced in the Senate for first reading. The Senate will conduct its own study of the bill, including committee review, before holding votes at second and third reading. If the Senate passes the bill without amendments, it proceeds to Royal Assent. If the Senate amends the bill, it must return to the House of Commons for consideration of those amendments.',
    factBoxJson: {
      chamber: 'House of Commons',
      voteNumber: 143,
      date: 'March 24, 2026',
      bill: 'C-76',
      stage: 'Third Reading',
      result: 'Passed',
      yeas: 201,
      nays: 152,
      parliamentSession: '45th Parliament, 1st Session',
    },
    sourcesJson: {
      sources: [
        { label: 'Official vote record', url: 'https://www.ourcommons.ca/Members/en/votes/45/1/143' },
        { label: 'Bill C-76 on LEGISinfo', url: 'https://www.parl.ca/legisinfo/en/bill/45-1/c-76' },
        { label: 'Hansard — House Sitting 87', url: 'https://www.ourcommons.ca/DocumentViewer/en/45-1/house/sitting-87/hansard' },
      ],
    },
    verificationText: 'This article was generated from the official recorded division published by the House of Commons of Canada. Vote totals, party positions, and bill details were verified against the source data. The record status is "official," meaning this is the final, corrected record published by the Journals Branch.',
    status: 'published',
    confidenceScore: 0.95,
    generationModel: 'claude-sonnet-4-20250514',
    generationPromptVersion: 'v1.0.0',
    factCheckPassed: true,
    factCheckDetails: {
      checks: [
        { name: 'vote_totals_match', passed: true, severity: 'error' },
        { name: 'result_statement_correct', passed: true, severity: 'error' },
        { name: 'party_positions_accurate', passed: true, severity: 'error' },
        { name: 'bill_details_correct', passed: true, severity: 'warning' },
        { name: 'no_partisan_language', passed: true, severity: 'error' },
        { name: 'fact_box_accurate', passed: true, severity: 'error' },
      ],
    },
    publishedAt: new Date('2026-03-24T19:00:00Z'),
    lastVerifiedAt: new Date('2026-03-24T19:00:00Z'),
  }).returning();

  // Insert social post drafts
  const socialPosts = [
    {
      articleId: article.id,
      voteId: vote.id,
      platform: 'x',
      captionText: 'The House just passed the Housing Affordability Act (Bill C-76) at third reading, 201-152.\n\nLiberals and NDP voted in favour. Conservatives and Bloc voted against.\n\nFull breakdown and what it means for you:\nhttps://parliamentaudit.ca/vote/bill-c-76-housing-affordability-act-third-reading-passed-march-2026-vote-143\n\n#cdnpoli #HousingCrisis',
      hashtags: ['cdnpoli', 'HousingCrisis'],
      linkUrl: 'https://parliamentaudit.ca/vote/bill-c-76-housing-affordability-act-third-reading-passed-march-2026-vote-143',
      status: 'ready',
    },
    {
      articleId: article.id,
      voteId: vote.id,
      platform: 'facebook',
      captionText: 'Parliament just voted on housing.\n\nThe House of Commons passed Bill C-76, the Housing Affordability Act, at third reading today by a vote of 201 to 152.\n\nHere\'s how each party lined up:\n- Liberal: 175 Yea, 3 Nay\n- Conservative: 2 Yea, 117 Nay\n- NDP: 24 Yea, 0 Nay\n- Bloc Québécois: 0 Yea, 32 Nay\n- Green: Both absent\n\nThe bill now goes to the Senate. Read the full breakdown, source links, and what happens next on Parliament Audit.',
      hashtags: ['cdnpoli'],
      linkUrl: 'https://parliamentaudit.ca/vote/bill-c-76-housing-affordability-act-third-reading-passed-march-2026-vote-143',
      status: 'ready',
    },
    {
      articleId: article.id,
      voteId: vote.id,
      platform: 'instagram',
      captionText: 'Canada\'s House of Commons just passed a major housing bill.\n\nBill C-76, the Housing Affordability Act, passed third reading 201-152. Liberals and NDP voted in favour. Conservatives and Bloc voted against.\n\nThis is the last House vote before the bill goes to the Senate.\n\nSwipe for the full party breakdown. Link in bio for source data and what happens next.\n\n#cdnpoli #CanadianPolitics #HousingCrisis #ParliamentAudit #Democracy #Transparency',
      hashtags: ['cdnpoli', 'CanadianPolitics', 'HousingCrisis', 'ParliamentAudit', 'Democracy', 'Transparency'],
      linkUrl: 'https://parliamentaudit.ca/vote/bill-c-76-housing-affordability-act-third-reading-passed-march-2026-vote-143',
      status: 'ready',
    },
    {
      articleId: article.id,
      voteId: vote.id,
      platform: 'threads',
      captionText: 'Housing vote update: the House passed Bill C-76 at third reading, 201-152.\n\nLiberals + NDP in favour. Conservatives + Bloc against.\n\nFull breakdown: parliamentaudit.ca\n\n#cdnpoli',
      hashtags: ['cdnpoli'],
      linkUrl: 'https://parliamentaudit.ca/vote/bill-c-76-housing-affordability-act-third-reading-passed-march-2026-vote-143',
      status: 'ready',
    },
  ];

  for (const post of socialPosts) {
    await db.insert(schema.socialPosts).values(post);
  }

  // Audit log
  await db.insert(schema.auditLog).values({
    entityType: 'vote',
    entityId: vote.id,
    action: 'seeded',
    actor: 'system',
    details: { source: 'seed script' },
  });

  console.log(`Seeded vote: ${vote.id}`);
  console.log(`Seeded article: ${article.id}`);
  console.log(`Seeded ${socialPosts.length} social posts`);
  console.log('Done!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
