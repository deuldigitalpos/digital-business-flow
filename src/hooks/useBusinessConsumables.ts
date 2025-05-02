
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
      
      // Fetch consumables with category and unit relations
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

      // Get the quantities from inventory table
      const { data: quantities, error: quantitiesError } = await supabase
        .from('business_inventory_quantities')
        .select('*')
        .eq('business_id', businessUser.business_id)
        .eq('item_type', 'consumable');
      
      if (quantitiesError) {
        console.error('Error fetching quantities:', quantitiesError);
        throw quantitiesError;
      }

      // Create a map for quantities
      const quantityMap: Record<string, any> = {};
      quantities?.forEach(item => {
        quantityMap[item.item_id] = item;
      });

      // Process the data with complete unit information
      const processedConsumables = consumables.map(consumable => {
        // Initialize unit value as null
        let unitValue = null;
        
        // First check if unit exists at all
        if (consumable.unit) {
          // Then check if it's a valid object (not null and not containing an error)
          if (typeof consumable.unit === 'object' && !('error' in consumable.unit)) {
            unitValue = consumable.unit;
          }
        }

        // Create a valid BusinessConsumable object
        return {
          ...consumable,
          unit: unitValue,
          quantity: quantityMap[consumable.id]?.quantity || 0,
          average_cost: quantityMap[consumable.id]?.average_cost || 0,
          total_value: quantityMap[consumable.id]?.total_value || 0
        } as BusinessConsumable;
      });

      return processedConsumables;
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
