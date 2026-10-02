import { site } from "@/lib/seo";
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/thank-you"] },
    sitemap: site + "/sitemap.xml",
  };
}
