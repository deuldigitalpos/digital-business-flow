
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export type ConsumableCreateInput = {
  name: string;
  description?: string | null;
  category_id?: string | null;
  unit_id?: string | null;
  image_url?: string | null;
};

export type ConsumableUpdateInput = {
  id: string;
  name?: string;
  description?: string | null;
  category_id?: string | null;
  unit_id?: string | null;
  image_url?: string | null;
};

export const useBusinessConsumableMutations = () => {
  const { businessUser } = useBusinessAuth();
  const queryClient = useQueryClient();

  // Helper function to ensure IDs are not empty strings
  const sanitizeInput = (input: ConsumableCreateInput | ConsumableUpdateInput) => {
    const sanitized = { ...input };
    
    // Convert empty strings to null for foreign keys
    if (sanitized.category_id === '') sanitized.category_id = null;
    if ('unit_id' in sanitized && sanitized.unit_id === '') sanitized.unit_id = null;
    
    return sanitized;
  };

  const createConsumable = useMutation({
    mutationFn: async (consumable: ConsumableCreateInput) => {
      if (!businessUser?.business_id) {
        throw new Error('Business ID is missing');
      }

      const sanitizedInput = sanitizeInput(consumable);

      const { data, error } = await supabase
        .from('business_consumables')
        .insert([
          {
            ...sanitizedInput,
            business_id: businessUser.business_id
          }
        ])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating consumable:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Consumable created successfully');
      queryClient.invalidateQueries({ queryKey: ['business-consumables'] });
    },
    onError: (error) => {
      toast.error(`Failed to create consumable: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateConsumable = useMutation({
    mutationFn: async (consumable: ConsumableUpdateInput) => {
      const { id, ...updateData } = sanitizeInput(consumable);

      const { data, error } = await supabase
        .from('business_consumables')
        .update(updateData)
        .eq('id', id)
        .eq('business_id', businessUser?.business_id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating consumable:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Consumable updated successfully');
      queryClient.invalidateQueries({ queryKey: ['business-consumables'] });
    },
    onError: (error) => {
      toast.error(`Failed to update consumable: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteConsumable = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_consumables')
        .delete()
        .eq('id', id)
        .eq('business_id', businessUser?.business_id);

      if (error) {
        console.error('Error deleting consumable:', error);
        throw new Error(error.message);
      }

      return id;
    },
    onSuccess: () => {
      toast.success('Consumable deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['business-consumables'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete consumable: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return {
    createConsumable,
    updateConsumable,
    deleteConsumable
  };
};

export default useBusinessConsumableMutations;
