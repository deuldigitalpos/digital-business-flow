
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessBrandFormValues } from '@/types/business-brand';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export function useBusinessBrandMutations() {
  const queryClient = useQueryClient();
  const { business, businessUser } = useBusinessAuth();

  // Get the correct business ID
  const getBusinessId = () => {
    const businessId = business?.id || businessUser?.business_id;
    if (!businessId) {
      console.error('No business ID available for brand mutations');
      throw new Error('Business ID is required');
    }
    return businessId;
  };

  const createBrand = useMutation({
    mutationFn: async (brandData: BusinessBrandFormValues) => {
      const businessId = getBusinessId();
      console.log('Creating brand for business ID:', businessId, 'with data:', brandData);

      const { data, error } = await supabase
        .from('business_brands')
        .insert({
          ...brandData,
          business_id: businessId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating brand:', error);
        throw error;
      }

      console.log('Brand created successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Brand created successfully, invalidating queries');
      const businessId = business?.id || businessUser?.business_id;
      queryClient.invalidateQueries({ queryKey: ['business-brands', businessId] });
    },
    onError: (error) => {
      console.error('Failed to create brand:', error);
    }
  });

  const updateBrand = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BusinessBrandFormValues }) => {
      console.log('Updating brand ID:', id, 'with data:', data);
      
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

      console.log('Brand updated successfully:', updatedBrand);
      return updatedBrand;
    },
    onSuccess: () => {
      console.log('Brand updated successfully, invalidating queries');
      const businessId = business?.id || businessUser?.business_id;
      queryClient.invalidateQueries({ queryKey: ['business-brands', businessId] });
    },
    onError: (error) => {
      console.error('Failed to update brand:', error);
    }
  });

  const deleteBrand = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting brand ID:', id);
      
      const { error } = await supabase
        .from('business_brands')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting brand:', error);
        throw error;
      }

      console.log('Brand deleted successfully');
      return id;
    },
    onSuccess: () => {
      console.log('Brand deleted successfully, invalidating queries');
      const businessId = business?.id || businessUser?.business_id;
      queryClient.invalidateQueries({ queryKey: ['business-brands', businessId] });
    },
    onError: (error) => {
      console.error('Failed to delete brand:', error);
    }
  });

  return {
    createBrand,
    updateBrand,
    deleteBrand
  };
}
