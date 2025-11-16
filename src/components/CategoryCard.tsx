import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  items: string[];
  icon: LucideIcon;
  colorClass: "healthcare" | "educational";
  image: string;
}

export const CategoryCard = ({ title, description, items, icon: Icon, colorClass, image }: CategoryCardProps) => {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-${colorClass}/90 to-${colorClass}/40`} />
        <div className="absolute bottom-4 left-4 text-white">
          <Icon className="h-8 w-8 mb-2" />
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <p className="text-muted-foreground">{description}</p>
        
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Popular Items:</p>
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full bg-${colorClass}`} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <Button variant="outline" className="w-full group/btn">
          View All Products
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
};
