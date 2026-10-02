"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { track, type EventName } from "@/lib/analytics";
export function TrackedLink({
  href,
  children,
  location,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  location: string;
  className?: string;
}) {
  const event: EventName = href.startsWith("tel:")
    ? "phone_click"
    : href.startsWith("mailto:")
      ? "email_click"
      : "cta_click";
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track(event, { location })}
    >
      {children}
    </Link>
  );
}
export function Header() {
  const minimal = usePathname() === "/quote";
  return (
    <header className="header wrap">
      <Link href="/" aria-label="IWantToMove.ca home" className="logo">
        <svg viewBox="0 0 34 34" aria-hidden="true">
          <path d="M4 26V8h8v18m5 0V8h6l7 9-7 9z" fill="currentColor" />
        </svg>
        <span>
          IWantToMove<span className="suffix">.ca</span>
        </span>
      </Link>
      <nav aria-label="Main navigation">
        {!minimal && (
          <Link className="desktop" href="/services">
            Our services
          </Link>
        )}
        <TrackedLink href="tel:+17785137503" location="header" className="call">
          778-513-7503 <span aria-hidden="true">↗</span>
        </TrackedLink>
        {!minimal && (
          <TrackedLink
            href="/quote"
            location="header"
            className="button small desktop"
          >
            Get a Free Moving Quote
          </TrackedLink>
        )}
      </nav>
    </header>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <p className="footer-brand">IWantToMove.ca</p>
          <p>Let’s get you moving.</p>
          <TrackedLink href="tel:+17785137503" location="footer">
            778-513-7503
          </TrackedLink>
        </div>
        <div>
          <p>[[PLACEHOLDER: business email]]</p>
          <p>[[PLACEHOLDER: service area]]</p>
          <p>[[PLACEHOLDER: hours]]</p>
        </div>
        <div>
          <Link href="/services">Moving services</Link>
          <Link href="/privacy">Privacy policy</Link>
          <TrackedLink href="/quote" location="footer">
            Get a Free Moving Quote ↗
          </TrackedLink>
        </div>
      </div>
      <div className="wrap legal">
        © {new Date().getFullYear()} IWantToMove.ca. All rights reserved.
      </div>
    </footer>
  );
}
export function CTA({
  location,
  children = "Get a Free Moving Quote",
}: {
  location: string;
  children?: React.ReactNode;
}) {
  return (
    <TrackedLink className="button" href="/quote" location={location}>
      {children}
      <span aria-hidden="true">↗</span>
    </TrackedLink>
  );
}
export function Confirmation() {
  return (
    <section className="confirmation">
      <span className="eyebrow">Request received</span>
      <h1>Your next move starts here.</h1>
      <p>
        We’ll review your request and contact you by phone within [[PLACEHOLDER:
        response time]] to confirm the details and give you a quote.
      </p>
      <p>
        Your move isn’t booked yet. We’ll work through the details with you.
      </p>
      <TrackedLink
        className="button"
        href="tel:+17785137503"
        location="confirmation"
      >
        Call now: 778-513-7503
      </TrackedLink>
    </section>
  );
}
