
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessUnit } from '@/types/business-unit';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessUnits() {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-units', business?.id],
    queryFn: async (): Promise<BusinessUnit[]> => {
      if (!business?.id) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('business_units')
        .select('*')
        .eq('business_id', business.id)
        .order('name');
        
      if (error) {
        console.error('Error fetching units:', error);
        throw error;
      }
      
      return data as BusinessUnit[];
    },
    enabled: !!business?.id,
  });
}
