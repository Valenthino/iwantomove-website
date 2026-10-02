import { QuoteForm } from "@/components/quote-form";
import { metadata } from "@/lib/seo";
export function generateMetadata() {
  return metadata(
    "Get a Free Moving Quote | IWantToMove.ca",
    "Tell us where you’re moving. Request a free residential or office moving quote from IWantToMove.ca.",
    "/quote",
  );
}
export default function Page() {
  return (
    <div className="quote-layout wrap">
      <QuoteForm />
    </div>
  );
}
