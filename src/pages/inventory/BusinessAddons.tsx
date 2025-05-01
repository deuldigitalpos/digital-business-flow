
import React from "react";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import PermissionGuard from "@/components/business/PermissionGuard";
import useBusinessAddons from "@/hooks/useBusinessAddons";
import AddonDashboard from "@/components/business-inventory/AddonDashboard";
import AddonList from "@/components/business-inventory/AddonList";

const BusinessAddons: React.FC = () => {
  const { addons, isLoading } = useBusinessAddons();
  
  return (
    <PermissionGuard permission="inventory">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add-ons</h1>
          <p className="text-muted-foreground">
            Manage product add-ons and extras
          </p>
        </div>

        <AddonDashboard addons={addons} isLoading={isLoading} />
        <AddonList addons={addons} isLoading={isLoading} />
      </div>
    </PermissionGuard>
  );
};

export default BusinessAddons;
