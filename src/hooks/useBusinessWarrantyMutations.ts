
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessWarrantyFormValues } from '@/types/business-warranty';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export function useBusinessWarrantyMutations() {
  const queryClient = useQueryClient();
  const { business } = useBusinessAuth();

  const createWarranty = useMutation({
    mutationFn: async (warrantyData: BusinessWarrantyFormValues) => {
      if (!business?.id) {
        throw new Error('Business ID is required');
      }

      const { data, error } = await supabase
        .from('business_warranties')
        .insert({
          ...warrantyData,
          business_id: business.id
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
      queryClient.invalidateQueries({ queryKey: ['business-warranties', business?.id] });
      toast.success('Warranty created successfully');
    },
    onError: (error) => {
      console.error('Failed to create warranty:', error);
      toast.error('Failed to create warranty');
    }
  });

  const updateWarranty = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BusinessWarrantyFormValues }) => {
      const { data: updatedWarranty, error } = await supabase
        .from('business_warranties')
        .update(data)
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
      queryClient.invalidateQueries({ queryKey: ['business-warranties', business?.id] });
      toast.success('Warranty updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update warranty:', error);
      toast.error('Failed to update warranty');
    }
  });

  const deleteWarranty = useMutation({
    mutationFn: async (id: string) => {
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
      queryClient.invalidateQueries({ queryKey: ['business-warranties', business?.id] });
      toast.success('Warranty deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete warranty:', error);
      toast.error('Failed to delete warranty');
    }
  });

  return {
    createWarranty,
    updateWarranty,
    deleteWarranty
  };
}
