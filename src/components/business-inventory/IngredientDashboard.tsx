
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, CircleDollarSign, AlertTriangle } from 'lucide-react';
import { useBusinessIngredients } from '@/hooks/useBusinessIngredients';

const IngredientDashboard = () => {
  const { ingredients, isLoading } = useBusinessIngredients();

  const getTotalIngredients = () => ingredients?.length || 0;
  
  const getTotalValue = () => {
    if (!ingredients) return 0;
    return ingredients.reduce((acc, item) => acc + (item.total_value || 0), 0);
  };
  
  const getOutOfStockCount = () => {
    if (!ingredients) return 0;
    return ingredients.filter(item => (item.quantity || 0) <= 0).length;
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-white border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-primary">Total Ingredients</CardTitle>
          <Database className="w-4 h-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse bg-orange-100 rounded"></div>
            ) : (
              getTotalIngredients()
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Unique raw ingredient items
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-primary">Total Value</CardTitle>
          <CircleDollarSign className="w-4 h-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {isLoading ? (
              <div className="h-8 w-24 animate-pulse bg-orange-100 rounded"></div>
            ) : (
              `$${getTotalValue().toFixed(2)}`
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Total value of available ingredients
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-primary">Out of Stock</CardTitle>
          <AlertTriangle className="w-4 h-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse bg-orange-100 rounded"></div>
            ) : (
              getOutOfStockCount()
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Ingredients with zero quantity
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IngredientDashboard;
