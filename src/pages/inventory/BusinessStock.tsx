
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PermissionGuard from "@/components/business/PermissionGuard";
import StockSummary from "@/components/business-inventory/StockSummary";
import StockTable from "@/components/business-inventory/StockTable";
import StockFilters from "@/components/business-inventory/StockFilters";
import AddStockTransactionModal from "@/components/business-inventory/AddStockTransactionModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useBusinessStockTransactions } from "@/hooks/useBusinessStockTransactions";

const BusinessStock: React.FC = () => {
  const [filters, setFilters] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { refetch } = useBusinessStockTransactions(filters);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    refetch();
  };

  return (
    <PermissionGuard permission="stock">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
            <p className="text-muted-foreground">
              Track and manage your inventory stock levels
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Stock Transaction
          </Button>
        </div>

        <StockSummary />

        <StockFilters onFilterChange={handleFilterChange} />

        <Card>
          <CardContent className="pt-6">
            <StockTable />
          </CardContent>
        </Card>
        
        <AddStockTransactionModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </PermissionGuard>
  );
};

export default BusinessStock;
