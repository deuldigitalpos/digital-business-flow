
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import PermissionGuard from "@/components/business/PermissionGuard";

const BusinessStock: React.FC = () => {
  return (
    <PermissionGuard permission="stock">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
          <p className="text-muted-foreground">
            Track and manage your inventory stock levels
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="p-4 text-center">
              <p className="text-muted-foreground">Stock management functionality coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
};

export default BusinessStock;
