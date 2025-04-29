
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
import UnitList from "./UnitList";
import AddUnitForm from "./AddUnitForm";
import EditUnitForm from "./EditUnitForm";
import { useBusinessUnits } from "@/hooks/useBusinessUnits";
import { useBusinessUnitMutations } from "@/hooks/useBusinessUnitMutations";
import { BusinessUnit } from "@/types/business-unit";

const UnitManager: React.FC = () => {
  const { data: units, isLoading } = useBusinessUnits();
  const { deleteUnit } = useBusinessUnitMutations();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnit | null>(null);

  const handleEdit = (unit: BusinessUnit) => {
    setSelectedUnit(unit);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (unit: BusinessUnit) => {
    setSelectedUnit(unit);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUnit) {
      try {
        await deleteUnit.mutateAsync(selectedUnit.id);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Error deleting unit:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Manage Units</h2>
          <p className="text-muted-foreground">
            Create and manage measurement units for your products
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Unit</DialogTitle>
            </DialogHeader>
            <AddUnitForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <UnitList
        units={units || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit dialog */}
      {selectedUnit && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Unit</DialogTitle>
            </DialogHeader>
            <EditUnitForm 
              unit={selectedUnit} 
              onSuccess={() => setIsEditDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the unit{" "}
              <span className="font-semibold">{selectedUnit?.name}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteUnit.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UnitManager;
