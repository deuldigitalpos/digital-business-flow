
import { useState } from 'react';
import { Expense } from '@/types/business-expense';

export const useExpenseUIState = () => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

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

  return {
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
  };
};
