
import React from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Wallet, 
  ChevronUpRight, 
  ChevronDownRight 
} from 'lucide-react';
import { isBusinessActive } from '@/utils/business';

const BusinessDashboard = () => {
  const { businessUser, business } = useBusinessAuth();

  const isActive = business ? isBusinessActive(business) : false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to {business?.business_name || 'Your Business'}!
        </h1>
        <p className="text-muted-foreground">
          Hello, {businessUser?.first_name} {businessUser?.last_name}. Here's your business dashboard.
        </p>
        {!isActive && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <p className="text-sm">
              Your business account is currently inactive. Please contact system administrator to activate it.
            </p>
          </div>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,435.00</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ChevronUpRight className="h-3 w-3 mr-0.5" />
                12%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$13,120.00</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ChevronUpRight className="h-3 w-3 mr-0.5" />
                4%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">134</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ChevronUpRight className="h-3 w-3 mr-0.5" />
                8%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$6,240.00</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-red-500 flex items-center mr-1">
                <ChevronDownRight className="h-3 w-3 mr-0.5" />
                3%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest sales orders placed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center py-8 text-muted-foreground">
              No recent orders to display
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
            <CardDescription>Products that need reordering</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center py-8 text-muted-foreground">
              No low stock items to display
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest system activity</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-center py-4 text-muted-foreground">
            No recent activities to display
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessDashboard;
