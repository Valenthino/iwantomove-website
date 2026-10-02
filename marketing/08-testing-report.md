# Implementation test report

Run locally on 2026-10-01 (America/Vancouver; UTC date 2026-10-02). Node v22.23.2, npm 12.0.2, Next.js 15.5.27. Tests used synthetic names, example.invalid email addresses and test phone numbers. No real inbox, ad account or production deployment was contacted.

## Build and static checks

| Command | Observed result |
|---|---|
| npm ci | Exit 0; 328 packages installed; zero audit vulnerabilities. npm printed an ESLint 9 end-of-support notice. |
| npm run build | Exit 0; all 15 static generation tasks completed; standalone output produced. |
| npx tsc --noEmit | Exit 0, no type errors. |
| npm run lint | Exit 0, no lint errors or warnings. |
| npm audit | Exit 0, zero vulnerabilities. |
| node scripts/analytics-check.mjs | All eight event names, GA4/Meta mappings, location/step parameters and GTM queue passed. Missing/invalid IDs, declined consent, blocked storage and a throwing tag were safe. |
| node scripts/audit-placeholders.mjs | All 13 distinct source tokens registered; built HTML tokens matched the allowlist; review markup absent. |

The initial npm install was blocked by npm 12’s remote-tarball setting. The project .npmrc permits registry tarballs. An initial audit found older Nodemailer/PostCSS advisories; Nodemailer was updated and PostCSS overridden to a patched release. The final audit is clean. Initial lint traversed downloaded browser files and Next’s generated declaration; the final config excludes generated files. A canonical assertion was corrected to match Next’s root URL normalisation. The formatter split one JSX token; that token is now a string expression and the token audit prevents recurrence.

## Production HTTP and browser smoke test

Started the actual .next/standalone/server.js on 127.0.0.1:3100, with copied public/.next/static assets, TRUST_PROXY=true for synthetic test IPs, and LEADS_FILE pointing inside ignored .data/. Port 3000 was occupied, so the existing listener was left untouched.

Command: `TEST_URL=http://127.0.0.1:3100 PLAYWRIGHT_BROWSERS_PATH=./.data/browsers npm test`.

| Request | Observed result |
|---|---|
| GET / | 200 |
| GET /quote | 200 |
| GET /services | 200 |
| GET /services/residential | 200 |
| GET /services/office | 200 |
| GET /privacy | 200 |
| GET /thank-you | 200 |
| GET /health.json | 200; JSON exactly {"status":"ok"} |
| GET /opengraph-image | 200 |
| GET /sitemap.xml, /robots.txt, /manifest.webmanifest, /icon.svg | All 200 |
| GET /missing-page | 404 |
| GET /api/lead | 405 |
| POST /api/lead, valid | 200, ok true; JSONL count increased by one and stored name matched; metadata said SMTP unconfigured |
| Invalid phone, unknown field, impossible calendar date | Each 422 |
| Oversized body | 413 |
| Malformed JSON | 400 |
| Wrong content type | 415 |
| Sixth request from one synthetic IP in the window | 429 |

Rejected requests did not increase the lead file. Chromium checked all seven content pages at 390×844 for horizontal overflow, one H1, title/description length and canonical URL. It submitted an empty step to show inline validation, completed all three steps, submitted a lead and saw the confirmation panel. The file gained a second line. Operational SMTP metadata was absent from the UI. Across these visits there were zero external HTTP requests and zero browser JavaScript errors with analytics IDs unset.

Screenshots at test-results/home-mobile.png, home-desktop.png and quote-mobile.png were generated and visually inspected. The desktop viewport was 1440×1000. Screenshots are local evidence, ignored in git; the site and committed creative PNGs are the deliverables.

## Email and storage failures

Command: `node scripts/secondary-failures.mjs`.

An isolated local SMTP sink received two messages: a business notification and customer confirmation. Assertions verified multipart plain text/HTML, escaped script/image input in the HTML, local timestamp and /quote source. SMTP connection refusal then returned 200 with both email statuses failed, and the lead remained in JSONL. An unwritable path (a file where a directory was required) returned 503 with storage_unavailable. All checks passed. Real SMTP authentication, inbox delivery, DNS sender configuration and spam placement remain untested.

## Built HTML placeholder inventory

All page footers, including 404: [[PLACEHOLDER: business email]], [[PLACEHOLDER: service area]], [[PLACEHOLDER: hours]].

Additional intentional tokens:

- Homepage: [[PLACEHOLDER: hero photo]], [[PLACEHOLDER: insurance status]]. Service-area and insurance tokens also appear in matching JSON-LD.
- Privacy: [[PLACEHOLDER: data retention period]], [[PLACEHOLDER: privacy contact]].
- Thank-you: [[PLACEHOLDER: response time]]. The same token is in the client-rendered quote success panel and email code.
- Both service detail pages: service-area token also occurs in the Service schema.

The real-review placeholder exists only in source comments/docs. No reviews-heading, “From our customers” section or real-review placeholder was found in production homepage HTML. Marketing-only budget, start-date, city and profile-choice tokens are absent from site HTML. Next’s hydration data may repeat the same intended page tokens.

## Creative rendering

Command: `PLAYWRIGHT_BROWSERS_PATH=./.data/browsers npm run creatives`.

All six families rendered in both ratios: couch, friend-with-a-truck, moving-stress, professional, relationship and stairs. Twelve PNG files were written to marketing/creatives/out/. The renderer checked both browser canvas bounds and PNG header dimensions: six at exactly 1080×1350 and six at exactly 1080×1920. Every file passed text-boundary checks and made zero external requests. The relationship vertical PNG was visually inspected alongside website screenshots. Full placement previews in Meta remain pending.

## Self-review and limits

Reviewed the full source for business claims, the order of persistence/email, strict input validation, HTML escaping, proxy trust, analytics no-op behaviour, Docker COPY inputs, gitignored lead/secret files, metadata and placeholder coverage. The only service pages are residential and office. Reviews remain disabled. No runtime secrets or real customer records are committed.

Docker is absent from this environment, so no Docker build/run is claimed. Container filesystem permissions, volume persistence, Coolify routing and public TLS still need deployment verification. Live analytics receipt and native Instant Form ingestion were not tested; the n8n workflow is documented, not installed. No Lighthouse score, field performance number, Safari test or production load test is claimed.

The internal content-clean service health request returned 401. No authenticated cleaning was run. Humanizer review was applied to the website and marketing prose. Publication remains gated by the open-items list, not by this local test report.
