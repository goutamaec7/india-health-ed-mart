import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const ShippingPolicy = () => (
  <div className="min-h-screen flex flex-col">
    <Helmet>
      <title>Shipping Policy | MedEduTrade</title>
      <meta name="description" content="Shipping timelines, coverage, and charges for MedEduTrade orders across India." />
      <link rel="canonical" href="/shipping-policy" />
    </Helmet>
    <Header />
    <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Shipping Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

      <div className="space-y-6 text-foreground">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Coverage</h2>
          <p>We ship to all serviceable pincodes across India through reputed courier and logistics partners. International shipping is not currently available.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Processing Time</h2>
          <p>Orders are typically processed and dispatched within <strong>1-2 business days</strong> of payment confirmation. Bulk institutional orders may take 3-5 business days.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Delivery Timelines</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Metro cities: 2-4 business days</li>
            <li>Tier 2 / Tier 3 cities: 4-7 business days</li>
            <li>Remote areas: 7-10 business days</li>
          </ul>
          <p className="mt-2">Timelines are indicative and may vary due to weather, courier constraints, or local restrictions.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Shipping Charges</h2>
          <p>Shipping charges are calculated at checkout based on weight, dimensions, and destination. Orders above ₹5,000 qualify for free standard shipping. Cold-chain or hazmat products (e.g., certain reagents) may attract additional handling fees.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Tracking</h2>
          <p>Once your order ships, a tracking ID is emailed and available under Orders in your account.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Damaged or Missing Shipments</h2>
          <p>Please inspect the package at delivery. Report any damage, tampering, or missing items within 48 hours to <a className="text-primary" href="mailto:support@mededu.in">support@mededu.in</a> with photos.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default ShippingPolicy;
