/**
 * Evergreen day-16: Orders in Council and how cabinet governs without
 * Parliament. Non-partisan civic explainer on executive/regulatory
 * power — documents the mechanism and its accountability limits.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'orders-in-council-how-cabinet-governs-without-a-vote-in-parliament',
  headline: 'Most Federal Decisions Never Get a Vote in Parliament. They\'re Made by Cabinet — Here\'s How.',
  subheadline:
    'Appointments, regulations, tariffs, emergency measures, even whether a law actually comes into force — a huge share of how Canada is governed happens not through bills debated in the House, but through Orders in Council and regulations made by cabinet. This explainer covers what that machinery is, where its authority comes from, and the much weaker accountability that applies to it.',
  summary:
    'An enormous portion of federal governing happens outside the legislative process that this site tracks. Parliament passes statutes that delegate authority to the Governor in Council (the Governor General acting on cabinet\'s advice) and to ministers, who then exercise that authority through Orders in Council (OICs) and regulations. OICs appoint judges, deputy ministers, ambassadors, and heads of agencies; bring statutes (or specific sections) into force; impose tariffs and sanctions; and trigger emergency powers. Regulations — the detailed rules that fill in how a statute actually operates — are made under authority a parent act grants, published in the Canada Gazette, and reviewed by the Standing Joint Committee for the Scrutiny of Regulations. None of this requires a Commons vote: cabinet acts, the instrument is registered and published, and it has the force of law. The accountability is real but indirect — regulations must stay within the bounds of their enabling statute (or courts can strike them down), and a government answers politically for its choices — but there is no equivalent to the recorded division, debate, and committee study that legislation receives.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['Orders in Council', 'regulations', 'cabinet', 'executive power', 'Canada Gazette', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 5,
  faq: [
    {
      question: 'What is an Order in Council in Canada?',
      answer:
        'An Order in Council (OIC) is a decision made by the Governor in Council — the Governor General acting on the advice of cabinet — under authority granted by a statute or by the Crown\'s prerogative. OICs make senior appointments, bring laws into force, impose tariffs and sanctions, and trigger emergency powers. They have the force of law and do not require a vote in Parliament.',
    },
    {
      question: 'How are federal regulations made, and who approves them?',
      answer:
        'Regulations are detailed rules made under authority a "parent" statute delegates to cabinet or a minister. A proposed regulation is typically pre-published for comment, then made by Order in Council or ministerial order, registered, and published in the Canada Gazette — at which point it has the force of law. Parliament does not vote on individual regulations, but the Standing Joint Committee for the Scrutiny of Regulations reviews them for legality.',
    },
    {
      question: 'Does Parliament vote on Orders in Council?',
      answer:
        'No. OICs and regulations are exercises of executive power delegated by statute — cabinet acts and the instrument takes effect once registered and published. Parliament\'s control is upstream (it wrote the enabling law and can amend or repeal it) and indirect (committee scrutiny, the courts, and political accountability), but there is no recorded division on an OIC the way there is on a bill.',
    },
    {
      question: 'Can Orders in Council or regulations be challenged?',
      answer:
        'Yes. A regulation or OIC must stay within the authority its enabling statute grants — if it goes beyond that (is "ultra vires") or violates the Charter, courts can strike it down. The Standing Joint Committee for the Scrutiny of Regulations also reviews regulations for legal defects and can recommend they be revoked. But these checks operate after the fact, not before the instrument takes effect.',
    },
  ],
  keyTakeaways: [
    'A large share of federal governing happens via Orders in Council and regulations, not bills.',
    'OICs are made by the Governor in Council — the GG acting on cabinet\'s advice — under statutory or prerogative authority.',
    'They make senior appointments, bring laws into force, impose tariffs/sanctions, and trigger emergency powers.',
    'Regulations fill in how a statute actually operates; they\'re published in the Canada Gazette and have the force of law.',
    'None of this requires a Commons vote — cabinet acts and the instrument takes effect.',
    'Checks exist but are indirect: the enabling statute\'s limits, the courts (ultra vires / Charter), and the Scrutiny of Regulations committee.',
    'A statute can sit passed-but-not-in-force for years until an OIC brings it into effect.',
  ],
  smartBrevity: {
    bigThing:
      'The bills and recorded votes this site tracks are the visible tip of federal governing. Underneath, cabinet exercises delegated power through Orders in Council and regulations — appointments, tariffs, when laws switch on — with no Commons vote and far thinner scrutiny.',
    whyItMatters:
      'If you only watch legislation, you miss where a lot of consequential decisions actually get made. A government can shape policy substantially through regulation and OIC without ever facing a division — which is efficient, but also where accountability is weakest. Knowing this machinery exists is knowing where to look.',
    goDeeper: [
      'Governor in Council = GG acting on cabinet advice.',
      'OICs: appointments, bringing laws into force, tariffs, sanctions, emergencies.',
      'Regulations: the operational detail under a parent statute.',
      'Published in the Canada Gazette; force of law on registration.',
      'No Commons vote; Scrutiny of Regulations committee reviews legality.',
      'Courts can strike ultra vires or Charter-violating instruments.',
    ],
    yesBut:
      'Delegated authority isn\'t a loophole — it\'s necessary. Parliament can\'t legislate every technical detail of food safety, aviation, or tax administration; it sets the framework and delegates the specifics. The democratic safeguard is that the delegation comes *from* a statute Parliament debated and voted on, and Parliament can claw it back by amending the parent act. The real concern is scope: how broad the delegated power is, and how thin the after-the-fact review can be in practice.',
    bottomLine:
      'Parliament writes the rules about who gets to make the rules. After that, cabinet makes an enormous number of them — quietly, in the Canada Gazette, without a vote. The legislation is the headline; the regulations are where much of the governing actually lives.',
  },
  methodology:
    'The Governor in Council / Order in Council mechanism is described from the Privy Council Office\'s published guidance and the Statutory Instruments Act, which governs how regulations are made, registered, and published. Regulatory scrutiny is from the mandate of the Standing Joint Committee for the Scrutiny of Regulations. The "coming into force" function of OICs is a standard feature of Canadian statutes (a bill\'s final section commonly sets the act to come into force "on a day to be fixed by order of the Governor in Council"). Judicial review of ultra vires regulations follows established administrative-law principles.',
  sections: [
    {
      title: 'The governing that doesn\'t get a vote',
      body: `Watch Parliament and you see bills: introduced, debated, sent to committee, voted on in recorded divisions. That\'s the visible layer — and it\'s a minority of how Canada is actually governed day to day.\n\nThe larger layer is **executive action**: decisions cabinet and ministers make under authority that statutes have *delegated* to them. The two main instruments:\n\n- **Orders in Council (OICs)** — formal decisions of the **Governor in Council** (the Governor General acting on the advice of cabinet).\n- **Regulations** — the detailed rules that fill in how a statute operates.\n\nNeither requires a vote in the House of Commons. Cabinet decides, the instrument is registered and published, and it carries the **force of law**. A single afternoon\'s OICs can appoint a deputy minister, impose a sanction, and switch on a law passed months earlier — none of it touching the Commons floor.`,
    },
    {
      title: 'What Orders in Council actually do',
      body: `OICs are the workhorses of executive government. They:\n\n- **Make senior appointments** — judges of superior courts, deputy ministers, ambassadors, heads of Crown corporations and agencies.\n- **Bring statutes into force.** This one surprises people: passing a bill and *Royal Assent* don\'t always make a law operative. Many statutes end with "comes into force on a day to be fixed by order of the Governor in Council." The law sits dormant — sometimes for years — until an OIC switches it on. Cabinet controls the timing.\n- **Impose tariffs, sanctions, and trade measures** under authority delegated by trade and special-economic-measures legislation.\n- **Trigger emergency powers**, declare and manage responses under emergency statutes.\n- **Make regulations**, by approving them as the formal act of the Governor in Council.\n\nEach of these is a real governing decision. None gets a recorded division.`,
    },
    {
      title: 'Regulations: the law beneath the law',
      body: `A statute sets the framework; **regulations** make it work. The Food and Drugs Act doesn\'t list every permitted additive — regulations do. The Income Tax Act delegates mountains of operational detail to regulation. By volume, regulations vastly outweigh statutes.\n\nThe process: a department drafts a proposed regulation under authority its **parent act** grants; it\'s usually **pre-published** in the Canada Gazette for public comment; it\'s then **made** (by OIC or ministerial order), **registered**, and **published** in the Canada Gazette — and at that point it has the force of law.\n\nParliament does not vote on individual regulations. The one dedicated check is the **Standing Joint Committee for the Scrutiny of Regulations** — a House-Senate committee that reviews regulations strictly for *legality* (are they within the authority the statute granted? are they clear, non-retroactive, Charter-compliant?). It can flag defects and recommend revocation, but it reviews thousands of instruments after they\'re already in force.`,
    },
    {
      title: 'Where the accountability is — and isn\'t',
      body: `Delegated power isn\'t lawless, but its checks are weaker and later than legislation\'s:\n\n- **The enabling statute is the leash.** A regulation or OIC must stay within the authority Parliament delegated. Go beyond it and it\'s *ultra vires* — courts can strike it down. Violate the Charter and the same applies.\n- **Parliament controls the delegation.** It wrote the parent act and can amend or repeal it to narrow or revoke the power. That\'s real but blunt — it requires new legislation.\n- **Committee scrutiny** catches legal defects, but only for legality, and after the fact.\n- **Political accountability.** A government answers in Question Period and at the ballot box for what it does by OIC and regulation — but there\'s no division to point to, no committee testimony on the specific choice, no Hansard debate.\n\nThe trade-off is deliberate: Parliament can\'t legislate every technical detail, so it delegates — and the safeguard is that the delegation flows from a law it debated and voted on. The thing worth watching is *scope*: the broader the delegated power, the more governing happens in the Gazette instead of the Chamber.\n\nFor readers of this site: we track recorded votes because they\'re the accountable, on-the-record decisions. Just remember they\'re not the whole of governing — a great deal happens one rung down, where cabinet acts and the only record is a line in the Canada Gazette.`,
    },
  ],
  sources: [
    { label: 'Privy Council Office — Orders in Council (search and guidance)', url: 'https://orders-in-council.canada.ca/' },
    { label: 'Statutory Instruments Act (R.S.C., 1985, c. S-22)', url: 'https://laws-lois.justice.gc.ca/eng/acts/s-22/' },
    { label: 'Standing Joint Committee for the Scrutiny of Regulations — mandate', url: 'https://www.parl.ca/Committees/en/REGS/About' },
    { label: 'Canada Gazette — official publication of regulations', url: 'https://gazette.gc.ca/accueil-home-eng.html' },
    { label: 'Library of Parliament — Delegated legislation and regulations', url: 'https://lop.parl.ca/sites/PublicWebsite/default/en_CA/ResearchPublications' },
  ],
};
