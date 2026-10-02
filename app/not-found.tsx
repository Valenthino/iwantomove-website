import { metadata } from "@/lib/seo";
export function generateMetadata() {
  return {
    ...metadata(
      "Page Not Found | IWantToMove.ca",
      "This page isn’t here. Start a free moving quote with IWantToMove.ca.",
      "/404",
    ),
    robots: { index: false, follow: true },
  };
}
import { CTA } from "@/components/site";
export default function NotFound() {
  return (
    <section className="wrap narrow section">
      <span className="eyebrow">404 / Wrong address</span>
      <h1>This page has moved out.</h1>
      <p>Looking for help with your move? Start here.</p>
      <CTA location="404" />
    </section>
  );
}
