
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessSupplier } from '@/types/business-supplier';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export const useBusinessSuppliers = () => {
  const { businessUser } = useBusinessAuth();
  
  return useQuery({
    queryKey: ['business-suppliers', businessUser?.business_id],
    queryFn: async (): Promise<BusinessSupplier[]> => {
      if (!businessUser?.business_id) {
        throw new Error("Authentication required");
      }
      
      const { data, error } = await supabase
        .rpc('get_business_suppliers', {
          business_id_param: businessUser.business_id
        });
      
      if (error) {
        console.error("Error fetching suppliers:", error);
        throw error;
      }
      
      return data as BusinessSupplier[];
    },
    enabled: !!businessUser?.business_id
  });
};
