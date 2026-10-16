import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import DataDeletionInstructions from "@/components/DataDeletionInstructions";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ChinaPal handles website, travel-support, Instagram messaging, and AI-assisted service data, and how to request deletion.",
  alternates: { canonical: "https://www.chinapal.co/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        This policy explains how ChinaPal, the travel concierge service operating
        chinapal.co, handles personal information. It covers our website, travel
        planning and support, and our ChinaPal Concierge / ChinaPal Concierge-IG
        messaging integration. For privacy questions, contact{" "}
        <a href="mailto:chinapal_travel@outlook.com">chinapal_travel@outlook.com</a>.
      </p>
      <nav aria-label="Privacy policy sections" className="rounded-2xl border border-black/10 bg-white p-5">
        <p className="!mt-0 font-semibold text-dark">On this page</p>
        <ul className="grid gap-x-5 sm:grid-cols-2">
          <li><a href="#information">Information we handle</a></li>
          <li><a href="#instagram-ai">Instagram and AI assistance</a></li>
          <li><a href="#providers">Service providers</a></li>
          <li><a href="#cookies">Cookies and analytics</a></li>
          <li><a href="#retention">Storage and retention</a></li>
          <li><a href="#data-deletion">Your rights and deletion</a></li>
        </ul>
      </nav>

      <section id="information">
        <h2>1. Information we handle</h2>
        <ul>
          <li><strong>Information you provide:</strong> your name, contact details, account information, travel dates, destinations, preferences, questions, itineraries, and any messages, screenshots, images, or other attachments you send us.</li>
          <li><strong>Messaging information:</strong> your platform username and identifiers, conversation and message identifiers, timestamps, message content, attachments, and available delivery or interaction information.</li>
          <li><strong>Purchase information:</strong> the service purchased, payment status, transaction references, and information needed for support or refunds. Stripe processes checkout payment details; ChinaPal&apos;s checkout does not store your full payment-card number.</li>
          <li><strong>Website activity:</strong> device and browser information, IP address, pages visited, referral information, interactions, and technical logs collected through our hosting and analytics services.</li>
        </ul>
        <p>
          Information comes from you, the messaging platforms you use to contact us,
          payment and account services, and your use of our website. Share only what
          is needed for your request, and redact passwords, card numbers, identity
          documents, and unrelated information from screenshots. If you share details
          about travel companions, make sure you are entitled to do so.
        </p>
      </section>

      <section id="purposes">
        <h2>2. How we use information</h2>
        <p>
          We use information to answer inquiries, explain our services, plan trips,
          provide concierge support, maintain conversation context, manage accounts
          and purchases, handle refunds and complaints, improve the website, protect
          our systems, and meet applicable recordkeeping obligations. Without the
          details needed for a particular request, we may be unable to provide that service.
        </p>
        <p>
          Where a legal basis is required, we rely on performing a contract or taking
          steps you request before a purchase; our legitimate interests in providing,
          securing, and improving the service; legal obligations; and consent where
          required. You may object to processing based on legitimate interests and
          withdraw consent by contacting us. Withdrawal does not affect processing
          that was lawful before it was withdrawn.
        </p>
      </section>

      <section id="instagram-ai">
        <h2>3. Instagram messages and AI assistance</h2>
        <p>
          When you contact ChinaPal on Instagram, our team can read and reply to your
          messages there. When our API integration is enabled, it can also retrieve
          available conversation history and receive new messages and attachments
          for our internal support inbox. This access concerns conversations with
          ChinaPal; it does not give us access to your unrelated private chats or
          your Instagram password.
        </p>
        <p>
          We use AI tools, including ChatGPT/OpenAI, and may use Anthropic-powered
          planning tools, to help understand questions and images, translate, prepare
          recommendations, and draft replies. Relevant message text, screenshots,
          attachments, and conversation context may be submitted to these providers
          for processing. Their handling of that information also depends on the
          product used, its terms, and its privacy settings.
        </p>
        <p>
          Our Instagram reply workflow uses AI to assist the team: a person reviews
          and approves a draft before it is sent. AI can make mistakes, and you can
          ask our team to clarify or correct a response. We do not use Instagram
          message content for advertising or sell that content.
        </p>
      </section>

      <section id="providers">
        <h2>4. Who receives information</h2>
        <p>
          ChinaPal team members handling your inquiry or trip can access relevant
          information. We also use service providers for specific functions:
        </p>
        <ul>
          <li><strong>Vercel:</strong> website hosting and server operations.</li>
          <li><strong>Supabase:</strong> account services and database storage, including support records when the integration is enabled.</li>
          <li><strong>Stripe:</strong> payment processing and related transaction records.</li>
          <li><strong>Meta/Instagram, WhatsApp, and email providers:</strong> communications through the channels you choose.</li>
          <li><strong>AI providers:</strong> processing the information supplied for planning, analysis, translation, and drafting as described above.</li>
          <li><strong>PostHog, Microsoft Clarity, and Google where enabled:</strong> website analytics and advertising measurement as described below.</li>
        </ul>
        <p>
          We may share relevant information with a travel supplier when needed to
          carry out a request you make, or with authorities and advisers where legally
          required or necessary to address fraud, security incidents, or legal claims.
          External booking sites and messaging platforms have their own privacy policies.
        </p>
        <p>
          Some itineraries are provided as shareable webpages. Anyone who has or finds
          a publicly accessible itinerary link may be able to view its contents.
          Treat these links carefully and contact us if an itinerary contains
          information you want removed.
        </p>
      </section>

      <section id="cookies">
        <h2>5. Cookies, browser storage, and analytics</h2>
        <p>
          The website uses cookies and browser storage for account sessions and site
          functionality. Some chat information may be stored locally in your browser.
          PostHog helps us understand page visits and interactions. Microsoft Clarity
          provides interaction metrics, heatmaps, and session replay to help us
          understand and improve how the website is used. These tools may use cookies
          and similar technologies and collect device, usage, and page-interaction data.
        </p>
        <p>
          Microsoft may also use the information it collects for its own purposes,
          including advertising, as described in the{" "}
          <a href="https://privacy.microsoft.com/en-us/privacystatement">Microsoft Privacy Statement</a>.
          Where Google Ads measurement is enabled, Google receives activity and
          conversion information to measure advertising performance; see{" "}
          <a href="https://policies.google.com/technologies/partner-sites">Google&apos;s explanation of partner-site data</a>.
        </p>
        <p>
          You can control or delete cookies and site storage through your browser
          settings and use the privacy controls offered by these providers. Blocking
          storage may affect sign-in and other features. This policy describes our
          use of these tools; it is not itself a request for cookie consent.
        </p>
      </section>

      <section id="retention">
        <h2>6. Storage, security, and retention</h2>
        <p>
          Our team and service providers may process information in China, the United
          States, Canada, and other countries where they operate. Privacy protections
          may differ from those in your country. Contact us for details about the
          providers and transfer arrangements relevant to your information.
        </p>
        <p>
          Retention depends on the purpose: ongoing travel support and follow-up,
          account administration, resolving refund requests or disputes, security,
          and applicable legal recordkeeping periods. We retain information only as
          long as needed for those purposes. Deletion is handled through the request
          process below; messages are not automatically deleted when a support pass ends.
        </p>
        <p>
          We use access controls and technical safeguards appropriate to the systems
          involved. No internet transmission or storage system is completely secure.
        </p>
      </section>

      <section id="data-deletion">
        <h2>7. Your rights and data deletion</h2>
        <p>
          Depending on the law that applies to you, you may have rights to access,
          correct, delete, or receive a copy of your information; restrict or object
          to processing; withdraw consent; and complain to your local data-protection
          authority. Contact us at the email below to exercise these rights.
        </p>
        <DataDeletionInstructions />
        <p><Link href="/data-deletion">Open the standalone data-deletion instructions.</Link></p>
      </section>

      <section id="children">
        <h2>8. Children and family travel</h2>
        <p>
          Our service is intended to be arranged by an adult traveler or group
          organizer. Please avoid sharing identifying information about children
          unless it is necessary for your request. Contact us if you believe a child
          has provided personal information that should be removed.
        </p>
      </section>

      <section id="changes">
        <h2>9. Changes and contact</h2>
        <p>
          We will update this page when our practices change and revise the date at
          the top. Where required, we will provide additional notice of material changes.
          Questions or requests can be sent to{" "}
          <a href="mailto:chinapal_travel@outlook.com">chinapal_travel@outlook.com</a>.
        </p>
      </section>
    </LegalPage>
  );
}
