import { Card, CardContent } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Address } from "@/lib/api/addresses";
import { MapPin } from "lucide-react";

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
}

export const AddressCard = ({ address, isSelected, onSelect }: AddressCardProps) => {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <RadioGroupItem value={address.id} checked={isSelected} className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Label className="font-semibold text-base cursor-pointer">
                {address.full_name}
              </Label>
              {address.is_default_shipping && (
                <Badge variant="secondary" className="text-xs">Default</Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{address.address_line1}</p>
              {address.address_line2 && <p>{address.address_line2}</p>}
              <p>{address.city}, {address.state} - {address.postal_code}</p>
              <p className="font-medium text-foreground mt-2">Phone: {address.phone}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
