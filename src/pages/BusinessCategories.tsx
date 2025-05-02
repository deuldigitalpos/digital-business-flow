
import React, { useEffect } from "react";
import CategoryManager from "@/components/business/CategoryManager";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const BusinessCategories: React.FC = () => {
  const { businessUser } = useBusinessAuth();
  const { toast } = useToast();
  
  // Function to create a test category
  const createTestCategory = async () => {
    if (!businessUser?.business_id) {
      toast({
        title: "Error",
        description: "Business ID not available. Are you logged in?",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("business_categories")
        .insert({
          name: "Test Category " + new Date().toISOString().slice(11, 19),
          description: "This is a test category created to verify data access",
          business_id: businessUser.business_id
        })
        .select();

      if (error) {
        console.error("Error creating test category:", error);
        toast({
          title: "Error creating test category",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Test category created",
          description: "The test category was created successfully",
          variant: "success",
        });
        console.log("Test category created:", data);
      }
    } catch (err) {
      console.error("Exception creating test category:", err);
    }
  };

  // Check auth status and business ID when component mounts
  useEffect(() => {
    console.log("Business Categories page - Business User:", businessUser?.id);
    console.log("Business Categories page - Business ID:", businessUser?.business_id);
  }, [businessUser]);

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product and service categories.
          </p>
        </div>
        
        <Button 
          onClick={createTestCategory} 
          variant="outline"
          className="self-start"
        >
          Create Test Category
        </Button>
      </div>
      
      <CategoryManager />
    </div>
  );
};

export default BusinessCategories;
