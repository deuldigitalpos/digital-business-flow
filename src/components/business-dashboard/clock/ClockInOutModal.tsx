
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import { toast } from "sonner";
import ClockDisplay from "./ClockDisplay";
import SessionInfo from "./SessionInfo";
import ClockActions from "./ClockActions";
import { useTimeTracking } from "@/hooks/useTimeTracking";

interface ClockInOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnBreak?: boolean;
  breakType?: 'lunch' | 'short' | null;
  breakStartTime?: string | null;
  startBreak?: (type: 'lunch' | 'short') => void;
  endBreak?: () => void;
}

export const ClockInOutModal: React.FC<ClockInOutModalProps> = ({ 
  isOpen, 
  onClose, 
  isOnBreak = false, 
  breakType = null,
  breakStartTime = null,
  startBreak,
  endBreak
}) => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const { businessUser } = useBusinessAuth();

  const { 
    currentTime, 
    elapsedTime, 
    breakElapsedTime,
    formattedTime,
    formattedDate
  } = useTimeTracking(isClockedIn, clockInTime, isOnBreak, breakStartTime);

  // Check if user is already clocked in (would normally come from backend)
  useEffect(() => {
    // This would normally check against a backend API
    const savedClockInTime = localStorage.getItem('clockInTime');
    const savedClockInStatus = localStorage.getItem('isClockedIn');
    
    if (savedClockInStatus === 'true' && savedClockInTime) {
      setIsClockedIn(true);
      setClockInTime(new Date(savedClockInTime));
    }
  }, [isOpen]); // Re-check when modal is opened

  const handleClockInOut = () => {
    if (!isClockedIn) {
      // Clock in
      const now = new Date();
      setClockInTime(now);
      setIsClockedIn(true);
      localStorage.setItem('clockInTime', now.toString());
      localStorage.setItem('isClockedIn', 'true');
      toast.success("Clocked in successfully!");
    } else {
      // Clock out
      setIsClockedIn(false);
      const clockOutTime = new Date();
      localStorage.removeItem('clockInTime');
      localStorage.setItem('isClockedIn', 'false');
      
      // If on break, end break when clocking out
      if (isOnBreak && endBreak) {
        endBreak();
      }
      
      // Calculate total time worked
      if (clockInTime) {
        const totalSeconds = Math.floor((clockOutTime.getTime() - clockInTime.getTime()) / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        toast.success(`Clocked out successfully! Worked for ${hours}h ${minutes}m`);
      } else {
        toast.success("Clocked out successfully!");
      }
      
      setElapsedTime("00:00:00");
    }
  };

  const handleStartBreak = (type: 'lunch' | 'short') => {
    if (startBreak) {
      startBreak(type);
      const breakTypeName = type === 'lunch' ? 'Lunch' : '15 Minutes';
      toast.info(`${breakTypeName} break started`);
    }
  };

  const handleEndBreak = () => {
    if (endBreak) {
      const breakTypeName = breakType === 'lunch' ? 'Lunch' : '15 Minutes';
      endBreak();
      toast.info(`${breakTypeName} break ended`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[95vw] sm:w-full p-4 sm:p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            {isClockedIn ? "Clock Out" : "Clock In"}
          </DialogTitle>
          <DialogDescription>
            {businessUser?.first_name} {businessUser?.last_name} • {businessUser?.role}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-3 sm:py-4">
          <ClockDisplay 
            formattedTime={formattedTime} 
            formattedDate={formattedDate} 
          />
          
          <SessionInfo 
            isClockedIn={isClockedIn}
            clockInTime={clockInTime}
            elapsedTime={elapsedTime}
            isOnBreak={isOnBreak}
            breakType={breakType}
            breakElapsedTime={breakElapsedTime}
          />
        </div>
        
        <DialogFooter className="flex flex-col gap-2 pt-2">
          <ClockActions 
            isClockedIn={isClockedIn}
            isOnBreak={isOnBreak}
            breakType={breakType}
            handleClockInOut={handleClockInOut}
            handleStartBreak={handleStartBreak}
            handleEndBreak={handleEndBreak}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClockInOutModal;
