
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
      
      // Get recipes without relations that cause errors
      const { data: recipes, error } = await supabase
        .from('business_product_recipes')
        .select(`id, product_id, ingredient_id, quantity, cost`)
        .eq('product_id', productId);
      
      if (error) {
        console.error('Error fetching product ingredients:', error);
        throw error;
      }

      // If no recipes, return empty array
      if (!recipes || recipes.length === 0) {
        return [];
      }

      // Get ingredients separately
      const ingredientIds = recipes.map(r => r.ingredient_id);
      const { data: ingredients } = await supabase
        .from('business_ingredients')
        .select(`id, name`)
        .in('id', ingredientIds);

      // Create maps for easy lookup
      const ingredientMap = ingredients.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, any>);

      // Process data to ensure correct types
      const processedData = recipes.map(item => {
        const ingredientData = ingredientMap[item.ingredient_id];
        
        return {
          ...item,
          name: ingredientData?.name || 'Unknown',
          unit: null, // Set to null as it's causing errors
          ingredient: ingredientData ? {
            id: ingredientData.id,
            name: ingredientData.name,
            unit: null // Set to null as it's causing errors
          } : null
        };
      });

      return processedData as ProductIngredient[];
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
