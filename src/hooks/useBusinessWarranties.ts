
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { BusinessWarranty } from '@/types/business-warranty';

export const useBusinessWarranties = () => {
  const { businessUser } = useBusinessAuth();
  const businessId = businessUser?.business_id;

  const query = useQuery({
    queryKey: ['business-warranties'],
    queryFn: async (): Promise<BusinessWarranty[]> => {
      if (!businessId) {
        console.log('No business ID available for fetching warranties');
        return [];
      }
      
      console.log('Fetching warranties for business ID:', businessId);
      
      try {
        const { data, error } = await supabase
          .from('business_warranties')
          .select('*')
          .eq('business_id', businessId)
          .order('name', { ascending: true });
        
        if (error) {
          console.error('Error fetching warranties:', error);
          return [];
        }
        
        console.log('Fetched warranties:', data);
        return Array.isArray(data) ? data : [];
      } catch (e) {
        console.error('Exception in fetching warranties:', e);
        return [];
      }
    },
    enabled: !!businessId,
    retry: 2,
  });

  return {
    warranties: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isSuccess: query.isSuccess
  };
};

export default useBusinessWarranties;
