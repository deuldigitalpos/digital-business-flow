
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StockTransactionFormValues } from '@/types/business-stock';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export function useBusinessStockMutations() {
  const queryClient = useQueryClient();
  const { business, businessUser } = useBusinessAuth();

  const createStockTransaction = useMutation({
    mutationFn: async (stockData: StockTransactionFormValues) => {
      if (!business?.id || !businessUser?.id) {
        throw new Error('Business ID and User ID are required');
      }

      const { data, error } = await supabase
        .from('business_stock_transactions')
        .insert({
          business_id: business.id,
          item_type: stockData.item_type,
          item_id: stockData.item_id,
          transaction_type: stockData.transaction_type,
          quantity: stockData.quantity,
          adjustment_reason: stockData.adjustment_reason,
          reason: stockData.reason,
          updated_by: businessUser.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating stock transaction:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['business-stock-transactions', business?.id] 
      });
      
      // Invalidate the specific item type's data as well
      if (variables.item_type === 'product') {
        queryClient.invalidateQueries({ 
          queryKey: ['business-products', business?.id]
        });
        queryClient.invalidateQueries({ 
          queryKey: ['business-product', variables.item_id]
        });
      } else if (variables.item_type === 'ingredient') {
        queryClient.invalidateQueries({ 
          queryKey: ['business-ingredients', business?.id]
        });
        queryClient.invalidateQueries({ 
          queryKey: ['business-ingredient', variables.item_id]
        });
      } else if (variables.item_type === 'consumable') {
        queryClient.invalidateQueries({ 
          queryKey: ['business-consumables', business?.id]
        });
        queryClient.invalidateQueries({ 
          queryKey: ['business-consumable', variables.item_id]
        });
      }
      
      toast.success('Stock updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update stock:', error);
      toast.error('Failed to update stock');
    }
  });

  return {
    createStockTransaction
  };
}
