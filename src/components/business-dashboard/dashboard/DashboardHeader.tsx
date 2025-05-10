
import React from 'react';

interface DashboardHeaderProps {
  businessName: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  isActive: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  businessName, 
  firstName, 
  lastName, 
  isActive 
}) => {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        Welcome to {businessName || 'Your Business'}!
      </h1>
      <p className="text-muted-foreground">
        Hello, {firstName} {lastName}. Here's your business dashboard.
      </p>
      {!isActive && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <p className="text-sm">
            Your business account is currently inactive. Please contact system administrator to activate it.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
