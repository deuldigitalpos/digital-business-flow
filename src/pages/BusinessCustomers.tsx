
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import BusinessCustomerManager from '@/components/business/BusinessCustomerManager';

const BusinessCustomers = () => {
  const { business, isLoading, hasPermission, isDefaultUser } = useBusinessAuth();
  
  // Simple error boundary state
  const [hasError, setHasError] = React.useState(false);
  
  // Reset error state on mount
  useEffect(() => {
    setHasError(false);
  }, []);
  
  // Error boundary wrapper
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="text-red-500 text-lg font-medium">
          Something went wrong loading the customers page.
        </div>
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          onClick={() => {
            setHasError(false);
            window.location.reload();
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading business customers...</span>
      </div>
    );
  }
  
  // Check for view permission but still show the page with limited content
  const canViewCustomers = isDefaultUser || hasPermission('customers');
  
  if (!canViewCustomers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-orange-500" />
            Limited Access
          </CardTitle>
          <CardDescription>
            You have limited permissions for the Customers section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don't have permission to manage customers.
            Contact your administrator for access.
          </p>
          
          {business && (
            <div className="mt-6 p-4 bg-muted/30 rounded-md">
              <h3 className="font-medium text-lg">{business.business_name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {business.country} • {business.currency}
              </p>
              {business.contact_number && (
                <p className="text-sm mt-2">Contact: {business.contact_number}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // User has full access
  return <BusinessCustomerManager business={business} />;
};

export default BusinessCustomers;
