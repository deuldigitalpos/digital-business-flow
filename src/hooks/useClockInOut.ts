
import { useState, useEffect } from 'react';

export const useClockInOut = () => {
  const [isClockModalOpen, setIsClockModalOpen] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakType, setBreakType] = useState<'lunch' | 'coffee' | null>(null);
  const [breakStartTime, setBreakStartTime] = useState<string | null>(null);
  
  // Load break status from localStorage on component mount
  useEffect(() => {
    const savedBreakStatus = localStorage.getItem('isOnBreak');
    const savedBreakType = localStorage.getItem('breakType');
    const savedBreakStartTime = localStorage.getItem('breakStartTime');
    
    if (savedBreakStatus === 'true') {
      setIsOnBreak(true);
      setBreakType(savedBreakType as 'lunch' | 'coffee');
      setBreakStartTime(savedBreakStartTime);
    }
  }, []);
  
  const openClockModal = () => {
    setIsClockModalOpen(true);
  };
  
  const closeClockModal = () => {
    setIsClockModalOpen(false);
  };
  
  // Check if the user is currently clocked in based on localStorage
  const isUserClockedIn = () => {
    return localStorage.getItem('isClockedIn') === 'true';
  };
  
  // Start a break
  const startBreak = (type: 'lunch' | 'coffee') => {
    if (isUserClockedIn()) {
      setIsOnBreak(true);
      setBreakType(type);
      const now = new Date().toString();
      setBreakStartTime(now);
      localStorage.setItem('isOnBreak', 'true');
      localStorage.setItem('breakType', type);
      localStorage.setItem('breakStartTime', now);
    }
  };
  
  // End a break
  const endBreak = () => {
    setIsOnBreak(false);
    setBreakType(null);
    setBreakStartTime(null);
    localStorage.removeItem('isOnBreak');
    localStorage.removeItem('breakType');
    localStorage.removeItem('breakStartTime');
  };
  
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
