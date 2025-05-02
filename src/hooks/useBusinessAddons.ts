
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

      // Process the data without units for now
      const processedAddons = addons.map(addon => {
        return {
          ...addon,
          unit: null, // We'll handle units separately if needed
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
