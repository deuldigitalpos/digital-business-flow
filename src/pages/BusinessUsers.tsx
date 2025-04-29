
import React, { useEffect } from 'react';
import BusinessUserManager from '@/components/business/BusinessUserManager';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BusinessUsers = () => {
  const { business, isLoading, hasPermission } = useBusinessAuth();
  const { toast } = useToast();
  
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
          Something went wrong loading the users page.
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
        <span className="ml-2 text-lg">Loading business users...</span>
      </div>
    );
  }
  
  // Check for view permission but still show the page with limited content
  const canViewUsers = hasPermission('users');
  
  if (!canViewUsers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-orange-500" />
            Limited Access
          </CardTitle>
          <CardDescription>
            You have limited permissions for the Users section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You can view business details, but you don't have permission to manage users.
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
              {business.website && (
                <p className="text-sm mt-1">
                  <a 
                    href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {business.website}
                  </a>
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // User has full access
  return <BusinessUserManager business={business} />;
};

export default BusinessUsers;
