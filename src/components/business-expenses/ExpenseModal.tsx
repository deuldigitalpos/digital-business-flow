
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
      toast.success(expense ? 'Expense updated successfully' : 'Expense added successfully');
      onClose();
    } catch (error) {
      console.error("Error in expense modal submission:", error);
      toast.error(`Failed to ${expense ? 'update' : 'add'} expense. Please try again.`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {expense ? 'Edit the expense details below.' : 'Fill in the details to add a new expense.'}
            {expense?.creator_name && (
              <div className="mt-1 text-xs">
                Created by: <span className="font-medium">{expense.creator_name}</span>
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
