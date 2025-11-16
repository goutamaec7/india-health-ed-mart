import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/pages/Products";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/lib/api/cart";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const getStockStatus = () => {
    if (product.stock === 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const };
    }
    if (product.stock <= 10) {
      return { label: `Low Stock (${product.stock} left)`, variant: 'secondary' as const };
    }
    return { label: 'In Stock', variant: 'default' as const };
  };

  const stockStatus = getStockStatus();

  const getCertifications = () => {
    if (!product.certifications) return [];
    return Array.isArray(product.certifications) 
      ? product.certifications.slice(0, 3)
      : [];
  };

  const certifications = getCertifications();

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
      await addToCart(product.id, 1);
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 h-full flex flex-col cursor-pointer"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.product_name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <Badge
          className="absolute top-2 left-2 capitalize"
          variant={product.category === 'healthcare' ? 'default' : 'secondary'}
        >
          {product.category}
        </Badge>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-base line-clamp-2 mb-2 min-h-[3rem]">
          {product.product_name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-2">
          SKU: {product.sku}
        </p>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-primary">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">
            + {product.gst_rate}% GST
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant={stockStatus.variant as any}>{stockStatus.label}</Badge>
        </div>

        {certifications.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {certifications.map((cert: any, idx: number) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {cert.name || cert}
              </Badge>
            ))}
          </div>
        )}

        {product.manufacturer && (
          <p className="text-xs text-muted-foreground mt-auto">
            By {product.manufacturer}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={product.stock === 0 || isAddingToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAddingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};
