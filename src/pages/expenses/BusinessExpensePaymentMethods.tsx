
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Loader2, CreditCard } from 'lucide-react';
import { useExpensePaymentMethods } from '@/hooks/expenses/useExpensePaymentMethods';
import ExpensePaymentMethodModal from '@/components/business-expenses/payment-methods/ExpensePaymentMethodModal';
import DeleteExpensePaymentMethodDialog from '@/components/business-expenses/payment-methods/DeleteExpensePaymentMethodDialog';
import ExpensePaymentMethodsTable from '@/components/business-expenses/payment-methods/ExpensePaymentMethodsTable';

const BusinessExpensePaymentMethods = () => {
  const {
    paymentMethods,
    isLoading,
    isAddPaymentMethodOpen,
    editingPaymentMethod,
    isDeleteDialogOpen,
    openAddPaymentMethod,
    closeAddPaymentMethod,
    openEditPaymentMethod,
    closeEditPaymentMethod,
    openDeleteDialog,
    closeDeleteDialog,
    addPaymentMethod,
    updatePaymentMethod,
    isAddingPaymentMethod,
    isUpdatingPaymentMethod,
    isDeletingPaymentMethod,
    confirmDelete
  } = useExpensePaymentMethods();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading payment methods...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-orange-500" />
            Expense Payment Methods
          </h1>
          <p className="text-muted-foreground">
            Manage your expense payment methods
          </p>
        </div>
        <Button onClick={openAddPaymentMethod} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Methods used to pay for your expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpensePaymentMethodsTable
            paymentMethods={paymentMethods}
            onEdit={openEditPaymentMethod}
            onDelete={openDeleteDialog}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Add Payment Method Modal */}
      <ExpensePaymentMethodModal
        isOpen={isAddPaymentMethodOpen}
        onClose={closeAddPaymentMethod}
        onSubmit={addPaymentMethod}
        isLoading={isAddingPaymentMethod}
        title="Add New Payment Method"
      />

      {/* Edit Payment Method Modal */}
      {editingPaymentMethod && (
        <ExpensePaymentMethodModal
          isOpen={!!editingPaymentMethod}
          onClose={closeEditPaymentMethod}
          paymentMethod={editingPaymentMethod}
          onSubmit={(data) => updatePaymentMethod({ id: editingPaymentMethod.id, data })}
          isLoading={isUpdatingPaymentMethod}
          title="Edit Payment Method"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteExpensePaymentMethodDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        isLoading={isDeletingPaymentMethod}
      />
    </div>
  );
};

export default BusinessExpensePaymentMethods;
