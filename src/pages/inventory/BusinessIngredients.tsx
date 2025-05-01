
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import PermissionGuard from "@/components/business/PermissionGuard";

const BusinessIngredients: React.FC = () => {
  return (
    <PermissionGuard permission="inventory">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Raw Ingredients</h1>
          <p className="text-muted-foreground">
            Manage your raw ingredient inventory
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="p-4 text-center">
              <p className="text-muted-foreground">Raw ingredients management functionality coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
};

export default BusinessIngredients;
