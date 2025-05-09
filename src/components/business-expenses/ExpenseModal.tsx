
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ExpenseForm from './ExpenseForm';
import { Expense, ExpenseFormData } from '@/types/business-expense';
import { toast } from 'sonner';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  isLoading: boolean;
  title: string;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onSubmit,
  isLoading,
  title,
}) => {
  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      console.log("Modal submitting expense data:", data);
      await onSubmit(data);
      toast.success(expense ? 'Expense updated successfully' : 'Expense added successfully', {
        className: "bg-orange-50 border-l-4 border-secondary text-primary",
      });
      onClose();
    } catch (error) {
      console.error("Error in expense modal submission:", error);
      toast.error(`Failed to ${expense ? 'update' : 'add'} expense. Please try again.`, {
        className: "bg-red-50 border-l-4 border-red-500 text-primary",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] border-t-4 border-t-secondary">
        <DialogHeader>
          <DialogTitle className="text-primary">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {expense ? 'Edit the expense details below.' : 'Fill in the details to add a new expense.'}
            {expense?.creator_name && (
              <div className="mt-1 text-xs">
                Created by: <span className="font-medium text-secondary">{expense.creator_name}</span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm 
          initialValues={expense} 
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          isEditing={!!expense} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseModal;
