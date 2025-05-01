
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessBrand } from '@/types/business-brand';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export const useBusinessBrands = () => {
  const { businessUser } = useBusinessAuth();
  
  const query = useQuery({
    queryKey: ['business-brands'],
    queryFn: async (): Promise<BusinessBrand[]> => {
      if (!businessUser?.business_id) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('business_brands')
        .select('*')
        .eq('business_id', businessUser.business_id)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching brands:', error);
        throw error;
      }
      
      return data as BusinessBrand[];
    },
    enabled: !!businessUser?.business_id
  });

  return {
    brands: query.data || [],
    isLoading: query.isLoading,
    error: query.error
  };
};

export default useBusinessBrands;
