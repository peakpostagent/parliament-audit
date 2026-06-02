/**
 * Evergreen day-07: Parliamentary privilege.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'what-parliamentary-privilege-actually-protects',
  headline: 'What Parliamentary Privilege Actually Protects — And What It Doesn\'t.',
  subheadline:
    'Parliamentary privilege is one of the oldest and most misunderstood features of the Canadian constitutional order. It protects MPs and senators from being sued or prosecuted for what they say in the chamber. It does not give them immunity from the law generally. This article walks what privilege covers, what it doesn\'t, and the cases where the line has been tested.',
  summary:
    'Parliamentary privilege is a set of legal protections enjoyed by members of Parliament that allow them to perform their legislative duties without external interference. The most-cited element is freedom of speech in the chamber — an MP cannot be sued for defamation, or charged with hate speech, or otherwise legally pursued, for words spoken in the House of Commons or Senate. The protections also extend to parliamentary committees, parliamentary publications, and the work of parliamentary officers. But privilege is bounded: it does not cover words spoken outside Parliament, does not exempt MPs from criminal law generally, and does not extend to constituency or campaign communications. This article walks the architecture, the case law, and the contemporary points of friction.',
  publishedAt: new Date().toISOString(),
  category: 'Accountability',
  tags: ['parliamentary privilege', 'freedom of speech', 'constitutional law', 'MPs', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 4,
  keyTakeaways: [
    'Parliamentary privilege protects MPs from being sued or prosecuted for what they say IN the chamber and in committee.',
    'It does NOT protect them for what they say outside Parliament — on social media, in press scrums, in constituency communications.',
    'It applies to both individual privilege (each MP) and collective privilege (the chamber as a whole, e.g. to control its own proceedings).',
    'The protection exists so that MPs can speak freely on issues of public importance without fear of legal retaliation.',
    'Privilege does not cover MPs from criminal law generally, nor from being held in contempt of Parliament for misconduct.',
  ],
  smartBrevity: {
    bigThing:
      'Parliamentary privilege is the constitutional protection that lets MPs say things in the chamber that would be defamatory or otherwise actionable outside it. It is bounded, narrow, and tied to the proper functioning of Parliament — not a general immunity.',
    whyItMatters:
      'The protection is what allows MPs to name individuals, accuse specific officials of misconduct, or read potentially defamatory documents into the record without exposing themselves to civil suit. Whistleblowing-by-MP is structurally enabled by privilege.',
    goDeeper: [
      'Freedom of speech in proceedings — the core protection (Bill of Rights 1689 origin, carried into Canadian constitutional order).',
      'Extends to committee work, parliamentary publications, official Hansard.',
      'Individual privilege: each MP\'s.',
      'Collective privilege: the chamber\'s (control of own proceedings, discipline of members).',
      'Does not apply to: MP communications outside Parliament; campaign material; constituency correspondence; criminal law generally.',
      'Parliament itself can punish abuse of privilege — contempt findings.',
    ],
    yesBut:
      'Privilege is sometimes used to make accusations that the MP could not legally defend outside Parliament. This is a feature (protected whistleblowing) and a bug (potential reputational harm without judicial remedy). The line is contested.',
    bottomLine:
      'Privilege is narrow, ancient, and load-bearing. It enables MPs to do their job. It does not give them immunity from being held accountable for misconduct or for what they say in their non-parliamentary capacity.',
  },
  methodology:
    'Derived from House of Commons Procedure and Practice (Bosc & Gagnon, 3rd ed.); the Canadian Bill of Rights, 1689; and key SCC rulings including New Brunswick Broadcasting Co. v Nova Scotia, [1993] 1 SCR 319, and Canada (House of Commons) v Vaid, 2005 SCC 30.',
  sections: [
    {
      title: 'The core protection — freedom of speech in proceedings',
      body: `The single most-cited element of parliamentary privilege is freedom of speech in Parliament. An MP cannot be sued for defamation, charged with hate speech, or otherwise legally pursued for words spoken in the House of Commons, in the Senate, or in their committees.\n\nThe origin is article 9 of the English Bill of Rights, 1689: "the freedom of speech and debates or proceedings in Parliament ought not to be impeached or questioned in any court or place out of Parliament." That principle was carried into Canadian constitutional law through Section 18 of the Constitution Act, 1867 and the common law.\n\nThe protection means an MP can, for instance, name a specific business as engaging in fraud, read out a document that would be subject to a publication ban, or accuse a named individual of wrongdoing — without exposing themselves to civil suit, provided the speech is in the course of parliamentary proceedings.`,
    },
    {
      title: 'What "proceedings" includes',
      body: `The protection extends to:\n\n- Debate in the chamber.\n- Statements made during questions and answers (e.g., Question Period).\n- Committee work — both questions to witnesses and members\' own statements.\n- Documents tabled in the House or in committee.\n- The official Hansard — meaning, the verbatim record published as a parliamentary document.\n- Parliamentary officers acting in their official capacity.\n\nIt does NOT extend to:\n\n- Press scrums OUTSIDE the chamber (even if the journalist asks about chamber proceedings).\n- Social media posts.\n- Constituency office communications.\n- Campaign material.\n- Public speeches given outside parliamentary precincts.\n- Interviews given to media.\n\nThe practical implication: an MP can read a defamatory accusation into the chamber record, but if they repeat the same accusation in a press scrum outside the chamber, they are no longer protected.`,
    },
    {
      title: 'Individual vs collective privilege',
      body: `**Individual privilege** belongs to each member. It includes freedom of speech, freedom from arrest in civil matters during a parliamentary session, freedom from jury duty during a session, and the right to attend Parliament without obstruction.\n\n**Collective privilege** belongs to the chamber as a whole. It includes the right to regulate its own proceedings (the source of parliamentary procedure), the right to discipline its own members (the source of contempt-of-Parliament findings), and the right to summon witnesses and demand documents.\n\nCollective privilege is what allows the House (or Senate) to punish a member for misconduct that doesn\'t rise to a criminal offence. Suspending a member from the chamber, ordering an apology, or expelling a member entirely are exercises of collective privilege.`,
    },
    {
      title: 'The limits — what privilege does NOT do',
      body: `Privilege does not:\n\n- **Exempt MPs from the criminal law generally.** An MP who commits a crime is criminally liable like any other Canadian. The chamber may also discipline them for bringing Parliament into disrepute.\n- **Protect from contempt of Parliament.** Parliament can hold its own members in contempt for misconduct.\n- **Cover external communications.** Words spoken outside the chamber — including statements about parliamentary matters made to journalists, at events, or on social media — are not covered. Civil suit is possible against an MP for those statements.\n- **Block judicial review of administrative decisions.** Parliament\'s management of its own employees is subject to general law (Canada (House of Commons) v Vaid, 2005 SCC 30 — a parliamentary employee\'s discrimination claim could proceed in the courts).\n\nThe overall shape: privilege is functional. It exists to enable Parliament to operate; it does not exist as a general grant of immunity to members.`,
    },
    {
      title: 'Where the line is currently contested',
      body: `Several modern fact patterns put privilege under pressure:\n\n- **Social media use during sittings.** If an MP repeats on X what they said in the chamber 30 seconds earlier, the chamber statement is privileged but the X post is not. Where the line falls — and whether retweets, shares, and screenshots count — is a developing question.\n- **Hybrid sittings.** When MPs participate remotely, what counts as "in Parliament" for privilege purposes? Modern privilege jurisprudence has tended to extend privilege to fully-included remote participation but the law is still settling.\n- **Naming officials.** When an MP uses privilege to name a specific public servant or government official as having engaged in misconduct, the named individual has no legal remedy. The contestability is whether this is a feature (whistleblower protection) or a bug (no recourse for the falsely accused).\n\nThe institution generally treats privilege as load-bearing for the democratic function of Parliament. The detailed boundaries continue to be tested case by case.`,
    },
  ],
  sources: [
    { label: 'House of Commons Procedure and Practice — Privilege', url: 'https://www.ourcommons.ca/About/ProcedureAndPractice3rdEdition/index-e.html' },
    { label: 'Canada (House of Commons) v Vaid, 2005 SCC 30', url: 'https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/2229/index.do' },
    { label: 'New Brunswick Broadcasting Co. v Nova Scotia, [1993] 1 SCR 319', url: 'https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/969/index.do' },
    { label: 'Constitution Act, 1867 — Section 18', url: 'https://laws-lois.justice.gc.ca/eng/Const/page-3.html#h-15' },
  ],
};
