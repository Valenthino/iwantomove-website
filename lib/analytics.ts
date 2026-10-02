export type EventName =
  | "page_view"
  | "quote_page_view"
  | "form_start"
  | "form_step"
  | "lead"
  | "phone_click"
  | "email_click"
  | "cta_click";
type Params = { location?: string; step?: number; page_path?: string };
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      queue?: unknown[][];
      loaded?: boolean;
      version?: string;
      callMethod?: (...args: unknown[]) => void;
    };
  }
}
export const ga = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA4_ID || "")
  ? process.env.NEXT_PUBLIC_GA4_ID
  : "";
export const meta = /^\d+$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID || "")
  ? process.env.NEXT_PUBLIC_META_PIXEL_ID
  : "";
export const gtm = /^GTM-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GTM_ID || "")
  ? process.env.NEXT_PUBLIC_GTM_ID
  : "";
export function track(event: EventName, params: Params = {}) {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem("analytics-consent") !== "yes") return;
  } catch {
    return;
  }
  try {
    if (ga)
      window.gtag?.(
        "event",
        event === "lead" ? "generate_lead" : event,
        params,
      );
    if (meta) {
      const standard = {
        page_view: "PageView",
        quote_page_view: "ViewContent",
        lead: "Lead",
      }[event as "page_view" | "quote_page_view" | "lead"];
      window.fbq?.(
        standard ? "track" : "trackCustom",
        standard || event,
        params,
      );
    }
    if (gtm) {
      window.dataLayer ||= [];
      window.dataLayer.push({ event, ...params });
    }
  } catch {
    /* A tracking failure must never prevent a quote request or navigation. */
  }
}
