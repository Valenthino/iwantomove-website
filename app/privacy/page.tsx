import { metadata } from "@/lib/seo";
import { ResetAnalytics } from "@/components/analytics";
export function generateMetadata() {
  return metadata(
    "Privacy & Your Moving Details | IWantToMove.ca",
    "How IWantToMove.ca uses your contact information and moving details, and how to request deletion or turn off analytics.",
    "/privacy",
  );
}
export default function Page() {
  return (
    <article className="wrap narrow section prose">
      <span className="eyebrow">Your information</span>
      <h1>Privacy, in plain language.</h1>
      <h2>What we collect and why</h2>
      <p>
        When you request a quote, we collect your name, phone number, optional
        email address and move details. We use them to review your request,
        contact you and prepare a quote. Please don’t include sensitive personal
        information in the notes.
      </p>
      <h2>Where your request goes</h2>
      <p>
        We store your request in a file on our server and, when email is
        configured, send a notification to the business and a confirmation to
        your email address. Access should be limited to the people handling your
        move. [[PLACEHOLDER: data retention period]]
      </p>
      <h2>Analytics and advertising</h2>
      <p>
        We use Google Analytics and Meta Pixel when configured and you allow
        analytics. Google Tag Manager may manage these tags. These tools help
        measure page visits, quote requests and clicks, and may use cookies and
        process data outside Canada. The tracking helper does not send your
        name, phone, email or form answers. You can decline analytics and still
        request a quote.
      </p>
      <p>
        You can turn off future tracking on this browser below. To remove
        existing cookies, use your browser’s cookie settings. Your browser or an
        ad blocker may offer additional controls.
      </p>
      <ResetAnalytics />
      <h2>Access, corrections or deletion</h2>
      <p>
        To ask about your information or request deletion, contact
        [[PLACEHOLDER: business email]]. Privacy contact: {"[[PLACEHOLDER: privacy contact]]"}. We’ll need enough information to identify your request.
      </p>
    </article>
  );
}
