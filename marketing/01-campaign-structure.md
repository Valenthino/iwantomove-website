# Campaign setup

Draft for owner approval. Nothing is published and no spend is authorised. Start with one Leads campaign and two ad sets. Keep the same geography and creative mix so the destination test is useful. These are proposed settings, not claims about an existing account.

| Setting | Website leads | Instant Forms |
|---|---|---|
| Campaign | IWTM / Local / Leads / v1 | Same campaign |
| Objective | Leads | Leads |
| Conversion location | Website | Instant Forms |
| Optimisation | Maximise conversions; dataset event Lead | Maximise number of leads; completed form |
| Audience | Adults in [[PLACEHOLDER: service area]]; broad, no interest stack | Same geography and audience |
| Placements | Advantage+ placements; inspect all previews | Same |
| Proposed budget share | 70% | 30% |
| Budget control | Ad set budgets under one campaign | Same; no extra family-specific ad sets |
| Total daily budget | [[PLACEHOLDER: daily ad budget]] | Part of the same total |
| Schedule | [[PLACEHOLDER: campaign start date]]; proposed initial 14-day test | Same |
| Destination | https://iwantomove.ca/quote | Native higher-intent form, if available |
| Attribution | Proposed 7-day click / 1-day view; confirm account options | Same comparison window |
| Success measure | Cost per reachable, qualified lead; then booked move | Same; separate by source |

Run the professional control and two challengers at a time in each ad set. Rotate the remaining families after enough qualified conversations to compare them. Avoid daily edits based on a handful of clicks. Keep a dated sheet of spend, leads, reachable leads, quotes and bookings by ad set and creative. No target CPL is assumed.

## Website path

Ad → /quote → three steps → POST /api/lead → durable JSONL → business notification and optional customer email → confirmation panel. Lead fires only after the server accepts and stores the request. /thank-you supports future redirect flows; a direct visit must not count as a lead.

Fields match the implementation exactly:

1. Moving from (required text, city/FSA is fine), moving to (required text), moving date (date or not sure yet).
2. Property type: Apartment / Condo / House / Office / Storage / Other. Size: Studio / 1 bedroom / 2 bedrooms / 3 bedrooms / 4+ bedrooms / Small office / Large office / Not sure yet. Service: Residential Moving / Office Moving / Not sure yet. Property type describes the move, not an additional offered service.
3. Name and phone required; email and additional notes optional. Contact permission copy: “By sending this request, you’re asking us to contact you about your move.” Link /privacy.

Confirmation: “Your next move starts here. We’ll review your request and contact you by phone within [[PLACEHOLDER: response time]] to confirm the details and give you a quote. Your move isn’t booked yet.” Call now: 778-513-7503.

UTM template:
`utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign=iwtm_local_leads_v1&utm_content={{ad.name}}&utm_term={{adset.name}}`

Use stable ad names such as `relationship_45_v1`; never put personal information in names or URL parameters. Meta URL parameters are set on each ad. The app deliberately sends pathname only to its event helper. Platform scripts may read the landing URL; UTMs are for aggregate reporting, not stored on individual website lead records. The stored source is /quote. Lead-level campaign attribution would require an approved, allowlisted schema extension.

## Instant Form path

Intro headline: “Get a Free Moving Quote”. Intro body: “Tell us a little about your move. We’ll call to confirm the details and give you a quote.” Use the higher-intent review screen where offered.

Questions, in order:

1. “Where are you moving from?” Short answer, required; city/FSA accepted.
2. “Where are you moving to?” Short answer, required.
3. “When are you hoping to move?” Short answer, optional; write a date or “Not sure yet”.
4. “What type of property?” Multiple choice: Apartment / Condo / House / Office / Storage / Other.
5. “What’s the approximate size?” Multiple choice: the same eight size options as the website.
6. “Which service do you need?” Residential Moving / Office Moving / Not sure yet.
7. Full name and phone number: required contact fields. Email: optional where the account supports it; otherwise omit rather than make email mandatory.
8. “Anything else we should know?” Optional short answer, if supported. Omit if the UI cannot make it optional.

Privacy URL: https://iwantomove.ca/privacy. Contact copy: “By sending this request, you’re asking IWantToMove.ca to contact you about your move.” No newsletter opt-in is bundled.

Thank-you headline: “Thanks. Your request is in.” Body: “We’ll review your move and call within [[PLACEHOLDER: response time]] to confirm the details and give you a quote. Your move isn’t booked yet.” Website button: “View next steps” → https://iwantomove.ca/thank-you?utm_source=meta&utm_medium=instant_form&utm_campaign=iwtm_local_leads_v1. Include “You can also call 778-513-7503.”

Native submissions land in Meta’s lead tools, not automatically in this app. Before launch, connect the authenticated Meta Lead Ads trigger to the owner’s n8n instance or assign a person to export and reconcile leads. See 05 for the file destination, deduplication and notification path. Don’t POST native leads to the public website endpoint: it intentionally only accepts website sources and has a public rate limit. Use Meta’s native completion reporting, not a browser Lead event on the thank-you page.

Meta UI options vary by account. Confirm the actual options during setup. The proposed destination split follows Meta’s [lead generation setup guide](https://about.fb.com/ltam/wp-content/uploads/sites/14/2023/11/LeadGenerationGuide.pdf); no external CRM or paid connector is required by this repository.
