
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const RecentActivityCards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Recent Orders</CardTitle>
          <CardDescription>Latest sales orders placed</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-center py-6 sm:py-8 text-muted-foreground">
            No recent orders to display
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Low Stock Items</CardTitle>
          <CardDescription>Products that need reordering</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-center py-6 sm:py-8 text-muted-foreground">
            No low stock items to display
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivityCards;
