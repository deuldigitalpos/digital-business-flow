
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';
import { BusinessAddon } from './useBusinessAddons';

type AddonCreateInput = {
  name: string;
  description?: string | null;
  category_id?: string | null;
  unit_id?: string | null;
  image_url?: string | null;
};

type AddonUpdateInput = Partial<AddonCreateInput> & { id: string };

export const useBusinessAddonMutations = () => {
  const { businessUser } = useBusinessAuth();
  const queryClient = useQueryClient();

  const createAddon = useMutation({
    mutationFn: async (addon: AddonCreateInput) => {
      if (!businessUser?.business_id) {
        throw new Error('Business ID is missing');
      }

      const { data, error } = await supabase
        .from('business_addons')
        .insert([
          {
            ...addon,
            business_id: businessUser.business_id
          }
        ])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating add-on:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Add-on created successfully');
      queryClient.invalidateQueries({ queryKey: ['business-addons'] });
    },
    onError: (error) => {
      toast.error(`Failed to create add-on: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateAddon = useMutation({
    mutationFn: async (addon: AddonUpdateInput) => {
      const { id, ...updateData } = addon;

      const { data, error } = await supabase
        .from('business_addons')
        .update(updateData)
        .eq('id', id)
        .eq('business_id', businessUser?.business_id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating add-on:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Add-on updated successfully');
      queryClient.invalidateQueries({ queryKey: ['business-addons'] });
    },
    onError: (error) => {
      toast.error(`Failed to update add-on: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteAddon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_addons')
        .delete()
        .eq('id', id)
        .eq('business_id', businessUser?.business_id);

      if (error) {
        console.error('Error deleting add-on:', error);
        throw new Error(error.message);
      }

      return id;
    },
    onSuccess: () => {
      toast.success('Add-on deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['business-addons'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete add-on: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return {
    createAddon,
    updateAddon,
    deleteAddon
  };
};

export default useBusinessAddonMutations;
