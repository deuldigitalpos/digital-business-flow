
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessIngredient } from '@/types/business-ingredient';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessIngredients() {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-ingredients', business?.id],
    queryFn: async () => {
      if (!business?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('business_ingredients')
        .select('*')
        .eq('business_id', business.id);

      if (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
      }

      return data as BusinessIngredient[];
    },
    enabled: !!business?.id,
  });
}

export function useBusinessIngredient(id: string | undefined) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-ingredient', id],
    queryFn: async () => {
      if (!id || !business?.id) {
        throw new Error('Ingredient ID or business ID is missing');
      }

      const { data, error } = await supabase
        .from('business_ingredients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching ingredient details:', error);
        throw error;
      }

      return data as BusinessIngredient;
    },
    enabled: !!id && !!business?.id,
  });
}

export function useLowStockIngredients() {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['low-stock-ingredients', business?.id],
    queryFn: async () => {
      if (!business?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('business_ingredients')
        .select('*')
        .eq('business_id', business.id)
        .eq('status', 'Low Stock');

      if (error) {
        console.error('Error fetching low stock ingredients:', error);
        throw error;
      }

      return data as BusinessIngredient[];
    },
    enabled: !!business?.id,
  });
}
