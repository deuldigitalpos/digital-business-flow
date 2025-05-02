
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { BusinessUnit, UnitType } from '@/types/business-unit';

export interface BusinessIngredient {
  id: string;
  business_id: string;
  name: string;
  description?: string | null;
  category_id?: string | null;
  unit_id?: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
  quantity?: number;
  average_cost?: number;
  total_value?: number;
  category?: { id: string; name: string } | null;
  unit?: BusinessUnit | null;
}

export const useBusinessIngredients = () => {
  const { businessUser } = useBusinessAuth();
  
  const query = useQuery({
    queryKey: ['business-ingredients'],
    queryFn: async (): Promise<BusinessIngredient[]> => {
      if (!businessUser?.business_id) {
        return [];
      }
      
      // First fetch all ingredients without trying to get unit_id
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('business_ingredients')
        .select(`
          id,
          business_id,
          name,
          description,
          category_id,
          image_url,
          created_at,
          updated_at,
          category:business_categories(id, name)
        `)
        .eq('business_id', businessUser.business_id);
      
      if (ingredientsError) {
        console.error('Error fetching ingredients:', ingredientsError);
        throw ingredientsError;
      }

      // Get the quantities from inventory table
      const { data: quantities, error: quantitiesError } = await supabase
        .from('business_inventory_quantities')
        .select('*')
        .eq('business_id', businessUser.business_id)
        .eq('item_type', 'ingredient');
      
      if (quantitiesError) {
        console.error('Error fetching quantities:', quantitiesError);
        throw quantitiesError;
      }

      // Create a map for quantities
      const quantityMap: Record<string, any> = {};
      quantities?.forEach(item => {
        quantityMap[item.item_id] = item;
      });

      // Process the data without unit information
      const processedIngredients = ingredients.map(ingredient => {
        return {
          ...ingredient,
          unit_id: null, // Set to null as it doesn't exist in the table
          unit: null, // Set to null as we can't fetch unit data without unit_id
          quantity: quantityMap[ingredient.id]?.quantity || 0,
          average_cost: quantityMap[ingredient.id]?.average_cost || 0,
          total_value: quantityMap[ingredient.id]?.total_value || 0
        } as BusinessIngredient;
      });

      return processedIngredients;
    },
    enabled: !!businessUser?.business_id
  });

  return {
    ingredients: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
};

export default useBusinessIngredients;
