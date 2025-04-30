
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessBrandFormValues } from '@/types/business-brand';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export function useBusinessBrandMutations() {
  const queryClient = useQueryClient();
  const { business } = useBusinessAuth();

  const createBrand = useMutation({
    mutationFn: async (brandData: BusinessBrandFormValues) => {
      if (!business?.id) {
        throw new Error('Business ID is required');
      }

      const { data, error } = await supabase
        .from('business_brands')
        .insert({
          ...brandData,
          business_id: business.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating brand:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-brands', business?.id] });
      toast.success('Brand created successfully');
    },
    onError: (error) => {
      console.error('Failed to create brand:', error);
      toast.error('Failed to create brand');
    }
  });

  const updateBrand = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BusinessBrandFormValues }) => {
      const { data: updatedBrand, error } = await supabase
        .from('business_brands')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating brand:', error);
        throw error;
      }

      return updatedBrand;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-brands', business?.id] });
      toast.success('Brand updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update brand:', error);
      toast.error('Failed to update brand');
    }
  });

  const deleteBrand = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_brands')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting brand:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-brands', business?.id] });
      toast.success('Brand deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete brand:', error);
      toast.error('Failed to delete brand');
    }
  });

  return {
    createBrand,
    updateBrand,
    deleteBrand
  };
}
