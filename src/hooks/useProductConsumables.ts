
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductConsumable } from '@/types/business-product';

export const useProductConsumables = (productId?: string) => {
  const query = useQuery({
    queryKey: ['product-consumables', productId],
    queryFn: async (): Promise<ProductConsumable[]> => {
      if (!productId) {
        return [];
      }
      
      // Get consumables without relations that cause errors
      const { data: consumableRecords, error } = await supabase
        .from('business_product_consumables')
        .select(`id, product_id, consumable_id, quantity, unit_id, cost`)
        .eq('product_id', productId);
      
      if (error) {
        console.error('Error fetching product consumables:', error);
        throw error;
      }

      // If no consumables, return empty array
      if (!consumableRecords || consumableRecords.length === 0) {
        return [];
      }

      // Get consumable info separately
      const consumableIds = consumableRecords.map(r => r.consumable_id);
      const { data: consumables } = await supabase
        .from('business_consumables')
        .select(`id, name, unit_id`)
        .in('id', consumableIds);

      // Get units separately
      const unitIds = [
        ...consumableRecords.filter(r => r.unit_id).map(r => r.unit_id),
        ...consumables.filter(c => c.unit_id).map(c => c.unit_id)
      ].filter(Boolean);
      
      const { data: units } = await supabase
        .from('business_units')
        .select(`id, name, short_name`)
        .in('id', unitIds);

      // Create maps for easy lookup
      const consumableMap = consumables.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, any>);
      
      const unitMap = units.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, any>);

      // Process data to ensure correct types
      const processedData = consumableRecords.map(item => {
        const consumableData = consumableMap[item.consumable_id];
        const recipeUnitData = item.unit_id ? unitMap[item.unit_id] : null;
        const consumableUnitData = consumableData?.unit_id ? unitMap[consumableData.unit_id] : null;
        
        return {
          ...item,
          name: consumableData?.name,
          unit: recipeUnitData || null,
          consumable: consumableData ? {
            id: consumableData.id,
            name: consumableData.name,
            unit: consumableUnitData || null
          } : null
        };
      });

      return processedData as ProductConsumable[];
    },
    enabled: !!productId
  });

  return {
    consumables: query.data || [],
    isLoading: query.isLoading,
    error: query.error
  };
};

export default useProductConsumables;
