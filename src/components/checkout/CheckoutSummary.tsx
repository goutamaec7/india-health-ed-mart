import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin } from "lucide-react";
import type { CartItemWithProduct } from "@/lib/api/cartUtils";
import type { Address } from "@/lib/api/addresses";

interface CheckoutSummaryProps {
  items: CartItemWithProduct[];
  subtotal: number;
  tax: number;
  total: number;
  deliveryAddress?: Address | null;
}

export const CheckoutSummary = ({ 
  items, 
  subtotal, 
  tax, 
  total, 
  deliveryAddress 
}: CheckoutSummaryProps) => {
  const taxBreakdown = items.reduce((acc, item) => {
    const itemTotal = item.product.price * item.quantity;
    const itemTax = (itemTotal * item.product.gst_rate) / 100;
    
    if (!acc[item.product.gst_rate]) {
      acc[item.product.gst_rate] = 0;
    }
    acc[item.product.gst_rate] += itemTax;
    
    return acc;
  }, {} as Record<number, number>);

  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);
    
    return minDate.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Items ({items.length})</div>
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 text-sm">
              <img
                src={item.product.image_url || "/placeholder.svg"}
                alt={item.product.product_name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.product.product_name}</p>
                <p className="text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <div className="font-medium">
                ₹{(item.product.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex justify-between text-base">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">₹{subtotal.toLocaleString()}</span>
          </div>

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
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-2xl text-green-600">
            ₹{total.toLocaleString()}
          </span>
        </div>

        {/* Delivery Info */}
        {deliveryAddress && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4" />
                <span>Delivery Address</span>
              </div>
              <div className="text-sm text-muted-foreground pl-6">
                <p className="font-medium text-foreground">{deliveryAddress.full_name}</p>
                <p>{deliveryAddress.address_line1}</p>
                {deliveryAddress.address_line2 && <p>{deliveryAddress.address_line2}</p>}
                <p>{deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.postal_code}</p>
              </div>
            </div>
          </>
        )}

        {/* Delivery Estimate */}
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Package className="h-4 w-4" />
            <span>Estimated Delivery</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 pl-6">
            By {getEstimatedDelivery()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
