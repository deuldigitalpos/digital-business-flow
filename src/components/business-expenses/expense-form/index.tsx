
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ExpenseFormProps, ExpenseFormData, ExpenseFormSchema } from './types';
import { Loader2 } from 'lucide-react';
import { useExpenseMutations } from '@/hooks/expenses/useExpenseMutations';

// Import field components
import NameField from './NameField';
import AmountField from './AmountField';
import DateField from './DateField';
import CategoryField from './CategoryField';
import PaymentMethodField from './PaymentMethodField';
import StatusField from './StatusField';
import DescriptionField from './DescriptionField';

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialValues = {}, onSuccess, isEditing = false }) => {
  const { addExpense, updateExpense, isAddingExpense, isUpdatingExpense } = useExpenseMutations();
  const isPending = isAddingExpense || isUpdatingExpense;

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

  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      if (isEditing && initialValues && 'id' in initialValues) {
        await updateExpense({
          id: initialValues.id as string,
          data
        });
      } else {
        await addExpense(data);
      }
      
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NameField />
          <AmountField />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateField />
          <CategoryField />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PaymentMethodField />
          <StatusField />
        </div>

        <DescriptionField />

        <div className="flex justify-end mt-6 gap-2">
          <Button type="submit" disabled={isPending} className="bg-orange-500 hover:bg-orange-600">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Expense' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ExpenseForm;
