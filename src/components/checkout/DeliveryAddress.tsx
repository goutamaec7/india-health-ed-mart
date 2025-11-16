import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";
import { getUserAddresses, getDefaultAddress } from "@/lib/api/addresses";
import { toast } from "sonner";
import type { Address } from "@/lib/api/addresses";
import { Plus } from "lucide-react";

interface DeliveryAddressProps {
  onComplete: (address: Address) => void;
  initialAddress: Address | null;
}

export const DeliveryAddress = ({ onComplete, initialAddress }: DeliveryAddressProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(initialAddress);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const userAddresses = await getUserAddresses();
      setAddresses(userAddresses);

      if (!selectedAddress && userAddresses.length > 0) {
        const defaultAddr = await getDefaultAddress();
        setSelectedAddress(defaultAddr || userAddresses[0]);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressAdded = (newAddress: Address) => {
    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    setShowAddressForm(false);
    toast.success('Address saved successfully');
  };

  const handleContinue = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    onComplete(selectedAddress);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading addresses...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Where should we deliver?</h1>
        <p className="text-muted-foreground mt-2">Select or add a delivery address</p>
      </div>

      {addresses.length > 0 && !showAddressForm && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Addresses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isSelected={selectedAddress?.id === address.id}
                onSelect={() => setSelectedAddress(address)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {showAddressForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressForm
              onSuccess={handleAddressAdded}
              onCancel={() => setShowAddressForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowAddressForm(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      )}

      <Button
        size="lg"
        onClick={handleContinue}
        disabled={!selectedAddress}
        className="w-full"
      >
        Next: Payment Method
      </Button>
    </div>
  );
};
