
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export interface BusinessLead {
  id: string;
  business_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessLeadInput {
  business_id: string;
  name: string;
}

export const useBusinessLeadsMutations = () => {
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
            throw new Error("Authentication required to manage leads");
          }
          console.log("Authentication successful");
        } else {
          throw new Error("Authentication required to manage leads");
        }
      }
      
      return true;
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication failed. Please try again.");
    }
  };

  const createLead = useMutation({
    mutationFn: async (data: BusinessLeadInput) => {
      // Ensure authentication before proceeding
      await ensureAuthentication();

      console.log("Creating lead with data:", data);

      const { data: lead, error } = await supabase
        .from('business_leads')
        .insert([data])
        .select('*')
        .single();

      if (error) {
        console.error("Error from Supabase:", error);
        throw error;
      }
      
      console.log("Created lead successfully:", lead);
      return lead as BusinessLead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });
      toast.success("Lead created successfully");
    },
    onError: (error) => {
      console.error('Error creating lead:', error);
      toast.error(`Failed to create lead: ${error.message}`);
    }
  });

  const updateLead = useMutation({
    mutationFn: async ({ id, name }: { id: string, name: string }) => {
      await ensureAuthentication();

      const { data: lead, error } = await supabase
        .from('business_leads')
        .update({ name })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return lead as BusinessLead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });
      toast.success('Lead updated successfully');
    },
    onError: (error) => {
      console.error('Error updating lead:', error);
      toast.error(`Failed to update lead: ${error.message}`);
    }
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      await ensureAuthentication();

      const { error } = await supabase
        .from('business_leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-leads'] });
      toast.success('Lead deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting lead:', error);
      toast.error(`Failed to delete lead: ${error.message}`);
    }
  });

  // Hook to fetch business leads
  const useBusinessLeads = (businessId?: string) => {
    return useQuery({
      queryKey: ['business-leads', businessId],
      queryFn: async () => {
        if (!businessId) return [];
        
        await ensureAuthentication();
        
        const { data, error } = await supabase
          .from('business_leads')
          .select('*')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data as BusinessLead[];
      },
      enabled: !!businessId && !!businessUser
    });
  };

  return {
    createLead,
    updateLead,
    deleteLead,
    useBusinessLeads
  };
};
