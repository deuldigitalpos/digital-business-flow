
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
  total_value?: number;
}

export const useBusinessConsumables = () => {
  const { businessUser } = useBusinessAuth();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['business-consumables'],
    queryFn: async (): Promise<BusinessConsumable[]> => {
      if (!businessUser?.business_id) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('business_consumables')
        .select(`
          *,
          business_inventory_quantities!inner(quantity, average_cost, total_value)
        `)
        .eq('business_id', businessUser.business_id)
        .eq('business_inventory_quantities.item_type', 'consumable');
      
      if (error) {
        console.error('Error fetching consumables:', error);
        throw error;
      }

      // Process the data to flatten the structure
      return data.map(item => ({
        ...item,
        quantity: item.business_inventory_quantities?.quantity || 0,
        average_cost: item.business_inventory_quantities?.average_cost || 0,
        total_value: item.business_inventory_quantities?.total_value || 0
      }));
    },
    enabled: !!businessUser?.business_id
  });

  return {
    consumables: data || [],
    isLoading,
    error
  };
};

export default useBusinessConsumables;
