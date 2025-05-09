
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export type Expense = {
  id: string;
  business_id: string;
  created_by: string | null;
  creator_name?: string;
  amount: number;
  name: string;
  description: string | null;
  expense_date: string;
  category: string | null;
  payment_method: string | null;
  status: string | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ExpenseSummary = {
  totalAmount: number;
  totalCount: number;
  todayCount: number;
  weekCount: number;
};

export type ExpenseFormData = {
  name: string;
  amount: number;
  description?: string;
  expense_date: string;
  category?: string;
  payment_method?: string;
  status?: string;
};

export const useBusinessExpenses = () => {
  const { business } = useBusinessAuth();
  const queryClient = useQueryClient();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

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

  // Add expense mutation
  const { mutate: addExpense, isPending: isAddingExpense } = useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      if (!business?.id) throw new Error('No business selected');
      
      const { error, data: newExpense } = await supabase
        .from('business_expenses')
        .insert({
          business_id: business.id,
          name: data.name,
          amount: data.amount,
          description: data.description || null,
          expense_date: data.expense_date,
          category: data.category || null,
          payment_method: data.payment_method || null,
          status: data.status || 'completed'
        })
        .select()
        .single();
      
      if (error) throw error;
      return newExpense;
    },
    onSuccess: () => {
      toast.success('Expense added successfully');
      queryClient.invalidateQueries({ queryKey: ['business-expenses'] });
      setIsAddExpenseOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to add expense: ${error.message}`);
    }
  });

  // Update expense mutation
  const { mutate: updateExpense, isPending: isUpdatingExpense } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ExpenseFormData }) => {
      if (!business?.id) throw new Error('No business selected');
      
      const { error, data: updatedExpense } = await supabase
        .from('business_expenses')
        .update({
          name: data.name,
          amount: data.amount,
          description: data.description || null,
          expense_date: data.expense_date,
          category: data.category || null,
          payment_method: data.payment_method || null,
          status: data.status || 'completed'
        })
        .eq('id', id)
        .eq('business_id', business.id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedExpense;
    },
    onSuccess: () => {
      toast.success('Expense updated successfully');
      queryClient.invalidateQueries({ queryKey: ['business-expenses'] });
      setEditingExpense(null);
    },
    onError: (error) => {
      toast.error(`Failed to update expense: ${error.message}`);
    }
  });

  // Delete expense mutation
  const { mutate: deleteExpense, isPending: isDeletingExpense } = useMutation({
    mutationFn: async (id: string) => {
      if (!business?.id) throw new Error('No business selected');
      
      const { error } = await supabase
        .from('business_expenses')
        .delete()
        .eq('id', id)
        .eq('business_id', business.id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success('Expense deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['business-expenses'] });
      setIsDeleteDialogOpen(false);
      setExpenseToDelete(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete expense: ${error.message}`);
    }
  });

  // Handle opening add expense modal
  const openAddExpense = () => {
    setIsAddExpenseOpen(true);
  };

  // Handle closing add expense modal
  const closeAddExpense = () => {
    setIsAddExpenseOpen(false);
  };

  // Handle opening edit expense modal
  const openEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  // Handle closing edit expense modal
  const closeEditExpense = () => {
    setEditingExpense(null);
  };

  // Handle opening delete expense dialog
  const openDeleteDialog = (id: string) => {
    setExpenseToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle closing delete expense dialog
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete);
    }
  };

  return {
    expenses,
    expenseSummary,
    isLoading,
    error,
    refetch,
    isAddExpenseOpen,
    editingExpense,
    isDeleteDialogOpen,
    openAddExpense,
    closeAddExpense,
    openEditExpense,
    closeEditExpense,
    openDeleteDialog,
    closeDeleteDialog,
    addExpense,
    updateExpense,
    deleteExpense,
    isAddingExpense,
    isUpdatingExpense,
    isDeletingExpense,
    confirmDelete,
  };
};
