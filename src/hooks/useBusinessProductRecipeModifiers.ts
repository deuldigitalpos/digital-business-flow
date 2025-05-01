
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProductRecipe, BusinessProductModifier } from '@/types/business-product';

// Hook to get product recipes
export function useProductRecipes(productId: string | undefined) {
  return useQuery({
    queryKey: ['product-recipes', productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const { data, error } = await supabase
        .from('business_product_recipes')
        .select(`
          *,
          ingredient:ingredient_id(id, name, unit_price, unit_id),
          unit:unit_id(id, name, short_name)
        `)
        .eq('product_id', productId);
      
      if (error) {
        console.error('Error fetching product recipes:', error);
        throw error;
      }
      
      return data as BusinessProductRecipe[];
    },
    enabled: !!productId
  });
}

// Hook to get product modifiers
export function useProductModifiers(productId: string | undefined) {
  return useQuery({
    queryKey: ['product-modifiers', productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const { data, error } = await supabase
        .from('business_product_modifiers')
        .select('*')
        .eq('product_id', productId);
      
      if (error) {
        console.error('Error fetching product modifiers:', error);
        throw error;
      }
      
      return data as BusinessProductModifier[];
    },
    enabled: !!productId
  });
}
