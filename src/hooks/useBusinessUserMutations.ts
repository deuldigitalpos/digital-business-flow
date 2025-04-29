
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    mutationFn: async ({ userData, businessId, locationIds }: { 
      userData: any; 
      businessId: string; 
      locationIds?: string[] 
    }) => {
      // First check if email already exists for this business
      const emailExists = await checkEmailExists(userData.email, businessId);
      
      if (emailExists) {
        throw new Error("A user with this email already exists in this business");
      }

      try {
        // If using the add_business_user_with_locations function is causing issues,
        // let's try a direct approach with separate operations
        const { data, error } = await supabase
          .from('business_users')
          .insert([{ ...userData, business_id: businessId }])
          .select();
        
        if (error) {
          if (error.code === '23505' && error.message.includes('business_users_email_key')) {
            throw new Error("A user with this email already exists");
          }
          throw error;
        }
        
        // If we have location IDs and the user was successfully created
        if (locationIds && locationIds.length > 0 && data && data.length > 0) {
          const userId = data[0].id;
          
          // Prepare location entries
          const locationEntries = locationIds.map(locationId => ({
            user_id: userId,
            location_id: locationId
          }));
          
          // Insert location assignments
          const { error: locError } = await supabase
            .from('user_locations')
            .insert(locationEntries);
          
          if (locError) {
            console.error('Error assigning locations:', locError);
            // We won't throw here as the user is already created
            // This will be handled separately
          }
        }
        
        return data;
      } catch (error) {
        console.error('Error in createBusinessUser:', error);
        throw error;
      }
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
    mutationFn: async ({ 
      userData, 
      userId, 
      businessId, 
      locationIds 
    }: { 
      userData: any; 
      userId: string; 
      businessId: string;
      locationIds?: string[] 
    }) => {
      // Check if updating the email to one that already exists
      if (userData.email) {
        const emailExists = await checkEmailExists(userData.email, businessId, userId);
        
        if (emailExists) {
          throw new Error("A user with this email already exists in this business");
        }
      }

      try {
        // Update the user data first
        const { data, error } = await supabase
          .from('business_users')
          .update(userData)
          .eq('id', userId)
          .select();
        
        if (error) {
          if (error.code === '23505' && error.message.includes('business_users_email_key')) {
            throw new Error("A user with this email already exists");
          }
          throw error;
        }
        
        // Handle location assignments if provided
        if (locationIds) {
          // First delete existing assignments
          const { error: deleteError } = await supabase
            .from('user_locations')
            .delete()
            .eq('user_id', userId);
          
          if (deleteError) {
            console.error('Error deleting existing locations:', deleteError);
            // Continue with the process, we still want to try adding new locations
          }
          
          // Only proceed with insertion if there are locations to assign
          if (locationIds.length > 0) {
            // Prepare location entries
            const locationEntries = locationIds.map(locationId => ({
              user_id: userId,
              location_id: locationId
            }));
            
            // Insert new location assignments
            const { error: insertError } = await supabase
              .from('user_locations')
              .insert(locationEntries);
            
            if (insertError) {
              console.error('Error assigning new locations:', insertError);
              // This will be handled separately, not throwing
            }
          }
        }
        
        return data;
      } catch (error) {
        console.error('Error in updateBusinessUser:', error);
        throw error;
      }
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
