import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const source = ts.transpileModule(readFileSync("lib/analytics.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
function setup(env, consent = "yes", blocked = false) {
  const calls = [];
  const context = {
    exports: {},
    process: { env },
    localStorage: {
      getItem: () => {
        if (blocked) throw Error("blocked");
        return consent;
      },
    },
    window: {
      gtag: (...args) => calls.push(["ga", ...args]),
      fbq: (...args) => calls.push(["meta", ...args]),
    },
  };
  vm.runInNewContext(source, context);
  return { track: context.exports.track, calls, context };
}
const events = [
  "page_view",
  "quote_page_view",
  "form_start",
  "form_step",
  "lead",
  "phone_click",
  "email_click",
  "cta_click",
];
for (const env of [
  {},
  {
    NEXT_PUBLIC_GA4_ID: "bad",
    NEXT_PUBLIC_META_PIXEL_ID: "<script>",
    NEXT_PUBLIC_GTM_ID: "bad",
  },
]) {
  const t = setup(env);
  for (const e of events) t.track(e);
  assert.equal(t.calls.length, 0);
  assert.equal(t.context.window.dataLayer, undefined);
}
const env = {
  NEXT_PUBLIC_GA4_ID: "G-TEST123",
  NEXT_PUBLIC_META_PIXEL_ID: "123456789",
  NEXT_PUBLIC_GTM_ID: "GTM-TEST123",
};
for (const consent of ["no", null]) {
  const t = setup(env, consent);
  t.track("lead");
  assert.equal(t.calls.length, 0);
}
const t = setup(env);
for (const e of events) t.track(e, { location: "test", step: 2 });
assert.equal(t.calls.length, 16);
assert.equal(t.context.window.dataLayer.length, 8);
assert(t.calls.some((c) => c[0] === "ga" && c[2] === "generate_lead"));
for (const event of ["PageView", "ViewContent", "Lead"])
  assert(
    t.calls.some((c) => c[0] === "meta" && c[1] === "track" && c[2] === event),
  );
assert(
  t.calls.some(
    (c) =>
      c[0] === "meta" &&
      c[1] === "trackCustom" &&
      c[2] === "form_step" &&
      c[3].step === 2,
  ),
);
assert.doesNotThrow(() => setup(env, "yes", true).track("lead"));
t.context.window.gtag = () => {
  throw Error("tag failed");
};
assert.doesNotThrow(() => t.track("lead"));
console.log(
  "Analytics: all eight events, GA4/Meta mappings, step/location parameters, GTM queue, absent/invalid IDs, consent denial, blocked storage and tag failure",
);
