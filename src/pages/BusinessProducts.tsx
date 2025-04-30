
import React from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import PermissionDenied from './PermissionDenied';
import PlaceholderPage from '@/components/PlaceholderPage';

const BusinessProducts: React.FC = () => {
  const { hasPermission } = useBusinessAuth();
  const hasAccess = hasPermission('products');

  if (!hasAccess) {
    return <PermissionDenied />;
  }

  return <PlaceholderPage title="Products" />;
};

export default BusinessProducts;
