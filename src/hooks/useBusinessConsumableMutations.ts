
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
      
      try {
        // First explicitly set the business user ID in the database session
        await supabase.rpc('set_business_user_id', { business_user_id: businessUser.id });
        console.log('Business user ID set successfully for consumable creation');
        
        // Create custom headers for this request
        const options = {
          headers: {
            'business-user-id': businessUser.id
          }
        };
        
        console.log('Using headers for consumable creation:', options.headers);
        
        // Insert the consumable with quantity_available defaulting to 0 if undefined
        // and adding the business user ID directly to the data
        const { data, error } = await supabase
          .from('business_consumables')
          .insert({
            business_id: business.id,
            name: consumableData.name,
            description: consumableData.description || null,
            unit_id: consumableData.unit_id || null,
            unit_price: consumableData.unit_price,
            quantity_available: consumableData.quantity_available ?? 0,
            updated_by: businessUser.id // Add business user ID directly to the data
          }, options)
          .select()
          .single();

        if (error) {
          console.error('Error creating consumable:', error);
          throw error;
        }

        console.log('Consumable created successfully:', data);
        return data;
      } catch (error) {
        console.error('Error in createConsumable mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-consumables', business?.id] });
      toast.success('Consumable added successfully');
    },
    onError: (error) => {
      console.error('Failed to add consumable:', error);
      toast.error(`Failed to add consumable: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateConsumable = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ConsumableFormValues }) => {
      if (!businessUser?.id) {
        throw new Error('Business user ID is required for activity logging');
      }

      console.log('Updating consumable with business user ID:', businessUser.id);
      
      try {
        // First explicitly set the business user ID in the database session
        await supabase.rpc('set_business_user_id', { business_user_id: businessUser.id });
        console.log('Business user ID set successfully for consumable update');
        
        // Create custom headers for this request
        const options = {
          headers: {
            'business-user-id': businessUser.id
          }
        };
        
        const { data: updatedConsumable, error } = await supabase
          .from('business_consumables')
          .update({
            name: data.name,
            description: data.description || null,
            unit_id: data.unit_id || null,
            unit_price: data.unit_price,
            updated_by: businessUser.id // Add business user ID directly to the update data
          }, options)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Error updating consumable:', error);
          throw error;
        }

        console.log('Consumable updated successfully:', updatedConsumable);
        return updatedConsumable;
      } catch (error) {
        console.error('Error in updateConsumable mutation:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['business-consumables', business?.id] });
      queryClient.invalidateQueries({ queryKey: ['business-consumable', variables.id] });
      toast.success('Consumable updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update consumable:', error);
      toast.error(`Failed to update consumable: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteConsumable = useMutation({
    mutationFn: async (id: string) => {
      if (!businessUser?.id) {
        throw new Error('Business user ID is required for activity logging');
      }

      console.log('Deleting consumable with business user ID:', businessUser.id);
      
      try {
        // First explicitly set the business user ID in the database session
        await supabase.rpc('set_business_user_id', { business_user_id: businessUser.id });
        console.log('Business user ID set successfully for consumable deletion');
        
        // Create custom headers for this request
        const options = {
          headers: {
            'business-user-id': businessUser.id
          }
        };
        
        const { error } = await supabase
          .from('business_consumables')
          .delete(options)
          .eq('id', id);

        if (error) {
          console.error('Error deleting consumable:', error);
          throw error;
        }

        return id;
      } catch (error) {
        console.error('Error in deleteConsumable mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-consumables', business?.id] });
      toast.success('Consumable deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete consumable:', error);
      toast.error(`Failed to delete consumable: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return {
    createConsumable,
    updateConsumable,
    deleteConsumable
  };
}
