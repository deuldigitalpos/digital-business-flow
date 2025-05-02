
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductConsumable } from '@/types/business-product';

export const useProductConsumables = (productId?: string) => {
  const query = useQuery({
    queryKey: ['product-consumables', productId],
    queryFn: async (): Promise<ProductConsumable[]> => {
      if (!productId) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('business_product_consumables')
        .select(`
          *,
          consumable:business_consumables(
            id, 
            name,
            unit:business_units(id, name, short_name)
          ),
          unit:business_units(id, name, short_name)
        `)
        .eq('product_id', productId);
      
      if (error) {
        console.error('Error fetching product consumables:', error);
        throw error;
      }

      return data as ProductConsumable[];
    },
    enabled: !!productId
  });

  return {
    consumables: query.data || [],
    isLoading: query.isLoading,
    error: query.error
  };
};

export default useProductConsumables;
