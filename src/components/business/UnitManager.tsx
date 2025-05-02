
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
import { Plus } from "lucide-react";
import UnitList from "./UnitList";
import AddUnitForm from "./AddUnitForm";
import EditUnitForm from "./EditUnitForm";
import { useBusinessUnits } from "@/hooks/useBusinessUnits";
import { useBusinessUnitMutations } from "@/hooks/useBusinessUnitMutations";
import { BusinessUnit } from "@/types/business-unit";
import { toast } from "sonner";

const DEFAULT_UNITS = [
  { name: "Kilogram", short_name: "kg", description: "Standard unit of mass" },
  { name: "Gram", short_name: "g", description: "Metric unit of mass (1/1000 kg)" },
  { name: "Milligram", short_name: "mg", description: "Metric unit of mass (1/1000 g)" },
  { name: "Liter", short_name: "l", description: "Standard unit of volume" },
  { name: "Milliliter", short_name: "ml", description: "Volume unit (1/1000 liter)" },
  { name: "Centimeter", short_name: "cm", description: "Length unit (1/100 meter)" },
  { name: "Meter", short_name: "m", description: "Standard unit of length" },
  { name: "Piece", short_name: "pc", description: "Count of individual items" },
  { name: "Box", short_name: "box", description: "Container for multiple items" },
  { name: "Pack", short_name: "pack", description: "Group of items packaged together" },
  { name: "Dozen", short_name: "doz", description: "Twelve units" },
  { name: "Tablespoon", short_name: "tbsp", description: "Cooking measurement (approx 15 ml)" },
  { name: "Teaspoon", short_name: "tsp", description: "Cooking measurement (approx 5 ml)" },
  { name: "Cup", short_name: "cup", description: "Volume unit used in cooking" },
  { name: "Ounce", short_name: "oz", description: "Unit of weight" },
  { name: "Pound", short_name: "lb", description: "Unit of weight (16 ounces)" }
];

const UnitManager: React.FC = () => {
  const { data: units, isLoading, refetch } = useBusinessUnits();
  const { createUnit, deleteUnit } = useBusinessUnitMutations();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnit | null>(null);

  // Check if default units exist and create them if they don't
  useEffect(() => {
    const setupDefaultUnits = async () => {
      if (!units) return;
      
      // Get existing default unit short names
      const existingShortNames = units
        .filter(unit => unit.is_default)
        .map(unit => unit.short_name);
      
      // Find missing default units
      const missingUnits = DEFAULT_UNITS.filter(
        unit => !existingShortNames.includes(unit.short_name)
      );

      // Create missing default units
      if (missingUnits.length > 0) {
        try {
          console.log(`Adding ${missingUnits.length} missing default units`);
          
          // Create all missing default units
          for (const unit of missingUnits) {
            await createUnit.mutateAsync({
              ...unit,
              is_default: true
            });
          }
          
          // Refetch units after creating defaults
          toast.success(`Added ${missingUnits.length} default units`);
          refetch();
        } catch (error) {
          console.error("Error creating default units:", error);
          toast.error("Failed to create some default units");
        }
      }
    };

    setupDefaultUnits();
  }, [units, createUnit, refetch]);

  const handleEdit = (unit: BusinessUnit) => {
    if (unit.is_default) {
      toast.info("Default units cannot be edited");
      return;
    }
    setSelectedUnit(unit);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (unit: BusinessUnit) => {
    if (unit.is_default) {
      toast.info("Default units cannot be deleted");
      return;
    }
    setSelectedUnit(unit);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUnit) {
      try {
        await deleteUnit.mutateAsync(selectedUnit.id);
        setIsDeleteDialogOpen(false);
        toast.success("Unit deleted successfully");
      } catch (error) {
        console.error("Error deleting unit:", error);
        toast.error("Failed to delete unit");
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
            <AddUnitForm onSuccess={() => {
              setIsAddDialogOpen(false);
              refetch();
              toast.success("Unit created successfully");
            }} />
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Unit</DialogTitle>
          </DialogHeader>
          {selectedUnit && (
            <EditUnitForm 
              unit={selectedUnit} 
              onSuccess={() => {
                setIsEditDialogOpen(false);
                refetch();
                toast.success("Unit updated successfully");
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

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
