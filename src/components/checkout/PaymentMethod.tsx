import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createOrder } from "@/lib/api/orders";
import { createPayment, updatePaymentStatus } from "@/lib/api/payments";
import { clearCart } from "@/lib/api/cart";
import type { Address } from "@/lib/api/addresses";
import type { CartItemWithProduct } from "@/lib/api/cartUtils";
import { CreditCard, Smartphone, Building2, Wallet, ShieldCheck, ChevronLeft } from "lucide-react";

interface PaymentMethodProps {
  address: Address;
  cartItems: CartItemWithProduct[];
  subtotal: number;
  tax: number;
  total: number;
  onComplete: (method: string, orderId: string) => void;
  onBack: () => void;
}

export const PaymentMethod = ({
  address,
  cartItems,
  subtotal,
  tax,
  total,
  onComplete,
  onBack,
}: PaymentMethodProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: "card", label: "Credit or Debit Card", icon: CreditCard },
    { id: "upi", label: "UPI (Google Pay, PhonePe, etc.)", icon: Smartphone },
    { id: "netbanking", label: "Net Banking", icon: Building2 },
    { id: "wallet", label: "Digital Wallet", icon: Wallet },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setLoading(true);
    try {
      // Create order
      const order = await createOrder({
        cartItems,
        deliveryAddressId: address.id,
        subtotal,
        taxAmount: tax,
        totalAmount: total,
      });

      // Create payment record
      const payment = await createPayment(order.id, total);

      // Simulate Razorpay payment
      // In production, integrate actual Razorpay SDK
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update payment status
      await updatePaymentStatus(
        payment.id,
        'success',
        `TXN${Date.now()}`,
        { method: selectedMethod }
      );

      // Clear cart
      await clearCart();

      toast.success("Payment successful!");
      onComplete(selectedMethod, order.id);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Address
        </Button>
        
        <h1 className="text-3xl font-bold text-foreground">Payment Method</h1>
        <p className="text-muted-foreground mt-2">Choose how you'd like to pay</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={method.id} />
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <Label className="flex-1 cursor-pointer font-medium">
                          {method.label}
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">Your payment is secure</p>
              <p className="text-muted-foreground text-xs">
                Encrypted and PCI DSS compliant
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        onClick={handlePayment}
        disabled={!selectedMethod || loading}
        className="w-full"
      >
        {loading ? "Processing Payment..." : `Pay ₹${total.toLocaleString()}`}
      </Button>
    </div>
  );
};
