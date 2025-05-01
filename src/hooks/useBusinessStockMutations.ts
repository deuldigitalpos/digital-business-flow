
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';
import { StockTransaction } from './useBusinessStockTransactions';

export const useBusinessStockMutations = () => {
  const { businessUser } = useBusinessAuth();
  const queryClient = useQueryClient();

  const createStockTransaction = useMutation({
    mutationFn: async (transaction: Omit<StockTransaction, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => {
      if (!businessUser?.business_id) {
        throw new Error('Business ID is missing');
      }

      // Calculate unpaid amount if not provided
      const unpaidAmount = transaction.unpaid_amount ?? 
        Math.max(0, (transaction.total_cost - (transaction.discount || 0)) - (transaction.paid_amount || 0));

      const { data, error } = await supabase
        .from('business_stock_transactions')
        .insert([
          {
            ...transaction,
            business_id: businessUser.business_id,
            created_by: businessUser.id,
            unpaid_amount: unpaidAmount
          }
        ])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating stock transaction:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Stock transaction recorded successfully');
      queryClient.invalidateQueries({ queryKey: ['business-stock-transactions'] });
      // Also invalidate inventory quantities
      queryClient.invalidateQueries({ queryKey: ['business-consumables'] });
      queryClient.invalidateQueries({ queryKey: ['business-ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['business-addons'] });
      queryClient.invalidateQueries({ queryKey: ['business-products'] });
    },
    onError: (error) => {
      toast.error(`Failed to record stock transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateStockTransaction = useMutation({
    mutationFn: async (transaction: Partial<StockTransaction> & { id: string }) => {
      const { id, ...updateData } = transaction;

      // If updating payment related fields, recalculate unpaid amount
      if ('total_cost' in updateData || 'discount' in updateData || 'paid_amount' in updateData) {
        // Get the current transaction to use values that aren't being updated
        const { data: currentTransaction } = await supabase
          .from('business_stock_transactions')
          .select('total_cost, discount, paid_amount')
          .eq('id', id)
          .single();
        
        const totalCost = 'total_cost' in updateData ? updateData.total_cost! : currentTransaction.total_cost;
        const discount = 'discount' in updateData ? updateData.discount! : (currentTransaction.discount || 0);
        const paidAmount = 'paid_amount' in updateData ? updateData.paid_amount! : (currentTransaction.paid_amount || 0);
        
        updateData.unpaid_amount = Math.max(0, (totalCost - discount) - paidAmount);
      }

      const { data, error } = await supabase
        .from('business_stock_transactions')
        .update(updateData)
        .eq('id', id)
        .eq('business_id', businessUser?.business_id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating stock transaction:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Stock transaction updated successfully');
      queryClient.invalidateQueries({ queryKey: ['business-stock-transactions'] });
    },
    onError: (error) => {
      toast.error(`Failed to update stock transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteStockTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_stock_transactions')
        .delete()
        .eq('id', id)
        .eq('business_id', businessUser?.business_id);

      if (error) {
        console.error('Error deleting stock transaction:', error);
        throw new Error(error.message);
      }

      return id;
    },
    onSuccess: () => {
      toast.success('Stock transaction deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['business-stock-transactions'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete stock transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return {
    createStockTransaction,
    updateStockTransaction,
    deleteStockTransaction
  };
};

export default useBusinessStockMutations;
