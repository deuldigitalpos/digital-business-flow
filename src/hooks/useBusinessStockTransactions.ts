
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessStockTransaction } from '@/types/business-stock';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessStockTransactions() {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-stock-transactions', business?.id],
    queryFn: async () => {
      if (!business?.id) {
        return [];
      }

      // First, fetch the stock transactions
      const { data: transactions, error } = await supabase
        .from('business_stock_transactions')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stock transactions:', error);
        throw error;
      }

      // Now enrich the transactions with item names through separate queries
      const enrichedTransactions = await Promise.all(
        transactions.map(async transaction => {
          let itemName = 'Unknown';
          
          if (transaction.item_type === 'product') {
            // Get product name
            const { data: product, error: prodError } = await supabase
              .from('business_products')
              .select('name')
              .eq('id', transaction.item_id)
              .single();
            
            if (!prodError && product) {
              itemName = product.name;
            }
          } else if (transaction.item_type === 'ingredient') {
            // Get ingredient name
            const { data: ingredient, error: ingredError } = await supabase
              .from('business_ingredients')
              .select('name')
              .eq('id', transaction.item_id)
              .single();
            
            if (!ingredError && ingredient) {
              itemName = ingredient.name;
            }
          } else if (transaction.item_type === 'consumable') {
            // Get consumable name
            const { data: consumable, error: consError } = await supabase
              .from('business_consumables')
              .select('name')
              .eq('id', transaction.item_id)
              .single();
            
            if (!consError && consumable) {
              itemName = consumable.name;
            }
          }

          return {
            ...transaction,
            item_name: itemName
          };
        })
      );

      return enrichedTransactions as BusinessStockTransaction[];
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

      // First, fetch the stock transactions with limit
      const { data: transactions, error } = await supabase
        .from('business_stock_transactions')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent stock transactions:', error);
        throw error;
      }

      // Now enrich the transactions with item names through separate queries
      const enrichedTransactions = await Promise.all(
        transactions.map(async transaction => {
          let itemName = 'Unknown';
          
          if (transaction.item_type === 'product') {
            // Get product name
            const { data: product, error: prodError } = await supabase
              .from('business_products')
              .select('name')
              .eq('id', transaction.item_id)
              .single();
            
            if (!prodError && product) {
              itemName = product.name;
            }
          } else if (transaction.item_type === 'ingredient') {
            // Get ingredient name
            const { data: ingredient, error: ingredError } = await supabase
              .from('business_ingredients')
              .select('name')
              .eq('id', transaction.item_id)
              .single();
            
            if (!ingredError && ingredient) {
              itemName = ingredient.name;
            }
          } else if (transaction.item_type === 'consumable') {
            // Get consumable name
            const { data: consumable, error: consError } = await supabase
              .from('business_consumables')
              .select('name')
              .eq('id', transaction.item_id)
              .single();
            
            if (!consError && consumable) {
              itemName = consumable.name;
            }
          }

          return {
            ...transaction,
            item_name: itemName
          };
        })
      );

      return enrichedTransactions as BusinessStockTransaction[];
    },
    enabled: !!business?.id,
  });
}
