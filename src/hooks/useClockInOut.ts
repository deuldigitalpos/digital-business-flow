
import { useState } from 'react';

export const useClockInOut = () => {
  const [isClockModalOpen, setIsClockModalOpen] = useState(false);
  
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
  
  return {
    isClockModalOpen,
    openClockModal,
    closeClockModal,
    isUserClockedIn,
  };
};
