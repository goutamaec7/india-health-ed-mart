import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Terms = () => (
  <div className="min-h-screen flex flex-col">
    <Helmet>
      <title>Terms of Service | MedEduTrade</title>
      <meta name="description" content="Terms and conditions for using MedEduTrade, India's B2B marketplace for healthcare and educational supplies." />
      <link rel="canonical" href="/terms" />
    </Helmet>
    <Header />
    <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

      <div className="prose prose-slate max-w-none space-y-6 text-foreground">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using MedEduTrade ("Platform"), you agree to be bound by these Terms of Service and all applicable laws of India. If you do not agree, please do not use the Platform.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Eligibility</h2>
          <p>You must be at least 18 years old and legally capable of entering into a binding contract under the Indian Contract Act, 1872. Institutional buyers must provide a valid GSTIN and be authorised to purchase on behalf of their organisation.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Products and Compliance</h2>
          <p>MedEduTrade lists healthcare and educational products. Certain medical devices, diagnostics, and chemicals are regulated under CDSCO, the Drugs and Cosmetics Act, 1940, and related rules. Buyers are responsible for holding any licences required to purchase or use such products. We may refuse or cancel orders where compliance cannot be verified.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Orders, Pricing, and GST</h2>
          <p>All prices are in Indian Rupees (₹) and exclusive of GST unless stated. GST is added at applicable rates (0%, 5%, 12%, 18%, or 28%) based on the HSN classification of each product. A GST-compliant tax invoice is issued for every order.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Payments</h2>
          <p>Payments are processed securely through Razorpay. We do not store your card, UPI, or bank credentials. Orders are confirmed only after successful payment authorisation and signature verification.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately at support@mededu.in of any unauthorised use.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, MedEduTrade is not liable for indirect, incidental, or consequential damages. Our aggregate liability for any claim shall not exceed the value of the order giving rise to the claim.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Governing Law</h2>
          <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts at [Your City], India.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Changes to Terms</h2>
          <p>We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the revised Terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Contact</h2>
          <p>For questions about these Terms, email <a className="text-primary" href="mailto:legal@mededu.in">legal@mededu.in</a>.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
