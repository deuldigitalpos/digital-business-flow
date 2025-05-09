
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ExpenseCategoryForm from './ExpenseCategoryForm';
import { ExpenseCategory, ExpenseCategoryFormData } from '@/types/business-expense';

interface ExpenseCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: ExpenseCategory;
  onSubmit: (data: ExpenseCategoryFormData) => void;
  isLoading: boolean;
  title: string;
}

const ExpenseCategoryModal: React.FC<ExpenseCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSubmit,
  isLoading,
  title,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {category ? 'Edit expense category details below.' : 'Fill in the details to add a new expense category.'}
          </DialogDescription>
        </DialogHeader>
        <ExpenseCategoryForm 
          initialValues={category} 
          onSubmit={onSubmit} 
          isLoading={isLoading} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseCategoryModal;
