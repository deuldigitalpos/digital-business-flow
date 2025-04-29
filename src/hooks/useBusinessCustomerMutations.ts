
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessCustomer, CustomerCreateInput, CustomerUpdateInput } from '@/types/business-customer';

export const useBusinessCustomerMutations = () => {
  const queryClient = useQueryClient();

  const createCustomer = useMutation({
    mutationFn: async (data: CustomerCreateInput) => {
      const { data: customer, error } = await supabase
        .from('business_customers')
        .insert([data])
        .select('*')
        .single();

      if (error) throw error;
      return customer as BusinessCustomer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-customers'] });
      toast.success('Customer created successfully');
    },
    onError: (error) => {
      console.error('Error creating customer:', error);
      toast.error('Failed to create customer');
    }
  });

  const updateCustomer = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: CustomerUpdateInput }) => {
      const { data: customer, error } = await supabase
        .from('business_customers')
        .update(data)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return customer as BusinessCustomer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-customers'] });
      toast.success('Customer updated successfully');
    },
    onError: (error) => {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer');
    }
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-customers'] });
      toast.success('Customer deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  });

  const toggleCustomerStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => {
      const status = isActive ? 'active' : 'inactive';
      
      const { data: customer, error } = await supabase
        .from('business_customers')
        .update({ account_status: status })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return customer as BusinessCustomer;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['business-customers'] });
      toast.success(`Customer ${data.account_status === 'active' ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error) => {
      console.error('Error toggling customer status:', error);
      toast.error('Failed to update customer status');
    }
  });

  return {
    createCustomer,
    updateCustomer,
    deleteCustomer,
    toggleCustomerStatus,
  };
};
