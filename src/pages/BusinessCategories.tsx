
import React from "react";
import CategoryManager from "@/components/business/CategoryManager";

const BusinessCategories: React.FC = () => {
  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Manage your product and service categories.
        </p>
      </div>
      
      <CategoryManager />
    </div>
  );
};

export default BusinessCategories;
