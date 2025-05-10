
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export const useTimeTracking = (
  isClockedIn: boolean,
  clockInTime: Date | null,
  isOnBreak: boolean,
  breakStartTime: string | null
) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [breakElapsedTime, setBreakElapsedTime] = useState<string>("00:00:00");

  // Update current time and calculate elapsed times
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
      
      // If on break, update break elapsed time
      if (isOnBreak && breakStartTime) {
        const breakStart = new Date(breakStartTime);
        const breakDiff = Math.floor((new Date().getTime() - breakStart.getTime()) / 1000);
        const breakHours = Math.floor(breakDiff / 3600).toString().padStart(2, "0");
        const breakMinutes = Math.floor((breakDiff % 3600) / 60).toString().padStart(2, "0");
        const breakSeconds = (breakDiff % 60).toString().padStart(2, "0");
        setBreakElapsedTime(`${breakHours}:${breakMinutes}:${breakSeconds}`);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isClockedIn, clockInTime, isOnBreak, breakStartTime]);

  return {
    currentTime,
    elapsedTime,
    breakElapsedTime,
    formattedTime: format(currentTime, "hh:mm:ss a"),
    formattedDate: format(currentTime, "EEEE, MMMM d, yyyy")
  };
};
