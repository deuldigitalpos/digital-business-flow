
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
  const sanitizeInput = <T extends ConsumableCreateInput | ConsumableUpdateInput>(input: T): T => {
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

      // Explicitly cast the input to match the expected DB schema
      const insertData = {
        business_id: businessUser.business_id,
        name: sanitizedInput.name,
        description: sanitizedInput.description,
        category_id: sanitizedInput.category_id,
        unit_id: sanitizedInput.unit_id,
        image_url: sanitizedInput.image_url
      };

      // Insert as a single object
      const { data, error } = await supabase
        .from('business_consumables')
        .insert(insertData)
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
      // Ensure we have an ID to work with
      if (!consumable.id) {
        throw new Error('ID is required for updating a consumable');
      }
      
      const sanitizedInput = sanitizeInput(consumable);
      
      // Safely extract the id first, then the rest of the fields
      const { id, ...updateFields } = sanitizedInput;
      
      const { data, error } = await supabase
        .from('business_consumables')
        .update(updateFields)
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
