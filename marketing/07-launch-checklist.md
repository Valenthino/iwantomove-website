# Launch checklist

Status applies to the local implementation, not a production deployment.

- [x] ✅ verified — Next.js 15, TypeScript, Tailwind v4 and standalone output; Node 22 build.
- [x] ✅ verified — Required pages, only two service-detail pages, helpful 404 and /health.json.
- [x] ✅ verified — SVG wordmark/favicon, local CSS hero and OG image route; no external image URLs.
- [x] ✅ verified — Mobile layout, large primary controls, inline form validation and successful three-step submission.
- [x] ✅ verified — Strict validation, 16 KiB body ceiling, unknown-field rejection and rate limit.
- [x] ✅ verified — JSONL stored before email; no-SMTP and SMTP-failure success; storage failure returns 503.
- [x] ✅ verified — Local SMTP sink receives text/HTML notification and optional confirmation; HTML input is escaped.
- [x] ✅ verified — Reviews absent from production homepage HTML.
- [x] ✅ verified — Placeholder tokens inventoried; no fabricated testimonials, ratings, areas or credentials.
- [x] ✅ verified — Per-page metadata, canonicals, OG/Twitter, schema, sitemap, robots, manifest and en-CA language.
- [x] ✅ verified — No tracking requests with IDs absent; helper mappings and consent/no-op behaviour tested.
- [x] ✅ verified — Six creative families, 24 primary-text variants, 10 headlines, six descriptions and Instant Form copy.
- [x] ✅ verified — Twelve PNG exports at 1080×1350 / 1080×1920, no external creative requests.
- [x] ✅ verified — npm ci, build, TypeScript, lint, HTTP/browser smoke checks and dependency audit.
- [ ] ❌ blocker — Replace or resolve all visible business placeholders before public launch.
- [ ] ❌ blocker — Configure real SMTP and confirm business inbox/customer confirmation delivery, or formally staff file reconciliation before accepting leads.
- [ ] ❌ blocker — Build/run Docker image in the deployment environment; verify persistent volume survives replacement and UID 1001 can write.
- [ ] ❌ blocker — Confirm HTTPS, domain ownership, canonical redirects and health check in Coolify.
- [ ] ❌ blocker — For Website Lead ads, configure approved analytics IDs and verify Lead/generate_lead exactly once in real accounts after consent.
- [ ] ❌ blocker — For Instant Form ads, test native capture, retrieval, storage, notifications and reconciliation end to end.
- [ ] ⬜ pending owner — Business email, privacy contact, retention schedule, service areas, hours, insurance wording and response time.
- [ ] ⬜ pending owner — Hero photo or approval to retain the CSS composition; future real reviews stay disabled.
- [ ] ⬜ pending owner — Privacy and service-promise review, sender identity, backup owner and follow-up assignment.
- [ ] ⬜ pending owner — Campaign budget, launch date, geography, final ad previews and publishing approval.
- [ ] ⬜ pending owner — Google Business Profile eligibility/details and Search Console verification.
- [ ] ⬜ pending owner — Real phone dial, iOS/Safari form checks and live email deletion/retention procedure.
- [ ] ⬜ pending owner — Authenticated internal content-clean pass if required by the fleet publishing workflow (local service returned 401).
