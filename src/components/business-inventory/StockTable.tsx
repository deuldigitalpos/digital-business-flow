
import React from 'react';
import { useBusinessStockTransactions } from '@/hooks/useBusinessStockTransactions';
import { formatDate } from '@/utils/format-date';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export const StockTable: React.FC = () => {
  const { transactions, isLoading } = useBusinessStockTransactions();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No stock transactions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Total Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
              <TableCell className="capitalize">{transaction.transaction_type}</TableCell>
              <TableCell>
                <Badge 
                  className={
                    transaction.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                    transaction.status === 'ordered' ? 'bg-blue-100 text-blue-800' :
                    transaction.status === 'damaged' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }
                >
                  {transaction.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  className={
                    transaction.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                    transaction.payment_status === 'unpaid' ? 'bg-red-100 text-red-800' :
                    transaction.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }
                >
                  {transaction.payment_status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {transaction.quantity}
              </TableCell>
              <TableCell className="text-right font-medium">
                ${transaction.total_cost.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockTable;
