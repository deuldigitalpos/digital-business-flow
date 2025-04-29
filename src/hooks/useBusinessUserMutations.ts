
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useBusinessUserMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteBusinessUser = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessUsers'] });
      toast({
        title: "User deleted",
        description: "The user has been successfully removed."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  return { deleteBusinessUser };
};
