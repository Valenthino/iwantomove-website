import Link from "next/link";
import { CTA } from "./site";
import { site } from "@/lib/seo";
export function ServicePage({ office = false }: { office?: boolean }) {
  const name = office ? "Office Moving" : "Residential Moving";
  const path = office ? "/services/office" : "/services/residential";
  return (
    <article className="wrap section service-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/services">Services</Link>
        <span>/</span>
        <span>{name}</span>
      </nav>
      <span className="eyebrow">Local moving</span>
      <h1>{name}</h1>
      <p className="lede">
        {office
          ? "New workspace on the horizon? Let’s make a plan for getting there."
          : "A new home comes with plenty to think about. Let’s work through the moving part together."}
      </p>
      <CTA location={path} />
      <div className="service-details">
        <section>
          <h2>
            {office ? "Start with your workspace." : "Tell us about your home."}
          </h2>
          <p>
            {office
              ? "Let us know the size of your office, the furniture you’re moving and your preferred date. Mention building access, elevator bookings and any timing constraints."
              : "Share where you’re moving from and to, your home’s approximate size and your preferred date. Stairs, elevators and larger furniture are useful details to mention."}
          </p>
          <h2>What happens next?</h2>
          <p>
            We’ll review your request, call to confirm the details and give you
            a quote. We’ll agree on the moving plan before you book.
          </p>
        </section>
        <aside className="card">
          <h2>Good to know</h2>
          <p>Service area: [[PLACEHOLDER: service area]]</p>
          <p>
            Not sure about your date or the size of your move? You can say so in
            the form.
          </p>
          <Link href={office ? "/services/residential" : "/services/office"}>
            {office ? "Moving home instead?" : "Moving an office instead?"} ↗
          </Link>
        </aside>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Service",
              name,
              serviceType: name,
              provider: {
                "@type": "MovingCompany",
                name: "IWantToMove.ca",
                telephone: "+17785137503",
                url: site,
              },
              areaServed: "[[PLACEHOLDER: service area]]",
              url: site + path,
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { name: "Home", item: site },
                { name: "Services", item: site + "/services" },
                { name, item: site + path },
              ].map((v, i) => ({ "@type": "ListItem", position: i + 1, ...v })),
            },
          ]),
        }}
      />
    </article>
  );
}
