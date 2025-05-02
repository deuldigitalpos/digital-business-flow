
import { useQuery } from '@tanstack/react-query';
import { BusinessUnit } from '@/types/business-unit';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export const useBusinessUnits = (type?: string) => {
  const { business, businessUser } = useBusinessAuth();
  const businessId = business?.id || businessUser?.business_id;

  const query = useQuery({
    queryKey: ['business-units', businessId, type],
    queryFn: async (): Promise<BusinessUnit[]> => {
      if (!businessId) {
        console.warn('No business ID available for fetching units');
        return [];
      }

      let query = supabase
        .from('business_units')
        .select('*')
        .eq('business_id', businessId);
        
      if (type) {
        query = query.eq('type', type);
      }
      
      query = query.order('is_default', { ascending: false })
        .order('name', { ascending: true });

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching business units:', error);
        throw error;
      }

      return data as BusinessUnit[];
    },
    enabled: !!businessId,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
};

export default useBusinessUnits;
