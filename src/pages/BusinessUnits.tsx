
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import UnitManager from "@/components/business/UnitManager";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import PermissionGuard from "@/components/business/PermissionGuard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BusinessUnits: React.FC = () => {
  const { businessUser } = useBusinessAuth();

  const createTestUnit = async () => {
    if (!businessUser?.business_id) {
      toast.error("Business ID not available. Are you logged in?");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("business_units")
        .insert({
          name: "Test Unit " + new Date().toISOString().slice(11, 19),
          short_name: "TST" + Math.floor(Math.random() * 100),
          description: "This is a test unit created to verify data access",
          business_id: businessUser.business_id,
          is_default: false
        })
        .select();

      if (error) {
        console.error("Error creating test unit:", error);
        toast.error("Failed to create test unit: " + error.message);
      } else {
        toast.success("Test unit created successfully");
        console.log("Test unit created:", data);
      }
    } catch (err) {
      console.error("Exception creating test unit:", err);
      toast.error("Exception creating test unit");
    }
  };

  return (
    <PermissionGuard permission="products">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Units</h1>
            <p className="text-muted-foreground">
              Manage measurement units for your products and inventory
            </p>
          </div>
          
          <Button 
            onClick={createTestUnit} 
            variant="outline"
            className="self-start"
          >
            Create Test Unit
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <UnitManager />
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
};

export default BusinessUnits;
