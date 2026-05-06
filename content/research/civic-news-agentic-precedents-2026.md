# Civic News Agentic Precedents (2026)

**Purpose:** Identify the closest analogs to Parliament Audit — civic news / accountability journalism / government-transparency outfits that have used AI or automation in their workflow — and extract concrete lessons for a sub-10-follower brand trying to break out on X and Bluesky.

**Audience:** Parliament Audit operators (Cole Tindall + Claude Code agents).

**Date:** 2026-05-04

---

## 1. Direct Comparables — Canadian

### 1.1 OpenParliament.ca (Michael Mulley)

The single closest functional analog to Parliament Audit on the data side. Built and maintained by Michael Mulley as a volunteer effort starting in 2010; offers Hansard formatted by topic and date, MP profiles linked to recent speeches, and an automated email-alerts system that pings users any time something matches their saved interest. Open-source on GitHub. Code: [github.com/michaelmulley/openparliament](https://github.com/michaelmulley/openparliament). About: [openparliament.ca/about](https://openparliament.ca/about/).

**Social presence — the lesson is the cautionary part.** @openparlca (X) joined April 2010 and has roughly 712 followers as of recent counts, with infrequent and "terse" updates. Sixteen years of operation, deep credibility inside the parliamentary tech community, low public-facing footprint. The site itself draws steady traffic from journalists and researchers, but it never converted backend data quality into a social audience. ([@openparlca on X](https://x.com/openparlca)).

**What we learn:**
- Data parity isn't a moat for social growth. Mulley owns the data — and is still under 1K followers because the account treats X as a feed of bare links, not a voice.
- The opportunity Parliament Audit can take from OpenParliament's neglect: be the editorial voice on top of the same data layer.
- Mulley remains a model for non-partisan trust: never editorializes, owns the technical substrate, has never been captured by a party. We adopt the trust posture and reject the silent-feed tactic.

### 1.2 338Canada (Philippe J. Fournier)

The single most successful Canadian solo civic-data brand. Started 2017 as a polling-aggregation model out of a CEGEP physics teacher's spreadsheet; now ~46K followers on @338Canada (X), substantial Mastodon presence, regular column at L'actualité and Maclean's, and a Substack at [338canada.ca](https://www.338canada.ca/). Account joined September 2015. Wikipedia: [338Canada](https://en.wikipedia.org/wiki/338Canada).

**How he grew:**
- **A repeatable visual format.** Every "338Canada federal update" is the same template — flag emoji, party-by-party seat counts with majority threshold marked, one-link-to-details, one-link-to-find-your-riding, one branded chart image. The template is so recognizable it functions as a brand asset.
- **Methodology transparency.** He publishes how the model works. Pollsters, journalists and partisans alike use his numbers because the math is exposed.
- **Cadence tied to real-world events.** Updates publish on poll release days and at fixed weekly intervals during writs. The audience has trained itself to check 338 the way they check the weather.
- **Cross-platform consistency.** Same chart, same caption structure on X, Mastodon, Facebook, Substack. He picked one voice (clinical, numbers-first, no jokes, occasional Quebec-French interjection) and never broke it.
- **Earned credentials.** Gained Maclean's and L'actualité columns by building the audience first, then using the audience as proof.

**Translates directly to Parliament Audit:** Build a templated visual unit ("vote scorecard" or similar), publish methodology, tie cadence to House sittings, never break voice.

### 1.3 Canadaland

Investigative independent. Published an explicit AI policy on October 7, 2025 ([canadaland.com/canadalands-artificial-intelligence-policy](https://www.canadaland.com/canadalands-artificial-intelligence-policy/)) on the basis that other Canadian news organizations' AI guidelines were "unspecific, unclear and unsatisfying." Discussed the thinking on a bonus episode of Off The Record. The headline takeaway: even an outlet built on adversarial press criticism feels obligated to declare publicly what AI does and doesn't do in their workflow. That bar is now table stakes for a credibility-first civic brand.

### 1.4 The Logic, The Tyee, PressProgress, J-Source

- **The Logic** ([thelogic.co](https://thelogic.co/)) — Canadian business and tech newsroom, Toronto-headquartered, bureau coverage in Vancouver/Calgary/Ottawa/Montreal. AI deployment is mostly internal (research and document analysis), not generative authorship. Voice consistency is enforced through a paywalled, named-byline model.
- **The Tyee** ([thetyee.ca](https://thetyee.ca/)) — independent BC news site, transitioned to nonprofit in 2022. Published "AI Is the Elephant in the Newsroom" in February 2026 ([article](https://thetyee.ca/News/2026/02/11/AI-Elephant-Newsroom/)). Skeptical-but-engaged posture toward AI.
- **PressProgress** — explicitly states it does not use generative AI to create editorial content; uses AI only inside other tools (transcription etc.). A useful policy template if Parliament Audit ever needs a defensive position on what AI does *not* do in our workflow.
- **J-Source** ([j-source.ca/ai-in-canadian-newsrooms-media-engaging-cautiously](https://j-source.ca/ai-in-canadian-newsrooms-media-engaging-cautiously/)) — surveys Canadian newsrooms and reports a "cautious engagement" mode: most use AI for transcription, research, document analysis, audio editing, translation, SEO and headline generation. Generative authorship is rare and usually undisclosed when it happens, which is the failure mode.

### 1.5 CBC News

Public broadcaster published comprehensive guidelines ([cbc.ca/news/editorsblog/cbc-news-artificial-intelligence-guidelines-9.6990760](https://www.cbc.ca/news/editorsblog/cbc-news-artificial-intelligence-guidelines-9.6990760)). The mandatory disclosure rule: if AI's contribution affected the content materially or the content wouldn't exist without AI, you disclose. The disclosure must include what the AI did, why, the human-review path, and how the content still meets editorial standards. CBC frames their default mode as "AI-assisted" with the human as primary creator. **For Parliament Audit, this is the disclosure standard the Canadian audience has been trained on. We should match or exceed it.**

### 1.6 Village Media (the surprise winner)

The most useful Canadian model nobody talks about. Village Media operates a chain of ad-supported local websites and licenses its in-house AI tooling to ~120 publishers in Canada and the US. AI tools include: editorial-workflow summaries, text optimization, tagging, a poll platform that reads articles and suggests community polls, a comment engine that suggests dialogue prompts, and a monitoring/filtering layer that tracks school boards, police, city councils, health departments and hospitals — filtering for local relevance and newsworthiness before forwarding to a human editor. Profitable, growing. ([Nieman Lab on local newsrooms using AI to listen in on public meetings](https://www.niemanlab.org/2025/03/local-newsrooms-are-using-ai-to-listen-in-on-public-meetings/)).

**Translation for Parliament Audit:** The viable agentic civic-news pattern is *AI as monitor/triage layer, human as editor*. Not AI-as-writer. Village Media is closer to our operating model than any newsroom on this list.

---

## 2. Direct Comparables — International

### 2.1 GovTrack.us (Joshua Tauberer)

Created 2004 by civic hacker Joshua Tauberer — older than 338Canada, older than OpenParliament. Reported ~98K X followers as of January 2021. The model: research and tracking tools plus raw data feeds that third parties build on top of. Two key strategic choices we should copy:
- **The data API is free and seeded the ecosystem.** Other apps/journalists/activists used it, which functioned as backlinks and referrals.
- **The brand is the data, not the founder.** Tauberer doesn't post on @GovTrack much under his own name; the account speaks as the institution.

About: [govtrack.us/about](https://www.govtrack.us/about). Tauberer site: [joshdata.me](https://joshdata.me/).

### 2.2 TheyWorkForYou (mySociety, UK)

Parliamentary monitoring covering Westminster, Holyrood, Senedd and Stormont. Hansard archives, MP voting records, email alerts, full API/RSS firehose. About: [theyworkforyou.com/about](https://www.theyworkforyou.com/about/). Long-running, charity-backed, deeply embedded in UK civic-tech infrastructure. Their social presence is functional rather than viral — but their data is cited everywhere from The Guardian to campaign groups, which is a different and arguably better win.

### 2.3 OpenStates (Plural Policy)

US state-legislatures equivalent — covers all 50 states, DC, Puerto Rico, US Congress. All bill and vote data scraped daily by automated scrapers; data published as API and bulk downloads. ([openstates.org/about](https://openstates.org/about/), [docs.openstates.org](https://docs.openstates.org/)). Like GovTrack, optimized for being-the-substrate rather than being-the-megaphone.

### 2.4 Public.Resource.Org (Carl Malamud)

Closer to a philosophical model than a tactical one. Malamud has spent three decades digitizing and uploading government data — court records, building codes, US Government Printing Office crawls, 588 government films onto Internet Archive and YouTube. ([public.resource.org/about](https://public.resource.org/about/), [Wikipedia](https://en.wikipedia.org/wiki/Public.Resource.Org)). Awarded the 2022 Internet Archive Hero Award. The relevant lesson: a strong moral framing ("an informed citizenry depends on access") earns durable goodwill that survives platform shifts. Parliament Audit's About-page framing should borrow this register.

---

## 3. AI-Augmented News Experiments to Learn From

### 3.1 Wins

- **AP earnings reports / Automated Insights Wordsmith:** AP went from ~300 manually written quarterly earnings reports to ~3,000 (later ~4,500) using Wordsmith. Stories had fewer errors than manual. Freed up ~20% of journalist time for investigations. ([Poynter on AP automation](https://www.poynter.org/reporting-editing/2015/robot-writing-increased-aps-earnings-stories-by-tenfold/), [Automated Insights Wikipedia](https://en.wikipedia.org/wiki/Automated_Insights)). **Pattern:** automate the structured-data summary, free humans for analysis.

- **LA Times Quakebot (Ken Schwencke):** USGS feed -> template -> draft in CMS -> human review -> publish. Operating since 2011, was first to break a 2013 LA quake. ([Slate](https://slate.com/technology/2014/03/quakebot-los-angeles-times-robot-journalist-writes-article-on-la-earthquake.html)). **Pattern:** trigger off authoritative data feed, draft with template, never auto-publish without human.

- **Washington Post Heliograf:** built in-house, used for 2016 Rio Olympics and 2016 election. ~850 articles in year one, 500 election-day articles generating 500K+ clicks. Goal: cover races/results too granular for human reporters. ([WaPo](https://www.washingtonpost.com/pr/wp/2016/08/05/the-washington-post-experiments-with-automated-storytelling-to-help-power-2016-rio-olympics-coverage/), [Poynter](https://www.poynter.org/tech-tools/2016/the-washington-post-is-using-robots-to-cover-the-olympics-and-the-election/)).

- **Bloomberg Cyborg:** AI handles first draft of earnings briefs, human adds context and oversight. Automation now touches ~30% of all Bloomberg content. ([Wiley AI Magazine](https://onlinelibrary.wiley.com/doi/full/10.1002/aaai.12181)).

- **Forbes Bertie:** in-house CMS launched July 2018, AI suggests topics, headlines, image picks, rough drafts. Framed internally as a "bionic suit" — augmentation, not replacement. ([CIO Dive](https://www.ciodive.com/news/all-about-bertie-overhauling-cms-technology-at-forbes/554871/), [Digiday](https://digiday.com/media/forbes-built-a-robot-to-pre-write-articles-for-its-contributors/)).

- **Reuters Fact Genie + Avista:** Fact Genie scans documents in under 5 seconds and surfaces newsworthy alerts for journalist review; first alert can publish within 6 seconds. Avista does video transcription and translation. Human-in-the-loop is mandatory. ([WAN-IFRA](https://wan-ifra.org/2025/04/from-lab-to-newsroom-how-reuters-builds-ai-tools-journalists-actually-use/)).

- **Quartz Bot Studio:** Knight-funded ($240K) experiment in conversational news interfaces — Messenger bot, Slack tools, Alexa skills. ([Knight](https://knightfoundation.org/press/releases/quartz-bot-studio-will-experiment-with-new-ways-to-create-and-deliver-news-with-$240,000-from-knight-foundation/), [Nieman Lab](https://www.niemanlab.org/2018/03/quartz-launches-a-facebook-messenger-bot-because-why-not-because-experimentation-because-people-like-messaging/)). Most of these chatbots are now defunct; the surviving lesson is that conversational interfaces work best when there is genuine personality, not a generic bot tone.

### 3.2 Losses (the cautionary canon)

- **Sports Illustrated AI bylines (Nov 2023):** SI's parent Arena Group published product-review articles under fake author names with AI-generated headshots purchased from a digital marketplace. No disclosure. Discovered by Futurism. Stock dropped 22%+. Articles were quietly deleted; eventually disclaimed as "third-party content from AdVon Commerce." ([CNN Business](https://edition.cnn.com/2023/11/27/media/sports-illustrated-deletes-articles-fake-author-names-ai-profile-photos), [Futurism](https://futurism.com/sports-illustrated-ai-generated-writers), [Fortune](https://fortune.com/2023/11/28/sports-illustrated-ai-written-articles-reporters-who-dont-exist/)). **Failure mode:** fabricating a human identity to launder AI output.

- **CNET (Jan 2023):** quietly published AI-generated articles under "CNET Money Staff" byline. Of 77 articles reviewed, 41 contained errors. Plagiarism evidence found. Wikipedia downgraded CNET from "generally reliable." Red Ventures has reportedly struggled to sell CNET partly because of the scandal. ([Futurism on disclosure](https://futurism.com/cnet-ai-articles-label), [Futurism on Wikipedia downgrade](https://futurism.com/wikipedia-cnet-unreliable-ai), [Futurism on plagiarism](https://futurism.com/cnet-ai-plagiarism)). **Failure mode:** disclosure hidden behind a click-to-reveal popup; volume prioritized over accuracy.

- **Gannett LedeAI sports recaps (Aug 2023):** AI-written high school sports stories with placeholder text leaking through to readers ("the Worthington Christian [[WINNING_TEAM_MASCOT]] defeated..."), repeated phrases like "high school football action," "close encounter of the athletic kind." Mocked virally; Gannett paused the program. ([Washington Post](https://www.washingtonpost.com/nation/2023/08/31/gannett-ai-written-stories-high-school-sports/), [CNN](https://www.cnn.com/2023/08/30/tech/gannett-ai-experiment-paused/index.html)). **Failure mode:** no human review on published output; template variable unfilled.

- **LA Times Quakebot 2017:** software glitch parsed a 1925 USGS record as a 2025 quake; tweeted "breaking news" of a quake that happened 92 years earlier. ([The Register](https://www.theregister.com/2017/06/22/la_times_bot_spreads_fake_news/)). **Failure mode:** a usually-reliable bot published something nobody verified because everyone trusted the bot.

- **The Atlantic OpenAI deal (May–Aug 2024):** ~60 staff including Adam Serwer, Caitlin Flanagan, Jerusalem Demsas and George Packer signed a letter protesting the partnership. Internal trust friction even when the AI use is licensing rather than authorship. ([WaPo](https://www.washingtonpost.com/style/media/2024/08/02/atlantic-writers-protest-ai/), [Futurism](https://futurism.com/atlantic-staff-unhappy-about-openai)). **Failure mode:** AI strategy that doesn't include the people producing the content.

- **Press Gazette live tracker** of AI journalism mistakes maintains a running list: [pressgazette.co.uk/publishers/digital-journalism/ai-journalism-mistakes/](https://pressgazette.co.uk/publishers/digital-journalism/ai-journalism-mistakes/). Worth bookmarking.

---

## 4. Voice + Audience-Building Patterns

**How 338Canada got to ~46K from a spreadsheet:** templated graphics, methodology transparency, cadence locked to events the audience already cares about (poll releases, writs), one consistent voice, never partisan, never funny when accuracy is on the line, cross-platform parity.

**How Canadaland built audience:** scoop-driven adversarial reporting against larger Canadian outlets, named-host voice (Jesse Brown), willingness to go on the record with corrections, paid-membership model that aligns incentives with reader trust rather than ad reach.

**How Reuters/CBC build trust through voice:** corrections published clearly, editorial standards published openly, AI usage published openly, no anonymous bylines on substantive work, clear separation of news and analysis. The throughline is *legibility* — a reader can always find out who said what, when, and why.

**What high-credibility accountability accounts do NOT do that low-credibility ones do:**
- They don't use ALL CAPS, fire emoji, "BREAKING:" on non-breaking content, or tabloid framing.
- They don't quote-tweet rage bait.
- They don't make the same complaint twice in a week.
- They don't pretend to have humans when they don't.
- They don't punch sideways at peer outlets.
- They don't auto-follow back en masse.
- They don't post on weekends if their data feed doesn't have weekend content (it looks like content for content's sake).

---

## 5. Failure Modes Specific to Civic News

1. **Fabricated authorship** (Sports Illustrated) — never. Parliament Audit must always cite "Parliament Audit" or a real name; never invent a journalist.
2. **Hidden AI** (CNET) — never. Match the CBC disclosure bar at minimum.
3. **Unfilled template variables** (Gannett) — kill-switch any post containing brackets, curly braces, "TBD," "[[", "{{", or unresolved Hansard placeholders.
4. **Stale-data publishing** (Quakebot 2017) — every automated post must include a date sanity-check; reject anything where the source-event date is more than N hours old unless the post is explicitly framed as historical.
5. **Partisan capture** — the moment a major party-affiliated commentator boosts our content as an attack on the other side, we need a "we cover X equally" rebalance post within 48 hours.
6. **Volume over accuracy** — better to publish 4 verified posts than 12 sloppy ones. Errors compound much faster than reach.
7. **Walking it back without explanation** — Canadian outlets that have quietly killed AI experiments without saying why have lost more trust than ones that ran the experiment publicly. If we ever pause part of our autonomy, we publish a note.

---

## 6. Lessons That Translate to a 10-Follower Account

**First-1000-followers patterns specific to civic accounts:**
- The first 1000 will not come from the algorithm. They will come from:
  - Replies and quote-posts on existing political-Twitter/Bluesky conversations where we add a verifiable data point.
  - Being followed-back by journalists, MPs, parliamentary staffers, and political-science academics — who care about source credibility, not engagement bait.
  - One viral hit driven by a *useful* artifact: a vote scorecard during a contentious vote, an attendance spreadsheet, a "what your MP did this week" template that lets people self-quote.
- 338Canada took ~2 years to break out of low-thousands during the 2019 federal-election cycle. Election cycles are growth windows.

**Voice tactics that earned credibility for similar small accounts:**
- Lead with the data, not the take.
- Cite the Hansard line / vote number / committee name in every post.
- Never get into a fight with named partisans.
- Post corrections in the same voice as the original post (no defensive tone).
- Have one named accountable human on the masthead even if the agents are doing 90% of the work.

**Differentiating from "another political bot account":**
- Bot accounts use stock images and emoji-heavy headlines; we use one branded chart format and no emoji.
- Bot accounts cycle topics randomly; we tie every post to a verifiable parliamentary event.
- Bot accounts hide their operator; we publish a "How Parliament Audit is built" page.
- Bot accounts engage everyone; we engage selectively (journalists, civic-tech, parliamentary staff).

**When to be transparent about agentic ops:** Now, and as a feature. The Sports Illustrated / CNET / Gannett record shows that hiding AI involvement is the highest-variance bad bet in modern journalism. The Canadaland / CBC pattern shows that publishing your AI policy is currently a *positive* trust signal in Canadian civic news. If we lead with "automated drafting + human editorial autonomy boundary" as part of the brand, we convert the agentic op from a vulnerability into a differentiator. Sub-10-follower accounts have nothing to lose by being unusually transparent — and the journalists we want to follow us are exactly the audience that rewards it.

---

## 7. Concrete Tactics to Adopt — Ranked by Impact

1. **Publish a "How Parliament Audit is Built" page now.** Match the CBC disclosure bar: what the AI does, what humans do, who the editorial-autonomy boundary owner is, what gets human review before publish, what error-correction looks like. Link it from every social-bio. This is the single highest-leverage move because it converts our biggest perceived vulnerability into a recruiting tool for credibility-conscious followers (journalists, academics, staffers).

2. **Adopt the 338Canada-style templated-visual unit.** Pick one chart (e.g., "Vote Scorecard: Bill C-XX, who voted yes/no/abstain by party") and make every published version visually identical. The repetition becomes the brand.

3. **Lock cadence to House sittings.** Post when the House sits, not when the algorithm wants content. Empty-day posting is the lowest-trust signal a civic account can send — see OpenParliament's terse-but-rare strategy as the floor and 338's event-driven daily updates as the ceiling.

4. **Run a Quakebot-pattern publishing pipeline.** Trigger off the official Hansard / Vote Detail XML feed -> agent drafts a templated post -> human (or autonomy-boundary check) reviews -> publish. Bracket-detection kill-switch on every post. Source-event-date sanity check on every post.

5. **Convert vote summaries into 60-second video explainers** using AI voiceover and Canadian House of Commons stock footage. Bluesky and X Premium both reward short video. Heliograf at WaPo proved that templated automation scales for race-by-race coverage; the same pattern works for vote-by-vote.

6. **Build a public "Parliament Audit Methodology" page modelled on 338Canada's transparency.** Document what we count as a "missed vote," how we attribute floor crossings, where the data comes from, how often it refreshes. Pin the link.

7. **Open the data.** Even a minimal CSV export of "MP voting records this session" published weekly is the kind of artifact that gets cited by journalists. GovTrack and OpenStates won by being-the-substrate; a Canadian gap exists exactly because OpenParliament hasn't aggressively marketed its API.

8. **Run a weekly "MP of the Week" or "Vote of the Week" thread** that profiles one MP's voting record using only Hansard-verifiable facts. Threads outperform single posts on X for new accounts and are quote-friendly. Differentiates from rage-content bot accounts because every claim is footnoted to a vote number.

9. **Reach out by email to ~30 named civic-tech and parliamentary-press contacts** (Mulley, Fournier, Aaron Wherry, Justin Ling, Paul Wells, parliamentary press gallery members, J-Source, Canadaland) with a one-paragraph "this exists, here's what's transparent about it, here's the data feed if you want it" — not a pitch, an offer.

10. **Publish a public corrections log.** Every automated outlet that has lost trust has done so because corrections were quiet. Make corrections loud, structured, and easy to find. This is the single biggest differentiator from "bot accounts."

---

## Sources

- [openparliament.ca/about](https://openparliament.ca/about/)
- [github.com/michaelmulley/openparliament](https://github.com/michaelmulley/openparliament)
- [@openparlca on X](https://x.com/openparlca)
- [338Canada Wikipedia](https://en.wikipedia.org/wiki/338Canada)
- [338Canada.ca Substack](https://www.338canada.ca/)
- [@338Canada on Mastodon](https://mastodon.world/@338Canada)
- [Canadaland AI policy](https://www.canadaland.com/canadalands-artificial-intelligence-policy/)
- [The Logic — About](https://thelogic.co/about/)
- [The Tyee — AI Is the Elephant in the Newsroom](https://thetyee.ca/News/2026/02/11/AI-Elephant-Newsroom/)
- [J-Source — AI in Canadian newsrooms](https://j-source.ca/ai-in-canadian-newsrooms-media-engaging-cautiously/)
- [CBC News AI guidelines](https://www.cbc.ca/news/editorsblog/cbc-news-artificial-intelligence-guidelines-9.6990760)
- [Village Media + AI (News Machines)](https://newsmachines.substack.com/p/village-media-spaces-local-ai)
- [Local newsrooms using AI on public meetings (Nieman Lab)](https://www.niemanlab.org/2025/03/local-newsrooms-are-using-ai-to-listen-in-on-public-meetings/)
- [GovTrack about](https://www.govtrack.us/about)
- [Joshua Tauberer site](https://joshdata.me/)
- [TheyWorkForYou about](https://www.theyworkforyou.com/about/)
- [mySociety TheyWorkForYou hub](https://www.mysociety.org/democracy/theyworkforyou-for-campaigners/theyworkforyou/)
- [OpenStates docs](https://docs.openstates.org/)
- [OpenStates about](https://openstates.org/about/)
- [Public.Resource.Org about](https://public.resource.org/about/)
- [Public.Resource.Org Wikipedia](https://en.wikipedia.org/wiki/Public.Resource.Org)
- [Carl Malamud — Internet Archive Hero Award 2022](https://blog.archive.org/2022/10/19/2022-internet-archive-hero-award-carl-malamud/)
- [AP automation — Poynter](https://www.poynter.org/reporting-editing/2015/robot-writing-increased-aps-earnings-stories-by-tenfold/)
- [Automated Insights Wikipedia](https://en.wikipedia.org/wiki/Automated_Insights)
- [LA Times Quakebot — Slate](https://slate.com/technology/2014/03/quakebot-los-angeles-times-robot-journalist-writes-article-on-la-earthquake.html)
- [LA Times Quakebot 1925 mistake — The Register](https://www.theregister.com/2017/06/22/la_times_bot_spreads_fake_news/)
- [Washington Post Heliograf — WaPo](https://www.washingtonpost.com/pr/wp/2016/08/05/the-washington-post-experiments-with-automated-storytelling-to-help-power-2016-rio-olympics-coverage/)
- [Heliograf — Poynter](https://www.poynter.org/tech-tools/2016/the-washington-post-is-using-robots-to-cover-the-olympics-and-the-election/)
- [Bloomberg Cyborg — AI Magazine](https://onlinelibrary.wiley.com/doi/full/10.1002/aaai.12181)
- [Forbes Bertie — CIO Dive](https://www.ciodive.com/news/all-about-bertie-overhauling-cms-technology-at-forbes/554871/)
- [Forbes Bertie — Digiday](https://digiday.com/media/forbes-built-a-robot-to-pre-write-articles-for-its-contributors/)
- [Reuters AI tools — WAN-IFRA](https://wan-ifra.org/2025/04/from-lab-to-newsroom-how-reuters-builds-ai-tools-journalists-actually-use/)
- [Quartz Bot Studio — Knight](https://knightfoundation.org/press/releases/quartz-bot-studio-will-experiment-with-new-ways-to-create-and-deliver-news-with-$240,000-from-knight-foundation/)
- [Quartz Messenger bot — Nieman Lab](https://www.niemanlab.org/2018/03/quartz-launches-a-facebook-messenger-bot-because-why-not-because-experimentation-because-people-like-messaging/)
- [Sports Illustrated AI bylines — CNN Business](https://edition.cnn.com/2023/11/27/media/sports-illustrated-deletes-articles-fake-author-names-ai-profile-photos)
- [Sports Illustrated AI — Futurism](https://futurism.com/sports-illustrated-ai-generated-writers)
- [Sports Illustrated AI — Fortune](https://fortune.com/2023/11/28/sports-illustrated-ai-written-articles-reporters-who-dont-exist/)
- [CNET AI label investigation — Futurism](https://futurism.com/cnet-ai-articles-label)
- [CNET Wikipedia downgrade — Futurism](https://futurism.com/wikipedia-cnet-unreliable-ai)
- [CNET plagiarism — Futurism](https://futurism.com/cnet-ai-plagiarism)
- [Gannett LedeAI sports — Washington Post](https://www.washingtonpost.com/nation/2023/08/31/gannett-ai-written-stories-high-school-sports/)
- [Gannett pause — CNN](https://www.cnn.com/2023/08/30/tech/gannett-ai-experiment-paused/index.html)
- [Atlantic OpenAI deal — Washington Post](https://www.washingtonpost.com/style/media/2024/08/02/atlantic-writers-protest-ai/)
- [Atlantic OpenAI deal — Futurism](https://futurism.com/atlantic-staff-unhappy-about-openai)
- [Press Gazette AI mistakes tracker](https://pressgazette.co.uk/publishers/digital-journalism/ai-journalism-mistakes/)
