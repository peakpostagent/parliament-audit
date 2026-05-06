# AI Disclosure & Compliance Landscape — Parliament Audit
**Research Date: May 2026**
**Scope:** Legal, regulatory, ethical, and platform-policy framework governing AI-generated political/news content for an automated Canadian non-partisan accountability outlet operating on X (@ParliamentAudit), Bluesky (@parliamentaudit.bsky.social), and parliamentaudit.ca.

---

## Executive Summary

There is no Canadian federal statute that requires Parliament Audit to label AI-generated content as of May 2026. Bill C-27 (which contained the proposed Artificial Intelligence and Data Act, AIDA) died on the Order Paper when Parliament was prorogued on January 5, 2025, and was not re-tabled after the April 2025 federal election. Canada is presently operating without a federal AI law.

However, the absence of a hard-law requirement does not mean we are in the clear. Three live constraints bind us:

1. **Defamation, impersonation, and elections-period rules under the Canada Elections Act** apply to anything we publish — algorithmic or not.
2. **Platform policies (X, Bluesky, Meta, LinkedIn) require automated-account labeling** and impose specific AI-content disclosure rules in some categories.
3. **Industry ethics standards (CBC, AP, Reuters, CAJ)** treat undisclosed AI-generated journalism as a violation of professional norms — and our credibility as a "non-partisan accountability brand" depends on alignment with those norms regardless of whether the law forces them.

Cross-border exposure is real: the EU AI Act's Article 50 transparency obligations come into force August 2, 2026, and could apply to content we make available to EU readers. New York's AI Disclosure Law (effective June 1, 2026), California's SB 942 (effective August 2, 2026), and Texas's AI political-content rules can each reach us through cross-border syndication or republication.

The defensible posture for an outlet whose entire value proposition is non-partisan transparency: **disclose proactively and prominently, treat AI as a co-author rather than a ghost-author, and maintain documented human editorial responsibility for every published item.**

---

## 1. Canadian Regulatory Framework (May 2026)

### 1.1 Bill C-27 / AIDA — Status: Dead

Bill C-27, which contained the proposed Artificial Intelligence and Data Act, **did not pass**. Parliament was prorogued on January 5, 2025, killing the bill before it reached a vote, and the April 2025 federal election further pushed AI legislation off the agenda. As of May 2026, **Canada has no federal AI-specific statute.** The Office of the Privacy Commissioner of Canada (OPC) has stated AI regulation will likely be considered separately from privacy reform going forward.

**Implication for Parliament Audit:** No AIDA-mandated risk classification, no AIDA-mandated disclosure, no AIDA penalty structure. We are governed by existing horizontal laws — privacy (PIPEDA), defamation (provincial common law and statute), the Canada Elections Act, and the Criminal Code.

Sources: [LEGISinfo C-27](https://www.parl.ca/legisinfo/en/bill/44-1/c-27); [Demise of AIDA — McInnes Cooper](https://www.mcinnescooper.com/publications/the-demise-of-the-artificial-intelligence-and-data-act-aida-5-key-lessons/); [What's Next After AIDA — Schwartz Reisman](https://srinstitute.utoronto.ca/news/whats-next-for-aida).

### 1.2 Elections Canada / Canada Elections Act

The Canada Elections Act **does not currently contain AI-specific rules.** Chief Electoral Officer Stéphane Perrault's 2024 recommendations report to Parliament called for:

- Transparency markers on AI-generated electoral communications during regulated periods
- Expanding the impersonation provision to cover voice/image manipulation by any means (with parody/satire exemption preserved)
- Requirements for AI chatbots/search to point users to authoritative election information

These are recommendations, not law. **The Liberal government introduced Bill C-25 (the "Strong and Free Elections Act") in March 2026**, which would ban sophisticated video deepfakes of candidates intended to mislead voters and extend election protections year-round. As of May 2026 the bill has not been passed; status should be reverified before any federal election cycle.

**Hard rules already in force:**
- **s. 91 of the Canada Elections Act** prohibits making or publishing false statements about a candidate, prospective candidate, or party leader during the election period with intent to affect the result. This applies to AI-generated content the same way it applies to anything else.
- **s. 480.1** prohibits impersonating the Chief Electoral Officer, returning officers, election officials, candidates, or parties — directly relevant if our voice-refiner accidentally produces something that could be read as speaking *for* an MP rather than *about* one.
- During regulated periods, registered political entities and third parties have tagline/ID-line obligations. Parliament Audit is not a political entity, but if any of our content is republished by a third party engaging in regulated activity, the source attribution must remain intact.

Sources: [Elections Canada Recommendations Report](https://www.elections.ca/content.aspx?section=res&dir=rep/oth/prthr/rpt&document=p3&lang=e); [CBC: AI risk in current campaign](https://www.cbc.ca/news/politics/ai-elections-rules-1.7499383); [CBC: Liberal government targets deepfakes](https://www.cbc.ca/news/politics/foreign-interference-electoral-reforms-9.7143290).

### 1.3 CRTC

The CRTC's primary AI move in this period was Broadcasting Regulatory Policy CRTC 2025-299 (November 2025), which updated the definition of "Canadian program" to require humans (not AI) to maintain ultimate creative control. **This applies to certified Canadian programming and broadcaster CanCon obligations.** It does not apply to an online-first written news outlet like Parliament Audit, but it sets a clear regulatory tone: human creative control is the expected standard.

The Online News Act (Bill C-18) is the more relevant CRTC adjacent statute. Parliament Audit, as a small outlet, is below thresholds that trigger the C-18 designation framework. **No labeling obligation flows to us from CRTC at this scale.**

Sources: [CRTC 2025-299](https://crtc.gc.ca/eng/archive/2025/2025-299.htm); [CBC: CRTC Canadian content](https://www.cbc.ca/news/politics/crtc-canadian-content-9.6983364).

### 1.4 Privacy — PIPEDA & OPC Guidance

PIPEDA (2000) is the still-governing federal private-sector privacy law. The OPC and provincial counterparts published joint **"Principles for responsible, trustworthy and privacy-protective generative AI technologies"** in December 2023, which interprets existing law in the AI context. Key principles relevant to Parliament Audit:

- Transparency about AI use when handling personal information
- Limiting use of personal data in training/inference to purposes a reasonable person would consider appropriate
- Heightened care for "highly impactful contexts"

**Parliament Audit handles personal information about MPs — but MPs in their public capacity are generally outside PIPEDA's "personal information" scope when discussed in connection with their public role.** Vote records, committee transcripts, House proceedings, expenditure reports, ourcommons.ca-sourced portraits, and similar public-record information are not PIPEDA-protected. We should still avoid scraping non-public information, training models on private staff data, or drawing inferences that go beyond what the public record supports.

Source: [OPC: Privacy and AI](https://www.priv.gc.ca/en/privacy-topics/technology/artificial-intelligence/).

### 1.5 Quebec Law 25

Quebec's Law 25 (the modernized Private Sector Act) has been fully in force since September 2024. **Section 12.1 requires organizations that use personal information to render decisions based exclusively on automated processing to inform the affected individual** and disclose the personal information used, the principal factors, and the right to make observations. Section 14 requires manifest, free, and informed consent for use of personal information.

**Parliament Audit's exposure to Law 25:**
- We do not render automated decisions about individuals (we publish editorial content about MPs); s. 12.1 likely does not bite.
- If we collect personal information from Quebec subscribers (email addresses for newsletters, donor info), Law 25 governs that collection. Privacy notice and consent must be Quebec-grade.
- Penalties under s. 91: administrative monetary penalties up to 4% of worldwide revenue or C$25 million, whichever is higher.

Sources: [BLG Quebec Private Sector Act guide](https://www.blg.com/en/insights/2026/02/quebecs-private-sector-act-compliance-guide-for-organizations); [Augure Law 25 AI compliance guide](https://augureai.ca/blog/law-25-ai-compliance-guide-quebec).

### 1.6 What Canadian Labeling Is Required vs. Encouraged

| Action | Status |
|---|---|
| Disclosing that an article was AI-drafted | **Encouraged** by OPC/Elections Canada/CAJ; **not legally required** |
| Disclosing AI use in election-period political ads | **Recommended by CEO**, not yet law (Bill C-25 pending) |
| Watermarking AI-generated images | **Recommended**, no federal mandate |
| Identifying automated accounts on social platforms | **Required by platform policy**, not Canadian statute |
| Privacy notice if collecting personal info | **Required** under PIPEDA / Law 25 |

### 1.7 Penalty Structure

- **Canada Elections Act s. 91 violations:** summary conviction up to $50,000 fine and/or 5 years; indictable up to $50,000 fine and/or 5 years
- **PIPEDA non-compliance:** OPC investigation, public reports; statutory damages limited; reputational risk dominant
- **Quebec Law 25:** up to 4% global revenue / C$25M
- **Defamation (common law / provincial):** uncapped damages; aggravated and punitive available

---

## 2. U.S. Regulatory Framework (Cross-Border Relevance)

### 2.1 FTC

The FTC's August 2024 final rule on **fake and AI-generated reviews and testimonials** (effective October 21, 2024) prohibits deceptive AI-generated endorsements. The first warning letters under this rule were issued in January 2026. Parliament Audit does not run an endorsement or review business — but the underlying FTC standard (clear and conspicuous disclosure when content is AI-generated and could mislead consumers about authenticity) is the FTC's general posture.

The FTC's Section 5 authority over "deceptive acts or practices" covers undisclosed AI content presented as human-authored journalism if it deceives consumers in a way that is material. We mitigate this by labeling.

Source: [FTC AI](https://www.ftc.gov/industry/technology/artificial-intelligence); [Sidley: FTC Rule on AI Reviews](https://datamatters.sidley.com/2024/08/30/u-s-ftcs-new-rule-on-fake-and-ai-generated-reviews-and-social-media-bots/).

### 2.2 FCC / FEC

The FCC's 2024 NPRM proposed requiring on-air and written disclosure of AI-generated content in radio and TV political ads. **The proposal targets broadcast political advertising — not online news outlets.** It is not directly applicable to Parliament Audit. The FEC has been considering an interpretive rule extending the federal "fraudulent misrepresentation" provision to AI-generated campaign content; no final rule as of May 2026.

Source: [FCC: AI-generated content in political ads](https://www.fcc.gov/document/fcc-proposes-disclosure-rules-use-ai-political-ads).

### 2.3 Trump Executive Order 14365 (December 11, 2025)

EO 14365 ("Ensuring a National Policy Framework for Artificial Intelligence") directs the FCC and FTC to evaluate state AI laws for federal preemption and creates a DOJ AI Litigation Task Force to challenge state AI laws on Commerce Clause and preemption grounds. **The practical effect for Parliament Audit is limited** — we are a Canadian publisher — but the EO signals that the U.S. federal posture has shifted from regulating AI content to preempting state regulation of AI content.

Sources: [Mayer Brown analysis](https://www.mayerbrown.com/en/insights/publications/2025/12/president-trump-issues-executive-order-on-ensuring-a-national-policy-framework-for-artificial-intelligence); [White House Fact Sheet](https://www.whitehouse.gov/fact-sheets/2025/12/fact-sheet-president-donald-j-trump-ensures-a-national-policy-framework-for-artificial-intelligence/).

### 2.4 State Laws That Could Bite Cross-Border

- **New York AI Disclosure Law** (signed January 2026, effective June 1, 2026): requires advertisers, agencies, and creators to disclose when AI generates or substantially modifies advertising content. Penalties $1,000–$5,000 per violation; up to $10,000 for repeats. *Applies to advertising, not editorial content — but if we run sponsored newsletter slots or paid content, this captures us.*
- **New York Synthetic Performer Disclosure (S8420A):** requires disclosure of AI-generated human likenesses in advertising.
- **California SB 942** (California AI Transparency Act, effective August 2, 2026): requires large AI platforms to provide AI-content detection tools and embed manifest + latent watermarks. *This regulates the AI providers, not us as users.*
- **California deepfake political content laws** apply to electoral content with deceptive intent — not to our nonpartisan reporting, but a sloppy AI-generated portrait of a candidate could touch this.
- **Texas Responsible AI Governance Act** (June 2025): up to $200,000 per violation for intentional abuses. Generally targets high-risk AI deployments (employment, housing, etc.); less directly applicable to a news outlet.

Sources: [NatLawReview: California AI Laws 2026](https://natlawreview.com/article/new-california-ai-laws-taking-effect-2026); [HumanAds: NY AI Disclosure Law](https://humanadsai.com/blog/new-york-ai-disclosure-law-2026); [Drata: State AI Laws 2026](https://drata.com/blog/artificial-intelligence-regulations-state-and-federal-ai-laws-2026).

### 2.5 EU AI Act (Cross-Border)

**Article 50 transparency obligations enter into force August 2, 2026.** The provision most relevant to Parliament Audit:

> "Deployers of an AI system that generates or manipulates text which is published with the purpose of informing the public on matters of public interest shall disclose that the text has been artificially generated or manipulated."

There is a critical exemption: the obligation does not apply where the AI-generated content has been subject to **human review or editorial control and a natural or legal person bears editorial responsibility.** This exemption is the legal hinge for any AI-assisted newsroom. If we maintain documented human editorial review and a named accountable editor (Cole/Parliament Audit), we likely fall within the exemption even for EU-facing content.

Penalties for AI Act violations can reach €15M or 3% of worldwide annual turnover (Article 99).

Sources: [EU AI Act Article 50](https://artificialintelligenceact.eu/article/50/); [EC: Code of Practice on AI-generated content](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content).

---

## 3. Platform-Policy Specifics

### 3.1 X / Twitter

**Automated Account Labels.** X explicitly permits bot accounts that are clearly labeled. X provides an "Automated" account label that can be activated in settings; it requires association with a human-run X handle that takes responsibility. **Parliament Audit's posting bot should activate this label and tie it to Cole's personal handle.**

**AI-Generated Content.** X has no general AI-content disclosure requirement. There are two narrow, enforced exceptions:
- AI-generated **adult content** must carry sensitivity tier + AI disclosure label (effective February 2026)
- AI-generated **armed-conflict content** without disclosure: 90-day suspension from Creator Revenue Sharing on first violation, permanent removal on subsequent (announced by Nikita Bier, March 3, 2026)

Neither is relevant to our typical content unless we cover an armed-conflict story with AI-generated visuals.

**Platform Manipulation.** X's platform-manipulation policy targets coordinated inauthentic behavior, automated engagement (likes, retweets, follows), spam, and duplicate content distribution. **A single labeled news bot posting at a reasonable cadence is within policy.** Practical limits: the platform-wide cap is 2,400 tweets/day; healthy active accounts post 2–10/day. Volume above ~30/day "raises flags."

**Community Notes** can be applied to any post by community contributors; AI-generated posts that contain factual errors are common targets. This is an editorial-quality concern, not a policy concern.

Sources: [X Automated Account Labels](https://help.x.com/en/using-x/automated-account-labels); [OpenTweet: X automation rules 2026](https://opentweet.io/blog/twitter-automation-rules-2026); [TechCrunch: X armed-conflict AI suspensions](https://techcrunch.com/2026/03/03/x-says-it-will-suspend-creators-from-revenue-sharing-program-for-unlabeled-ai-posts-of-armed-conflict/).

### 3.2 Bluesky / AT Protocol

Bluesky's community guidelines do not explicitly require disclosure for AI-generated content or for automated accounts, but **best practice (per Bluesky's own bot documentation) is to apply the self-label "automated"** in profile and state in bio that the account is a bot. Doing so reduces the chance of being suspended for bot-like behavior.

**Labelers.** Bluesky's stackable moderation lets third-party labelers tag accounts. There is real risk that a labeler will flag us as "automated" or "AI-generated" — if we self-label first, that risk is neutralized: we're transparent, and the labeler is just confirming what we've already said.

**Impersonation rules** explicitly prohibit impersonation of electoral officials or campaigns. Parliament Audit does not impersonate; we report. We must be careful that voice-refining never crosses into producing first-person quotes attributed to an MP that the MP did not say.

**Rate limits:** ~1,500–3,000 points per 5 minutes depending on endpoint.

Sources: [Bluesky Community Guidelines](https://bsky.social/about/support/community-guidelines); [Bluesky Bots Docs](https://docs.bsky.app/docs/starter-templates/bots); [Bluesky Moderation Architecture](https://docs.bsky.app/blog/blueskys-moderation-architecture).

### 3.3 Meta / Threads (If We Expand)

Meta applies "AI info" labels across Facebook, Instagram, and Threads, triggered by C2PA/IPTC industry signals or self-disclosure. Meta's policy expects self-disclosure for AI-generated content presented as fact or news. As of mid-2024 Meta moved away from removing manipulated content under the old video-only policy and toward a context/transparency model — content removed only if it violates other Community Standards (voter interference, harassment, violence).

Source: [Meta: Labeling AI Content](https://transparency.meta.com/governance/tracking-impact/labeling-ai-content/).

### 3.4 LinkedIn (If We Expand)

LinkedIn requires "Sponsored" labels on paid content (effective April 1, 2026, with stricter enforcement aligned with EU DSA). LinkedIn started training generative AI on member content in EU/Canada/EEA on November 3, 2025; opt-out is in settings. Parliament Audit should opt out for any company page to avoid having proprietary editorial voice fed into LinkedIn's training data.

Source: [LinkedIn Help: Update to Terms](https://www.linkedin.com/help/linkedin/answer/a8059228).

---

## 4. Industry / Journalism Ethics Standards

### 4.1 CBC News (November 2025 Guidelines)

CBC's editorial AI policy is the closest Canadian benchmark for Parliament Audit. Key principles:

- "We will not use or present AI-generated content to audiences without full disclosure."
- "No CBC journalism will be published or broadcast without direct human involvement and oversight."
- CBC staff must not use image/video generators to create publishable content, and must not use generative AI features in photo/video software.
- Disclosure required when generative AI's contribution affects content "in a materially significant way" or when content "would not have been possible without the use of AI."

Source: [CBC Editor's Blog: AI Guidelines](https://www.cbc.ca/news/editorsblog/cbc-news-artificial-intelligence-guidelines-9.6990760).

### 4.2 Associated Press (AP)

AP's August 2023 guidelines: AI may not be used to create publishable content or images. AP uses AI for non-publishable tasks (transcription, summarization for editor consumption, story-idea generation). All AP-bylined content remains human-written.

### 4.3 Reuters / Thomson Reuters

Reuters commits to making "the use of data and AI in our products and services understandable" and to informing audiences about AI tool use when "the use of a specific AI tool is important to the outcome." Less restrictive than AP/CBC but transparency is the core commitment.

### 4.4 Canadian Association of Journalists (CAJ)

The CAJ's 2023 Ethics Guidelines (the post-2023 revision) prioritize accuracy, independence, transparency, and accountability. The CAJ has an active Ethics Advisory Committee AI subcommittee working toward a white paper and AI-specific guidelines, expected in 2026. The CAJ's Statement of Principles emphasizes transparency about methods.

Source: [CAJ Ethics](https://caj.ca/ethics/); [CJF: Guide not a cop](https://cjf-fjc.ca/guide-not-cop-cajs-new-ethics-code-and-why-its-not-called/).

### 4.5 SPJ (Society of Professional Journalists)

SPJ's Code of Ethics turns 100 in 2026, with a board-empowered review of the Code in progress. The Ethics Committee is fielding AI-related queries and is expected to recommend updates by end of 2026. Existing principles — verify before release, use original sources, take responsibility for accuracy — already cover AI-assisted work.

Source: [SPJ Code of Ethics](https://www.spj.org/spj-code-of-ethics/).

### 4.6 Industry Consensus

Across 52 newsroom AI policies surveyed by Journalist's Resource:
- **Transparency about AI use is universal**
- **Human editorial oversight before publication is universal**
- **Bans on AI-generated photorealistic imagery are common**
- **Disclosure granularity varies** — some label every AI-touched piece, others only label material AI involvement

Audience research (U.S.) shows ~85% of audiences want newsrooms to disclose AI use; ~75% want labels on AI-generated content.

---

## 5. High-Risk Scenarios for Parliament Audit

### 5.1 Auto-posting an article with a fabricated fact

**Risk:** Hallucination passes voice-refiner check, lands as published claim about a specific MP. Defamation exposure (esp. if the false fact is material to reputation). Even a parliamentary procedure error can be defamatory if it implies an MP did something wrong they didn't do.
**Mitigation:** Two-source rule for any factual claim in published content. Voice-refiner does not invent facts — verifier must confirm against ourcommons.ca / openparliament.ca / official Hansard. A staged human-review checkpoint for any post that names a specific MP in connection with a vote, statement, or alleged action.

### 5.2 AI-misattribution of a quote

**Risk:** Voice-refiner sharpens a paraphrase into a "quote" — or puts words in an MP's mouth that they did not say. **This is the single highest-risk failure mode.** Could trigger s. 480.1 Canada Elections Act impersonation issues during an election period; can constitute defamation; violates AP/Reuters/CBC standards.
**Mitigation:** No quote may appear inside quotation marks unless it has been verbatim-matched to a primary source (Hansard, video, official transcript). The voice-refiner's system prompt must explicitly forbid producing quoted speech.

### 5.3 AI-generated portraits

**Risk:** Generally low — ourcommons.ca portraits are official, published by the Library of Parliament, and freely usable for non-commercial purposes. **Two landmines:** (1) using a generative model to "enhance" or stylize an MP's face crosses into manipulated likeness territory, possibly captured by Bill C-25 if it ever passes; (2) some portraits have age/appearance restrictions in Library of Parliament terms.
**Mitigation:** Use ourcommons.ca portraits as-is. Do not stylize, recolor, or composite with synthetic backgrounds without disclosure. Never use a generative model to fabricate an MP's face in a setting where they were not present.

### 5.4 Hallucinated parliamentary procedure details

**Risk:** AI confidently asserts a procedural fact (e.g., "the bill failed Second Reading by 14 votes") that is wrong. Erodes the entire brand premise.
**Mitigation:** Procedure facts must come from primary source data ingestion (LEGISinfo, our scraper, official vote records) — not from the model's training data. The model should be wired to retrieve, not to recall.

### 5.5 Auto-posting during a tragedy

**Risk:** Mass-casualty event, MP death, suicide news — and the bot publishes a tone-deaf "today in Question Period" post. Brand damage is permanent.
**Mitigation:** Implement a circuit-breaker: a manual "pause posting" toggle Cole can hit instantly; an automated "news-tragedy detector" that pauses scheduled posts when major-incident keywords surge in Canadian news; and a documented sensitivity protocol covering suicide reporting (per Mindset Media Guide standards) and active mass-casualty events.

### 5.6 Defamation via voice-refining

**Risk:** Voice-refiner sharpens "MP X voted against the bill" into "MP X torpedoed the bill" — punchier, but if "torpedoed" implies bad faith and MP X had a documented principled reason, that's a defamation hook.
**Mitigation:** Voice playbook must distinguish factual reporting (neutral verbs) from analysis (clearly framed). The "sharpening" must never imply motive that isn't documented in primary sources. Run a defamation-flag pass on any post that uses negatively-charged verbs about a named individual.

### 5.7 Republishing third-party content

**Risk:** AI summarizes a CBC or Globe article so closely that it constitutes a "displacive summary" — copyright infringement and possible Online News Act issues.
**Mitigation:** Always link to original source. Summaries must be substantially shorter than the original and use original wording. Cite primary sources (Hansard, openparliament) rather than secondary news where possible.

---

## 6. Compliance Checklist

### Must Do
| # | Item | Tied To |
|---|---|---|
| M1 | Apply X "Automated Account" label and tie bot handle to Cole's personal handle | X automation policy |
| M2 | Apply Bluesky self-label as "automated" in account settings; state automation in bio | Bluesky bot best practice; reduces labeler risk |
| M3 | Maintain documented human editorial responsibility (named editor) for every published item | EU AI Act Art. 50 exemption; CBC/CAJ standard; defamation defense |
| M4 | Two-source factual verification for any specific claim about an MP | Defamation; CAJ ethics |
| M5 | Never produce quoted speech (inside quote marks) unless verbatim-matched to a primary source | Canada Elections Act s. 480.1; defamation; AP/Reuters/CBC standards |
| M6 | Privacy notice on parliamentaudit.ca compliant with PIPEDA + Quebec Law 25 for any subscriber data collection | PIPEDA; Quebec Law 25 |
| M7 | Disclosure on /about page that articles are AI-assisted with documented human editorial oversight | CBC standard; EU AI Act compliance posture; brand credibility |
| M8 | Circuit-breaker / manual pause for breaking-tragedy moments | Editorial duty of care; brand protection |
| M9 | Use ourcommons.ca portraits as-is; no generative stylization of MP faces | Bill C-25 (if passes); Library of Parliament terms |
| M10 | LinkedIn AI training opt-out on any company page we operate | LinkedIn data policy |

### Should Do
| # | Item | Tied To |
|---|---|---|
| S1 | "AI-assisted" footer or byline on each article on parliamentaudit.ca | CBC/CAJ direction; ~85% of audiences expect this |
| S2 | Standing pinned post on @ParliamentAudit explaining AI-assisted nature | Brand transparency; Bluesky/X best practice |
| S3 | Maintain a public "methods" page: data sources, editorial workflow, AI roles | Reuters principle; CAJ transparency |
| S4 | C2PA / content credentials on AI-touched images where feasible | Industry standard; EU AI Act machine-readable marking |
| S5 | Defamation/sensitivity review pass before publishing any post that names an individual negatively | Defamation defense |
| S6 | Document the autonomy boundary publicly (already drafted) | Builds trust; pre-empts critique |
| S7 | Track Bill C-25 progress; if passed, adopt election-period transparency markers immediately | Canada Elections Act compliance |

### Consider
| # | Item | Tied To |
|---|---|---|
| C1 | Apply for CAJ membership; engage with the AI subcommittee | Industry standing |
| C2 | Voluntary registration with Press Council of Canada or Quebec Press Council | Editorial accountability infrastructure |
| C3 | Publish a quarterly "AI corrections log" — corrections to errors traceable to AI generation | Trust-building; differentiates us from outlets that stay silent on AI errors |
| C4 | Geo-block EU traffic if compliance with Article 50 becomes burdensome (we likely don't need to — exemption applies) | EU AI Act risk management |
| C5 | Errors-and-omissions / media liability insurance with AI-content rider | Defamation cost backstop |

---

## 7. Voluntary Disclosure Proposal

### 7.1 Disclosure Philosophy

Parliament Audit's brand premise is **non-partisan accountability journalism.** Credibility is the entire asset. The defensible posture is **maximally transparent, minimally apologetic.** AI assistance is a feature of how we operate, not a secret to be buried.

The right framing: AI does the indexing, drafting, and amplification grunt work that a small outlet could not afford to do otherwise; humans (Cole as named editor) take editorial responsibility for what is published. This is the same shape as a wire-service-augmented small newsroom — ordinary journalism with a different toolset.

### 7.2 About-Page Language (Recommended)

> **How Parliament Audit is built**
>
> Parliament Audit is an AI-assisted accountability publication. We use AI tools to ingest parliamentary records, draft analysis, and prepare social posts. Every published article is reviewed, fact-checked against primary sources, and approved by a named human editor before it goes out.
>
> **What that means in practice:**
> - Every fact about a vote, statement, or procedural event is verified against primary sources (Hansard, LEGISinfo, ourcommons.ca, openparliament.ca).
> - Quotation marks are reserved for verbatim-matched text from a primary source. We never put words in an MP's mouth.
> - Photographs of MPs are official portraits from the Library of Parliament, used as-is. We do not generate or alter MP imagery.
> - Errors are corrected publicly with a dated correction note. We publish a quarterly log of any errors traceable to AI generation.
> - When a major incident or tragedy occurs, automated posting is paused.
>
> Editorial responsibility rests with [Editor Name]. Questions, corrections, and concerns: [email address]. Our [autonomy boundary](link) document explains exactly what is automated and what requires human approval.

### 7.3 Profile Bio Language (X & Bluesky)

**X bio (under 160 chars):**
> Non-partisan Canadian parliamentary accountability. AI-assisted, human-edited. Vote tracking, accountability reporting. parliamentaudit.ca

**X "Automated Account" label** active, tied to Cole's personal handle. This is the platform-native disclosure layer.

**Bluesky bio:**
> Non-partisan Canadian parliamentary accountability. AI-assisted, human-edited. Editorial responsibility: [Editor]. parliamentaudit.ca
> Self-label: "automated"

### 7.4 Per-Article Labeling

**Recommendation: Yes, label every AI-drafted article.** The label should appear once, at the bottom of the article (not in the headline area, where it can be alarmist), in a single line that builds trust rather than hedging:

> *This article was drafted with AI tools and reviewed by [Editor Name] before publication. Data is sourced from [list]. See our [methods page](link) for details.*

This satisfies the EU AI Act human-review exemption documentation, the CBC-equivalent disclosure standard, and audience expectations. It is **stronger than legally required and is a brand asset, not a liability.**

### 7.5 What Not to Do

- Don't bury disclosure in a terms-of-service link
- Don't use the cute "robot emoji" approach — it diminishes accountability
- Don't disclose only in metadata; put it where humans see it
- Don't claim "100% human-written" anywhere; that's the lie that kills credibility when a mistake happens
- Don't add "AI-generated" to a headline (per IAB and TechPolicy.Press research, label fatigue is real; in-content disclosure is more effective than headline labeling)

---

## 8. Open Questions / Unverified

- **Bill C-25 status:** introduced March 2026, status in May 2026 unverified. If passed before next federal election, election-period transparency markers become a hard requirement.
- **OPC PIPEDA-AI rulemaking:** the OPC has signaled forthcoming guidance specific to generative AI but no formal rule exists as of May 2026.
- **Saskatchewan Defamation Act 2025:** introduced November 2025; final passage and applicability to AI-content unverified.
- **CAJ AI guidelines white paper:** in progress, no published final version.
- **CRTC future moves on online news:** no rule directly applicable to small-scale online publishers; could change.
- **EU AI Act Article 50 enforcement guidance:** Code of Practice expected June 2026; specific guidance on the human-review exemption pending.

---

## Sources

### Canadian regulatory
- [LEGISinfo: Bill C-27](https://www.parl.ca/legisinfo/en/bill/44-1/c-27)
- [McInnes Cooper: The Demise of AIDA](https://www.mcinnescooper.com/publications/the-demise-of-the-artificial-intelligence-and-data-act-aida-5-key-lessons/)
- [Schwartz Reisman: What's Next After AIDA](https://srinstitute.utoronto.ca/news/whats-next-for-aida)
- [Elections Canada: Recommendations Report](https://www.elections.ca/content.aspx?section=res&dir=rep/oth/prthr/rpt&document=p3&lang=e)
- [CBC: Liberal government targets deepfakes](https://www.cbc.ca/news/politics/foreign-interference-electoral-reforms-9.7143290)
- [CBC: AI risk in current campaign](https://www.cbc.ca/news/politics/ai-elections-rules-1.7499383)
- [CRTC 2025-299](https://crtc.gc.ca/eng/archive/2025/2025-299.htm)
- [OPC: Privacy and AI](https://www.priv.gc.ca/en/privacy-topics/technology/artificial-intelligence/)
- [BLG: Quebec Private Sector Act compliance](https://www.blg.com/en/insights/2026/02/quebecs-private-sector-act-compliance-guide-for-organizations)
- [Augure: Quebec Law 25 AI compliance](https://augureai.ca/blog/law-25-ai-compliance-guide-quebec)

### U.S. and EU regulatory
- [FTC: Artificial Intelligence](https://www.ftc.gov/industry/technology/artificial-intelligence)
- [Sidley: FTC Rule on AI Reviews](https://datamatters.sidley.com/2024/08/30/u-s-ftcs-new-rule-on-fake-and-ai-generated-reviews-and-social-media-bots/)
- [FCC: AI in Political Ads NPRM](https://www.fcc.gov/document/fcc-proposes-disclosure-rules-use-ai-political-ads)
- [White House: EO 14365 Fact Sheet](https://www.whitehouse.gov/fact-sheets/2025/12/fact-sheet-president-donald-j-trump-ensures-a-national-policy-framework-for-artificial-intelligence/)
- [Mayer Brown: EO 14365 analysis](https://www.mayerbrown.com/en/insights/publications/2025/12/president-trump-issues-executive-order-on-ensuring-a-national-policy-framework-for-artificial-intelligence)
- [HumanAds: NY AI Disclosure Law](https://humanadsai.com/blog/new-york-ai-disclosure-law-2026)
- [NatLawReview: California AI Laws 2026](https://natlawreview.com/article/new-california-ai-laws-taking-effect-2026)
- [Drata: State and Federal AI Laws 2026](https://drata.com/blog/artificial-intelligence-regulations-state-and-federal-ai-laws-2026)
- [EU AI Act Article 50](https://artificialintelligenceact.eu/article/50/)
- [European Commission: Code of Practice on AI-generated content](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content)

### Platforms
- [X: Automated Account Labels](https://help.x.com/en/using-x/automated-account-labels)
- [X: Automation Rules](https://help.x.com/en/rules-and-policies/x-automation)
- [OpenTweet: Twitter/X Automation Rules 2026](https://opentweet.io/blog/twitter-automation-rules-2026)
- [TechCrunch: X armed-conflict AI suspensions](https://techcrunch.com/2026/03/03/x-says-it-will-suspend-creators-from-revenue-sharing-program-for-unlabeled-ai-posts-of-armed-conflict/)
- [Bluesky Community Guidelines](https://bsky.social/about/support/community-guidelines)
- [Bluesky Bots Documentation](https://docs.bsky.app/docs/starter-templates/bots)
- [Bluesky Moderation Architecture](https://docs.bsky.app/blog/blueskys-moderation-architecture)
- [Meta: Labeling AI Content](https://transparency.meta.com/governance/tracking-impact/labeling-ai-content/)
- [LinkedIn: Update to Terms](https://www.linkedin.com/help/linkedin/answer/a8059228)

### Industry / journalism
- [CBC: AI Guidelines](https://www.cbc.ca/news/editorsblog/cbc-news-artificial-intelligence-guidelines-9.6990760)
- [CAJ: Ethics](https://caj.ca/ethics/)
- [SPJ: Code of Ethics](https://www.spj.org/spj-code-of-ethics/)
- [Journalist's Resource: 52 Newsroom AI Policies](https://journalistsresource.org/home/generative-ai-policies-newsrooms/)
- [Reuters Institute: AI and the Future of News 2026](https://reutersinstitute.politics.ox.ac.uk/news/ai-and-future-news-2026-what-we-learnt-about-its-impact-newsrooms-fact-checking-and-news)

### Defamation / liability
- [Rocklaw: Legal Issues in AI Journalism](https://www.rock.law/legal-issues-ai-journalism-news-copyright-defamation-attribution/)
- [Columbia Undergraduate Law Review: AI Hallucinations and Defamation](https://www.culawreview.org/journal/redefining-defamation-establishing-proof-of-fault-for-libel-and-slander-in-ai-hallucinations)
- [WeirFoulds: AI Legal Battles in Canada](https://www.weirfoulds.com/ai-legal-battles-canada-and-beyond)

### Disclosure best practice
- [IAB: AI Transparency and Disclosure Framework](https://www.iab.com/guidelines/ai-transparency-and-disclosure-framework/)
- [TechPolicy.Press: AI Disclosure Labels Risk](https://www.techpolicy.press/ai-disclosure-labels-risk-becoming-digital-background-noise/)
- [Generative AI Newsroom: AI Disclosure for News](https://generative-ai-newsroom.com/this-article-is-ai-generated-ai-disclosure-and-labeling-for-news-content-73d6e6cb6d50)
