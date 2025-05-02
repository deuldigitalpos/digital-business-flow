
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

      // Process data to ensure correct types
      const processedData = data.map(item => {
        // Handle possible SelectQueryError for unit
        const unitData = item.unit && !item.unit.error
          ? { id: item.unit.id, name: item.unit.name, short_name: item.unit.short_name }
          : null;

        // Handle possible SelectQueryError for ingredient.unit
        let ingredientData = null;
        if (item.ingredient && !item.ingredient.error) {
          const ingredientUnitData = item.ingredient.unit && !item.ingredient.unit.error
            ? { id: item.ingredient.unit.id, name: item.ingredient.unit.name, short_name: item.ingredient.unit.short_name }
            : null;
            
          ingredientData = {
            id: item.ingredient.id,
            name: item.ingredient.name,
            unit: ingredientUnitData
          };
        }

        return {
          ...item,
          unit: unitData,
          ingredient: ingredientData
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
