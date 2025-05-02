
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
      
      // First fetch all consumables with all fields including unit_id
      const { data: consumables, error: consumablesError } = await supabase
        .from('business_consumables')
        .select(`
          id,
          business_id,
          name,
          description,
          category_id,
          unit_id,
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

      // Get the unit IDs that are not null
      const unitIds = consumables
        .filter(item => item.unit_id !== null)
        .map(item => item.unit_id);

      // Get units separately if there are any unit IDs
      let unitsMap: Record<string, BusinessUnit> = {};
      
      if (unitIds.length > 0) {
        const { data: units, error: unitsError } = await supabase
          .from('business_units')
          .select('*')
          .in('id', unitIds);
          
        if (unitsError) {
          console.error('Error fetching units:', unitsError);
        } else if (units) {
          // Create a map for easy lookup and convert string type to UnitType enum
          unitsMap = units.reduce((map, unit) => {
            map[unit.id] = {
              ...unit,
              type: unit.type as UnitType // Cast string type to UnitType enum
            };
            return map;
          }, {} as Record<string, BusinessUnit>);
        }
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

      // Combine the data
      const processedConsumables = consumables.map(consumable => {
        // Get the unit if it exists
        const unit = consumable.unit_id ? unitsMap[consumable.unit_id] : null;
        
        return {
          ...consumable,
          unit: unit,
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
