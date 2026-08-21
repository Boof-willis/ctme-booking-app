# GHL automation reference — CTME cold-traffic funnel

Snapshot of the GoHighLevel workflows that sit behind the booking app, as of **2026-08-21**, plus
the exact contract the app has with GHL. Written before redesigning the intake for the new quote
path (see [HANDOFF.md](../HANDOFF.md)). §8 is the list of things that must be decided, fixed, or
tested before any rebuild; §10 is the sandbox test plan.

Sources: GHL's own AI summaries of each workflow (pasted by Spencer), the app source, and GHL's
public docs/community for platform behaviour. Stage/field *names* that GHL did not expose are
marked **(inferred)**. Claims about GHL behaviour that come from docs rather than observation are
marked **(per GHL docs — test)**.

---

## 1. Cast and systems

| Who / what | Role | In GHL |
|---|---|---|
| Matt Walrath | Owner. Every outbound email/SMS is signed "Matt". | — |
| Trent | Takes the sales call ("tax review"). Calendar owner. | Calendar "CTME Consultation" `hepJCqq2UgwfaiVxQH0w` (cold traffic). Separate calendars exist for Warm Traffic `j4hnKfW117NxAOI8KMiW`, Reengagement `ZyPDuvdhyjb549OwpT2W`, Sam's List `zUZZihV8urvkChle1ZEL` — the calendar filter on WF-2/3/7a is what isolates cold traffic. |
| John | Builds quotes. | — |
| User `26neqm7F5jgWsOK1u7In` | **Trent** (confirmed: team member on his personal calendar and every CTME Consultation calendar). Opportunity owner on every booked call; receives booking alert, 15-min reminder, "send quote" task, "mark call outcome" task. | WF-2, WF-3, WF-5, WF-7a |
| User `BV8SBitITFl4yo6A9d8s` | **John Fabito** (confirmed). Receives the Karbon assignment task. Quote-request tasks go here. | WF-6 |
| User `Fzj3sVqPAa4JE2NPDbZd` | Randy Panado — business ops, owns pipeline structure. | — |
| User `PthRDXYECKzAju0OfjRR` | Matt Walrath (agency admin). | — |
| User `sTjROeFFmQsqf8vTG1iC` | Spencer Roberts. | — |
| `+1 385 221 4162` | Internal SMS alert number (new lead, new booking). | WF-1, WF-2 |
| `internal@cryptotaxmadeeasy.contact` | From-address for internal notification emails (from-name `CTME Appointments` or `CTME \| Assignment`). | WF-2, WF-3, WF-5 |
| Ockno | Watches the **Call Booked** stage and reports Google Ads conversions server-side. Not a GHL workflow. **Unknown whether it listens for stage-change events or polls opps present at the stage** — matters for §8 B3. | — |
| Karbon | Practice-management system clients are handed into after payment. | WF-6 task only |
| Booking app | This repo. Upserts contacts with tags + custom fields, books appointments via API. Never creates opportunities. | — |

## 2. ID registry

### Pipeline `3aFFl64cmFYhhlAemlry` — "Trent's Pipeline" (confirmed via API 2026-08-21)

| Stage ID | Name | Used by |
|---|---|---|
| `452b9691-14cd-41e0-9511-6c577e022a1d` | New Lead | WF-1 creates here |
| `9e4f376b-928d-458c-9bd4-4cfbc827033c` | **Call Booked - Cold Traffic** | WF-1 stop-checks, WF-2 moves/creates here, WF-7a/7b look here, Ockno conversion |
| `826a34f7-9c57-4daf-9836-604155218220` | Call Booked - Warm Traffic | WF-7b fallback |
| `5f759ef6-0f50-44a0-a8da-6f9165641370` | Call Booked- Awesomely | — |
| `1a619421-312b-40ff-9c02-2818e03f717b` | Call Booked - Sam's List | — |
| `99ab3e7d-3611-420e-8874-92f77dba05bf` | Call Booked - Reengagement | — |
| `fdd95b50-4e0b-4956-9819-d9dbd2ac5dcf` | Call Completed - Follow Up Needed | — |
| `8ba098f5-22ce-43f4-a5ff-f413bda1b790` | Call Completed - Qualified | WF-5 trigger |
| `f9e315c4-897b-4253-b809-02f2f029343a` / `28b2db66-72fd-4f8b-9e69-88600e1518cf` | 2025 Quote Sent / 2026 Quote Sent | — |
| `db302d2b-0bc0-40b1-a7f5-555ea086a212` | Awaiting Payment | — |
| `34e4ac3e-c5c4-4912-971c-a7310e1e389f` | Paid / Awaiting Work Creation | WF-6 trigger |
| `cd528408-a625-48e6-bb1b-ae7b98788aa6` | Work Created | — |
| `0d132db4…` / `1886f60c…` / `2d687ac7…` / `07a350c8…` | Lost / Price · Follow Up Next Year · DIY · Used Another Firm | — |

Snapshot 2026-08-21: 267 opps. 82 open at New Lead, 41 open at Call Booked - Cold Traffic, 58 at
Work Created. 77 with source `Booking App` (Mar 26 – Jul 17 2026; 60 of them in April).

### Pipeline `UQpqvvESbLvvSwWykKiu` — "Paid Ads" (Randy's, currently empty)

| Stage ID | Name |
|---|---|
| `0953293a-15bb-46af-a915-56e8b0937631` | New Lead Low Value |
| `03cc2508-46f4-483b-ba7c-8b7acf722631` | New Leads High Value |
| `1d873e15-395a-4532-a88f-1b689e44e059` | Quote Requested |
| `2f371a44-f2fd-4bb8-baf7-3708a45e74d3` | Quote Sent |
| `c3d829ab-50f3-4edd-b33b-4b741ba2787b` | Awaiting Payment |
| `092643df-66f1-4ed9-9b15-e93b07105357` | Purchased // Awaiting Work Creation |

Other pipelines in the location (not touched by these workflows): New Client Funnel, (Sandbox) New
Client Funnel, Email Sales, Sales, 2025 Tax Year Eligible, Returning Clients 2025/2026, Production
Pipeline, Work Completed, Testimonial, Talent.

### Where the duplicates actually come from (API evidence)

43 contacts have >1 opp in Trent's Pipeline. In **42 of 43** the newer opp is source `Contact Form`
at New Lead, created on top of an existing open opp (Quote Sent, Call Booked - Warm Traffic,
Awaiting Payment, …). Only **one** dup group involves a Booking App opp (David Stehle, two Call
Booked opps two days apart — the WF-1/WF-2 race). So the duplicate problem is the **contact-form
intake automation** (not in this set) creating at New Lead without a Find, not the booking app.

Also: **0 of 77** Booking App opps have the bracket custom fields (`Pcx2…`/`mYZe…`/`2oOf…`)
populated; 74 have complexity tier. WF-1's bracket mapping has never worked (§8 A6). Call Outcome on
Booking App opps: 19 Meeting Held · 30 No Show · 28 unset.

### Opportunity custom fields

| Field ID | Meaning | Set by | Type |
|---|---|---|---|
| `UIzIljjTx34RGV6VmEZQ` | **Call Outcome** (radio). Known values: `Meeting Held`, `No Show` | WF-5 sets `Meeting Held`; humans set `No Show` (WF-7b trigger) | radio |
| `fLXVLs0nMZ5ld1dpUQWb` | Complexity (`opportunity.complexity`) | WF-1 from `inboundWebhookRequest.complexityTier` — **being retired** | TEXT |
| `mYZevKw40ssTmCRdabSd` | Estimated Portfolio Value | WF-1 from webhook | TEXT ✓ merge-safe |
| `Pcx2e4UqEA9JhqGbZDuH` | Estimated Realized Gains | WF-1 from webhook | TEXT ✓ merge-safe |
| `2oOfatIaImRnKw6X9D5A` | Estimated Transaction Count | WF-1 from webhook | TEXT ✓ merge-safe |
| `4IEq8tiL0Zh1xnAUVBp9`, `hVo48kncmhBCQY4js1j9`, `nFFDkumVp4rFgfcX2CQ6` | Tax Software, Portfolio Value, Estimated Total Transactions | humans | TEXT / TEXT / NUMERICAL |
| `TRxhtaWpGoNRhxqfKLYw`, `wlATK64iHgYVMUdIkKpA` | All exchange APIs connected? / All wallets uploaded? | humans (Trent, on the call) | RADIO Yes/Partially/No |

### Contact custom fields (written by the app, keyed by field *key*)

> Checked via API 2026-08-21. **Existing:** `which_tax_years_do_you_need_help_with` (`9E0f…`, CHECKBOX),
> `do_you_currently_have_crypto_tax_software_set_up` (`SjZJ…`, RADIO), `if_yes_which_crypto_tax_software`
> (`k9bw…`, RADIO), `ockno_id` (`3hML…`, TEXT), `agreed_to_tos` (`qVwZ…`, RADIO).
> **Missing and needed:** the three `estimated_*` bracket fields (app started sending them 2026-08-15;
> GHL drops unknown keys silently). **Missing and redundant:** `country` (native top-level field, already
> set as ISO-2), `blockchains_used` (an existing `if_no_which_blockchains_have_you_used_from_most_to_least`
> LARGE_TEXT field `96Bh…` could be reused), and the ten attribution keys — **attribution is stored natively**
> (see below), so the custom-field copies should simply be removed from the app.

**Native attribution (confirmed working):** the upsert's `attributionSource` / `lastAttributionSource`
objects are accepted (undocumented) and stored on the contact. 73/77 Booking App contacts carry
`attributionSource = {url, utmSource, utmMedium, campaign, utmContent, utmKeyword, placement,
siteSourceName, fbclid, gclid}` (April 2026 Meta campaign: `utmSource=meta`, `utmMedium=paid`).
`attributionSource` is first-touch and persists; `lastAttributionSource` gets overwritten by GHL's own
tracking (e.g. a trigger-link click shows up as "Direct traffic"). Report on `attributionSource`.

| Key | Content |
|---|---|
| `country` | Display name: `Australia` · `Canada` · `New Zealand` · `UK` · `USA` · the free-text "other" name · literal `Other` if none typed. (The top-level contact `country` is the ISO-2 code — that's what the US/CA SMS checks presumably read.) |
| `which_tax_years_do_you_need_help_with` | multi: `2025`… / `Before-2021` |
| `blockchains_used` | multi |
| `do_you_currently_have_crypto_tax_software_set_up` | `Yes` / `No`. Field ID `SjZJD7P2FW8LemNrwxaE` (confirmed), which WF-3 branches on. **Also flipped to `Yes` post-booking** by `POST /api/koinly-setup-complete` (the "[Setup complete]" button on `/consultation/setup` and the thank-you page) — that's the app-side event that moves a WF-3 No-track contact onto the Yes track. |
| `if_yes_which_crypto_tax_software` | Koinly / Awaken / Summ (Formerly Crypto Tax Calculator) / Netrunner / Other |
| `estimated_realized_gains` | `Under $10k` · `$10k – $50k` · `$50k – $250k` · `$250k+` (en dashes) |
| `estimated_portfolio_value` | `Under $25k` · `$25k – $100k` · `$100k – $500k` · `$500k+` |
| `estimated_transaction_count` | `Under 1,000` · `1,000 – 6,000` · `6,000 – 20,000` · `20,000+` |
| `ockno_id` | the `ockno_id` URL param (not included in attributionSource) |
| `agreed_to_tos` | `Yes` / `No` — always written, defaults to `No` |
| `utm_source/medium/campaign/content/term`, `placement`, `site_source_name`, `landing_url`, `gclid`, `fbclid` | Attribution |

### Tags

| Tag | Added by | Read by |
|---|---|---|
| `cold traffic` | WF-1 | nothing in this set (segmentation/reporting) |
| `sms eligible` | WF-1 (country US/CA), WF-2 (Not-Found branch only) | WF-1, WF-3, WF-4a, WF-4b — every SMS is gated on it |
| `sms ineligible` | WF-1, WF-2 | nothing (informational) |
| `active client` | WF-6 | nothing in this set |
| `qualified` / `quote-requested` | **app** (new) — permanent record of which path the lead took | — |
| `high value` / `low value` | **app** (new) — workflow trigger tags | new Call / Quote workflows (to build) |
| `awesomely` | app, only on `/awesomely` co-branded intake | — |

Bookings made through `/book` or `/schedule` (see §3) carry **no** app tags.

### Trigger links

| ID | Target |
|---|---|
| `byWW9xuyiuyGVG73BDRF` | Booking link for Trent's calendar (every nurture CTA) |
| `az9bkzRaUMYoWIPGCx2B` | Koinly setup guide |

### Workflow IDs (confirmed via API 2026-08-21)

| ID | Name | Referenced by |
|---|---|---|
| `0dd96134-89e7-4b24-a20e-3382121d567e` | WF-1: New Lead Intake | — (**nothing removes a lead from WF-1**; it exits only via stage checks) |
| `b9e0ff5b-fa6f-400e-9bd1-59cbb2f47dbe` | WF-2: Calendar Booking | |
| `a6767d56-f824-4fc9-a61e-ab9343c45b04` | **WF-3: Appointment Reminders** | WF-4a, WF-4b remove on cancel / no-show (not WF-1 as previously presumed) |
| `44ca2e05-1250-4bfc-ad6e-232a05cd4203` | WF-4a: Cancellation Handler | WF-2 removes on booking |
| `ecde7278-d9d1-4d70-9056-000ad1e6cc94` | WF-4b: No-Show Handler | WF-2, WF-5 |
| `43919da5-bf95-40fe-b845-61c0b4e4b1b9` | WF-5: Qualified Notify + Task | |
| `3ef6d316-bb33-47c6-8dde-836047cc8dac` | WF-6: Karbon Handoff | |
| `f28be74b-28df-4b86-9172-d60520dac3c2` | WF-7a: Auto No-Show Detection | WF-5 |
| `bf3ad526-5db7-4e25-8b92-ff29544a7b30` | WF-7b: Call Outcome Handler | WF-5 |
| `927b8747-a554-4a31-8890-7a8dcbe30435` | WF-4W: Auto No-Show Detection (**warm**) | WF-5 |
| `26651e4c-78b8-44a2-af9f-371e81ed6f75` | WF-3bW: No-Show Handler (**warm**) | WF-5 |
| `11938b28-4ccf-4e8a-a402-9827c9e56d7c` | Copy - WF-1: New Lead Intake (draft) | someone already started a clone |
| `e82cdee3-a81f-43c5-94ce-21ec7aae3ad2` | Contact Us Form Filled Out | likely the `Contact Form` duplicate source |

A parallel **warm-traffic** set exists and was not reviewed: WF-1W Intake + Booking, WF-2W Appointment
Reminders, WF-3aW Cancellation, WF-3bW No-Show, WF-4W Auto No-Show Detection. WF-5 serves both tracks.
Also relevant: "Trent Pipeline - Adding 2025/2026 Tax Year Quote Sent" workflows, "Quote Follow Up
Sequence", "Quote Email Template", "Client Closed, Push to Karbon". 83 workflows total.

**Consequence:** WF-4a/4b remove from *Reminders*, so on cancel/no-show a lead in the WF-1 nurture keeps
going until its next stage check sees Call Booked — which it still does (the opp stays at Call Booked).
So in practice the intake nurture stops anyway; the rebuild should still add the new intake workflows to
WF-4a/4b so a cancelled lead doesn't get "book a call" copy mid-nurture after the stage changes.

## 3. The app → GHL contract (what actually hits GHL)

### Primary entry: the survey (`/consultation`, `/awesomely`)

`POST /api/ghl/contact` → `POST /contacts/upsert`. Body:
- `locationId`, `firstName`, `lastName?`, `email`, `phone?`, `country` (ISO-2: `US`, `CA`, `GB`,
  `AU`, `NZ`, or the "other" code), `source: "Booking App"`
- `customFields` — everything in the contact-field table above
- `attributionSource` + `lastAttributionSource` when any UTM / placement / gclid / fbclid is present
  (not for `ockno_id` or `landing_url` alone); keys are GHL's (`campaign`, `utmKeyword`, `url`…)
- `tags`:

| Path | How reached | Tags sent |
|---|---|---|
| Call | gains ≥ $50k **or** portfolio ≥ $100k **or** ≥ 6,000 tx | `qualified`, `high value` |
| Quote | under threshold → "Request Quote" | `quote-requested`, `low value` |

  (plus `awesomely` on the co-branded page). **Only `qualified`/`high value` are recomputed
  server-side from the brackets.** `quote-requested`/`low value` follow the client-sent `leadPath`,
  and the free-form `tag` is passed through. The UI never sends both paths, but nothing server-side
  prevents a crafted request from carrying all four tags, or — if all three brackets are missing —
  none (§8 C5). A filled honeypot short-circuits before any GHL call.

Then:
- **Call path**: app shows calendar (after the $1,500-minimum checkbox) →
  `POST /calendars/events/appointments` on calendar `GHL_CALENDAR_ID` (env; must equal Trent's
  `hepJCqq2UgwfaiVxQH0w` for WF-2/3/7a to fire) with `appointmentStatus: 'confirmed'`, title
  `Crypto Tax Consultation - {first}` (last name is **not** forwarded to the book endpoint). Stores
  `ctme_contact_id` in sessionStorage, redirects to `/consultation/thank-you?has_software=yes|no`.
- **Quote path**: nothing else. Redirect to `/consultation/quote-requested`. No contactId kept.

### Secondary entry: `/book` and `/schedule`

Standalone rebook pages that take `?contactId=&firstName=&lastName=&email=&phone=` from the URL
(intended for links in nurture emails). On submit: `PUT /api/ghl/contact` → `PUT /contacts/{id}`
(lastName / phone / UTM only, retries without phone on a duplicate-phone 400) then
`POST /api/ghl/book` on the same calendar. **No upsert, no tags, no custom fields.** A booking from
here fires WF-2/WF-3/WF-7a for a contact that may have none of the app's data.

### Post-booking: Koinly setup complete

`POST /api/koinly-setup-complete` `{contactId}` → `PUT /contacts/{id}` setting
`do_you_currently_have_crypto_tax_software_set_up = Yes`. Fired by the "[Setup complete]" button.

### Legacy webhook (being retired)

If `GHL_CONTACT_WEBHOOK_URL` is set, after a successful upsert the app POSTs (fire-and-forget) a
JSON payload — `contactId`, `email`, `phone`, brackets, `qualified`, `complexityScore/Tier`,
`leadPath`, `tags`, nested `utmParams`, … — to WF-1's inbound webhook. Whether this fires in prod
today depends on the deployed env (assumed set). **Decision 2026-08-21 (supersedes HANDOFF): keep the webhook
as the trigger** — one URL per new workflow — so workflows have the full payload. Fix step 1 to
match on email only.

Timing that matters: the tag-added event fires on the upsert, i.e. **before** the lead has picked a
slot (typically 1–3 minutes earlier). WF-1's 10-minute wait exists to cover that gap.

## 4. Lead lifecycle across workflows

```mermaid
flowchart TD
    APP[Booking app upsert<br/>tags + custom fields] -->|webhook today / tag tomorrow| WF1[WF-1 New Lead Intake<br/>create opp @ New Lead<br/>10m wait → 3-touch book-a-call nurture]
    APP -->|call path only| BOOK[App books appointment<br/>on Trent's calendar]
    REBOOK[/book or /schedule page<br/>no tags] --> BOOK
    BOOK --> WF2[WF-2 Calendar Booking<br/>opp → Call Booked, owner, alerts]
    BOOK --> WF3[WF-3 Reminders<br/>confirm · 24h · 5h no-track · 2h · 30m · 15m internal]
    BOOK --> WF7a[WF-7a Auto No-Show Detection<br/>+2h: task 'mark call outcome']
    WF2 -->|stage Call Booked| OCK[Ockno → Google Ads conversion]
    WF1 -.->|stage check every touch| WF2
    CANCEL[Appt cancelled] --> WF4a[WF-4a Cancellation<br/>remove from a6767d56 · 3-email rebook · 30d → abandoned?]
    NOSHOW[Appt no-show] --> WF4b[WF-4b No-Show<br/>remove from a6767d56 · 3-touch rebook · 30d → abandoned?]
    OUTCOME[Human sets Call Outcome = No Show] --> WF7b[WF-7b → appointment status noshow] --> NOSHOW
    QUAL[Human moves opp → Call Completed – Qualified] --> WF5[WF-5<br/>task + email 'send quote' → 26neqm7F<br/>Call Outcome = Meeting Held<br/>remove from 5 workflows]
    PAID[Human moves opp → Paid stage 34e4ac3e] --> WF6[WF-6 Karbon Handoff<br/>tag active client · task → BV8SBit]
```

Human touchpoints that drive automation: moving the opportunity to **Call Completed – Qualified**,
setting **Call Outcome**, and moving to the **Paid** stage. Everything else is event-driven.

## 5. Workflow-by-workflow

### WF-1: New Lead Intake — *the one being replaced*

- **Trigger:** Inbound Webhook. Payload fields used: `email`, `phone`, `complexityTier`,
  `portfolioBracket`, `gainsBracket`, `transactionBracket`.
- **Steps:** update contact (email/phone) → tag `cold traffic` → internal SMS `New Paid CTME lead:
  {{contact.name}}` → country check (US/CA → tag `sms eligible`, else tag `sms ineligible`) →
  **Find Opportunity** (pipeline, status open, latest — *no stage filter*) →
  - Found → **dead end** (no nurture, no further action)
  - Not found → **Create Opportunity** at New Lead, name `{{first}} {{last}} - {{date}}`, source
    `Booking App`, 4 custom fields from webhook → **wait 10 min** → stage check
- **Nurture (only if not Call Booked at each check):**

| Touch | Timing | SMS (if `sms eligible`) | Email |
|---|---|---|---|
| 1 | +10 min | SMS 1 | Email 1 "Let's talk about your tax situation" |
| 2 | +24 h | SMS 2 | Email 2 "Quick question about your taxes" |
| 3 | +48 h more | — | Final "Last chance to book your tax review" |

  Every check is an **if/else** on `opportunities.pipelineId == pipeline AND pipelineStageId == Call
  Booked` → stop. (Whether that if/else actually resolves in a contact-triggered workflow is in
  question — §8 A4.) SMS-ineligible contacts get the same emails and Go-To back into the main chain
  at the next wait.
- **Exit:** ends after the final email. The opportunity stays open at New Lead forever unless a human
  moves it (no abandon step). Five distinct exit points: Found dead-end, the three Call-Booked
  stops, and the final email.
- Nothing removes the lead from this workflow when they book; it relies purely on the stage checks,
  which run *before* each touch.

### WF-2: Calendar Booking

- **Trigger:** Customer Booked Appointment on calendar `hepJCqq2UgwfaiVxQH0w`.
- Remove from `44ca2e05` + `ecde7278` (cancel/no-show) → Find open opp in pipeline (no stage filter) →
  - Found → move to **Call Booked** (a stage *transition* — what Ockno presumably sees)
  - Not found → country check → tag `sms eligible`/`sms ineligible` → **create opp at Call Booked**,
    name `{{contact.name}} | {{date}}` (per the summary: no source, no custom fields — confirm in builder)
- → Add owner `26neqm7F` (overwrite, "only unassigned: false") → internal SMS `New Paid CTME Calendar
  Booking: {{contact.name}}` → internal email "New call booked - {first} {last}" from `CTME
  Appointments` to `26neqm7F` ("New discovery call booked." + contact, email, phone, country,
  `{{appointment.start_time}}`).
- **Does not** remove the contact from WF-1. **Found branch skips the SMS-eligibility tagging.**

### WF-3: Appointment Reminders

- **Trigger:** same booking event.
- Branches first on contact field `SjZJD7P2FW8LemNrwxaE` **== "Yes"**; anything else (including
  unset) takes the No track.
  - **Yes track:** confirmation email → 24h (SMS+email) → 2h (SMS, or email if ineligible) → 30m SMS
    → 15m internal email from `CTME Appointments` to `26neqm7F` ("Call in 15 min - {name} - {{contact.source}}").
  - **No track:** confirmation email with Koinly setup link → re-checks the tax-software field at 24h,
    5h, 2h, 30m; each time it's still No, sends a Koinly-nag SMS/email; when it flips to Yes it
    Go-To's into the Yes track (wiring below). Ends at the 15m internal email.
- Every SMS gated on `sms eligible`.
- **Two probable builder bugs (confirm in GHL):**
  1. No-track **2h** Tax-Software = Yes → Go-To `54a68597` (the Yes-track **30-minute** SMS check),
     skipping both the Yes-track 2h reminder and the Wait-until-30m node. A lead who set up Koinly
     between 5h and 2h gets "Starting in 30 min!" roughly two hours early. Should target `c5520392`
     (Wait 30m) or the Yes-track 2h check.
  2. No-track **5h** SMS-eligibility check has **no Ineligible branch in the export**. Either a
     summary gap or a dead end: a non-US/CA No-track contact gets nothing after the 24h email — no
     Email 2/3, no 15m internal alert.

**Go-To wiring** (source branch → target node):

| From | To |
|---|---|
| Yes-track 24h Ineligible → Email 1 | `2890be18` Yes-track Wait 2h |
| Yes-track 2h Ineligible → Email 2 | `c5520392` Yes-track Wait 30m |
| Yes-track 30m Ineligible | `335892ca` Wait 15m |
| No-track 24h Tax-Software Yes | `ea4e79eb` Yes-track 24h SMS check |
| No-track 24h SMS Ineligible → Email 1 | `0180c032` No-track Wait 5h |
| No-track 5h Tax-Software Yes | `2890be18` Yes-track Wait 2h |
| No-track 2h Tax-Software Yes | `54a68597` Yes-track 30m SMS check **(bug 1)** |
| No-track 2h SMS Ineligible → Email 3 | `af6101e4` No-track Wait 30m |
| No-track 30m Tax-Software Yes | `54a68597` Yes-track 30m SMS check |
| No-track 30m SMS 4 / SMS Ineligible | `335892ca` Wait 15m |

### WF-4a: Cancellation Handler

- **Trigger:** appointment status `cancelled` (normal events, that calendar).
- Remove from `a6767d56` → wait 5 min → SMS 1 (if eligible) + Email 1 "Want to reschedule your tax
  review?" → 3 days → Email 2 "Still interested…" → 5 days → Email 3 "Your tax review is still
  available" (last) → **30 days → Update Opportunity status = abandoned**.
- The abandon step has **no Find Opportunity before it**; per GHL docs an Update Opportunity with no
  opportunity context is *skipped* (§8 A5). It has probably never run.

### WF-4b: No-Show Handler

- **Trigger:** appointment status `noshow` (normal events, that calendar).
- Remove from `a6767d56` → SMS 1 + Email 1 "We missed you today" → 24h → Email 2 "Your tax review is
  still on the table" (case-study) → 48h → second SMS check → SMS 3 (if still eligible) + Email
  "Should we close your file?" → **30 days → abandoned** (same caveat as WF-4a).

### WF-5: Qualified Notify + Task

- **Trigger:** opp moved to **Call Completed – Qualified** (`8ba098f5`) in the pipeline.
- Task to `26neqm7F`: "Send quote to {name}" / "Lead is qualified. Send engagement letter and invoice.
  Contact: {email} | Phone: {phone}".
- Opp custom field **Call Outcome = Meeting Held** (`allowBackward: false`).
- Internal email "Qualified lead - send quote to {name}" from `CTME | Assignment` to `26neqm7F`:
  "{name} has been moved to Call Completed - Qualified. Action needed: Send engagement letter and
  invoice." + email / phone / country.
- Remove from 5 workflows (`bf3ad526`, `f28be74b`, `ecde7278`, `927b8747`, `26651e4c`).
- This is the call-path "send a quote" moment. The quote path needs the same outcome (a human told to
  send a $1,500 quote) **without** a call, so the "Lead is qualified" / "Meeting Held" semantics don't
  fit — it should not just reuse this stage.

### WF-6: Karbon Handoff

- **Trigger:** opp moved to stage `34e4ac3e` (paid) in the pipeline.
- Tag `active client` → task to `BV8SBit`: "Karbon assignment - {name}" / "New paid client. Handle
  Karbon assignment. Contact: {email} | Phone: {phone}".
- **Pipeline-scoped.** If quote leads live in a different pipeline, a paying quote lead will never hit
  this unless a second trigger is added or they're moved into this pipeline at payment (and moving an
  opp between pipelines is reported to drop opportunity custom fields).

### WF-7a: Auto No-Show Detection

- **Trigger:** booking event. Appointment-relative wait, **2h after** the appointment
  (`appointmentCondition: skip`) → **Find Opportunity** at Call Booked → Found → task to `26neqm7F`
  "Mark call outcome for {name}" / "Please update the call outcome field in the opportunity for
  {name}". Not found → nothing.
- i.e. if the opp is still sitting at Call Booked two hours after the call, nudge a human to set the
  outcome. Moving the opp to a completed stage beforehand silences it.

### WF-7b: Call Outcome Handler

- **Trigger:** opportunity field **Call Outcome** becomes `No Show`.
- Find opp at Call Booked → found → set appointment status `noshow` (which fires WF-4b).
  Not found → try stage `826a34f7` → same. Else nothing.
- So the human no-show loop is: 7a task → human sets Call Outcome = No Show → 7b flips the appointment
  → 4b nurtures.

Note WF-7a/7b use **Find Opportunity (pipeline + stage) → Found/Not Found** for their stage checks —
the pattern GHL docs say is reliable — whereas WF-1 uses if/else on `opportunities.*`.

## 6. How the call path actually plays out end-to-end (today)

1. Lead passes the gate, submits contact info. App upserts contact (tags `qualified`, `high value`,
   custom fields, source) and — if the webhook env is set — fires the webhook → **WF-1** starts:
   contact touched again, `cold traffic`, internal SMS, opp created at New Lead, 10-min wait begins.
2. Lead ticks the $1,500 acknowledgement, picks a slot (typically within 1–3 minutes). App creates
   the appointment → **WF-2** finds the New Lead opp and moves it to **Call Booked** (Ockno
   conversion), assigns owner, alerts team. **WF-3** sends the confirmation email (track chosen by
   the tax-software field) and schedules reminders. **WF-7a** schedules its +2h check.
3. WF-1 wakes at 10 min, checks the stage, and — if the check resolves (§8 A4) — ends silently. If
   the lead never booked, the 3-touch nurture runs over ~3 days and then the opp just sits at New Lead.
4. Call happens. Human sets the outcome / moves the stage:
   - Qualified → **WF-5** (quote task + Meeting Held) → later Paid → **WF-6** (Karbon).
   - No Show → **WF-7b** → appointment `noshow` → **WF-4b** rebook nurture → 30 days → abandoned (probably skipped).
   - Cancel at any time → **WF-4a**.

## 7. Invariants the rebuild must preserve

- One open opportunity per contact in the pipeline (both WF-1 and WF-2 Find-before-Create).
- Opp reaches **Call Booked** on booking → Ockno conversion. Don't move that stage, and prefer a
  stage *transition* into it over creating directly at it until Ockno's mechanism is confirmed.
- `sms eligible` is set on the contact before any SMS step; country logic is US/CA only.
- Every customer-facing nurture stops the moment the opp is at Call Booked (stage check before each
  touch), and the cancel/no-show handlers remove the lead from the intake nurture (presumed via `a6767d56`).
- Human stage moves (Qualified, Paid) are the only way into WF-5/WF-6.
- `contact.source == "Booking App"` and opp source `Booking App` identify app-originated leads.

## 8. Findings that shape the redesign

Grouped: **A** = GHL platform behaviour that contradicts current assumptions (test before building),
**B** = consequences of moving WF-1 from webhook to tag trigger, **C** = collisions introduced by a
second lead type, **D** = pre-existing defects worth fixing while in there.

### A. Platform behaviour to verify (per GHL docs — test in §10)

- **A1. Upsert `tags` overwrites.** GHL's API reference for `POST /contacts/upsert` (and `PUT
  /contacts/{id}`) says the `tags` field *replaces* all tags on the contact and recommends the Add
  Tag endpoint instead. Field reports are mixed. If true, every resubmission through `createOrUpdateContact`
  strips `sms eligible`, `sms ineligible`, `cold traffic`, `active client`, `awesomely`, and the other
  path's trigger tag — and every WF-3/4a/4b SMS for that contact silently drops to the email branch.
  Robust fix regardless of test result: upsert **without** `tags`, then `POST /contacts/{id}/tags`
  (documented additive). That also guarantees custom fields are committed before the Tag Added event
  fires. The upsert response carries `new: true|false` — cheap way to detect a returning contact.
- **A2. Tag Added re-entry requires "Allow Re-entry" ON** in the workflow's settings; default is a
  contact can enter once ever. A Tag Added event for a contact *currently active* in the workflow is
  dropped, not queued — so "no double enrollment while active" comes free from GHL, not from tag
  presence. Also test that tags passed in the *creating* upsert (brand-new contact) raise Tag Added.
- **A3. "Customer Booked Appointment" trigger is deprecated** and GHL's replacement (Appointment
  Status trigger with a "Modified By" filter) classifies API-created appointments as source `API`,
  not `Customer`. The help article for the old trigger says it fires only for widget/booking-link
  bookings. Nothing in the repo records an observed WF-2 run for an app-created appointment. If
  this stops matching, **every booking-side automation goes dark with no error** (Call Booked move
  → Ockno, owner, alerts, reminders, +2h task). Keep `toNotify` unset (false suppresses automations).
  Plan: check WF-2 execution logs for a recent app booking; migrate WF-2/3/7a to Appointment Status
  · Normal · calendar filter · Modified By = Customer **and** API.
- **A4. If/else on `opportunities.pipelineStageId` has no documented opportunity context in a
  contact-triggered workflow**, even after an in-workflow Create Opportunity (GHL: "creating an
  opportunity earlier in the workflow does not automatically provide context"). WF-1's three stop
  checks may always take the NO branch — meaning a lead who booked at minute 2 still gets SMS 1 /
  Email 1 at minute 10. Cheap check: WF-1 execution log for any recent booker — which branch did
  "Check Pipeline Stage" take? In the rebuild, implement every stop check as **Find Opportunity
  (pipeline, stage = Call Booked / Quote Sent, status open, latest) → Found = stop**, exactly as
  WF-7a/7b already do.
- **A5. Update Opportunity with no context is skipped.** WF-4a step 11 / WF-4b step 12 ("→ abandoned")
  are appointment-triggered with no Find → almost certainly no-ops today. Evidence: filter the
  pipeline for opps whose contact cancelled/no-showed >30 days ago and look for status abandoned. Any
  Update in a non-opportunity-triggered workflow needs a Find Opportunity in front of it.
- **A6. Merge fields into opportunity custom fields only work for text/phone field types.** Confirmed:
  `Pcx2…`/`mYZe…`/`2oOf…` are **TEXT**, so mapping `{{contact.estimated_*}}` will work once the
  contact fields exist (A9). The 0/77 populated today is because the app only started sending brackets
  on 2026-08-15, after the last Booking App lead (Jul 17).
- **A7. Create/Update Opportunity toggles.** The combined action (`internal_create_opportunity`)
  exposes "Allow Duplicate Opportunities" and "Allow move to previous stage". With duplicates OFF the
  action *updates* an existing opp in the pipeline instead of creating — so the §B3 race may not
  produce two opps but may drag a Call Booked opp **back to New Lead** if backward movement is on.
  Set both OFF deliberately. GHL is phasing this action out in favour of separate Create and Update.
- **A9. Missing bracket custom fields.** `estimated_realized_gains` / `estimated_portfolio_value` /
  `estimated_transaction_count` don't exist on the contact (see §2); create them as TEXT before the
  rebuild or the `{{contact.estimated_*}}` merges in B2 resolve empty. While there, stop the app writing
  the redundant `country` / `utm_*` / `gclid` / `fbclid` / `landing_url` / `placement` /
  `site_source_name` custom fields (native fields cover them) and point `blockchains_used` at the
  existing `96Bh…` field.
- **A8. Remove From Workflow kills the target run at its current position**; pending waits are
  cancelled and no later step (including any cleanup) executes. Appointment-triggered runs (WF-3,
  WF-7a) exit on their own when the appointment goes Cancelled/No-Show/Rescheduled. No workflow here
  triggers on Rescheduled, so a native-link reschedule gets no reminders and no +2h task for the new
  time.

### B. Webhook → tag-trigger migration

- **B1. Remove the trigger tag as the FIRST step, not the last** (if a tag trigger is used at all —
  the current recommendation is API enrollment). WF-1 has five exits, and once the new IDs are added
  to WF-4a/4b/5 remove lists, three external kill switches. A remove-tag step after the final email
  runs only for non-bookers who sat through all three touches; every booker and every returning
  lead keeps `high value`, the app's next upsert re-sends a tag that's already there, Tag Added
  doesn't fire, and the intake is dead for that contact forever. Stripping the tag immediately after
  entry is safe (active runs drop re-fires anyway — A2) and survives any exit. Changes HANDOFF
  decision #4. Pair with Allow Re-entry ON.
- **B2. Delete step 1 (`create_update_contact`) and remap step 7A's four custom fields.** With a tag
  trigger every `{{inboundWebhookRequest.*}}` resolves empty — step 1 would blank email/phone on the
  triggering contact. Map from `{{contact.estimated_realized_gains}}` → `Pcx2…`,
  `{{contact.estimated_portfolio_value}}` → `mYZe…`, `{{contact.estimated_transaction_count}}` →
  `2oOf…` (subject to A6); drop `fLXV…`.
- **B3. Keep Find → Create → Wait in that order.** The earlier idea of Finding *after* the 10-min
  wait would make WF-2 create every booker's opp directly at Call Booked — no stage transition for
  Ockno to see, thin opps (no source/brackets) as the norm, and the New Lead opp appearing 10 minutes
  after the internal SMS. The race it defends against is narrow (GHL trigger latency vs. the lead's
  slot-pick time). If dedupe is still wanted, add a second Find after the wait that looks for a
  Call Booked opp and closes the New Lead one.
- **B4. Re-entry mostly lands on the "Found → dead end" branch.** Under the tag trigger re-entry is
  a designed path, but any existing app lead almost always has an *open* opp (non-bookers sit at New
  Lead forever; cancel/no-show sit at Call Booked). Find returns Found → nothing happens except the
  internal SMS, and the opp's bracket fields are now stale (the upsert just overwrote the contact's).
  Found must act: at minimum refresh the bracket fields; better, branch on the found opp's stage
  (New Lead → continue into the nurture; Call Booked or later → end).
- **B5. Multi-opp contacts make `opportunities.*` if/else ambiguous** (abandoned opp at Call Booked
  + fresh opp at New Lead). Another reason for A4's Find-based checks, which filter on status open.
- **B6. Tag Added must be smoke-tested on both create and update** (brand-new contact with tags in
  the upsert; existing contact whose tag was previously stripped). HANDOFF's open item covers only
  the first.
- **B7. `cold traffic`** is only ever added by WF-1. The replacement workflows (or the app) must add
  it if anything downstream segments on it.
- **B8. Internal SMS fires before dedup** — every resubmission pings the phone. Move it after Find,
  or make it conditional on Not Found.

### C. Quote-path collisions

- **C1. A quote lead who later books gets hijacked by WF-2.** WF-2's Find is stage-agnostic. Option
  (a) (quote stages in Trent's pipeline): the quote opp is found and moved to **Call Booked** (Ockno
  reports a conversion for a low-value lead), owner overwritten to `26neqm7F` (John loses it), and a
  quote nurture written as "stop only at Quote Sent" keeps sending on top of WF-3. Option (b)
  (separate pipeline): WF-2 creates a thin second opp at Call Booked; two open opps, two nurtures,
  John builds a quote while Trent preps a call. WF-2's remove list never includes the quote workflow
  and its alert doesn't say a quote is in flight. Fixes: add the quote workflow ID to WF-2's remove
  step; write the quote nurture's gate positively ("continue only while stage == awaiting-quote");
  under (b) add a Find-and-close in the quote pipeline inside WF-2; consider "only unassigned: true"
  on the owner step.
- **C2. Stage-agnostic Find swallows crossover leads.** Option (a): a stale New Lead opp (from a
  non-booking call lead) is Found by the quote workflow → dead end → **quote request silently lost**
  (no opp, no task, no notification). Reverse: a quote-stage opp is Found by the call workflow → no
  call nurture. Option (b): each pipeline is blind to the other → open opp + live nurture in both,
  contradictory messaging. Whatever Matt picks, Found cannot be a no-op (see B4), and under (b) each
  workflow should Find-and-close in the other pipeline on entry.
- **C3. Quote leads never get `sms eligible`/`sms ineligible`** unless the quote workflow sets it
  (WF-1 did; WF-2 only tags on its Not-Found branch). A quote lead who later books is Found by WF-2,
  skips tagging, and every SMS in WF-3/4a/4b silently drops to email. The quote workflow must run the
  country → tag step even if it sends no SMS, or WF-2 should tag on both branches.
- **C4. WF-4a/4b's abandon would abandon a paying quote lead.** "Pay without rebooking" is the
  *expected* outcome for a quote lead who booked then cancelled/no-showed; nothing removes them from
  4a/4b except a rebook or WF-5, so ~33–38 days later the same opp is set abandoned (if A5 is fixed
  and the step actually runs). Add 4a/4b to WF-6's remove list, or guard the abandon with a stage
  condition.
- **C5. The app does not guarantee exactly one trigger tag.** Qualifying brackets + `leadPath:
  'quote'` → all four tags, both workflows fire in the same second. All three brackets missing →
  `qualified=false`, `leadPath='call'` → **no tags at all**, contact created and never touched by any
  workflow once the webhook is gone. Fix in `route.ts`: derive path server-side
  (`qualified ? 'call' : 'quote'`), ignore client `leadPath` for tagging, and 400 on a missing bracket.
- **C6. WF-5 can't be reused for quote leads** (stamps Meeting Held, tasks `26neqm7F` not John, says
  "Lead is qualified"); a quote lead who books and qualifies would get a second quote task. Needs a
  distinct quote stage/trigger. **WF-6 is pipeline-scoped** — second trigger or shared Paid stage.
- **C7. The nurture is 100% "book a call"** (every CTA incl. WF-4a/4b pushes `{{BOOK}}`). Quote leads
  are under threshold by definition; a quote nurture needs different copy and a different stop
  condition.
- **C8. Notification recipients are the call team** (`+1 385…`, `26neqm7F`). Cloning WF-1's SMS step
  into the quote workflow sends John's quote requests to whoever holds that phone.

### D. Pre-existing defects (fix opportunistically)

- **D1.** WF-3 No-track 2h → `54a68597` Go-To skips the Wait-30m node (early "Starting in 30 min!").
- **D2.** WF-3 No-track 5h SMS check has no Ineligible branch in the export — possible dead end for
  non-US/CA No-track leads.
- **D3.** WF-2 creates thin opps (no source/brackets) when it's the creator — with the secondary
  `/book` + `/schedule` entry this happens for every nurture-link rebook where no open opp exists.
- **D4.** WF-5 removes from `ecde7278` but not `44ca2e05` — one of cancel/no-show isn't cleared at
  qualification.
- **D5.** No abandon step on the intake nurture; non-booking New Lead opps accumulate forever
  (and become the C2 trap).
- **D6.** Opp naming differs by creator (`First Last - date` vs `First Last | date`). Cosmetic but
  tells you which workflow made an opp.
- **D7.** Appointment title is `Crypto Tax Consultation - {first}` only; the book endpoint never
  receives lastName. One-line app fix if the full name is wanted.
- **D8.** `/book` and `/schedule` rebooks carry no app tags or custom fields.

## 9. Open questions for Spencer / Matt

- [x] ~~Stage names / user IDs / workflow ID map~~ — all resolved via API, see §2.
- [ ] **Where do quote opportunities live?** (Matt, emailed 2026-08-21.) Stage(s) in Trent's pipeline
      vs. a dedicated quote pipeline. Decides C1/C2/C6 handling.
- [x] ~~Field types~~ — TEXT.
- [ ] Approve creating the 3 missing bracket custom fields (A9).
- [ ] How does Ockno detect Call Booked — stage-change event or presence at stage? (B3)
- [ ] Is `cold traffic` used anywhere (smart lists, reporting, other workflows not in this set)?
- [ ] Does the Call Outcome radio have values beyond `Meeting Held` / `No Show`?
- [ ] What should a quote lead's nurture *ask for* — reply to the quote? book a call anyway? buy the
      course? — and what stage means "stop nurturing"?
- [ ] Quote turnaround promise for the confirmation page and the nurture copy.
- [ ] Has WF-2 ever demonstrably fired for an app-created (API) appointment? (A3 — check execution logs.)

## 10. Sandbox test plan (before retiring the webhook)

Run on a test contact in the live location; each maps to a §8 item.

| # | Test | Pass condition | For |
|---|---|---|---|
| T1 | Create contact via GHL UI with tags A, B; submit the app survey with that email; GET contact | tags = A, B + app tags (merge) — if only app tags, switch to Add Tags endpoint | A1 |
| T2 | Brand-new contact via app upsert with `high value` | new Call Lead workflow shows an execution | A2/B6 |
| T3 | While T2 is mid-wait, resubmit same email | no second execution, no duplicate SMS | A2 |
| T4 | After workflow ends (tag stripped), resubmit | second execution (Allow Re-entry ON) | A2/B1 |
| T5 | Enrol, remove contact via another workflow's Remove From Workflow, resubmit | re-enrols (tag was stripped at entry) | B1/A8 |
| T6 | Book via the app; open WF-2/WF-3/WF-7a execution logs | all three ran; note appointment source | A3 |
| T7 | Enrol, let Create Opportunity run, manually drag opp to Call Booked before the 10-min wait ends | stop check exits (Found) | A4 |
| T8 | Pre-create an opp at Call Booked by hand, then add the trigger tag | no second opp; Call Booked opp keeps its stage | A7/B3 |
| T9 | Trigger on a contact with all three brackets set; open the created opp | bracket fields populated with exact strings | A6/B2 |
| T10 | Cancel a test appointment with the 30-day wait shortened | abandon step shows *executed*, not skipped | A5 |
| T11 | Quote-path submission (`$10k – $50k` / `$25k – $100k` / `1,000 – 6,000`) | Quote Lead workflow runs, Call Lead does not, task reaches John | C5/C8 |
| T12 | Quote lead then books via `/schedule` link | decided behaviour from C1 (not a hijack) | C1/C3 |
| T13 | Reschedule a test appointment from the confirmation email | decide whether reminders/+2h task should re-run; today they don't | A8 |

---

## Appendix A — Full customer-facing copy

All emails signed "Matt". `{{BOOK}}` = `{{trigger_link.byWW9xuyiuyGVG73BDRF}}`,
`{{KOINLY}}` = `{{trigger_link.az9bkzRaUMYoWIPGCx2B}}`.

### WF-1 intake nurture

**SMS 1** (+10 min)
> Hey {{contact.first_name}}, thanks for reaching out about your tax situation. We help investors like you every day. Book a quick call with our team and we will walk you through what we can do: {{BOOK}}

**Email 1** — *Let's talk about your tax situation*
> Hi {{contact.first_name}},
> Thanks for reaching out to us.
> We reviewed your submission and would love to learn more about your situation. The best next step is a quick call with Trent on our data analysis team. He can look at your portfolio complexity, flag any risk areas, and give you a clear picture of what it would take to get everything sorted.
> Most calls take about 15 to 20 minutes.
> Book a time that works for you here: {{BOOK}}
> Best,
> Matt

**SMS 2** (+24 h)
> Following up, {{contact.first_name}}. 90% of the time, tax software overestimates capital gains for digital asset investors. We can show you where that might be happening. Book a free review: {{BOOK}}

**Email 2** — *Quick question about your taxes*
> Following up on your inquiry.
> One thing we see constantly: investors using tax software that inflates their capital gains. In about 90% of cases, the software overestimates what you owe because it cannot handle complex DeFi activity, NFTs, or cross-chain transactions properly.
> A quick call with our team can show you whether that is happening in your case and how much it could be costing you.
> Book your free review here: {{BOOK}}
> Best, Matt

**Final Email** (+48 h) — *Last chance to book your tax review*
> Hi {{contact.first_name}},
> This is my last follow up. Our team takes on a limited number of new clients at a time to make sure every portfolio gets the attention it deserves.
> If you want a specialist to review your transactions and make sure you are not overpaying or exposing yourself to audit risk, now is the time to book.
> Book your free review: {{BOOK}}
> Best,
> Matt

### WF-3 reminders — Yes track (has tax software)

**Confirmation** — *You're booked! Here's what to expect*
> Hi {{contact.first_name}},
> You're all set! Your tax review with Trent is confirmed for {{appointment.start_date_time}}.
> This will be a Google Meet call. Here's your meeting link: {{appointment.meeting_location}}
> To make the most of your time with Trent, come prepared with:
> - Your crypto tax software open and connected to your wallets/exchanges
> - A rough idea of how many transactions you have
> - Which tax year(s) you need help with
> Trent will be sharing his screen to walk through your transactions live, so make sure you're somewhere quiet where you can give the call your full attention.
> Talk soon,
> Matt

**SMS 1** (24 h)
> Hey {{contact.first_name}}, your tax review is tomorrow at {{appointment.only_start_time}} on Google Meet. Have your crypto tax software open and ready to go. Check your email for your meeting link and prep details.

**Email 1** (24 h) — *Your tax review is tomorrow*
> Hi {{contact.first_name}},
> Just a reminder that your tax review with Trent is tomorrow at {{appointment.only_start_time}} via Google Meet.
> Make sure you have:
> - Your crypto tax software open and connected
> - Your wallet/exchange info accessible
> - A quiet place where you can focus
> Here's your meeting link: {{appointment.meeting_location}}
> Talk soon,
> Matt

**SMS 2** (2 h)
> Your tax review is in 2 hours at {{appointment.only_start_time}}. Google Meet link: {{appointment.meeting_location}}

**Email 2** (2 h, SMS-ineligible only) — *Your call is in 2 hours*
> Hi {{contact.first_name}},
> Your tax review starts in about 2 hours via Google Meet. Have your crypto tax software open and ready.
> Here is your meeting link: {{appointment.meeting_location}}
> See you soon,
> Matt

**SMS 3** (30 min)
> Starting in 30 min! Google Meet link: {{appointment.meeting_location}}

**Internal email** (15 min, from `CTME Appointments` to `26neqm7F`) — *Call in 15 min - {first} {last} - {{contact.source}}*
> Upcoming call in 15 minutes. Contact / Email / Phone / Country / Source.

### WF-3 reminders — No track (no tax software)

**Confirmation** — *You're booked! One thing to do before your call*
> Hi {{contact.first_name}},
> Great news, your tax review with Trent is confirmed for {{appointment.start_date_time}}.
> Before the call, you'll need to set up Koinly and connect it to your wallets and exchanges. Without this, Trent won't be able to review your transactions and we'll need to reschedule.
> We've put together a step-by-step guide to walk you through it: Set up Koinly now ({{KOINLY}})
> This will be a Google Meet call. Here's your meeting link: {{appointment.meeting_location}}
> If you run into any trouble getting set up, just reply to this email and we'll help you out.
> Talk soon,
> Matt

**SMS 1** (24 h)
> Hey {{contact.first_name}}, your tax review is tomorrow at {{appointment.only_start_time}}. If you haven't set up Koinly yet, you need to do this before the call or we'll need to reschedule: {{KOINLY}}

**Email 1** (24 h) — *Action required before your call tomorrow*
> Hi {{contact.first_name}},
> Your tax review with Trent is tomorrow at {{appointment.only_start_time}} via Google Meet.
> If you haven't set up your Koinly account yet, you'll need to get this done before the call. If it's not connected to your wallets and exchanges, we'll have to reschedule. Simply click this link to set up your free account: Set up Koinly ({{KOINLY}})
> Once you're set up, come ready to discuss:
> - How many wallets and exchanges you use
> - Your approximate number of transactions
> - Which tax year(s) you need help with
> Make sure you're somewhere quiet where you can focus. Trent will share his screen to walk through your transactions live.
> If you're stuck or need help, reply to this email and we'll get you sorted.
> Here's your meeting link: {{appointment.meeting_location}}
> Talk soon,
> Matt

**SMS 2** (5 h, SMS-eligible branch only per export — see D2)
> Hey {{contact.first_name}}, your call with Trent is today. Last chance to get Koinly set up before we have to reschedule: {{KOINLY}}

**Email 2** (5 h, SMS-eligible branch only per export — see D2) — *Set up Koinly before your call today*
> Hi {{contact.first_name}},
> Your tax review with Trent is today at {{appointment.only_start_time}}.
> If Koinly still isn't set up and connected, we will need to reschedule your call. This is the last step you need to complete:
> Set up Koinly now ({{KOINLY}})
> If you've already done this, you're good to go. Here's your Google Meet link: {{appointment.meeting_location}}
> Need help? Reply now and we'll walk you through it.
> Matt

**SMS 3** (2 h)
> Your call is in 2 hours. Is Koinly set up? If not, please try to get to that before our call or we will need to reschedule. If you need help, simply reply to this text and we will be happy to assist.

**Email 3** (2 h, SMS-ineligible only) — *Our call is in 2 hours. Is Koinly ready?*
> Hi {{contact.first_name}},
> Your tax review starts in about 2 hours via Google Meet.
> If you haven't set up Koinly yet, please do it now:
> Set up Koinly now ({{KOINLY}})
> If it's not ready when we get on the call, we'll need to reschedule.
> Here is your meeting link: {{appointment.meeting_location}}
> See you soon,
> Matt

**SMS 4** (30 min)
> Starting in 30 min! Make sure Koinly is connected and ready. Google Meet link: {{appointment.meeting_location}}

### WF-4a cancellation

**SMS 1** (+5 min)
> No worries about the cancellation, {{contact.first_name}}. When you are ready to get your taxes sorted, grab a new time here: {{BOOK}}

**Email 1** — *Want to reschedule your tax review?*
> Hi {{contact.first_name}},
> We saw your appointment was cancelled. No problem at all.
> When you are ready, you can book a new time for your tax review here: {{BOOK}}
> Our team reviews portfolios like yours every day. A quick call is all it takes to determine where you stand and whether you're leaving money on the table or paying the appropriate amount to avoid any penalties.
> Best,
> Matt

**Email 2** (+3 d) — *Still interested in getting your taxes sorted?*
> Hi {{contact.first_name}},
> Just checking in. If your digital asset taxes are still on your to-do list, we are here to help.
> One of the biggest mistakes we see is investors waiting until the last minute and then scrambling with inaccurate tax software costing them both time and money. A 15 minute call now can save hours of stress later and possible penalties.
> Book a new time here: {{BOOK}}
> Best,
> Matt

**Email 3** (+5 d) — *Your tax review is still available*
> Hi {{contact.first_name}},
> This is my last follow up. Our team takes on a limited number of clients at a time and we are prioritizing investors who are serious about getting help with their taxes. We understand that life happens and you may have forgotten to book a new call so we are sending this last email to ensure we've done our part to take care of you.
> If you want to make sure your taxes are handled correctly this year, grab a time before our availability closes up: {{BOOK}}
> Best,
> Matt

### WF-4b no-show

**SMS 1**
> Hey {{contact.first_name}}, looks like we missed each other for your tax review. Want to reschedule? {{BOOK}}

**Email 1** — *We missed you today*
> Hi {{contact.first_name}},
> It looks like we were not able to connect for your tax review. These things happen.
> Trent still has your information ready to go, so when you reschedule he can pick up right where you left off. No need to re-submit anything.
> Book a new time here: {{BOOK}}
> Best,
> Matt

**Email 2** (+24 h) — *Your tax review is still on the table*
> Hi {{contact.first_name}},
> Following up from yesterday. We had a client last month in a similar situation: thousands of transactions, DeFi activity across multiple chains, and tax software telling them they owed way more than they actually did.
> After our review, they went from a capital gains position to a capital loss. The refund more than covered our fee.
> We would love to take a look at your situation. Book a new time here: {{BOOK}}
> Best,
> Matt

**SMS 3** (+48 h)
> Last follow up, {{contact.first_name}}. Your complimentary tax review is still available. Book here before our schedule fills up: {{BOOK}}

**Email 3** (+48 h) — *Should we close your file?*
> Hi {{contact.first_name}},
> I have followed up a few times and have not heard back, so I want to make sure I am not cluttering your inbox.
> If now is not the right time, no worries at all. If you do want help with your taxes, our capacity for this year is filling up. You can book directly here anytime: {{BOOK}}
> Otherwise I will close out your file on our end.
> Best,
> Matt

## Appendix B — Internal notifications and tasks

| Workflow | Type | From / To | Content |
|---|---|---|---|
| WF-1 | SMS | → +1 385 221 4162 | `New Paid CTME lead: {{contact.name}}` |
| WF-2 | SMS | → +1 385 221 4162 | `New Paid CTME Calendar Booking: {{contact.name}}` |
| WF-2 | Email | `CTME Appointments` → user `26neqm7F` | *New call booked - {first} {last}* — "New discovery call booked." + contact, email, phone, country, `{{appointment.start_time}}` |
| WF-3 | Email | `CTME Appointments` → user `26neqm7F` | *Call in 15 min - {first} {last} - {{contact.source}}* — contact, email, phone, country, source |
| WF-5 | Task | → user `26neqm7F` | *Send quote to {first} {last}* — "Lead is qualified. Send engagement letter and invoice. Contact: {email} \| Phone: {phone}" |
| WF-5 | Email | `CTME \| Assignment` → user `26neqm7F` | *Qualified lead - send quote to {first} {last}* — "{name} has been moved to Call Completed - Qualified. Action needed: Send engagement letter and invoice." + email, phone, country |
| WF-6 | Task | → user `BV8SBit` | *Karbon assignment - {first} {last}* — "New paid client. Handle Karbon assignment. Contact: {email} \| Phone: {phone}" |
| WF-7a | Task | → user `26neqm7F` | *Mark call outcome for {first} {last}* — "Please update the call outcome field in the opportunity for {first} {last}" |

## Appendix C — Node IDs (for Go-To targets in the GHL builder)

| Workflow | Node | ID |
|---|---|---|
| WF-1 | Find Opportunity | `4c6c8730-6caf-4095-b918-c8bf07819d37` |
| WF-1 | Wait 24hrs | `9454f35c-8d0c-4d4f-9057-257e8c5e201e` |
| WF-1 | Wait 48hrs | `aa5e7927-73de-4cea-958b-563cfba34937` |
| WF-2 | Create Opportunity | `9c673744-15ca-4d31-82b4-15a23ff88d6f` |
| WF-2 | Add Owner to Opportunity | `b1373f4d-2402-4647-a4dd-0150b5f75ffd` |
| WF-3 | Yes-track 24h SMS check | `ea4e79eb-bfae-4cbb-9170-40ac6e296f60` |
| WF-3 | Yes-track Wait 2h | `2890be18-cac6-4f52-8728-c9f96bbdff68` |
| WF-3 | Yes-track Wait 30m | `c5520392-8aa7-4910-9fd4-85b670fff1ca` |
| WF-3 | Yes-track 30m SMS check | `54a68597-ad0c-4f5c-a738-2bdd714c65b5` |
| WF-3 | Wait 15m (→ internal email) | `335892ca-5f13-4db1-8e4a-35f70d6d646f` |
| WF-3 | No-track Wait 5h | `0180c032-dc68-443d-a16c-1842248b050a` |
| WF-3 | No-track Wait 30m | `af6101e4-a336-4090-aeec-75058fe967be` |
| WF-4a | Wait 3 days | `78f045a8-e53b-4dc3-bd29-20323b275b01` |
| WF-4b | Wait 24 hours | `a743ed32-e79d-419e-ad41-373f9835271c` |
| WF-4b | Email "Should we close your file?" | `4097580f-e346-438e-b450-4d4321b6772d` |
| WF-4b | First SMS check: Eligible / Ineligible | `f1d9cae1-ea13-4974-8b52-f2bbea86fec4` / `ea3cd85d-272a-4c81-8523-55607c7a4660` |
| WF-4b | Second SMS check: Eligible / Ineligible | `7e6b4e27-095d-44d8-97e6-6b6013761c6f` / `91667998-28aa-4bd2-8e45-a3bfa54a78cb` |
