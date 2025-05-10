
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Utensils, Timer } from 'lucide-react';

interface ClockActionsProps {
  isClockedIn: boolean;
  isOnBreak: boolean;
  breakType: 'lunch' | 'short' | null;
  handleClockInOut: () => void;
  handleStartBreak: (type: 'lunch' | 'short') => void;
  handleEndBreak: () => void;
}

export const ClockActions: React.FC<ClockActionsProps> = ({
  isClockedIn,
  isOnBreak,
  breakType,
  handleClockInOut,
  handleStartBreak,
  handleEndBreak
}) => {
  return (
    <>
      {isClockedIn && !isOnBreak && (
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-800 border-orange-200 text-xs sm:text-sm"
            onClick={() => handleStartBreak('lunch')}
          >
            <Utensils className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Lunch Break
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-800 border-orange-200 text-xs sm:text-sm"
            onClick={() => handleStartBreak('short')}
          >
            <Timer className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            15 Minutes Break
          </Button>
        </div>
      )}
      
      {isClockedIn && isOnBreak && (
        <Button 
          variant="outline" 
          className="w-full bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200 text-xs sm:text-sm"
          onClick={handleEndBreak}
        >
          {breakType === 'lunch' ? 
            <Utensils className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> : 
            <Timer className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          }
          End {breakType === 'lunch' ? 'Lunch' : '15 Minutes'} Break
        </Button>
      )}
      
      <Button 
        onClick={handleClockInOut} 
        className={`w-full ${isClockedIn ? 'bg-orange-100 hover:bg-orange-200 text-orange-800' : 'bg-orange-500 hover:bg-orange-600 text-white'} text-xs sm:text-sm`}
      >
        <ArrowRightLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        {isClockedIn ? "Clock Out" : "Clock In"} 
      </Button>
    </>
  );
};

export default ClockActions;
