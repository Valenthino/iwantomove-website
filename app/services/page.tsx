import Link from "next/link";
import { CTA } from "@/components/site";
import { metadata, site } from "@/lib/seo";
export function generateMetadata() {
  return metadata(
    "Residential & Office Moving | IWantToMove.ca",
    "Explore local residential and office moving with IWantToMove.ca. Tell us about your move and request a free quote.",
    "/services",
  );
}
export default function Page() {
  return (
    <section className="wrap section">
      <span className="eyebrow">Moving services</span>
      <h1>
        A new address.
        <br />
        Let’s get you there.
      </h1>
      <p className="lede">
        Local moving for homes and offices. Start with the details, and we’ll
        take it from there.
      </p>
      <div className="cards">
        <Link className="card service" href="/services/residential">
          <h2>Residential Moving ↗</h2>
          <p>Tell us about your home and what needs to move.</p>
        </Link>
        <Link className="card service office" href="/services/office">
          <h2>Office Moving ↗</h2>
          <p>Let’s talk about your workspace, access and schedule.</p>
        </Link>
      </div>
      <CTA location="services" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: site },
              {
                "@type": "ListItem",
                position: 2,
                name: "Services",
                item: site + "/services",
              },
            ],
          }),
        }}
      />
    </section>
  );
}
