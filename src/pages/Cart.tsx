import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getCartItems } from "@/lib/api/cart";
import { transformCartItems } from "@/lib/api/cartUtils";
import { toast } from "sonner";
import type { CartItemWithProduct } from "@/lib/api/cartUtils";

const Cart = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error('Please login to view your cart');
      navigate('/login');
      return;
    }

    loadCart();
  }, [user, authLoading, navigate]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const items = await getCartItems();
      const transformed = transformCartItems(items);
      setCartItems(transformed);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return cartItems.reduce((sum, item) => {
      const itemTotal = item.product.price * item.quantity;
      const taxAmount = (itemTotal * item.product.gst_rate) / 100;
      return sum + taxAmount;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading cart...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <EmptyCart />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/products')}
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Continue Shopping
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Your Shopping Cart
            </h1>
            <p className="text-muted-foreground mt-2">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Cart Content */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Cart Items */}
            <div className="space-y-4">
              {/* Desktop Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b text-sm font-medium text-muted-foreground">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
                <div className="col-span-1"></div>
              </div>

              {/* Cart Items */}
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <CartSummary
                subtotal={calculateSubtotal()}
                tax={calculateTax()}
                total={calculateTotal()}
                items={cartItems}
                onCheckout={() => {
                  // TODO: Implement checkout
                  toast.success('Checkout functionality coming soon!');
                }}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
