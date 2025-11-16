import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, TrendingUp } from "lucide-react";
import type { CartItemWithProduct } from "@/lib/api/cartUtils";

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  items: CartItemWithProduct[];
  onCheckout: () => void;
}

export const CartSummary = ({ subtotal, tax, total, items, onCheckout }: CartSummaryProps) => {
  // Calculate tax breakdown by category
  const taxBreakdown = items.reduce((acc, item) => {
    const itemTotal = item.product.price * item.quantity;
    const itemTax = (itemTotal * item.product.gst_rate) / 100;
    
    if (!acc[item.product.gst_rate]) {
      acc[item.product.gst_rate] = 0;
    }
    acc[item.product.gst_rate] += itemTax;
    
    return acc;
  }, {} as Record<number, number>);

  // Estimate delivery date (3-5 business days from now)
  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDays = 3;
    const maxDays = 5;
    
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short' 
      });
    };
    
    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  };

  // Check if any items are low stock or out of stock
  const hasStockIssues = items.some(item => item.product.stock === 0);
  const hasLowStock = items.some(item => item.product.stock > 0 && item.product.stock <= 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">₹{subtotal.toLocaleString()}</span>
        </div>

        {/* Tax Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-base">
            <span className="text-muted-foreground">Tax (GST)</span>
            <span className="font-medium">₹{tax.toLocaleString()}</span>
          </div>
          {Object.entries(taxBreakdown).map(([rate, amount]) => (
            <div key={rate} className="flex justify-between text-sm text-muted-foreground pl-4">
              <span>{rate}% GST</span>
              <span>₹{amount.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-2xl text-green-600">
            ₹{total.toLocaleString()}
          </span>
        </div>

        {/* Delivery Estimate */}
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Package className="h-4 w-4" />
            <span>Estimated Delivery</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {getEstimatedDelivery()}
          </p>
          <p className="text-xs text-muted-foreground pl-6">
            3-5 business days
          </p>
        </div>

        {/* Stock Warnings */}
        {hasLowStock && !hasStockIssues && (
          <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-orange-800 dark:text-orange-200">
              <TrendingUp className="h-4 w-4" />
              <span>Limited Stock</span>
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
              Some items have limited availability
            </p>
          </div>
        )}

        {hasStockIssues && (
          <div className="bg-destructive/10 p-3 rounded-lg">
            <p className="text-sm font-medium text-destructive">
              Some items are out of stock
            </p>
            <p className="text-xs text-destructive/80 mt-1">
              Please remove out-of-stock items to proceed
            </p>
          </div>
        )}

        {/* Checkout Button */}
        <Button
          className="w-full h-12 text-base"
          size="lg"
          onClick={onCheckout}
          disabled={hasStockIssues}
        >
          Proceed to Checkout
        </Button>

        {/* Continue Shopping Link */}
        <Button
          variant="link"
          className="w-full"
          onClick={() => window.location.href = '/products'}
        >
          Continue Shopping
        </Button>

        {/* Promo Code Section (Optional) */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground text-center">
            Promo codes can be applied at checkout
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
