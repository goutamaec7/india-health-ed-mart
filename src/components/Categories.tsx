import { Heart, GraduationCap } from "lucide-react";
import { CategoryCard } from "./CategoryCard";
import heroHealthcare from "@/assets/hero-healthcare.jpg";
import heroEducational from "@/assets/hero-educational.jpg";

export const Categories = () => {
  return (
    <section className="py-16 bg-background" id="categories">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Product Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive range of healthcare and educational products for institutions across India
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CategoryCard
            title="Healthcare Products"
            description="Premium medical equipment and supplies for hospitals, clinics, and diagnostic centers"
            items={[
              "Diagnostic Equipment",
              "Surgical Instruments",
              "Medical Devices",
              "Healthcare Consumables"
            ]}
            icon={Heart}
            colorClass="healthcare"
            image={heroHealthcare}
          />

          <CategoryCard
            title="Educational Products"
            description="Quality laboratory equipment and supplies for schools, colleges, and research institutions"
            items={[
              "Laboratory Equipment",
              "Chemicals & Reagents",
              "Scientific Glassware",
              "Educational Accessories"
            ]}
            icon={GraduationCap}
            colorClass="educational"
            image={heroEducational}
          />
        </div>
      </div>
    </section>
  );
};
