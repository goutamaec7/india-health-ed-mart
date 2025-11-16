import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProgressIndicator } from "@/components/checkout/ProgressIndicator";
import { DeliveryAddress } from "@/components/checkout/DeliveryAddress";
import { PaymentMethod } from "@/components/checkout/PaymentMethod";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { useAuth } from "@/contexts/AuthContext";
import { getCartItems } from "@/lib/api/cart";
import { transformCartItems } from "@/lib/api/cartUtils";
import { toast } from "sonner";
import type { CartItemWithProduct } from "@/lib/api/cartUtils";
import type { Address } from "@/lib/api/addresses";

export type CheckoutStep = 1 | 2 | 3;

const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error('Please login to proceed with checkout');
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
      
      if (transformed.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }
      
      setCartItems(transformed);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
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

  const handleAddressComplete = (address: Address) => {
    setSelectedAddress(address);
    setCurrentStep(2);
  };

  const handlePaymentComplete = (method: string, orderIdResult: string) => {
    setPaymentMethod(method);
    setOrderId(orderIdResult);
    setCurrentStep(3);
  };

  const handleBackToAddress = () => {
    setCurrentStep(1);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading checkout...</div>
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
          <ProgressIndicator currentStep={currentStep} />

          <div className="grid lg:grid-cols-[1fr_400px] gap-8 mt-8">
            <div>
              {currentStep === 1 && (
                <DeliveryAddress
                  onComplete={handleAddressComplete}
                  initialAddress={selectedAddress}
                />
              )}
              
              {currentStep === 2 && selectedAddress && (
                <PaymentMethod
                  address={selectedAddress}
                  cartItems={cartItems}
                  subtotal={calculateSubtotal()}
                  tax={calculateTax()}
                  total={calculateTotal()}
                  onComplete={handlePaymentComplete}
                  onBack={handleBackToAddress}
                />
              )}
              
              {currentStep === 3 && orderId && (
                <OrderConfirmation
                  orderId={orderId}
                  paymentMethod={paymentMethod}
                />
              )}
            </div>

            {currentStep !== 3 && (
              <div className="lg:sticky lg:top-24 lg:self-start">
                <CheckoutSummary
                  items={cartItems}
                  subtotal={calculateSubtotal()}
                  tax={calculateTax()}
                  total={calculateTotal()}
                  deliveryAddress={selectedAddress}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
