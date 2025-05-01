
import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { BusinessConsumable } from '@/hooks/useBusinessConsumables';
import { useBusinessStockTransactions } from '@/hooks/useBusinessStockTransactions';
import { Badge } from '@/components/ui/badge';

interface ConsumableTransactionHistoryProps {
  consumable: BusinessConsumable;
  onClose: () => void;
}

const ConsumableTransactionHistory: React.FC<ConsumableTransactionHistoryProps> = ({
  consumable,
  onClose,
}) => {
  const { transactions, isLoading } = useBusinessStockTransactions({
    itemId: consumable.id,
    transactionType: 'consumable',
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Badge variant="success" className="bg-green-500">Delivered</Badge>;
      case 'ordered':
        return <Badge variant="warning" className="bg-amber-500">Ordered</Badge>;
      case 'damaged':
        return <Badge variant="destructive">Damaged</Badge>;
      case 'returned':
        return <Badge variant="secondary">Returned</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge variant="success" className="bg-green-500">Paid</Badge>;
      case 'unpaid':
        return <Badge variant="destructive">Unpaid</Badge>;
      case 'partial':
        return <Badge variant="warning" className="bg-amber-500">Partial</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DialogContent className="sm:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>Transaction History - {consumable.name}</DialogTitle>
        <DialogDescription>
          View all stock transactions for this consumable.
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-[600px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Cost/Unit</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Loading transaction history...
                </TableCell>
              </TableRow>
            ) : transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.transaction_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.quantity > 0 ? 'success' : 'destructive'} className={transaction.quantity > 0 ? 'bg-blue-500' : 'bg-red-500'}>
                      {transaction.quantity > 0 ? 'Added' : 'Removed'}
                    </Badge>
                  </TableCell>
                  <TableCell>{Math.abs(transaction.quantity)}</TableCell>
                  <TableCell>{transaction.unit?.short_name || '-'}</TableCell>
                  <TableCell>${transaction.cost_per_unit.toFixed(2)}</TableCell>
                  <TableCell>${transaction.total_cost.toFixed(2)}</TableCell>
                  <TableCell>
                    {transaction.supplier 
                      ? `${transaction.supplier.first_name} ${transaction.supplier.last_name}` 
                      : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(transaction.payment_status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No transaction history found for this consumable.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  );
};

export default ConsumableTransactionHistory;
