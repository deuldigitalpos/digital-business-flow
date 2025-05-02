
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export interface BusinessConsumable {
  id: string;
  business_id: string;
  name: string;
  description?: string | null;
  category_id?: string | null;
  unit_id?: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
  quantity?: number;
  average_cost?: number;
  total_value?: number;
  category?: { id: string; name: string } | null;
  unit?: { id: string; name: string; short_name: string } | null;
}

export const useBusinessConsumables = () => {
  const { businessUser } = useBusinessAuth();
  
  const query = useQuery({
    queryKey: ['business-consumables'],
    queryFn: async (): Promise<BusinessConsumable[]> => {
      if (!businessUser?.business_id) {
        return [];
      }
      
      // First, fetch the consumables
      const { data: consumables, error: consumablesError } = await supabase
        .from('business_consumables')
        .select(`
          *,
          category:business_categories(id, name),
          unit:business_units(id, name, short_name)
        `)
        .eq('business_id', businessUser.business_id);
      
      if (consumablesError) {
        console.error('Error fetching consumables:', consumablesError);
        throw consumablesError;
      }

      // Then get the quantities from inventory table
      const { data: quantities, error: quantitiesError } = await supabase
        .from('business_inventory_quantities')
        .select('*')
        .eq('business_id', businessUser.business_id)
        .eq('item_type', 'consumable');
      
      if (quantitiesError) {
        console.error('Error fetching quantities:', quantitiesError);
        throw quantitiesError;
      }

      // Merge the data
      const quantityMap: Record<string, any> = {};
      quantities?.forEach(item => {
        quantityMap[item.item_id] = item;
      });

      // Process the data to add quantities
      const processedConsumables = consumables.map(consumable => {
        // Handle possible SelectQueryError for unit
        const unitData = consumable.unit && !consumable.unit.error
          ? { id: consumable.unit.id, name: consumable.unit.name, short_name: consumable.unit.short_name }
          : null;
          
        return {
          ...consumable,
          unit: unitData,
          quantity: quantityMap[consumable.id]?.quantity || 0,
          average_cost: quantityMap[consumable.id]?.average_cost || 0,
          total_value: quantityMap[consumable.id]?.total_value || 0
        };
      });

      return processedConsumables as BusinessConsumable[];
    },
    enabled: !!businessUser?.business_id
  });

  return {
    consumables: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
};

export default useBusinessConsumables;
