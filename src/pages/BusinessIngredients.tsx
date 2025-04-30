
import React from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import PermissionDenied from './PermissionDenied';
import PlaceholderPage from '@/components/PlaceholderPage';

const BusinessIngredients: React.FC = () => {
  const { hasPermission } = useBusinessAuth();
  const hasAccess = hasPermission('ingredients');

  if (!hasAccess) {
    return <PermissionDenied />;
  }

  return <PlaceholderPage title="Ingredients" />;
};

export default BusinessIngredients;
