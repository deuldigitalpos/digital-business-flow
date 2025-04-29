
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessSupplier, SupplierCreateInput, SupplierUpdateInput } from '@/types/business-supplier';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export const useBusinessSupplierMutations = () => {
  const queryClient = useQueryClient();
  const { businessUser } = useBusinessAuth();

  // Create supplier mutation
  const createSupplier = useMutation({
    mutationFn: async (data: SupplierCreateInput) => {
      if (!businessUser) {
        console.error("Authentication required: No business user found in context");
        throw new Error("Authentication required");
      }

      console.log("Creating supplier with data:", data);
      
      // Always use the business_id from the authenticated user's context
      const supplierData = { 
        ...data,
        business_id: businessUser.business_id  // Override with authenticated business ID for security
      };
      
      console.log("Using business_id from authenticated user:", supplierData.business_id);
      
      try {
        // Insert the supplier record
        const { data: supplier, error } = await supabase
          .from('business_suppliers')
          .insert([supplierData])
          .select('*')
          .single();

        if (error) {
          console.error("Error from Supabase:", error);
          throw error;
        }
        
        console.log("Created supplier successfully:", supplier);
        return supplier as BusinessSupplier;
      } catch (error) {
        console.error("Error in supplier creation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-suppliers'] });
      toast.success(`Supplier created successfully`);
    },
    onError: (error: any) => {
      console.error('Error creating supplier:', error);
      // More user-friendly error message
      let errorMessage = 'Failed to create supplier';
      
      if (error.message === 'Authentication required') {
        errorMessage = 'You need to be logged in to create a supplier';
      } else if (error.message?.includes('duplicate key')) {
        errorMessage = 'A supplier with this information already exists';
      } else if (error.message?.includes('row-level security policy')) {
        errorMessage = 'Permission error: You do not have permission to add suppliers to this business';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
    }
  });

  // Update supplier mutation
  const updateSupplier = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: SupplierUpdateInput }) => {
      if (!businessUser) {
        throw new Error("Authentication required");
      }
      
      const { data: supplier, error } = await supabase
        .from('business_suppliers')
        .update({
          ...data,
          business_id: businessUser.business_id // Ensure business_id stays correct
        })
        .eq('id', id)
        .eq('business_id', businessUser.business_id) // Add this line to ensure we only update suppliers from our business
        .select('*')
        .single();

      if (error) {
        console.error("Error updating supplier:", error);
        throw error;
      }
      return supplier as BusinessSupplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-suppliers'] });
      toast.success('Supplier updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating supplier:', error);
      let errorMessage = 'Failed to update supplier';
      
      if (error.message === 'Authentication required') {
        errorMessage = 'You need to be logged in to update a supplier';
      } else if (error.message?.includes('row-level security policy')) {
        errorMessage = 'You do not have permission to update suppliers in this business';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
    }
  });

  // Delete supplier mutation
  const deleteSupplier = useMutation({
    mutationFn: async (id: string) => {
      if (!businessUser) {
        throw new Error("Authentication required");
      }
      
      const { error } = await supabase
        .from('business_suppliers')
        .delete()
        .eq('id', id)
        .eq('business_id', businessUser.business_id); // Add this line to ensure we only delete suppliers from our business

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-suppliers'] });
      toast.success('Supplier deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting supplier:', error);
      let errorMessage = 'Failed to delete supplier';
      
      if (error.message === 'Authentication required') {
        errorMessage = 'You need to be logged in to delete a supplier';
      } else if (error.message?.includes('row-level security policy')) {
        errorMessage = 'You do not have permission to delete suppliers in this business';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
    }
  });

  // Toggle supplier status mutation
  const toggleSupplierStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => {
      if (!businessUser) {
        throw new Error("Authentication required");
      }
      
      const status = isActive ? 'active' : 'inactive';
      
      const { data: supplier, error } = await supabase
        .from('business_suppliers')
        .update({ account_status: status })
        .eq('id', id)
        .eq('business_id', businessUser.business_id) // Add this line to ensure we only update suppliers from our business
        .select('*')
        .single();

      if (error) throw error;
      return supplier as BusinessSupplier;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['business-suppliers'] });
      toast.success(`Supplier ${data.account_status === 'active' ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error: any) => {
      console.error('Error toggling supplier status:', error);
      let errorMessage = 'Failed to update supplier status';
      
      if (error.message === 'Authentication required') {
        errorMessage = 'You need to be logged in to update supplier status';
      } else if (error.message?.includes('row-level security policy')) {
        errorMessage = 'You do not have permission to update suppliers in this business';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
    }
  });

  return {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    toggleSupplierStatus,
  };
};
