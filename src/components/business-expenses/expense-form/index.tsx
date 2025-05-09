
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Expense } from '@/hooks/useBusinessExpenses';
import { ExpenseFormProps, ExpenseFormData } from './types';

// Import field components
import NameField from './NameField';
import AmountField from './AmountField';
import DateField from './DateField';
import CategoryField from './CategoryField';
import PaymentMethodField from './PaymentMethodField';
import StatusField from './StatusField';
import DescriptionField from './DescriptionField';

const expenseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  description: z.string().optional(),
  expense_date: z.string().min(1, 'Date is required'),
  category: z.string().optional(),
  payment_method: z.string().optional(),
  status: z.string().optional(),
});

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSubmit, isLoading }) => {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      name: expense?.name || '',
      amount: expense ? Number(expense.amount) : 0,
      description: expense?.description || '',
      expense_date: expense ? expense.expense_date.split('T')[0] : new Date().toISOString().split('T')[0],
      category: expense?.category || '',
      payment_method: expense?.payment_method || '',
      status: expense?.status || 'completed',
    },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NameField />
        <AmountField />
        <DateField />
        <CategoryField />
        <PaymentMethodField />
        <StatusField />
        <DescriptionField />

        <div className="flex justify-end mt-6 gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ExpenseForm;
