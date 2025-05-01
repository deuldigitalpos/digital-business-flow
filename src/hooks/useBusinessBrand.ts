
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessBrand(brandId: string | undefined) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-brand', brandId],
    queryFn: async () => {
      if (!brandId || !business?.id) {
        return null;
      }

      const { data, error } = await supabase
        .from('business_brands')
        .select('*')
        .eq('id', brandId)
        .eq('business_id', business.id)
        .single();

      if (error) {
        console.error('Error fetching brand:', error);
        return null;
      }

      return data;
    },
    enabled: !!brandId && !!business?.id,
  });
}
