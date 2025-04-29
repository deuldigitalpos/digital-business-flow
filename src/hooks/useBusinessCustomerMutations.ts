
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessCustomer, CustomerCreateInput, CustomerUpdateInput } from '@/types/business-customer';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export const useBusinessCustomerMutations = () => {
  const queryClient = useQueryClient();
  const { businessUser } = useBusinessAuth();

  // Helper function to ensure authentication
  const ensureAuthentication = async () => {
    try {
      // Check if we already have a session
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        // No session, try to authenticate with business credentials
        if (businessUser?.username && businessUser?.password) {
          console.log("Attempting to authenticate with business credentials");
          const { error } = await supabase.auth.signInWithPassword({
            email: `${businessUser.username}@temporary.com`,
            password: businessUser.password,
          });
          
          if (error) {
            console.error("Authentication failed:", error);
            throw new Error("Authentication required to manage customers");
          }
          console.log("Authentication successful");
        } else {
          throw new Error("Authentication required to manage customers");
        }
      }
      
      return true;
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication failed. Please try again.");
    }
  };

  const createCustomer = useMutation({
    mutationFn: async (data: CustomerCreateInput) => {
      // Ensure authentication before proceeding
      await ensureAuthentication();

      console.log("Creating customer/lead with data:", data);

      // Extract the lead_source_id if it exists and add to custom data
      let customData = {};
      if (data.lead_source_id) {
        customData = { lead_source_id: data.lead_source_id };
        delete data.lead_source_id; // Remove from main data before insert
      }

      // Add the custom data to the insert
      const customerData = {
        ...data,
        custom_data: customData
      };

      const { data: customer, error } = await supabase
        .from('business_customers')
        .insert([customerData])
        .select('*')
        .single();

      if (error) {
        console.error("Error from Supabase:", error);
        throw error;
      }
      
      console.log("Created customer/lead successfully:", customer);
      return customer as BusinessCustomer;
    },
    onSuccess: (data) => {
      // Invalidate both queries to ensure data is refreshed
      queryClient.invalidateQueries({ queryKey: ['business-customers'] });
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });
      
      const entityType = data.is_lead ? 'Lead' : 'Customer';
      toast.success(`${entityType} created successfully`);
    },
    onError: (error) => {
      console.error('Error creating customer/lead:', error);
      toast.error(`Failed to create: ${error.message}`);
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
