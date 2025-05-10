
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Timer, Utensils } from 'lucide-react';
import { useClockInOut } from '@/hooks/useClockInOut';

const ClockInOutButton = () => {
  const { 
    openClockModal, 
    isUserClockedIn,
    isOnBreak,
    breakType
  } = useClockInOut();

  // Get the appropriate icon based on break status
  const getClockButtonIcon = () => {
    if (isUserClockedIn()) {
      if (isOnBreak) {
        return breakType === 'lunch' ? <Utensils className="h-4 w-4" /> : <Timer className="h-4 w-4" />;
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
    <Button 
      variant="outline" 
      size="icon" 
      className={`rounded-full h-8 w-8 sm:h-10 sm:w-10 ${getClockButtonStyle()}`}
      title={isOnBreak 
        ? `On ${breakType === 'lunch' ? 'Lunch' : '15 Minutes'} Break` 
        : isUserClockedIn() 
          ? "Clock Out" 
          : "Clock In"
      }
      onClick={openClockModal}
    >
      {getClockButtonIcon()}
      <span className="sr-only">Clock In/Out</span>
    </Button>
  );
};

export default ClockInOutButton;
