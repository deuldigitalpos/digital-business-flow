
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.username}!</h1>
        <p className="text-muted-foreground">
          This is the DeulDigital POS admin dashboard. Manage your business operations from here.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Your sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Sales statistics will appear here</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Stock levels overview</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Inventory statistics will appear here</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payments Due</CardTitle>
            <CardDescription>Outstanding payment summary</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Payment information will appear here</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activity</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center py-4">No recent activities to display</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
