
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessCategory(categoryId: string | undefined) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-category', categoryId],
    queryFn: async () => {
      if (!categoryId || !business?.id) {
        return null;
      }

      const { data, error } = await supabase
        .from('business_categories')
        .select('*')
        .eq('id', categoryId)
        .eq('business_id', business.id)
        .single();

      if (error) {
        console.error('Error fetching category:', error);
        return null;
      }

      return data;
    },
    enabled: !!categoryId && !!business?.id,
  });
}
