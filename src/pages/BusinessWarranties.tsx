
import React from "react";
import WarrantyManager from "@/components/business/WarrantyManager";
import PermissionGuard from "@/components/business/PermissionGuard";

export default function BusinessWarranties() {
  return (
    <PermissionGuard permission="products">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Warranty Management</h1>
          <p className="text-muted-foreground">
            Create and manage warranties for your business products
          </p>
        </div>

        <div className="rounded-lg border shadow-sm p-4 md:p-6 bg-white">
          <WarrantyManager />
        </div>
      </div>
    </PermissionGuard>
  );
}
