
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseSummary as ExpenseSummaryType } from '@/hooks/useBusinessExpenses';
import { formatCurrency } from '@/utils/format-currency';

interface ExpenseSummaryProps {
  summary: ExpenseSummaryType;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ summary }) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(summary.totalAmount)}</p>
        </CardContent>
      </Card>
      
      <Card className="border-t-4 border-t-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Count</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{summary.totalCount}</p>
        </CardContent>
      </Card>
      
      <Card className="border-t-4 border-t-amber-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Today's Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{summary.todayCount}</p>
        </CardContent>
      </Card>
      
      <Card className="border-t-4 border-t-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{summary.weekCount}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseSummary;
