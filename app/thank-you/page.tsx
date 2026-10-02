import { Confirmation } from "@/components/site";
import { metadata } from "@/lib/seo";
export function generateMetadata() {
  return {
    ...metadata(
      "Your Quote Request | IWantToMove.ca",
      "What happens after your moving quote request: we review the details and call you to discuss your move.",
      "/thank-you",
    ),
    robots: { index: false, follow: true },
  };
}
export default function Page() {
  return (
    <div className="wrap narrow section">
      <Confirmation />
    </div>
  );
}
