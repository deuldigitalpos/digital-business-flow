
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

      console.log('Creating stock transaction with business user ID:', businessUser.id);
      
      try {
        // Set the business user ID in the session variable
        await supabase.rpc('set_business_user_id', { business_user_id: businessUser.id });
        
        // Insert the stock transaction record
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

        // Our database trigger should handle the stock update, but we'll double-check
        // by getting the updated quantity
        let updatedQuantity: number | null = null;
        let itemName: string | null = null;
        
        if (stockData.item_type === 'product') {
          const { data: product, error: productError } = await supabase
            .from('business_products')
            .select('quantity_available, name')
            .eq('id', stockData.item_id)
            .single();
          
          if (productError) {
            console.error('Error fetching updated product quantity:', productError);
          } else {
            updatedQuantity = product.quantity_available;
            itemName = product.name;
          }
        } else if (stockData.item_type === 'ingredient') {
          const { data: ingredient, error: ingredientError } = await supabase
            .from('business_ingredients')
            .select('quantity_available, name')
            .eq('id', stockData.item_id)
            .single();
          
          if (ingredientError) {
            console.error('Error fetching updated ingredient quantity:', ingredientError);
          } else {
            updatedQuantity = ingredient.quantity_available;
            itemName = ingredient.name;
          }
        } else if (stockData.item_type === 'consumable') {
          const { data: consumable, error: consumableError } = await supabase
            .from('business_consumables')
            .select('quantity_available, name')
            .eq('id', stockData.item_id)
            .single();
          
          if (consumableError) {
            console.error('Error fetching updated consumable quantity:', consumableError);
          } else {
            updatedQuantity = consumable.quantity_available;
            itemName = consumable.name;
          }
        }
        
        console.log(`Updated quantity for ${stockData.item_type} (${itemName}): ${updatedQuantity}`);
        
        return {
          ...data,
          updatedQuantity,
          itemName
        };
      } catch (error) {
        console.error('Error in createStockTransaction:', error);
        throw error;
      }
    },
    onSuccess: (result, variables) => {
      // Invalidate the stock transactions list
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
      
      const actionType = variables.transaction_type === 'increase' ? 'increased' : 'decreased';
      const updatedText = result.updatedQuantity !== null ? ` (New quantity: ${result.updatedQuantity})` : '';
      
      toast.success(`${result.itemName || 'Item'} stock ${actionType} by ${variables.quantity}${updatedText}`);
    },
    onError: (error) => {
      console.error('Failed to update stock:', error);
      toast.error(`Failed to update stock: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return {
    createStockTransaction
  };
}
