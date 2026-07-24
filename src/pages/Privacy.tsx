import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Privacy = () => (
  <div className="min-h-screen flex flex-col">
    <Helmet>
      <title>Privacy Policy | MedEduTrade</title>
      <meta name="description" content="How MedEduTrade collects, uses, and protects your personal and business data under Indian data protection law." />
      <link rel="canonical" href="/privacy" />
    </Helmet>
    <Header />
    <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

      <div className="space-y-6 text-foreground">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Account details: name, email, phone, password (hashed).</li>
            <li>Institution details: organisation name, type, GSTIN.</li>
            <li>Order details: shipping address, billing address, order history.</li>
            <li>Payment metadata: transaction IDs and status (no card/UPI credentials).</li>
            <li>Usage data: pages viewed, searches, IP address, device information.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Process and fulfil orders, generate GST-compliant invoices.</li>
            <li>Provide customer support and respond to enquiries.</li>
            <li>Detect fraud and comply with legal obligations (e.g., CDSCO, GST).</li>
            <li>Send transactional notifications (order confirmation, shipping updates).</li>
            <li>Improve our Platform and product offerings.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Sharing of Information</h2>
          <p>We share data only with service providers necessary to run the Platform — payment gateway (Razorpay), logistics partners, cloud infrastructure providers, and tax authorities as required by law. We do not sell your personal data.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
          <p>Data is transmitted over TLS and stored in access-controlled databases with row-level security. Passwords are hashed. Payment processing is handled by PCI-DSS compliant partners.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
          <p>Under Indian data protection law you may request access, correction, or deletion of your personal data by writing to <a className="text-primary" href="mailto:privacy@mededu.in">privacy@mededu.in</a>. We respond within 30 days.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Cookies</h2>
          <p>We use essential cookies for authentication and cart persistence, and analytics cookies to understand usage. You can control cookies through your browser settings.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Data Retention</h2>
          <p>Order and invoice data is retained for at least 8 years to comply with GST record-keeping requirements. Account data is retained while your account is active.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Contact</h2>
          <p>Grievance Officer: <a className="text-primary" href="mailto:privacy@mededu.in">privacy@mededu.in</a></p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;
