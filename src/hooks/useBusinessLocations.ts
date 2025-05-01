
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessLocation } from '@/types/business-location';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessLocations() {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-locations', business?.id],
    queryFn: async () => {
      if (!business?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('business_locations')
        .select('*')
        .eq('business_id', business.id);

      if (error) {
        console.error('Error fetching locations:', error);
        throw error;
      }

      return data as BusinessLocation[];
    },
    enabled: !!business?.id,
  });
}

export function useBusinessLocation(id: string | undefined) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-location', id],
    queryFn: async () => {
      if (!id || !business?.id) {
        throw new Error('Location ID or business ID is missing');
      }

      const { data, error } = await supabase
        .from('business_locations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching location details:', error);
        throw error;
      }

      return data as BusinessLocation;
    },
    enabled: !!id && !!business?.id,
  });
}
