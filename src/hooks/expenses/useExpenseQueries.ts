
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
      
      // Fetch expenses data
      const { data: expensesData, error: expensesError } = await supabase
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
      
      if (expensesError) {
        toast.error('Failed to load expenses');
        throw expensesError;
      }
      
      if (!expensesData || expensesData.length === 0) {
        return [];
      }
      
      // Now let's fetch categories and payment methods separately
      // First, collect the category and payment method IDs
      const categoryIds = expensesData
        .map(expense => expense.category)
        .filter(id => id !== null) as string[];
      
      const paymentMethodIds = expensesData
        .map(expense => expense.payment_method)
        .filter(id => id !== null) as string[];
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('business_expense_categories')
        .select('id, name')
        .in('id', categoryIds.length > 0 ? categoryIds : ['00000000-0000-0000-0000-000000000000']);
      
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      }
      
      // Fetch payment methods
      const { data: paymentMethodsData, error: paymentMethodsError } = await supabase
        .from('business_expense_payment_methods')
        .select('id, name')
        .in('id', paymentMethodIds.length > 0 ? paymentMethodIds : ['00000000-0000-0000-0000-000000000000']);
      
      if (paymentMethodsError) {
        console.error('Error fetching payment methods:', paymentMethodsError);
      }
      
      // Create lookup maps for categories and payment methods
      const categoriesMap = (categoriesData || []).reduce((acc, category) => {
        acc[category.id] = category.name;
        return acc;
      }, {} as Record<string, string>);
      
      const paymentMethodsMap = (paymentMethodsData || []).reduce((acc, method) => {
        acc[method.id] = method.name;
        return acc;
      }, {} as Record<string, string>);
      
      // Transform the data to include display names
      const expensesWithNames = expensesData.map(expense => ({
        ...expense,
        creator_name: expense.creator ? `${expense.creator.first_name} ${expense.creator.last_name}` : 'Unknown',
        category_name: expense.category ? categoriesMap[expense.category] || 'Unknown' : 'Uncategorized',
        payment_method_name: expense.payment_method ? paymentMethodsMap[expense.payment_method] || 'Unknown' : 'Not specified',
        // Remove the details objects to avoid circular references
        creator: undefined
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

  console.log("Fetched expenses:", expenses);
  console.log("Expense summary:", expenseSummary);

  return {
    expenses,
    expenseSummary,
    isLoading,
    error,
    refetch
  };
};
