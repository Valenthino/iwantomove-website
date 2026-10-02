# Deployment verification (Coolify, 2026-10-02)

Live: **https://iwantomove.vavqo.com** — same origin as `http://iwantomove.vavqo.com` (Coolify domain must be
`http://`; the Cloudflare tunnel terminates TLS at the edge and forwards to Traefik on port 80).

## Coolify resource

- Project `IWantToMove` — `nib5r1fr66faq6fapnrbvamv`
- Application **IWantToMove Website** — `kt8n2gp3vx8aeuto60u4akrv` (server `localhost` / 10.94.10.29)
- Source: `Valenthino/iwantomove-website` (public), branch `main`, build pack `dockerfile`, `/Dockerfile`
- Ports: exposes `3000`. Health check: `GET /health.json`, host `127.0.0.1`, port `3000`
- Persistent volume `iwantomove-leads` mounted at **/data** (leads survive redeploys)
- Deployed commits: `a8d48a5` (initial), `24f4312` (lead limiter prefers `cf-connecting-ip`)

## Verified against the live URL (not the build log)

| Check | Result |
|---|---|
| `/` `/quote` `/services` `/services/residential` `/services/office` `/privacy` `/thank-you` | 200 |
| `/health.json` `/sitemap.xml` `/robots.txt` `/manifest.webmanifest` `/icon.svg` `/opengraph-image` | 200 |
| `POST /api/lead` with a valid payload | `{"ok":true,...}` — lead appended to `/data/leads.jsonl` |
| `POST /api/lead` invalid payload | 422 |
| `GET /api/lead` | 405 |
| Reviews section in production HTML | **absent** (0 matches) |
| Visible placeholders on the homepage | business email, hero photo, hours, insurance status, service area |
| JSON-LD | `MovingCompany`, `FAQPage` |

One clearly-labelled synthetic lead (`VERIFY TEST - ignore`) was submitted to production to prove the
end-to-end path. Delete it from `/data/leads.jsonl` when convenient.

`notification: "unconfigured"` is expected: no SMTP credentials have been supplied, so the lead is stored
but no email is sent. The form still succeeds; the lead is never lost.

## Email is the one unfinished link in the chain

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`, `LEAD_FROM_EMAIL`, `LEAD_TO_EMAIL`
in the application's environment. Until then retrieve leads with:

```
cat /data/leads.jsonl
```

(or `docker exec <container> cat /data/leads.jsonl` on Coolify-Main).

## Incident: this deploy took the estate down (read this)

The Coolify LXC is capped at **40 GiB** and was already sitting at ~40.85 GB. The Next.js Docker build
pushed it over the cap; the kernel OOM-killed containers **across the whole LXC** (all apps and services,
plus the tunnel connector), and one build died mid-step.

Recovery performed: every stopped application and service was restarted via the Coolify API, and the
crashed cloudflared connector was restarted (the `*.vavqo.com` tunnel was down, Cloudflare error 1033).

**Before deploying anything else to this host:**

1. Read the LXC memory first (`proxmox_api_raw` → `/nodes/pve2/lxc/100/status/current`, and the
   per-container figures via `scheduled_tasks` `run_once`). Free memory now, not the day average.
2. Bound the build in the Dockerfile — `ENV NODE_OPTIONS=--max-old-space-size=1024` — and keep
   `next build` concurrency low.
3. Do not run two Claude/Codex-style builds concurrently (`concurrent_builds` is 2 on this server).
4. The real fix is host capacity: the LXC's 40 GiB ceiling is the root cause, not the app.

## Two Coolify gotchas worth keeping

- **Health check host `localhost` fails** for images that bind IPv4 only (Next.js `0.0.0.0`); Coolify's
  probe resolves `localhost` to `::1` and reports "Connection refused" while the app is perfectly healthy.
  Set `health_check_host` to `127.0.0.1`.
- **Domain and redirect changes only take effect on restart/redeploy** — Coolify regenerates the Traefik
  labels then. Patching the API alone leaves the old routing live.
