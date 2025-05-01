
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { IngredientFormValues } from '@/types/business-ingredient';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export function useBusinessIngredientMutations() {
  const queryClient = useQueryClient();
  const { business, businessUser } = useBusinessAuth();

  const createIngredient = useMutation({
    mutationFn: async (ingredientData: IngredientFormValues) => {
      if (!business?.id) {
        throw new Error('Business ID is required');
      }

      if (!businessUser?.id) {
        throw new Error('Business user ID is required for activity logging');
      }

      console.log('Creating ingredient with business user ID:', businessUser.id);

      try {
        // First explicitly set the business user ID in the database session
        await supabase.rpc('set_business_user_id', { business_user_id: businessUser.id });
        console.log('Business user ID set successfully');
        
        // Then perform the insert operation with updated_by field
        const { data, error } = await supabase
          .from('business_ingredients')
          .insert({
            business_id: business.id,
            name: ingredientData.name,
            description: ingredientData.description,
            unit_id: ingredientData.unit_id,
            unit_price: ingredientData.unit_price,
            quantity_available: ingredientData.quantity_available ?? 0,
            updated_by: businessUser.id
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating ingredient:', error);
          throw error;
        }

        console.log('Ingredient created successfully:', data);
        return data;
      } catch (error) {
        console.error('Error in createIngredient mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-ingredients', business?.id] });
      toast.success('Ingredient added successfully');
    },
    onError: (error) => {
      console.error('Failed to add ingredient:', error);
      toast.error(`Failed to add ingredient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateIngredient = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IngredientFormValues }) => {
      if (!businessUser?.id) {
        throw new Error('Business user ID is required for activity logging');
      }

      console.log('Updating ingredient with business user ID:', businessUser.id);
      
      try {
        // First explicitly set the business user ID in the database session
        await supabase.rpc('set_business_user_id', { business_user_id: businessUser.id });
        console.log('Business user ID set successfully for update');

        const { data: updatedIngredient, error } = await supabase
          .from('business_ingredients')
          .update({
            name: data.name,
            description: data.description,
            unit_id: data.unit_id,
            unit_price: data.unit_price,
            updated_by: businessUser.id
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Error updating ingredient:', error);
          throw error;
        }

        return updatedIngredient;
      } catch (error) {
        console.error('Error in updateIngredient mutation:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['business-ingredients', business?.id] });
      queryClient.invalidateQueries({ queryKey: ['business-ingredient', variables.id] });
      toast.success('Ingredient updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update ingredient:', error);
      toast.error(`Failed to update ingredient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteIngredient = useMutation({
    mutationFn: async (id: string) => {
      if (!businessUser?.id) {
        throw new Error('Business user ID is required for activity logging');
      }

      console.log('Deleting ingredient with business user ID:', businessUser.id);
      
      try {
        // First explicitly set the business user ID in the database session
        await supabase.rpc('set_business_user_id', { business_user_id: businessUser.id });
        console.log('Business user ID set successfully for delete');

        const { error } = await supabase
          .from('business_ingredients')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting ingredient:', error);
          throw error;
        }

        return id;
      } catch (error) {
        console.error('Error in deleteIngredient mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-ingredients', business?.id] });
      toast.success('Ingredient deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete ingredient:', error);
      toast.error(`Failed to delete ingredient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return {
    createIngredient,
    updateIngredient,
    deleteIngredient
  };
}
