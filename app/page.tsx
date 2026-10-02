import Link from "next/link";
import { CTA, TrackedLink } from "@/components/site";
import { Reviews } from "@/components/reviews";
import { metadata, site } from "@/lib/seo";
export function generateMetadata() {
  return metadata(
    "Local Moving, a Little Easier | IWantToMove.ca",
    "Planning a home or office move? Tell IWantToMove.ca about your move and get a free quote. Call 778-513-7503.",
    "/",
  );
}
const faq = [
  {
    question: "How do I get a quote?",
    answer:
      "Fill in our short quote form or call 778-513-7503. We’ll confirm the details with you before giving you a quote.",
  },
  { question: "Are you insured?", answer: "[[PLACEHOLDER: insurance status]]" },
];
export default function Home() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <span className="eyebrow">
            <i /> A fresh start. A little less stress.
          </span>
          <h1>
            Moving Doesn&apos;t Have to Be a <em>Headache.</em>
          </h1>
          <p>
            New home? New office? Tell us where you’re headed. We’ll help you
            work out the moving details, so you can get on with what’s next.
          </p>
          <div className="actions">
            <CTA location="hero">Get My Free Quote</CTA>
            <TrackedLink
              href="tel:+17785137503"
              location="hero"
              className="text-link"
            >
              Call Us ↗
            </TrackedLink>
          </div>
          <p className="micro">Local residential &amp; office moving</p>
        </div>
        <div
          className="room"
          role="img"
          aria-label="Warm sunlit room with sculptural moving boxes and a green sofa"
        >
          <div className="window-light" />
          <div className="room-label">
            A little room
            <br />
            for what’s next.
          </div>
          <div className="box box-back">
            <span>THIS WAY UP ↑</span>
          </div>
          <div className="sofa">
            <div />
            <div />
          </div>
          <div className="box box-front">
            <span>new beginnings.</span>
            <b>↗</b>
          </div>
          <div className="floor-line" />
          {/* Replace this CSS composition with an owner-approved photograph. */}
          <span className="photo-placeholder">[[PLACEHOLDER: hero photo]]</span>
          <span className="room-caption">HOME IS WHERE YOU GO NEXT.</span>
        </div>
      </section>
      <section className="trust">
        <div className="wrap">
          <span className="eyebrow">What we aim to bring to every move</span>
          <ul>
            {[
              "Reliable movers",
              "Careful handling",
              "On-time service",
              "Straightforward quotes",
              "Friendly service",
              "Local moving experience",
            ].map((p) => (
              <li key={p}>
                <span aria-hidden="true">✓</span>
                {p}
              </li>
            ))}
          </ul>
          <p className="micro">
            Our service promises, from the first call to moving day.
          </p>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">A change of address</span>
            <h2>
              Your place.
              <br />
              Your next chapter.
            </h2>
          </div>
          <p>
            Moving a home or a workplace starts with a conversation. Let’s talk
            about yours.
          </p>
        </div>
        <div className="cards">
          <Link className="card service" href="/services/residential">
            <span className="card-number">01 / HOME</span>
            <div className="house-art" aria-hidden="true">
              ⌂
            </div>
            <h3>
              Residential Moving <span>↗</span>
            </h3>
            <p>
              From your current front door to your next one. Tell us about your
              home and what’s coming with you.
            </p>
          </Link>
          <Link className="card service office" href="/services/office">
            <span className="card-number">02 / WORK</span>
            <div className="office-art" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <h3>
              Office Moving <span>↗</span>
            </h3>
            <p>
              A new space for your work. Let’s go over the furniture, access and
              timing together.
            </p>
          </Link>
        </div>
      </section>
      <section className="steps-section">
        <div className="wrap section">
          <span className="eyebrow">Less wondering. More moving.</span>
          <h2>One move. Three simple steps.</h2>
          <div className="steps">
            {[
              [
                "Tell us about your move",
                "Where you’re going, what you’re moving and how to reach you.",
              ],
              [
                "Get your quote",
                "We’ll confirm the details and talk through your quote.",
              ],
              [
                "We handle moving day",
                "Once your move is booked, we’ll work through the agreed plan.",
              ],
            ].map(([title, text], i) => (
              <div key={title}>
                <span className="step-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="humour wrap">
        <span className="eyebrow">Keep the couch. Keep the friends.</span>
        <h2>
          Moving is stressful enough. Your couch shouldn&apos;t cost you a
          friendship.
        </h2>
        <CTA location="humour" />
      </section>
      <section className="faq wrap section">
        <h2>A couple of good questions</h2>
        {faq.map((f) => (
          <details key={f.question}>
            <summary>{f.question}</summary>
            <p>{f.answer}</p>
          </details>
        ))}
      </section>
      <Reviews />
      <section className="final-cta">
        <div className="wrap">
          <div>
            <span className="eyebrow">Let’s talk about what’s next</span>
            <h2>Ready to Move?</h2>
          </div>
          <CTA location="final">Get Your Free Quote</CTA>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "MovingCompany",
              name: "IWantToMove.ca",
              telephone: "+17785137503",
              url: site,
              areaServed: "[[PLACEHOLDER: service area]]",
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]),
        }}
      />
    </>
  );
}
