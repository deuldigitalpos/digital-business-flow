
import React from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import PermissionDenied from './PermissionDenied';
import IngredientManager from '@/components/business/IngredientManager';

const BusinessIngredients: React.FC = () => {
  const { hasPermission } = useBusinessAuth();
  const hasAccess = hasPermission('ingredients');

  if (!hasAccess) {
    return <PermissionDenied />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ingredients</h1>
        <p className="text-muted-foreground">
          Manage your raw ingredients and track inventory levels
        </p>
      </div>
      
      <IngredientManager />
    </div>
  );
};

export default BusinessIngredients;
