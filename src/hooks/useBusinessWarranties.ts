
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessWarranty } from '@/types/business-warranty';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export const useBusinessWarranties = () => {
  const { businessUser } = useBusinessAuth();
  
  const query = useQuery({
    queryKey: ['business-warranties'],
    queryFn: async (): Promise<BusinessWarranty[]> => {
      if (!businessUser?.business_id) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('business_warranties')
        .select('*')
        .eq('business_id', businessUser.business_id)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching warranties:', error);
        throw error;
      }
      
      return data as BusinessWarranty[];
    },
    enabled: !!businessUser?.business_id
  });

  return {
    warranties: query.data || [],
    isLoading: query.isLoading,
    error: query.error
  };
};

export default useBusinessWarranties;
