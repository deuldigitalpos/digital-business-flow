
import { useState, useEffect, useCallback } from 'react';

export const useDashboardClock = () => {
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");

  // Check and update clock-in status
  const checkClockInStatus = useCallback(() => {
    const savedClockInTime = localStorage.getItem('clockInTime');
    if (savedClockInTime) {
      setClockInTime(new Date(savedClockInTime));
    } else {
      setClockInTime(null);
    }
  }, []);

  // Update clock time and elapsed time
  useEffect(() => {
    // Check clock-in status initially
    checkClockInStatus();
    
    // Setup interval for time updates
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Update elapsed time if clocked in
      const isClockedInNow = localStorage.getItem('isClockedIn') === 'true';
      const savedClockInTime = localStorage.getItem('clockInTime');
      
      if (isClockedInNow && savedClockInTime) {
        const clockInTimeDate = new Date(savedClockInTime);
        const diff = Math.floor((now.getTime() - clockInTimeDate.getTime()) / 1000);
        const hours = Math.floor(diff / 3600).toString().padStart(2, "0");
        const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, "0");
        const seconds = (diff % 60).toString().padStart(2, "0");
        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);
    
    // Setup storage event listener to detect changes in localStorage
    const handleStorageChange = () => {
      checkClockInStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      clearInterval(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkClockInStatus]);

  return {
    clockInTime,
    currentTime,
    elapsedTime
  };
};
