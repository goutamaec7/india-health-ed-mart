import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type { Filters, Product } from "@/pages/Products";

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  products: Product[];
}

const categorySubcategories = {
  healthcare: ['Diagnostics', 'Surgical Instruments', 'Medical Devices', 'Consumables'],
  educational: ['Physics Lab', 'Chemistry Lab', 'Biology Lab', 'General Equipment'],
};

const certifications = [
  'ISO 9001',
  'ISO 13485',
  'CDSCO',
  'Educational Approved',
  'none'
];

export const FilterSidebar = ({ filters, onFilterChange, products }: FilterSidebarProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['healthcare', 'educational']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    onFilterChange({ categories: newCategories });
  };

  const handleSubcategoryChange = (subcategory: string, checked: boolean) => {
    const newSubcategories = checked
      ? [...filters.subcategories, subcategory]
      : filters.subcategories.filter(s => s !== subcategory);
    onFilterChange({ subcategories: newSubcategories });
  };

  const handleCertificationChange = (cert: string, checked: boolean) => {
    const newCerts = checked
      ? [...filters.certifications, cert]
      : filters.certifications.filter(c => c !== cert);
    onFilterChange({ certifications: newCerts });
  };

  const handleStockStatusChange = (status: string, checked: boolean) => {
    const newStatus = checked
      ? [...filters.stockStatus, status]
      : filters.stockStatus.filter(s => s !== status);
    onFilterChange({ stockStatus: newStatus });
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ priceRange: [value[0], value[1]] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Filters</h3>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground">Category</h4>
        
        {Object.entries(categorySubcategories).map(([category, subcats]) => (
          <Collapsible
            key={category}
            open={expandedCategories.includes(category)}
            onOpenChange={() => toggleCategory(category)}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`cat-${category}`}
                    className="text-sm font-normal cursor-pointer capitalize"
                  >
                    {category}
                  </Label>
                </div>
                <CollapsibleTrigger asChild>
                  <button className="p-1 hover:bg-accent rounded">
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${
                        expandedCategories.includes(category) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="ml-6 space-y-2">
                {subcats.map(subcat => (
                  <div key={subcat} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subcat-${subcat}`}
                      checked={filters.subcategories.includes(subcat)}
                      onCheckedChange={(checked) =>
                        handleSubcategoryChange(subcat, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`subcat-${subcat}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {subcat}
                    </Label>
                  </div>
                ))}
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">Price Range</h4>
        <div className="px-2">
          <Slider
            min={0}
            max={100000}
            step={1000}
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>₹{filters.priceRange[0].toLocaleString()}</span>
            <span>₹{filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground">Certifications</h4>
        {certifications.map(cert => (
          <div key={cert} className="flex items-center space-x-2">
            <Checkbox
              id={`cert-${cert}`}
              checked={filters.certifications.includes(cert)}
              onCheckedChange={(checked) =>
                handleCertificationChange(cert, checked as boolean)
              }
            />
            <Label
              htmlFor={`cert-${cert}`}
              className="text-sm font-normal cursor-pointer"
            >
              {cert === 'none' ? 'Show All' : cert}
            </Label>
          </div>
        ))}
      </div>

      {/* Stock Status */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground">Stock Status</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="stock-in"
            checked={filters.stockStatus.includes('in-stock')}
            onCheckedChange={(checked) =>
              handleStockStatusChange('in-stock', checked as boolean)
            }
          />
          <Label htmlFor="stock-in" className="text-sm font-normal cursor-pointer">
            In Stock
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="stock-low"
            checked={filters.stockStatus.includes('low-stock')}
            onCheckedChange={(checked) =>
              handleStockStatusChange('low-stock', checked as boolean)
            }
          />
          <Label htmlFor="stock-low" className="text-sm font-normal cursor-pointer">
            Low Stock
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="stock-out"
            checked={filters.stockStatus.includes('out-of-stock')}
            onCheckedChange={(checked) =>
              handleStockStatusChange('out-of-stock', checked as boolean)
            }
          />
          <Label htmlFor="stock-out" className="text-sm font-normal cursor-pointer">
            Out of Stock
          </Label>
        </div>
      </div>
    </div>
  );
};
