import { site } from "@/lib/seo";
export default function sitemap() {
  return [
    "",
    "/quote",
    "/services",
    "/services/residential",
    "/services/office",
    "/privacy",
  ].map((path) => ({ url: site + path }));
}
