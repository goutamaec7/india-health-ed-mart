import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Minus, Plus, Trash2 } from "lucide-react";
import { updateCartItemQuantity, removeFromCart } from "@/lib/api/cart";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";
import type { CartItemWithProduct } from "@/lib/api/cartUtils";

interface CartItemProps {
  item: CartItemWithProduct;
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
}

export const CartItem = ({ item, onQuantityChange, onRemove }: CartItemProps) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(item.quantity);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const debouncedQuantity = useDebounce(quantity, 500);

  // Update cart in database when debounced quantity changes
  useEffect(() => {
    if (debouncedQuantity !== item.quantity && debouncedQuantity > 0) {
      updateQuantity(debouncedQuantity);
    }
  }, [debouncedQuantity]);

  const updateQuantity = async (newQuantity: number) => {
    setIsUpdating(true);
    try {
      await updateCartItemQuantity(item.id, newQuantity);
      onQuantityChange(item.id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      setQuantity(item.quantity); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrement = () => {
    if (quantity < item.product.stock) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error(`Only ${item.product.stock} items available`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= item.product.stock) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity(1);
    } else if (value > item.product.stock) {
      toast.error(`Only ${item.product.stock} items available`);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item.id);
      onRemove(item.id);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
    setShowRemoveDialog(false);
  };

  const lineTotal = item.product.price * quantity;

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center py-4 border-b hover:bg-muted/50 transition-colors">
        {/* Product */}
        <div className="col-span-5 flex items-center gap-4">
          <div
            className="h-20 w-20 bg-muted rounded overflow-hidden flex-shrink-0 cursor-pointer"
            onClick={() => navigate(`/products/${item.product.id}`)}
          >
            {item.product.image_url ? (
              <img
                src={item.product.image_url}
                alt={item.product.product_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                No image
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold hover:text-primary cursor-pointer line-clamp-2"
              onClick={() => navigate(`/products/${item.product.id}`)}
            >
              {item.product.product_name}
            </h3>
            <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
            {item.product.stock <= 10 && (
              <Badge variant="secondary" className="mt-1 text-xs">
                Only {item.product.stock} left
              </Badge>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="col-span-2 text-center">
          <p className="font-medium">₹{item.product.price.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">+ {item.product.gst_rate}% GST</p>
        </div>

        {/* Quantity */}
        <div className="col-span-2">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrement}
              disabled={quantity <= 1 || isUpdating}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              className="w-16 text-center"
              disabled={isUpdating}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrement}
              disabled={quantity >= item.product.stock || isUpdating}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Total */}
        <div className="col-span-2 text-center">
          <p className="font-bold text-lg">₹{lineTotal.toLocaleString()}</p>
        </div>

        {/* Remove */}
        <div className="col-span-1 text-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRemoveDialog(true)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden border rounded-lg p-4 space-y-4">
        <div className="flex gap-4">
          <div
            className="h-24 w-24 bg-muted rounded overflow-hidden flex-shrink-0 cursor-pointer"
            onClick={() => navigate(`/products/${item.product.id}`)}
          >
            {item.product.image_url ? (
              <img
                src={item.product.image_url}
                alt={item.product.product_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                No image
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold hover:text-primary cursor-pointer line-clamp-2"
              onClick={() => navigate(`/products/${item.product.id}`)}
            >
              {item.product.product_name}
            </h3>
            <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
            {item.product.stock <= 10 && (
              <Badge variant="secondary" className="mt-1 text-xs">
                Only {item.product.stock} left
              </Badge>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Unit Price</p>
            <p className="font-medium">₹{item.product.price.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Line Total</p>
            <p className="font-bold text-lg text-primary">₹{lineTotal.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrement}
              disabled={quantity <= 1 || isUpdating}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              className="w-16 text-center"
              disabled={isUpdating}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrement}
              disabled={quantity >= item.product.stock || isUpdating}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRemoveDialog(true)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove item from cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{item.product.product_name}" from your cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
