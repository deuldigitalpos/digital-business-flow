
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { BusinessUnit } from '@/types/business-unit';

export const useBusinessUnits = () => {
  const { businessUser } = useBusinessAuth();
  const businessId = businessUser?.business_id;

  return useQuery({
    queryKey: ['business-units'],
    queryFn: async (): Promise<BusinessUnit[]> => {
      if (!businessId) {
        return [];
      }
      
      try {
        const { data, error } = await supabase
          .from('business_units')
          .select('*')
          .eq('business_id', businessId)
          .order('name');
        
        if (error) {
          console.error('Error fetching units:', error);
          return [];
        }
        
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Caught error fetching units:', error);
        return [];
      }
    },
    enabled: !!businessId
  });
};

export default useBusinessUnits;
