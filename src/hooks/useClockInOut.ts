
import { useState, useEffect, useCallback } from 'react';

export const useClockInOut = () => {
  const [isClockModalOpen, setIsClockModalOpen] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakType, setBreakType] = useState<'lunch' | 'short' | null>(null);
  const [breakStartTime, setBreakStartTime] = useState<string | null>(null);
  
  // Load break status from localStorage on component mount
  useEffect(() => {
    const savedBreakStatus = localStorage.getItem('isOnBreak');
    const savedBreakType = localStorage.getItem('breakType');
    const savedBreakStartTime = localStorage.getItem('breakStartTime');
    
    if (savedBreakStatus === 'true') {
      setIsOnBreak(true);
      setBreakType(savedBreakType as 'lunch' | 'short');
      setBreakStartTime(savedBreakStartTime);
    }
  }, []);
  
  const openClockModal = useCallback(() => {
    setIsClockModalOpen(true);
  }, []);
  
  const closeClockModal = useCallback(() => {
    setIsClockModalOpen(false);
  }, []);
  
  // Check if the user is currently clocked in based on localStorage
  const isUserClockedIn = useCallback(() => {
    return localStorage.getItem('isClockedIn') === 'true';
  }, []);
  
  // Start a break
  const startBreak = useCallback((type: 'lunch' | 'short') => {
    if (isUserClockedIn()) {
      setIsOnBreak(true);
      setBreakType(type);
      const now = new Date().toString();
      setBreakStartTime(now);
      localStorage.setItem('isOnBreak', 'true');
      localStorage.setItem('breakType', type);
      localStorage.setItem('breakStartTime', now);
    }
  }, [isUserClockedIn]);
  
  // End a break
  const endBreak = useCallback(() => {
    setIsOnBreak(false);
    setBreakType(null);
    setBreakStartTime(null);
    localStorage.removeItem('isOnBreak');
    localStorage.removeItem('breakType');
    localStorage.removeItem('breakStartTime');
  }, []);
  
  return {
    isClockModalOpen,
    openClockModal,
    closeClockModal,
    isUserClockedIn,
    isOnBreak,
    breakType,
    breakStartTime,
    startBreak,
    endBreak,
  };
};
