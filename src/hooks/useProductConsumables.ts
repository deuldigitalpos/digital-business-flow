
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
      
      const { data, error } = await supabase
        .from('business_product_consumables')
        .select(`
          *,
          consumable:business_consumables(
            id, 
            name,
            unit:business_units(id, name, short_name)
          ),
          unit:business_units(id, name, short_name)
        `)
        .eq('product_id', productId);
      
      if (error) {
        console.error('Error fetching product consumables:', error);
        throw error;
      }

      // Process data to ensure correct types
      const processedData = data.map(item => {
        // Handle possible SelectQueryError for unit
        const unitData = item.unit && !item.unit.error
          ? { id: item.unit.id, name: item.unit.name, short_name: item.unit.short_name }
          : null;

        // Handle possible SelectQueryError for consumable.unit
        let consumableData = null;
        if (item.consumable && !item.consumable.error) {
          const consumableUnitData = item.consumable.unit && !item.consumable.unit.error
            ? { id: item.consumable.unit.id, name: item.consumable.unit.name, short_name: item.consumable.unit.short_name }
            : null;
            
          consumableData = {
            id: item.consumable.id,
            name: item.consumable.name,
            unit: consumableUnitData
          };
        }

        return {
          ...item,
          unit: unitData,
          consumable: consumableData
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
