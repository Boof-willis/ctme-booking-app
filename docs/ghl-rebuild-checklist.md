# GHL rebuild checklist — Paid Ads intake + quote path

**Status 2026-08-21: LIVE.** App deployed (`1d17bef`, worker version `443b74c4`), both paths smoke-tested in prod.
Remaining: confirm WF-2 fires on the first real booking (legacy trigger). Everything else complete.

Work top to bottom. Nothing goes live until Part G. Reference: [ghl-workflows.md](ghl-workflows.md).

## A. Collect IDs (write them here)

- [x] Location `bkl1s4il2Wd9IOmUteYI` · Calendar "CTME Consultation" `hepJCqq2UgwfaiVxQH0w`
- [x] **Paid Ads** pipeline `UQpqvvESbLvvSwWykKiu` (exists, currently empty). Stages:
  - New Lead Low Value `0953293a-15bb-46af-a915-56e8b0937631`
  - New Leads High Value `03cc2508-46f4-483b-ba7c-8b7acf722631`
  - Quote Requested `1d873e15-395a-4532-a88f-1b689e44e059`
  - Quote Sent `2f371a44-f2fd-4bb8-baf7-3708a45e74d3`
  - Awaiting Payment `c3d829ab-50f3-4edd-b33b-4b741ba2787b`
  - Purchased // Awaiting Work Creation `092643df-66f1-4ed9-9b15-e93b07105357`
- [x] **Trent's Pipeline** `3aFFl64cmFYhhlAemlry` — full stage list now known:
  - New Lead `452b9691…` · Call Booked - Cold Traffic `9e4f376b…` · Call Booked - Warm Traffic `826a34f7…` · Call Booked- Awesomely `5f759ef6-0f50-44a0-a8da-6f9165641370` · Call Booked - Sam's List `1a619421…` · Call Booked - Reengagement `99ab3e7d…`
  - Call Completed - Follow Up Needed `fdd95b50-4e0b-4956-9819-d9dbd2ac5dcf` · Call Completed - Qualified `8ba098f5…`
  - 2025 Quote Sent `f9e315c4…` · 2026 Quote Sent `28b2db66…` · Awaiting Payment `db302d2b…` · Paid / Awaiting Work Creation `34e4ac3e…` · Work Created `cd528408…` · Lost / Price · Lost / Follow Up Next Year · Lost / DIY · Lost / Used Another Firm
- [x] `26neqm7F5jgWsOK1u7In` = **Trent** (owner of all CTME Consultation calendars)
- [x] **John** = `BV8SBitITFl4yo6A9d8s` · Randy = `Fzj3sVqPAa4JE2NPDbZd` · Matt = `PthRDXYECKzAju0OfjRR`
- [x] Workflow IDs: WF-1 `0dd96134-89e7-4b24-a20e-3382121d567e` · WF-2 `b9e0ff5b…` · WF-3 `a6767d56…` · WF-4a `44ca2e05…` · WF-4b `ecde7278…` · WF-5 `43919da5…` · WF-6 `3ef6d316…` · WF-7a `f28be74b…` · WF-7b `bf3ad526…`. **`a6767d56` is WF-3 Reminders, not WF-1** — WF-4a/4b never removed leads from the intake nurture. WF-5's list also hits the warm-track WF-3bW/WF-4W.
- [x] Opp bracket fields `Pcx2…`/`mYZe…`/`2oOf…` are **TEXT** — merge values will work. (0/77 populated today only because the app started sending brackets on Aug 15.)
- [x] Token scopes: all read scopes + `contacts.write` + tags write.
- [x] Call Lead: webhook `…/webhook-trigger/EtqpZfuP63w1xTWpCnLo`, workflow ID `3a3bf9f7-9ce0-42df-8167-36917ea211c2` or `3fd86c56-b73d-47ca-83f5-76ef4d29d296` (both new; confirm which is which)
- [x] Quote Lead: webhook `…/webhook-trigger/VcNZzuv6Ttvnx07o0I4P`
- [x] Attribution: stored natively in `attributionSource` on the contact (73/77 Booking App contacts have it). No custom fields needed.
- [ ] (optional, for smart-list reporting) Create 3 contact custom fields (TEXT): `estimated_realized_gains`, `estimated_portfolio_value`, `estimated_transaction_count`. Not a blocker — the workflows read brackets from the webhook payload.
- [ ] A draft "Copy - WF-1: New Lead Intake" (`11938b28…`) already exists — check whether Randy started this; reuse or delete.
- [ ] Tags `qualified`, `quote`, `quote sent`, `appointment cancelled`, `appointment no-show` already exist in the location — check nothing else triggers on `qualified` before the app starts writing it.

**Trigger decision (2026-08-21):** keep the **Inbound Webhook** trigger so workflows have the full payload (`{{inboundWebhookRequest.*}}`). The app posts to one of two webhook URLs based on `leadPath`. The only WF-1 fix is step 1 matching on **email only**.

**Pipeline decision (Part B changes):** use Randy's existing stages — Call Lead creates at **New Leads High Value**, Quote Lead creates at **Quote Requested** (or New Lead Low Value → Quote Requested). Don't add a "Closed" stage; Purchased // Awaiting Work Creation is the WF-6 second-trigger stage.

## B. Paid Ads pipeline

- [x] Pipeline and stages already exist (see A). Leave as-is.
- [x] Contact field `Call Completed Date` (`call_completed_date`, ID `QUz7Al0TpLiPSN5CQmPD`) created via API

## C. Build "Booking App: Call Lead" (clone WF-1)

- [ ] Clone WF-1 → rename. Settings: **Allow Re-entry ON**. Keep the **Inbound Webhook** trigger; copy its URL into Part A.
- [ ] Step 1 "Create/Update Contact": keep, but set **Email only** (remove the Phone mapping) so it always resolves to the contact the app just upserted
- [ ] Keep: tag `cold traffic`; country US/CA → `sms eligible` / else `sms ineligible`
- [ ] Find Opportunity → pipeline **Paid Ads** `UQpqvvESbLvvSwWykKiu`, status open, latest
  - [ ] Not Found → Create Opportunity: Paid Ads / **New Leads High Value** `03cc2508…`, source `Booking App`, name `{{contact.first_name}} {{contact.last_name}} - {{right_now.middle_endian_date}}`, custom fields `Pcx2` = `{{inboundWebhookRequest.gainsBracket}}`, `mYZe` = `{{inboundWebhookRequest.portfolioBracket}}`, `2oOf` = `{{inboundWebhookRequest.transactionBracket}}` (already wired — just verify). Remove the complexity-tier field. "Allow duplicates" OFF, "Allow previous stage" OFF.
  - [ ] Found → Update Opportunity with the same three fields, then continue (no dead end)
- [ ] Move the internal SMS `New Paid CTME lead` to *after* the Find/Create
- [ ] Wait 10 min (keep)
- [ ] Replace all three "Check Pipeline Stage" if/else nodes with **Find Opportunity → Trent's pipeline `3aFFl64…`, stage Call Booked `9e4f376b…`, open** → Found = end, Not Found = next touch
- [ ] Leave SMS 1 / Email 1 / SMS 2 / Email 2 / Final Email copy as-is
- [ ] After Final Email: Wait 30 days → Find Opportunity (Paid Ads, open) → Found → Update status Abandoned
- [x] Built and published 2026-08-21

## D. Build "Booking App: Quote Lead" (clone Call Lead)

- [ ] Clone Call Lead → rename. Allow Re-entry ON. Inbound Webhook trigger → new URL; copy into Part A.
- [ ] Keep country → sms tags step (even though this path is email-only)
- [ ] Find Opportunity → Paid Ads, open
  - [ ] Not Found → Create at **Quote Requested** (same fields as C)
  - [ ] Found → Update: move to Quote Requested + refresh fields
- [ ] Add Task → **John** `BV8SBitITFl4yo6A9d8s`: "Send quote to {{contact.first_name}} {{contact.last_name}}" / body with email + phone + brackets. Add internal email to John, same content. Remove the `+1 385…` SMS.
- [ ] Replace the nurture with quote copy (TBD with Matt). Stop check before each touch = Find Opportunity (Paid Ads, stage **Quote Sent**, open) → Found = end.
- [ ] Tail: Wait 30 days → Find → Abandoned
- [x] Built and published 2026-08-21

## E. Edit existing workflows

**WF-2 Calendar Booking** — done 2026-08-21
- [x] Step 1 remove-from-workflow: add **Call Lead** and **Quote Lead** IDs
- [x] Insert new first Find: Paid Ads, open → Found → Update Opportunity → pipeline **Trent's**, stage **Call Booked** → Go To "Add Owner"
- [x] Not Found → existing logic (Find Trent's → move / create) unchanged
- [ ] Add the `sms eligible` / `sms ineligible` tagging on the Found branch too
- [ ] Check Execution Logs: has this fired for an app booking in the last 30 days? If not, replace trigger with **Appointment Status** · Normal · calendar `hepJCqq…` · Modified By = Customer **and** API

**WF-3 Reminders, WF-7a No-Show Detection**
- [ ] Same trigger check/migration as WF-2 — only if WF-2's execution log shows it stopped firing for app bookings.
- [x] WF-3 fix: No-track 2h "Tax Software = Yes" Go-To → retarget from `54a68597` to `c5520392` (Wait 30m)
- [x] WF-3 check: No-track 5h SMS-eligibility check — add an Ineligible branch (Email 2 → Go To Wait 2h `2890be18`) if missing

**WF-4a Cancellation, WF-4b No-Show**
- [x] Step 1 remove-from-workflow: keep `a6767d56` (WF-3 Reminders) and **add** Call Lead + Quote Lead
- [ ] Before the final "Update opportunity → Abandoned": insert Find Opportunity (Trent's, open) → Found → Update

**WF-5 Qualified**
- [x] Remove-from-workflow list: add Call Lead + Quote Lead

**WF-6 Karbon**
- [x] Add second trigger: Pipeline Stage Changed → Paid Ads / **Purchased // Awaiting Work Creation** `092643df…`

**WF-7b Call Outcome** — done as a separate **WF-7c** (Meeting Held → Showed) + new **Call Held** workflow (Appointment Status Showed → tag `call completed` + `Call Completed Date`, once per contact)
- [x] Add trigger/branch: Call Outcome = **Meeting Held** → Update appointment status **Showed** → Add tag `call completed` → set `call_completed_date` = `{{right_now.date}}`

**WF-1**
- [x] Unpublish (don't delete until Part G passes)

## F. App changes (Spencer / Claude)

- [x] `route.ts`: path = `qualified ? 'call' : 'quote'`; ignore client `leadPath` for tagging; 400 if any bracket missing
- [x] `route.ts`: fire the webhook to `GHL_WEBHOOK_CALL_LEAD` or `GHL_WEBHOOK_QUOTE_LEAD` based on path (replace the single `GHL_CONTACT_WEBHOOK_URL`); make it `await`ed with the response status logged, not fire-and-forget
- [x] Trim the payload: drop `complexityScore` / `complexityTier` / `taxYearsCount` / `chainCount` / `hasPreR2021` and `computeComplexityScore`; keep `contactId`, names, `email`, `phone`, `country`, brackets, `qualified`, `leadPath`, `tags`, `taxYears`, `blockchains`, `hasTaxSoftware`, `taxSoftwareName`, `utmParams`, `ockno_id`
- [x] `lib/ghl.ts`: upsert **without** `tags`; then `POST /contacts/{id}/tags` (additive) with `qualified|quote-requested` + `high value|low value` (+ `awesomely`)
- [x] `lib/ghl.ts` cleanup: stop writing the non-existent `country`, `utm_*`, `placement`, `site_source_name`, `landing_url`, `gclid`, `fbclid` custom fields (native `country` + `attributionSource` cover them); point `blockchains_used` at existing key `if_no_which_blockchains_have_you_used_from_most_to_least`
- [x] Forward `lastName` to `/api/ghl/book`
- [x] Update `.env.local.example` + Cloudflare env with the two webhook URLs
- [x] `tsc --noEmit`, `next build`

## G. Test on a throwaway contact (before deploy)

- [x] Call path submit → contact has tags + fields → webhook returns 200 in app logs → Call Lead shows 1 execution → opp at Paid Ads / New Lead with brackets filled
- [ ] Book → WF-2 / WF-3 / WF-7a execution logs show a run → opp now in Trent's / Call Booked → Ockno sees it
- [ ] Wait 10 min → Call Lead ended (Found), no SMS 1 sent
- [ ] Resubmit same email mid-nurture → no second execution, no second opp, `sms eligible` still on contact
- [x] Quote path submit (`$10k – $50k` / `$25k – $100k` / `1,000 – 6,000`) → Quote Lead runs, Call Lead doesn't → opp at Quote Requested → John gets the task
- [ ] Move quote opp to Quote Sent → nurture stops
- [ ] Set Call Outcome = Meeting Held on a test opp → appointment Showed + `call completed` tag + date
- [ ] Set Call Outcome = No Show → appointment noshow → WF-4b runs
- [ ] Cancel a test appointment → WF-4a runs, contact removed from Call Lead

## H. Cutover

- [x] `npm run deploy` (2026-08-21, Matt's Cloudflare account)
- [ ] Watch the first 3 real submissions in Execution Logs
- [ ] Delete WF-1 after one clean week
- [x] Smart list "Calls completed" = tag `call completed` (+ date range) — this is the metric
