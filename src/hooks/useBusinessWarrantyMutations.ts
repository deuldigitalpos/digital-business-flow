
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessWarrantyFormValues } from '@/types/business-warranty';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export function useBusinessWarrantyMutations() {
  const queryClient = useQueryClient();
  const { business, businessUser } = useBusinessAuth();

  // Get the correct business ID
  const getBusinessId = () => {
    const businessId = business?.id || businessUser?.business_id;
    if (!businessId) {
      console.error('No business ID available for warranty mutations');
      throw new Error('Business ID is required');
    }
    return businessId;
  };

  const createWarranty = useMutation({
    mutationFn: async (warrantyData: any) => {
      const businessId = getBusinessId();
      console.log('Creating warranty for business ID:', businessId);

      const { data, error } = await supabase
        .from('business_warranties')
        .insert({
          business_id: businessId,
          name: warrantyData.name,
          description: warrantyData.description,
          duration: warrantyData.duration,
          duration_unit: warrantyData.duration_unit,
          is_active: warrantyData.is_active
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating warranty:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      console.log('Warranty created successfully, invalidating queries');
      const businessId = business?.id || businessUser?.business_id;
      queryClient.invalidateQueries({ queryKey: ['business-warranties', businessId] });
    },
    onError: (error) => {
      console.error('Failed to create warranty:', error);
      toast.error("Failed to create warranty: " + (error.message || "Unknown error"));
    }
  });

  const updateWarranty = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      console.log('Updating warranty ID:', id, 'with data:', data);

      const { data: updatedWarranty, error } = await supabase
        .from('business_warranties')
        .update({
          name: data.name,
          description: data.description,
          duration: data.duration,
          duration_unit: data.duration_unit,
          is_active: data.is_active
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating warranty:', error);
        throw error;
      }

      return updatedWarranty;
    },
    onSuccess: () => {
      console.log('Warranty updated successfully, invalidating queries');
      const businessId = business?.id || businessUser?.business_id;
      queryClient.invalidateQueries({ queryKey: ['business-warranties', businessId] });
    },
    onError: (error) => {
      console.error('Failed to update warranty:', error);
      toast.error("Failed to update warranty: " + (error.message || "Unknown error"));
    }
  });

  const deleteWarranty = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting warranty ID:', id);
      const { error } = await supabase
        .from('business_warranties')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting warranty:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      console.log('Warranty deleted successfully, invalidating queries');
      const businessId = business?.id || businessUser?.business_id;
      queryClient.invalidateQueries({ queryKey: ['business-warranties', businessId] });
    },
    onError: (error) => {
      console.error('Failed to delete warranty:', error);
      toast.error("Failed to delete warranty: " + (error.message || "Unknown error"));
    }
  });

  return {
    createWarranty,
    updateWarranty,
    deleteWarranty
  };
}
