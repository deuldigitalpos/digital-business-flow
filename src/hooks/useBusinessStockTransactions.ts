
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessStockTransaction } from '@/types/business-stock';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessStockTransactions(itemType?: string, itemId?: string) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-stock-transactions', business?.id, itemType, itemId],
    queryFn: async () => {
      if (!business?.id) {
        return [];
      }

      let query = supabase
        .from('business_stock_transactions')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (itemType) {
        query = query.eq('item_type', itemType);
      }

      if (itemId) {
        query = query.eq('item_id', itemId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching stock transactions:', error);
        throw error;
      }

      return data as BusinessStockTransaction[];
    },
    enabled: !!business?.id,
  });
}

export function useRecentStockTransactions(limit: number = 10) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['recent-stock-transactions', business?.id, limit],
    queryFn: async () => {
      if (!business?.id) {
        return [];
      }

      // First, fetch the transactions
      const { data: transactions, error: transactionError } = await supabase
        .from('business_stock_transactions')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (transactionError) {
        console.error('Error fetching recent stock transactions:', transactionError);
        throw transactionError;
      }

      // Then for each transaction, fetch the item name based on the item_type
      const enhancedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          let itemName = 'Unknown';
          
          if (transaction.item_type === 'product') {
            const { data: product, error: productError } = await supabase
              .from('business_products')
              .select('name')
              .eq('id', transaction.item_id)
              .single();
            
            if (!productError && product) {
              itemName = product.name;
            }
          } else if (transaction.item_type === 'ingredient') {
            const { data: ingredient, error: ingredientError } = await supabase
              .from('business_ingredients')
              .select('name')
              .eq('id', transaction.item_id)
              .single();
            
            if (!ingredientError && ingredient) {
              itemName = ingredient.name;
            }
          } else if (transaction.item_type === 'consumable') {
            const { data: consumable, error: consumableError } = await supabase
              .from('business_consumables')
              .select('name')
              .eq('id', transaction.item_id)
              .single();
            
            if (!consumableError && consumable) {
              itemName = consumable.name;
            }
          }
          
          return {
            ...transaction,
            item_name: itemName
          };
        })
      );

      return enhancedTransactions;
    },
    enabled: !!business?.id,
  });
}
