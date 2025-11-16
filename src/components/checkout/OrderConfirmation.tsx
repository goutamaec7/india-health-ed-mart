import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrderById } from "@/lib/api/orders";
import { CheckCircle2, Download, Package } from "lucide-react";
import { toast } from "sonner";
import type { Order, OrderItem } from "@/lib/api/orders";

interface OrderConfirmationProps {
  orderId: string;
  paymentMethod: string;
}

export const OrderConfirmation = ({ orderId, paymentMethod }: OrderConfirmationProps) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const orderData = await getOrderById(orderId);
      const { items, ...orderWithoutItems } = orderData;
      setOrder(orderWithoutItems as Order);
      setOrderItems(items);
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getEstimatedDelivery = () => {
    if (!order) return "";
    const orderDate = new Date(order.created_at);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 5);
    
    return deliveryDate.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading order details...</div>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-destructive">Order not found</div>
        </CardContent>
      </Card>
    );
  }

  const deliveryAddress = order.delivery_address as any;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order Confirmed!</h1>
          <p className="text-muted-foreground mt-2">
            Thank you for your purchase
          </p>
        </div>
        <div className="inline-block bg-muted px-4 py-2 rounded-lg">
          <p className="text-sm text-muted-foreground">Order Number</p>
          <p className="text-xl font-bold text-foreground">{order.order_number}</p>
        </div>
      </div>

      {/* Order Details */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {orderItems.map((item) => {
                const product = item.product_snapshot as any;
                return (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.product_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{product.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ₹{item.unit_price.toLocaleString()}
                      </p>
                    </div>
                    <div className="font-medium">
                      ₹{item.line_total.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (GST)</span>
              <span>₹{order.tax_amount.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Paid</span>
              <span className="text-green-600">₹{order.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3">Delivery Information</h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Delivering to:</p>
                <p className="font-medium">{deliveryAddress.full_name}</p>
                <p>{deliveryAddress.address_line1}</p>
                {deliveryAddress.address_line2 && <p>{deliveryAddress.address_line2}</p>}
                <p>{deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.postal_code}</p>
                <p className="mt-1">Phone: {deliveryAddress.phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
            <Package className="h-5 w-5 text-blue-600" />
            <div className="text-sm">
              <p className="font-medium">Estimated Delivery</p>
              <p className="text-muted-foreground">By {getEstimatedDelivery()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 space-y-3">
          <h3 className="font-semibold">What's Next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Confirmation email sent to your registered email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>You'll receive tracking details once your order is shipped</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Track your order anytime from your account</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          onClick={() => navigate('/products')}
          className="flex-1"
        >
          Continue Shopping
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => toast.info('Invoice download coming soon')}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Invoice
        </Button>
      </div>
    </div>
  );
};
