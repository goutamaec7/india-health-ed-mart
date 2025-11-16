import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedItems, removeFromSavedItems } from "@/lib/api/savedItems";
import { addToCart } from "@/lib/api/cart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, ShoppingCart, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DashboardSavedItems() {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    loadSavedItems();
  }, []);

  const loadSavedItems = async () => {
    try {
      setLoading(true);
      const data = await getSavedItems();
      setSavedItems(data);
    } catch (error) {
      console.error("Failed to load saved items:", error);
      toast.error("Failed to load saved items");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      setRemovingId(productId);
      await removeFromSavedItems(productId);
      setSavedItems((prev) => prev.filter((item) => item.product_id !== productId));
      toast.success("Removed from saved items");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (productId: string, productName: string) => {
    try {
      setAddingToCart(productId);
      await addToCart(productId, 1);
      toast.success(`${productName} added to cart`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (savedItems.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">No saved items yet</h2>
          <p className="text-muted-foreground mb-6">
            Browse products and save your favorites
          </p>
          <Button onClick={() => navigate("/products")}>Start Browsing</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{savedItems.length} Saved Items</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {savedItems.map((item) => {
          const product = item.products;
          return (
            <Card key={item.id} className="group overflow-hidden">
              <div
                className="aspect-square bg-muted relative cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Eye className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${product.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(product.id);
                    }}
                    disabled={removingId === product.id}
                  >
                    {removingId === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3
                  className="font-semibold truncate cursor-pointer hover:text-primary"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {product.product_name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {product.category}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">
                    ₹{product.price.toFixed(2)}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product.id, product.product_name)}
                    disabled={addingToCart === product.id}
                  >
                    {addingToCart === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
