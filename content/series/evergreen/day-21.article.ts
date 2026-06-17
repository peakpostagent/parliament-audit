/**
 * Evergreen day-21: The Charter of Rights and Freedoms, section by
 * section — a plain-English tour. Non-partisan civic explainer.
 * Complements day-04 (notwithstanding clause).
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'the-charter-of-rights-and-freedoms-section-by-section-plain-english',
  headline: 'The Charter of Rights and Freedoms, in Plain English: What Each Section Actually Protects.',
  subheadline:
    'Canadians invoke "their Charter rights" constantly, but few could name what the Charter actually contains. It\'s shorter than most people think — a few dozen sections covering fundamental freedoms, democratic and mobility rights, legal protections, equality, and language. This is a plain-English tour of what each part guarantees, plus the two clauses that shape how all of it works: the reasonable-limits test and the notwithstanding clause.',
  summary:
    'The Canadian Charter of Rights and Freedoms is Part I of the Constitution Act, 1982. It guarantees a defined set of rights against government action, grouped into categories: fundamental freedoms (s. 2 — conscience and religion, expression, peaceful assembly, association); democratic rights (ss. 3–5 — the right to vote, maximum five-year legislative terms, annual sittings); mobility rights (s. 6 — to enter, remain in, and leave Canada, and to move between provinces); legal rights (ss. 7–14 — life, liberty and security of the person; protection against unreasonable search and seizure, arbitrary detention; rights on arrest and at trial; protection against cruel and unusual punishment); equality rights (s. 15); official-language rights (ss. 16–22) and minority-language education rights (s. 23); plus interpretive and general provisions (ss. 25–34, including protections for Indigenous rights and multicultural heritage). Two structural clauses govern how the rights operate. Section 1 lets governments justify limits on rights if they are "reasonable" and "demonstrably justified in a free and democratic society" — the framework applied through the Oakes test. Section 33, the notwithstanding clause, lets Parliament or a legislature override certain Charter sections for renewable five-year periods (covered in depth in our notwithstanding-clause explainer). The Charter binds government, not private individuals, and the courts enforce it — they can strike down laws that violate it.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['Charter', 'rights and freedoms', 'constitution', 'section 1', 'civil liberties', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 6,
  faq: [
    {
      question: 'What rights does the Canadian Charter protect?',
      answer:
        'The Charter guarantees fundamental freedoms (conscience and religion, expression, peaceful assembly, association), democratic rights (voting, five-year term limits), mobility rights (entering/leaving Canada, moving between provinces), legal rights (life, liberty, security; protections on search, detention, arrest, and trial), equality rights, and language rights. It binds governments — not private individuals — and the courts can strike down laws that violate it.',
    },
    {
      question: 'Are Charter rights absolute?',
      answer:
        'No. Section 1 allows governments to limit a right if the limit is "reasonable" and "demonstrably justified in a free and democratic society" — assessed through the Oakes test (is the goal pressing and substantial, and is the limit proportionate?). Separately, the section 33 notwithstanding clause lets a legislature override certain rights for renewable five-year periods. So rights can be limited two different ways: justified limits, and legislative override.',
    },
    {
      question: 'Does the Charter apply to private companies and individuals?',
      answer:
        'Generally no. The Charter binds government — Parliament, legislatures, and government action — not private relationships between individuals or companies. A private employer or business is governed by other laws (like human-rights codes and labour law), not directly by the Charter. The Charter is a limit on state power.',
    },
    {
      question: 'What is the Oakes test?',
      answer:
        'The framework courts use under section 1 to decide whether a limit on a Charter right is justified. Set out in R v Oakes (1986), it asks whether the law\'s objective is pressing and substantial, and whether the means are proportionate: rationally connected to the goal, minimally impairing the right, and balanced in their overall effect. If a limit passes Oakes, it\'s constitutional even though it restricts a right.',
    },
  ],
  keyTakeaways: [
    'The Charter is Part I of the Constitution Act, 1982 — it binds government, not private parties.',
    's. 2: fundamental freedoms — conscience/religion, expression, peaceful assembly, association.',
    'ss. 3–5: democratic rights — the right to vote and maximum five-year legislative terms.',
    's. 6: mobility — enter/remain/leave Canada and move between provinces.',
    'ss. 7–14: legal rights — life, liberty, security; search/seizure, detention, arrest, fair trial, no cruel punishment.',
    's. 15: equality rights.',
    'ss. 16–23: official-language and minority-language education rights.',
    's. 1 lets governments justify "reasonable limits" (the Oakes test); s. 33 lets legislatures override certain rights for 5 years.',
  ],
  smartBrevity: {
    bigThing:
      'The Charter is a compact list of guarantees against government power — freedoms, democratic and mobility rights, legal protections, equality, and language — wrapped in two clauses that decide how they bend: section 1 (justified limits) and section 33 (legislative override). Knowing the list, and those two clauses, is most of Charter literacy.',
    whyItMatters:
      'Charter arguments shape major legislation this site covers — from surveillance bills to hate-speech provisions. "It violates the Charter" and "it\'s a reasonable limit under section 1" are the two halves of nearly every rights debate in Parliament. You can\'t follow those debates without knowing what the Charter actually says and how limits work.',
    goDeeper: [
      's. 2: expression, religion, assembly, association.',
      'ss. 3–5: vote, 5-year terms, annual sittings.',
      's. 6: mobility in and out of Canada and between provinces.',
      'ss. 7–14: legal rights (liberty, search, arrest, fair trial).',
      's. 15: equality. ss. 16–23: language.',
      's. 1: reasonable limits (Oakes). s. 33: notwithstanding override.',
    ],
    yesBut:
      'The text is the easy part; the meaning is litigated. What "freedom of expression" or "equality" requires in a hard case is decided by decades of Supreme Court interpretation, not the words alone — and reasonable people disagree about where section 1 limits should fall. The Charter sets the framework; the courts, case by case, fill it in. That\'s a feature (rights adapt to new situations) and a friction (unelected judges shaping policy) at the same time.',
    bottomLine:
      'Most of "my Charter rights" comes down to a short list of guarantees against government, two clauses that let those guarantees be limited or overridden, and a judiciary that decides the close calls. Learn the list and the two clauses, and the rights debates in Parliament suddenly parse.',
  },
  methodology:
    'All sections are summarized from the Canadian Charter of Rights and Freedoms (Part I of the Constitution Act, 1982, Schedule B). The section 1 framework is from R v Oakes, [1986] 1 SCR 103. The notwithstanding clause (s. 33) is summarized here and treated in depth in our separate explainer. The Charter\'s application to government (not private parties) follows RWDSU v Dolphin Delivery and established jurisprudence. This is a plain-language overview, not legal advice; the operative meaning of each right is shaped by extensive Supreme Court of Canada case law.',
  sections: [
    {
      title: 'What the Charter is — and who it binds',
      body: `The **Canadian Charter of Rights and Freedoms** is **Part I of the Constitution Act, 1982** — the entrenched bill of rights Canada patriated in 1982. Because it\'s constitutional, it sits above ordinary law: the courts can **strike down legislation** that violates it.\n\nThe single most-misunderstood thing about the Charter: **it binds *government*, not private parties.** Parliament, the legislatures, and government action are constrained by it. Your private employer, your neighbour, a store, a social-media company — their conduct toward you is governed by *other* laws (human-rights codes, labour law, contract), not directly by the Charter. The Charter is a leash on **state power**, not a rulebook for private life.\n\nIt\'s also shorter than people imagine — a few dozen sections. Here\'s the tour.`,
    },
    {
      title: 'The freedoms and the democratic guarantees',
      body: `**Section 2 — Fundamental freedoms.** The big four: freedom of **conscience and religion**; freedom of **thought, belief, opinion and expression** (including the press); freedom of **peaceful assembly**; and freedom of **association**. These are the classic civil liberties, and section 2 is where most free-speech and freedom-of-religion cases live.\n\n**Sections 3–5 — Democratic rights.** Section 3 guarantees every citizen the **right to vote** and to run in elections. Section 4 caps the life of any legislature at **five years** (extendable only in genuine emergency, by a two-thirds vote). Section 5 requires Parliament and each legislature to **sit at least once every twelve months.** Notably, these are among the rights the **notwithstanding clause cannot override.**\n\n**Section 6 — Mobility rights.** The right to **enter, remain in, and leave Canada**, and the right of citizens and permanent residents to **move between provinces** and pursue a livelihood there. Also outside the reach of the notwithstanding clause.`,
    },
    {
      title: 'Legal rights, equality, and language',
      body: `**Sections 7–14 — Legal rights.** The dense, heavily-litigated core:\n- **s. 7** — life, liberty, and security of the person; not to be deprived of them except in accordance with the principles of fundamental justice.\n- **s. 8** — protection against **unreasonable search and seizure** (central to the surveillance and lawful-access debates this site has covered).\n- **s. 9** — against arbitrary detention.\n- **ss. 10–11** — rights on **arrest** (to counsel, to be informed of the charge) and at **trial** (presumption of innocence, trial within a reasonable time).\n- **ss. 12–14** — against **cruel and unusual punishment**; against self-incrimination; to an interpreter.\n\n**Section 15 — Equality rights.** Equality before and under the law and equal protection and benefit of the law, without discrimination — including on grounds like race, religion, sex, age, and (as read in by the courts) others such as sexual orientation. Section 15 also expressly permits **affirmative-action** programs.\n\n**Sections 16–23 — Language rights.** English and French as official languages of Canada (ss. 16–22), and the right of official-language minorities to have their children educated in their language where numbers warrant (s. 23). Language rights, too, are outside the notwithstanding clause.`,
    },
    {
      title: 'The two clauses that decide how it all works',
      body: `Two structural provisions govern how every right above actually operates — and they\'re where most of the real Charter action is.\n\n**Section 1 — Reasonable limits.** No Charter right is absolute. Section 1 guarantees the rights "subject only to such reasonable limits prescribed by law as can be **demonstrably justified in a free and democratic society**." When a law limits a right, the government can defend it under section 1 using the **Oakes test**: is the law\'s objective *pressing and substantial*, and are the means *proportionate* (rationally connected, minimally impairing, and balanced)? A limit that passes Oakes is constitutional even though it restricts a right. This is the second half of nearly every Charter argument in Parliament — "yes it limits the right, but it\'s justified."\n\n**Section 33 — The notwithstanding clause.** Parliament or a provincial legislature can expressly declare a law to operate "notwithstanding" section 2 or sections 7–15 — overriding those rights for renewable **five-year** periods. It cannot touch democratic, mobility, or language rights. We cover it fully in our [notwithstanding-clause explainer](/news/notwithstanding-clause-in-plain-english); the short version is that it\'s the legislative override that lets elected bodies have the last word on a defined set of rights.\n\nAnd the interpretive provisions (**ss. 25–34**) round it out — protecting **Indigenous rights** (s. 25), **multicultural heritage** (s. 27), affirming **gender equality** (s. 28), and more.\n\nLearn the list of rights, then learn these two clauses, and the rights debates this site reports — surveillance, hate speech, equality — stop being abstractions and start being readable: *which right, justified how under section 1, and is anyone reaching for section 33?*`,
    },
  ],
  sources: [
    { label: 'Canadian Charter of Rights and Freedoms (Constitution Act, 1982, Part I)', url: 'https://laws-lois.justice.gc.ca/eng/const/page-12.html' },
    { label: 'Department of Justice — Charterpedia (section-by-section analysis)', url: 'https://www.justice.gc.ca/eng/csj-sjc/rfc-dlc/ccrf-ccdl/index.html' },
    { label: 'R v Oakes, [1986] 1 SCR 103 (the section 1 test)', url: 'https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/117/index.do' },
    { label: 'Parliament Audit — The notwithstanding clause, in plain English', url: 'https://parliamentaudit.ca/news/notwithstanding-clause-in-plain-english' },
    { label: 'Library of Parliament — The Charter of Rights and Freedoms', url: 'https://lop.parl.ca/sites/PublicWebsite/default/en_CA/ResearchPublications' },
  ],
};
