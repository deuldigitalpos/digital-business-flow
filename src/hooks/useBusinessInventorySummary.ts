
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export interface InventorySummary {
  totalValue: number;
  totalItems: number;
  lowStockItems: number;
  recentTransactions: number;
  totalProducts: number;
  totalConsumables: number;
  totalIngredients: number;
  totalAddons: number;
}

export const useBusinessInventorySummary = () => {
  const { businessUser } = useBusinessAuth();

  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['business-inventory-summary', businessUser?.business_id],
    queryFn: async (): Promise<InventorySummary> => {
      if (!businessUser?.business_id) {
        return {
          totalValue: 0,
          totalItems: 0,
          lowStockItems: 0,
          recentTransactions: 0,
          totalProducts: 0,
          totalConsumables: 0,
          totalIngredients: 0,
          totalAddons: 0
        };
      }

      // Fetch total inventory value and item count
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('business_inventory_quantities')
        .select('total_value, item_type')
        .eq('business_id', businessUser.business_id);

      if (inventoryError) {
        console.error('Error fetching inventory data:', inventoryError);
        return {
          totalValue: 0,
          totalItems: 0,
          lowStockItems: 0,
          recentTransactions: 0,
          totalProducts: 0,
          totalConsumables: 0,
          totalIngredients: 0,
          totalAddons: 0
        };
      }

      // Fetch items with low stock
      const { data: lowStockData, error: lowStockError } = await supabase
        .from('business_inventory_quantities')
        .select('id')
        .eq('business_id', businessUser.business_id)
        .lt('quantity', 10); // Assuming less than 10 is low stock

      if (lowStockError) {
        console.error('Error fetching low stock items:', lowStockError);
      }

      // Fetch recent transactions (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentTransactions, error: transactionsError } = await supabase
        .from('business_stock_transactions')
        .select('id')
        .eq('business_id', businessUser.business_id)
        .gte('transaction_date', thirtyDaysAgo.toISOString());

      if (transactionsError) {
        console.error('Error fetching recent transactions:', transactionsError);
      }

      // Count items by type
      const productCount = inventoryData?.filter(item => item.item_type === 'product').length || 0;
      const consumableCount = inventoryData?.filter(item => item.item_type === 'consumable').length || 0;
      const ingredientCount = inventoryData?.filter(item => item.item_type === 'ingredient').length || 0;
      const addonCount = inventoryData?.filter(item => item.item_type === 'addon').length || 0;

      // Calculate total value
      const totalValue = inventoryData?.reduce((sum, item) => sum + (item.total_value || 0), 0) || 0;

      return {
        totalValue,
        totalItems: inventoryData?.length || 0,
        lowStockItems: lowStockData?.length || 0,
        recentTransactions: recentTransactions?.length || 0,
        totalProducts: productCount,
        totalConsumables: consumableCount,
        totalIngredients: ingredientCount,
        totalAddons: addonCount
      };
    },
    enabled: !!businessUser?.business_id,
  });

  return {
    summary,
    isLoading,
    error,
  };
};

export default useBusinessInventorySummary;
