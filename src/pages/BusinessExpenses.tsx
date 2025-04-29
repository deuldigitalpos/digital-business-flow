
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Loader2 } from 'lucide-react';

const BusinessExpenses = () => {
  const { business, isLoading } = useBusinessAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <p className="text-muted-foreground">
          Manage and track your business expenses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expenses Dashboard</CardTitle>
          <CardDescription>View and manage all your business expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-10 text-center">
            <p className="text-muted-foreground">
              Expenses management features will be available soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessExpenses;
