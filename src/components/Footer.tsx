export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
              <span className="text-xl font-bold text-foreground">MedEduTrade</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for healthcare and educational supplies across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Products</a></li>
              <li><a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Track Order</a></li>
              <li><a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Account</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Policies</h3>
            <ul className="space-y-2">
              <li><a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="/refund-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Refund & Cancellation</a></li>
              <li><a href="/shipping-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shipping Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Email: info@mededu.in</li>
              <li className="text-sm text-muted-foreground">Phone: +91 1800-XXX-XXXX</li>
              <li className="text-sm text-muted-foreground">Mon-Sat: 9AM - 6PM IST</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 MedEduTrade. All rights reserved. GST Compliant | ISO Certified
          </p>
        </div>
      </div>
    </footer>
  );
};
