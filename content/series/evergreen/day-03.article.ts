/**
 * Evergreen day-03: How to read a recorded division in Hansard.
 *
 * DIY civic literacy. Teaches readers to do what Parliament Audit
 * itself does — pull a specific vote, find each MP's position, and
 * verify it against public statements.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'how-to-read-a-recorded-division-in-hansard',
  headline: 'How to Read a Recorded Division in Hansard. The Civic Skill Every Canadian Should Have.',
  subheadline:
    'When MPs vote in the House of Commons, the result is published verbatim in Hansard — the official record. Every yea, every nay, every paired and absent member, name by name. This article walks how to find a specific vote, how to read what the record says, and how to use it to check what your MP actually did versus what they say they did.',
  summary:
    'Every recorded division in the House of Commons is published on the official record — Hansard for the debate, and the LEGISinfo + ourcommons.ca portals for the vote tallies. This article teaches readers how to navigate those records: how to find a specific vote, how to identify each MP\'s position, how to interpret "paired" and "absent" labels, and how to cross-reference a vote against the MP\'s prior public statements. The skill is the foundation of accountability journalism — and any citizen can do it.',
  publishedAt: new Date().toISOString(),
  category: 'Accountability',
  tags: ['Hansard', 'recorded division', 'civic literacy', 'how to', 'evergreen'],
  readingTimeMinutes: 4,
  keyTakeaways: [
    'Hansard is the verbatim official record of House of Commons debates, published the next day.',
    'Recorded divisions (votes) are published with every MP\'s position by name on the ourcommons.ca votes portal.',
    'Vote outcomes are categorized: "Yeas," "Nays," "Paired" (a deliberate absence arrangement), and "Absent."',
    'You can search past votes by bill number, by date, by MP, or by topic via LEGISinfo.',
    'The records are free, public, and require no special access — every Canadian has the same primary-source standing on what their representatives actually did.',
  ],
  smartBrevity: {
    bigThing:
      'You don\'t need a press pass to verify what your MP voted on. The full record is public, free, and searchable by name.',
    whyItMatters:
      'Politicians describe their voting record in whatever framing serves them. The record itself doesn\'t. Direct primary-source access is what makes the difference between trusting a press release and verifying what happened.',
    goDeeper: [
      'Hansard: ourcommons.ca/DocumentViewer/en/house — debates, verbatim, by session and date.',
      'Recorded divisions: ourcommons.ca/Members/en/votes — searchable by parliament, session, bill.',
      'Each vote shows yeas, nays, paired, and absent for every member by name.',
      'LEGISinfo: parl.ca/legisinfo — find any bill by code, then trace its complete voting history.',
      'For older votes: the same portals cover sessions going back decades.',
    ],
    yesBut:
      'Not every vote is "recorded." Most procedural decisions are made on voice vote and never produce a name-by-name record. The recorded division is the formal mechanism the House uses for substantive votes that members want on the record.',
    bottomLine:
      'The skill takes 10 minutes to learn and unlocks lifetime access to the actual record of what your representatives did. Every Canadian should have it.',
  },
  methodology:
    'All portal links are to the official ourcommons.ca and parl.ca public records. Step-by-step instructions are verified against the current site layout as of publication.',
  sections: [
    {
      title: 'Find the vote',
      body: `Two starting points depending on what you want to find.\n\n**If you have a bill number** (e.g., Bill C-22, Bill C-11, etc.):\n1. Go to **parl.ca/legisinfo**\n2. Search by bill code\n3. Open the bill\'s LEGISinfo page\n4. Look for the "Status" or "House Vote History" section. Every recorded division on the bill — second reading, report stage, third reading, the lot — is listed by date and division number.\n5. Click any division number to open the full vote record on ourcommons.ca.\n\n**If you have a date or a topic but not a bill number:**\n1. Go to **ourcommons.ca/Members/en/votes**\n2. Filter by Parliament + Session (current is 45-1 for this Parliament)\n3. Browse the list. Each entry shows the date, the division number, a subject line, and the result (Agreed To / Negatived).\n4. Click any entry to open the full record.`,
    },
    {
      title: 'Read the record',
      body: `A recorded division page shows you four lists of members:\n\n- **Yeas** — voted in favour of the motion.\n- **Nays** — voted against the motion.\n- **Paired** — a member who would have voted but is deliberately absent under a pairing arrangement, so the vote balance is unaffected. (Pairing is an old parliamentary convention: an MP who has to be away pairs with an opposite-side MP who agrees to also be absent.)\n- **Absent** — a member who didn\'t vote and isn\'t paired.\n\nEach name is listed under the appropriate column. You can scan for your own MP, or sort by party, or look at the count totals at the top of the page.\n\nThe page also shows the FINAL TALLY (e.g., "Yeas: 186 Nays: 137") and the result ("Agreed To" or "Negatived").`,
    },
    {
      title: 'Cross-reference against statements',
      body: `The accountability move is to compare the vote to what the MP has said. Two useful checks:\n\n**Hansard for the same date.** Go to ourcommons.ca/DocumentViewer/en/house, find the day of the vote, and read the debate that preceded it. MPs often speak before voting. If an MP gave a speech opposing the bill and then voted yes, that\'s a story worth understanding.\n\n**The MP\'s own communications.** Press releases, X posts, Bluesky posts, riding-office newsletters. If an MP\'s public position diverges from their recorded vote, that\'s also a story.\n\nNeither check requires any special access. Both Hansard and MP public statements are free to access.`,
    },
    {
      title: 'What "recorded" means and what gets excluded',
      body: `Not every House of Commons decision is a recorded division. Most procedural decisions, second-reading agreements on uncontested government bills, and routine motions are decided on **voice vote** — the Speaker asks "Is the House ready for the question? All in favour, signify by saying yea. All opposed, nay." If there\'s no demand for a recorded vote, the result is entered as "On division" or "agreed to" without name-by-name data.\n\nA recorded division happens when at least five members rise to demand one, or when the rules require one (e.g., on certain budget motions). This is why some bills have many recorded votes (Bill C-22 had a dozen at report stage) while others pass with almost none on the record.\n\nFor recorded divisions, the data is exhaustive. For voice votes, you have only the high-level outcome and no member-by-member detail.`,
    },
    {
      title: 'Once you have the record — what to do with it',
      body: `The skill is foundational, but it\'s not an end in itself. What civic engagement looks like once you have the record:\n\n- **Verify before sharing.** If a social media claim says "your MP voted against X," check the actual division. The portal is fast.\n- **Write to your MP with specifics.** Citing a specific division number and date is materially more effective than a generic complaint.\n- **Build a personal accountability log.** Track the votes that matter to you over a Parliament. Most MP communications offer aspirational positioning; the recorded division shows what was actually done.\n- **Refer journalists.** If you spot a meaningful gap between what an MP said and what they voted, that\'s the lead a reporter needs.\n\nParliament Audit does exactly this work at scale. The same primary sources are open to every Canadian.`,
    },
  ],
  sources: [
    { label: 'ourcommons.ca — Recorded Divisions portal', url: 'https://www.ourcommons.ca/Members/en/votes' },
    { label: 'ourcommons.ca — House Debates (Hansard)', url: 'https://www.ourcommons.ca/DocumentViewer/en/house' },
    { label: 'parl.ca — LEGISinfo (bill tracker)', url: 'https://www.parl.ca/legisinfo/' },
    { label: 'ourcommons.ca — How recorded divisions work', url: 'https://www.ourcommons.ca/About/OurProcedure/Decisions/c_g_decisionsfromhouse-e.htm' },
  ],
};
