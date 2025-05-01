
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, CircleDollarSign, AlertTriangle } from 'lucide-react';
import { useBusinessConsumables, BusinessConsumable } from '@/hooks/useBusinessConsumables';

const ConsumableDashboard = () => {
  const { consumables, isLoading } = useBusinessConsumables();

  const getTotalConsumables = () => consumables?.length || 0;
  
  const getTotalValue = () => {
    if (!consumables) return 0;
    return consumables.reduce((acc, item) => acc + (item.total_value || 0), 0);
  };
  
  const getOutOfStockCount = () => {
    if (!consumables) return 0;
    return consumables.filter(item => (item.quantity || 0) <= 0).length;
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Consumables</CardTitle>
          <Database className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse bg-slate-200 rounded"></div>
            ) : (
              getTotalConsumables()
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Unique consumable items
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <CircleDollarSign className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-24 animate-pulse bg-slate-200 rounded"></div>
            ) : (
              `$${getTotalValue().toFixed(2)}`
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Total value of available consumables
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          <AlertTriangle className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse bg-slate-200 rounded"></div>
            ) : (
              getOutOfStockCount()
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Consumables with zero quantity
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumableDashboard;
