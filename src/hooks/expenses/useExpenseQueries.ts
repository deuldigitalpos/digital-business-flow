
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Expense, ExpenseSummary, ExpenseCategory, ExpensePaymentMethod } from '@/types/business-expense';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export const useExpenseQueries = () => {
  const { business } = useBusinessAuth();

  // Fetch all expenses for current business
  const {
    data: expenses,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['business-expenses', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const { data, error } = await supabase
        .from('business_expenses')
        .select(`
          *,
          creator:created_by(
            id, 
            first_name, 
            last_name
          ),
          category_details:category(name),
          payment_method_details:payment_method(name)
        `)
        .eq('business_id', business.id)
        .order('expense_date', { ascending: false });
      
      if (error) {
        toast.error('Failed to load expenses');
        throw error;
      }
      
      // Transform the data to include display names
      const expensesWithNames = data.map(expense => ({
        ...expense,
        creator_name: expense.creator ? `${expense.creator.first_name} ${expense.creator.last_name}` : 'Unknown',
        category_name: expense.category_details?.name || 'Uncategorized',
        payment_method_name: expense.payment_method_details?.name || 'Not specified',
        // Remove the details objects
        creator: undefined,
        category_details: undefined,
        payment_method_details: undefined
      }));
      
      return expensesWithNames as Expense[];
    },
    enabled: !!business?.id
  });

  // Calculate expense summary statistics
  const expenseSummary: ExpenseSummary = expenses ? {
    totalAmount: expenses.reduce((sum, expense) => sum + Number(expense.amount), 0),
    totalCount: expenses.length,
    todayCount: expenses.filter(expense => {
      const today = new Date();
      const expenseDate = new Date(expense.expense_date);
      return expenseDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
    }).length,
    weekCount: expenses.filter(expense => {
      const today = new Date();
      const expenseDate = new Date(expense.expense_date);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      return expenseDate >= oneWeekAgo;
    }).length
  } : {
    totalAmount: 0,
    totalCount: 0,
    todayCount: 0,
    weekCount: 0
  };

  return {
    expenses,
    expenseSummary,
    isLoading,
    error,
    refetch
  };
};
