
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Loader2, DollarSign } from 'lucide-react';
import { useBusinessExpenses } from '@/hooks/useBusinessExpenses';
import ExpenseModal from '@/components/business-expenses/ExpenseModal';
import DeleteExpenseDialog from '@/components/business-expenses/DeleteExpenseDialog';
import ExpenseSummary from '@/components/business-expenses/ExpenseSummary';
import ExpensesTable from '@/components/business-expenses/ExpensesTable';
import { ExpenseFormData } from '@/types/business-expense';

const BusinessExpenses = () => {
  const {
    expenses,
    expenseSummary,
    isLoading,
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
    isAddingExpense,
    isUpdatingExpense,
    isDeletingExpense,
    confirmDelete,
    refetch
  } = useBusinessExpenses();

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    
    console.log("Expenses data:", expenses?.length, "items");
    return expenses;
  }, [expenses]);

  console.log("Filtered expenses:", filteredExpenses?.length, "items");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading expenses...</span>
      </div>
    );
  }

  // Wrapper functions to handle the void return type expected by ExpenseModal
  const handleAddExpense = async (data: ExpenseFormData): Promise<void> => {
    await addExpense(data);
    return;
  };

  const handleUpdateExpense = async (data: ExpenseFormData): Promise<void> => {
    if (editingExpense) {
      await updateExpense({ id: editingExpense.id, data });
    }
    return;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-orange-500" />
            Expenses Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track and manage your business expenses
          </p>
        </div>
        <Button onClick={openAddExpense} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <ExpenseSummary summary={expenseSummary} />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Expense Records</CardTitle>
          <CardDescription>
            View and manage all your recorded expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <ExpensesTable
              expenses={filteredExpenses}
              onEdit={openEditExpense}
              onDelete={openDeleteDialog}
              isLoading={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Use the refactored ExpenseModal component that uses the new form */}
      <ExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={closeAddExpense}
        onSubmit={handleAddExpense}
        isLoading={isAddingExpense}
        title="Add New Expense"
      />

      {editingExpense && (
        <ExpenseModal
          isOpen={!!editingExpense}
          onClose={closeEditExpense}
          expense={editingExpense}
          onSubmit={handleUpdateExpense}
          isLoading={isUpdatingExpense}
          title="Edit Expense"
        />
      )}

      <DeleteExpenseDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        isLoading={isDeletingExpense}
      />
    </div>
  );
};

export default BusinessExpenses;
