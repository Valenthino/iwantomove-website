# IWantToMove.ca

Start with [marketing/09-open-items.md](marketing/09-open-items.md). This is an implementation and launch package, not a deployed business site.

Node 22 is required. `npm ci`, then `npm run build`, `npx tsc --noEmit`, and `npm run lint`. For local development use `npm run dev`. For a production check: `TRUST_PROXY=true LEADS_FILE="$PWD/.data/leads.jsonl" npm start -- --hostname 127.0.0.1 --port 3100`. The proxy flag here is only for synthetic IPs in the loopback tests. `TEST_URL=http://127.0.0.1:3100 PLAYWRIGHT_BROWSERS_PATH=./.data/browsers npm test` runs HTTP and browser smoke tests against that server. The test writes synthetic leads; use an isolated file and do not run it against production.

`docker compose up --build` uses a non-root standalone image and a persistent leads volume. Set SMTP environment variables through the deployment platform. Never commit credentials. The health URL is /health.json. The build copies public and .next/static separately, as required by [Next.js standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

Public analytics IDs are build-time variables. Pass Docker build arguments if using them; unset IDs mean no third-party analytics requests. The browser asks for analytics consent before loading configured tags. Use direct GA4/Meta IDs OR a GTM container that manages those same destinations, not both. In GA4, disable automatic history page-view measurement to avoid duplicate events with our manual route tracking ([Google’s pageview documentation](https://developers.google.com/analytics/devguides/collection/ga4/views)). Do not configure GTM tags that capture form answers or personal information.

The lead API validates a strict schema and limits bodies to 16 KiB while streaming. It stores and fsyncs a JSONL record before email. Storage failure returns 503; email failure still returns 200 with operational metadata. Email errors do not log customer details. No database, SaaS or external image dependency is required.

Rate limiting is in memory: five attempts per ten minutes, reset on process restart and not shared across replicas. Default clients share a bucket because Next’s Request object has no trusted socket IP. Set TRUST_PROXY=true only behind a proxy that strips client-supplied X-Forwarded-For and writes the actual client IP; block direct backend access. For multiple replicas or significant traffic, use a shared limiter and a single durable intake writer. Keep the MVP at one instance. File writes are append-only; back up and monitor disk capacity. Email retries require the documented reconciliation/n8n workflow.

Find all unresolved tokens in tracked source with:
`git grep -n '\[\[PLACEHOLDER:'`

Render marketing PNGs with `npm run creatives`. Install Chromium if needed with `PLAYWRIGHT_BROWSERS_PATH=./.data/browsers npx playwright install chromium`, then use the same variable to run the script. The 12 rendered PNGs are committed with their HTML sources; synthetic lead files are ignored. Marketing HTML files have no external requests.

Additional checks: `node scripts/analytics-check.mjs` and `node scripts/secondary-failures.mjs`. The latter starts isolated local servers on ports 3101–3103 and an SMTP sink; it sends no external email. It requires a current standalone build.
