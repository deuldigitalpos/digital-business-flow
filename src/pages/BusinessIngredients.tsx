
import React, { useState } from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import PermissionDenied from './PermissionDenied';
import IngredientManager from '@/components/business/IngredientManager';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

const BusinessIngredients: React.FC = () => {
  const { hasPermission } = useBusinessAuth();
  const hasAccess = hasPermission('ingredients');
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  if (!hasAccess) {
    return <PermissionDenied />;
  }

  const handleActionSuccess = (message: string) => {
    setStatus({ type: 'success', message });
    setTimeout(() => setStatus(null), 5000); // Clear after 5 seconds
  };

  const handleActionError = (message: string) => {
    setStatus({ type: 'error', message });
    setTimeout(() => setStatus(null), 5000); // Clear after 5 seconds
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ingredients</h1>
        <p className="text-muted-foreground">
          Manage your raw ingredients and track inventory levels
        </p>
      </div>
      
      {status && (
        <Alert className={status.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}>
          {status.type === 'success' ? 
            <CheckCircle className="h-4 w-4 mr-2" /> : 
            <AlertCircle className="h-4 w-4 mr-2" />
          }
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}
      
      <IngredientManager 
        onActionSuccess={handleActionSuccess}
        onActionError={handleActionError}
      />
    </div>
  );
};

export default BusinessIngredients;
