
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import PermissionGuard from "@/components/business/PermissionGuard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductsSummary from "@/components/business-inventory/ProductsSummary";
import ProductsFilters from "@/components/business-inventory/ProductsFilters";
import ProductsTable from "@/components/business-inventory/ProductsTable";
import AddProductModal from "@/components/business-inventory/AddProductModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BusinessProducts: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { businessUser } = useBusinessAuth();

  // Check if product-images bucket exists, if not create it
  useEffect(() => {
    const checkAndCreateBucket = async () => {
      if (!businessUser?.business_id) return;
      
      try {
        // Check if bucket exists
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error("Error checking buckets:", error);
          return;
        }
        
        const bucketExists = buckets.some(bucket => bucket.name === 'product-images');
        
        if (!bucketExists) {
          // Create the bucket
          const { error: createError } = await supabase.storage.createBucket('product-images', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
          });
          
          if (createError) {
            console.error("Error creating product-images bucket:", createError);
            toast.error("Failed to initialize image storage");
          } else {
            console.log("Created product-images bucket");
          }
        }
      } catch (err) {
        console.error("Error in bucket setup:", err);
      }
    };
    
    checkAndCreateBucket();
  }, [businessUser?.business_id]);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  return (
    <PermissionGuard permission="products">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
            <p className="text-muted-foreground">
              Manage your product catalog, ingredients, consumables, and pricing
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        <ProductsSummary />

        <ProductsFilters onFilterChange={handleFilterChange} />

        <Card>
          <CardContent className="pt-6">
            <ProductsTable filters={filters} />
          </CardContent>
        </Card>
        
        <AddProductModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </PermissionGuard>
  );
};

export default BusinessProducts;
