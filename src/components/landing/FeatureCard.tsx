
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon }) => {
  return (
    <Card className="transition-all hover:shadow-lg border-orange-100 hover:border-orange-200">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-orange-500" />
        </div>
        <CardTitle className="text-orange-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
