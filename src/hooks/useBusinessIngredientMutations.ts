
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { IngredientFormValues } from '@/types/business-ingredient';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export function useBusinessIngredientMutations() {
  const queryClient = useQueryClient();
  const { business } = useBusinessAuth();

  const createIngredient = useMutation({
    mutationFn: async (ingredientData: IngredientFormValues) => {
      if (!business?.id) {
        throw new Error('Business ID is required');
      }

      const { data, error } = await supabase
        .from('business_ingredients')
        .insert({
          business_id: business.id,
          name: ingredientData.name,
          description: ingredientData.description,
          unit_id: ingredientData.unit_id,
          unit_price: ingredientData.unit_price,
          quantity_available: ingredientData.quantity_available
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating ingredient:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-ingredients', business?.id] });
      toast.success('Ingredient added successfully');
    },
    onError: (error) => {
      console.error('Failed to add ingredient:', error);
      toast.error('Failed to add ingredient');
    }
  });

  const updateIngredient = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IngredientFormValues }) => {
      const { data: updatedIngredient, error } = await supabase
        .from('business_ingredients')
        .update({
          name: data.name,
          description: data.description,
          unit_id: data.unit_id,
          unit_price: data.unit_price
          // Note: quantity_available is typically updated via stock transactions
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating ingredient:', error);
        throw error;
      }

      return updatedIngredient;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['business-ingredients', business?.id] });
      queryClient.invalidateQueries({ queryKey: ['business-ingredient', variables.id] });
      toast.success('Ingredient updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update ingredient:', error);
      toast.error('Failed to update ingredient');
    }
  });

  const deleteIngredient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_ingredients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting ingredient:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-ingredients', business?.id] });
      toast.success('Ingredient deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete ingredient:', error);
      toast.error('Failed to delete ingredient');
    }
  });

  return {
    createIngredient,
    updateIngredient,
    deleteIngredient
  };
}
