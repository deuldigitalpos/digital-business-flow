
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Loader2, Category } from 'lucide-react';
import { useExpenseCategories } from '@/hooks/expenses/useExpenseCategories';
import ExpenseCategoryModal from '@/components/business-expenses/categories/ExpenseCategoryModal';
import DeleteExpenseCategoryDialog from '@/components/business-expenses/categories/DeleteExpenseCategoryDialog';
import ExpenseCategoriesTable from '@/components/business-expenses/categories/ExpenseCategoriesTable';

const BusinessExpenseCategories = () => {
  const {
    categories,
    isLoading,
    isAddCategoryOpen,
    editingCategory,
    isDeleteDialogOpen,
    openAddCategory,
    closeAddCategory,
    openEditCategory,
    closeEditCategory,
    openDeleteDialog,
    closeDeleteDialog,
    addCategory,
    updateCategory,
    isAddingCategory,
    isUpdatingCategory,
    isDeletingCategory,
    confirmDelete
  } = useExpenseCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Category className="h-8 w-8 text-orange-500" />
            Expense Categories
          </h1>
          <p className="text-muted-foreground">
            Manage your expense categories
          </p>
        </div>
        <Button onClick={openAddCategory} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Classify your expenses with these categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseCategoriesTable
            categories={categories}
            onEdit={openEditCategory}
            onDelete={openDeleteDialog}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Add Category Modal */}
      <ExpenseCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={closeAddCategory}
        onSubmit={addCategory}
        isLoading={isAddingCategory}
        title="Add New Category"
      />

      {/* Edit Category Modal */}
      {editingCategory && (
        <ExpenseCategoryModal
          isOpen={!!editingCategory}
          onClose={closeEditCategory}
          category={editingCategory}
          onSubmit={(data) => updateCategory({ id: editingCategory.id, data })}
          isLoading={isUpdatingCategory}
          title="Edit Category"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteExpenseCategoryDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        isLoading={isDeletingCategory}
      />
    </div>
  );
};

export default BusinessExpenseCategories;
