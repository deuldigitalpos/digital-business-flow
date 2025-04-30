
import React, { useState } from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import PermissionDenied from './PermissionDenied';
import IngredientManager from '@/components/business/IngredientManager';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

const BusinessIngredients: React.FC = () => {
  const { hasPermission, businessUser } = useBusinessAuth();
  const hasAccess = hasPermission('ingredients');
  const [status, setStatus] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  if (!hasAccess) {
    return <PermissionDenied />;
  }

  // Display business user info for debugging
  console.log('Current business user:', businessUser);

  const handleActionSuccess = (message: string) => {
    console.log('Success:', message);
    setStatus({ type: 'success', message });
    toast.success(message);
    setTimeout(() => setStatus(null), 5000); // Clear after 5 seconds
  };

  const handleActionError = (message: string) => {
    console.error('Error:', message);
    setStatus({ type: 'error', message });
    toast.error(message);
    setTimeout(() => setStatus(null), 8000); // Give a bit more time for error messages
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ingredients</h1>
        <p className="text-muted-foreground">
          Manage your raw ingredients and track inventory levels
        </p>
        {businessUser && (
          <div className="mt-2 text-xs text-muted-foreground">
            Logged in as: {businessUser.first_name} {businessUser.last_name} (ID: {businessUser.id.substring(0, 8)}...)
          </div>
        )}
      </div>
      
      {status && (
        <Alert className={
          status.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 
          status.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 
          'bg-blue-50 text-blue-800 border-blue-200'
        }>
          {status.type === 'success' ? 
            <CheckCircle className="h-4 w-4 mr-2" /> : 
            status.type === 'error' ?
            <AlertCircle className="h-4 w-4 mr-2" /> :
            <Info className="h-4 w-4 mr-2" />
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
