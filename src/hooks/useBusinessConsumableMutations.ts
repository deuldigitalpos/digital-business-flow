
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ConsumableFormValues } from '@/types/business-consumable';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export function useBusinessConsumableMutations() {
  const queryClient = useQueryClient();
  const { business } = useBusinessAuth();

  const createConsumable = useMutation({
    mutationFn: async (consumableData: ConsumableFormValues) => {
      if (!business?.id) {
        throw new Error('Business ID is required');
      }

      const { data, error } = await supabase
        .from('business_consumables')
        .insert({
          business_id: business.id,
          name: consumableData.name,
          description: consumableData.description,
          unit_id: consumableData.unit_id,
          unit_price: consumableData.unit_price,
          quantity_available: consumableData.quantity_available
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating consumable:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-consumables', business?.id] });
      toast.success('Consumable added successfully');
    },
    onError: (error) => {
      console.error('Failed to add consumable:', error);
      toast.error('Failed to add consumable');
    }
  });

  const updateConsumable = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ConsumableFormValues }) => {
      const { data: updatedConsumable, error } = await supabase
        .from('business_consumables')
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
        console.error('Error updating consumable:', error);
        throw error;
      }

      return updatedConsumable;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['business-consumables', business?.id] });
      queryClient.invalidateQueries({ queryKey: ['business-consumable', variables.id] });
      toast.success('Consumable updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update consumable:', error);
      toast.error('Failed to update consumable');
    }
  });

  const deleteConsumable = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_consumables')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting consumable:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-consumables', business?.id] });
      toast.success('Consumable deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete consumable:', error);
      toast.error('Failed to delete consumable');
    }
  });

  return {
    createConsumable,
    updateConsumable,
    deleteConsumable
  };
}
