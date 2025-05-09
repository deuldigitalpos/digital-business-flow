
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useExpenseMutations } from '@/hooks/expenses/useExpenseMutations';
import { ExpenseFormSchema } from './expense-form/types';
import AmountField from './expense-form/AmountField';
import NameField from './expense-form/NameField';
import DateField from './expense-form/DateField';
import CategoryField from './expense-form/CategoryField';
import PaymentMethodField from './expense-form/PaymentMethodField';
import StatusField from './expense-form/StatusField';
import DescriptionField from './expense-form/DescriptionField';

export type ExpenseFormValues = z.infer<typeof ExpenseFormSchema>;

interface ExpenseFormProps {
  initialValues?: Partial<ExpenseFormValues>;
  onSuccess?: () => void;
  isEditing?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  initialValues = {},
  onSuccess,
  isEditing = false
}) => {
  const { createExpense, updateExpense } = useExpenseMutations();
  
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      name: '',
      amount: 0,
      expense_date: new Date().toISOString().split('T')[0],
      category: '',
      payment_method: 'cash',
      status: 'pending',
      description: '',
      ...initialValues
    }
  });

  const isPending = createExpense.isPending || updateExpense.isPending;

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      if (isEditing && initialValues.id) {
        await updateExpense.mutateAsync({
          id: initialValues.id,
          ...data
        });
        toast.success('Expense updated successfully');
      } else {
        await createExpense.mutateAsync(data);
        toast.success('Expense created successfully');
      }
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to save expense');
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Expense' : 'Create Expense'}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default ExpenseForm;
