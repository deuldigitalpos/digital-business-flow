
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
import { Edit, Trash2 } from 'lucide-react';
import { ExpensePaymentMethod } from '@/types/business-expense';

interface ExpensePaymentMethodsTableProps {
  paymentMethods: ExpensePaymentMethod[];
  onEdit: (paymentMethod: ExpensePaymentMethod) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const ExpensePaymentMethodsTable: React.FC<ExpensePaymentMethodsTableProps> = ({
  paymentMethods,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (paymentMethods.length === 0 && !isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No payment methods found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paymentMethods.map((paymentMethod) => (
          <TableRow key={paymentMethod.id}>
            <TableCell className="font-medium">{paymentMethod.name}</TableCell>
            <TableCell>{paymentMethod.description || '-'}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(paymentMethod)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive"
                  onClick={() => onDelete(paymentMethod.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ExpensePaymentMethodsTable;
