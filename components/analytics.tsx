"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ga, meta, gtm, track } from "@/lib/analytics";
export function Analytics() {
  const path = usePathname();
  const [consent, setConsent] = useState<string | null>("loading");
  useEffect(() => {
    try {
      setConsent(localStorage.getItem("analytics-consent"));
    } catch {
      setConsent("no");
    }
  }, []);
  useEffect(() => {
    if (consent !== "yes") return;
    const add = (id: string, src: string) => {
      if (document.getElementById(id)) return;
      const script = document.createElement("script");
      script.id = id;
      script.async = true;
      script.src = src;
      document.head.appendChild(script);
    };
    if (ga && !window.gtag) {
      window.dataLayer ||= [];
      window.gtag = function () {
        /* Google’s command queue expects an arguments object. */
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", ga, { send_page_view: false });
      add("ga4", `https://www.googletagmanager.com/gtag/js?id=${ga}`);
    }
    if (meta && !window.fbq) {
      const fbq: NonNullable<Window["fbq"]> = (...args: unknown[]) => {
        if (fbq.callMethod) fbq.callMethod(...args);
        else fbq.queue!.push(args);
      };
      fbq.queue = [];
      fbq.loaded = true;
      fbq.version = "2.0";
      window.fbq = fbq;
      fbq("init", meta);
      add("meta-pixel", "https://connect.facebook.net/en_US/fbevents.js");
    }
    if (gtm) {
      window.dataLayer ||= [];
      if (!document.getElementById("gtm"))
        window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      add("gtm", `https://www.googletagmanager.com/gtm.js?id=${gtm}`);
    }
    track("page_view", { page_path: path });
    if (path === "/quote") track("quote_page_view", { page_path: path });
  }, [path, consent]);
  if (!(ga || meta || gtm) || consent !== null) return null;
  return (
    <aside className="consent" aria-label="Analytics preferences">
      <p>
        Allow analytics cookies to help us understand visits and moving quote
        requests?
      </p>
      <button
        onClick={() => {
          localStorage.setItem("analytics-consent", "yes");
          setConsent("yes");
        }}
      >
        Allow analytics
      </button>
      <button
        onClick={() => {
          localStorage.setItem("analytics-consent", "no");
          setConsent("no");
        }}
      >
        No thanks
      </button>
    </aside>
  );
}
export function ResetAnalytics() {
  return (
    <button
      className="button secondary"
      onClick={() => {
        localStorage.setItem("analytics-consent", "no");
        window.location.reload();
      }}
    >
      Turn off analytics on this browser
    </button>
  );
}
