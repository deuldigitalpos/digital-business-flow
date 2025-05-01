
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export interface BusinessAddon {
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

export const useBusinessAddons = () => {
  const { businessUser } = useBusinessAuth();
  
  const query = useQuery({
    queryKey: ['business-addons'],
    queryFn: async (): Promise<BusinessAddon[]> => {
      if (!businessUser?.business_id) {
        return [];
      }
      
      // First, fetch the add-ons
      const { data: addons, error: addonsError } = await supabase
        .from('business_addons')
        .select(`
          *,
          category:business_categories(id, name),
          unit:business_units(id, name, short_name)
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

      // Process the data to add quantities
      const processedAddons = addons.map(addon => ({
        ...addon,
        quantity: quantityMap[addon.id]?.quantity || 0,
        average_cost: quantityMap[addon.id]?.average_cost || 0,
        total_value: quantityMap[addon.id]?.total_value || 0
      }));

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
