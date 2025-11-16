import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getOrderById, subscribeToOrderUpdates } from "@/lib/api/orders";
import { addToCart } from "@/lib/api/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Package2, Loader2, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderStatusTimeline } from "@/components/orders/OrderStatusTimeline";

interface OrderWithItems {
  id: string;
  order_number: string;
  user_id: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  delivery_address: any;
  created_at: string;
  updated_at: string;
  items: Array<{
    id: string;
    product_id: string;
    product_snapshot: any;
    quantity: number;
    unit_price: number;
    gst_rate: number;
    line_total: number;
  }>;
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && id) {
      loadOrder();
    }
  }, [user, id]);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = subscribeToOrderUpdates(id, (updatedOrder) => {
      setOrder((prev) => (prev ? { ...prev, ...updatedOrder } : null));
      toast.success("Order status updated");
    });

    return () => unsubscribe();
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error("Failed to load order:", error);
      toast.error("Failed to load order details");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async () => {
    if (!order) return;

    try {
      setReordering(true);
      
      for (const item of order.items) {
        await addToCart(item.product_id, item.quantity);
      }

      toast.success("Items added to cart");
      navigate("/cart");
    } catch (error) {
      console.error("Failed to reorder:", error);
      toast.error("Failed to add items to cart");
    } finally {
      setReordering(false);
    }
  };

  const handleDownloadInvoice = () => {
    toast.info("Invoice download coming soon");
  };

  const getEstimatedDelivery = () => {
    if (!order) return "";
    const orderDate = new Date(order.created_at);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + 5);
    return format(estimatedDate, "MMM dd, yyyy");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !order) {
    return null;
  }

  const address = order.delivery_address;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{order.order_number}</h1>
              <p className="text-muted-foreground">
                Placed on {format(new Date(order.created_at), "MMM dd, yyyy 'at' hh:mm a")}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderStatusTimeline 
                  status={order.status}
                  createdAt={order.created_at}
                  updatedAt={order.updated_at}
                />
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{address.full_name}</p>
                <p className="text-muted-foreground">{address.phone}</p>
                <p className="text-muted-foreground mt-2">
                  {address.address_line1}
                  {address.address_line2 && `, ${address.address_line2}`}
                </p>
                <p className="text-muted-foreground">
                  {address.city}, {address.state} {address.postal_code}
                </p>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                        {item.product_snapshot.image_url ? (
                          <img
                            src={item.product_snapshot.image_url}
                            alt={item.product_snapshot.product_name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <Package2 className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">
                          {item.product_snapshot.product_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.product_snapshot.sku}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ₹{item.unit_price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.line_total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card className="lg:sticky lg:top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (GST)</span>
                    <span>₹{order.tax_amount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-semibold">Payment Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Payment Method: Razorpay
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Payment Status: ✓ Confirmed
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-semibold">Estimated Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    {getEstimatedDelivery()}
                  </p>
                </div>

                <div className="space-y-2 pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDownloadInvoice}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleReorder}
                    disabled={reordering}
                  >
                    {reordering ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="mr-2 h-4 w-4" />
                    )}
                    Reorder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
