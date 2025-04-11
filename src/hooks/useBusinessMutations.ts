
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Business } from '@/types/business';

export const useBusinessMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteBusiness = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('businessdetails')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast({
        title: "Business deleted",
        description: "The business has been successfully removed."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete business: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const toggleBusinessActive = useMutation({
    mutationFn: async ({ business, isActive }: { business: Business, isActive: boolean }) => {
      const updatedCustomData = { 
        ...business.custom_data,
        is_active: isActive 
      };
      
      const { error } = await supabase
        .from('businessdetails')
        .update({ 
          custom_data: updatedCustomData 
        })
        .eq('id', business.id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast({
        title: variables.isActive ? "Business activated" : "Business deactivated",
        description: `${variables.business.business_name} has been ${variables.isActive ? 'activated' : 'deactivated'}.`
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update business status: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  return { deleteBusiness, toggleBusinessActive };
};
