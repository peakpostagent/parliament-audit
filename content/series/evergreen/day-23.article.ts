/**
 * Evergreen day-23: How a law gets challenged in court — judicial
 * review, Charter challenges, and the road to the Supreme Court.
 * Non-partisan civic explainer. Complements the Charter tour (day-21)
 * and notwithstanding clause (day-04).
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'how-a-law-gets-challenged-in-court-charter-challenges-explained',
  headline: 'Parliament Passes a Law. Then What? How Canadians Actually Get a Law Struck Down in Court.',
  subheadline:
    'A bill becoming law isn\'t the end of the story — it\'s often the start of the next one. If a law violates the Constitution, courts can strike it down, and they regularly do. This explainer walks the path a constitutional challenge takes: who can bring one, how it climbs from a trial court to the Supreme Court of Canada, what "reading down" and "striking down" mean, and the override Parliament can reach for to have the last word.',
  summary:
    'In Canada, passing a law does not make it unchallengeable. Because the Constitution — including the Charter of Rights and Freedoms and the division of powers between Parliament and the provinces — is the supreme law, courts can declare a statute invalid if it conflicts with the Constitution. A challenge typically begins when someone with standing (a person directly affected, or a public-interest litigant granted standing) sues, often after being charged under the law or directly harmed by it. The case starts in a trial court (a superior court of a province, or the Federal Court), where evidence is heard and a first ruling issued; it can then be appealed to the provincial Court of Appeal and, with permission (leave), to the Supreme Court of Canada, whose decision is final and binding nationwide. Governments can also skip the litigation route and ask a court directly for an advisory opinion through a "reference." If a court finds a law unconstitutional, its remedies range from "reading down" or "reading in" (narrowing or adding words to save the law) to striking it down in whole or in part, sometimes with a suspended declaration giving Parliament time to fix it. Two doctrines shape the whole process: section 1 of the Charter, which lets the government justify a rights limit as reasonable (the Oakes test), and section 33, the notwithstanding clause, which lets a legislature override certain Charter rulings. The result is a continuing dialogue between Parliament and the courts — laws this site tracks through the House are frequently tested, narrowed, or struck afterward in a courtroom.',
  publishedAt: new Date().toISOString(),
  category: 'Legislation',
  tags: ['courts', 'Charter challenge', 'judicial review', 'Supreme Court', 'constitution', 'civic literacy', 'evergreen'],
  readingTimeMinutes: 6,
  faq: [
    {
      question: 'Can a Canadian court strike down a law passed by Parliament?',
      answer:
        'Yes. The Constitution is the supreme law of Canada, so courts can declare a statute invalid if it conflicts with the Constitution — including the Charter of Rights and Freedoms or the division of powers between Parliament and the provinces. A struck-down law has no force, in whole or in part, depending on the ruling. This is a routine and established feature of Canadian law.',
    },
    {
      question: 'How does a law get challenged in court in Canada?',
      answer:
        'Usually someone with standing — a person directly affected, often after being charged under the law, or a public-interest group granted standing — brings a case in a trial court (a provincial superior court or the Federal Court). The losing side can appeal to the provincial Court of Appeal and then, with permission ("leave"), to the Supreme Court of Canada. Governments can also ask a court directly via a "reference."',
    },
    {
      question: 'What does it mean to "read down" or "strike down" a law?',
      answer:
        'These are remedies a court can use when a law is unconstitutional. "Striking down" invalidates the law (or the offending part). "Reading down" narrows how a provision is interpreted so it stays within constitutional limits; "reading in" adds words to cure a defect. A court may also issue a "suspended declaration of invalidity," giving Parliament a set period to fix the law before the ruling takes effect.',
    },
    {
      question: 'Can Parliament override a court ruling that strikes down a law?',
      answer:
        'For certain Charter rights, yes — through the section 33 notwithstanding clause, a legislature can re-enact a law to operate despite a ruling that it violates section 2 or sections 7–15, for renewable five-year periods. It cannot override rulings about the division of powers, democratic rights, mobility, or language rights. Most of the time governments respond to a ruling by amending the law instead.',
    },
  ],
  keyTakeaways: [
    'Passing a law doesn\'t make it final — courts can strike down laws that violate the Constitution.',
    'The Constitution (Charter + division of powers) is supreme; statutes that conflict with it can be invalidated.',
    'A challenge needs standing — usually someone directly affected, or a public-interest litigant granted it.',
    'The path: trial court → provincial Court of Appeal → Supreme Court of Canada (with leave); the SCC is final.',
    'Governments can also seek an advisory "reference" opinion directly from a court.',
    'Remedies range from reading down/in (saving the law) to striking it down, sometimes with a suspended declaration.',
    'Section 1 lets governments justify rights limits (Oakes); section 33 lets legislatures override certain Charter rulings.',
    'The result is an ongoing "dialogue" between Parliament and the courts.',
  ],
  smartBrevity: {
    bigThing:
      'A law passing the House is the opening move, not the final word. If it breaches the Constitution, a court can narrow it or strike it down — and the fight can climb from a single trial courtroom all the way to the Supreme Court of Canada, whose ruling binds the whole country.',
    whyItMatters:
      'Many of the most consequential laws this site tracks — surveillance powers, criminal-law changes, rights-affecting measures — are tested in court after Parliament passes them. Whether a law survives, gets narrowed, or is struck down often matters as much as the vote that created it. Following Parliament without following the courtroom misses half the story.',
    goDeeper: [
      'Constitution is supreme; conflicting statutes can be invalidated.',
      'Standing: a directly-affected person or a public-interest litigant.',
      'Path: trial court → Court of Appeal → Supreme Court (with leave).',
      'References let governments ask a court directly.',
      'Remedies: read down / read in / strike down / suspended declaration.',
      's. 1 (justify the limit) and s. 33 (override) frame everything.',
    ],
    yesBut:
      'Judicial review is itself debated. Critics argue that unelected judges striking down laws made by elected legislatures is a democratic tension — courts shaping policy through constitutional interpretation. Defenders answer that the whole point of an entrenched Constitution is to put some limits beyond the reach of a temporary majority, and that section 33 leaves legislatures a deliberate escape hatch. Canada\'s "dialogue" model — courts rule, Parliament responds (by amending, or rarely by overriding) — is the compromise, and where exactly the line sits is perpetually contested.',
    bottomLine:
      'In Canada, Parliament writes the law and the courts test it against the Constitution — and either branch can, in defined ways, answer the other. The vote in the House makes a law; the courtroom decides whether it stands. Both are where accountability lives.',
  },
  methodology:
    'The supremacy of the Constitution is from section 52(1) of the Constitution Act, 1982. The court hierarchy (provincial superior courts and the Federal Court at trial; provincial Courts of Appeal; the Supreme Court of Canada with leave) and the reference procedure are from the Constitution Act, 1867, the Supreme Court Act, and the Federal Courts Act. Standing principles follow the public-interest standing test (Downtown Eastside, 2012). Remedies (reading down, reading in, striking down, suspended declarations) are from Charter remedies jurisprudence, notably Schachter v Canada. Section 1 (R v Oakes) and section 33 are summarized here and treated in our Charter and notwithstanding-clause explainers. The "dialogue" framing is a well-established description in Canadian constitutional scholarship.',
  sections: [
    {
      title: 'Why a law is never truly settled',
      body: `In Canada, **the Constitution is the supreme law** — section 52 of the Constitution Act, 1982 says any law inconsistent with it is, to the extent of the inconsistency, **of no force or effect.**\n\nThat one sentence is why a bill passing the House of Commons isn\'t the end of the matter. A statute has to be consistent with the Constitution, which includes:\n\n- the **Charter of Rights and Freedoms** (does the law violate a protected right?), and\n- the **division of powers** (did the level of government that passed it — federal or provincial — actually have authority over the subject?).\n\nIf a law fails either test, a court can **declare it invalid.** This isn\'t exotic; it\'s a routine, foundational feature of the system. Parliament makes the law; the courts measure it against the Constitution; and laws this site tracks through the House are frequently tested — and sometimes narrowed or struck — in a courtroom afterward.`,
    },
    {
      title: 'Who can challenge, and where it starts',
      body: `A constitutional challenge needs two things: **someone with standing** and **a court to hear it.**\n\n**Standing** — the right to bring the case — usually belongs to a person **directly affected** by the law. Very often that\'s someone **charged under it** (a criminal defendant arguing the offence is unconstitutional) or directly harmed by it. Courts can also grant **public-interest standing** to organizations or individuals raising a serious constitutional issue that might otherwise never reach a court — a doorway that lets civil-liberties and advocacy groups bring test cases.\n\nThe case **starts in a trial court** — typically a **superior court of a province** (for most matters) or the **Federal Court** (for federal administrative and some statutory matters). There, evidence is heard, witnesses and experts testify, and a judge issues the first ruling on whether the law is constitutional.\n\nThat first ruling is rarely the last. It\'s the bottom rung of a ladder.`,
    },
    {
      title: 'Up the ladder to the Supreme Court',
      body: `From the trial court, the losing side can climb:\n\n1. **Trial court** — first decision on the facts and the constitutional question.\n2. **Provincial Court of Appeal** (or the Federal Court of Appeal) — reviews the trial decision for error. Three (sometimes five) judges; no new evidence, argument on the law.\n3. **Supreme Court of Canada** — the final court. Crucially, the SCC hears most appeals **only with permission ("leave")**, which it grants for cases of national importance. Its rulings are **final and binding across the entire country** — every court, every government, every Canadian.\n\nThere\'s also a shortcut that skips the lawsuit entirely: a **reference.** A government (federal or provincial) can ask a court — including the Supreme Court directly — for an **advisory opinion** on a constitutional question, without waiting for someone to be charged or harmed. The 1998 Quebec Secession Reference (covered in our secession explainer) and the 2014 Senate Reform Reference are examples. Reference opinions are technically advisory but are treated as authoritative.\n\nThis ladder is why a single law can be argued for years, and why a Supreme Court ruling — even on one person\'s case — can reshape the law for everyone.`,
    },
    {
      title: 'What a court can do — and Parliament\'s answer',
      body: `When a court finds a law unconstitutional, it has a **range of remedies**, not just a hammer:\n\n- **Striking down** — declaring the law (or the offending part) invalid. The strongest remedy.\n- **Reading down** — interpreting a provision narrowly so it stays within constitutional limits, saving the rest.\n- **Reading in** — adding words the legislature left out (for example, extending a benefit to a group wrongly excluded) to cure a Charter defect.\n- **Suspended declaration of invalidity** — striking the law down but **delaying** the effect (say, 12 months) to give Parliament time to write a constitutional replacement, avoiding a sudden legal vacuum.\n\nAnd Parliament is not powerless in response. The relationship is often described as a **"dialogue":**\n\n- Most often, the government **amends the law** to fix what the court flagged.\n- Under **section 1** of the Charter, the government can defend a rights limit as a **reasonable limit** in the first place (the Oakes test) — sometimes the law survives.\n- For certain Charter rights, a legislature can reach for **section 33, the notwithstanding clause** ([our explainer](/news/notwithstanding-clause-in-plain-english)), re-enacting a law to operate **despite** a ruling that it breaches sections 2 or 7–15 — though this can\'t touch division-of-powers, democratic, mobility, or language rulings.\n\nSo the full picture is two branches in motion: **Parliament writes and votes; the courts test against the Constitution; and each can, in defined ways, respond to the other.** For readers of this site, that means the recorded vote in the House is one act of a longer play — the courtroom is frequently where a law\'s real fate, and the accountability for it, finally lands.`,
    },
  ],
  sources: [
    { label: 'Constitution Act, 1982 — s. 52 (supremacy) and s. 24 (Charter remedies)', url: 'https://laws-lois.justice.gc.ca/eng/const/page-12.html' },
    { label: 'Supreme Court of Canada — Role of the Court and the appeal process', url: 'https://www.scc-csc.ca/court-cour/role-eng.aspx' },
    { label: 'Supreme Court Act (R.S.C., 1985, c. S-26)', url: 'https://laws-lois.justice.gc.ca/eng/acts/s-26/' },
    { label: 'Canada (AG) v Downtown Eastside Sex Workers United, 2012 SCC 45 (public-interest standing)', url: 'https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/9694/index.do' },
    { label: 'Schachter v Canada, [1992] 2 SCR 679 (Charter remedies — reading in / striking down)', url: 'https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/904/index.do' },
    { label: 'Parliament Audit — The notwithstanding clause, in plain English', url: 'https://parliamentaudit.ca/news/notwithstanding-clause-in-plain-english' },
    { label: 'Parliament Audit — The Charter of Rights, section by section', url: 'https://parliamentaudit.ca/news/the-charter-of-rights-and-freedoms-section-by-section-plain-english' },
  ],
};
