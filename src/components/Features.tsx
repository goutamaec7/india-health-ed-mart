import { Shield, Truck, HeadphonesIcon, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "ISO & CDSCO Certified",
    description: "All products meet international quality standards and regulatory compliance"
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    description: "Fast and secure shipping to healthcare and educational institutions nationwide"
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Dedicated customer service team to assist with your queries and orders"
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description: "Authentic products with manufacturer warranties and quality assurance"
  }
];

export const Features = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
