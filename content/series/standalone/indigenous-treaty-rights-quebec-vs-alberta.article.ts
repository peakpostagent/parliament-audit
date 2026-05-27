/**
 * Standalone article — comparative history of how Indigenous treaty
 * rights shaped the 1995 Quebec sovereignty referendum vs. how they
 * are shaping the current Alberta independence movement.
 *
 * Operator request 2026-05-26: research how Indigenous nations affected
 * Quebec separation vs. how they have affected Alberta.
 *
 * Editorial floor applied:
 *   - Even-handed on BOTH independence movements (the article does
 *     not take a position on whether Quebec or Alberta should be
 *     independent — it documents what Indigenous nations did/are doing).
 *   - The PQ government in 1995 and the Smith government in 2026 are
 *     held to the same standard: both dismissed Indigenous opposition.
 *     This is documented, not editorialized.
 *   - The Crees of Eeyou Istchee + Nunavik Inuit positions are presented
 *     in their own terms; the Treaty 6/7/8 positions today are presented
 *     in their own terms. Neither set of statements is paraphrased to
 *     fit a partisan frame.
 *   - The legal analysis — Reference re Secession of Quebec (1998),
 *     UNDRIP / UNDRIP Act (2021), James Bay and Northern Quebec
 *     Agreement (1975) — is the load-bearing structure of the piece.
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'indigenous-treaty-rights-quebec-1995-vs-alberta-2026',
  headline:
    'When Quebec Tried to Leave Canada, the Crees Voted First. The Alberta Equivalent Is Already Underway.',
  subheadline:
    'On October 24, 1995 — six days before the main Quebec sovereignty referendum — the James Bay Crees held their own vote. 96.3% chose to remain in Canada. The Inuit of Nunavik did the same, with the same result. Thirty-one years later, Treaty 6, 7, and 8 First Nations in Alberta are doing the parallel work — invoking sacred-covenant treaty rights, filing court injunctions, and raising the matter with King Charles III at Buckingham Palace. Here is how Indigenous treaty rights shaped the 1995 referendum and how they are shaping the 2026 Alberta debate.',
  summary:
    'In the lead-up to the October 30, 1995 Quebec sovereignty referendum, the Grand Council of the Crees of Eeyou Istchee (northern Quebec) and the Inuit of Nunavik (the Arctic-coast region of Quebec) each held their own referendums on whether they would consent to be included in a sovereign Quebec. Both produced overwhelming "No" results — the Crees at 96.3% with 77% turnout, the Inuit at approximately 96%. Grand Chief Matthew Coon Come published the legal paper "Sovereign Injustice" arguing that Indigenous self-determination under international law gave the Crees the right to remain in Canada regardless of the broader Quebec vote. The 1995 sovereignty referendum failed narrowly (No 50.58%, Yes 49.42%); the Supreme Court of Canada\'s 1998 Reference re Secession of Quebec subsequently established that any future provincial secession would require negotiation with multiple stakeholders including Indigenous nations. In 2025-2026, as a citizen petition pushes the Alberta government toward a referendum on provincial independence, the Confederacy of Treaty 6 First Nations, the Blackfoot Confederacy (Treaty 7), and Treaty 8 First Nations of Alberta have all publicly opposed the independence movement on identical legal grounds: treaties signed with the Crown predate the existence of the province of Alberta itself (1905), and the province has no jurisdiction to alter those agreements. Sturgeon Lake Cree Nation has filed for a court injunction to block the referendum question; Treaty 6 chiefs raised the matter with King Charles III at Buckingham Palace in May 2026. The legal architecture is now stronger than it was in 1995 — the UN Declaration on the Rights of Indigenous Peoples Act became federal law in 2021. The political dynamic is the same: a provincial separatist government dismissing treaty-nation opposition. This article walks both cases in detail, the legal precedents that link them, and what an Indigenous-treaty pathway out of a provincial referendum actually looks like.',
  publishedAt: new Date().toISOString(),
  category: 'Accountability',
  tags: ['Indigenous rights', 'treaty rights', 'Quebec referendum 1995', 'Alberta independence', 'James Bay Crees', 'Treaty 6', 'Treaty 8', 'UNDRIP', 'constitutional law'],
  readingTimeMinutes: 8,
  keyTakeaways: [
    'The James Bay Crees held their own referendum on October 24, 1995 — six days before the main Quebec vote — and voted 96.3% to remain in Canada (with 77% turnout).',
    'The Inuit of Nunavik held a parallel referendum with the same result: approximately 96% to remain in Canada.',
    'The Supreme Court\'s 1998 Reference re Secession of Quebec ruled that any future provincial secession would require negotiation with multiple parties including Indigenous nations — a precedent that now governs Alberta\'s situation.',
    'In 2025-2026, all three Alberta treaty regions (Treaty 6, Treaty 7, Treaty 8) have publicly opposed Alberta independence, citing treaty rights that predate the province (1905).',
    'Sturgeon Lake Cree Nation has filed a court injunction to halt the Alberta-independence referendum question; Treaty 6 chiefs raised the issue with King Charles III at Buckingham Palace in May 2026.',
    'UNDRIP (United Nations Declaration on the Rights of Indigenous Peoples) became Canadian federal law in 2021 — significantly strengthening the legal position Indigenous nations could not fully invoke in 1995.',
    'Both the 1995 PQ government and the 2026 Smith government dismissed Indigenous treaty-rights opposition as a political obstacle. The Indigenous nations\' legal position is now substantially stronger than it was in 1995.',
  ],
  smartBrevity: {
    bigThing:
      'In 1995, Indigenous nations in Quebec held their own referendums BEFORE the main Quebec vote. In 2026, Indigenous nations in Alberta are pursuing court injunctions and royal consultations. In both cases the legal argument is the same: treaties with the Crown predate the province, and the province cannot alter treaty obligations by referendum.',
    whyItMatters:
      'A provincial referendum cannot, on its own, alter constitutionally-protected Indigenous treaty rights. The Supreme Court established the negotiation framework in 1998; UNDRIP became federal law in 2021. Any provincial-independence outcome that ignored Indigenous treaty rights would face immediate constitutional challenge and very likely succeed against the province on the merits.',
    goDeeper: [
      'Cree referendum: Oct 24, 1995 — 96.3% No, 77% turnout.',
      'Inuit Nunavik referendum: similar timing, ~96% No.',
      'Main Quebec referendum: Oct 30, 1995 — No 50.58%, Yes 49.42%.',
      'Reference re Secession of Quebec, [1998] 2 SCR 217 — secession requires negotiation with multiple parties including Indigenous nations.',
      'Alberta treaties: Treaty 6 (1876), Treaty 7 (1877), Treaty 8 (1899). Province of Alberta created 1905.',
      'Sturgeon Lake Cree Nation filed for injunction; Treaty 6 chiefs raised concerns with King Charles III at Buckingham Palace (May 2026).',
      'UNDRIP Act became Canadian federal law June 2021.',
    ],
    yesBut:
      'Indigenous treaty rights cannot, in themselves, prevent a provincial referendum from being held — they bind the negotiation that would follow a Yes vote, not the holding of the vote itself. The 1995 Cree referendum was a moral and legal-argument force, not a legal veto over the Quebec referendum. The 2026 Sturgeon Lake injunction is testing whether the legal position has strengthened enough for courts to halt the question itself.',
    bottomLine:
      'Two provincial-independence movements, 31 years apart, both met with organized Indigenous opposition citing treaty rights. The 1995 result: Quebec voted No by a narrow margin, and the Cree position was a documented contributor to the broader political case for staying in Canada. The 2026 result: pending. What is clear is that the legal architecture protecting Indigenous treaty rights has strengthened significantly since 1995, and any provincial secession movement that dismisses Indigenous opposition will face a substantially stronger legal challenge than the PQ faced in 1995.',
  },
  methodology:
    'Cree and Inuit 1995 referendum results are from the Grand Council of the Crees archival statements, the Maclean\'s October 23 1995 "The Other Vote" article, and the Library of Parliament background paper "Aboriginal peoples and the 1995 Quebec referendum" (BP-412E). Main Quebec 1995 referendum results are from Élections Québec official statistics. The Reference re Secession of Quebec analysis is based on the Supreme Court of Canada\'s decision in [1998] 2 SCR 217. Alberta Treaty Nation statements are drawn from press releases of the Confederacy of Treaty No. 6 First Nations, CTV News and CBC News reporting on the King Charles III meeting (May 2026), Alberta Native News reporting on chief statements, and the APTN News coverage of the Treaty 6 January 29 press conference. UNDRIP Act federal-law status is per the United Nations Declaration on the Rights of Indigenous Peoples Act (S.C. 2021, c. 14). We did not contact the Grand Council of the Crees, the Treaty 6/7/8 First Nations, the Government of Alberta, or the Government of Quebec for this article; all citations are from on-record public sources.',
  sections: [
    {
      title: 'The vote before the vote — October 24, 1995',
      body: `Six days before the main Quebec sovereignty referendum, the James Bay Crees of northern Quebec — known by their own name as the Eeyouch of Eeyou Istchee — held their own referendum. The ballot question was specific: "Do you consent, as a people, that the Government of Quebec separate the James Bay Crees and Cree traditional territory from Canada in the event of a Yes vote in the Quebec referendum?"\n\nThe result: **96.3 percent voted No.** Turnout was 77 percent — comparable to the most-engaged provincial general elections.\n\nThe Crees\' position was not symbolic. In the months before the main referendum, Grand Chief Matthew Coon Come had published a 500-page legal paper titled "Sovereign Injustice," prepared in consultation with international law experts. The paper argued that under international law (specifically the emerging principles that would later become the UN Declaration on the Rights of Indigenous Peoples, adopted in 2007), the Crees were a self-determining people with the right to choose their own political status — independent of the broader Quebec population\'s decision.\n\nThe argument was that if Quebec could invoke self-determination to secede from Canada, the Crees could invoke the same principle to remain in Canada with their territory. The James Bay and Northern Quebec Agreement of 1975 — Canada\'s first modern comprehensive land-claims agreement — had established Cree governance over a territory roughly the size of France. The Crees argued that territory could not be transferred to a sovereign Quebec without Cree consent.`,
    },
    {
      title: 'The Nunavik vote and the broader Indigenous position',
      body: `The Inuit of Nunavik — the Arctic-coast region of Quebec, governed under the same 1975 James Bay Agreement framework — held a parallel referendum. The result was effectively identical: **approximately 96 percent voted No.**\n\nThe Innu Nation (then known as the Montagnais), the Atikamekw Nation, the Mohawks of Kahnawake, and the Mi\'kmaq each issued their own statements opposing inclusion in a sovereign Quebec. None of the eleven First Nations recognized by the Quebec government endorsed the sovereignty option.\n\nThe Yes side\'s position was that Indigenous nations would retain "the same rights and protections" in a sovereign Quebec that they had under Canada. Premier Jacques Parizeau\'s government dismissed the Cree referendum as a "non-binding consultation" and rejected the legal argument in "Sovereign Injustice."\n\nThe federal government\'s position was more sympathetic to the Indigenous argument but also non-committal. The Chrétien government — which had its own political reasons to keep Quebec in Canada — did not commit, before the referendum, to recognize an Indigenous opt-out. The federal "Plan B" strategy treated Indigenous opposition as a moral and political resource rather than a legal veto.`,
    },
    {
      title: 'The main referendum and what came after',
      body: `On October 30, 1995, the main Quebec sovereignty referendum produced a result that has shaped Canadian federalism ever since: **No 50.58 percent, Yes 49.42 percent** — a margin of 54,288 votes out of approximately 4.7 million cast.\n\nThe Cree and Inuit referendum results were therefore moot as a matter of immediate consequence. Quebec did not secede; no Indigenous opt-out was triggered. But the Cree position had been documented on the public record, and the legal arguments in "Sovereign Injustice" had been advanced.\n\nThree years later, in 1998, the Government of Canada referred a set of questions to the Supreme Court of Canada about the legal status of any future provincial secession. The Court\'s answer — *Reference re Secession of Quebec*, [1998] 2 SCR 217 — is now the binding constitutional framework for any provincial-secession question, including Alberta\'s.\n\nThe Court ruled that:\n- Unilateral secession (a province declaring independence without negotiation) would be illegal under Canadian and international law.\n- A clear majority of voters in a province on a clear question would impose a constitutional duty on the rest of Canada — and specifically on the federal government and other provinces — to negotiate in good faith.\n- That negotiation would have to address multiple stakeholders, **explicitly including Indigenous nations whose treaty rights would be affected**.\n\nThe Reference is the legal architecture under which any 2026 Alberta vote would operate. It is the document the Treaty 6, 7, and 8 chiefs are now invoking.`,
    },
    {
      title: 'The Alberta parallel — Treaty 6, 7, and 8 in 2026',
      body: `In 2025, a citizen petition in Alberta surpassed the threshold required to trigger a provincial referendum on Alberta independence (~302,000 signatures against a 178,000 threshold, per the article we published April 22, 2026 on the Alberta vs. Quebec referendums comparison). Premier Danielle Smith\'s government has indicated it will respond to the petition through the Citizen Initiatives Act process. The question of whether a referendum proceeds, and on what wording, is currently before the Alberta legislature.\n\nAll three of Alberta\'s treaty regions have publicly opposed the independence movement on identical legal grounds. The Confederacy of Treaty No. 6 First Nations, the Blackfoot Confederacy (Treaty 7), and Treaty 8 First Nations of Alberta have each issued formal statements.\n\nThe argument is direct and constitutionally precise. The treaties were signed between First Nations and the Crown (originally the British Crown, then the Crown in Right of Canada). They predate the existence of the province of Alberta:\n- **Treaty 6** was signed in 1876.\n- **Treaty 7** was signed in 1877.\n- **Treaty 8** was signed in 1899.\n- **The Province of Alberta** was created in 1905.\n\nGrand Chief Trevor Mercredi of Treaty 8, at a January 29, 2026 press conference in Edmonton, put the legal-property metaphor plainly: "[Alberta] is a tenant on this land, not the landlord. Any talk of separation or so-called provincial sovereignty is not just political theatre; it\'s also a proposal to break Treaty. Alberta does not have the authority to ask that question, let alone act on any answer."\n\nThe Confederacy of Treaty No. 6 statement, in a joint declaration with Treaty 8 and the Blackfoot Confederacy: "Our Treaties are sacred covenants and are to last forever. The province has no right to supersede or interfere with our Treaties, even indirectly by passing the buck to a \'citizen\' referendum."`,
    },
    {
      title: 'The Sturgeon Lake injunction',
      body: `In May 2026, Chief Sheldon Sunshine of Sturgeon Lake Cree Nation — a Treaty 8 community in northern Alberta — filed for a court injunction seeking to halt the holding of the provincial-independence referendum itself. The legal argument: that putting a question on the ballot which, if approved, would breach existing treaty obligations is itself an act of constitutional bad faith and an interference with constitutionally-protected Indigenous rights.\n\nThe Sturgeon Lake action is supported by the Confederacy of Treaty No. 6 First Nations, the Tsuut\'ina Nation, the Blackfoot Confederacy, and Treaty 8 First Nations of Alberta. Combined, that is essentially every Indigenous nation on Treaty land within Alberta\'s borders.\n\nThe legal theory tests whether *Reference re Secession of Quebec* applies to questions of how a referendum is conducted, or only to what happens after a referendum produces a Yes vote. The 1998 Reference clearly establishes that a Yes vote triggers a duty to negotiate with Indigenous nations. The Sturgeon Lake argument extends that: if any post-Yes-vote outcome that ignored treaty rights would be unconstitutional, then asking the question in a form that doesn\'t recognize that constitutional reality is itself defective.\n\nThis is novel constitutional ground. The Federal Court has not previously ruled on a pre-emptive injunction against a provincial referendum question on Indigenous-rights grounds. A ruling in the Sturgeon Lake matter would itself be a precedent that all future provincial-independence movements in Canada would have to navigate.`,
    },
    {
      title: 'King Charles III and the constitutional-monarchy dimension',
      body: `In May 2026, a delegation of Alberta Treaty 6 chiefs travelled to Buckingham Palace and met with King Charles III for nearly an hour. The discussion, according to public statements from the Treaty 6 delegation, included direct conversation about the Alberta independence movement and the chiefs\' position that the Crown\'s historic treaty obligations cannot be transferred to a province or abrogated by a provincial vote.\n\nWhy go to the King? Because the treaties were signed with the Crown — not with the federal Government of Canada, and certainly not with the province of Alberta. The Treaty 6 chiefs\' argument is that as the modern embodiment of the Crown that signed Treaty 6 in 1876, King Charles III has a personal honour-of-the-Crown duty to ensure those treaty commitments are upheld.\n\nThe King is, by constitutional convention, politically neutral. He cannot intervene in Canadian provincial politics. But the act of bringing the matter to his attention is itself diplomatically significant — it ensures that any provincial-secession outcome that breached Crown treaty obligations would be politically visible at the highest level of the British constitutional system, not just at the federal Canadian level.\n\nThis avenue did not exist in any meaningful form in 1995. Queen Elizabeth II\'s engagement with Indigenous-Crown issues was constrained by her tighter constitutional role and by the political conventions of the time. The Treaty 6 visit to Charles III in May 2026 reflects a more direct Crown-Indigenous-relations diplomacy that has emerged since the 2015 Truth and Reconciliation Commission report and the 2021 UNDRIP Act.`,
    },
    {
      title: 'What changed between 1995 and 2026',
      body: `The Indigenous legal position has strengthened materially since the Cree referendum. Four developments matter:\n\n1. **Reference re Secession of Quebec (1998).** The Supreme Court established that Indigenous nations are constitutionally-required parties to any secession negotiation. The Crees in 1995 had to argue self-determination under emerging international law. Treaty 6, 7, and 8 in 2026 can simply point to a binding Supreme Court precedent.\n\n2. **UNDRIP (2007 declaration, 2010 Canadian endorsement, 2021 federal Act).** The UN Declaration on the Rights of Indigenous Peoples was adopted by the General Assembly in 2007. Canada formally endorsed it in 2010. In June 2021, Parliament passed the UNDRIP Act (S.C. 2021, c. 14), making the Declaration\'s principles a domestic-law touchstone for federal legislation. Article 3 of UNDRIP affirms the right of Indigenous peoples to self-determination. Article 4 affirms the right to autonomy in matters of internal affairs. Article 26 affirms the right to lands traditionally owned. These are now Canadian-law principles, not just international aspirations.\n\n3. **Treaty-implementation jurisprudence.** Since 1995, the Supreme Court has issued a series of landmark decisions (*Delgamuukw* 1997, *Haida Nation* 2004, *Tsilhqot\'in* 2014, *Mikisew Cree* 2018) that have strengthened the constitutional protection of Indigenous treaty and Aboriginal rights. The "honour of the Crown" doctrine — the requirement that the Crown act with good faith and integrity in Indigenous matters — is now a load-bearing element of Canadian constitutional law. A 2026 Alberta-independence referendum that ignored treaty rights would face this entire body of jurisprudence; the 1995 referendum did not.\n\n4. **The 2015 Truth and Reconciliation Commission report and its 94 Calls to Action.** The TRC report has reshaped Canadian public discourse around Indigenous-Crown relations. Provincial governments — including Alberta\'s — operate in a political environment where dismissing Indigenous opposition has higher political cost than it did in 1995.\n\nThe political dynamic between the 1995 PQ government and the 2026 Smith government is, on the record, broadly the same: both have characterized treaty-nation opposition as a political obstacle rather than a constitutional question to be addressed first. The legal position the treaty nations are bringing to that political dynamic is, however, substantially stronger.`,
    },
    {
      title: 'What an Indigenous-treaty pathway actually means in practice',
      body: `Three concrete consequences flow from the Indigenous-treaty position, if it is taken at full constitutional weight:\n\n1. **Territorial carve-out is a real option.** If Alberta voted Yes on a clear referendum question and the federal government entered negotiation under the 1998 Reference framework, treaty nations could insist on remaining in Canada with their treaty territories intact. In the Quebec case, the 1995 Cree referendum was the documented expression of this position. A 2026 Alberta-independence outcome could include some combination of: federal-Canadian carve-outs for treaty lands within Alberta\'s current borders, a renegotiated treaty framework between an independent Alberta and the Treaty 6/7/8 nations, or both.\n\n2. **Resource jurisdiction is at stake.** Treaty 6, 7, and 8 cover essentially the entire area of present-day Alberta. Oil sands operations in northern Alberta are on Treaty 8 land. Conventional oil and gas operations are on Treaty 7 and Treaty 6 land. An independent Alberta\'s claim to natural-resource jurisdiction over its current territory would be directly contested by the Treaty nations from the moment a Yes vote was certified.\n\n3. **International recognition of an independent Alberta would face a complication that Quebec also would have faced.** Foreign states recognizing an independent Alberta would have to address the Indigenous opposition. The 1995 federal government\'s communications strategy in foreign capitals had emphasized the Cree position; a 2026 federal government in the same situation would have UNDRIP, Reference re Secession, and the explicit Treaty 6/7/8 opposition to deploy.\n\nNone of this means Alberta could not secede. It means secession could not be done over Indigenous-treaty objections — only with them as a negotiating party. This is the same conclusion the legal record produced for Quebec in the 1995-1998 period, but with substantially more legal weight behind it in 2026.`,
    },
    {
      title: 'What the article does not claim',
      body: `Three honest disclaimers.\n\nFirst, this article takes no position on whether Quebec should be independent, or whether Alberta should be independent. Both movements have legitimate political constituencies and grievances. The article documents what Indigenous nations did in 1995 and are doing in 2026 — not whether the broader independence movements themselves are wise or unwise.\n\nSecond, Indigenous treaty rights do not, on their own, halt a provincial referendum from being held. They constrain the negotiation that would follow a Yes vote. The 1995 Cree referendum was an exercise of self-determination, not a legal veto over Quebec\'s. The 2026 Sturgeon Lake injunction is testing whether the legal position has strengthened enough for courts to halt the question itself — and the result is currently pending.\n\nThird, the Indigenous nations in Alberta are not monolithic on every political question, just as the Indigenous nations in Quebec were not. What the historical and current record shows is that on the specific question of provincial secession from Canada and the implications for treaty rights, organized Indigenous opposition has been consistent in both cases.\n\nWhat Parliament Audit publishes here is the record. The reader weighs what it means.`,
    },
  ],
  sources: [
    {
      label: 'Library of Parliament — Aboriginal peoples and the 1995 Quebec referendum (BP-412E)',
      url: 'https://publications.gc.ca/Collection-R/LoPBdP/BP/bp412-e.htm',
    },
    {
      label: '1995 Quebec referendum — Wikipedia (cross-referenced with Élections Québec)',
      url: 'https://en.wikipedia.org/wiki/1995_Quebec_referendum',
    },
    {
      label: 'Maclean\'s — "The Other Vote" (October 23, 1995, on the Cree referendum)',
      url: 'https://archive.macleans.ca/article/1995/10/23/the-other-vote',
    },
    {
      label: 'Élections Québec — 1995 referendum results',
      url: 'https://www.electionsquebec.qc.ca/en/results-and-statistics/1995-referendum-on-quebecs-accession-to-sovereignty/',
    },
    {
      label: 'Reference re Secession of Quebec, [1998] 2 SCR 217',
      url: 'https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/1643/index.do',
    },
    {
      label: 'Grand Council of the Crees — "Never Without Consent" (publication on the 1995 Cree position)',
      url: 'https://ecwpress.com/products/never-without-consent',
    },
    {
      label: 'James Bay and Northern Quebec Agreement — Canadian Encyclopedia',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/james-bay-and-northern-quebec-agreement',
    },
    {
      label: 'CBC News — First Nations leaders push back on Alberta\'s planned independence vote',
      url: 'https://www.cbc.ca/news/canada/saskatchewan/sask-treaty-six-alberta-referendum-9.7209304',
    },
    {
      label: 'APTN News — Treaty 6 chiefs press Alberta premier to back down on separatist rhetoric',
      url: 'https://www.aptnnews.ca/national-news/treaty-6-chiefs-to-press-alberta-premier-to-back-down-on-separatist-rhetoric/',
    },
    {
      label: 'CTV News — Treaty 6 chiefs raise Alberta separation concerns with King Charles',
      url: 'https://www.ctvnews.ca/canada/royal-family/article/treaty-6-chiefs-raise-alberta-separation-concerns-with-king-charles/',
    },
    {
      label: 'Alberta Native News — Sturgeon Lake and Mikisew chiefs cease-and-desist',
      url: 'https://www.albertanativenews.com/sturgeon-lake-and-mikisew-chiefs-tell-premier-to-cease-and-desist-separatist-threats/',
    },
    {
      label: 'Confederacy of Treaty No. 6 First Nations — Press releases',
      url: 'https://www.treatysix.org/news',
    },
    {
      label: 'United Nations Declaration on the Rights of Indigenous Peoples Act (S.C. 2021, c. 14)',
      url: 'https://laws-lois.justice.gc.ca/eng/acts/U-2.2/',
    },
    {
      label: 'Treaty 6 (1876) — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Treaty_6',
    },
    {
      label: 'Parliament Audit — Alberta citizen petition vs. Quebec referendums comparison (April 22, 2026)',
      url: 'https://parliamentaudit.ca/news/alberta-citizen-petition-quebec-referendums-compared',
    },
  ],
};
