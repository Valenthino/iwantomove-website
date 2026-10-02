import { ServicePage } from "@/components/service-page";
import { metadata } from "@/lib/seo";
export function generateMetadata() {
  return metadata(
    "Local Office Moving | IWantToMove.ca",
    "Planning an office move? Tell IWantToMove.ca about your workspace, building access and timing. Request a free moving quote.",
    "/services/office",
  );
}
export default function Page() {
  return <ServicePage office />;
}
