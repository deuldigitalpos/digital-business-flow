
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessConsumable } from '@/types/business-consumable';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessConsumables() {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-consumables', business?.id],
    queryFn: async () => {
      if (!business?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('business_consumables')
        .select('*')
        .eq('business_id', business.id);

      if (error) {
        console.error('Error fetching consumables:', error);
        throw error;
      }

      return data as BusinessConsumable[];
    },
    enabled: !!business?.id,
  });
}

export function useBusinessConsumable(id: string | undefined) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-consumable', id],
    queryFn: async () => {
      if (!id || !business?.id) {
        throw new Error('Consumable ID or business ID is missing');
      }

      const { data, error } = await supabase
        .from('business_consumables')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching consumable details:', error);
        throw error;
      }

      return data as BusinessConsumable;
    },
    enabled: !!id && !!business?.id,
  });
}

export function useLowStockConsumables() {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['low-stock-consumables', business?.id],
    queryFn: async () => {
      if (!business?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('business_consumables')
        .select('*')
        .eq('business_id', business.id)
        .eq('status', 'Low Stock');

      if (error) {
        console.error('Error fetching low stock consumables:', error);
        throw error;
      }

      return data as BusinessConsumable[];
    },
    enabled: !!business?.id,
  });
}
