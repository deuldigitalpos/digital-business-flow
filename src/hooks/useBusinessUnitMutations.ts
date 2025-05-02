
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessUnit, BusinessUnitFormValues } from '@/types/business-unit';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export function useBusinessUnitMutations() {
  const queryClient = useQueryClient();
  const { business } = useBusinessAuth();

  const createUnit = useMutation({
    mutationFn: async (values: BusinessUnitFormValues): Promise<BusinessUnit> => {
      if (!business?.id) {
        throw new Error('Business ID is required');
      }

      const { data, error } = await supabase
        .from('business_units')
        .insert({
          business_id: business.id,
          name: values.name,
          short_name: values.short_name,
          description: values.description || null,
          is_default: values.is_default || false,
        })
        .select('*')
        .single();

      if (error) {
        if (error.code === '23505') {
          // Unique violation
          toast.error('A unit with this short name already exists');
        } else {
          toast.error('Failed to create unit');
        }
        throw error;
      }

      return data as BusinessUnit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-units'] });
      toast.success('Unit created successfully');
    },
  });

  const updateUnit = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BusinessUnitFormValues }): Promise<BusinessUnit> => {
      // Check if the unit is a default unit
      const { data: unitData, error: unitError } = await supabase
        .from('business_units')
        .select('is_default')
        .eq('id', id)
        .single();

      if (unitError) {
        toast.error('Failed to verify unit status');
        throw unitError;
      }

      if (unitData.is_default) {
        toast.error('Default units cannot be modified');
        throw new Error('Cannot modify default unit');
      }

      const { data: updatedData, error } = await supabase
        .from('business_units')
        .update({
          name: data.name,
          short_name: data.short_name,
          description: data.description || null,
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        if (error.code === '23505') {
          // Unique violation
          toast.error('A unit with this short name already exists');
        } else {
          toast.error('Failed to update unit');
        }
        throw error;
      }

      return updatedData as BusinessUnit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-units'] });
      toast.success('Unit updated successfully');
    },
  });

  const deleteUnit = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // Check if the unit is a default unit
      const { data: unitData, error: unitError } = await supabase
        .from('business_units')
        .select('is_default')
        .eq('id', id)
        .single();

      if (unitError) {
        toast.error('Failed to verify unit status');
        throw unitError;
      }

      if (unitData.is_default) {
        toast.error('Default units cannot be deleted');
        throw new Error('Cannot delete default unit');
      }
      
      const { error } = await supabase
        .from('business_units')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Failed to delete unit');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-units'] });
      toast.success('Unit deleted successfully');
    },
  });

  return {
    createUnit,
    updateUnit,
    deleteUnit,
  };
}
