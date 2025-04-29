
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessCustomer, CustomerCreateInput, CustomerUpdateInput } from '@/types/business-customer';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export const useBusinessCustomerMutations = () => {
  const queryClient = useQueryClient();
  const { businessUser } = useBusinessAuth();

  const createCustomer = useMutation({
    mutationFn: async (data: CustomerCreateInput) => {
      // Get the auth token to ensure the RLS policy is satisfied
      const { data: authData } = await supabase.auth.getSession();

      // Check if user is authenticated before proceeding
      if (!authData.session) {
        // Try signing in with the business user credentials
        // This is a workaround for the business user authentication system
        if (businessUser?.username && businessUser?.password) {
          // Create a temporary auth user to get a valid session
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: `${businessUser.username}@temporary.com`,
            password: businessUser.password,
          });

          if (signInError) {
            console.error('Failed to authenticate:', signInError);
            throw new Error("Authentication required to create customers");
          }
        } else {
          throw new Error("Authentication required to create customers");
        }
      }

      const { data: customer, error } = await supabase
        .from('business_customers')
        .insert([data])
        .select('*')
        .single();

      if (error) throw error;
      return customer as BusinessCustomer;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['business-customers'] });
      // Also invalidate the leads query to update the leads list
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });
      toast.success('Customer created successfully');
    },
    onError: (error) => {
      console.error('Error creating customer:', error);
      toast.error(`Failed to create customer: ${error.message}`);
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
      // Invalidate both customers and leads queries
      queryClient.invalidateQueries({ queryKey: ['business-customers'] });
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });
      toast.success('Customer updated successfully');
    },
    onError: (error) => {
      console.error('Error updating customer:', error);
      toast.error(`Failed to update customer: ${error.message}`);
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
      // Invalidate both customers and leads queries
      queryClient.invalidateQueries({ queryKey: ['business-customers'] });
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });
      toast.success('Customer deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting customer:', error);
      toast.error(`Failed to delete customer: ${error.message}`);
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
      // Invalidate both customers and leads queries
      queryClient.invalidateQueries({ queryKey: ['business-customers'] });
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });
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
