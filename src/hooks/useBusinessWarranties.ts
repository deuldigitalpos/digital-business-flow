
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessWarranty, BusinessWarrantyProduct } from '@/types/business-warranty';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessWarranties() {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-warranties', business?.id],
    queryFn: async (): Promise<BusinessWarranty[]> => {
      if (!business?.id) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('business_warranties')
        .select('*')
        .eq('business_id', business.id)
        .order('name');
        
      if (error) {
        console.error('Error fetching warranties:', error);
        throw error;
      }
      
      return data as BusinessWarranty[];
    },
    enabled: !!business?.id,
  });
}

export function useBusinessWarranty(id: string | undefined) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-warranty', id],
    queryFn: async (): Promise<BusinessWarranty | null> => {
      if (!id || !business?.id) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('business_warranties')
        .select('*')
        .eq('id', id)
        .eq('business_id', business.id)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching warranty:', error);
        throw error;
      }
      
      return data as BusinessWarranty;
    },
    enabled: !!id && !!business?.id,
  });
}

export function useWarrantyProductsCount() {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-warranty-products-count', business?.id],
    queryFn: async (): Promise<Record<string, number>> => {
      if (!business?.id) {
        return {};
      }
      
      const { data, error } = await supabase
        .from('business_warranty_products')
        .select('warranty_id, id');
        
      if (error) {
        console.error('Error fetching warranty products count:', error);
        throw error;
      }
      
      const counts: Record<string, number> = {};
      (data || []).forEach(item => {
        counts[item.warranty_id] = (counts[item.warranty_id] || 0) + 1;
      });
      
      return counts;
    },
    enabled: !!business?.id,
  });
}

export function useExpiredWarranties() {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-expired-warranties', business?.id],
    queryFn: async (): Promise<BusinessWarrantyProduct[]> => {
      if (!business?.id) {
        return [];
      }
      
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('business_warranty_products')
        .select('*')
        .lt('expires_at', now);
        
      if (error) {
        console.error('Error fetching expired warranties:', error);
        throw error;
      }
      
      return data as BusinessWarrantyProduct[];
    },
    enabled: !!business?.id,
  });
}
