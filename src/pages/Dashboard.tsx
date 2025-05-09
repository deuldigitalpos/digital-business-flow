
import React from 'react';
import AdminDashboardSummary from '@/components/admin/AdminDashboardSummary';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to DeulDigital POS admin panel</p>
      </div>
      
      <AdminDashboardSummary />
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-l-secondary">
          <h2 className="text-lg font-medium mb-4 text-primary">Recent Businesses</h2>
          <p className="text-muted-foreground">Feature coming soon...</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-l-secondary">
          <h2 className="text-lg font-medium mb-4 text-primary">Recent Business Users</h2>
          <p className="text-muted-foreground">Feature coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
