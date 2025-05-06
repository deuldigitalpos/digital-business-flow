
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessBrand } from '@/types/business-brand';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export const useBusinessBrands = () => {
  const { business, businessUser } = useBusinessAuth();
  
  const businessId = business?.id || businessUser?.business_id;

  const query = useQuery({
    queryKey: ['business-brands', businessId],
    queryFn: async (): Promise<BusinessBrand[]> => {
      if (!businessId) {
        console.error('No business ID available for fetching brands');
        return [];
      }
      
      console.log('Fetching brands for business ID:', businessId);
      
      try {
        const { data, error } = await supabase
          .from('business_brands')
          .select('*')
          .eq('business_id', businessId)
          .order('name', { ascending: true });
        
        if (error) {
          console.error('Error fetching brands:', error);
          return [];
        }
        
        console.log('Fetched brands:', data);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error in useBusinessBrands hook:', error);
        return [];
      }
    },
    enabled: !!businessId,
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error('Error in useBusinessBrands hook:', error);
      }
    }
  });

  return {
    brands: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isSuccess: query.isSuccess
  };
};

export const useBusinessBrand = (brandId: string | undefined) => {
  const { business, businessUser } = useBusinessAuth();
  const businessId = business?.id || businessUser?.business_id;
  
  return useQuery({
    queryKey: ['business-brand', brandId],
    queryFn: async () => {
      if (!brandId || !businessId) {
        return null;
      }

      try {
        const { data, error } = await supabase
          .from('business_brands')
          .select('*')
          .eq('id', brandId)
          .eq('business_id', businessId)
          .single();

        if (error) {
          console.error('Error fetching brand:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('Error in useBusinessBrand hook:', error);
        return null;
      }
    },
    enabled: !!brandId && !!businessId,
  });
};
