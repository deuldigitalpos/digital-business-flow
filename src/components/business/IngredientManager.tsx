
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
import { useBusinessIngredientMutations } from '@/hooks/useBusinessIngredientMutations';
import { BusinessIngredient } from '@/types/business-ingredient';
import IngredientList from './IngredientList';
import AddIngredientForm from './AddIngredientForm';
import EditIngredientForm from './EditIngredientForm';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

interface IngredientManagerProps {
  onActionSuccess?: (message: string) => void;
  onActionError?: (message: string) => void;
}

const IngredientManager: React.FC<IngredientManagerProps> = ({ 
  onActionSuccess, 
  onActionError 
}) => {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<BusinessIngredient | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { deleteIngredient } = useBusinessIngredientMutations();
  const queryClient = useQueryClient();
  const { businessUser } = useBusinessAuth();

  console.log('Current business user in IngredientManager:', businessUser?.id);

  const handleAddClick = () => {
    setIsAddSheetOpen(true);
  };

  const handleEditClick = (ingredient: BusinessIngredient) => {
    setSelectedIngredient(ingredient);
    setIsEditSheetOpen(true);
  };

  const handleDeleteClick = (ingredient: BusinessIngredient) => {
    setSelectedIngredient(ingredient);
    setIsDeleteDialogOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddSheetOpen(false);
    // Force a refresh of the ingredients list
    queryClient.invalidateQueries({ queryKey: ['business-ingredients'] });
    if (onActionSuccess) onActionSuccess('Ingredient added successfully');
    else toast.success('Ingredient added successfully');
  };

  const handleAddError = (error: any) => {
    console.error('Error adding ingredient:', error);
    const errorMessage = `Error adding ingredient: ${error.message || 'Unknown error'}`;
    if (onActionError) onActionError(errorMessage);
    else toast.error(errorMessage);
  };

  const handleEditSuccess = () => {
    setIsEditSheetOpen(false);
    // Force a refresh of the ingredients list
    queryClient.invalidateQueries({ queryKey: ['business-ingredients'] });
    if (onActionSuccess) onActionSuccess('Ingredient updated successfully');
    else toast.success('Ingredient updated successfully');
  };

  const handleEditError = (error: any) => {
    console.error('Error updating ingredient:', error);
    const errorMessage = `Error updating ingredient: ${error.message || 'Unknown error'}`;
    if (onActionError) onActionError(errorMessage);
    else toast.error(errorMessage);
    setIsEditSheetOpen(false);
  };

  const handleDelete = async () => {
    if (selectedIngredient) {
      try {
        setIsProcessing(true);
        console.log('Deleting ingredient with ID:', selectedIngredient.id);
        await deleteIngredient.mutateAsync(selectedIngredient.id);
        setIsDeleteDialogOpen(false);
        setSelectedIngredient(null);
        if (onActionSuccess) onActionSuccess('Ingredient deleted successfully');
      } catch (error) {
        console.error('Error deleting ingredient:', error);
        const errorMessage = `Failed to delete ingredient: ${error instanceof Error ? error.message : 'Unknown error'}`;
        if (onActionError) onActionError(errorMessage);
        else toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div>
      <IngredientList 
        onAddNew={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Add Ingredient Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add New Ingredient</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <AddIngredientForm 
              onSuccess={handleAddSuccess} 
              onError={handleAddError}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Ingredient Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Ingredient</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            {selectedIngredient && (
              <EditIngredientForm 
                ingredient={selectedIngredient} 
                onSuccess={handleEditSuccess}
                onError={handleEditError}
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
              This will permanently delete this ingredient. This action cannot be undone.
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

export default IngredientManager;
