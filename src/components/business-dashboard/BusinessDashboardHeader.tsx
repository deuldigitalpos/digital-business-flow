
import React from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingCart, Clock, Settings, LogOut, Coffee, Utensils } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { useNavigate } from 'react-router-dom';
import CalculatorPopover from './calculator/CalculatorPopover';
import ClockInOutModal from './clock/ClockInOutModal';
import { useClockInOut } from '@/hooks/useClockInOut';

const BusinessDashboardHeader = () => {
  const { businessUser, business, logout, hasPermission } = useBusinessAuth();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const { 
    isClockModalOpen, 
    openClockModal, 
    closeClockModal, 
    isUserClockedIn,
    isOnBreak,
    breakType,
    breakStartTime,
    startBreak,
    endBreak
  } = useClockInOut();

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/business-login');
  };

  const navigateToPOS = () => {
    if (hasPermission('pos')) {
      navigate('/business-dashboard/pos');
    } else {
      navigate('/business-dashboard/permission-denied');
    }
  };

  // Get the appropriate icon based on break status
  const getClockButtonIcon = () => {
    if (isUserClockedIn()) {
      if (isOnBreak) {
        return breakType === 'lunch' ? <Utensils className="h-4 w-4" /> : <Coffee className="h-4 w-4" />;
      }
      return <Clock className="h-4 w-4" />;
    }
    return <Clock className="h-4 w-4" />;
  };

  // Get the color styling based on status
  const getClockButtonStyle = () => {
    if (isUserClockedIn()) {
      if (isOnBreak) {
        return 'bg-orange-200 border-orange-400 text-orange-800 hover:bg-orange-300';
      }
      return 'bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200';
    }
    return 'border-orange-200 hover:bg-orange-50 hover:text-orange-600';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center bg-white border-b border-orange-100 px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <div className="flex-1 flex items-center gap-2">
          {business?.logo_url ? (
            <img 
              src={business.logo_url}
              alt={business.business_name}
              className="h-8 w-auto"
            />
          ) : (
            <img 
              src="/lovable-uploads/1df1545d-8aea-4a95-8a04-a342cff67de7.png" 
              alt="DeulDigital Logo"
              className="h-8 w-auto"
            />
          )}
          <span className="font-semibold text-lg text-primary hidden md:inline">
            {business?.business_name || 'Business Dashboard'}
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full border-orange-200 hover:bg-orange-50 hover:text-orange-600" 
          title="POS"
          onClick={navigateToPOS}
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="sr-only">POS</span>
        </Button>
        
        <CalculatorPopover />
        
        <Button 
          variant="outline" 
          size="icon" 
          className={`rounded-full ${getClockButtonStyle()}`}
          title={isOnBreak 
            ? `On ${breakType === 'lunch' ? 'Lunch' : 'Coffee'} Break` 
            : isUserClockedIn() 
              ? "Clock Out" 
              : "Clock In"
          }
          onClick={openClockModal}
        >
          {getClockButtonIcon()}
          <span className="sr-only">Clock In/Out</span>
        </Button>
        
        <div className="hidden md:block text-right mr-2">
          <p className="text-sm font-medium">{businessUser?.first_name} {businessUser?.last_name}</p>
          <p className="text-xs text-gray-500">{businessUser?.role}</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt={businessUser?.first_name || ''} />
                <AvatarFallback className="bg-orange-500 text-white">
                  {businessUser ? getInitials(businessUser.first_name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-orange-700 focus:bg-orange-50 focus:text-orange-800">
              <Settings className="w-4 h-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 text-orange-700 focus:bg-orange-50 focus:text-orange-800" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <ClockInOutModal 
        isOpen={isClockModalOpen} 
        onClose={closeClockModal} 
        isOnBreak={isOnBreak}
        breakType={breakType}
        breakStartTime={breakStartTime}
        startBreak={startBreak}
        endBreak={endBreak}
      />
    </header>
  );
};

export default BusinessDashboardHeader;
