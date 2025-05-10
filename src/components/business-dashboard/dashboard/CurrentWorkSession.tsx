
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

interface CurrentWorkSessionProps {
  clockInTime: Date | null;
  elapsedTime: string;
  openClockModal: () => void;
}

const CurrentWorkSession: React.FC<CurrentWorkSessionProps> = ({
  clockInTime,
  elapsedTime,
  openClockModal
}) => {
  return (
    <Card className="border-t-4 border-t-orange-400">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Current Work Session</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200"
          onClick={openClockModal}
        >
          Clock Out
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Clocked in at {clockInTime ? format(clockInTime, "hh:mm a") : "--"}
            </p>
            <p className="font-semibold text-base sm:text-lg">
              {elapsedTime} <span className="text-xs text-muted-foreground">elapsed</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWorkSession;
