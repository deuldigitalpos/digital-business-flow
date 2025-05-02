
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import useBusinessBrands from "@/hooks/useBusinessBrands";

interface ProductsFiltersProps {
  onFilterChange: (filters: Record<string, any>) => void;
}

const ProductsFilters: React.FC<ProductsFiltersProps> = ({ onFilterChange }) => {
  const { categories } = useBusinessCategories();
  const { brands } = useBusinessBrands();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");

  const handleApplyFilters = () => {
    const filters: Record<string, any> = {};
    
    if (search) {
      filters.search = search;
    }
    
    if (categoryId) {
      filters.category_id = categoryId;
    }
    
    if (brandId) {
      filters.brand_id = brandId;
    }
    
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategoryId("");
    setBrandId("");
    onFilterChange({});
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="space-y-1 flex-1">
            <label htmlFor="search" className="text-sm font-medium">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search products..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-[180px] space-y-1">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-[180px] space-y-1">
            <label htmlFor="brand" className="text-sm font-medium">
              Brand
            </label>
            <Select value={brandId} onValueChange={setBrandId}>
              <SelectTrigger id="brand">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetFilters}>
              <X className="h-4 w-4 mr-1" /> Reset
            </Button>
            <Button onClick={handleApplyFilters}>
              <Search className="h-4 w-4 mr-1" /> Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsFilters;
