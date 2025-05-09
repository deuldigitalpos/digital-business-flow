
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Expense, ExpenseSummary } from '@/types/business-expense';
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
          )
        `)
        .eq('business_id', business.id)
        .order('expense_date', { ascending: false });
      
      if (error) {
        toast.error('Failed to load expenses');
        throw error;
      }
      
      // Transform the data to include creator_name
      const expensesWithCreatorName = data.map(expense => ({
        ...expense,
        creator_name: expense.creator ? `${expense.creator.first_name} ${expense.creator.last_name}` : 'Unknown',
        // Remove the creator object as we now have creator_name
        creator: undefined
      }));
      
      return expensesWithCreatorName as Expense[];
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
