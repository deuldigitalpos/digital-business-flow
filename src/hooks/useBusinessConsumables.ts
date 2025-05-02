
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { UUID } from '@/types/common';
import { BusinessUnit, UnitType } from '@/types/business-unit';

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
  unit?: BusinessUnit | null;
}

export const useBusinessConsumables = () => {
  const { businessUser } = useBusinessAuth();
  
  const query = useQuery({
    queryKey: ['business-consumables'],
    queryFn: async (): Promise<BusinessConsumable[]> => {
      if (!businessUser?.business_id) {
        return [];
      }
      
      // First fetch all consumables without trying to get unit_id
      const { data: consumables, error: consumablesError } = await supabase
        .from('business_consumables')
        .select(`
          id,
          business_id,
          name,
          description,
          category_id,
          image_url,
          created_at,
          updated_at,
          category:business_categories(id, name)
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

      // Create a map for quantities and unit_ids
      const inventoryMap: Record<string, any> = {};
      quantities?.forEach(item => {
        inventoryMap[item.item_id] = item;
      });

      // Process the data - no unit data for now
      const processedConsumables = consumables.map(consumable => {
        return {
          ...consumable,
          unit_id: null, // Set to null as it doesn't exist in the table
          unit: null, // Set to null as we can't fetch unit data without unit_id
          quantity: inventoryMap[consumable.id]?.quantity || 0,
          average_cost: inventoryMap[consumable.id]?.average_cost || 0,
          total_value: inventoryMap[consumable.id]?.total_value || 0
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
