
import React, { useState } from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import PermissionDenied from './PermissionDenied';
import StockTransactionForm from '@/components/business/StockTransactionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecentStockTransactions } from '@/hooks/useBusinessStockTransactions';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, ArrowUp, ArrowDown } from 'lucide-react';

const BusinessStock: React.FC = () => {
  const { hasPermission } = useBusinessAuth();
  const hasAccess = hasPermission('stock');
  const { data: recentTransactions, isLoading } = useRecentStockTransactions(10);

  const [formKey, setFormKey] = useState(0);

  const handleSuccess = () => {
    // Reset the form by changing its key
    setFormKey(prev => prev + 1);
  };

  if (!hasAccess) {
    return <PermissionDenied />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
        <p className="text-muted-foreground">
          Update and track inventory levels for products, ingredients, and consumables
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <StockTransactionForm key={formKey} onSuccess={handleSuccess} />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : !recentTransactions || recentTransactions.length === 0 ? (
                <p className="text-center p-8 text-muted-foreground">No recent transactions</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>When</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.item_name}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {transaction.transaction_type === 'increase' ? (
                            <span className="flex items-center text-green-600">
                              <ArrowUp className="h-4 w-4 mr-1" />
                              Increase
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <ArrowDown className="h-4 w-4 mr-1" />
                              Decrease
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessStock;
