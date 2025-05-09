
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import POSLayout from '@/components/business-dashboard/pos/POSLayout';

const POSPage: React.FC = () => {
  const { businessUser, hasPermission } = useBusinessAuth();
  
  // Check if user is authenticated and has POS permissions
  if (!businessUser) {
    return <Navigate to="/business-login" replace />;
  }
  
  if (!hasPermission('pos')) {
    return <Navigate to="/business-dashboard/no-permission" replace />;
  }
  
  return <POSLayout />;
};

export default POSPage;
