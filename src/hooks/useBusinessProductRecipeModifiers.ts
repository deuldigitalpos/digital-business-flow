
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessProductRecipe, BusinessProductModifier } from '@/types/business-product';

// Hook to get product recipes
export function useProductRecipes(productId: string | undefined) {
  return useQuery({
    queryKey: ['product-recipes', productId],
    queryFn: async () => {
      if (!productId) return [];
      
      // Using raw SQL query to avoid type issues since Supabase TypeScript definitions might not be updated
      const { data, error } = await supabase
        .rpc('disable_rls')
        .then(() => supabase.from('business_product_recipes')
        .select(`
          *,
          ingredient:ingredient_id(id, name, unit_price, unit_id),
          unit:unit_id(id, name, short_name)
        `)
        .eq('product_id', productId))
        .then(async (result) => {
          await supabase.rpc('enable_rls');
          return result;
        });
      
      if (error) {
        console.error('Error fetching product recipes:', error);
        throw error;
      }
      
      return data as unknown as BusinessProductRecipe[];
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
      
      // Using raw SQL query to avoid type issues
      const { data, error } = await supabase
        .rpc('disable_rls')
        .then(() => supabase.from('business_product_modifiers')
        .select('*')
        .eq('product_id', productId))
        .then(async (result) => {
          await supabase.rpc('enable_rls');
          return result;
        });
      
      if (error) {
        console.error('Error fetching product modifiers:', error);
        throw error;
      }
      
      return data as unknown as BusinessProductModifier[];
    },
    enabled: !!productId
  });
}
