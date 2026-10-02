import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { chromium } from "playwright";
const base = process.env.TEST_URL || "http://127.0.0.1:3000";
const file = process.env.LEADS_FILE || ".data/leads.jsonl";
const lead = {
  movingFrom: "Test origin",
  movingTo: "Test destination",
  movingDate: "",
  propertyType: "Apartment",
  size: "1 bedroom",
  service: "Residential Moving",
  name: "Synthetic Test",
  phone: "2025550100",
  email: "",
  notes: '<script>alert("test")</script>',
  source: "/quote",
};
let ipCounter = 10;
const subnet = Math.floor(Math.random() * 200) + 1;
const post = (
  data,
  ip = `192.0.${subnet}.${ipCounter++}`,
  content = "application/json",
) =>
  fetch(base + "/api/lead", {
    method: "POST",
    headers: { "content-type": content, "x-forwarded-for": ip },
    body: typeof data === "string" ? data : JSON.stringify(data),
  });
const lines = async () => {
  try {
    return (await readFile(file, "utf8")).trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
};
for (const path of [
  "/",
  "/quote",
  "/services",
  "/services/residential",
  "/services/office",
  "/privacy",
  "/thank-you",
  "/health.json",
  "/opengraph-image",
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.webmanifest",
  "/icon.svg",
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  if (path === "/health.json")
    assert.deepEqual(await response.json(), { status: "ok" });
  console.log(`GET ${path}: 200`);
}
assert.equal((await fetch(base + "/missing-page")).status, 404);
assert.equal((await fetch(base + "/api/lead")).status, 405);
const home = await (await fetch(base)).text();
assert(!home.includes("From our customers"));
assert(!home.includes("reviews-heading"));
assert(!home.includes("real reviews"));
const before = (await lines()).length;
const valid = await post(lead);
assert.equal(valid.status, 200);
const result = await valid.json();
assert.equal(result.ok, true);
assert.equal(result.meta.notification, "unconfigured");
assert.equal((await lines()).length, before + 1);
assert.equal(JSON.parse((await lines()).at(-1)).name, lead.name);
assert.equal((await post({ ...lead, phone: "12" })).status, 422);
assert.equal((await post({ ...lead, unexpected: "no" })).status, 422);
assert.equal((await post({ ...lead, movingDate: "2026-02-30" })).status, 422);
assert.equal((await post({ ...lead, notes: "x".repeat(17000) })).status, 413);
assert.equal((await post("{")).status, 400);
assert.equal((await post("{}", undefined, "text/plain")).status, 415);
assert.equal((await lines()).length, before + 1);
for (let i = 0; i < 5; i++)
  assert.equal((await post({}, `192.0.${subnet}.250`)).status, 422);
assert.equal((await post({}, `192.0.${subnet}.250`)).status, 429);
console.log(
  "API: durable accepted lead; invalid, unknown, malformed, oversized, wrong media type and rate limit rejected; GET 405",
);
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  const externals = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (/^https?:/.test(r.url()) && !r.url().startsWith(base))
      externals.push(r.url());
  });
  for (const path of [
    "/",
    "/services",
    "/services/residential",
    "/services/office",
    "/privacy",
    "/quote",
    "/thank-you",
  ]) {
    await page.goto(base + path);
    assert.equal(await page.locator("h1").count(), 1, path);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Overflow ${path}`,
    );
    assert((await page.title()).length <= 60);
    assert(
      (await page.locator('meta[name="description"]').getAttribute("content"))
        .length <= 155,
    );
    assert.equal(
      await page.locator('link[rel="canonical"]').getAttribute("href"),
      `https://iwantomove.ca${path === "/" ? "" : path}`,
    );
  }
  await page.goto(base);
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/quote");
  await page.getByRole("button", { name: "Continue" }).click();
  assert(await page.locator("#movingFrom-error").isVisible());
  await page.locator("#movingFrom").fill("Synthetic origin");
  await page.locator("#movingTo").fill("Synthetic destination");
  await page.getByLabel("Not sure yet", { exact: true }).check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("#name").fill("Browser Test");
  await page.locator("#phone").fill("2025550101");
  await page.screenshot({
    path: "test-results/quote-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Get My Free Quote" }).click();
  await page
    .getByRole("heading", { name: "Your next move starts here." })
    .waitFor();
  assert.equal((await lines()).length, before + 2);
  assert.equal(await page.getByText("unconfigured").count(), 0);
  assert.equal(externals.length, 0, JSON.stringify(externals));
  assert.equal(errors.length, 0, JSON.stringify(errors));
  console.log(
    "Browser: mobile/desktop screenshots, no overflow, metadata, one H1, inline validation, full submission, zero external requests and JS errors",
  );
} finally {
  await browser.close();
}
