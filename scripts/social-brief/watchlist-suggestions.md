# Watchlist handle resolution — 2026-04-24

Ran `resolve-watchlist.ts` against 27 watchlist entries. For each speculative handle, either confirms it resolves or surfaces the top Bluesky search hits for manual selection.

For each suggestion you agree with: edit `scripts/social-brief/watchlist.json` to swap the handle + drop the `resolveable: true` flag.

---

## ❌ `paulwellsinc.bsky.social` (Paul Wells) — no resolve

Searching Bluesky for "Paul Wells"…

| Handle | Display name | Followers | Bio snippet |
|---|---|---|---|
| @mattwells.com | Matt Wells | — | dad, spouse, sacred harp singer he/him.   St Paul MN |
| @paulsandles.bsky.social | Paul Sandles | — | UK legal librarian, village cricketer, classical music, history, archives, Tunbr |
| @justinleites.bsky.social | Leites | — | Some of my heroes are John Quincy Adams, Ida B. Wells, Louis Brandeis, Walter Re |
| @paulaplinontax.bsky.social | Paul Aplin | — | Writer/speaker on tax & technology; Deputy President CIOT; past President ICAEW; |

- action: if any of the above is the real person, edit `journalists` entry in `watchlist.json`:
    - change `handle` to the correct Bluesky handle
    - drop the `resolveable: true` flag
- if none match: leave as-is (person may not be on Bluesky)

## ✅ `aaronwherry.bsky.social` (Aaron Wherry) — resolves

- did: `did:plc:yge3sr4i2ffsta2unrjbriy6`
- action: drop `resolveable: true` from `journalists` entry

## ✅ `althiaraj.bsky.social` (Althia Raj) — resolves

- did: `did:plc:3d7jhjt7mjj4wgavpltygjzx`
- action: drop `resolveable: true` from `journalists` entry

## ✅ `rosiebarton.bsky.social` (Rosemary Barton) — resolves

- did: `did:plc:fmdnhvn23v5pvjy4lzamuo3r`
- action: drop `resolveable: true` from `journalists` entry

## ❌ `chantalhebert.bsky.social` (Chantal Hébert) — no resolve

Searching Bluesky for "Chantal Hébert"…

| Handle | Display name | Followers | Bio snippet |
|---|---|---|---|
| @chebert18.bsky.social | Chantal Hébert | — | Journaliste politique/CBC At Issue/Les Coulisses du pouvoir et C est bien meille |
| @bougre.bsky.social | — | — | Je suis gaucher, et gauche. Un autre gars cisgenre blanc qui aime le Canadien. M |

- action: if any of the above is the real person, edit `journalists` entry in `watchlist.json`:
    - change `handle` to the correct Bluesky handle
    - drop the `resolveable: true` flag
- if none match: leave as-is (person may not be on Bluesky)

## ✅ `338canada.bsky.social` (Philippe J. Fournier) — resolves

- did: `did:plc:ho4h4vhrwpohqtgd7ovjx6zo`
- action: drop `resolveable: true` from `journalists` entry

## ✅ `davidakin.bsky.social` (David Akin) — resolves

- did: `did:plc:jvbp4nezylu5n44nkjnimsxf`
- action: drop `resolveable: true` from `journalists` entry

## ✅ `jesse-brown.bsky.social` (Jesse Brown) — resolves

- did: `did:plc:4ycniy5z2ds2dkyes4ol2n66`
- action: drop `resolveable: true` from `journalists` entry

## ❌ `stpheathen.bsky.social` (Stephen Maher) — no resolve

Searching Bluesky for "Stephen Maher"…

| Handle | Display name | Followers | Bio snippet |
|---|---|---|---|
| @stephenmaher.bsky.social | Stephen Maher | — | Journalist, novelist. Nova Scotian.  |

- action: if any of the above is the real person, edit `journalists` entry in `watchlist.json`:
    - change `handle` to the correct Bluesky handle
    - drop the `resolveable: true` flag
- if none match: leave as-is (person may not be on Bluesky)

## ❌ `jenstgerman.bsky.social` (Jen Gerson) — no resolve

Searching Bluesky for "Jen Gerson"…

_No search hits. Might not be on Bluesky yet._

- action: if any of the above is the real person, edit `journalists` entry in `watchlist.json`:
    - change `handle` to the correct Bluesky handle
    - drop the `resolveable: true` flag
- if none match: leave as-is (person may not be on Bluesky)

## ✅ `mattgurney.bsky.social` (Matt Gurney) — resolves

- did: `did:plc:s5275lopexz5oekqemrkrp2w`
- action: drop `resolveable: true` from `journalists` entry

## ✅ `markcarney.bsky.social` (Mark Carney) — resolves

- did: `did:plc:kyvd3zkbcx77epszpeyyxz7k`
- action: drop `resolveable: true` from `mps_leaders` entry

## ✅ `pierrepoilievre.bsky.social` (Pierre Poilievre) — resolves

- did: `did:plc:az3eqxypt43vdzkmcouu5rzf`
- action: drop `resolveable: true` from `mps_leaders` entry

## ✅ `jagmeetsingh.bsky.social` (Jagmeet Singh) — resolves

- did: `did:plc:5mytqinomncuprnvqj4uktyy`
- action: drop `resolveable: true` from `mps_leaders` entry

## ✅ `yfblanchet.bsky.social` (Yves-François Blanchet) — resolves

- did: `did:plc:csuf5t2a44ktlh5clnhnuppx`
- action: drop `resolveable: true` from `mps_leaders` entry

## ✅ `liberal.bsky.social` (Liberal Party of Canada) — resolves

- did: `did:plc:nzvzpnd75awz6zyc26dqirsm`
- action: drop `resolveable: true` from `parties` entry

## ❌ `cpc-pcc.bsky.social` (Conservative Party of Canada) — no resolve

Searching Bluesky for "Conservative Party of Canada"…

| Handle | Display name | Followers | Bio snippet |
|---|---|---|---|
| @maribluewho.bsky.social | 🇺🇦 🇨🇦 No1Uno -A Nasty Canadian 🇨🇦 🇺🇦 | — |  A Proud & Nasty part owner of Canada, Saskatchewan left winger living in SK Par |
| @stevehives.bsky.social | 🇨🇦SteveHives | — | Proud 🇨🇦husband, dad and grandpa…Retired educator…Woke as shit…Conservative Pa |
| @thepirate.bsky.social | The Happy Vintner | — | Proud Canadian, grape grower, Liberals liberal, lover of wine and cheese, despis |
| @cpc-hq.bsky.social | Not the Conservative Party of Canada | — | If the conservative party wishes this handle please contact me.  I want at least |

- action: if any of the above is the real person, edit `parties` entry in `watchlist.json`:
    - change `handle` to the correct Bluesky handle
    - drop the `resolveable: true` flag
- if none match: leave as-is (person may not be on Bluesky)

## ✅ `ndp.bsky.social` (New Democratic Party) — resolves

- did: `did:plc:bme4tqprdnvwvjbt4zv2nddk`
- action: drop `resolveable: true` from `parties` entry

## ✅ `blocquebecois.bsky.social` (Bloc Québécois) — resolves

- did: `did:plc:3nwcobjc72lpsmormnmwp4yf`
- action: drop `resolveable: true` from `parties` entry

## ❌ `greenpartyofcanada.bsky.social` (Green Party of Canada) — no resolve

Searching Bluesky for "Green Party of Canada"…

| Handle | Display name | Followers | Bio snippet |
|---|---|---|---|
| @elizabethemay.bsky.social | Elizabeth May | — |  @canadiangreens.bsky.social MP-Saanich-Gulf Islands, Activist, Author, Mother & |
| @nonlinearbotanist.bsky.social | George | — | Baroque mind that loves Baroque music. Broken mind that loves breakaway minds. I |
| @canadiangreens.bsky.social | Green Party of Canada | Parti Vert du Canada | — | Official page of the GPC \| A voice for the voiceless. If you want change, vote f |
| @junenorthey.bsky.social | June Northey 🏳️‍⚧️ | — | She/Her. Parent of 4, grandparent of 7, former Green Party of Ontario & Green Pa |
| @victoriagreens.bsky.social | Victoria Greens | — | Green Party of Canada EDA for the riding of Victoria on the traditional territor |

- action: if any of the above is the real person, edit `parties` entry in `watchlist.json`:
    - change `handle` to the correct Bluesky handle
    - drop the `resolveable: true` flag
- if none match: leave as-is (person may not be on Bluesky)

## ✅ `democracywatch.bsky.social` (Democracy Watch) — resolves

- did: `did:plc:rgppac643c7kx6qwikiptvw4`
- action: drop `resolveable: true` from `advocacy_watchdogs` entry

## ❌ `ctffca.bsky.social` (Canadian Taxpayers Federation) — no resolve

Searching Bluesky for "Canadian Taxpayers Federation"…

_No search hits. Might not be on Bluesky yet._

- action: if any of the above is the real person, edit `advocacy_watchdogs` entry in `watchlist.json`:
    - change `handle` to the correct Bluesky handle
    - drop the `resolveable: true` flag
- if none match: leave as-is (person may not be on Bluesky)

## ❌ `policyalternatives.bsky.social` (CCPA) — no resolve

Searching Bluesky for "CCPA"…

| Handle | Display name | Followers | Bio snippet |
|---|---|---|---|
| @policyalternatives.ca | CCPA — Canadian Centre for Policy Alternatives | — | The CCPA is Canada's leading progressive policy research institute. We offer ind |
| @1alexhemingway.bsky.social | Alex Hemingway | — | Senior Economist @bcpolicy.bsky.social. PhD @UBCPoliSci. Former CCPA-BC. Social, |
| @ccpabc.bsky.social | CCPA-BC | — | Social, economic and environmental justice. Canadian Centre for Policy Alternati |
| @ershaker.bsky.social | Erika Shaker | — | Director, CCPA National Office  https://bsky.app/profile/policyalternatives.bsky |
| @csaulnier.bsky.social | Christine Saulnier (she/her) | — | CCPA-NS Director; mom of 3; PhD poli sci; Acadian; justice-seeker; equity promot |

- action: if any of the above is the real person, edit `advocacy_watchdogs` entry in `watchlist.json`:
    - change `handle` to the correct Bluesky handle
    - drop the `resolveable: true` flag
- if none match: leave as-is (person may not be on Bluesky)

## ❌ `fraserinstitute.bsky.social` (Fraser Institute) — no resolve

Searching Bluesky for "Fraser Institute"…

| Handle | Display name | Followers | Bio snippet |
|---|---|---|---|
| @fraserofallander.org | Fraser of Allander Institute | — | The Fraser of Allander Institute at the University of Strathclyde is an independ |
| @drjuliefraser.bsky.social | Dr Julie Fraser | — | Aussie lawyer, PhD international law, Netherlands institute of human rights, cat |
| @christophraser.bsky.social | Christophe Fraser's Group | — | Posts from the research group of Christophe Fraser, Professor and Head of Data,  |
| @scothealtheq.bsky.social | Scottish Health Equity Research Unit | — | A collaboration between the Fraser of Allander Institute and the Centre for Heal |
| @pipps.bsky.social | Pacific Institute on Pathogens, Pandemics and Society | — | We're a research institute based at Simon Fraser University, focused on strength |

- action: if any of the above is the real person, edit `advocacy_watchdogs` entry in `watchlist.json`:
    - change `handle` to the correct Bluesky handle
    - drop the `resolveable: true` flag
- if none match: leave as-is (person may not be on Bluesky)

## ✅ `ourcommons.bsky.social` (House of Commons (unofficial?)) — resolves

- did: `did:plc:nf47wnrsktbnel63lziqgqgd`
- action: drop `resolveable: true` from `primary_sources` entry

## ❌ `parl-canada.bsky.social` (Parliament of Canada) — no resolve

Searching Bluesky for "Parliament of Canada"…

| Handle | Display name | Followers | Bio snippet |
|---|---|---|---|
| @kellyrobson.com | Kelly Robson | — | Science fiction, fantasy, and horror writer. Gods, Monsters, and the Lucky Peach |
| @anitavandenbeld.bsky.social | Anita Vandenbeld | — | I am the Liberal Member of Parliament (MP) for Ottawa West-Nepean (Canada). This |
| @maloneyj.bsky.social | James Maloney | — | Member of Parliament for Etobicoke Lakeshore, Parliamentary Secretary to the Min |
| @alexandramendes.bsky.social | Alexandra Mendes | — | Députée fédérale / Member of Parliament Brossard - Saint-Lambert (QC) Canada 🇨� |
| @aryacanada.bsky.social | Chandra Arya | — | Former Member of Parliament, Canada (2015-2025) Unapologetically Hindu. Resolute |

- action: if any of the above is the real person, edit `primary_sources` entry in `watchlist.json`:
    - change `handle` to the correct Bluesky handle
    - drop the `resolveable: true` flag
- if none match: leave as-is (person may not be on Bluesky)

---

## Summary

- Resolved: **16 / 27**
- Still unresolved (marked speculative): **10**

Watchlist totals by group:
- journalists: 12
- mps_leaders: 4
- parties: 5
- advocacy_watchdogs: 4
- primary_sources: 2