
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useDeleteProduct(businessId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        // Delete will cascade to product sizes, recipes, and modifiers due to foreign key constraints
        const { error } = await supabase
          .from('business_products')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting product:', error);
          throw error;
        }

        return id;
      } catch (error) {
        console.error('Failed to delete product:', error);
        throw error;
      }
    },
    onSuccess: (deletedId) => {
      console.log('Product deleted successfully:', deletedId);
      queryClient.invalidateQueries({ queryKey: ['business-products', businessId] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product: ' + (error as Error).message);
    }
  });
}
