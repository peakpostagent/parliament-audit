/**
 * Standalone article — documented cases of designated/convicted
 * terrorists (and, in the Khadr case, their family members) who
 * obtained Canadian entry, residency, or citizenship.
 *
 * Operator request 2026-05-26 (Topic 2). Operator authorized naming
 * individuals "who clear the bar" and asked for a robust sources block.
 *
 * EDITORIAL FLOOR — this is the highest-defamation-risk piece in the
 * series. The bar applied to every named individual:
 *   - On the Public Safety Listed Entities roster (Criminal Code
 *     s.83.05), OR
 *   - On the UN Security Council 1267/1989 sanctions list, OR
 *   - On the US State Dept FTO list / OFAC SDN with a terrorism
 *     designator, OR
 *   - Convicted of a terrorism offence in Canada or a peer democracy.
 *
 * Individuals who were ACCUSED but not convicted, or who were subject
 * to security certificates that were later quashed, are NOT named as
 * terrorists. Where a family member's legal outcome differs from the
 * principal's (e.g. extradition refused, conviction contested), the
 * article states the actual outcome and does not assert guilt.
 *
 * Cases used (all clear the bar):
 *   1. Mahmoud Mohammad Issa Mohammad — convicted (Greece, 1970) for
 *      the 1968 PFLP El Al attack that killed Leon Shirdan; obtained
 *      Canadian residency 1987 by concealment; removed 2013.
 *   2. Ahmed Said Khadr — UN 1267-listed al-Qaeda financier (listed
 *      1999); Canadian citizen; the family-members dimension the
 *      operator asked about, with each member's actual legal outcome
 *      stated precisely.
 *   3. IRGC-affiliated senior Iranian officials — IRGC designated a
 *      terrorist entity by Canada June 2024; CBSA inadmissibility
 *      proceedings against ~28 individuals; aggregate numbers cited
 *      (individuals not publicly named by government, so not named here).
 */
import type { NewsArticle } from '../../../apps/web/src/content/news-articles.js';

export const article: NewsArticle = {
  slug: 'designated-terrorists-granted-canadian-entry-documented-cases',
  headline:
    'Designated Terrorists Have Obtained Canadian Entry, Residency, and Citizenship. Here Are the Documented Cases.',
  subheadline:
    'A convicted Popular Front for the Liberation of Palestine member who killed an Israeli engineer in 1968 was granted Canadian residency in 1987 and fought deportation for 26 years. A UN-listed al-Qaeda financier became a Canadian citizen and raised his family in Toronto. As of early 2026, the Canada Border Services Agency has identified roughly 28 senior Iranian officials inadmissible for ties to the Islamic Revolutionary Guard Corps — now a listed terrorist entity — and has removed exactly one. This article documents only substantiated cases, every one tied to an official designation or a criminal conviction.',
  summary:
    'This article catalogues documented cases in which individuals tied to terrorism — by criminal conviction, by United Nations Security Council sanctions listing, or by the Government of Canada\'s own terrorist-entity designations — obtained Canadian entry, residency, or citizenship. The standard applied is deliberately strict: every named individual is either convicted of a terrorism-related offence in Canada or a peer democracy, or appears on an official terrorist list (Public Safety Canada Listed Entities, UN 1267/1989 sanctions, or the equivalent). Individuals who were accused but not convicted, or whose security certificates were later quashed by the courts, are not named as terrorists. The three principal documented cases are: (1) Mahmoud Mohammad Issa Mohammad, convicted in Greece for the 1968 PFLP attack on an El Al aircraft that killed maritime engineer Leon Shirdan, who obtained Canadian residency in 1987 by concealing his record and was finally deported in 2013 after a 26-year legal battle; (2) Ahmed Said Khadr, added to the UN 1267 al-Qaeda sanctions list in 1999 as a senior al-Qaeda financier, who held Canadian citizenship and whose family resided in Toronto — the family-members dimension is documented in detail, with each member\'s actual legal outcome stated precisely; and (3) the roughly 28 senior Iranian officials the Canada Border Services Agency has identified as inadmissible to Canada for ties to the Islamic Revolutionary Guard Corps, which the Government of Canada designated a terrorist entity in June 2024 — of whom only one has been removed as of early 2026. The article documents the cases, the screening failures that allowed them, the immigration-law provisions that govern inadmissibility, and the honest caveats around each.',
  publishedAt: new Date().toISOString(),
  category: 'Accountability',
  tags: ['national security', 'immigration', 'terrorism', 'CBSA', 'IRGC', 'visa screening', 'inadmissibility', 'public safety'],
  readingTimeMinutes: 9,
  keyTakeaways: [
    'Mahmoud Mohammad Issa Mohammad — convicted in Greece for the 1968 PFLP El Al attack that killed Leon Shirdan — obtained Canadian residency in 1987 by concealing his record and fought deportation for 26 years before removal in 2013.',
    'Ahmed Said Khadr was added to the UN 1267 al-Qaeda sanctions list in 1999 as a senior al-Qaeda financier; he held Canadian citizenship and his family lived in Toronto.',
    'As of early 2026, the CBSA has identified roughly 28 senior Iranian officials as inadmissible for ties to the IRGC (a Canadian-listed terrorist entity since June 2024) — and has removed exactly one.',
    'Five of those IRGC-linked individuals were found admissible by the Immigration and Refugee Board; the CBSA has appealed four of those decisions.',
    'Every individual named in this article clears a strict bar: a terrorism conviction in a peer democracy, or an official terrorist-list designation (UN, Public Safety Canada, or equivalent).',
    'Individuals who were accused but not convicted — including security-certificate detainees whose certificates were later quashed — are deliberately NOT named as terrorists in this article.',
  ],
  smartBrevity: {
    bigThing:
      'Across multiple decades and governments, individuals tied to terrorism by criminal conviction or official designation have obtained Canadian entry, residency, or citizenship. The cases are documented in court records, UN sanctions lists, and the Government of Canada\'s own enforcement statistics.',
    whyItMatters:
      'Canada\'s immigration security screening is supposed to identify and exclude individuals inadmissible under sections 34 and 35 of the Immigration and Refugee Protection Act — those tied to terrorism, espionage, or human-rights violations. The documented cases show the screening has failed at the entry stage and that removal, once an individual is in Canada, can take decades or never happen at all.',
    goDeeper: [
      'Mahmoud Mohammad Issa Mohammad: PFLP, convicted Greece 1970, Canadian residency 1987, removed 2013 (26-year battle).',
      'Ahmed Said Khadr: UN 1267-listed 1999, al-Qaeda financier, Canadian citizen, family in Toronto.',
      'IRGC officials: ~28 identified inadmissible by CBSA, 1 removed as of early 2026.',
      '5 IRGC-linked individuals found admissible by IRB; 4 decisions appealed by CBSA.',
      'Governing law: IRPA s.34 (security inadmissibility), s.35 (human-rights violations).',
      'IRGC listed as a terrorist entity by Canada: June 2024.',
    ],
    yesBut:
      'Several honest qualifiers apply. Removal is legally difficult: Canada cannot deport someone to a country where they face torture (the Suresh principle), which is why some inadmissible individuals remain. The IRGC cases are complicated by Iran\'s mandatory military service — the IRB must weigh whether an individual\'s IRGC connection was coerced conscription versus voluntary senior membership. And being subject to a CBSA inadmissibility proceeding is not the same as a conviction. These are real complexities, not excuses, and the article addresses each.',
    bottomLine:
      'The documented record establishes that designated and convicted terrorists have obtained Canadian entry across multiple eras, and that Canada\'s ability to remove them once admitted is limited and slow. The screening-and-removal system has documented failure points at both ends. Whether the current rules — and the current pace of IRGC-related enforcement — are adequate is a legitimate question for Parliament and the public, on the documented facts.',
  },
  methodology:
    'Every individual named in this article meets a strict inclusion standard: a terrorism-related criminal conviction in Canada or a peer democracy, OR appearance on an official terrorist-designation list (the UN Security Council 1267/1989 ISIL & Al-Qaida Sanctions List, Public Safety Canada\'s Listed Entities under Criminal Code s.83.05, or an equivalent). The Mahmoud Mohammad Issa Mohammad case is documented in Federal Court of Canada immigration records, the 1988 immigration adjudication, and extensive CBC, CTV, and Globe and Mail reporting across the 26-year proceedings. The Ahmed Said Khadr case is documented in the UN 1267 sanctions-list records (listed 1999, delisted posthumously 2010), the Supreme Court of Canada\'s decisions in the Khadr litigation, and the PBS Frontline "Son of al-Qaeda" documentation. Where a Khadr family member\'s legal outcome differs from Ahmed Khadr\'s, the article states the actual outcome (Omar Khadr\'s contested 2010 Guantanamo military-commission guilty plea and the subsequent 2017 Government of Canada Charter settlement; Abdullah Khadr\'s 2010 Canadian court refusal of US extradition on abuse-of-process grounds). The IRGC figures are from the Government of Canada\'s June 2024 IRGC terrorist-listing announcement, CBSA enforcement statistics, and CBC and Globe and Mail reporting on the inadmissibility proceedings, current to early 2026. We did not contact the CBSA, the IRB, Public Safety Canada, or any named individual or their representatives for this article; the data is from on-record public sources cited at the foot. Individuals who were accused but not convicted, or whose security certificates were quashed, are deliberately excluded from the "terrorist" characterization.',
  sections: [
    {
      title: 'The standard this article applies',
      body: `Calling someone a terrorist is a serious accusation with serious legal consequences. This article applies a deliberately strict standard. An individual is named only if at least one of the following is true:\n\n1. They have been **convicted** of a terrorism-related offence in Canada or a peer democracy (a court of law, due process, a verdict).\n2. They appear on the **United Nations Security Council 1267/1989 sanctions list** (the ISIL and Al-Qaida Sanctions List) or an equivalent UN listing.\n3. They appear on **Public Safety Canada\'s Listed Entities** roster under section 83.05 of the Criminal Code, or are a senior official of an entity on that roster.\n4. They appear on the **U.S. State Department Foreign Terrorist Organizations list** or the **OFAC Specially Designated Nationals list** with a terrorism designator.\n\nThis standard deliberately EXCLUDES a category of people who are sometimes loosely described as terrorists in public debate: individuals who were accused but never convicted, and individuals who were subject to immigration "security certificates" that were later quashed by the courts. Several men detained under Canadian security certificates in the 2000s — whose cases were high-profile — had their certificates set aside by the Federal Court and were never convicted of any terrorism offence. They are not named here, because an allegation is not a conviction and a quashed certificate is not a designation.\n\nThe cases that follow all clear the bar above. They are documented, adjudicated, and on the public record.`,
    },
    {
      title: 'Case 1 — Mahmoud Mohammad Issa Mohammad (PFLP, convicted 1970)',
      body: `**The crime.** On December 26, 1968, Mahmoud Mohammad Issa Mohammad — then a member of the Popular Front for the Liberation of Palestine (PFLP) — and another man attacked an El Al commercial aircraft at Athens airport. They threw grenades and fired a machine gun at the plane. The attack killed **Leon Shirdan, a 50-year-old Israeli maritime engineer.** Mohammad was captured, tried in Greece, and in 1970 convicted of manslaughter and related charges, receiving a 17-year sentence.\n\n**The release.** Mohammad served only a few months. Another PFLP cell hijacked a Greek aircraft and threatened to kill the passengers unless Greece released Mohammad. Greece complied and pardoned him. He then lived in various parts of the Middle East, including Lebanon, where he married in 1976.\n\n**The Canadian entry.** In 1987, Mohammad applied for and obtained residency in Canada. On his application he **concealed both his PFLP membership and his criminal conviction.** Canadian immigration authorities discovered the concealment, and on December 15, 1988, an immigration adjudicator ruled he should be expelled.\n\n**The 26-year battle.** Before he could be deported, Mohammad filed a refugee claim. Through a sequence of appeals, judicial reviews, and procedural manoeuvres that lasted more than two and a half decades, he avoided removal. He was finally deported to Lebanon in **2013** — 25 years after the original expulsion order. He died of cancer in Lebanon in 2015.\n\n**Why it clears the bar:** criminal conviction (Greece, 1970) for a terrorist attack that killed a civilian, plus documented Canadian residency obtained by concealment. This is the textbook case: a convicted terrorist obtained Canadian residency, and the Canadian system took 26 years to remove him even after the concealment was discovered.`,
    },
    {
      title: 'Case 2 — Ahmed Said Khadr (UN-listed al-Qaeda financier) and the family-members question',
      body: `**The principal.** Ahmed Said Khadr was an Egyptian-born man who immigrated to Canada in 1975 (first Montreal, then Toronto) and became a Canadian citizen. In 1999, the United Kingdom added Khadr\'s name to the United Nations 1267 sanctions list — the UN\'s al-Qaeda designation list — identifying him as a senior associate and financier of al-Qaeda. Canada and the United States both accused him of financing al-Qaeda operations in Afghanistan and Pakistan. He was killed in a firefight with Pakistani forces in October 2003. He was formally delisted from the UN 1267 list in 2010 — seven years after his death.\n\n**Why the principal clears the bar:** UN 1267 sanctions-list designation (1999) as an al-Qaeda financier, combined with documented Canadian citizenship. Unambiguous.\n\n**The family-members question — handled precisely.** The operator asked specifically about family members of designated terrorists residing in Canada. The Khadr family is the most-documented such case in Canadian history. But the legal outcomes for individual family members DIFFER, and accuracy requires stating each precisely rather than tarring the family collectively:\n\n- **Ahmed Khadr (father):** UN-listed al-Qaeda financier. Cleared the bar. Deceased 2003.\n- **Omar Khadr (son):** Captured by U.S. forces in Afghanistan in 2002 at age 15, detained at Guantanamo Bay. In 2010 he pleaded guilty before a U.S. military commission to charges including the killing of U.S. Army medic Christopher Speer. He later recanted, stating the plea was made under duress to escape Guantanamo. In 2017 the Government of Canada settled a lawsuit with Omar Khadr for CAD $10.5 million — that settlement was for the Canadian government\'s own violation of HIS Charter rights (Canadian officials interrogated him at Guantanamo), a matter the Supreme Court of Canada had already ruled on. His guilt on the underlying charge remains legally contested. Accuracy requires noting all of this, not just the guilty plea.\n- **Abdullah Khadr (son):** The United States sought his extradition from Canada on allegations of procuring weapons for al-Qaeda. In 2010, a Canadian court REFUSED the extradition and stayed the proceedings, finding that Abdullah had been detained and mistreated in Pakistan in a manner that constituted an abuse of process. He was therefore NOT extradited and NOT convicted. The allegation is documented; the legal outcome was a refusal to extradite.\n- **Abdurahman Khadr (son):** Described himself publicly as having cooperated with the CIA. Never charged with a terrorism offence.\n\nThe honest summary: the FATHER was a UN-listed terrorist who held Canadian citizenship and raised his family in Toronto. The legal status of the individual family members varies and the article states each accurately. What is documented and not in dispute is that a UN-listed al-Qaeda financier was a Canadian citizen whose family resided in Canada.`,
    },
    {
      title: 'Case 3 — the IRGC officials (current, ongoing)',
      body: `**The designation.** On June 19, 2024, the Government of Canada formally listed the Islamic Revolutionary Guard Corps (IRGC) — the Iranian regime\'s elite military and intelligence force — as a terrorist entity under section 83.05 of the Criminal Code. This followed a 2022 determination that the Islamic Republic of Iran is a regime that has engaged in terrorism and gross human-rights violations, which under the Immigration and Refugee Protection Act rendered thousands of senior Iranian officials inadmissible to Canada.\n\n**The enforcement record.** As of early 2026, the Canada Border Services Agency (CBSA) has been working through inadmissibility proceedings against individuals identified as senior Iranian officials with IRGC ties. The documented numbers:\n- Approximately **28 individuals** identified by the CBSA as inadmissible for IRGC/regime ties.\n- **One** individual actually removed from Canada as of early 2026.\n- **Two** others issued deportation orders.\n- **Five** individuals found ADMISSIBLE by the Immigration and Refugee Board (IRB); the CBSA has appealed four of those decisions.\n- **Four** cases dropped by the CBSA (for various reasons, including individuals voluntarily leaving the country).\n\n**Why this clears the bar:** the IRGC is a Public-Safety-Canada-listed terrorist entity, and these are documented government inadmissibility proceedings tied to that designation. Note: the individuals are NOT named in this article, because the Government of Canada has not, in most cases, publicly named them — the proceedings reference "senior Iranian officials" in aggregate. We cite the aggregate enforcement statistics, which are themselves the story: 28 identified, one removed.\n\n**The honest complication.** Iran has mandatory military service. A material question in the IRB proceedings is whether an individual\'s IRGC connection reflects coerced conscription (a teenager required to serve) versus voluntary senior membership (a commander or intelligence officer who chose the role and rose through it). The five "admissible" findings by the IRB largely turn on this distinction. The CBSA\'s appeals of four of those findings reflect a disagreement about where the line falls. This is a genuine legal complexity, and the article notes it rather than pretending all 28 are equivalent.`,
    },
    {
      title: 'The law that governs inadmissibility',
      body: `Two sections of the Immigration and Refugee Protection Act (IRPA) govern the inadmissibility of individuals tied to terrorism and human-rights violations:\n\n**Section 34 — Security.** Renders a foreign national or permanent resident inadmissible for: engaging in espionage or subversion against a democratic government; engaging in or instigating terrorism; being a danger to the security of Canada; or being a member of an organization that engages in those acts. The "membership" provision is broad — it does not require proof that the individual personally committed a terrorist act, only that they were a member of an organization that does.\n\n**Section 35 — Human or international rights violations.** Renders inadmissible those who have committed war crimes, crimes against humanity, or who were senior officials of a government engaged in terrorism, systematic human-rights violations, genocide, war crimes, or crimes against humanity. This is the provision under which the senior Iranian officials are inadmissible.\n\nThe screening is supposed to happen at the visa-application and entry stages, administered by Immigration, Refugees and Citizenship Canada (IRCC) with security input from CSIS and the CBSA. The documented cases show two distinct failure modes:\n\n1. **Entry-stage failure** — the individual is admitted because the concealment (Mohammad) or the intelligence gap (Khadr in 1975, before his al-Qaeda involvement was known) was not caught at the visa stage.\n2. **Removal-stage failure** — the individual is identified as inadmissible AFTER entry, but cannot be efficiently removed due to refugee claims, appeals, the prohibition on deportation to torture, or the slow pace of inadmissibility proceedings (the IRGC cases).`,
    },
    {
      title: 'Why removal is so slow — the honest constraints',
      body: `It would be misleading to present the slow removal pace as pure government negligence. There are genuine legal constraints, and an honest accounting names them:\n\n**The Suresh principle.** In *Suresh v Canada* (2002), the Supreme Court of Canada held that Canada cannot, except in exceptional circumstances, deport a person to a country where they face a substantial risk of torture. Many inadmissible individuals come from countries where they would face torture or death on return. This is the single largest legal constraint on removal — and it is a constraint rooted in Canada\'s Charter and its international human-rights obligations, not in government inaction.\n\n**Refugee-claim layering.** An inadmissible individual can file a refugee claim, which triggers a separate adjudication process with its own appeals. Mohammad used this to delay removal for decades.\n\n**The membership-versus-act distinction.** IRPA s.34 makes mere membership in a terrorist organization grounds for inadmissibility, but the IRB and courts apply nuance — particularly for conscripts, low-level members, and those who joined before an organization became violent. The IRGC cases turn heavily on this.\n\n**Evidentiary difficulty.** Proving terrorism ties to the standard required for removal often depends on intelligence that cannot be disclosed in open court without compromising sources. The security-certificate regime was Canada\'s attempt to handle this, and the Supreme Court found significant parts of it unconstitutional (*Charkaoui v Canada*, 2007), forcing a redesign.\n\nThese constraints are real. They also do not fully explain a record of 28 IRGC-linked officials identified and one removed. The gap between the constraints and the outcomes is the legitimate subject of public and parliamentary scrutiny.`,
    },
    {
      title: 'What this article does not claim',
      body: `Several disclaimers, in the interest of accuracy.\n\nThis article does NOT claim that immigration to Canada is generally a security threat, or that any particular community is associated with terrorism. The documented cases span different decades, organizations, and origins; they are individual cases adjudicated on individual facts.\n\nThis article does NOT name individuals who were accused but not convicted, or whose security certificates were quashed. The men detained under security certificates in the 2000s whose certificates were later set aside are not named as terrorists, because they were not convicted and their certificates did not survive judicial scrutiny.\n\nThis article does NOT assert that the family members of Ahmed Khadr are collectively terrorists. It states the documented legal outcome for each — including the ones where extradition was refused and guilt remains contested.\n\nThis article does NOT claim the slow IRGC-removal pace is purely political. It documents the genuine legal constraints (the Suresh principle, the conscription distinction) alongside the enforcement numbers.\n\nWhat the article DOES establish, on the documented record: designated and convicted terrorists have obtained Canadian entry, residency, and citizenship across multiple eras; the screening system has documented failure points at both the entry and removal stages; and Canada\'s current pace of IRGC-related enforcement — 28 identified, one removed — is a legitimate subject for scrutiny.\n\nParliament Audit publishes the documented cases and the legal framework. The policy conclusions are the reader\'s.`,
    },
  ],
  sources: [
    {
      label: 'Public Safety Canada — Currently Listed Terrorist Entities (Criminal Code s.83.05)',
      url: 'https://www.publicsafety.gc.ca/cnt/ntnl-scrt/cntr-trrrsm/lstd-ntts/crrnt-lstd-ntts-en.aspx',
    },
    {
      label: 'UN Security Council — ISIL (Da\'esh) & Al-Qaida Sanctions List (1267/1989)',
      url: 'https://www.un.org/securitycouncil/sanctions/1267/aq_sanctions_list',
    },
    {
      label: 'Mahmoud Mohammad Issa Mohammad — Wikipedia (cross-referenced with Federal Court records)',
      url: 'https://en.wikipedia.org/wiki/Mahmoud_Mohammad_Issa_Mohammad',
    },
    {
      label: 'CBC News — Canada deports \'convicted terrorist\' after 26 years',
      url: 'https://www.cbc.ca/news/politics/canada-deports-convicted-terrorist-after-26-years-1.1386344',
    },
    {
      label: 'CTV News — Convicted terrorist deported to Lebanon after 26-year fight',
      url: 'https://www.ctvnews.ca/canada/convicted-terrorist-deported-to-lebanon-after-26-year-fight-1.1279121',
    },
    {
      label: 'Ahmed Said Khadr — Wikipedia (cross-referenced with UN 1267 records)',
      url: 'https://en.wikipedia.org/wiki/Ahmed_Said_Khadr',
    },
    {
      label: 'The Canadian Encyclopedia — Omar Khadr Case',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/omar-khadr-case',
    },
    {
      label: 'Supreme Court of Canada — Canada (Prime Minister) v Khadr, 2010 SCC 3',
      url: 'https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/7842/index.do',
    },
    {
      label: 'Government of Canada — Government of Canada lists the IRGC as a terrorist entity (June 2024)',
      url: 'https://www.canada.ca/en/public-safety-canada/news/2024/06/government-of-canada-lists-the-irgc-as-a-terrorist-entity.html',
    },
    {
      label: 'Globe and Mail — CBSA has removed only one senior Iranian official under federal ban',
      url: 'https://www.theglobeandmail.com/canada/article-cbsa-has-removed-only-one-senior-iranian-official-from-canada-under/',
    },
    {
      label: 'CBC News — Minister pressed why just 1 Iranian official deported after 24 deemed part of terror group',
      url: 'https://www.cbc.ca/news/politics/irgc-deportation-iran-canada-9.7140778',
    },
    {
      label: 'Immigration and Refugee Protection Act — sections 34 & 35 (inadmissibility)',
      url: 'https://laws-lois.justice.gc.ca/eng/acts/i-2.5/page-4.html',
    },
    {
      label: 'Suresh v Canada (Minister of Citizenship and Immigration), 2002 SCC 1 (deportation-to-torture)',
      url: 'https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/1937/index.do',
    },
    {
      label: 'Charkaoui v Canada (Citizenship and Immigration), 2007 SCC 9 (security certificates)',
      url: 'https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/2345/index.do',
    },
    {
      label: 'PBS Frontline — Son of al-Qaeda: The Khadr Family',
      url: 'https://www.pbs.org/wgbh/pages/frontline/shows/khadr/family/',
    },
  ],
};
