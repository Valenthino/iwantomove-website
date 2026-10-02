import { open, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import { leadSchema } from "@/lib/lead";
export const runtime = "nodejs";
// ponytail: process-local limiter; use shared storage before adding replicas.
const attempts = new Map<string, { count: number; until: number }>();
const escape = (v: string) =>
  v.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export async function POST(request: Request) {
  const ip =
    process.env.TRUST_PROXY === "true"
      ? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        "unknown"
      : "shared";
  const now = Date.now();
  for (const [key, value] of attempts)
    if (value.until <= now) attempts.delete(key);
  const limit = attempts.get(ip) || { count: 0, until: now + 600000 };
  if (limit.count >= 5 || attempts.size >= 10000)
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  limit.count++;
  attempts.set(ip, limit);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json(
      { ok: false, error: "unsupported_media_type" },
      { status: 415 },
    );
  let body;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("empty");
    let bytes = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 16384) {
        await reader.cancel();
        return Response.json(
          { ok: false, error: "payload_too_large" },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success)
    return Response.json(
      {
        ok: false,
        error: "validation_failed",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  const record = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    status: "New Lead",
    ...parsed.data,
  };
  try {
    const file = process.env.LEADS_FILE || "/data/leads.jsonl";
    await mkdir(dirname(file), { recursive: true, mode: 0o700 });
    const handle = await open(file, "a", 0o600);
    try {
      await handle.writeFile(JSON.stringify(record) + "\n");
      await handle.sync();
    } finally {
      await handle.close();
    }
  } catch {
    console.error("Lead persistence failed; request not accepted.");
    return Response.json(
      { ok: false, error: "storage_unavailable" },
      { status: 503 },
    );
  }
  let notification = "unconfigured";
  let confirmation = "not_requested";
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    LEAD_FROM_EMAIL,
    LEAD_TO_EMAIL,
  } = process.env;
  try {
    if (
      SMTP_HOST &&
      SMTP_PORT &&
      SMTP_USER &&
      SMTP_PASS &&
      LEAD_FROM_EMAIL &&
      LEAD_TO_EMAIL
    ) {
      const transport = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: SMTP_USER, pass: SMTP_PASS },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 8000,
      });
      const rows = Object.entries({
        ...record,
        localTime: new Date(record.timestamp).toLocaleString("en-CA", {
          timeZone: "America/Vancouver",
        }),
      });
      try {
        await transport.sendMail({
          from: LEAD_FROM_EMAIL,
          to: LEAD_TO_EMAIL,
          subject: "New moving quote request",
          text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
          html: `<h1>Moving quote request</h1><table>${rows.map(([k, v]) => `<tr><th align="left">${escape(k)}</th><td style="white-space:pre-wrap">${escape(v)}</td></tr>`).join("")}</table>`,
        });
        notification = "sent";
      } catch {
        notification = "failed";
        console.error(
          "Lead stored; business email failed. Review stored leads.",
        );
      }
      if (record.email) {
        try {
          await transport.sendMail({
            from: LEAD_FROM_EMAIL,
            to: record.email,
            subject: "We received your moving quote request",
            text: "Thanks for contacting IWantToMove.ca. We'll review your move and call within [[PLACEHOLDER: response time]] to confirm the details and give you a quote. Call 778-513-7503 if you need to reach us. Your move is not booked yet.",
            html: '<h1>Your request is in.</h1><p>We’ll review your move and call within [[PLACEHOLDER: response time]] to confirm the details and give you a quote.</p><p><a href="tel:+17785137503">778-513-7503</a></p><p>Your move is not booked yet.</p>',
          });
          confirmation = "sent";
        } catch {
          confirmation = "failed";
          console.error("Lead stored; confirmation email failed.");
        }
      }
    } else {
      console.warn(
        "Lead stored; SMTP is unconfigured. Review LEADS_FILE for new leads.",
      );
    }
  } catch {
    notification = "failed";
    console.error("Lead stored; email setup failed. Review stored leads.");
  }
  return Response.json({ ok: true, meta: { notification, confirmation } });
}
