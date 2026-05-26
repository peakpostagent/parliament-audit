# Crowdfunding & Donation Platforms for Parliament Audit

**Date:** 2026-05-25
**Author:** Research pass for Parliament Audit (parliamentaudit.ca)
**Scope:** Pick a way to accept voluntary reader contributions (tip-jar / patron model). No paywall. Mostly Canadian audience. No charity status yet. No monthly platform fees if avoidable. Tasteful, civic-media-credible branding — not "buy me a coffee influencer vibe."

---

## Section 1: Comparison table

| Platform | Platform fee | Processor fee | Recurring? | CAD-native? | Tax receipts | Branding fit | Donor privacy | Eligibility today |
|---|---|---|---|---|---|---|---|---|
| **Patreon** | 10% (new creators, post-Aug 2025) | ~2.9% + $0.30 + 2.5% FX if currency mismatch | Yes (primary model) | USD-default; CAD via Stripe Connect but FX risk for patrons | No | Heavy "creator" aesthetic; tier-pressure | Patron count public; names hidden unless opted in | Open |
| **Buy Me a Coffee** | 5% on memberships/shop; 0% on one-time tips | 2.9% + $0.30 (Stripe) + 0.5% payout | Optional | USD-default; supports CAD but FX losses common for CAD donors | No | Cutesy / influencer aesthetic — weakest fit for civic media | Supporter list shown by default; opt-out exists | Open |
| **Ko-fi** | 0% on tips; 5% on memberships/shop (waivable with $6/mo Gold) | 2.9% + $0.30 (Stripe/PayPal) | Optional | CAD supported as primary currency; less FX leakage than BMC | No | More flexible than BMC; can hide Ko-fi branding with Gold | Configurable; can hide supporter list | Open |
| **GitHub Sponsors** | 0% from personal sponsors; up to 6% from org sponsors | Stripe Connect fees apply (Canada supported) | Yes | Payouts in CAD via Stripe Connect | No | Open-source-adjacent — credible but niche; requires "contributes to OSS" framing | Sponsor visibility configurable | Requires open-source contribution narrative; PA could plausibly publish data/code on GitHub to qualify |
| **Stripe Payment Links** | 0% platform | 2.9% + C$0.30 domestic; PAD option: 1% + C$0.40 (cap C$5) | Yes (subscriptions) | Native CAD | No (custom-build only) | 100% Parliament Audit branding — no third-party logo | 100% private; only you see donors | Open; needs ~30 min setup |
| **PayPal donate button** | 2.89% + C$0.49 personal; 1.99% + C$0.59 charity rate | Included above | Yes | Native CAD | No (until charity status) | Old-fashioned; safe-feeling for older donors | Private | Open |
| **Liberapay** | 0% platform (donation-funded) | ~3.1% Stripe / ~5.1% PayPal avg | Yes (designed for it) | CAD-native via Stripe | No | Plain, utilitarian — strong civic / open-source credibility | Anonymous by default; donors can opt in to public listing | Open; ideologically aligned |
| **Donorbox** | 1.75% Standard plan (Pro: $139/mo for 1.5%) | 2.9% + $0.30 (cards); PAD 1% + C$0.40 | Yes | CAD-native; supports Canadian PAD | Yes — CRA-compliant receipts (charity status required) | Embeddable widget; can look like PA site | Private | Open to nonprofits; receipts require charity number |
| **CanadaHelps** | 3.0–4.9% all-in | Included | Yes | CAD-native | Yes (auto) | Government-style, very credible | Private | **Requires CRA registered charity status** — PA does not qualify today |
| **Zeffy** | 0% platform; runs on optional donor tips | 0% — Zeffy covers processor fees from tips | Yes | CAD-native, Canadian-built | Yes (if registered) | Clean, civic | Private | **Requires registered nonprofit/charity** — PA does not qualify today |
| **FundRazr** | 0% platform (optional tip model) or 5% fee-recovery | 2.9% + $0.30 (Stripe/PayPal) | Campaign-based | CAD-native (Vancouver-based) | Charity-mode only | Campaign-style — better for one-shot drives than ongoing support | Configurable | Open |
| **Substack paid subs** | 10% | 2.9% + $0.30 + 0.5% recurring | Yes | CAD supported via Stripe | No | Would require migrating content layer off parliamentaudit.ca — major branding loss | Private | Open but high switching cost |

---

## Section 2: Top 3 recommendations

### #1 — Stripe Payment Links (with a small supporter page on parliamentaudit.ca)

**Why:** It is the cheapest, most-branded, most-Canadian option. Domestic CAD card transactions are 2.9% + C$0.30 with no platform cut. Pre-Authorized Debit (PAD) is 1% + C$0.40 capped at C$5, which is dramatically cheaper than every other platform for recurring monthly support — a C$20/mo recurring donor costs ~C$0.60 in fees via PAD, vs. C$2.58 via Patreon. Payouts land in a Canadian bank account in CAD with no FX losses. The "donate" page lives at parliamentaudit.ca/support and is 100% Parliament Audit branding — no Ko-fi mascots, no Patreon tiers, no "Buy me a coffee!" emoji. Donors see a Stripe-hosted checkout, which is widely trusted and CRA-recognizable.

**Tradeoff:** No tax-receipt automation. Acceptable — Parliament Audit can't issue receipts anyway until charity registration. When that happens, migrate to Donorbox or Zeffy (see Section 4).

### #2 — Liberapay

**Why:** Zero platform fee, ideologically aligned with civic / open-source / journalism funding, anonymous-by-default donor list (strong for politically-sensitive readers who don't want their support for a parliamentary watchdog to be public), CAD support via Stripe. Liberapay is what civic-tech and open-data projects already use — it signals "we are a serious public-interest project," not "we are a creator." It is the strongest backup if the founder doesn't want to manage Stripe directly.

**Tradeoff:** UX is plain. Recurring only (no one-time donations). Donations are capped at $100/week per donor — fine for the current audience size, would limit major-donor flexibility later.

### #3 — Ko-fi (with Ko-fi Gold if it grows)

**Why:** If the founder doesn't want to touch Stripe directly and Liberapay's UX feels too sparse, Ko-fi is the least-bad creator-platform. 0% on tips, CAD-native option, and the page can be re-themed with PA colors. Better branding latitude than Buy Me a Coffee, lower fees than Patreon, no charity requirement.

**Tradeoff:** Still has visible Ko-fi branding on free tier (the coffee-cup mascot). Civic-media credibility is weaker than Stripe or Liberapay. Best as a *secondary* link ("you can also tip via Ko-fi") rather than the primary CTA.

---

## Section 3: Implementation steps for #1 (Stripe Payment Links)

### Account setup (one-time, ~30 min)

1. Go to stripe.com/en-ca and create a Stripe account using `peakpostagent@gmail.com`. Choose **Individual / Sole proprietor** business type (Parliament Audit is not yet incorporated).
2. Complete KYC: SIN or business number, Canadian bank account for CAD payouts, address verification.
3. Set account default currency to **CAD**. This is critical — it prevents FX losses on Canadian donor transactions.
4. Enable **Pre-Authorized Debit (PAD)** payments in the Stripe dashboard (Settings → Payment methods → Bank debits → ACSS Debit). PAD is dramatically cheaper than cards for recurring monthly donors.

### Create the donation payment links

In Stripe Dashboard → Payment Links → New:

1. **One-time support link**
   - Product name: "Support Parliament Audit"
   - Pricing: Customer chooses amount, suggested amounts C$5 / C$15 / C$50 / C$100, currency CAD
   - Payment methods: Card + Apple Pay + Google Pay + ACSS Debit
   - Confirmation page: redirect to `parliamentaudit.ca/support/thanks`
   - Collect: email (for thank-you note), optional name
2. **Monthly recurring link**
   - Same product, but Pricing → Recurring → Monthly
   - Suggested tiers: C$5/mo, C$10/mo, C$25/mo
   - Strongly preference ACSS Debit in the checkout (custom payment method ordering) so donors pick the cheaper rail
3. **Annual recurring link** (optional, useful for donors who hate monthly billing)
   - Same, but yearly billing

Save the three URLs.

### Site integration

Parliament Audit already has the site on Railway with a `/support` page (per existing structure). Update it to:

1. **Headline:** "Help keep Parliament Audit independent."
2. **Body (~100 words):** what the contribution funds (hosting, time, data sources), explicit statement that this is *not* tax-deductible yet, link to editorial direction / mission.
3. **Three buttons:** "Give once" / "Monthly support" / "Yearly support" — each links to the corresponding Stripe Payment Link.
4. **Footer note:** "Payments processed by Stripe. Parliament Audit is an unincorporated civic-media project; contributions are not currently tax-deductible. We are working toward registered nonprofit status — see roadmap." This is the legally-honest framing per CRA rules around solicitation language.

### Linking from the rest of the site

- **Header:** small "Support" link in main nav (no aggressive CTA — civic-media tone, not SaaS landing page).
- **Article footers:** a one-line tasteful nudge: "Parliament Audit is reader-supported. If this article was useful, [contribute](/support)."
- **Social bios:** add `parliamentaudit.ca/support` to X, Bluesky, Mastodon, LinkedIn profiles.
- **No popups, no modals, no "you've read 3 articles this month" gates.** This is a tip jar, not a paywall.

### Environment / secrets

Stripe Payment Links require **no code** and **no env vars** for the basic flow — they are fully-hosted by Stripe. Optional later:

- `STRIPE_WEBHOOK_SECRET` — if you later want to log donations to your own database or send custom thank-you emails via Resend / Postmark.
- `STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` — only if you eventually embed Stripe Elements directly on the site instead of redirecting to Stripe-hosted checkout.

Set these in the Railway project's environment variables panel when/if needed. The minimum viable launch needs neither.

### Operational hygiene

- Connect Stripe to the project's accounting (even if it's just a Google Sheet for now). Export monthly CSVs.
- Set up a weekly Stripe email digest in Dashboard → Notifications.
- Consider a "transparency" line on /support: "As of [date], Parliament Audit receives $X/month in reader support, covering Y% of hosting and tooling costs." This is on-brand for a parliamentary-accountability project.

---

## Section 4: Things to revisit later

### When to pursue charity / nonprofit status

The pathway is **federally incorporate as a nonprofit** (Canada Not-for-profit Corporations Act, ~$200 + ~1 week) → then **apply to CRA for registered charity status** (months, paperwork-heavy). Charity status unlocks:

- Tax-receipt issuance — meaningful at ~$50+ contributions, where the tax-deductibility roughly doubles the donor's psychological willingness.
- Migration to **Zeffy** (literally zero fees) or **CanadaHelps** (3–5% all-in but high-trust). Zeffy would be the unambiguous best post-charity option.
- Foundation grant eligibility (Inspirit, McConnell, Trottier, etc. — relevant for civic-media projects).

**Trigger for charity application:** when monthly recurring revenue crosses ~C$500/mo, or when a single donor asks for a tax receipt. Both signal that the receipting friction is now costing more than the legal-setup cost. Until then, Stripe is fine.

### When tiered memberships make sense

The current audience (~10 + 3 + 4 social followers, ~20 weekly visitors) is too small for tiers. Tiered memberships (Patreon-style) make sense at roughly **500+ engaged readers** when there is exclusive content or community to deliver behind a tier. Until then, a single "support us" ask outperforms tiered models — fewer decisions for the donor means higher conversion.

**Future tier concepts** (only when scale justifies them):

- "Citizen" — $5/mo, name in the supporters list (opt-in)
- "Watchdog" — $25/mo, early access to deep-dive vote analyses
- "Patron" — $100/mo, invitation to quarterly Zoom Q&A on Parliament's voting record

If/when these get built, the cleanest place is still Stripe (Stripe Billing handles tiered subscriptions natively, no Patreon 10% required).

### Secondary platforms to add later, not now

- **GitHub Sponsors** once Parliament Audit publishes its scraping / data-pipeline code as open source. This taps an entirely different donor pool (developers who fund civic-tech infrastructure) and has zero fees from individuals.
- **Liberapay** as a parallel option for ideologically-aligned donors who specifically prefer fee-free, recurring-only models. Cheap to maintain alongside Stripe.

### Avoid permanently

- **Patreon** — fee structure is hostile, and the brand association (creator-economy / tiered fandom) actively undermines a parliamentary-accountability product's credibility.
- **Buy Me a Coffee** — same issue, worse branding.
- **Substack paid subs** — would force migrating the content layer off parliamentaudit.ca and surrender the editorial branding that is Parliament Audit's main asset.

---

## Sources

- [Ko-fi pricing — 2026 plan comparison (SchoolMaker)](https://www.schoolmaker.com/blog/ko-fi-pricing)
- [Ko-fi help — Does Ko-fi take a fee?](https://help.ko-fi.com/hc/en-us/articles/360002506494-Does-Ko-fi-take-a-fee)
- [Buy Me a Coffee — how to calculate charges](https://help.buymeacoffee.com/en/articles/8105744-how-to-calculate-charges-on-your-payment)
- [Patreon — Creator fees overview](https://support.patreon.com/hc/en-us/articles/11111747095181-Creator-fees-overview)
- [Patreon — standard platform fee for new creators (post-Aug 2025)](https://support.patreon.com/hc/en-us/articles/36426991446797-A-standard-platform-fee-for-new-creators-effective-after-August-4-2025)
- [Liberapay — Introduction](https://en.liberapay.com/about/)
- [Liberapay — Privacy](https://en.liberapay.com/about/privacy)
- [Liberapay blog — Lifting the veil of anonymity](https://medium.com/liberapay-blog/lifting-the-veil-of-anonymity-479dadd369be)
- [Donorbox — Canadian PAD donations](https://donorbox.org/nonprofit-blog/accepting-donations-via-acss-debits)
- [Donorbox — pricing](https://donorbox.org/pricing)
- [CanadaHelps — fees](https://www.canadahelps.org/en/why-canadahelps/our-fees/)
- [CanadaHelps — Charity Validation Policy](https://www.canadahelps.org/en/charity-validation-policy/)
- [Stripe — Canadian pricing (StackTidy)](https://www.stacktidy.com/tools/stripe/pricing/canada)
- [Stripe — payment links](https://stripe.com/en-ca/payments/payment-links)
- [GitHub Docs — sponsorships, fees, and taxes](https://docs.github.com/en/sponsors/sponsoring-open-source-contributors/about-sponsorships-fees-and-taxes)
- [PayPal Canada — accepting donations as individuals](https://www.paypal.com/ca/non-profit/fundraising/individuals)
- [Zeffy — pricing model](https://support.zeffy.com/how-is-zeffy-free)
- [Zeffy — best fundraising platforms in Canada 2026](https://www.zeffy.com/blog/best-online-donation-platforms-canada)
- [FundRazr — pricing & fees](https://fundrazr.com/pages/pricing-fees)
- [Substack — pricing](https://support.substack.com/hc/en-us/articles/360037607131-How-much-does-Substack-cost)
