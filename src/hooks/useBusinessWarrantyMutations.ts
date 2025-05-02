
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessWarrantyFormValues } from '@/types/business-warranty';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';
import { differenceInDays } from 'date-fns';

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

  // Helper to convert from form values to database structure
  const convertFormToDbValues = (warrantyData: BusinessWarrantyFormValues) => {
    // Calculate duration in days from expiration_date
    const today = new Date();
    const expirationDate = new Date(warrantyData.expiration_date);
    const durationDays = differenceInDays(expirationDate, today);

    return {
      name: warrantyData.name,
      description: warrantyData.description,
      business_id: getBusinessId(),
      duration: durationDays > 0 ? durationDays : 30, // Store as days, default to 30 if calculation gives invalid value
      duration_unit: 'days', // Always store as days
      is_active: warrantyData.is_active !== undefined ? warrantyData.is_active : true,
      expiration_date: warrantyData.expiration_date // Store the expiration date directly as well
    };
  };

  const createWarranty = useMutation({
    mutationFn: async (warrantyData: BusinessWarrantyFormValues) => {
      const businessId = getBusinessId();
      console.log('Creating warranty for business ID:', businessId);

      const dbValues = convertFormToDbValues(warrantyData);
      console.log('Converted warranty data:', dbValues);

      const { data, error } = await supabase
        .from('business_warranties')
        .insert(dbValues)
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
    }
  });

  const updateWarranty = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BusinessWarrantyFormValues }) => {
      console.log('Updating warranty ID:', id, 'with data:', data);
      const dbValues = convertFormToDbValues(data);

      const { data: updatedWarranty, error } = await supabase
        .from('business_warranties')
        .update(dbValues)
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
    }
  });

  return {
    createWarranty,
    updateWarranty,
    deleteWarranty
  };
}
