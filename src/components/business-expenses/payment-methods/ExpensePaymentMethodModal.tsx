
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ExpensePaymentMethodForm from './ExpensePaymentMethodForm';
import { ExpensePaymentMethod, ExpensePaymentMethodFormData } from '@/types/business-expense';

interface ExpensePaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod?: ExpensePaymentMethod;
  onSubmit: (data: ExpensePaymentMethodFormData) => void;
  isLoading: boolean;
  title: string;
}

const ExpensePaymentMethodModal: React.FC<ExpensePaymentMethodModalProps> = ({
  isOpen,
  onClose,
  paymentMethod,
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
            {paymentMethod ? 'Edit payment method details below.' : 'Fill in the details to add a new payment method.'}
          </DialogDescription>
        </DialogHeader>
        <ExpensePaymentMethodForm 
          initialValues={paymentMethod} 
          onSubmit={onSubmit} 
          isLoading={isLoading} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExpensePaymentMethodModal;
