
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PermissionDenied: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
      <ShieldAlert className="h-16 w-16 text-orange-500" />
      <h1 className="text-2xl font-bold text-gray-800">Permission Denied</h1>
      <p className="text-gray-600 text-center max-w-md">
        You don't have permission to access this page. Please contact your administrator
        if you believe this is a mistake.
      </p>
      <Button 
        onClick={() => navigate('/business-dashboard')} 
        className="bg-orange-500 hover:bg-orange-600"
      >
        Return to Dashboard
      </Button>
    </div>
  );
};

export default PermissionDenied;
