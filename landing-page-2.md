# LP2: Done-For-You Service — Complete Build Spec

**Route:** `ctme.io/` (this is the default/root landing page)
**Conversion destination:** `https://book.ctme.io/consultation`
**File:** `src/app/page.tsx`

---

## Campaign Context

**Google Campaigns:** High-intent service keywords ("crypto tax accountant", "crypto tax service", "crypto tax help", "DeFi tax help")
**Meta Campaigns:** The Overwhelm / Time Savings Campaign (crypto interest targeting, engaged shoppers)
**This is the broadest ICP and the default page.** If someone hits ctme.io with no path, this is what they see. It needs to work for the overwhelmed DeFi degen AND the doctor who bought Bitcoin on Coinbase and doesn't know what Form 8949 is.

---

## Audience Profile

**Who they are:** Crypto investor/trader who has decided they need professional help. May or may not have tried software. Values time over cost savings. Transaction volume makes DIY impractical (500+). Could be a DeFi power user or a simple multi-exchange holder.

**Emotional state:** Overwhelmed. Willing to pay. Looking for someone they can trust with sensitive financial data. Possibly relieved this service exists.

**What they've tried:** Software that confused them, a CPA who said "I don't do crypto", nothing (and the deadline is approaching), or they're returning from a prior year.

---

## Section-by-Section Build Spec

All sections render in this order in `src/app/page.tsx`. Every section is a Server Component import unless noted. The page itself is a Server Component.

```tsx
// src/app/page.tsx
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/sections/Hero'
import { SocialProofBar } from '@/components/sections/SocialProofBar'
import { ProblemSection } from '@/components/sections/ProblemSection'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Testimonials } from '@/components/sections/Testimonials'
import { WhyCTME } from '@/components/sections/WhyCTME'
import { FAQ } from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/layout/Footer'
import { FloatingMobileCTA } from '@/components/layout/FloatingMobileCTA'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProofBar />
        <ProblemSection />
        <HowItWorks />
        <Testimonials />
        <WhyCTME />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingMobileCTA />
    </>
  )
}
```

---

### 1. NAVBAR

**Component:** `Navbar.tsx` (Server) + `NavbarClient.tsx` (Client island for scroll morph)

**Nav anchors (scroll links):**
- "How It Works" → `#how-it-works`
- "Results" → `#results`
- "FAQ" → `#faq`

**CTA button:** "Get Your Free Quote" → `https://book.ctme.io/consultation?utm_content=navbar`

**Logo text:** "CTME" or "Crypto Tax Made Easy" wordmark in `font-heading font-bold`

---

### 2. HERO

**Component:** `Hero.tsx` (Server Component)
**Section ID:** none (it's the top of the page, no anchor needed)
**Background:** `bg-ctme-void` with subtle radial gradient glow centered behind the hero stat. CSS-only: `bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08)_0%,transparent_70%)]`.

**Exact copy:**

```
[Monospace label]
CRYPTO TAX SPECIALISTS

[Headline]
Your Crypto Taxes, Done For You.

[Hero stat — the visual anchor]
$21.8M+
[Stat subtext: in tax savings for our clients]

[Subheadline]
We manually review every transaction, fix what software gets wrong,
and deliver an audit-ready report your accountant can file.
Flat-rate pricing. 20 minutes of your time.

[Trust strip — inline row, mono font, muted color]
★ 4.96 Average Review   ·   200+ Clients   ·   5+ Years Experience

[Primary CTA]
Get Your Free Quote →

[Secondary CTA — ghost/outline button]
See How It Works ↓  (scrolls to #how-it-works)
```

**Design notes:**
- The "$21.8M+" stat uses `text-hero-stat` (clamp 2.5rem to 5rem), `font-heading font-bold`, with `text-ctme-text`
- The "+" should be in `text-ctme-accent` for visual pop
- "in tax savings for our clients" is `font-mono text-label text-ctme-muted uppercase` directly below the stat
- Subheadline: `text-body-lg text-ctme-subtext max-w-2xl`
- Layout: centered on both mobile and desktop. Vertically centered in the viewport with `min-h-[85vh] flex flex-col items-center justify-center text-center`
- CTA buttons: centered, stacked on mobile (`flex flex-col sm:flex-row gap-4`)

**CTA destination:** `https://book.ctme.io/consultation?utm_content=hero`

---

### 3. SOCIAL PROOF BAR

**Component:** `SocialProofBar.tsx` (Server Component)

**Exact items (left to right):**

```
$21.8M+ Tax Savings   ·   200+ Clients Served   ·   4.96★ Reviews   ·   5+ Years Experience   ·   USA · AU · CA · UK · NZ
```

**Design:**
- `py-5 border-y border-ctme-border`
- `font-mono text-label uppercase tracking-widest text-ctme-muted`
- Items separated by `·` with `mx-4` spacing
- On mobile: `overflow-x-auto whitespace-nowrap` horizontal scroll, or break into 2-row grid
- No links. No interaction. Pure ambient credibility.

---

### 4. PROBLEM SECTION — "The Agitation"

**Component:** `ProblemSection.tsx` (Server Component)
**Background:** `bg-ctme-surface`

**Exact copy:**

```
[Section label — mono, accent]
THE PROBLEM

[Headline]
Crypto Taxes Are a Nightmare. They Don't Have to Be.

[Subtext — 2 sentences, body-lg, subtext color]
Thousands of transactions across multiple exchanges, wallets, and chains.
DeFi, NFTs, airdrops, perps. Your accountant has never heard of half of it.
```

**3 Problem Cards** (`md:grid-cols-3 gap-6`):

**Card 1: "Your CPA Can't Help"**
- Icon: user-x (amber/warning)
- Heading: Your Accountant Doesn't Understand Crypto
- Body: Most CPAs have zero training on digital assets. They'll tell you to "just report what you put in and what it's worth now." That advice could cost you tens of thousands in overpaid taxes.

**Card 2: "Software Gets It Wrong"**
- Icon: alert-triangle (amber/warning)
- Heading: Tax Software Overreports Your Gains
- Body: 90% of the time, crypto tax software overestimates your capital gains. Wallet transfers get classified as sales. LP deposits get reported as disposals. You end up with a tax bill that's way higher than it should be.

**Card 3: "DIY Takes Forever"**
- Icon: clock (amber/warning)
- Heading: Doing It Yourself Takes Weeks
- Body: If you've got 1,000+ transactions across multiple chains, manual reconciliation is a full-time job. Most people start, get overwhelmed, and either give up or file something inaccurate.

**Below cards — stat callout block:**
```
[Large accent-colored stat]
90%
[Subtext]
of crypto tax software overestimates your capital gains.
We fix that.
```

Design: `bg-ctme-subtle border border-ctme-border rounded-2xl p-8 text-center`. The "90%" is `text-hero-stat text-ctme-accent font-heading`. Subtext is `text-body-lg text-ctme-subtext`.

**CTA:** "See How Much You Could Save →" → `https://book.ctme.io/consultation?utm_content=problem-section`

---

### 5. HOW IT WORKS

**Component:** `HowItWorks.tsx` (Server Component)
**Section ID:** `id="how-it-works"`
**Background:** `bg-ctme-void`

**Exact copy:**

```
[Section label]
HOW IT WORKS

[Headline]
4 Steps. 20 Minutes of Your Time. Done.
```

**4 Steps** (horizontal timeline on desktop, vertical on mobile):

**Step 1:**
- Number: `01` (accent, mono, large)
- Time badge: `~20 min` (small pill, `bg-ctme-accent/10 text-ctme-accent`)
- Heading: Quick Setup
- Body: Connect your wallets and exchanges to our recommended crypto tax software and grant us accountant-level access. That's it. That's your part.

**Step 2:**
- Number: `02`
- Time badge: `~24 hrs`
- Heading: Fixed-Price Quote
- Body: Our team reviews your situation and sends one flat, all-in price. No hourly billing. No scope creep. No surprise invoices.

**Step 3:**
- Number: `03`
- Time badge: `~1-2 weeks`
- Heading: Specialist Reconciliation
- Body: A trained crypto tax specialist manually reconciles every transaction using our proprietary process. DeFi, NFTs, multi-chain, perps, airdrops. Everything.

**Step 4:**
- Number: `04`
- Time badge: `Same day`
- Heading: Audit-Ready Report
- Body: You receive a clean report your CPA can plug directly into your return. We support your CPA if they have questions. You're done.

**Design notes:**
- Desktop: 4-column grid with a connecting line (1px accent border or dotted line) running horizontally through the step numbers
- Mobile: vertical stack with connecting line running vertically on the left
- Step numbers: `font-mono text-3xl font-bold text-ctme-accent`
- Time badges: inline pills above or beside each step number
- Card style: `bg-ctme-surface border border-ctme-border rounded-2xl p-6`

**CTA:** "Get Your Free Quote →" → `https://book.ctme.io/consultation?utm_content=how-it-works`

---

### 6. TESTIMONIALS

**Component:** `Testimonials.tsx` (Server Component)
**Section ID:** `id="results"`
**Background:** `bg-ctme-surface`

**Exact copy:**

```
[Section label]
CLIENT RESULTS

[Headline]
What Happens When We Review Your Report

[Aggregate badge — accent border pill]
★ Rated 4.96 Stars  ·  200+ Reviews
```

**Testimonial Cards** (offset/masonry grid, 2 cols desktop, 1 col mobile):

**Card 1 — Jake (FEATURED, largest card):**
```
[Before/After stat block at top of card]
Software reported: $30,000-$40,000 profit
After our review: $14,000 loss
[Divider]

"The Crypto Taxes Made Easy team made it incredibly easy for me to prepare tax reports for all cryptocurrency and NFT activity. I dealt with around 4,000 transactions. I tried doing the crypto taxes by myself, but couldn't decipher the different terminology inside Koinly. I felt overwhelmed. Crypto Taxes Made Easy took the reins."

— Jake, Verified Client
★★★★★
```

**Card 2 — Jef:**
```
"I entered the DeFi world focused on pushing buttons and chasing profit. Months passed before I realized the tax side could be huge. CryptoTaxMadeEasy.com arrived as a done-for-you option, and I signed up without hesitation. The price paid for crypto tax services felt more than fair for what I received. I prepay every year to stay first in line."

— Jef, Verified Client
★★★★★
```

**Card 3 — Corey:**
```
"Thanks Matt! You saved me so much stress and many hours of trying to figure out my taxes this year. I had a lot of transactions and more than just basic swapping of coins. DeFi staking, liquidity pools, NFTs. These can get very complicated. Once I decided to just do the 'Crypto Done For Me,' Matt made things easy."

— Corey, Verified Client
★★★★★
```

**Card 4 — Richee:**
```
"The service provided by CTME was exceptional. I had nearly 4,000 transactions and was completely lost in how to accurately report this on my taxes. Not only did my report come in timely, I went from a capital gains to a capital loss position allowing me to deduct from my taxable income. My tax savings more than paid for the cost of the service."

— Richee, Verified Client
★★★★★
```

**Design notes:**
- Jake's card is the "hero" testimonial, gets a `col-span-2` on desktop or a larger card treatment with the before/after stat block at the top
- Before/after stat block: two columns inside the card. Left: "Software reported" with red/warning text. Right: "After our review" with green/accent text. Bold numbers.
- Quote marks: large `"` in accent color, `text-5xl font-heading`, positioned as a decorative element
- Star rows: 5 inline SVG stars in `text-ctme-accent`
- "Verified Client" label: `font-mono text-label text-ctme-muted`
- If video testimonials for Jake and Jef are available (YouTube embeds): embed with `loading="lazy"`, poster thumbnail, and a play button overlay. Videos go ABOVE the quote text in their respective cards.

**CTA:** "Join 200+ Clients Who Stopped Overpaying →" → `https://book.ctme.io/consultation?utm_content=testimonials`

---

### 7. WHY CTME — "The Differentiation"

**Component:** `WhyCTME.tsx` (Server Component)
**Background:** `bg-ctme-void`

**Exact copy:**

```
[Section label]
WHY CTME

[Headline]
Crypto-Native. Not Crypto-Adjacent.
```

**Use Option A: Three-column comparison** (this is LP2's broadest audience, the comparison makes the case clearly):

| | Your CPA | Tax Software | CTME |
|---|---|---|---|
| Pricing | $300-500/hr | $49-299/yr | Flat rate per engagement |
| Crypto expertise | Minimal to none | Automated only | Crypto-native team |
| DeFi/NFT handling | "How much did you put in?" | Breaks on complex activity | Manual review of every transaction |
| Accuracy | Depends on their knowledge | 90% overreport gains | Audit-ready, manually verified |
| Your time investment | Hours of explanation | Hours of fixing errors | 20 minutes |
| Result | Risky return, high cost | Inflated tax bill | Accurate report, maximum savings |

Design: Three cards or columns. CTME column gets `border-ctme-accent` border and a subtle accent glow. CPA and Software columns are `border-ctme-border` with muted text showing their weaknesses.

For each row, CPA and Software columns show the pain (muted, `text-ctme-muted`), CTME column shows the win (`text-ctme-text`, key phrases in `text-ctme-accent`).

**Below comparison — coverage grid:**

```
[Subheading]
Every Type of Crypto Activity. Handled.
```

Grid of capability pills:
`DeFi` `NFTs` `Solana` `Bitcoin Ordinals` `BRC-20` `Hyperliquid` `On-Chain Perps` `Multi-Chain` `Bridges` `Airdrops` `Mining` `Staking` `Yield Farming` `Liquidity Pools`

Each pill: `bg-ctme-subtle border border-ctme-border rounded-full px-4 py-2 font-mono text-label text-ctme-subtext`. On hover: `border-ctme-accent/30 text-ctme-text`.

**Authority logos row:**
Binance · CoinTelegraph · CryptoNews · NGMI Podcast · Australian Crypto Convention

Logos: inline SVG, `opacity-40 hover:opacity-70 transition-opacity`, horizontal row with spacing. `font-mono text-label` if using text instead of logo files.

**Countries supported:**
`USA · Australia · Canada · UK · New Zealand` — below the authority logos, `font-mono text-label text-ctme-muted`

**CTA:** "See What Accurate Crypto Tax Looks Like →" → `https://book.ctme.io/consultation?utm_content=why-ctme`

---

### 8. FAQ

**Component:** `FAQ.tsx` (Server) + `FAQAccordion.tsx` (Client island)
**Section ID:** `id="faq"`
**Background:** `bg-ctme-surface`

**Exact copy:**

```
[Section label]
COMMON QUESTIONS

[Headline]
Everything You Need to Know
```

**Q1: How much does this cost?**
Our pricing is flat-rate based on your transaction volume. No hourly billing, no surprise invoices. We review your situation, give you one clear price upfront, and that's what you pay. Most of our clients save more in tax than our fee. Get a free quote and we'll tell you the exact cost before you commit to anything.

**Q2: Do you file my tax return?**
No. We deliver an audit-ready crypto tax report that your CPA or tax preparer uses to file your return. If you self-file using TurboTax or similar software, you can import our report directly. We also support your CPA at no extra charge if they have questions about the crypto-specific details.

**Q3: What if I don't have a CPA or accountant?**
That's fine. Our report is designed to work with any filing method. If you use TurboTax, H&R Block, or any other self-filing tool, you can import the report directly. We'll walk you through the process.

**Q4: What if I have multiple years of unfiled crypto taxes?**
We handle multi-year cleanups regularly. Many clients come to us with 2-4 years of backlogged crypto activity. We'll build a historically accurate picture from scratch and get each year squared away. The sooner you start, the less exposure you have.

**Q5: Is my data secure?**
Your security is a priority. You grant us "accountant level" access to your crypto tax software, which means we can see your transaction data and make edits but nothing else. All communication happens inside enterprise-grade practice management software. We never discuss specific transactions over regular email. Many of our security-conscious clients even set up their software with a burner email.

**Q6: What countries do you support?**
We currently serve crypto investors and traders in the United States, Australia, Canada, the United Kingdom, and New Zealand. Our team is experienced with the tax rules in each of these jurisdictions.

**Q7: How long does the process take?**
It depends on the complexity of your situation, but the typical timeline is 1-3 weeks from when you grant us access. We always deliver well before tax deadlines when you start early. During peak season (January through April for US clients), we recommend getting started as early as possible to secure your spot.

**Q8: What types of crypto activity do you cover?**
Everything. DeFi (yield farming, liquidity pools, staking, lending), NFTs and NFTfi, on-chain trading and memecoins, Solana ecosystem, Bitcoin Ordinals and BRC-20, Hyperliquid perps, on-chain perps, multi-chain activity, bridges, airdrops, forks, mining, and crypto business bookkeeping. If it happened on-chain, we've seen it before.

**Q9: How does your pricing compare to other services?**
Traditional CPA firms charge $300-500 per hour for crypto work, and because they're not specialists, it takes them longer. That means a higher bill for less accurate work. Done-for-you plans from other crypto tax firms start at $2,500-3,500 for basic cases. We use flat-rate pricing based on transaction volume, which makes us commonly 5x cheaper than traditional firms for the same depth of work.

**Design:**
- `max-w-3xl mx-auto`
- Each item: question in `font-heading text-card-heading text-ctme-text`, answer in `font-body text-body text-ctme-subtext`
- Toggle icon: `+`/`-` in `text-ctme-accent`, 48px tap target
- Dividers: `border-b border-ctme-border` between items
- All answers rendered in static HTML (visible by default before JS). FAQAccordion Client Component adds open/close toggle behavior.
- Disclaimer below FAQ: `font-mono text-label text-ctme-muted` — "Results vary based on individual tax situations. Past savings do not guarantee future results."

**CTA:** "Still Have Questions? Get a Free, No-Obligation Quote →" → `https://book.ctme.io/consultation?utm_content=faq`

---

### 9. FINAL CTA — "The Close"

**Component:** `FinalCTA.tsx` (Server Component)
**Background:** `bg-ctme-void` with a subtle `bg-[radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.06)_0%,transparent_60%)]` accent glow at the bottom

**Exact copy:**

```
[Headline]
Stop Stressing About Crypto Taxes.

[Subheadline]
Get a free, no-obligation quote. We'll review your situation
and tell you exactly what it costs before you commit.

[Primary CTA — oversized green button]
Get My Free Quote →

[Risk reversal — below button, muted text]
No credit card. No commitment. Just answers.

[Micro-testimonial — accent border card, compact]
"My tax savings more than paid for the cost of the service." — Richee, Verified Client ★★★★★

[Urgency — seasonal, mono label]
TAX DEADLINES DON'T WAIT · LOCK IN YOUR SPOT BEFORE OUR CALENDAR FILLS UP
```

**Design:**
- `py-24 md:py-32 text-center` — generous vertical padding
- Headline: `text-section-heading text-ctme-text`
- Subheadline: `text-body-lg text-ctme-subtext max-w-xl mx-auto`
- CTA button: oversized version of the standard green button. `px-10 py-5 text-base`. Glow shadow.
- Risk reversal: `font-mono text-label text-ctme-muted mt-4`
- Micro-testimonial: compact inline card, `border border-ctme-accent/20 rounded-xl p-4 max-w-md mx-auto mt-8`
- Urgency: `font-mono text-label text-ctme-warning mt-6` (amber color)

**CTA destination:** `https://book.ctme.io/consultation?utm_content=final-cta`

---

### 10. FOOTER

**Component:** `Footer.tsx` (Server Component)

**Content:**
- Brand: "Crypto Tax Made Easy" + tagline: "Specialist crypto tax reconciliation for DeFi, NFTs, and complex on-chain activity."
- Links: How It Works (#how-it-works), Results (#results), FAQ (#faq), Privacy Policy (/privacy)
- Contact: hello@cryptotaxmadeeasy.com (or Matt's actual contact email)
- Countries: USA · Australia · Canada · UK · New Zealand
- System status: `● ALL SERVICES ACTIVE` with pulsing green dot
- Disclaimer: "Crypto Tax Made Easy provides crypto tax reconciliation and reporting services. Results vary based on individual tax situations. This is not financial, legal, or tax advice. Consult a qualified tax professional for advice specific to your situation."
- Copyright: "© 2025 Crypto Tax Made Easy. All rights reserved."
- CTA: "Get Started →" ghost/outline button → `https://book.ctme.io/consultation?utm_content=footer`

---

### 11. FLOATING MOBILE CTA

**Component:** `FloatingMobileCTA.tsx` (Server Component, CSS-only)

**Text:** "Get Your Free Quote →"
**Destination:** `https://book.ctme.io/consultation?utm_content=mobile-sticky`
**Visibility:** `md:hidden` (mobile only)
**Design:** fixed bottom, `bg-ctme-accent rounded-t-2xl`, full width, 48px+ tap target, safe-area padding

---

## CTA Summary

| # | Location | Exact Text | utm_content value |
|---|---|---|---|
| 1 | Navbar | Get Your Free Quote | `navbar` |
| 2 | Hero | Get Your Free Quote → | `hero` |
| 3 | After Problem Section | See How Much You Could Save → | `problem-section` |
| 4 | After How It Works | Get Your Free Quote → | `how-it-works` |
| 5 | After Testimonials | Join 200+ Clients Who Stopped Overpaying → | `testimonials` |
| 6 | After Why CTME | See What Accurate Crypto Tax Looks Like → | `why-ctme` |
| 7 | After FAQ | Still Have Questions? Get a Free, No-Obligation Quote → | `faq` |
| 8 | Final CTA Section | Get My Free Quote → | `final-cta` |
| 9 | Footer | Get Started → | `footer` |
| 10 | Floating Mobile Bar | Get Your Free Quote → | `mobile-sticky` |

**All destinations:** `https://book.ctme.io/consultation?{stored_utms}&utm_content={value}`

---

## Page Metadata

```tsx
// src/app/page.tsx or layout.tsx
export const metadata = {
  title: 'Crypto Tax Done For You | Crypto Tax Made Easy',
  description: 'We manually review every crypto transaction, fix what software gets wrong, and deliver an audit-ready report. Flat-rate pricing. 200+ clients. $21.8M+ saved.',
  openGraph: {
    title: 'Crypto Tax Done For You | Crypto Tax Made Easy',
    description: 'We manually review every crypto transaction, fix what software gets wrong, and deliver an audit-ready report. Flat-rate pricing. 200+ clients. $21.8M+ saved.',
    url: 'https://ctme.io',
    siteName: 'Crypto Tax Made Easy',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: false,    // Paid traffic LP — don't index, avoid cannibalizing main site
    follow: false,
  },
}
```

**Note:** `robots: noindex, nofollow` because this is a paid traffic landing page. We don't want Google indexing `ctme.io` and competing with `cryptotaxmadeeasy.com` for organic rankings. All traffic to these LPs comes from ads.

---

## Ad Copy Reference (for message match verification)

When building the hero, verify the headline matches the ad copy variants that will send traffic here:

**Google Search ads sending traffic to this page:**
- "Crypto Tax Done For You. Flat Rate. No Hourly Billing."
- "Crypto Tax Accountant. 200+ Clients, $21.8M Saved. Get a Free Quote."
- "DeFi, NFTs, Multi-Chain? We Handle It All. 20 Min Setup."

**Meta ads sending traffic to this page:**
- "I had 3,000+ DeFi and NFT transactions. My accountant said 'just tell me what you put in and what it's worth now.' That advice would have cost me tens of thousands..."
- "4,000 transactions. 6 blockchains. Your accountant has no idea what yield farming is. We do..."

The hero headline "Your Crypto Taxes, Done For You." matches all of these. The subheadline reinforces the flat-rate and 20-minute hooks. The $21.8M stat matches the Google ad variant. Message match is confirmed.

---

## Build Priority

When building this page, follow this order:

1. **Layout + Navbar + Footer + FloatingMobileCTA** — structural shell
2. **Hero** — the most important section, must be pixel-perfect first
3. **SocialProofBar** — instant credibility after hero
4. **HowItWorks** — the simplicity pitch (this is what makes the overwhelmed visitor exhale)
5. **ProblemSection** — the agitation (placed after How It Works in build order for easier testing, but renders before it on page)
6. **Testimonials** — the proof
7. **WhyCTME** — the differentiation
8. **FAQ** — the objection handler
9. **FinalCTA** — the close
10. **NavbarClient + FAQAccordion** — Client Component interactivity (last, since everything works without them)
11. **UTMCapture** — tracking
12. **Analytics scripts** — GTM + Meta Pixel