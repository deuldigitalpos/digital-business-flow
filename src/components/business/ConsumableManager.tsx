
import React, { useState, useEffect } from 'react';
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
import { useBusinessAuth } from '@/context/BusinessAuthContext';

const ConsumableManager: React.FC = () => {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedConsumable, setSelectedConsumable] = useState<BusinessConsumable | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { deleteConsumable } = useBusinessConsumableMutations();
  const queryClient = useQueryClient();
  const { businessUser } = useBusinessAuth();

  useEffect(() => {
    // Log business user ID for debugging
    if (businessUser?.id) {
      console.log('ConsumableManager: Business user ID available:', businessUser.id);
    } else {
      console.warn('ConsumableManager: Business user ID not available');
    }
  }, [businessUser]);

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

  const handleAddError = (error: any) => {
    console.error('Error adding consumable:', error);
    toast.error(`Error adding consumable: ${error.message || 'Unknown error'}`);
  };

  const handleEditSuccess = () => {
    setIsEditSheetOpen(false);
    // Force a refresh of the consumables list
    queryClient.invalidateQueries({ queryKey: ['business-consumables'] });
  };

  const handleDelete = async () => {
    if (selectedConsumable) {
      try {
        setIsProcessing(true);
        await deleteConsumable.mutateAsync(selectedConsumable.id);
        setIsDeleteDialogOpen(false);
        setSelectedConsumable(null);
      } catch (error) {
        console.error('Error deleting consumable:', error);
        toast.error(`Failed to delete consumable: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsProcessing(false);
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
            <AddConsumableForm 
              onSuccess={handleAddSuccess} 
              onError={handleAddError}
            />
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
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isProcessing}
            >
              {isProcessing ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConsumableManager;
