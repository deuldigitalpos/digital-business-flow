import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useBusinessBrands } from "@/hooks/useBusinessBrands";
import { useBusinessBrandMutations } from "@/hooks/useBusinessBrandMutations";
import { BusinessBrand } from "@/types/business-brand";
import BrandList from "./BrandList";
import AddBrandForm from "./AddBrandForm";
import EditBrandForm from "./EditBrandForm";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import { supabase } from "@/integrations/supabase/client";

const BrandManager: React.FC = () => {
  const { brands, isLoading, error, refetch } = useBusinessBrands();
  const { deleteBrand } = useBusinessBrandMutations();
  const { businessUser } = useBusinessAuth();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<BusinessBrand | null>(null);

  // Use effect to check authentication and data loading
  useEffect(() => {
    console.log('BrandManager - Business User ID:', businessUser?.id);
    console.log('BrandManager - Business ID:', businessUser?.business_id);
    console.log('BrandManager - Brands count:', brands?.length || 0);
    console.log('BrandManager - Loading:', isLoading);
    if (error) console.error('BrandManager - Error:', error);
  }, [businessUser, brands, isLoading, error]);

  const handleEdit = (brand: BusinessBrand) => {
    setSelectedBrand(brand);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (brand: BusinessBrand) => {
    setSelectedBrand(brand);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedBrand) {
      try {
        await deleteBrand.mutateAsync(selectedBrand.id);
        setIsDeleteDialogOpen(false);
        toast.success("Brand deleted successfully");
      } catch (error) {
        console.error("Error deleting brand:", error);
        toast.error("Failed to delete brand");
      }
    }
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    refetch();
    toast.success("Brand added successfully");
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    refetch();
    toast.success("Brand updated successfully");
  };

  // Create test brand function to verify database access
  const createTestBrand = async () => {
    if (!businessUser?.business_id) {
      toast.error("Business ID not available. Are you logged in?");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("business_brands")
        .insert({
          name: "Test Brand " + new Date().toISOString().slice(11, 19),
          description: "This is a test brand created to verify data access",
          business_id: businessUser.business_id,
          is_active: true
        })
        .select();

      if (error) {
        console.error("Error creating test brand:", error);
        toast.error("Failed to create test brand: " + error.message);
      } else {
        toast.success("Test brand created successfully");
        console.log("Test brand created:", data);
        refetch();
      }
    } catch (err) {
      console.error("Exception creating test brand:", err);
      toast.error("Exception creating test brand");
    }
  };

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md">
        <h2 className="text-xl font-bold text-red-700">Error Loading Brands</h2>
        <p className="text-red-600 mb-4">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Brands</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={createTestBrand}>
            Create Test Brand
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Brand
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Brand</DialogTitle>
              </DialogHeader>
              <AddBrandForm onSuccess={handleAddSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <BrandList
        brands={brands || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          {selectedBrand && (
            <EditBrandForm
              brand={selectedBrand}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the brand "{selectedBrand?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {deleteBrand.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BrandManager;
