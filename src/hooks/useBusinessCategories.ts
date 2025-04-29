
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import { BusinessCategory } from "@/types/business-category";
import { useToast } from "@/hooks/use-toast";

export function useBusinessCategories() {
  const { businessUser } = useBusinessAuth();
  const { toast } = useToast();
  
  const businessId = businessUser?.business_id;

  return useQuery({
    queryKey: ["business-categories", businessId],
    queryFn: async (): Promise<BusinessCategory[]> => {
      if (!businessId) {
        throw new Error("No business ID available");
      }

      const { data, error } = await supabase
        .from("business_categories")
        .select("*")
        .eq("business_id", businessId)
        .order("name");

      if (error) {
        toast({
          title: "Error fetching categories",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as BusinessCategory[];
    },
    enabled: !!businessId,
  });
}
