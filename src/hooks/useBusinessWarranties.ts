
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
      
      const { data, error } = await supabase
        .from('business_warranties')
        .select('*')
        .eq('business_id', businessId)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching warranties:', error);
        throw error;
      }
      
      console.log('Fetched warranties:', data);
      return data || [];
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
