
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import WarrantyManager from "@/components/business/WarrantyManager";
import PermissionGuard from "@/components/business/PermissionGuard";

const BusinessWarranties: React.FC = () => {
  return (
    <PermissionGuard permission="products">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warranties</h1>
          <p className="text-muted-foreground">
            Manage product warranties and track expiration dates
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <WarrantyManager />
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
};

export default BusinessWarranties;
