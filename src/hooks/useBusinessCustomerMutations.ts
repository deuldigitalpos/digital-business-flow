import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessCustomer, CustomerCreateInput, CustomerUpdateInput } from '@/types/business-customer';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export const useBusinessCustomerMutations = () => {
  const queryClient = useQueryClient();
  const { businessUser } = useBusinessAuth();

  // Create customer mutation
  const createCustomer = useMutation({
    mutationFn: async (data: CustomerCreateInput) => {
      if (!businessUser) {
        console.error("Authentication required: No business user found in context");
        throw new Error("Authentication required");
      }

      console.log("Creating customer with data:", data);
      console.log("Current business user:", businessUser);

      // Always use the business_id from the authenticated user's context
      const customerData = { 
        ...data,
        business_id: businessUser.business_id  // Override with authenticated business ID for security
      };
      
      console.log("Using business_id from authenticated user:", customerData.business_id);
      
      // Process lead_source_id
      if (customerData.lead_source_id === "null") {
        customerData.lead_source_id = null;
        customerData.is_lead = false;
      } else if (customerData.lead_source_id) {
        customerData.is_lead = true;
      }
      
      try {
        console.log("Inserting customer with data:", customerData);
        
        // Insert the customer record
        const { data: customer, error } = await supabase
          .from('business_customers')
          .insert([customerData])
          .select('*')
          .single();

        if (error) {
          console.error("Error from Supabase:", error);
          throw error;
        }
        
        console.log("Created customer successfully:", customer);
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
      console.error('Error creating customer:', error);
      // More user-friendly error message
      let errorMessage = 'Failed to create customer';
      
      if (error.message === 'Authentication required') {
        errorMessage = 'You need to be logged in to create a customer';
      } else if (error.message?.includes('duplicate key')) {
        errorMessage = 'A customer with this information already exists';
      } else if (error.message?.includes('row-level security policy')) {
        errorMessage = 'Permission error: You do not have permission to add customers to this business';
      } else if (error.message?.includes('lead_source_id')) {
        errorMessage = 'There was an issue with the lead source. Please try with a different lead source.';
      } else if (error.message?.includes('violates foreign key constraint')) {
        errorMessage = 'Invalid reference to a lead source that does not exist.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
    }
  });

  // Update the rest of the mutations to ensure they enforce business_id from the authenticated user
  const updateCustomer = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: CustomerUpdateInput }) => {
      if (!businessUser) {
        throw new Error("Authentication required");
      }
      
      // Clean up the data before sending to Supabase
      const customerData = { ...data };
      
      // Process lead_source_id
      if (customerData.lead_source_id === "null") {
        customerData.lead_source_id = null;
      }
      
      const { data: customer, error } = await supabase
        .from('business_customers')
        .update({
          ...customerData,
          business_id: businessUser.business_id // Ensure business_id stays correct
        })
        .eq('id', id)
        .eq('business_id', businessUser.business_id) // Add this line to ensure we only update customers from our business
        .select('*')
        .single();

      if (error) {
        console.error("Error updating customer:", error);
        throw error;
      }
      return customer as BusinessCustomer;
    },
    onSuccess: () => {
      // Invalidate both customers and leads queries
      queryClient.invalidateQueries({ queryKey: ['business-customers'] });
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });
      toast.success('Customer updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating customer:', error);
      let errorMessage = 'Failed to update customer';
      
      if (error.message === 'Authentication required') {
        errorMessage = 'You need to be logged in to update a customer';
      } else if (error.message?.includes('lead_source_id')) {
        errorMessage = 'There was an issue with the lead source. Please try with a different lead source.';
      } else if (error.message?.includes('violates foreign key constraint')) {
        errorMessage = 'Invalid reference to a lead source that does not exist.';
      } else if (error.message?.includes('row-level security policy')) {
        errorMessage = 'You do not have permission to update customers in this business';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
    }
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      if (!businessUser) {
        throw new Error("Authentication required");
      }
      
      const { error } = await supabase
        .from('business_customers')
        .delete()
        .eq('id', id)
        .eq('business_id', businessUser.business_id); // Add this line to ensure we only delete customers from our business

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      // Invalidate both customers and leads queries
      queryClient.invalidateQueries({ queryKey: ['business-customers'] });
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });
      toast.success('Customer deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting customer:', error);
      let errorMessage = 'Failed to delete customer';
      
      if (error.message === 'Authentication required') {
        errorMessage = 'You need to be logged in to delete a customer';
      } else if (error.message?.includes('row-level security policy')) {
        errorMessage = 'You do not have permission to delete customers in this business';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
    }
  });

  const toggleCustomerStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => {
      if (!businessUser) {
        throw new Error("Authentication required");
      }
      
      const status = isActive ? 'active' : 'inactive';
      
      const { data: customer, error } = await supabase
        .from('business_customers')
        .update({ account_status: status })
        .eq('id', id)
        .eq('business_id', businessUser.business_id) // Add this line to ensure we only update customers from our business
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
    onError: (error: any) => {
      console.error('Error toggling customer status:', error);
      let errorMessage = 'Failed to update customer status';
      
      if (error.message === 'Authentication required') {
        errorMessage = 'You need to be logged in to update customer status';
      } else if (error.message?.includes('row-level security policy')) {
        errorMessage = 'You do not have permission to update customers in this business';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
    }
  });

  return {
    createCustomer,
    updateCustomer,
    deleteCustomer,
    toggleCustomerStatus,
  };
};
