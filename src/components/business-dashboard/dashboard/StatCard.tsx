
import React, { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  Icon: LucideIcon;
  trend: {
    value: string;
    isPositive: boolean;
    TrendIcon: LucideIcon;
  };
  accentColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  Icon,
  trend,
  accentColor
}) => {
  return (
    <Card className={`border-t-4 border-t-${accentColor}`}>
      <CardHeader className="flex flex-row items-center justify-between p-3 sm:pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-3 w-3 sm:h-4 sm:w-4 text-${accentColor}`} />
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:pt-0">
        <div className="text-lg sm:text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          <span className={`text-${trend.isPositive ? 'green' : 'red'}-500 flex items-center mr-1`}>
            <trend.TrendIcon className="h-3 w-3 mr-0.5" />
            {trend.value}
          </span>
          from last month
        </p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
