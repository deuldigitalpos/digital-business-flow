
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessCustomer, CustomerCreateInput, CustomerUpdateInput } from '@/types/business-customer';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export const useBusinessCustomerMutations = () => {
  const queryClient = useQueryClient();
  const { businessUser, hasPermission, isDefaultUser } = useBusinessAuth();

  // Create customer mutation
  const createCustomer = useMutation({
    mutationFn: async (data: CustomerCreateInput) => {
      if (!businessUser) {
        throw new Error("Authentication required");
      }

      // Check if user has permission to create customers
      if (!isDefaultUser && !hasPermission('customers')) {
        console.error("Permission denied: User doesn't have 'customers' permission");
        throw new Error("You don't have permission to create customers in this business");
      }

      console.log("Creating customer/lead with data:", data);
      console.log("Current business user:", businessUser);

      // Ensure business_id is set correctly
      if (!data.business_id) {
        data.business_id = businessUser.business_id;
        console.log("Setting business_id from context:", data.business_id);
      }

      // Extract the lead_source_id if it exists
      let leadSourceId = null;
      if (data.lead_source_id) {
        leadSourceId = data.lead_source_id;
        delete data.lead_source_id; // Remove from main data before insert
      }

      // Create customer data
      const customerData = {
        ...data
      };

      try {
        console.log("Inserting customer with data:", customerData);
        
        // Use the authenticated client with explicit RLS bypass if needed
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
      } catch (error) {
        console.error("Error in customer creation:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidate both queries to ensure data is refreshed
      queryClient.invalidateQueries({ queryKey: ['business-customers'] });
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });
      
      const entityType = data.is_lead ? 'Lead' : 'Customer';
      toast.success(`${entityType} created successfully`);
    },
    onError: (error: any) => {
      console.error('Error creating customer/lead:', error);
      // More user-friendly error message
      let errorMessage = 'Failed to create customer';
      
      if (error.message === 'Authentication required') {
        errorMessage = 'You need to be logged in to create a customer';
      } else if (error.message === "You don't have permission to create customers in this business") {
        errorMessage = "You don't have permission to create customers in this business";
      } else if (error.message?.includes('duplicate key')) {
        errorMessage = 'A customer with this information already exists';
      } else if (error.message?.includes('row-level security policy')) {
        errorMessage = 'You don\'t have permission to create customers in this business';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
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
