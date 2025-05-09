
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { ExpenseFormData } from '@/types/business-expense';

export const useExpenseMutations = () => {
  const { business } = useBusinessAuth();
  const queryClient = useQueryClient();

  // Add expense mutation
  const { 
    mutate: addExpense, 
    isPending: isAddingExpense
  } = useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      if (!business?.id) throw new Error('No business selected');
      
      console.log("Adding expense:", data);
      
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
      
      if (error) {
        console.error("Error adding expense:", error);
        throw error;
      }
      
      console.log("New expense created:", newExpense);
      return newExpense;
    },
    onSuccess: () => {
      toast.success('Expense added successfully');
      queryClient.invalidateQueries({ queryKey: ['business-expenses'] });
    },
    onError: (error) => {
      console.error("Expense addition error:", error);
      toast.error(`Failed to add expense: ${error.message}`);
    }
  });

  // Update expense mutation
  const { 
    mutate: updateExpense, 
    isPending: isUpdatingExpense 
  } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ExpenseFormData }) => {
      if (!business?.id) throw new Error('No business selected');
      
      console.log("Updating expense:", id, data);
      
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
      
      if (error) {
        console.error("Error updating expense:", error);
        throw error;
      }
      
      console.log("Expense updated:", updatedExpense);
      return updatedExpense;
    },
    onSuccess: () => {
      toast.success('Expense updated successfully');
      queryClient.invalidateQueries({ queryKey: ['business-expenses'] });
    },
    onError: (error) => {
      console.error("Expense update error:", error);
      toast.error(`Failed to update expense: ${error.message}`);
    }
  });

  // Delete expense mutation
  const { 
    mutate: deleteExpense, 
    isPending: isDeletingExpense 
  } = useMutation({
    mutationFn: async (id: string) => {
      if (!business?.id) throw new Error('No business selected');
      
      console.log("Deleting expense:", id);
      
      const { error } = await supabase
        .from('business_expenses')
        .delete()
        .eq('id', id)
        .eq('business_id', business.id);
      
      if (error) {
        console.error("Error deleting expense:", error);
        throw error;
      }
      
      console.log("Expense deleted successfully");
      return id;
    },
    onSuccess: () => {
      toast.success('Expense deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['business-expenses'] });
    },
    onError: (error) => {
      console.error("Expense deletion error:", error);
      toast.error(`Failed to delete expense: ${error.message}`);
    }
  });

  return {
    addExpense,
    updateExpense,
    deleteExpense,
    isAddingExpense,
    isUpdatingExpense,
    isDeletingExpense
  };
};
