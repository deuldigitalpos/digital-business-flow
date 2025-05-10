
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRightLeft } from "lucide-react";
import { format } from "date-fns";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import { toast } from "sonner";

interface ClockInOutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClockInOutModal: React.FC<ClockInOutModalProps> = ({ isOpen, onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const { businessUser } = useBusinessAuth();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // If clocked in, update elapsed time
      if (isClockedIn && clockInTime) {
        const diff = Math.floor((new Date().getTime() - clockInTime.getTime()) / 1000);
        const hours = Math.floor(diff / 3600).toString().padStart(2, "0");
        const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, "0");
        const seconds = (diff % 60).toString().padStart(2, "0");
        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isClockedIn, clockInTime]);

  // Check if user is already clocked in (would normally come from backend)
  useEffect(() => {
    // This would normally check against a backend API
    const savedClockInTime = localStorage.getItem('clockInTime');
    const savedClockInStatus = localStorage.getItem('isClockedIn');
    
    if (savedClockInStatus === 'true' && savedClockInTime) {
      setIsClockedIn(true);
      setClockInTime(new Date(savedClockInTime));
    }
  }, []);

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            {isClockedIn ? "Clock Out" : "Clock In"}
          </DialogTitle>
          <DialogDescription>
            {businessUser?.first_name} {businessUser?.last_name} • {businessUser?.role}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {format(currentTime, "hh:mm:ss a")}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(currentTime, "EEEE, MMMM d, yyyy")}
            </div>
          </div>
          
          {isClockedIn && (
            <div className="mt-4 p-3 bg-orange-50 rounded-md border border-orange-100">
              <div className="text-sm text-orange-700">
                <p className="font-medium">Current session</p>
                <div className="flex justify-between mt-1">
                  <span>Clock in time:</span>
                  <span className="font-semibold">{clockInTime ? format(clockInTime, "hh:mm a") : "--"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Elapsed time:</span>
                  <span className="font-semibold">{elapsedTime}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={handleClockInOut} 
            className={`w-full ${isClockedIn ? 'bg-orange-100 hover:bg-orange-200 text-orange-800' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            {isClockedIn ? "Clock Out" : "Clock In"} 
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClockInOutModal;
