
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessUnitFormValues } from '@/types/business-unit';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessUnitMutations() {
  const queryClient = useQueryClient();
  const { business, businessUser } = useBusinessAuth();

  // Get the correct business ID
  const getBusinessId = () => {
    const businessId = business?.id || businessUser?.business_id;
    if (!businessId) {
      console.error('No business ID available for unit mutations');
      throw new Error('Business ID is required');
    }
    return businessId;
  };

  const createUnit = useMutation({
    mutationFn: async (unitData: BusinessUnitFormValues) => {
      const businessId = getBusinessId();
      console.log('Creating unit for business ID:', businessId, 'with data:', unitData);

      const { data, error } = await supabase
        .from('business_units')
        .insert({
          ...unitData,
          business_id: businessId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating unit:', error);
        throw error;
      }

      console.log('Unit created successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Unit created successfully, invalidating queries');
      const businessId = business?.id || businessUser?.business_id;
      queryClient.invalidateQueries({ queryKey: ['business-units', businessId] });
    },
    onError: (error) => {
      console.error('Failed to create unit:', error);
    }
  });

  const updateUnit = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BusinessUnitFormValues }) => {
      console.log('Updating unit ID:', id, 'with data:', data);
      
      const { data: updatedUnit, error } = await supabase
        .from('business_units')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating unit:', error);
        throw error;
      }

      console.log('Unit updated successfully:', updatedUnit);
      return updatedUnit;
    },
    onSuccess: () => {
      console.log('Unit updated successfully, invalidating queries');
      const businessId = business?.id || businessUser?.business_id;
      queryClient.invalidateQueries({ queryKey: ['business-units', businessId] });
    },
    onError: (error) => {
      console.error('Failed to update unit:', error);
    }
  });

  const deleteUnit = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting unit ID:', id);
      
      const { error } = await supabase
        .from('business_units')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting unit:', error);
        throw error;
      }

      console.log('Unit deleted successfully');
      return id;
    },
    onSuccess: () => {
      console.log('Unit deleted successfully, invalidating queries');
      const businessId = business?.id || businessUser?.business_id;
      queryClient.invalidateQueries({ queryKey: ['business-units', businessId] });
    },
    onError: (error) => {
      console.error('Failed to delete unit:', error);
    }
  });

  return {
    createUnit,
    updateUnit,
    deleteUnit
  };
}
