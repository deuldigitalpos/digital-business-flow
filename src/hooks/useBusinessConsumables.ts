
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export interface BusinessConsumable {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  unit_id: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  category?: { name: string } | null;
  unit?: { name: string; short_name: string } | null;
  quantity?: number;
  average_cost?: number;
  total_value?: number;
}

export const useBusinessConsumables = (filters: {
  category_id?: string | null;
  search?: string;
} = {}) => {
  const { businessUser } = useBusinessAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Query to fetch all consumables for the business
  const { data: consumables, isLoading: isLoadingConsumables, error, refetch } = useQuery({
    queryKey: ['business-consumables', businessUser?.business_id, filters],
    queryFn: async () => {
      if (!businessUser?.business_id) return [];

      let query = supabase
        .from('business_consumables')
        .select(`
          *,
          category:category_id(name),
          unit:unit_id(name, short_name)
        `)
        .eq('business_id', businessUser.business_id);

      // Apply filters
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query.order('name');

      if (error) {
        console.error('Error fetching consumables:', error);
        toast.error('Failed to load consumables');
        return [];
      }

      // Fetch inventory quantities for these consumables
      const consumableIds = data.map((c: BusinessConsumable) => c.id);
      let quantities: Record<string, any> = {};

      if (consumableIds.length > 0) {
        const { data: quantityData, error: quantityError } = await supabase
          .from('business_inventory_quantities')
          .select('item_id, quantity, average_cost, total_value')
          .eq('business_id', businessUser.business_id)
          .eq('item_type', 'consumable')
          .in('item_id', consumableIds);

        if (quantityError) {
          console.error('Error fetching inventory quantities:', quantityError);
        } else {
          quantities = quantityData.reduce((acc: Record<string, any>, item: any) => {
            acc[item.item_id] = item;
            return acc;
          }, {});
        }
      }

      // Merge quantities with consumables data
      return data.map((consumable: BusinessConsumable) => ({
        ...consumable,
        quantity: quantities[consumable.id]?.quantity || 0,
        average_cost: quantities[consumable.id]?.average_cost || 0,
        total_value: quantities[consumable.id]?.total_value || 0
      }));
    },
    enabled: !!businessUser?.business_id,
  });

  return {
    consumables,
    isLoading: isLoadingConsumables || isLoading,
    error,
    refetch
  };
};

export default useBusinessConsumables;
