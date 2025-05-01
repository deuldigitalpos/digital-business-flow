
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProduct } from '@/types/business-product';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessProducts(filter: 'all' | 'low-stock' | 'expiring' = 'all') {
  const { business } = useBusinessAuth();
  
  return useQuery({
    queryKey: ['business-products', business?.id, filter],
    queryFn: async () => {
      if (!business?.id) {
        throw new Error('Business ID is required');
      }

      let query = supabase
        .from('business_products')
        .select(`
          *,
          business_product_sizes(*)
        `)
        .eq('business_id', business.id);

      if (filter === 'low-stock') {
        // Use lt (less than) for number comparison and make sure alert_quantity is treated as a number
        query = query.or(`quantity_available.lt.alert_quantity,quantity_available.eq.0`);
      } else if (filter === 'expiring') {
        // For expiring products (coming soon)
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        query = query.lt('expiration_date', nextMonth.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      return (data || []) as BusinessProduct[];
    },
    enabled: !!business?.id
  });
}

export function useLowStockProducts() {
  return useBusinessProducts('low-stock');
}

export function useExpiringProducts() {
  return useBusinessProducts('expiring');
}

export function useBusinessProduct(productId: string) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-product', productId],
    queryFn: async () => {
      if (!productId || !business?.id) {
        throw new Error('Product ID and Business ID are required');
      }

      const { data, error } = await supabase
        .from('business_products')
        .select(`
          *,
          business_product_sizes(*)
        `)
        .eq('id', productId)
        .eq('business_id', business.id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }

      return data as BusinessProduct;
    },
    enabled: !!productId && !!business?.id
  });
}
