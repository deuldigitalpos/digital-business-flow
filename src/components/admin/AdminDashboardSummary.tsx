
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AdminDashboardSummary = () => {
  // Query to fetch the count of businesses
  const businessQuery = useQuery({
    queryKey: ['business-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('businessdetails')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching business count:', error);
        throw error;
      }
      
      return count || 0;
    },
  });

  // Query to fetch the count of business users
  const usersQuery = useQuery({
    queryKey: ['business-users-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('business_users')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching business users count:', error);
        throw error;
      }
      
      return count || 0;
    },
  });

  const isLoading = businessQuery.isLoading || usersQuery.isLoading;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {/* Businesses Count Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse h-9 bg-muted rounded" />
          ) : (
            <div className="text-2xl font-bold">{businessQuery.data}</div>
          )}
          <p className="text-xs text-muted-foreground">Registered businesses</p>
        </CardContent>
      </Card>

      {/* Business Users Count Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Business Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse h-9 bg-muted rounded" />
          ) : (
            <div className="text-2xl font-bold">{usersQuery.data}</div>
          )}
          <p className="text-xs text-muted-foreground">All business users combined</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardSummary;
