
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import PermissionGuard from "@/components/business/PermissionGuard";

const BusinessAddons: React.FC = () => {
  return (
    <PermissionGuard permission="inventory">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add-ons</h1>
          <p className="text-muted-foreground">
            Manage product add-ons and extras
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="p-4 text-center">
              <p className="text-muted-foreground">Add-ons management functionality coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
};

export default BusinessAddons;
