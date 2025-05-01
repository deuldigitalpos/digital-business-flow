
import React from 'react';
import { useBusinessInventorySummary } from '@/hooks/useBusinessInventorySummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChartContainer, 
  ChartLegendContent, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartTooltip 
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const StockSummary: React.FC = () => {
  const { summary, isLoading } = useBusinessInventorySummary();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20 mb-2" />
              <Skeleton className="h-4 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Prepare chart data
  const chartData = [
    { name: 'Products', value: summary?.totalProducts || 0, color: COLORS[0] },
    { name: 'Consumables', value: summary?.totalConsumables || 0, color: COLORS[1] },
    { name: 'Ingredients', value: summary?.totalIngredients || 0, color: COLORS[2] },
    { name: 'Add-ons', value: summary?.totalAddons || 0, color: COLORS[3] },
  ];
  
  const chartConfig = {
    products: { 
      label: 'Products',
      theme: { light: COLORS[0], dark: COLORS[0] }
    },
    consumables: { 
      label: 'Consumables',
      theme: { light: COLORS[1], dark: COLORS[1] }
    },
    ingredients: { 
      label: 'Ingredients',
      theme: { light: COLORS[2], dark: COLORS[2] }
    },
    addons: { 
      label: 'Add-ons',
      theme: { light: COLORS[3], dark: COLORS[3] }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary?.totalValue.toFixed(2) || '0.00'}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary?.totalItems || 0} items in inventory
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.lowStockItems || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Items below minimum level
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.recentTransactions || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">
            In the last 30 days
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Inventory Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ChartContainer config={chartConfig}>
              {/* Wrap multiple chart elements in a single React fragment */}
              <>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
                <ChartLegend content={<ChartLegendContent />} />
              </>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockSummary;
