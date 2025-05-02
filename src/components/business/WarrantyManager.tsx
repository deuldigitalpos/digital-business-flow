
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
import { Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useBusinessWarranties, useExpiredWarranties, useWarrantyProductsCount } from "@/hooks/useBusinessWarranties";
import { useBusinessWarrantyMutations } from "@/hooks/useBusinessWarrantyMutations";
import { BusinessWarranty } from "@/types/business-warranty";
import WarrantyList from "./WarrantyList";
import AddWarrantyForm from "./AddWarrantyForm";
import EditWarrantyForm from "./EditWarrantyForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const WarrantyManager: React.FC = () => {
  const { warranties, isLoading, error, refetch } = useBusinessWarranties();
  const { deleteWarranty } = useBusinessWarrantyMutations();
  const { data: productCounts } = useWarrantyProductsCount();
  const { data: expiredWarranties } = useExpiredWarranties();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<BusinessWarranty | null>(null);

  // Check for expired warranties and show notifications
  useEffect(() => {
    if (expiredWarranties && expiredWarranties.length > 0) {
      toast.warning(`You have ${expiredWarranties.length} expired warranty items`, {
        duration: 5000,
        action: {
          label: 'View',
          onClick: () => { /* Could navigate to a detailed view */ }
        }
      });
    }
  }, [expiredWarranties]);

  const handleEdit = (warranty: BusinessWarranty) => {
    setSelectedWarranty(warranty);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (warranty: BusinessWarranty) => {
    // Don't allow deletion if there are products using this warranty
    const count = productCounts?.[warranty.id] || 0;
    if (count > 0) {
      toast.error(`Cannot delete warranty with ${count} associated products`);
      return;
    }
    
    setSelectedWarranty(warranty);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedWarranty) {
      try {
        await deleteWarranty.mutateAsync(selectedWarranty.id);
        setIsDeleteDialogOpen(false);
        toast.success("Warranty deleted successfully");
        refetch();
      } catch (error) {
        console.error("Error deleting warranty:", error);
        toast.error("Failed to delete warranty");
      }
    }
  };

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md">
        <h2 className="text-xl font-bold text-red-700">Error Loading Warranties</h2>
        <p className="text-red-600 mb-4">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expiredWarranties && expiredWarranties.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Expired Warranties</AlertTitle>
          <AlertDescription>
            You have {expiredWarranties.length} product warranties that have expired.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Warranties</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Warranty
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Warranty</DialogTitle>
            </DialogHeader>
            <AddWarrantyForm onSuccess={() => {
              setIsAddDialogOpen(false);
              refetch();
              toast.success("Warranty added successfully");
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <WarrantyList
        warranties={warranties || []}
        productCounts={productCounts || {}}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Warranty</DialogTitle>
          </DialogHeader>
          {selectedWarranty && (
            <EditWarrantyForm
              warranty={selectedWarranty}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                refetch();
                toast.success("Warranty updated successfully");
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the warranty "{selectedWarranty?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteWarranty.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WarrantyManager;
