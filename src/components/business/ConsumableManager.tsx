
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useBusinessConsumableMutations } from '@/hooks/useBusinessConsumableMutations';
import { BusinessConsumable } from '@/types/business-consumable';
import ConsumableList from './ConsumableList';
import AddConsumableForm from './AddConsumableForm';
import EditConsumableForm from './EditConsumableForm';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ConsumableManager: React.FC = () => {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedConsumable, setSelectedConsumable] = useState<BusinessConsumable | null>(null);
  const { deleteConsumable } = useBusinessConsumableMutations();
  const queryClient = useQueryClient();

  const handleAddClick = () => {
    setIsAddSheetOpen(true);
  };

  const handleEditClick = (consumable: BusinessConsumable) => {
    setSelectedConsumable(consumable);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (consumable: BusinessConsumable) => {
    setSelectedConsumable(consumable);
    setIsDeleteDialogOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddSheetOpen(false);
    // Force a refresh of the consumables list
    queryClient.invalidateQueries({ queryKey: ['business-consumables'] });
  };

  const handleEditSuccess = () => {
    setIsEditSheetOpen(false);
    // Force a refresh of the consumables list
    queryClient.invalidateQueries({ queryKey: ['business-consumables'] });
  };

  const handleDelete = async () => {
    if (selectedConsumable) {
      try {
        await deleteConsumable.mutateAsync(selectedConsumable.id);
        setIsDeleteDialogOpen(false);
        setSelectedConsumable(null);
      } catch (error) {
        // Toast is now handled in the mutation hook
      }
    }
  };

  return (
    <div>
      <ConsumableList 
        onAddNew={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Add Consumable Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add New Consumable</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <AddConsumableForm onSuccess={handleAddSuccess} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Consumable Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Consumable</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            {selectedConsumable && (
              <EditConsumableForm 
                consumable={selectedConsumable} 
                onSuccess={handleEditSuccess}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this consumable. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConsumableManager;
