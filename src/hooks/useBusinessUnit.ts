
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessUnit } from '@/types/business-unit';

export function useBusinessUnit(id: string | undefined) {
  return useQuery({
    queryKey: ['business-unit', id],
    queryFn: async () => {
      if (!id) {
        return null;
      }

      const { data, error } = await supabase
        .from('business_units')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching unit details:', error);
        throw error;
      }

      return data as BusinessUnit;
    },
    enabled: !!id,
  });
}
