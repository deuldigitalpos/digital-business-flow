
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

      const { data, error } = await supabase
        .from('business_stock_transactions')
        .select(`
          *,
          business_products(name),
          business_ingredients(name),
          business_consumables(name)
        `)
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent stock transactions:', error);
        throw error;
      }

      // Add a display name based on the item_type
      const transactions = data.map(transaction => {
        let itemName = 'Unknown';
        
        if (transaction.item_type === 'product' && transaction.business_products) {
          itemName = transaction.business_products.name;
        } else if (transaction.item_type === 'ingredient' && transaction.business_ingredients) {
          itemName = transaction.business_ingredients.name;
        } else if (transaction.item_type === 'consumable' && transaction.business_consumables) {
          itemName = transaction.business_consumables.name;
        }
        
        return {
          ...transaction,
          item_name: itemName
        };
      });

      return transactions;
    },
    enabled: !!business?.id,
  });
}
