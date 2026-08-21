# Crypto Tax Made Easy — Qualifying Survey & Booking Flow

A multi-step qualifying survey and appointment booking flow built with Next.js, Tailwind CSS, and Framer Motion. Routes qualified leads from paid ads into GoHighLevel (GHL) for consultation booking.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.local.example .env.local

# 3. Fill in your GHL credentials and tracking IDs in .env.local

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GHL_API_KEY` | Yes | GoHighLevel API key (Bearer token) |
| `GHL_CALENDAR_ID` | Yes | GHL Calendar ID for appointment booking |
| `GHL_LOCATION_ID` | Yes | GHL Location/Sub-Account ID |
| `NEXT_PUBLIC_META_PIXEL_ID` | No | Meta/Facebook Pixel ID for conversion tracking |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | No | Google Analytics 4 Measurement ID (G-XXXXXX) |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | No | Google Ads remarketing tag ID (AW-XXXXXX). Conversion *reporting* is not done from this app — see below. |

## GHL Custom Fields Setup

Before the form works, create these custom fields in your GHL sub-account under **Settings → Custom Fields → Contact**:

| Field Name | Field Key | Type |
|---|---|---|
| Country | `country` | Single Line Text |
| Tax Years | `tax_years` | Single Line Text |
| Blockchains Used | `blockchains_used` | Single Line Text |
| Has Tax Software | `has_tax_software` | Single Line Text |
| Tax Software Name | `tax_software_name` | Single Line Text |
| UTM Source | `utm_source` | Single Line Text |
| UTM Medium | `utm_medium` | Single Line Text |
| UTM Campaign | `utm_campaign` | Single Line Text |
| UTM Content | `utm_content` | Single Line Text |
| UTM Term | `utm_term` | Single Line Text |
| Placement | `placement` | Single Line Text |
| Site Source Name | `site_source_name` | Single Line Text |
| Landing URL | `landing_url` | Single Line Text (or URL) |
| GCLID | `gclid` | Single Line Text |
| FBCLID | `fbclid` | Single Line Text |

> Ad URL template for Meta: `?utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&placement={{placement}}&site_source_name={{site_source_name}}` — the app captures the full landing URL + all tracking params on first visit and persists them across the multi-step flow.

## GHL API Endpoints Used

All API calls are proxied through `/api/ghl/*` server-side routes so the API key is never exposed.

| Proxy Route | GHL Endpoint | Docs |
|---|---|---|
| `POST /api/ghl/contact` | `POST /contacts/` | [Create Contact](https://highlevel.stoplight.io/docs/integrations/0443d0d148bd3-create-contact) |
| `PUT /api/ghl/contact` | `PUT /contacts/:id` | [Update Contact](https://highlevel.stoplight.io/docs/integrations/9ce5a739d4fb9-update-contact) |
| `GET /api/ghl/slots` | `GET /calendars/:id/free-slots` | [Get Free Slots](https://highlevel.stoplight.io/docs/integrations/7a37c22fc66e5-get-free-slots) |
| `POST /api/ghl/book` | `POST /calendars/events/appointments` | [Create Appointment](https://highlevel.stoplight.io/docs/integrations/d11a2297a04e4-create-appointment) |

## Survey Flow

1. **Country**
2. **Gains** / 3. **Portfolio** / 4. **Transactions** — the qualifier gate (`lib/qualification.ts`).
   A lead qualifies for a call if gains ≥ $50k **or** portfolio ≥ $100k **or** ≥ 6,000 transactions.
   Anyone under all three thresholds sees the under-threshold options screen
   (`components/DisqualifiedScreen.tsx`): **Request Quote** (High Level Review Package) or **See the Course**.
5. **Tax Years** — multi-select
6. **Blockchains Used** — multi-select
7. **Tax Software** — yes/no with conditional follow-up
8. **Contact Info** (`#step-8`) — name + email + optional phone; creates the GHL contact immediately.
   Copy and button differ by path: call path → "See Available Times", quote path → "Submit for Quote".
9. **Calendar** — call path only; slot picker from GHL calendar API → `/consultation/thank-you`.
   Quote path skips this and lands on `/consultation/quote-requested`.

Both paths hit the same `POST /api/ghl/contact`. The server recomputes `qualified` from the
brackets and tags the contact: descriptive tags (`qualified`, `quote-requested`) plus dedicated
workflow-trigger tags (`high value` for qualified call leads, `low value` for quote leads).
GHL workflows fire on the trigger tags — and may remove them to allow re-entry — while the
descriptive tags stay as a permanent record. Opportunity/pipeline creation is handled in GHL,
not by this app. The optional `GHL_CONTACT_WEBHOOK_URL` payload also includes
`leadPath: 'call' | 'quote'`.

## Conversion Tracking

Client-side pixel/GA4 events fired at key milestones (analytics only — see below for
Google Ads conversion reporting). Page views are gtag's own default (automatic
`page_view` on every full page load) — nothing custom needed for that.

| Event | When | Meta Pixel | GA4 |
|---|---|---|---|
| Survey Started | Valid country selected (Step 1) | — | `survey_started` |
| Qualified / Disqualified | Gate result after Step 4 | `Qualified` / `Disqualified` (custom) | `qualified` / `disqualified` |
| Quote Click / Course Click | Button tapped on the under-threshold screen | `QuoteClick` / `CourseClick` (custom) | `quote_click` / `course_click` |
| Lead Captured | Contact created (Step 8, both paths; `lead_path` param = `call` or `quote`) | `Lead` | `generate_lead` |
| Quote Requested | Contact created on the quote path (Step 8) | `QuoteRequested` (custom) | `quote_requested` |
| Appointment Booked | Booking confirmed (Step 9, or via `/book` `/schedule` rebooking) | `Schedule` | `appointment_booked` |

**Google Ads conversions are not fired from the browser.** They're reported server-side
by Ockno: contact creation (Step 5) writes `gclid` and `ockno_id` onto the GHL contact
(see `lib/ghl.ts`), booking confirmation (Step 6) moves the GHL pipeline opportunity to
"Call Booked", and Ockno watches that pipeline stage change to push the conversion into
Google Ads. Nothing in this app needs a Google Ads conversion label — that lives in
Ockno's own configuration. Quote requests never reach "Call Booked", so they only report
to Google Ads if Ockno is also pointed at the quote pipeline stage.

## Deploy to Vercel

```bash
# Option 1: Vercel CLI
npm i -g vercel
vercel

# Option 2: Connect GitHub repo at vercel.com/new
```

Add all environment variables in **Vercel → Project Settings → Environment Variables**.

## Tech Stack

- **Next.js 15** (App Router)
- **Tailwind CSS v4**
- **Framer Motion** for step transitions
- **TypeScript** throughout
- Serverless API routes for GHL proxy
