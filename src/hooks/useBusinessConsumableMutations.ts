
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ConsumableFormValues } from '@/types/business-consumable';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export function useBusinessConsumableMutations() {
  const queryClient = useQueryClient();
  const { business, businessUser } = useBusinessAuth();

  const createConsumable = useMutation({
    mutationFn: async (consumableData: ConsumableFormValues) => {
      if (!business?.id) {
        throw new Error('Business ID is required');
      }

      if (!businessUser?.id) {
        throw new Error('Business user ID is required for activity logging');
      }

      console.log('Creating consumable with business user ID:', businessUser.id);
      
      // Explicitly set the business user ID in the session
      await supabase.rpc('set_business_user_id', { business_user_id: businessUser.id });
      
      // Insert the consumable without updated_by (which isn't in the type)
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
        throw error;
      }

      // If the insert was successful, ensure the activity log has the businessUser.id
      // We do this via the native supabase-js fetch interceptor set up in client.ts

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
      if (!businessUser?.id) {
        throw new Error('Business user ID is required for activity logging');
      }

      console.log('Updating consumable with business user ID:', businessUser.id);
      
      // Explicitly set the business user ID in the session
      await supabase.rpc('set_business_user_id', { business_user_id: businessUser.id });
      
      // Update the consumable - the businessUser.id will be sent via the fetch interceptor
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
      if (!businessUser?.id) {
        throw new Error('Business user ID is required for activity logging');
      }

      console.log('Deleting consumable with business user ID:', businessUser.id);
      
      // Explicitly set the business user ID in the session
      await supabase.rpc('set_business_user_id', { business_user_id: businessUser.id });
      
      // For the delete operation, we don't have updated_by in the type
      // The businessUser.id will be sent via the fetch interceptor in client.ts
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
