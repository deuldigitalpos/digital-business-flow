
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessBrand } from '@/types/business-brand';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { useToast } from '@/hooks/use-toast';

export const useBusinessBrands = () => {
  const { business, businessUser } = useBusinessAuth();
  const { toast } = useToast();
  
  const businessId = business?.id || businessUser?.business_id;

  const query = useQuery({
    queryKey: ['business-brands', businessId],
    queryFn: async (): Promise<BusinessBrand[]> => {
      if (!businessId) {
        console.error('No business ID available for fetching brands');
        return [];
      }
      
      console.log('Fetching brands for business ID:', businessId);
      console.log('Current business user ID:', businessUser?.id);
      
      const { data, error } = await supabase
        .from('business_brands')
        .select('*')
        .eq('business_id', businessId)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching brands:', error);
        toast({
          title: "Error fetching brands",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log('Fetched brands count:', data?.length || 0);
      return data as BusinessBrand[];
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
  const { toast } = useToast();
  const businessId = business?.id || businessUser?.business_id;
  
  return useQuery({
    queryKey: ['business-brand', brandId],
    queryFn: async () => {
      if (!brandId || !businessId) {
        return null;
      }

      const { data, error } = await supabase
        .from('business_brands')
        .select('*')
        .eq('id', brandId)
        .eq('business_id', businessId)
        .single();

      if (error) {
        console.error('Error fetching brand:', error);
        toast({
          title: "Error fetching brand details",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      return data;
    },
    enabled: !!brandId && !!businessId,
  });
};
