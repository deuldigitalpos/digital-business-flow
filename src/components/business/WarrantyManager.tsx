
import React, { useState } from "react";
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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { BusinessWarranty } from "@/types/business-warranty";
import useBusinessWarranties from "@/hooks/useBusinessWarranties";
import { useBusinessWarrantyMutations } from "@/hooks/useBusinessWarrantyMutations";
import AddWarrantyForm from "./AddWarrantyForm";
import EditWarrantyForm from "./EditWarrantyForm";
import WarrantyList from "./WarrantyList";

const WarrantyManager: React.FC = () => {
  const { warranties, isLoading } = useBusinessWarranties();
  const { deleteWarranty } = useBusinessWarrantyMutations();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<BusinessWarranty | null>(null);

  const handleEdit = (warranty: BusinessWarranty) => {
    setSelectedWarranty(warranty);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (warranty: BusinessWarranty) => {
    setSelectedWarranty(warranty);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedWarranty) {
      try {
        await deleteWarranty.mutateAsync(selectedWarranty.id);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Error deleting warranty:", error);
        toast.error("Failed to delete warranty");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Warranties</h2>
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
            <AddWarrantyForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <WarrantyList
        warranties={warranties || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Warranty</DialogTitle>
          </DialogHeader>
          {selectedWarranty && (
            <EditWarrantyForm
              warranty={selectedWarranty}
              onSuccess={() => setIsEditDialogOpen(false)}
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
              This will permanently delete the warranty "{selectedWarranty?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {deleteWarranty.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WarrantyManager;
