# CTME Google Search Campaign — US — Aug 2026

Build spec for the launch campaign. Companion to `landing-page-2.md` (page copy) and
`../ctme-campaign-structure-aug2026.md` (Meta side).

**Budget:** ~$200/day. At $13–$36 a click that is roughly **450 clicks/month total**.
Every structural decision below follows from that number: the account cannot support
more than three ad groups without starving all of them.

---

## 1. The four angles

Nine Meta video concepts collapse into four arguments. Only one has search demand, so
only one leads. The other three run as RSA asset clusters and page sections, competing
against the same query rather than splitting traffic across separate destinations.

| # | Angle | Search demand | Where it lives |
|---|---|---|---|
| A | **The data problem** | Yes — all 16 approved keywords | Hero + Problem section. Pinned headline in every ad group. |
| B | **Was it done right** | None | ImpactStudy section + RSA cluster B |
| C | **Unclaimed losses** | None | ImpactStudy callout + RSA cluster C |
| D | **Extension deadline** | None | Date-gated banner + RSA cluster D, Sept 1 → Oct 15 only |

Nobody types "am I sure last year's return was right." On Meta you pick the angle; on
Search the searcher picks it, and they have all picked the same one.

---

## 2. Campaign settings

| Setting | Value | Why |
|---|---|---|
| Type | Search only | |
| Networks | Search partners **off**, Display **off** | Partner traffic converts far worse and is unreadable at this volume |
| Location | United States, **"Presence: people in your targeted locations"** | The default "presence or interest" setting buys clicks from outside the US |
| Language | English | |
| Bidding | **Maximise Clicks with a CPC ceiling** at launch | No conversion history exists yet. Target CPA with zero data spends the budget learning nothing. |
| Switch to | Maximise Conversions at ~30 conversions | |
| Ad rotation | Optimise | |
| Ad schedule | All (review after 4 weeks) | |

**Do not launch before conversion tracking is live.** See §6.

---

## 3. Ad groups

Three groups. Each gets its own RSA and its own final URL.

### 3.1 Crypto Accountant → `/`
Broadest commercial intent, cheapest clicks, carries most of the budget and learns fastest.

| Keyword | Match | Vol/mo | Top-of-page ceiling |
|---|---|---|---|
| `[crypto accountant]` | exact | 320 | $17.42 |
| `"accountant cryptocurrency"` | phrase | 320 | $17.42 |
| `[crypto cpa]` | exact | 260 | $18.07 |
| `"cpa for cryptocurrency"` | phrase | 260 | $18.07 |
| `"cpa cryptocurrency"` | phrase | 260 | $18.07 |
| `"cryptocurrency accountant"` | phrase | 140 | unknown — watch week 1 |

### 3.2 Crypto Tax Accountant → `/`
Same buyer naming tax specifically. Highest intent, most expensive click in the plan.
Separated so a $35 click cannot hide inside the cheap group's average.

| Keyword | Match | Vol/mo | Top-of-page ceiling |
|---|---|---|---|
| `"crypto tax accountant"` | phrase | 210 | $35.64 |
| `[crypto tax accountants]` | exact | 210 | $35.64 |
| `"crypto taxes accountant"` | phrase | 210 | $35.64 |
| `"crypto tax professional"` | phrase | 170 | $32.23 |
| `"crypto tax advisor"` | phrase | 110 | $35.93 |
| `"crypto tax service"` | phrase | 110 | $18.28 |

### 3.3 Crypto Accountant Near Me → `/near-me`
"Near me" here means "I can't find one locally," not "must be walkable." The page and the
ad both have to say remote and nationwide before the click is paid for.

| Keyword | Match | Vol/mo | Top-of-page ceiling |
|---|---|---|---|
| `"crypto tax accountant near me"` | phrase | 210 | $27.20 |
| `"crypto cpa near me"` | phrase | 210 | $13.14 |
| `"crypto accountant near me"` | phrase | 170 | $19.20 |
| `"crypto tax preparer near me"` | phrase | 140 | $16.83 |

---

## 4. RSA copy

Character limits: headlines **30**, descriptions **90**. Counts shown as `(n)`.

### 4.1 Shared asset pool

**Cluster A — the data problem** (the lead argument)

| Headline | (n) |
|---|---|
| You Don't Have a Tax Problem | 28 |
| You've Got a Data Problem | 25 |
| Koinly And Awaken Disagree | 26 |
| We Reconcile Against The Chain | 30 |
| Every Transaction Checked | 25 |
| Missing Wallets, Fixed | 22 |
| Cost Basis Rebuilt By Hand | 26 |
| Software Guesses. We Don't. | 27 |

**Cluster B — was it done right**

| Headline | (n) |
|---|---|
| We Checked 802 Reports | 22 |
| All 802 Had An Error | 20 |
| Not Sure Last Year Was Right? | 29 |
| We Check Both Directions | 24 |
| 56% Overpaid, 44% Exposed | 25 |
| Already Filed? Still Fixable | 28 |

**Cluster C — unclaimed losses**

| Headline | (n) |
|---|---|
| Capital Losses Don't Expire | 27 |
| 2021 Losses Carry Forward | 25 |
| Unclaimed Losses From 2021-22 | 29 |
| Dead Exchange? Still Traceable | 30 |

**Cluster D — extension deadline** *(pause outside Sept 1 – Oct 15)*

| Headline | (n) |
|---|---|
| No Extension To The Extension | 29 |
| Oct 15 Is The Last Date | 23 |
| Extension Deadline Is Close | 27 |

**Proof and offer headlines** (use in every group)

| Headline | (n) |
|---|---|
| 737+ Done-For-You Clients | 25 |
| 6.7M Transactions Reconciled | 28 |
| Flat-Rate. No Hourly Billing. | 29 |
| Free 15-Minute Call | 19 |
| DeFi, NFTs, Perps, Multi-Chain | 30 |
| Audit-Ready Crypto Reports | 26 |

**Descriptions**

| Description | (n) |
|---|---|
| We reconcile every transaction by hand and give you numbers that are ready to file. | 83 |
| We checked 802 of our own client reports. Every one had at least one material error. | 84 |
| Overpaid or underreported, the risk runs both ways. Find out which side you're on. | 82 |
| Flat-rate pricing, no hourly billing. Starts with a free 15-minute call. DeFi welcome. | 86 |
| Koinly says one number, Awaken says another. We rebuild the history from the chain. | 83 |
| Capital losses don't expire. Most from 2021 and 2022 were never claimed. | 72 |

### 4.2 Per-group pinning

Pin **one** head-term headline to position 1 so the ad mirrors the query. Leave everything
else unpinned — over-pinning collapses RSA combinations and Google will report a low Ad
Strength, which raises CPC.

| Ad group | Pin to H1 | (n) |
|---|---|---|
| Crypto Accountant | **Crypto Accountants For DeFi** | 27 |
| Crypto Tax Accountant | **Crypto Tax Accountants, US** | 26 |
| Crypto Accountant Near Me | **Crypto Accountant, Nationwide** | 29 |

The near-me group additionally pins to position 2: **Remote. Better Than Local.** (26).
Answering the local objection in the SERP means the wasted clicks never get paid for.

---

## 5. Extensions

**Sitelinks** — all four anchors are live on the page. Text ≤25 chars, descriptions ≤35.

| Text | Description 1 | Description 2 | URL |
|---|---|---|---|
| How It Works | 4 steps, one call to start. | Free 15-minute consultation. | `https://book.ctme.io/#how-it-works` |
| The 802-Report Study | Every report had an error. | 56% overpaid. 44% exposed. | `https://book.ctme.io/#study` |
| Client Results | Millions in gains, corrected. | 5.0 average from 37 reviews. | `https://book.ctme.io/#results` |
| Common Questions | Pricing, security, timelines. | Yes, we work remotely. | `https://book.ctme.io/#faq` |

**Display path:** `path1 = crypto-accountant`. The ad otherwise shows a bare
`book.ctme.io`, which wastes the one line of the URL that can carry a keyword.

- **Callouts:** Flat-Rate Pricing · We Work Remotely · Audit-Ready Reports · 6.7M Transactions Reconciled · Free 15-Minute Call
- **Structured snippet** (Services): DeFi · NFTs · On-Chain Perps · Multi-Chain · Multi-Year Cleanup
- **No call extension.** Every conversion path runs through the survey, which does the
  qualifying. A phone number bypasses the gate and fills the calendar with unqualified calls.

---

## 6. Conversion tracking (blocking)

Google Ads currently has **zero conversion goals**. Until that is fixed the campaign bids
up to $35 a click with no idea which clicks become calls.

Reporting is **server-side through Ockno**, not client-side gtag. The flow:

1. Step 5 of the survey (contact info) creates the GHL contact. `lib/ghl.ts` already
   writes both `gclid` and `ockno_id` onto that contact — custom fields plus GHL's native
   attribution object. This is "Lead created."
2. Step 6 (calendar) confirms the appointment, which moves the linked GHL pipeline
   opportunity to **Call Booked**.
3. Ockno watches that pipeline stage change and pushes the conversion into Google Ads
   itself, keyed on the `gclid` it already has. Nothing in this Next.js app needs a
   Google Ads conversion label — `lib/tracking.ts` intentionally does not fire a
   client-side `gtag('event', 'conversion')`, because that would create a second,
   un-deduplicated conversion sitting next to the one Ockno already reports.

**gclid capture is verified.** A real submission through `POST /api/ghl/contact` was
tested end to end and the contact came back with `attributionSource.gclid` and
`lastAttributionSource.gclid` both populated. Those are the only two native gclid fields
GHL exposes, and Ockno reads them.

One caveat found during that test: **15 of the 20 GHL custom fields the app writes do not
exist in the sub-account**, so GHL silently discards them on every submission (it accepts
unknown keys with a 201 and no error). Attribution is unaffected, so conversion reporting
is fine — but `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`,
`landing_url`, `gclid`, `fbclid`, `country`, `blockchains_used` and all three
`estimated_*` qualifier brackets are being lost. That kills campaign/keyword segmentation
inside GHL and hides lead quality. Create those fields before launch.

What actually has to be true before launch, all outside this repo:

- The **Lead** and **Call Booked** conversion actions exist in Google Ads with sane
  values ($180 / $520, per the GHL pipeline stage values) and Ockno is pointed at them.
- The GHL pipeline stage name Ockno is watching for actually matches what Step 6's
  booking flow produces — confirm this in GHL, not by reading the app code.
- `NEXT_PUBLIC_GOOGLE_ADS_ID` is set (remarketing tag only, `app/layout.tsx`) so audiences
  build correctly; it plays no role in conversion reporting.
- Later: Quote Sent and Paid ($2,400) follow the same pattern once those pipeline stages
  exist — no new capture work needed, `gclid` is already on the contact.

---

## 7. Negative keywords

Roughly two-thirds of this market's volume is informational, and the highest-volume terms
are all in that bucket. At these bid levels the negatives protect more budget than the
keywords earn.

**Account level** (attaches to every future Search campaign, including the four paused ones)

`"cheap"` · `"jobs"` · `"salary"` · `"hiring"` · `"how to"` · `"diy"` ·
`"reddit"` · `"calculator"` · `"template"` · `"certification"` · `"salary guide"`

> **Do not add a blanket `"free"` negative.** The earlier keyword research recommended
> one; it blocks our own offer. Every CTA on the page reads "Book Your Free
> Consultation", one RSA headline is "Free Consultation", and both paused VM campaigns
> are named "Free Crypto Tax Review". A phrase negative on `free` would suppress
> `free crypto tax consultation` and `free crypto tax review` — buyers using our exact
> language. Block the DIY tool-hunters specifically instead:
>
> `"free crypto tax software"` · `"free crypto tax calculator"` · `"free crypto tax report"`

**Campaign level**

| Negative | Why campaign-level rather than account-level |
|---|---|
| `"course"` | CTME sells a course; a future campaign will bid on this rather than block it |
| `"coinbase"` | Exchange 1099 hunting. High volume, informational |
| `"binance"` | Same pattern |
| `"crypto tax accounting"` | Classified informational-only at 210/mo despite looking commercial. An expensive trap at these bids |

> **`"software"` was dropped as a negative.** Also carried over from the keyword
> research. It blocks `crypto tax software accountant` and similar, which is arguably
> our best-qualified searcher: someone who already has software, has concluded it is
> wrong, and now wants a human. That is the entire premise of the data-problem angle.
> Watch the search terms report instead and negate specific tool-hunting queries as
> they appear.

**Add in week 1.** The survey disqualifies below ~$50k gains / $100k portfolio / 6k
transactions (`lib/qualification.ts`) and routes those visitors to the course. Review the
search terms report weekly and negate anything implying small-portfolio or beginner intent.

---

## 8. What would earn a third page

Not now, and not on a hunch. Three real triggers:

1. **~450 accumulated clicks on `/`**, at which point an A/B test of the lead argument
   becomes readable. That is a variant, not a new angle.
2. **Conversion data showing the data-problem framing underperforms.** Then swap the page's
   argument rather than adding a page.
3. **A genuinely new keyword cluster** with its own intent, e.g. software-error terms
   (`crypto tax software errors`, `Koinly overreporting`) which the Feb 2026 SEO analysis
   flagged as low-difficulty and aligned with the USP. That would justify the `/fix` variant
   already specced in `landing-page-guide.md`.

---

## 9. Launch checklist

- [ ] Conversion actions created, labels in env, test conversion fires (§6)
- [ ] Account-level negatives applied before any campaign goes live
- [ ] `/` and `/near-me` deployed, both returning 200 with the logo rendering
- [ ] Final URLs set per ad group, not at campaign level
- [ ] Auto-tagging on, so `gclid` reaches the page
- [ ] Ad Strength "Good" or better on all three RSAs
- [ ] Cluster D headlines paused until Sept 1
- [ ] Privacy policy and Terms links resolving from the footer
