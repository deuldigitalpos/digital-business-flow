
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import PermissionGuard from "@/components/business/PermissionGuard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductsSummary from "@/components/business-inventory/ProductsSummary";
import ProductsFilters from "@/components/business-inventory/ProductsFilters";
import ProductsTable from "@/components/business-inventory/ProductsTable";
import AddProductModal from "@/components/business-inventory/AddProductModal";

const BusinessProducts: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  return (
    <PermissionGuard permission="products">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
            <p className="text-muted-foreground">
              Manage your product catalog, ingredients, consumables, and pricing
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        <ProductsSummary />

        <ProductsFilters onFilterChange={handleFilterChange} />

        <Card>
          <CardContent className="pt-6">
            <ProductsTable filters={filters} />
          </CardContent>
        </Card>
        
        <AddProductModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </PermissionGuard>
  );
};

export default BusinessProducts;
