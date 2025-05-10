
import React from 'react';
import { format } from 'date-fns';

interface SessionInfoProps {
  isClockedIn: boolean;
  clockInTime: Date | null;
  elapsedTime: string;
  isOnBreak: boolean;
  breakType: 'lunch' | 'short' | null;
  breakElapsedTime: string;
}

export const SessionInfo: React.FC<SessionInfoProps> = ({
  isClockedIn,
  clockInTime,
  elapsedTime,
  isOnBreak,
  breakType,
  breakElapsedTime
}) => {
  if (!isClockedIn) {
    return null;
  }
  
  return (
    <div className="mt-3 p-2 sm:p-3 bg-orange-50 rounded-md border border-orange-100">
      <div className="text-xs sm:text-sm text-orange-700">
        <p className="font-medium">Current session</p>
        <div className="flex justify-between mt-1">
          <span>Clock in time:</span>
          <span className="font-semibold">{clockInTime ? format(clockInTime, "hh:mm a") : "--"}</span>
        </div>
        <div className="flex justify-between">
          <span>Elapsed time:</span>
          <span className="font-semibold">{elapsedTime}</span>
        </div>
        
        {isOnBreak && (
          <div className="mt-2 pt-2 border-t border-orange-200">
            <p className="font-medium">{breakType === 'lunch' ? 'Lunch' : '15 Minutes'} break</p>
            <div className="flex justify-between">
              <span>Break time:</span>
              <span className="font-semibold">{breakElapsedTime}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionInfo;
