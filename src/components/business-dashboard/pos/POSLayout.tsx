
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Minimize, ShoppingCart } from 'lucide-react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import POSProductGrid from './POSProductGrid';
import POSCart from './POSCart';
import { CalculatorPopover } from '../calculator';

const POSLayout: React.FC = () => {
  const { businessUser, business } = useBusinessAuth();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Set fullscreen mode on component mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    };
    
    enterFullscreen();
    
    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const exitPOS = async () => {
    // Exit fullscreen if we're in fullscreen mode
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    
    // Navigate back to the dashboard
    navigate('/business-dashboard');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* POS Header */}
      <div className="bg-[#072536] text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <ShoppingCart className="mr-2 h-6 w-6" />
          <h1 className="text-2xl font-bold">POS System</h1>
          {business && (
            <span className="ml-4 text-sm opacity-80">
              {business.name}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <CalculatorPopover className="bg-blue-500 hover:bg-blue-600 text-white" />
          <Button 
            variant="destructive" 
            onClick={exitPOS}
            className="flex items-center gap-2"
          >
            <Minimize className="h-4 w-4" />
            Exit POS
          </Button>
        </div>
      </div>
      
      {/* Main POS Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Product Display Area - 2/3 of the space */}
        <div className="w-2/3 overflow-auto p-4">
          <POSProductGrid />
        </div>
        
        {/* Cart/Checkout Area - 1/3 of the space */}
        <div className="w-1/3 bg-white border-l border-gray-200 overflow-auto flex flex-col">
          <POSCart />
        </div>
      </div>
    </div>
  );
};

export default POSLayout;
