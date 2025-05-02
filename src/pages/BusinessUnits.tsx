
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import UnitManager from "@/components/business/UnitManager";
import PermissionGuard from "@/components/business/PermissionGuard";

const BusinessUnits: React.FC = () => {
  return (
    <PermissionGuard permission="products">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Units</h1>
          <p className="text-muted-foreground">
            Manage measurement units for your products and inventory
          </p>
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
