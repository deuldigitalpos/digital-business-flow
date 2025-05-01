
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessWarranty(warrantyId: string | undefined) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-warranty', warrantyId],
    queryFn: async () => {
      if (!warrantyId || !business?.id) {
        return null;
      }

      const { data, error } = await supabase
        .from('business_warranties')
        .select('*')
        .eq('id', warrantyId)
        .eq('business_id', business.id)
        .single();

      if (error) {
        console.error('Error fetching warranty:', error);
        return null;
      }

      return data;
    },
    enabled: !!warrantyId && !!business?.id,
  });
}
