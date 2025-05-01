
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessSupplier } from '@/types/business-supplier';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export const useBusinessSuppliers = () => {
  const { businessUser } = useBusinessAuth();
  
  const query = useQuery({
    queryKey: ['business-suppliers'],
    queryFn: async (): Promise<BusinessSupplier[]> => {
      if (!businessUser?.business_id) {
        throw new Error("Authentication required");
      }
      
      const { data, error } = await supabase
        .from('business_suppliers')
        .select('*')
        .eq('business_id', businessUser.business_id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching suppliers:", error);
        throw error;
      }
      
      return data as BusinessSupplier[];
    },
    enabled: !!businessUser?.business_id
  });

  return {
    suppliers: query.data || [],
    isLoading: query.isLoading,
    error: query.error
  };
};

export default useBusinessSuppliers;
