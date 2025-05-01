
import React from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import PermissionDenied from './PermissionDenied';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface ActivityLogFilters {
  page?: string;
  action_type?: string;
  item_name?: string;
}

const BusinessActivityLog: React.FC = () => {
  const { hasPermission } = useBusinessAuth();
  const hasAccess = hasPermission('activity_log');

  if (!hasAccess) {
    return <PermissionDenied />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground">
          Track all activities and changes across your business
        </p>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          The activity log functionality has been temporarily disabled due to system updates.
          Check back later for detailed activity tracking across your business operations.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Activity Records</CardTitle>
          <CardDescription>
            Recent activities will be displayed here once the feature is re-enabled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <p className="text-muted-foreground">No activity logs available</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessActivityLog;
