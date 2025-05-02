
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { BusinessAddon } from '@/types/business-addon';

export const useBusinessAddons = () => {
  const { businessUser } = useBusinessAuth();
  
  const query = useQuery({
    queryKey: ['business-addons'],
    queryFn: async (): Promise<BusinessAddon[]> => {
      if (!businessUser?.business_id) {
        return [];
      }
      
      // First, fetch the add-ons without the unit join that causes errors
      const { data: addons, error: addonsError } = await supabase
        .from('business_addons')
        .select(`
          *,
          category:business_categories(id, name)
        `)
        .eq('business_id', businessUser.business_id);
      
      if (addonsError) {
        console.error('Error fetching add-ons:', addonsError);
        throw addonsError;
      }

      // Get unit_ids from addons
      const addonUnitIds = addons
        .filter(addon => addon.unit_id)
        .map(addon => addon.unit_id)
        .filter(Boolean);

      // If we have units to fetch, get them separately
      let unitMap: Record<string, { id: string; name: string; short_name: string }> = {};
      
      if (addonUnitIds.length > 0) {
        const { data: units } = await supabase
          .from('business_units')
          .select('id, name, short_name')
          .in('id', addonUnitIds);
          
        if (units && units.length > 0) {
          unitMap = units.reduce((acc, unit) => {
            acc[unit.id] = unit;
            return acc;
          }, {} as Record<string, { id: string; name: string; short_name: string }>);
        }
      }

      // Then get the quantities from inventory table
      const { data: quantities, error: quantitiesError } = await supabase
        .from('business_inventory_quantities')
        .select('*')
        .eq('business_id', businessUser.business_id)
        .eq('item_type', 'addon');
      
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
      const processedAddons = addons.map(addon => {
        const unitData = addon.unit_id && unitMap[addon.unit_id]
          ? unitMap[addon.unit_id]
          : null;
          
        return {
          ...addon,
          unit: unitData,
          quantity: quantityMap[addon.id]?.quantity || 0,
          average_cost: quantityMap[addon.id]?.average_cost || 0,
          total_value: quantityMap[addon.id]?.total_value || 0
        };
      });

      return processedAddons as BusinessAddon[];
    },
    enabled: !!businessUser?.business_id
  });

  return {
    addons: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
};

export default useBusinessAddons;
