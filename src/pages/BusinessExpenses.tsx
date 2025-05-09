
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Loader2, DollarSign } from 'lucide-react';
import { useBusinessExpenses } from '@/hooks/useBusinessExpenses';
import ExpenseModal from '@/components/business-expenses/ExpenseModal';
import DeleteExpenseDialog from '@/components/business-expenses/DeleteExpenseDialog';
import ExpenseSummary from '@/components/business-expenses/ExpenseSummary';
import ExpensesTable from '@/components/business-expenses/ExpensesTable';
import ExpenseFilters from '@/components/business-expenses/ExpenseFilters';

const BusinessExpenses = () => {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string | null>(null);

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
    confirmDelete
  } = useBusinessExpenses();

  // Filter expenses based on selected filters
  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    
    return expenses.filter(expense => {
      const matchesCategory = !categoryFilter || expense.category === categoryFilter;
      const matchesPaymentMethod = !paymentMethodFilter || expense.payment_method === paymentMethodFilter;
      return matchesCategory && matchesPaymentMethod;
    });
  }, [expenses, categoryFilter, paymentMethodFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading expenses...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-orange-500" />
            Expenses
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
          <ExpenseFilters
            categoryFilter={categoryFilter}
            paymentMethodFilter={paymentMethodFilter}
            onCategoryChange={setCategoryFilter}
            onPaymentMethodChange={setPaymentMethodFilter}
          />
          <ExpensesTable
            expenses={filteredExpenses}
            onEdit={openEditExpense}
            onDelete={openDeleteDialog}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Add Expense Modal */}
      <ExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={closeAddExpense}
        onSubmit={addExpense}
        isLoading={isAddingExpense}
        title="Add New Expense"
      />

      {/* Edit Expense Modal */}
      {editingExpense && (
        <ExpenseModal
          isOpen={!!editingExpense}
          onClose={closeEditExpense}
          expense={editingExpense}
          onSubmit={(data) => updateExpense({ id: editingExpense.id, data })}
          isLoading={isUpdatingExpense}
          title="Edit Expense"
        />
      )}

      {/* Delete Confirmation Dialog */}
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
