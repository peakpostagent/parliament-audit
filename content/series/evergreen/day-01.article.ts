/**
 * Evergreen day-01: How a bill becomes law in Canada.
 *
 * Process explainer — non-partisan, non-time-sensitive, no individual
 * targets. Designed as the fallback for daily-ops when no pointed
 * series content is staged. Republishes cleanly any time of year.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'how-a-bill-becomes-law-in-canada-every-stage-explained',
  headline: 'How a Bill Becomes Law in Canada. Every Stage, in Plain English.',
  subheadline:
    'Most Canadians know there are three "readings" but couldn\'t say what actually happens at each one. This is the full path a federal bill takes — from first reading in the chamber where it was introduced, through committee, through the Senate, to Royal Assent and proclamation. With the procedural traps that kill bills, and the points at which the public can still affect what passes.',
  summary:
    'Federal legislation in Canada moves through a defined sequence: introduction (first reading), debate (second reading), detailed clause-by-clause review (committee stage), final amendments (report stage), final debate (third reading), the same sequence in the other chamber (the Senate, almost always), Royal Assent, and proclamation. This article walks every stage in plain English: what happens, who participates, what can derail a bill, and where the public can still influence the outcome before it becomes the law of the land.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['parliamentary process', 'how government works', 'legislation', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 6,
  keyTakeaways: [
    'Federal bills go through three readings in each chamber (House and Senate) plus committee review — typically six "stages" total before Royal Assent.',
    'First reading is just a formal introduction; no debate happens. The bill text becomes public at this point.',
    'Second reading is debate on the principle of the bill — agree or disagree with WHAT the bill is trying to do.',
    'Committee stage is clause-by-clause review, the only stage where the public can actually testify and where amendments are realistically possible.',
    'Third reading is final debate and the final vote in the chamber that introduced it.',
    'After both chambers pass identical text, the bill receives Royal Assent and becomes an Act. Proclamation (when its provisions actually take effect) can be days or years later.',
  ],
  smartBrevity: {
    bigThing:
      'A federal bill must pass three readings + committee review in BOTH the House of Commons and the Senate before it can receive Royal Assent. Most of the substantive work happens at committee stage — and most public influence is exercised there.',
    whyItMatters:
      'Civic engagement that wants to actually affect legislation has to happen at the right stage. Calling your MP after a bill has passed third reading is too late; testifying at committee or writing to committee members during clause-by-clause review is when amendments are realistically possible.',
    goDeeper: [
      'First reading: formal introduction, bill text becomes public, no debate.',
      'Second reading: debate the principle; can be referred to committee before or after.',
      'Committee stage: clause-by-clause, public testimony, amendments proposed and voted on.',
      'Report stage: amendments from committee are debated and voted on in the full chamber.',
      'Third reading: final debate and vote.',
      'Senate: same six-stage sequence, with the Senate able to amend or reject.',
      'Royal Assent: the bill becomes an Act. Proclamation sets the actual coming-into-force date.',
    ],
    yesBut:
      'Most government bills pass largely intact under a majority government — the process is more about legitimacy than meaningful amendment. Private members\' bills face a much harder path and most die on the Order Paper.',
    bottomLine:
      'The procedural map is the same for every bill. Knowing where you are in it tells you whether public engagement is still possible and what kind of engagement will work.',
  },
  methodology:
    'All procedural descriptions are from the House of Commons Procedure and Practice (3rd ed., Bosc & Gagnon) and the Senate Procedure in Practice, as published on parl.ca and ourcommons.ca. Statistics on bill survival rates are from LEGISinfo public records.',
  sections: [
    {
      title: 'Stage 1 — Introduction and First Reading',
      body: `A federal bill starts life in either the House of Commons or the Senate. Government bills are usually introduced in the House; private members\' bills can start in either chamber.\n\nFirst reading is procedural only. The Minister (or MP / Senator) responsible stands, formally introduces the bill, and the Clerk reads its short title. There is no debate. The bill text is made public — this is the moment journalists, civil society, and the public first see what is actually being proposed.\n\nFirst reading is where bill numbers get assigned. Government bills introduced in the House get C-numbers (C-22, C-30, etc.). Senate-originated bills get S-numbers. A "C-" prefix doesn\'t mean Conservative — it means Commons. The numbering is sequential within each parliamentary session.`,
    },
    {
      title: 'Stage 2 — Second Reading',
      body: `Second reading is the chamber\'s first real debate on the bill. The principle of the bill is debated — meaning, do members agree with the GOAL of the legislation, not its specific clauses.\n\nA second-reading vote that passes sends the bill to committee. A second-reading vote that fails kills the bill outright (rare, especially for government bills).\n\nUnder normal circumstances, second-reading debate can run for several days or weeks. Time allocation (closure) is the procedural tool a government uses to limit debate and force a vote — this is the "closure motion" you hear about in news coverage.`,
    },
    {
      title: 'Stage 3 — Committee Stage (the most important one)',
      body: `Once second reading passes, the bill is referred to a parliamentary committee. Bills are usually referred to a standing committee whose subject-matter expertise fits the bill (Bill C-22 went to the Standing Committee on Public Safety and National Security, for example).\n\nCommittee stage is where the substantive work happens. The committee can:\n\n- **Call witnesses** — government officials, subject-matter experts, affected parties, civil-society organizations. Public testimony is taken on the public record. This is the stage at which ordinary Canadians and organized groups can MOST directly influence what is in the bill.\n- **Propose amendments** — clause-by-clause review. Every clause of the bill can be amended.\n- **Vote on amendments** — government and opposition members vote; under majority governments, government-side amendments are the main path to changes that pass.\n- **Report the bill back** — with or without amendments — to the chamber that referred it.\n\nIf you want to influence what is in a bill, committee stage is when. Writing to committee members during clause-by-clause is materially more effective than writing to your MP after the bill has cleared the chamber.`,
    },
    {
      title: 'Stage 4 — Report Stage',
      body: `After committee reports back, the bill returns to the full chamber for "report stage." This is where amendments proposed at committee are debated and voted on by the whole House (or Senate).\n\nReport stage often features additional amendments proposed by members who weren\'t on the committee — though these are less likely to pass than committee-proposed amendments. The chamber as a whole can adopt, modify, or reject what committee did.`,
    },
    {
      title: 'Stage 5 — Third Reading',
      body: `Third reading is the final debate and vote in the originating chamber. By this stage the text is largely settled.\n\nIf the bill passes third reading, it moves to the OTHER chamber (House → Senate, or Senate → House) and begins the same six-stage sequence over again.`,
    },
    {
      title: 'Stage 6 — The Other Chamber',
      body: `Bills almost always pass through BOTH chambers. A House-originated bill goes to the Senate after third reading; a Senate-originated bill goes to the House.\n\nThe Senate is supposed to function as a chamber of "sober second thought." In practice, the Senate has constitutional power to amend, delay, or even reject most legislation — though the modern convention is that the Senate rarely defeats government bills outright.\n\nWhen the second chamber amends a bill, the amended text returns to the originating chamber. The two chambers must agree on identical text before the bill can proceed. This is the procedural step that can drag a bill across multiple sessions if either chamber digs in on amendments.`,
    },
    {
      title: 'Stage 7 — Royal Assent and Proclamation',
      body: `Once both chambers have passed identical text, the bill receives **Royal Assent** — the formal granting of consent by the Crown (in practice, the Governor General or, for some matters, the King). Royal Assent is the moment the bill becomes an Act of Parliament.\n\nBut becoming an Act doesn\'t always mean the law is in force. Many Acts specify that they (or specific provisions) come into force "on a day to be fixed by order of the Governor in Council." That order is **proclamation**. Proclamation can be the same day as Royal Assent, or it can be months or years later — particularly for bills that require regulations to be drafted before the law can practically operate.`,
    },
    {
      title: 'Where the public can still affect what passes',
      body: `Realistic civic-engagement opportunities by stage:\n\n- **Before first reading** — engagement with the responsible department / minister\'s office while the bill is being drafted. Sector lobbying happens here.\n- **Between first and second reading** — public commentary on the bill text, often filtered to media and party platforms.\n- **Committee stage** — the highest-leverage public stage. Written submissions, testimony if invited, direct engagement with committee members.\n- **Senate review** — Senate committees take public submissions too. Often the second-best opportunity, particularly when the Senate is studying a House-passed bill.\n- **After Royal Assent** — only regulation-making remains. Some Acts have public-consultation requirements for the regulations that put them into operation.\n\nThe earlier in the process you engage, the more substantive change is possible. By third reading, the text is largely settled; by Royal Assent, the only remaining lever is the implementation regulations.`,
    },
  ],
  sources: [
    { label: 'House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed.)', url: 'https://www.ourcommons.ca/About/ProcedureAndPractice3rdEdition/index-e.html' },
    { label: 'LEGISinfo — current and historical bills', url: 'https://www.parl.ca/legisinfo/' },
    { label: 'Senate of Canada — Procedure in Practice', url: 'https://sencanada.ca/en/about/procedural-references/procedure-in-practice/' },
    { label: 'Parliament of Canada — How a Bill Becomes Law (visual guide)', url: 'https://www.ourcommons.ca/About/OurProcedure/LegislativeProcess/c_g_legislativeprocess-e.htm' },
    { label: 'Government of Canada — Cabinet Directive on Regulation', url: 'https://www.canada.ca/en/government/system/laws/developing-improving-federal-regulations/requirements-developing-managing-reviewing-regulations/guidelines-tools.html' },
  ],
};
