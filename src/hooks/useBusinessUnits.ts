
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessUnit } from '@/types/business-unit';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessUnits() {
  const { business, businessUser } = useBusinessAuth();
  
  const businessId = business?.id || businessUser?.business_id;

  return useQuery({
    queryKey: ['business-units', businessId],
    queryFn: async (): Promise<BusinessUnit[]> => {
      if (!businessId) {
        console.log('No business ID available for fetching units');
        return [];
      }
      
      console.log('Fetching units for business ID:', businessId);
      
      const { data, error } = await supabase
        .from('business_units')
        .select('*')
        .eq('business_id', businessId)
        .order('name');
        
      if (error) {
        console.error('Error fetching units:', error);
        throw error;
      }
      
      console.log('Fetched units count:', data?.length || 0);
      return data as BusinessUnit[];
    },
    enabled: !!businessId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBusinessUnit(id: string | undefined) {
  const { business, businessUser } = useBusinessAuth();
  const businessId = business?.id || businessUser?.business_id;
  
  return useQuery({
    queryKey: ['business-unit', id],
    queryFn: async () => {
      if (!id || !businessId) {
        return null;
      }

      const { data, error } = await supabase
        .from('business_units')
        .select('*')
        .eq('id', id)
        .eq('business_id', businessId)
        .single();

      if (error) {
        console.error('Error fetching unit details:', error);
        throw error;
      }

      return data as BusinessUnit;
    },
    enabled: !!id && !!businessId,
  });
}
