
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, BarChart } from 'lucide-react';
import useBusinessAddons from '@/hooks/useBusinessAddons';
import { BusinessAddon } from '@/types/business-addon'; // Import from types file instead

interface AddonMetricsProps {
  addons: BusinessAddon[];
  isLoading: boolean;
}

export const AddonDashboard: React.FC<AddonMetricsProps> = ({ addons, isLoading }) => {
  // Calculate metrics
  const totalAddons = addons.length;
  const totalQuantity = addons.reduce((sum, addon) => sum + (addon.quantity || 0), 0);
  const totalValue = addons.reduce((sum, addon) => sum + (addon.total_value || 0), 0);
  
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Add-ons</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAddons}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuantity.toFixed(0)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddonDashboard;
