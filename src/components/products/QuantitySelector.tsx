import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

export const QuantitySelector = ({ 
  quantity, 
  maxQuantity, 
  onQuantityChange 
}: QuantitySelectorProps) => {
  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      onQuantityChange(value);
    } else if (e.target.value === '') {
      onQuantityChange(1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className="h-10 w-10"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <Input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={1}
        max={maxQuantity}
        className="w-20 text-center"
      />
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={quantity >= maxQuantity}
        className="h-10 w-10"
      >
        <Plus className="h-4 w-4" />
      </Button>
      
      <span className="text-sm text-muted-foreground ml-2">
        (Max: {maxQuantity})
      </span>
    </div>
  );
};
