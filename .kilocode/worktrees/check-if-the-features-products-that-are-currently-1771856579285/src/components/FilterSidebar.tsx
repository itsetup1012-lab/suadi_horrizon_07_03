import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { getProducts, Product } from '@/api/products';
import { CompatibilityFilter, AvailabilityFilter, AvailabilityStatus } from './filters';
import type { Equipment } from '@/lib/equipment';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  selectedEquipment?: Equipment | null;
  onEquipmentChange?: () => void;
  onEquipmentClear?: () => void;
  onAvailabilityChange?: (status: AvailabilityStatus) => void;
  availabilityStatus?: AvailabilityStatus;
}

export interface FilterState {
  brands: string[];
  categories: string[];
  priceRange: [number, number];
  search: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  selectedEquipment,
  onEquipmentChange,
  onEquipmentClear,
  onAvailabilityChange,
  availabilityStatus = 'all',
}) => {
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [productCounts, setProductCounts] = useState<{ brands: Record<string, number>, categories: Record<string, number> }>({ brands: {}, categories: {} });



  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const res = await getProducts({ limit: 1000 });
        const products = res.products;

        // Get unique brands with counts
        const brandCounts: Record<string, number> = {};
        const categoryCounts: Record<string, number> = {};
        const brands = new Set<string>();
        const categories = new Set<string>();

        products.forEach(p => {
          if (p.brand) {
            brands.add(p.brand);
            brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
          }
          if (p.category) {
            categories.add(p.category);
            categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
          }
        });

        setAvailableBrands([...brands].sort());
        setAvailableCategories([...categories].sort());
        setProductCounts({ brands: brandCounts, categories: categoryCounts });
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter((b) => b !== brand);

    onFilterChange({ ...filters, brands: newBrands });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);

    onFilterChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: [value[0], value[1]] as [number, number] });
  };

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleClearFilters = () => {
    onFilterChange({ brands: [], categories: [], priceRange: [0, 5000], search: '' });
  };

  return (
    <div className="space-y-4">
      <Card className="glass border-0 shadow-2xl">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-xl font-display font-bold text-gold tracking-wide">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-slate-300 font-medium">Search</Label>
            <Input
              id="search"
              placeholder="Search by name, SKU..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="text-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-gold/50 focus:ring-gold/20"
            />
          </div>

          {/* Advanced Filters Divider */}
          {(onEquipmentChange || onAvailabilityChange) && (
            <div className="border-t border-white/10 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-gold font-display uppercase tracking-wider">Advanced Filters</h3>

              {/* Equipment Compatibility Filter */}
              {onEquipmentChange && onEquipmentClear && (
                <CompatibilityFilter
                  selectedEquipment={selectedEquipment}
                  onClear={onEquipmentClear}
                  onChangeEquipment={onEquipmentChange}
                  compatibleOnly={false}
                  onCompatibleOnlyChange={() => { }}
                />
              )}

              {/* Availability Filter */}
              {onAvailabilityChange && (
                <AvailabilityFilter
                  selectedStatus={availabilityStatus}
                  onStatusChange={onAvailabilityChange}
                />
              )}
            </div>
          )}

          {/* Price Range */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full font-bold text-white hover:text-gold transition-colors font-display">
              Price Range
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              <Slider
                value={[filters.priceRange[0], filters.priceRange[1]]}
                onValueChange={handlePriceChange}
                min={0}
                max={5000}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Categories */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full font-bold text-white hover:text-gold transition-colors font-display">
              Categories ({availableCategories.length})
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-2 max-h-48 overflow-y-auto">
              {availableCategories.length > 0 ? (
                availableCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category, checked as boolean)
                      }
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer flex-1">
                      {category}
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      ({productCounts.categories[category] || 0})
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Loading categories...</p>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Brands */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full font-bold text-white hover:text-gold transition-colors font-display">
              Brands ({availableBrands.length})
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-2 max-h-48 overflow-y-auto">
              {availableBrands.length > 0 ? (
                availableBrands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={filters.brands.includes(brand)}
                      onCheckedChange={(checked) =>
                        handleBrandChange(brand, checked as boolean)
                      }
                    />
                    <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer flex-1">
                      {brand}
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      ({productCounts.brands[brand] || 0})
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Loading brands...</p>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Active Filters Summary */}
          {(filters.brands.length > 0 || filters.categories.length > 0) && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                {filters.brands.length + filters.categories.length} filter(s) active
              </p>
            </div>
          )}

          {/* Clear Filters */}
          <Button
            variant="outline"
            className="w-full glass border-white/10 hover:bg-white/10 hover:text-white transition-all text-slate-300"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
