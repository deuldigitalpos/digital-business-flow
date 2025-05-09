
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { ExpensePaymentMethod, ExpensePaymentMethodFormData } from '@/types/business-expense';

export const useExpensePaymentMethods = () => {
  const { business } = useBusinessAuth();
  const queryClient = useQueryClient();

  // UI state
  const [isAddPaymentMethodOpen, setIsAddPaymentMethodOpen] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<ExpensePaymentMethod | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<string | null>(null);

  // UI actions
  const openAddPaymentMethod = () => setIsAddPaymentMethodOpen(true);
  const closeAddPaymentMethod = () => setIsAddPaymentMethodOpen(false);
  
  const openEditPaymentMethod = (paymentMethod: ExpensePaymentMethod) => setEditingPaymentMethod(paymentMethod);
  const closeEditPaymentMethod = () => setEditingPaymentMethod(null);
  
  const openDeleteDialog = (id: string) => {
    setPaymentMethodToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setPaymentMethodToDelete(null);
  };

  // Fetch payment methods
  const {
    data: paymentMethods = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['expense-payment-methods', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const { data, error } = await supabase
        .from('business_expense_payment_methods')
        .select('*')
        .eq('business_id', business.id)
        .order('name');
      
      if (error) {
        toast.error('Failed to load expense payment methods');
        throw error;
      }
      
      return data as ExpensePaymentMethod[];
    },
    enabled: !!business?.id
  });

  // Add payment method mutation
  const { 
    mutate: addPaymentMethod, 
    isPending: isAddingPaymentMethod
  } = useMutation({
    mutationFn: async (data: ExpensePaymentMethodFormData) => {
      if (!business?.id) throw new Error('No business selected');
      
      const { error, data: newPaymentMethod } = await supabase
        .from('business_expense_payment_methods')
        .insert({
          business_id: business.id,
          name: data.name,
          description: data.description || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return newPaymentMethod;
    },
    onSuccess: () => {
      toast.success('Payment method added successfully');
      queryClient.invalidateQueries({ queryKey: ['expense-payment-methods'] });
      closeAddPaymentMethod();
    },
    onError: (error) => {
      toast.error(`Failed to add payment method: ${error.message}`);
    }
  });

  // Update payment method mutation
  const { 
    mutate: updatePaymentMethod, 
    isPending: isUpdatingPaymentMethod 
  } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ExpensePaymentMethodFormData }) => {
      if (!business?.id) throw new Error('No business selected');
      
      const { error, data: updatedPaymentMethod } = await supabase
        .from('business_expense_payment_methods')
        .update({
          name: data.name,
          description: data.description || null,
        })
        .eq('id', id)
        .eq('business_id', business.id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedPaymentMethod;
    },
    onSuccess: () => {
      toast.success('Payment method updated successfully');
      queryClient.invalidateQueries({ queryKey: ['expense-payment-methods'] });
      closeEditPaymentMethod();
    },
    onError: (error) => {
      toast.error(`Failed to update payment method: ${error.message}`);
    }
  });

  // Delete payment method mutation
  const { 
    mutate: deletePaymentMethod, 
    isPending: isDeletingPaymentMethod 
  } = useMutation({
    mutationFn: async (id: string) => {
      if (!business?.id) throw new Error('No business selected');
      
      const { error } = await supabase
        .from('business_expense_payment_methods')
        .delete()
        .eq('id', id)
        .eq('business_id', business.id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success('Payment method deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['expense-payment-methods'] });
      closeDeleteDialog();
    },
    onError: (error) => {
      toast.error(`Failed to delete payment method: ${error.message}`);
    }
  });

  // Confirm deletion
  const confirmDelete = () => {
    if (paymentMethodToDelete) {
      deletePaymentMethod(paymentMethodToDelete);
    }
  };

  return {
    paymentMethods,
    isLoading,
    error,
    refetch,
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
  };
};
