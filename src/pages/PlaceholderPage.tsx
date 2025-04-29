
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'react-router-dom';

const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  
  // Extract the last part of the path to display
  const pathSegment = location.pathname.split('/').pop() || '';
  const title = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          This is a placeholder for the {pathSegment.toLowerCase()} functionality
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{title} Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="rounded-full bg-primary/10 p-6 mb-4">
            <span className="text-4xl text-primary">
              {pathSegment.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-2">{title} Module</h2>
          <p className="text-center text-muted-foreground max-w-md">
            This feature is coming soon. The {pathSegment.toLowerCase()} functionality will allow you
            to manage all aspects related to {pathSegment}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
