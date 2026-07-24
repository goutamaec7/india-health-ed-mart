import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => (
  <div className="min-h-screen flex flex-col">
    <Helmet>
      <title>Contact Us | MedEduTrade</title>
      <meta name="description" content="Get in touch with MedEduTrade for orders, support, GST queries, or partnerships." />
      <link rel="canonical" href="/contact" />
    </Helmet>
    <Header />
    <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-8">We're here to help. Reach us through any of the channels below.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-2">
            <Mail className="h-6 w-6 text-primary" />
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm text-muted-foreground">General: <a className="text-primary" href="mailto:info@mededu.in">info@mededu.in</a></p>
            <p className="text-sm text-muted-foreground">Support: <a className="text-primary" href="mailto:support@mededu.in">support@mededu.in</a></p>
            <p className="text-sm text-muted-foreground">GST/Invoices: <a className="text-primary" href="mailto:accounts@mededu.in">accounts@mededu.in</a></p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <Phone className="h-6 w-6 text-primary" />
            <h3 className="font-semibold">Phone</h3>
            <p className="text-sm text-muted-foreground">Toll-free: +91 1800-XXX-XXXX</p>
            <p className="text-sm text-muted-foreground">Institutional sales: +91 XXXXX-XXXXX</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <MapPin className="h-6 w-6 text-primary" />
            <h3 className="font-semibold">Registered Office</h3>
            <p className="text-sm text-muted-foreground">MedEduTrade Pvt. Ltd.<br />[Address Line 1]<br />[City], [State] - [PIN]<br />India</p>
            <p className="text-sm text-muted-foreground">GSTIN: [Your GSTIN]</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <Clock className="h-6 w-6 text-primary" />
            <h3 className="font-semibold">Business Hours</h3>
            <p className="text-sm text-muted-foreground">Mon-Sat: 9:00 AM - 6:00 PM IST</p>
            <p className="text-sm text-muted-foreground">Sun & Public Holidays: Closed</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 rounded-lg border bg-muted/30 p-6">
        <h2 className="font-semibold mb-2">Grievance Officer</h2>
        <p className="text-sm text-muted-foreground">As per the Consumer Protection Act, 2019, you can escalate unresolved concerns to our Grievance Officer at <a className="text-primary" href="mailto:grievance@mededu.in">grievance@mededu.in</a>. We acknowledge within 48 hours and resolve within 30 days.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Contact;
