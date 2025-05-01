
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessWarranty, BusinessWarrantyProduct } from '@/types/business-warranty';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

// Main hook to fetch business warranties
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
    error: query.error,
    refetch: query.refetch
  };
};

// Hook to count products per warranty
export const useWarrantyProductsCount = () => {
  const { businessUser } = useBusinessAuth();
  
  const query = useQuery({
    queryKey: ['warranty-products-count'],
    queryFn: async (): Promise<Record<string, number>> => {
      if (!businessUser?.business_id) {
        return {};
      }
      
      // Modified approach: fetch all warranty products and count them in JS
      const { data, error } = await supabase
        .from('business_warranty_products')
        .select('warranty_id');
      
      if (error) {
        console.error('Error fetching warranty product counts:', error);
        throw error;
      }
      
      // Count products per warranty
      const counts: Record<string, number> = {};
      data.forEach(item => {
        if (counts[item.warranty_id]) {
          counts[item.warranty_id] += 1;
        } else {
          counts[item.warranty_id] = 1;
        }
      });
      
      return counts;
    },
    enabled: !!businessUser?.business_id
  });

  return query;
};

// Hook to fetch expired warranties
export const useExpiredWarranties = () => {
  const { businessUser } = useBusinessAuth();
  
  const query = useQuery({
    queryKey: ['expired-warranties'],
    queryFn: async (): Promise<BusinessWarrantyProduct[]> => {
      if (!businessUser?.business_id) {
        return [];
      }
      
      const today = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('business_warranty_products')
        .select(`
          *,
          business_products(name),
          business_warranties(name)
        `)
        .lt('expires_at', today);
      
      if (error) {
        console.error('Error fetching expired warranties:', error);
        throw error;
      }
      
      return data as unknown as BusinessWarrantyProduct[];
    },
    enabled: !!businessUser?.business_id
  });

  return query;
};

export default useBusinessWarranties;
