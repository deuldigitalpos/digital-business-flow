
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { useClockInOut } from '@/hooks/useClockInOut';
import ClockInOutModal from './clock/ClockInOutModal';
import BusinessLogo from './header/BusinessLogo';
import HeaderActions from './header/HeaderActions';

const BusinessDashboardHeader = () => {
  const { toggleSidebar } = useSidebar();
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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center bg-white border-b border-orange-100 px-2 sm:px-4 md:px-6">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <BusinessLogo />
      </div>

      <HeaderActions />
      
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
