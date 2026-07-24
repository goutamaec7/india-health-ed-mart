import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const RefundPolicy = () => (
  <div className="min-h-screen flex flex-col">
    <Helmet>
      <title>Refund & Cancellation Policy | MedEduTrade</title>
      <meta name="description" content="MedEduTrade refund, return, and cancellation policy for healthcare and educational products." />
      <link rel="canonical" href="/refund-policy" />
    </Helmet>
    <Header />
    <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Refund & Cancellation Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

      <div className="space-y-6 text-foreground">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Order Cancellation</h2>
          <p>Orders may be cancelled free of charge before they are shipped. Once an order is dispatched, it cannot be cancelled but may be eligible for return per Section 2. Log in to your account and go to Orders to request cancellation.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Returns</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Return requests must be raised within <strong>7 days</strong> of delivery.</li>
            <li>Products must be unused, in original packaging, with all seals intact.</li>
            <li><strong>Non-returnable:</strong> sterile consumables, opened reagents/chemicals, custom-manufactured items, and any product where the tamper seal is broken (for health and safety reasons).</li>
            <li>Damaged, defective, or wrong items must be reported within <strong>48 hours</strong> of delivery with photos.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Refunds</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Approved refunds are processed within <strong>5-7 business days</strong> of receiving and inspecting the returned product.</li>
            <li>Refunds are credited to the original payment method via Razorpay.</li>
            <li>Shipping charges are non-refundable unless the return is due to our error.</li>
            <li>GST paid is refunded proportionally per applicable tax law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. How to Request a Return or Refund</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Log in and open the order under Orders.</li>
            <li>Click "Request Return" and select a reason.</li>
            <li>Our team will confirm within 2 business days and arrange pickup where possible.</li>
          </ol>
          <p className="mt-3">For assistance, email <a className="text-primary" href="mailto:support@mededu.in">support@mededu.in</a> or use the in-app chat.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Failed / Duplicate Payments</h2>
          <p>If your payment is debited but no order confirmation is shown, the amount is automatically refunded by Razorpay within 5-7 business days. Contact us if it does not reflect after this period.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default RefundPolicy;
