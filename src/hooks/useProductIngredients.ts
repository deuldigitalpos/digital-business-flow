
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductIngredient } from '@/types/business-product';

export const useProductIngredients = (productId?: string) => {
  const query = useQuery({
    queryKey: ['product-ingredients', productId],
    queryFn: async (): Promise<ProductIngredient[]> => {
      if (!productId) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('business_product_recipes')
        .select(`
          *,
          ingredient:business_ingredients(
            id, 
            name,
            unit:business_units(id, name, short_name)
          ),
          unit:business_units(id, name, short_name)
        `)
        .eq('product_id', productId);
      
      if (error) {
        console.error('Error fetching product ingredients:', error);
        throw error;
      }

      return data as ProductIngredient[];
    },
    enabled: !!productId
  });

  return {
    ingredients: query.data || [],
    isLoading: query.isLoading,
    error: query.error
  };
};

export default useProductIngredients;
