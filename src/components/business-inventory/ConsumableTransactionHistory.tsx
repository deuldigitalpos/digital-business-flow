
import React from 'react';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { BusinessConsumable } from '@/hooks/useBusinessConsumables';
import { format } from 'date-fns';
import { useBusinessStockTransactions } from '@/hooks/useBusinessStockTransactions';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, CircleMinus, CirclePlus, LoaderCircle } from 'lucide-react';

interface ConsumableTransactionHistoryProps {
  consumable: BusinessConsumable;
  onClose: () => void;
}

const ConsumableTransactionHistory: React.FC<ConsumableTransactionHistoryProps> = ({ 
  consumable, 
  onClose 
}) => {
  const { 
    transactions, 
    isLoading 
  } = useBusinessStockTransactions({
    itemId: consumable.id,
    itemType: 'consumable'
  });

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Badge className="bg-green-500"><CirclePlus className="mr-1 h-3 w-3" />Purchase</Badge>;
      case 'sale':
        return <Badge className="bg-blue-500"><CircleMinus className="mr-1 h-3 w-3" />Sale</Badge>;
      case 'adjustment':
        return <Badge className="bg-amber-500"><CircleCheck className="mr-1 h-3 w-3" />Adjustment</Badge>;
      default:
        return <Badge className="bg-gray-500">{type}</Badge>;
    }
  };

  return (
    <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Transaction History - {consumable.name}</DialogTitle>
      </DialogHeader>
      
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-3">
            <div className="text-sm font-medium text-muted-foreground">Current Quantity</div>
            <div className="text-2xl font-bold">{consumable.quantity?.toFixed(2) || '0'}</div>
            <div className="text-xs text-muted-foreground">{consumable.unit?.short_name || '-'}</div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-sm font-medium text-muted-foreground">Average Cost</div>
            <div className="text-2xl font-bold">${consumable.average_cost?.toFixed(2) || '0.00'}</div>
            <div className="text-xs text-muted-foreground">per unit</div>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="text-sm font-medium text-muted-foreground">Total Value</div>
            <div className="text-2xl font-bold">${consumable.total_value?.toFixed(2) || '0.00'}</div>
            <div className="text-xs text-muted-foreground">in inventory</div>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <LoaderCircle className="h-6 w-6 animate-spin mx-auto" />
                    <div className="mt-2">Loading transactions...</div>
                  </TableCell>
                </TableRow>
              ) : transactions && transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{getTransactionTypeLabel(transaction.transaction_type)}</TableCell>
                    <TableCell>{transaction.quantity?.toFixed(2) || '0'}</TableCell>
                    <TableCell>${transaction.cost_per_unit?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>${transaction.total_cost?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{transaction.reference_id || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No transaction history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ConsumableTransactionHistory;
