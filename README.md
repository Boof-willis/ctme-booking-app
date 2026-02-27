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
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | No | Google Ads Conversion ID (AW-XXXXXX) |

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
| GCLID | `gclid` | Single Line Text |
| FBCLID | `fbclid` | Single Line Text |

## GHL API Endpoints Used

All API calls are proxied through `/api/ghl/*` server-side routes so the API key is never exposed.

| Proxy Route | GHL Endpoint | Docs |
|---|---|---|
| `POST /api/ghl/contact` | `POST /contacts/` | [Create Contact](https://highlevel.stoplight.io/docs/integrations/0443d0d148bd3-create-contact) |
| `PUT /api/ghl/contact` | `PUT /contacts/:id` | [Update Contact](https://highlevel.stoplight.io/docs/integrations/9ce5a739d4fb9-update-contact) |
| `GET /api/ghl/slots` | `GET /calendars/:id/free-slots` | [Get Free Slots](https://highlevel.stoplight.io/docs/integrations/7a37c22fc66e5-get-free-slots) |
| `POST /api/ghl/book` | `POST /calendars/events/appointments` | [Create Appointment](https://highlevel.stoplight.io/docs/integrations/d11a2297a04e4-create-appointment) |

## Survey Flow

1. **Country** — disqualifies non-served regions
2. **Tax Years** — multi-select
3. **Blockchains Used** — multi-select
4. **Tax Software** — yes/no with conditional follow-up
5. **Contact Info** — name + email (creates GHL contact immediately)
6. **Calendar** — slot picker from GHL calendar API
7. **Confirmation** — last name + phone (appointment already booked)

## Conversion Tracking

Events fired at key milestones:

| Event | When | Meta Pixel | Google |
|---|---|---|---|
| Survey Started | Valid country selected (Step 1) | — | `survey_started` |
| Lead Captured | Contact created (Step 5) | `Lead` | `generate_lead` |
| Appointment Booked | Booking confirmed (Step 6) | `Schedule` | `conversion` |

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
