
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { BusinessRole } from '@/types/business-role';
import { toast } from 'sonner';

export const useBusinessRoleMutations = () => {
  const { toast: uiToast } = useToast();
  const queryClient = useQueryClient();

  const createBusinessRole = useMutation({
    mutationFn: async ({ businessId, name, permissions }: { businessId: string; name: string; permissions: Record<string, boolean> }) => {
      console.log('Creating business role:', { businessId, name });
      
      const { data, error } = await supabase
        .from('business_roles')
        .insert([{
          business_id: businessId,
          name,
          permissions
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating role:', error);
        throw error;
      }
      
      console.log('Role created successfully:', data);
      return data as BusinessRole;
    },
    onSuccess: (data, variables) => {
      console.log('Create role mutation successful');
      queryClient.invalidateQueries({ queryKey: ['business-roles'] });
      toast.success(`Role "${variables.name}" has been created successfully`);
    },
    onError: (error) => {
      console.error('Create role mutation error:', error);
      toast.error(`Failed to create role: ${error.message}`);
    }
  });

  const updateBusinessRole = useMutation({
    mutationFn: async ({ id, name, permissions }: { id: string; name: string; permissions: Record<string, boolean> }) => {
      console.log('Updating business role:', { id, name });
      
      const { data, error } = await supabase
        .from('business_roles')
        .update({
          name,
          permissions,
          updated_at: new Date().toISOString() // Add updated_at timestamp
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating role:', error);
        throw error;
      }
      
      console.log('Role updated successfully:', data);
      return data as BusinessRole;
    },
    onSuccess: (data, variables) => {
      console.log('Update role mutation successful');
      queryClient.invalidateQueries({ queryKey: ['business-roles'] });
      toast.success(`Role "${variables.name}" has been updated successfully`);
    },
    onError: (error) => {
      console.error('Update role mutation error:', error);
      toast.error(`Failed to update role: ${error.message}`);
    }
  });

  const deleteBusinessRole = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting business role:', id);
      
      const { error } = await supabase
        .from('business_roles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting role:', error);
        throw error;
      }
      
      console.log('Role deleted successfully');
      return id;
    },
    onSuccess: (id) => {
      console.log('Delete role mutation successful');
      queryClient.invalidateQueries({ queryKey: ['business-roles'] });
      toast.success('The role has been successfully deleted');
    },
    onError: (error) => {
      console.error('Delete role mutation error:', error);
      toast.error(`Failed to delete role: ${error.message}`);
    }
  });

  return { createBusinessRole, updateBusinessRole, deleteBusinessRole };
};
