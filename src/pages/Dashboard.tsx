
import React from 'react';
import AdminDashboardSummary from '@/components/admin/AdminDashboardSummary';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <AdminDashboardSummary />
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Recent Businesses</h2>
          <p className="text-muted-foreground">Feature coming soon...</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Recent Business Users</h2>
          <p className="text-muted-foreground">Feature coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
