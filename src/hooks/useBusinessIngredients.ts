
// This file would need to be created with similar approach as useBusinessConsumables.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

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
  unit?: { id: string; name: string; short_name: string } | null;
}

export const useBusinessIngredients = () => {
  const { businessUser } = useBusinessAuth();
  
  const query = useQuery({
    queryKey: ['business-ingredients'],
    queryFn: async (): Promise<BusinessIngredient[]> => {
      if (!businessUser?.business_id) {
        return [];
      }
      
      // Fetch the ingredients without trying to join unit
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('business_ingredients')
        .select(`
          *,
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

      // Process the data without units for now
      const processedIngredients = ingredients.map(ingredient => {
        return {
          ...ingredient,
          unit: null, // We'll set this later if applicable
          quantity: quantityMap[ingredient.id]?.quantity || 0,
          average_cost: quantityMap[ingredient.id]?.average_cost || 0,
          total_value: quantityMap[ingredient.id]?.total_value || 0
        };
      });

      return processedIngredients as BusinessIngredient[];
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
