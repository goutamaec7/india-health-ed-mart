import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "./QuantitySelector";
import { Heart, ShoppingCart, Package, TrendingUp } from "lucide-react";
import type { Product } from "@/pages/Products";
import { addToCart } from "@/lib/api/cart";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ProductInfoProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onSaveForLater: () => void;
}

export const ProductInfo = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onSaveForLater,
}: ProductInfoProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`Added ${quantity} item(s) to cart`);
      onAddToCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const getStockStatus = () => {
    if (product.stock === 0) {
      return { 
        label: 'Out of Stock', 
        color: 'bg-destructive text-destructive-foreground',
        icon: Package 
      };
    }
    if (product.stock <= 10) {
      return { 
        label: `Low Stock (${product.stock} left)`, 
        color: 'bg-orange-500 text-white',
        icon: TrendingUp 
      };
    }
    return { 
      label: 'In Stock', 
      color: 'bg-green-600 text-white',
      icon: Package 
    };
  };

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  const getBulkPricing = () => {
    const basePrice = product.price;
    return [
      { range: '1-5 units', price: basePrice, discount: 0 },
      { range: '6-20 units', price: basePrice * 0.95, discount: 5 },
      { range: '20+ units', price: basePrice * 0.90, discount: 10 },
    ];
  };

  const bulkPricing = getBulkPricing();

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="capitalize">
            {product.category}
          </Badge>
          {product.manufacturer && (
            <Badge variant="outline">
              By {product.manufacturer}
            </Badge>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {product.product_name}
        </h1>
        
        <p className="text-sm text-muted-foreground">
          SKU: {product.sku}
        </p>
      </div>

      {/* Price Section */}
      <div className="border-t border-b py-4 space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-green-600">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">
            + {product.gst_rate}% GST
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={stockStatus.color}>
            <StockIcon className="h-3 w-3 mr-1" />
            {stockStatus.label}
          </Badge>
        </div>
      </div>

      {/* Bulk Pricing */}
      {product.stock > 5 && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Bulk Pricing Available:</h3>
          <div className="space-y-2">
            {bulkPricing.map((tier, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{tier.range}:</span>
                <span className="font-medium">
                  ₹{tier.price.toLocaleString()}
                  {tier.discount > 0 && (
                    <span className="text-green-600 ml-2">
                      (Save {tier.discount}%)
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      {product.stock > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Quantity:
          </label>
          <QuantitySelector
            quantity={quantity}
            maxQuantity={product.stock}
            onQuantityChange={onQuantityChange}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          className="w-full h-12 text-base"
          size="lg"
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAddingToCart}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isAddingToCart ? 'Adding to Cart...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        
        <Button
          variant="outline"
          className="w-full h-12 text-base"
          size="lg"
          onClick={onSaveForLater}
        >
          <Heart className="mr-2 h-5 w-5" />
          Save for Later
        </Button>
      </div>

      {/* Manufacturer & Seller */}
      <div className="border-t pt-4 space-y-2">
        {product.manufacturer && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Manufacturer:</span>
            <span className="font-medium">{product.manufacturer}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Sold by:</span>
          <span className="font-medium flex items-center gap-2">
            MedEduTrade
            <Badge variant="secondary" className="text-xs">Verified</Badge>
          </span>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-sm">
        <p className="font-medium mb-1">📦 Estimated Delivery</p>
        <p className="text-muted-foreground">3-5 business days</p>
      </div>
    </div>
  );
};
