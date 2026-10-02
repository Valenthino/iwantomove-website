# Owner decisions before launch

The site and marketing files are implemented locally. They are not published. Resolve the visible placeholders and operational blockers below before sending traffic.

## Placeholder register

Find every occurrence with `git grep -n '\[\[PLACEHOLDER:'`. This register intentionally repeats each exact token.

| Token | Where it appears / what is needed |
|---|---|
| [[PLACEHOLDER: business email]] | Footer on all pages; privacy policy. Supply a monitored address. It is plain text until confirmed; use the tracked mailto component when replacing it. |
| [[PLACEHOLDER: service area]] | Footer, homepage MovingCompany schema, both service pages and Service schema; campaign and SEO docs. Confirm the actual operating area. |
| [[PLACEHOLDER: hours]] | Footer on all pages. Confirm contact/operating hours. No openingHours schema is emitted while unknown. |
| [[PLACEHOLDER: hero photo]] | Visible label in homepage CSS composition plus source comment. Supply an owned/licensed photo, or approve the composition and remove the token. |
| [[PLACEHOLDER: real reviews]] | Source comment only, not production HTML. There are no real reviews. Keep REVIEWS_ENABLED false until consented, verifiable reviews exist. |
| [[PLACEHOLDER: response time]] | Confirmation panel, thank-you page, both email formats, campaign and follow-up copy. Set a promise the business can meet. |
| [[PLACEHOLDER: insurance status]] | Visible homepage FAQ and matching FAQ schema. Owner must supply accurate wording; no coverage is claimed. |
| [[PLACEHOLDER: privacy contact]] | Privacy policy. Confirm who receives access/deletion requests. |
| [[PLACEHOLDER: data retention period]] | Privacy policy. Choose and implement a retention/deletion schedule for files, backups and email. |
| [[PLACEHOLDER: daily ad budget]] | Campaign setup. Owner approves spend; no campaign has been launched. |
| [[PLACEHOLDER: campaign start date]] | Campaign setup. Choose after launch blockers are cleared. |
| [[PLACEHOLDER: confirmed cities]] | Future local SEO plan only. No location pages exist. |
| [[PLACEHOLDER: business address or service-area profile choice]] | Google Business Profile plan only. Confirm eligibility and actual profile details. |

Built HTML intentionally contains footer tokens on all public pages (including 404); homepage additionally has hero photo and insurance; privacy additionally has retention/privacy contact; thank-you additionally has response time. Service-area schema repeats the visible service-area token. The response-time token also exists in the client confirmation bundle and server email code. No review token or review markup is in homepage HTML. Marketing-only tokens do not appear in site HTML. See 08 for the actual audit.

## Configuration and credentials

- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, LEAD_FROM_EMAIL, LEAD_TO_EMAIL. Configure all required values. Verify the sender domain and live delivery to the approved business inbox; SPF/DKIM/DMARC and spam-folder checks remain owner/deployment work. Never paste credentials into git.
- LEADS_FILE and persistent /data volume. Set permissions for UID 1001, backups, retention, disk monitoring and an assigned person to reconcile leads. A local SMTP sink was tested; no customer or business email was sent.
- NEXT_PUBLIC_GA4_ID, NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GTM_ID are optional build-time public identifiers. Configure only approved destinations. Avoid installing the same GA4 or Meta destination both directly and through GTM. Disable GA4 automatic history pageviews when using this helper. Validate live events and consent in the owner’s accounts before ad spend.
- Meta Business account, Facebook Page, Instagram account, ad account, dataset/pixel access and Instant Form permissions. Owner approves account use, geographic targeting, budget, creative copy, scheduling and publication. No account or campaign changes were made.
- Optional self-hosted n8n: instance access, Meta lead retrieval credentials, email credentials and a private lead-file mount. The documented flow is not deployed. Establish native-form lead reconciliation before publishing Instant Form ads.
- Domain/DNS and Coolify access for the intended deployment, TLS, canonical hostname redirects, persistent volume and health check. TRUST_PROXY=true requires a proxy that overwrites forwarded client IPs and blocks direct backend access. Leave false otherwise, with the documented shared rate-limit bucket.
- Google Business Profile and Search Console access for verification and submission. Confirm the actual profile identity before creating or changing it.

## Approvals and limits

The only confirmed business facts used are IWantToMove.ca, 778-513-7503, local residential moving and office moving, and the absence of reviews. The trust strip is explicitly a set of service promises. Owner approval is needed for those promises, the response time, legal/privacy wording, insurance wording, actual areas/hours, creative assets and final launch copy. Quotes and availability are discussed with each lead; no prices, capacity or booking guarantees are published.

Production deployment, public publishing and ad spend still require approval. Docker is not installed in the implementation environment, so the image has not been built or run here. The actual standalone server was built and smoke-tested locally; a container build, volume write and health check in Coolify remain deployment checks.

Analytics mappings and no-ID behaviour were tested locally. Real GA4, Meta and GTM delivery, account settings, browser ad-blocker behaviour and iOS/Safari were not tested. The limiter is process-local; keep one instance until a shared limiter/storage plan is implemented.

The fleet’s content-clean loopback service returned HTTP 401. No service credentials were accessed, and no automated provenance-cleaning result is claimed. Source text was reviewed with the humanizer rules; the assets are authored CSS/SVG and static HTML. If the internal content-clean step is required for publication, an authorised operator must run it before release.
