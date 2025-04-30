
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessBrand } from '@/types/business-brand';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessBrands() {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-brands', business?.id],
    queryFn: async (): Promise<BusinessBrand[]> => {
      if (!business?.id) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('business_brands')
        .select('*')
        .eq('business_id', business.id)
        .order('name');
        
      if (error) {
        console.error('Error fetching brands:', error);
        throw error;
      }
      
      return data as BusinessBrand[];
    },
    enabled: !!business?.id,
  });
}
