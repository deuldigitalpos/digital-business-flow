
import React from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

const BusinessLogo = () => {
  const { business } = useBusinessAuth();
  
  return (
    <div className="flex-1 flex items-center gap-2">
      {business?.logo_url ? (
        <img 
          src={business.logo_url}
          alt={business.business_name}
          className="h-6 sm:h-8 w-auto"
        />
      ) : (
        <img 
          src="/lovable-uploads/1df1545d-8aea-4a95-8a04-a342cff67de7.png" 
          alt="DeulDigital Logo"
          className="h-6 sm:h-8 w-auto"
        />
      )}
      <span className="font-semibold text-base sm:text-lg text-primary hidden sm:inline">
        {business?.business_name || 'Business Dashboard'}
      </span>
    </div>
  );
};

export default BusinessLogo;
