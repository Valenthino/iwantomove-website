import { ServicePage } from "@/components/service-page";
import { metadata } from "@/lib/seo";
export function generateMetadata() {
  return metadata(
    "Local Residential Moving | IWantToMove.ca",
    "Moving home? Share your move details with IWantToMove.ca. Get a free residential moving quote and talk through your next move.",
    "/services/residential",
  );
}
export default function Page() {
  return <ServicePage />;
}
