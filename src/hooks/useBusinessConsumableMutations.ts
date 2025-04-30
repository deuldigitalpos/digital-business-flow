
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

      console.log('Creating consumable:', consumableData);
      
      try {
        // First, insert the consumable without trying to disable RLS
        const { data, error } = await supabase
          .from('business_consumables')
          .insert({
            business_id: business.id,
            name: consumableData.name,
            description: consumableData.description || null,
            unit_id: consumableData.unit_id || null,
            unit_price: consumableData.unit_price,
            quantity_available: consumableData.quantity_available
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating consumable:', error);
          throw new Error(`Failed to create consumable: ${error.message}`);
        }

        console.log('Consumable created successfully:', data);
        return data;
      } catch (error) {
        console.error('Error in create consumable mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-consumables', business?.id] });
      toast.success('Consumable added successfully');
    },
    onError: (error: any) => {
      console.error('Failed to create consumable:', error);
      const errorMessage = error.message || 'Failed to add consumable';
      toast.error(errorMessage);
    }
  });

  const updateConsumable = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ConsumableFormValues }) => {
      if (!id) {
        throw new Error('Consumable ID is required');
      }
      
      console.log('Updating consumable:', id, data);
      
      try {
        // Update the consumable directly without RLS bypass
        const { data: updatedConsumable, error } = await supabase
          .from('business_consumables')
          .update({
            name: data.name,
            description: data.description || null,
            unit_id: data.unit_id || null,
            unit_price: data.unit_price
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Error updating consumable:', error);
          throw new Error(`Failed to update consumable: ${error.message}`);
        }

        console.log('Consumable updated successfully:', updatedConsumable);
        return updatedConsumable;
      } catch (error) {
        console.error('Error in update consumable mutation:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['business-consumables', business?.id] });
      queryClient.invalidateQueries({ queryKey: ['business-consumable', variables.id] });
      toast.success('Consumable updated successfully');
    },
    onError: (error: any) => {
      console.error('Failed to update consumable:', error);
      const errorMessage = error.message || 'Failed to update consumable';
      toast.error(errorMessage);
    }
  });

  const deleteConsumable = useMutation({
    mutationFn: async (id: string) => {
      if (!id) {
        throw new Error('Consumable ID is required');
      }
      
      console.log('Deleting consumable:', id);
      
      try {
        // Delete the consumable directly without RLS bypass
        const { error } = await supabase
          .from('business_consumables')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting consumable:', error);
          throw new Error(`Failed to delete consumable: ${error.message}`);
        }

        console.log('Consumable deleted successfully');
        return id;
      } catch (error) {
        console.error('Error in delete consumable mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-consumables', business?.id] });
      toast.success('Consumable deleted successfully');
    },
    onError: (error: any) => {
      console.error('Failed to delete consumable:', error);
      const errorMessage = error.message || 'Failed to delete consumable';
      toast.error(errorMessage);
    }
  });

  return {
    createConsumable,
    updateConsumable,
    deleteConsumable
  };
}
