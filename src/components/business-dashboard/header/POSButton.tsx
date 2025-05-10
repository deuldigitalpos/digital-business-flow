
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

const POSButton = () => {
  const navigate = useNavigate();
  const { hasPermission } = useBusinessAuth();

  const navigateToPOS = () => {
    if (hasPermission('pos')) {
      navigate('/business-dashboard/pos');
    } else {
      navigate('/business-dashboard/permission-denied');
    }
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="rounded-full border-orange-200 hover:bg-orange-50 hover:text-orange-600 h-8 w-8 sm:h-10 sm:w-10" 
      title="POS"
      onClick={navigateToPOS}
    >
      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
      <span className="sr-only">POS</span>
    </Button>
  );
};

export default POSButton;
