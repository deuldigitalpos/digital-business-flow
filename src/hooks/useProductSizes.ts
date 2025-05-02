
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductSize } from '@/types/business-product';

export const useProductSizes = (productId?: string) => {
  const query = useQuery({
    queryKey: ['product-sizes', productId],
    queryFn: async (): Promise<ProductSize[]> => {
      if (!productId) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('business_product_sizes')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching product sizes:', error);
        throw error;
      }

      return data as ProductSize[];
    },
    enabled: !!productId
  });

  return {
    sizes: query.data || [],
    isLoading: query.isLoading,
    error: query.error
  };
};

export default useProductSizes;
