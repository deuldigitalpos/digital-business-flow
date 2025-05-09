
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ExpenseFormProps, ExpenseFormData, ExpenseFormSchema } from './types';

// Import field components
import NameField from './NameField';
import AmountField from './AmountField';
import DateField from './DateField';
import CategoryField from './CategoryField';
import PaymentMethodField from './PaymentMethodField';
import StatusField from './StatusField';
import DescriptionField from './DescriptionField';

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialValues = {}, onSuccess, isEditing = false }) => {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      amount: initialValues?.amount || 0,
      description: initialValues?.description || '',
      expense_date: initialValues?.expense_date ? initialValues.expense_date.split('T')[0] : new Date().toISOString().split('T')[0],
      category: initialValues?.category || '',
      payment_method: initialValues?.payment_method || '',
      status: initialValues?.status || 'completed',
    },
  });

  const handleSubmit = (data: ExpenseFormData) => {
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <NameField />
        <AmountField />
        <DateField />
        <CategoryField />
        <PaymentMethodField />
        <StatusField />
        <DescriptionField />

        <div className="flex justify-end mt-6 gap-2">
          <Button type="submit">
            {isEditing ? 'Update Expense' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ExpenseForm;
