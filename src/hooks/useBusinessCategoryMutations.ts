
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import { BusinessCategory, CreateCategoryInput, UpdateCategoryInput } from "@/types/business-category";
import { useToast } from "@/hooks/use-toast";

export function useBusinessCategoryMutations() {
  const { businessUser } = useBusinessAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const businessId = businessUser?.business_id;

  const createCategory = useMutation({
    mutationFn: async (data: CreateCategoryInput): Promise<BusinessCategory> => {
      if (!businessId) {
        throw new Error("No business ID available");
      }

      const { data: newCategory, error } = await supabase
        .from("business_categories")
        .insert({
          business_id: businessId,
          name: data.name,
          description: data.description || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating category:", error);
        throw error;
      }

      return newCategory as BusinessCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-categories", businessId] });
      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create category",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCategoryInput }): Promise<BusinessCategory> => {
      const { data: updatedCategory, error } = await supabase
        .from("business_categories")
        .update({
          name: data.name,
          description: data.description,
        })
        .eq("id", id)
        .eq("business_id", businessId)
        .select()
        .single();

      if (error) {
        console.error("Error updating category:", error);
        throw error;
      }

      return updatedCategory as BusinessCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-categories", businessId] });
      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update category",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from("business_categories")
        .delete()
        .eq("id", id)
        .eq("business_id", businessId);

      if (error) {
        console.error("Error deleting category:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-categories", businessId] });
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete category",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
