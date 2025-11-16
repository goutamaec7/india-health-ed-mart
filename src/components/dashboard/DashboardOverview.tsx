import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders, Order } from "@/lib/api/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ShoppingBag, Package, Calendar, ArrowRight } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardOverview() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const accountSince = user?.created_at
    ? format(new Date(user.created_at), "MMMM yyyy")
    : "Recently";
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountSince}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading orders...</p>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Button onClick={() => navigate("/products")}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="space-y-1">
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <OrderStatusBadge status={order.status} />
                    <p className="font-semibold">₹{order.total_amount.toFixed(2)}</p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/orders")}
              >
                View All Orders
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button
          variant="outline"
          className="h-24"
          onClick={() => navigate("/products")}
        >
          <div className="text-center">
            <ShoppingBag className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Browse Products</p>
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-24"
          onClick={() => navigate("/orders")}
        >
          <div className="text-center">
            <Package className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">My Orders</p>
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-24"
          onClick={() => navigate("/cart")}
        >
          <div className="text-center">
            <ShoppingBag className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">View Cart</p>
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-24"
          onClick={() => {
            const tabElement = document.querySelector('[value="settings"]');
            if (tabElement instanceof HTMLElement) {
              tabElement.click();
            }
          }}
        >
          <div className="text-center">
            <Calendar className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Settings</p>
          </div>
        </Button>
      </div>
    </div>
  );
}
