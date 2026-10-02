import assert from "node:assert/strict";
import net from "node:net";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const root = process.cwd();
await mkdir(".data", { recursive: true });
const payload = {
  movingFrom: "Origin <b>",
  movingTo: "Destination &",
  movingDate: "",
  propertyType: "Office",
  size: "Small office",
  service: "Office Moving",
  name: "Test <script>",
  phone: "2025550100",
  email: "test@example.invalid",
  notes: "<img src=x onerror=alert(1)>",
  source: "/quote",
};
const messages = [];
const smtp = net.createServer((socket) => {
  socket.setEncoding("utf8");
  socket.write("220 local test SMTP\r\n");
  let pending = "";
  let data = false;
  let message = "";
  socket.on("data", (chunk) => {
    pending += chunk;
    let end;
    while ((end = pending.indexOf("\r\n")) >= 0) {
      const line = pending.slice(0, end);
      pending = pending.slice(end + 2);
      if (data) {
        if (line === ".") {
          messages.push(message);
          message = "";
          data = false;
          socket.write("250 accepted\r\n");
        } else message += line + "\r\n";
      } else if (line.startsWith("EHLO"))
        socket.write("250-local\r\n250 AUTH PLAIN\r\n");
      else if (line.startsWith("AUTH")) socket.write("235 authenticated\r\n");
      else if (line === "DATA") {
        data = true;
        socket.write("354 continue\r\n");
      } else if (line === "QUIT") socket.end("221 bye\r\n");
      else socket.write("250 ok\r\n");
    }
  });
});
smtp.listen(0, "127.0.0.1");
await once(smtp, "listening");
const smtpPort = smtp.address().port;
async function run(port, env, check) {
  const child = spawn(process.execPath, [".next/standalone/server.js"], {
    cwd: root,
    env: {
      ...process.env,
      HOSTNAME: "127.0.0.1",
      PORT: String(port),
      LEADS_FILE: `${root}/.data/secondary-${port}.jsonl`,
      SMTP_HOST: "127.0.0.1",
      SMTP_PORT: String(smtpPort),
      SMTP_USER: "synthetic",
      SMTP_PASS: "synthetic",
      SMTP_SECURE: "false",
      LEAD_FROM_EMAIL: "from@example.invalid",
      LEAD_TO_EMAIL: "business@example.invalid",
      ...env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      try {
        if ((await fetch(`http://127.0.0.1:${port}/health.json`)).ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
    assert(ready, "test server started");
    const response = await fetch(`http://127.0.0.1:${port}/api/lead`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    await check(response);
  } finally {
    child.kill("SIGTERM");
    await once(child, "exit");
  }
}
try {
  await run(3101, {}, async (r) => {
    assert.equal(r.status, 200);
    assert.deepEqual((await r.json()).meta, {
      notification: "sent",
      confirmation: "sent",
    });
    assert.equal(messages.length, 2);
    const notification = messages[0]
      .replace(/=\r\n/g, "")
      .replace(/=([A-F\d]{2})/g, (_, h) =>
        String.fromCharCode(parseInt(h, 16)),
      );
    assert(notification.includes("text/plain"));
    assert(notification.includes("text/html"));
    assert(notification.includes("&lt;script&gt;"));
    assert(notification.includes("&lt;img"));
    assert(notification.includes("localTime"));
    assert(notification.includes("/quote"));
    console.log(
      "Local SMTP sink: business and confirmation emails; multipart text/HTML; escaped input; timestamp and source",
    );
  });
  await new Promise((r) => smtp.close(r));
  await run(3102, {}, async (r) => {
    assert.equal(r.status, 200);
    const body = await r.json();
    assert.equal(body.ok, true);
    assert.equal(body.meta.notification, "failed");
    assert.equal(body.meta.confirmation, "failed");
    const records = (await readFile(".data/secondary-3102.jsonl", "utf8"))
      .trim()
      .split("\n");
    assert.equal(JSON.parse(records.at(-1)).name, payload.name);
    console.log(
      "SMTP connection refused: 200, both email failures reported, lead persisted",
    );
  });
  await writeFile(".data/not-a-directory", "test");
  await run(
    3103,
    { LEADS_FILE: `${root}/.data/not-a-directory/leads.jsonl` },
    async (r) => {
      assert.equal(r.status, 503);
      assert.equal((await r.json()).error, "storage_unavailable");
      console.log("Storage failure: 503, no false success");
    },
  );
} finally {
  if (smtp.listening) smtp.close();
}
