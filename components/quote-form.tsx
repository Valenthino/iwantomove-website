"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { leadSchema, type Lead } from "@/lib/lead";
import { track } from "@/lib/analytics";
import { Confirmation } from "./site";
const initial: Lead = {
  movingFrom: "",
  movingTo: "",
  movingDate: "",
  propertyType: "Apartment",
  size: "Not sure yet",
  service: "Not sure yet",
  name: "",
  phone: "",
  email: "",
  notes: "",
  source: "/quote",
};
const stepFields: (keyof Lead)[][] = [
  ["movingFrom", "movingTo", "movingDate"],
  ["propertyType", "size", "service"],
  ["name", "phone", "email", "notes"],
];
export function QuoteForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [unsure, setUnsure] = useState(false);
  const started = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const interact = () => {
    if (!started.current) {
      track("form_start");
      track("form_step", { step: 1 });
      started.current = true;
    }
  };
  const change = (key: keyof Lead, value: string) => {
    interact();
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };
  const move = (n: number) => {
    setStep(n);
    setErrors({});
    track("form_step", { step: n + 1 });
    requestAnimationFrame(() => heading.current?.focus());
  };
  const field = (
    key: keyof Lead,
    label: string,
    type = "text",
    options?: string[],
  ) => (
    <div className="field" key={key}>
      <label htmlFor={key}>{label}</label>
      {options ? (
        <select
          id={key}
          value={data[key]}
          onChange={(e) => change(key, e.target.value)}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : key === "notes" ? (
        <textarea
          id={key}
          value={data[key]}
          maxLength={2000}
          onChange={(e) => change(key, e.target.value)}
        />
      ) : (
        <input
          id={key}
          type={type}
          value={data[key]}
          disabled={key === "movingDate" && unsure}
          onChange={(e) => change(key, e.target.value)}
          autoComplete={
            key === "name"
              ? "name"
              : key === "phone"
                ? "tel"
                : key === "email"
                  ? "email"
                  : "off"
          }
          maxLength={key === "email" ? 254 : key === "phone" ? 30 : 160}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
        />
      )}{" "}
      {errors[key] && (
        <p className="error" id={`${key}-error`}>
          {errors[key]}
        </p>
      )}
    </div>
  );
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    interact();
    const parsed = leadSchema.safeParse(data);
    const next: Record<string, string> = {};
    if (!parsed.success)
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (stepFields[step].includes(key as keyof Lead) || step === 2)
          next[key] = issue.message;
      }
    if (Object.keys(next).length) {
      setErrors(next);
      requestAnimationFrame(() =>
        document.getElementById(Object.keys(next)[0])?.focus(),
      );
      return;
    }
    if (step < 2) {
      move(step + 1);
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        const fields = Object.fromEntries(
          Object.entries(result.fields || {}).map(([k, v]) => [
            k,
            (v as string[])[0],
          ]),
        );
        setErrors({
          ...fields,
          submit:
            response.status === 429
              ? "Too many attempts. Please wait 10 minutes or call 778-513-7503."
              : "We couldn’t save your request. Your details are still here. Please try again or call 778-513-7503.",
        });
        return;
      }
      track("lead");
      setDone(true);
    } catch {
      setErrors({
        submit:
          "We couldn’t connect. Your details are still here. Please try again or call 778-513-7503.",
      });
    } finally {
      setBusy(false);
    }
  }
  if (done)
    return (
      <div role="status">
        <Confirmation />
      </div>
    );
  return (
    <>
      <div className="quote-intro">
        <span className="eyebrow">Get a Free Moving Quote</span>
        <h1>
          Tell Us Where You&apos;re Moving. We&apos;ll Take It From There.
        </h1>
        <p>A few details now. A conversation about your move next.</p>
      </div>
      <form
        className="quote-form"
        onSubmit={submit}
        onFocusCapture={interact}
        noValidate
      >
        <ol className="progress" aria-label="Quote progress">
          {["Where", "What", "Who"].map((label, i) => (
            <li
              key={label}
              aria-current={step === i ? "step" : undefined}
              className={i <= step ? "active" : ""}
            >
              <span>{i + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        <h2 tabIndex={-1} ref={heading}>
          {
            [
              "Where are you headed?",
              "What are we moving?",
              "How can we reach you?",
            ][step]
          }
        </h2>
        <p className="micro">Step {step + 1} of 3</p>
        {step === 0 && (
          <>
            {field(
              "movingFrom",
              "Moving from (city or first 3 postal code characters is fine)",
            )}
            {field("movingTo", "Moving to")}
            {field("movingDate", "Moving date", "date")}
            <label className="checkbox">
              <input
                type="checkbox"
                checked={unsure}
                onChange={(e) => {
                  setUnsure(e.target.checked);
                  change("movingDate", "");
                }}
              />
              Not sure yet
            </label>
          </>
        )}
        {step === 1 && (
          <>
            {field("propertyType", "Property type", "", [
              "Apartment",
              "Condo",
              "House",
              "Office",
              "Storage",
              "Other",
            ])}
            {field("size", "Approximate size or bedrooms", "", [
              "Not sure yet",
              "Studio",
              "1 bedroom",
              "2 bedrooms",
              "3 bedrooms",
              "4+ bedrooms",
              "Small office",
              "Large office",
            ])}
            {field("service", "Service needed", "", [
              "Not sure yet",
              "Residential Moving",
              "Office Moving",
            ])}
          </>
        )}
        {step === 2 && (
          <>
            {field("name", "Name")}
            {field("phone", "Phone", "tel")}
            {field("email", "Email (optional)", "email")}
            {field("notes", "Additional notes (optional)")}
            <p className="micro">
              By sending this request, you’re asking us to contact you about
              your move. <Link href="/privacy">How we use your details</Link>.
            </p>
          </>
        )}
        {errors.submit && (
          <p className="error" role="alert">
            {errors.submit}
          </p>
        )}
        <div className="form-actions">
          {step > 0 && (
            <button
              type="button"
              className="button secondary"
              disabled={busy}
              onClick={() => move(step - 1)}
            >
              Back
            </button>
          )}
          <button
            className="button"
            disabled={busy}
            type="submit"
            onClick={() => {
              if (step === 2) track("cta_click", { location: "quote-submit" });
            }}
          >
            {busy
              ? "Sending your request…"
              : step === 2
                ? "Get My Free Quote"
                : "Continue"}{" "}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </form>
    </>
  );
}
