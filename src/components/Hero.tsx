import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroHealthcare from "@/assets/hero-healthcare.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-healthcare-light/20 to-educational-light/20">
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Trusted by 500+ Institutions Across India
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Premium Healthcare & Educational Supplies
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your trusted partner for high-quality medical devices, diagnostic equipment, and educational laboratory supplies. ISO certified and CDSCO compliant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base group">
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="text-base">
                Request Catalog
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-healthcare-light flex items-center justify-center">
                  <span className="text-healthcare font-bold text-sm">ISO</span>
                </div>
                <span className="text-sm text-muted-foreground">Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-educational-light flex items-center justify-center">
                  <span className="text-educational font-bold text-sm">2K+</span>
                </div>
                <span className="text-sm text-muted-foreground">SKUs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">₹</span>
                </div>
                <span className="text-sm text-muted-foreground">GST Compliant</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroHealthcare}
                alt="Healthcare and educational equipment"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
