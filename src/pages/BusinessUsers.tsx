
import React, { useEffect } from 'react';
import BusinessUserManager from '@/components/business/BusinessUserManager';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Loader2 } from 'lucide-react';

const BusinessUsers = () => {
  const { business, isLoading } = useBusinessAuth();
  
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
  
  return <BusinessUserManager business={business} />;
};

export default BusinessUsers;
