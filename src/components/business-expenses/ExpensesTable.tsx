
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from 'lucide-react';
import { Expense } from '@/types/business-expense';
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";

interface ExpensesTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const getStatusColor = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ExpensesTable: React.FC<ExpensesTableProps> = ({
  expenses,
  onEdit,
  onDelete,
  isLoading,
}) => {
  console.log("ExpensesTable received:", expenses?.length, "expenses");
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Loading expenses...</p>
      </div>
    );
  }
  
  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No expenses found that match your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.name}</TableCell>
              <TableCell>{formatDate(expense.expense_date)}</TableCell>
              <TableCell>{formatCurrency(expense.amount)}</TableCell>
              <TableCell>{expense.category_name || 'Uncategorized'}</TableCell>
              <TableCell>{expense.payment_method_name || 'Not specified'}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(expense.status)}>
                  {expense.status || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(expense)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive"
                    onClick={() => onDelete(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpensesTable;
