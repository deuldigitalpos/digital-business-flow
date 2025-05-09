
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { ExpenseCategory, ExpenseCategoryFormData } from '@/types/business-expense';

export const useExpenseCategories = () => {
  const { business } = useBusinessAuth();
  const queryClient = useQueryClient();

  // UI state
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // UI actions
  const openAddCategory = () => setIsAddCategoryOpen(true);
  const closeAddCategory = () => setIsAddCategoryOpen(false);
  
  const openEditCategory = (category: ExpenseCategory) => setEditingCategory(category);
  const closeEditCategory = () => setEditingCategory(null);
  
  const openDeleteDialog = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  // Fetch categories
  const {
    data: categories = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['expense-categories', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const { data, error } = await supabase
        .from('business_expense_categories')
        .select('*')
        .eq('business_id', business.id)
        .order('name');
      
      if (error) {
        toast.error('Failed to load expense categories');
        throw error;
      }
      
      return data as ExpenseCategory[];
    },
    enabled: !!business?.id
  });

  // Add category mutation
  const { 
    mutate: addCategory, 
    isPending: isAddingCategory
  } = useMutation({
    mutationFn: async (data: ExpenseCategoryFormData) => {
      if (!business?.id) throw new Error('No business selected');
      
      const { error, data: newCategory } = await supabase
        .from('business_expense_categories')
        .insert({
          business_id: business.id,
          name: data.name,
          description: data.description || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return newCategory;
    },
    onSuccess: () => {
      toast.success('Category added successfully');
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      closeAddCategory();
    },
    onError: (error) => {
      toast.error(`Failed to add category: ${error.message}`);
    }
  });

  // Update category mutation
  const { 
    mutate: updateCategory, 
    isPending: isUpdatingCategory 
  } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ExpenseCategoryFormData }) => {
      if (!business?.id) throw new Error('No business selected');
      
      const { error, data: updatedCategory } = await supabase
        .from('business_expense_categories')
        .update({
          name: data.name,
          description: data.description || null,
        })
        .eq('id', id)
        .eq('business_id', business.id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedCategory;
    },
    onSuccess: () => {
      toast.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      closeEditCategory();
    },
    onError: (error) => {
      toast.error(`Failed to update category: ${error.message}`);
    }
  });

  // Delete category mutation
  const { 
    mutate: deleteCategory, 
    isPending: isDeletingCategory 
  } = useMutation({
    mutationFn: async (id: string) => {
      if (!business?.id) throw new Error('No business selected');
      
      const { error } = await supabase
        .from('business_expense_categories')
        .delete()
        .eq('id', id)
        .eq('business_id', business.id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      closeDeleteDialog();
    },
    onError: (error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    }
  });

  // Confirm deletion
  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
    }
  };

  return {
    categories,
    isLoading,
    error,
    refetch,
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
  };
};
