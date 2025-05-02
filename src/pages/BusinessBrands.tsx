
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import BrandManager from "@/components/business/BrandManager";
import PermissionGuard from "@/components/business/PermissionGuard";

const BusinessBrands: React.FC = () => {
  return (
    <PermissionGuard permission="products">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
          <p className="text-muted-foreground">
            Manage brands for your products and inventory
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <BrandManager />
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
};

export default BusinessBrands;
