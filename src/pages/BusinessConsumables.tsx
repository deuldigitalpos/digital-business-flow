
import React, { useState } from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import PermissionGuard from '@/components/business/PermissionGuard';
import ConsumableManager from '@/components/business/ConsumableManager';
import PermissionDenied from './PermissionDenied';

const BusinessConsumables: React.FC = () => {
  const { hasPermission } = useBusinessAuth();
  const hasAccess = hasPermission('consumables');

  if (!hasAccess) {
    return <PermissionDenied />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consumables</h1>
        <p className="text-muted-foreground">
          Manage your consumable items such as packaging, napkins, and other supplies
        </p>
      </div>
      
      <ConsumableManager />
    </div>
  );
};

export default BusinessConsumables;
