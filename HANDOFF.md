# Handoff — CTME Booking App, quote path (2026-08-21)

Paste this into a fresh Claude Code session on the other machine. It captures everything decided
and built today so you can pick up without re-deriving it.

## Who / what

- Repo: https://github.com/Boof-willis/ctme-booking-app.git (branch `main`)
- Project: Next.js 16 quiz → GHL booking funnel for Crypto Tax Made Easy (CTME). Deployed to Cloudflare via `@opennextjs/cloudflare` (`npm run deploy`).
- Client: **Matt Walrath** (owner). Sales call is with **Trent**; quotes are built by **John**.
- Spencer owns the GHL side (triggers/workflows). **The app never creates opportunities** — it upserts contacts with tags and GHL automations do the rest.
- Env needed to run against GHL: `GHL_API_KEY`, `GHL_CALENDAR_ID`, `GHL_LOCATION_ID` in `.env.local` (see `.env.local.example`). Not in the repo.

## What Matt asked for (email 2026-08-21)

Under-threshold leads were being sent straight to the course. Matt wants them offered an email quote
for the **High Level Review Package** (the $1,500 starter plan) as well — matching CTME's existing sales
process. Call-booking criteria stay the same. Thresholds (`lib/qualification.ts`, unchanged): qualifies
for a call if gains ≥ $50k **or** portfolio ≥ $100k **or** ≥ 6,000 transactions.

Pricing follow-up from Matt: *"starter package is $1500 and comprehensive review starts at $2k. Keep it
simple — have it all say $1500 minimum."* → every price mention in the app uses
`MINIMUM_ENGAGEMENT_USD = 1500` (`lib/constants.ts`). No $2,000 anywhere.

## What was built (all committed, NOT yet deployed)

Flow: country → gains → portfolio → transactions → **gate** →
- pass → tax years → blockchains → software → `#step-8` contact info ("Great — let's find you a time to talk", `[ See Available Times ]`) → calendar → `/consultation/thank-you`
- fail → **two-option screen** (`components/DisqualifiedScreen.tsx`):
  - "Good news: you probably don't need our full service package" / "...start at $1,500..."
  - Card 1 `> The better fit` — **High Level Review Package** — `[ Request Quote ]`
  - Card 2 `> The DIY option` — **Crypto Tax Made Easy Course** — `[ See the Course ]`
  - `[ Request Quote ]` rejoins the flow at tax years → blockchains → software → `#step-8` with quote copy
    ("Great — where should we send the quote?", "> We'll use this to send your quote", `[ Submit for Quote ]`)
    → `/consultation/quote-requested` confirmation page (new). No calendar on this path.

Key implementation points:
- `leadPath?: 'call' | 'quote'` on `SurveyData` (`types/survey.ts`), persisted in sessionStorage.
  Set to `'call'` when the gate passes, cleared on disqualify, set to `'quote'` by `requestQuote()` in `hooks/useSurveyState.ts`.
- `components/SurveyFlow.tsx` branches `handleContactSubmit` on `leadPath`; quote path posts `leadPath: 'quote'`,
  fires tracking, clears session, `router.push('/consultation/quote-requested')`.
- `components/steps/StepContactInfo.tsx` has a `variant` prop with the two copy sets. `StepBlockchains` has a `hint` prop
  so the quote path doesn't say "prepare for your call". `ProgressBar` takes `totalSteps` (quote path = 8 steps).
- `app/api/ghl/contact/route.ts` — same endpoint for both paths. Server recomputes `qualified` from brackets and sets tags:

  | Path | Tags on the GHL contact |
  |---|---|
  | Call (passed gate) | `qualified`, `high value` |
  | Quote | `quote-requested`, `low value` |

  `qualified` / `quote-requested` = permanent descriptive record. **`high value` / `low value` = dedicated workflow-trigger tags**
  (GHL workflows can remove them at sequence end to allow re-entry without losing the history tags).
  Webhook payload (`GHL_CONTACT_WEBHOOK_URL`, optional) also includes `leadPath`.
- Tracking (`lib/tracking.ts`): new `QuoteClick` / `QuoteRequested` custom events; Meta `Lead` fires on both paths with a `lead_path` param.
- README updated (Survey Flow + tracking table). `.claude/launch.json` added for the dev server.

Verified locally: TypeScript clean, `next build` clean, full quote path walked in the browser, upsert payload confirmed
(`tags: ["quote-requested","low value"]` for quote, `["qualified","high value"]` for call).
Pre-existing lint errors in `Testimonials.tsx`, `FinalCTA.tsx`, etc. are untouched.

## GHL side — decisions made, work still to do (Spencer)

Decided:
1. **Two workflows**, not one with a branch: "Booking App: Call Lead" (trigger: Tag Added `high value`) and
   "Booking App: Quote Lead" (trigger: Tag Added `low value`).
2. **Retire the inbound-webhook workflow.** The app's API upsert already creates the contact with tags + bracket
   custom fields; the webhook's "update contact by email/phone" step was redundant and a duplicate-contact risk.
   Leave `GHL_CONTACT_WEBHOOK_URL` unset in the deployed env. (`computeComplexityScore` in the route becomes dead
   code — harmless, env-gated; strip it if you want.)
3. Complexity tier is no longer needed — value is high/low by lead path.
4. Tag-added fires once per tag; for re-entry, have each workflow remove its own trigger tag as the last step.

Old call workflow (for reference when rebuilding): contact update → tag `cold traffic` → internal SMS to +1 385 221 4162
→ country US/CA → `sms eligible` / `sms ineligible` → Find Opportunity in pipeline `3aFFl64cmFYhhlAemlry`, else create at
"New Lead" stage `452b9691-14cd-41e0-9511-6c577e022a1d` (name `{{first_name}} {{last_name}} - {{date}}`, source "Booking App")
→ wait 10 min → check "Call Booked" stage `9e4f376b-928d-458c-9bd4-4cfbc827033c` → 3-touch SMS/email nurture with booking
link `{{trigger_link.byWW9xuyiuyGVG73BDRF}}`, 24h + 48h waits, stage re-checks, final scarcity email. Ockno watches
"Call Booked" for Google Ads conversions.

Quote workflow needs: opportunity in the quote pipeline/stage, internal notification ("New CTME quote request"), notify John,
no booking-link nurture, stop-check on a "Quote Sent" stage. Quote leads will NOT report to Google Ads via Ockno unless the
quote stage is wired in.

## Open items

- **Waiting on Matt:** where quote contacts/opportunities should land in GHL (separate stage in Trent's pipeline vs. its own
  pipeline). Spencer emailed him 2026-08-21. Don't deploy until the GHL trigger branch exists, or quote leads fall into
  Trent's "New Lead" and get the call nurture.
- Confirmation page promises no turnaround time — add one if Matt gives it.
- Then: `npm run deploy`, smoke-test one real quote submission, confirm the `low value` tag fires the right workflow.

## Useful commands

```bash
npm install && npm run dev          # http://localhost:3000/consultation
./node_modules/.bin/tsc --noEmit
npx next build
npm run deploy                      # Cloudflare via opennextjs
```

Quote path test answers: any country → `$10k – $50k` → `$25k – $100k` → `1,000 – 6,000` → two-option screen.
Qualifying regression: `$50k – $250k` on gains → original call flow.
