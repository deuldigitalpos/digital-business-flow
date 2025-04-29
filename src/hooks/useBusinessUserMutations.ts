
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useBusinessUserMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkEmailExists = async (email: string, businessId: string, userId?: string) => {
    // Build the query to check for existing email
    let query = supabase
      .from('business_users')
      .select('id, email')
      .eq('email', email)
      .eq('business_id', businessId);
    
    // If we're updating a user, exclude the current user from the check
    if (userId) {
      query = query.neq('id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error checking email existence:', error);
      return false; // Proceed if we can't check (will be caught by database constraint)
    }
    
    return data && data.length > 0;
  };

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

  const createBusinessUser = useMutation({
    mutationFn: async ({ userData, businessId }: { userData: any; businessId: string }) => {
      // First check if email already exists for this business
      const emailExists = await checkEmailExists(userData.email, businessId);
      
      if (emailExists) {
        throw new Error("A user with this email already exists in this business");
      }

      // If email is unique, proceed with creation
      const { data, error } = await supabase
        .from('business_users')
        .insert([{ ...userData, business_id: businessId }])
        .select();
      
      if (error) {
        // Handle specific constraint errors
        if (error.code === '23505' && error.message.includes('business_users_email_key')) {
          throw new Error("A user with this email already exists");
        }
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessUsers'] });
      toast({
        title: "User added",
        description: "The user has been successfully added to this business."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add user",
        variant: "destructive"
      });
    }
  });

  const updateBusinessUser = useMutation({
    mutationFn: async ({ userData, userId, businessId }: { userData: any; userId: string; businessId: string }) => {
      // Check if updating the email to one that already exists
      if (userData.email) {
        const emailExists = await checkEmailExists(userData.email, businessId, userId);
        
        if (emailExists) {
          throw new Error("A user with this email already exists in this business");
        }
      }

      // If email is unique or not being updated, proceed with update
      const { data, error } = await supabase
        .from('business_users')
        .update(userData)
        .eq('id', userId)
        .select();
      
      if (error) {
        // Handle specific constraint errors
        if (error.code === '23505' && error.message.includes('business_users_email_key')) {
          throw new Error("A user with this email already exists");
        }
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessUsers'] });
      toast({
        title: "User updated",
        description: "The user has been successfully updated."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive"
      });
    }
  });

  return { deleteBusinessUser, createBusinessUser, updateBusinessUser };
};
