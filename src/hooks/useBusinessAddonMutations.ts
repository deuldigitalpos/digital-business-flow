
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { BusinessAddonFormValues } from '@/types/business-addon';

export const useBusinessAddonMutations = () => {
  const { business } = useBusinessAuth();
  const queryClient = useQueryClient();
  
  // Create addon mutation
  const createAddon = useMutation({
    mutationFn: async (addonData: BusinessAddonFormValues) => {
      if (!business) throw new Error('No business context found');
      
      const { data, error } = await supabase
        .from('business_addons')
        .insert([
          { ...addonData, business_id: business.id }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-addons'] });
    }
  });
  
  // Update addon mutation
  const updateAddon = useMutation({
    mutationFn: async ({ id, addonData }: { id: string; addonData: Partial<BusinessAddonFormValues> }) => {
      const { data, error } = await supabase
        .from('business_addons')
        .update(addonData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-addons'] });
    }
  });
  
  // Delete addon mutation
  const deleteAddon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_addons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-addons'] });
    }
  });
  
  return {
    createAddon,
    updateAddon,
    deleteAddon
  };
};

export default useBusinessAddonMutations;
