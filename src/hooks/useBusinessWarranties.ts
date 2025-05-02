
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessWarranty, BusinessWarrantyProduct } from '@/types/business-warranty';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { addDays } from 'date-fns';

// Main hook to fetch business warranties
export const useBusinessWarranties = () => {
  const { businessUser, business } = useBusinessAuth();
  
  const query = useQuery({
    queryKey: ['business-warranties', business?.id],
    queryFn: async (): Promise<BusinessWarranty[]> => {
      if (!business?.id && !businessUser?.business_id) {
        console.error('No business ID available for fetching warranties');
        return [];
      }
      
      const businessId = business?.id || businessUser?.business_id;
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
      
      // Calculate expiration_date from duration and duration_unit if not already present
      const warrantiesWithExpiry = data.map(warranty => {
        // Add a calculated expiration date based on duration and unit
        let expiryDate;
        
        if (warranty.duration_unit === 'days') {
          expiryDate = addDays(new Date(), warranty.duration).toISOString().split('T')[0];
        } else {
          // Default to 30 days if unit is not recognized
          expiryDate = addDays(new Date(), 30).toISOString().split('T')[0];
        }
        
        return {
          ...warranty,
          expiration_date: expiryDate
        };
      });
      
      console.log('Fetched warranties:', warrantiesWithExpiry);
      return warrantiesWithExpiry as BusinessWarranty[];
    },
    enabled: !!(business?.id || businessUser?.business_id),
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error('Error in useBusinessWarranties hook:', error);
      }
    }
  });

  return {
    warranties: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isSuccess: query.isSuccess
  };
};

// Hook to count products per warranty
export const useWarrantyProductsCount = () => {
  const { businessUser, business } = useBusinessAuth();
  const businessId = business?.id || businessUser?.business_id;
  
  const query = useQuery({
    queryKey: ['warranty-products-count', businessId],
    queryFn: async (): Promise<Record<string, number>> => {
      if (!businessId) {
        console.error('No business ID available for fetching warranty product counts');
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
    enabled: !!businessId,
    retry: 1
  });

  return query;
};

// Hook to fetch expired warranties
export const useExpiredWarranties = () => {
  const { businessUser, business } = useBusinessAuth();
  const businessId = business?.id || businessUser?.business_id;
  
  const query = useQuery({
    queryKey: ['expired-warranties', businessId],
    queryFn: async (): Promise<BusinessWarrantyProduct[]> => {
      if (!businessId) {
        console.error('No business ID available for fetching expired warranties');
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
    enabled: !!businessId,
    retry: 1
  });

  return query;
};

export default useBusinessWarranties;
