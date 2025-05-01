
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';
import { BusinessIngredient } from './useBusinessIngredients';

type IngredientCreateInput = {
  name: string;
  description?: string | null;
  category_id?: string | null;
  unit_id?: string | null;
  image_url?: string | null;
};

type IngredientUpdateInput = Partial<IngredientCreateInput> & { id: string };

export const useBusinessIngredientMutations = () => {
  const { businessUser } = useBusinessAuth();
  const queryClient = useQueryClient();

  const createIngredient = useMutation({
    mutationFn: async (ingredient: IngredientCreateInput) => {
      if (!businessUser?.business_id) {
        throw new Error('Business ID is missing');
      }

      const { data, error } = await supabase
        .from('business_ingredients')
        .insert([
          {
            ...ingredient,
            business_id: businessUser.business_id
          }
        ])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating ingredient:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Ingredient created successfully');
      queryClient.invalidateQueries({ queryKey: ['business-ingredients'] });
    },
    onError: (error) => {
      toast.error(`Failed to create ingredient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateIngredient = useMutation({
    mutationFn: async (ingredient: IngredientUpdateInput) => {
      const { id, ...updateData } = ingredient;

      const { data, error } = await supabase
        .from('business_ingredients')
        .update(updateData)
        .eq('id', id)
        .eq('business_id', businessUser?.business_id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating ingredient:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Ingredient updated successfully');
      queryClient.invalidateQueries({ queryKey: ['business-ingredients'] });
    },
    onError: (error) => {
      toast.error(`Failed to update ingredient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteIngredient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_ingredients')
        .delete()
        .eq('id', id)
        .eq('business_id', businessUser?.business_id);

      if (error) {
        console.error('Error deleting ingredient:', error);
        throw new Error(error.message);
      }

      return id;
    },
    onSuccess: () => {
      toast.success('Ingredient deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['business-ingredients'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete ingredient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return {
    createIngredient,
    updateIngredient,
    deleteIngredient
  };
};

export default useBusinessIngredientMutations;
