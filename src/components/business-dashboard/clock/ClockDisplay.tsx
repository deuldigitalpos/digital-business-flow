
import React from 'react';

interface ClockDisplayProps {
  formattedTime: string;
  formattedDate: string;
}

export const ClockDisplay: React.FC<ClockDisplayProps> = ({
  formattedTime,
  formattedDate
}) => {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-bold mb-1">
        {formattedTime}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground">
        {formattedDate}
      </div>
    </div>
  );
};

export default ClockDisplay;
