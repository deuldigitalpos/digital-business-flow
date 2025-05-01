
import React from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SupplierManager from '@/components/business/SupplierManager';

const BusinessSuppliers = () => {
  const { business, isLoading, hasPermission, isDefaultUser } = useBusinessAuth();
  
  // Simple error boundary state
  const [hasError, setHasError] = React.useState(false);
  
  // Reset error state on mount
  React.useEffect(() => {
    setHasError(false);
  }, []);
  
  // Error boundary wrapper
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="text-red-500 text-lg font-medium">
          Something went wrong loading the suppliers page.
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
        <span className="ml-2 text-lg">Loading business suppliers...</span>
      </div>
    );
  }
  
  // Check for view permission but still show the page with limited content
  const canViewSuppliers = isDefaultUser || hasPermission('suppliers');
  
  if (!canViewSuppliers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-orange-500" />
            Limited Access
          </CardTitle>
          <CardDescription>
            You have limited permissions for the Suppliers section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don't have permission to manage suppliers.
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
  
  // User has full access - remove the business prop since it's not needed
  return <SupplierManager />;
};

export default BusinessSuppliers;
