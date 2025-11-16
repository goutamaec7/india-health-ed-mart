import { useEffect, useState } from "react";
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  Address,
} from "@/lib/api/addresses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddressForm } from "@/components/checkout/AddressForm";
import { Loader2, MapPin, Star, Edit2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export function DashboardAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await getUserAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Failed to load addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (address: Address) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, {
          full_name: address.full_name,
          phone: address.phone,
          address_line1: address.address_line1,
          address_line2: address.address_line2,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          is_default_shipping: address.is_default_shipping,
        });
        toast.success("Address updated successfully");
        setEditingAddress(null);
      } else {
        toast.success("Address added successfully");
      }
      await loadAddresses();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error("Failed to save address");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      toast.success("Address deleted");
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saved Addresses</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingAddress ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Editing address for: {editingAddress.full_name}
                </p>
                <div className="space-y-2">
                  <Label>Current Address</Label>
                  <p className="text-sm">
                    {editingAddress.address_line1}, {editingAddress.city}, {editingAddress.state} {editingAddress.postal_code}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingAddress(null);
                    }}
                  >
                    Cancel Edit
                  </Button>
                  <Button onClick={() => toast.info("Please use the edit button on the address card to modify details")}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <AddressForm
                onSuccess={handleSaveAddress}
                onCancel={() => {
                  setShowForm(false);
                  setEditingAddress(null);
                }}
              />
            )}
          </CardContent>
        </Card>
      )}

      {addresses.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No addresses saved</h3>
            <p className="text-muted-foreground mb-6">
              Add your first address to make checkout faster
            </p>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>Add Address</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {address.is_default_shipping && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(address.id)}
                      disabled={deletingId === address.id}
                    >
                      {deletingId === address.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{address.full_name}</p>
                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {address.address_line1}
                    {address.address_line2 && `, ${address.address_line2}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  {address.is_default_shipping && (
                    <p className="text-xs text-primary mt-2 font-medium">
                      Default Shipping Address
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
