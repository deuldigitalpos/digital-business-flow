
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { BusinessRole } from '@/types/business-role';

export const useBusinessRoleMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createBusinessRole = useMutation({
    mutationFn: async ({ businessId, name, permissions }: { businessId: string; name: string; permissions: Record<string, boolean> }) => {
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
      return data as BusinessRole;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['business-roles'] });
      toast({
        title: 'Role created',
        description: `Role "${variables.name}" has been successfully created.`
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create role: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const updateBusinessRole = useMutation({
    mutationFn: async ({ id, name, permissions }: { id: string; name: string; permissions: Record<string, boolean> }) => {
      const { data, error } = await supabase
        .from('business_roles')
        .update({
          name,
          permissions
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating role:', error);
        throw error;
      }
      return data as BusinessRole;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['business-roles'] });
      toast({
        title: 'Role updated',
        description: `Role "${variables.name}" has been successfully updated.`
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update role: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const deleteBusinessRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_roles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting role:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-roles'] });
      toast({
        title: 'Role deleted',
        description: 'The role has been successfully deleted.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete role: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  return { createBusinessRole, updateBusinessRole, deleteBusinessRole };
};
