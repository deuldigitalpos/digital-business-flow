
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';
import { BusinessConsumable } from './useBusinessConsumables';

export const useBusinessConsumableMutations = () => {
  const { businessUser } = useBusinessAuth();
  const queryClient = useQueryClient();

  const createConsumable = useMutation({
    mutationFn: async (consumable: Omit<BusinessConsumable, 'id' | 'business_id' | 'created_at' | 'updated_at'>) => {
      if (!businessUser?.business_id) {
        throw new Error('Business ID is missing');
      }

      const { data, error } = await supabase
        .from('business_consumables')
        .insert([
          {
            ...consumable,
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
    mutationFn: async (consumable: Partial<BusinessConsumable> & { id: string }) => {
      const { id, ...updateData } = consumable;

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
