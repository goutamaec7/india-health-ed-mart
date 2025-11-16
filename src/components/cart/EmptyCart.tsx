import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">
          Add products from our catalog to get started
        </p>
        
        <Button
          size="lg"
          onClick={() => navigate('/products')}
          className="w-full sm:w-auto"
        >
          Browse Products
        </Button>
      </div>

      {/* Optional: Suggested Products Section */}
      <div className="mt-16">
        <h3 className="text-xl font-semibold text-center mb-6">
          Popular Products
        </h3>
        <p className="text-center text-muted-foreground">
          Trending products section coming soon
        </p>
      </div>
    </div>
  );
};
