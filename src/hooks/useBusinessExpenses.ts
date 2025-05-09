
import { useExpenseQueries } from './expenses/useExpenseQueries';
import { useExpenseMutations } from './expenses/useExpenseMutations';
import { useExpenseUIState } from './expenses/useExpenseUIState';
import { Expense, ExpenseFormData, ExpenseSummary } from '@/types/business-expense';

// Re-export types for backward compatibility
export type { Expense, ExpenseFormData, ExpenseSummary };

export const useBusinessExpenses = () => {
  const { expenses, expenseSummary, isLoading, error, refetch } = useExpenseQueries();
  const { 
    addExpense, 
    updateExpense, 
    deleteExpense, 
    isAddingExpense, 
    isUpdatingExpense, 
    isDeletingExpense 
  } = useExpenseMutations();
  const { 
    isAddExpenseOpen,
    editingExpense,
    isDeleteDialogOpen,
    expenseToDelete,
    openAddExpense,
    closeAddExpense,
    openEditExpense,
    closeEditExpense,
    openDeleteDialog,
    closeDeleteDialog
  } = useExpenseUIState();

  // Confirm deletion
  const confirmDelete = async (): Promise<void> => {
    if (expenseToDelete) {
      await deleteExpense(expenseToDelete);
    }
    return;
  };

  return {
    // Data and loading states
    expenses,
    expenseSummary,
    isLoading,
    error,
    refetch,

    // UI state
    isAddExpenseOpen,
    editingExpense,
    isDeleteDialogOpen,
    
    // UI actions
    openAddExpense,
    closeAddExpense,
    openEditExpense,
    closeEditExpense,
    openDeleteDialog,
    closeDeleteDialog,
    
    // Data mutations
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Loading states for mutations
    isAddingExpense,
    isUpdatingExpense,
    isDeletingExpense,
    
    // Additional actions
    confirmDelete,
  };
};
