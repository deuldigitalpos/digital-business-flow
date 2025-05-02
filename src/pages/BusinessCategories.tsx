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
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import { useBusinessCategoryMutations } from "@/hooks/useBusinessCategoryMutations";
import { BusinessCategory } from "@/types/business-category";
import CategoryList from "@/components/business/CategoryList";
import AddCategoryForm from "@/components/business/AddCategoryForm";
import EditCategoryForm from "@/components/business/EditCategoryForm";
import { Plus } from "lucide-react";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import { Badge } from "@/components/ui/badge";

const BusinessCategories: React.FC = () => {
  const { data: categories, isLoading, error } = useBusinessCategories();
  const { deleteCategory, updateCategory } = useBusinessCategoryMutations();
  const { businessUser } = useBusinessAuth();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | null>(null);

  const handleEdit = (category: BusinessCategory) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (category: BusinessCategory) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedCategory) {
      try {
        await deleteCategory.mutateAsync(selectedCategory.id);
      } catch (error) {
        console.error("Error deleting category:", error);
      } finally {
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const handleStatusChange = async (category: BusinessCategory, newStatus: boolean) => {
    try {
      await updateCategory.mutateAsync({
        id: category.id,
        data: { is_active: newStatus },
      });
    } catch (error) {
      console.error("Error updating category status:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <AddCategoryForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {error ? (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-600">Error loading categories: {error.message}</p>
        </div>
      ) : (
        <CategoryList
          categories={categories || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      )}

      {/* Edit Dialog */}
      {selectedCategory && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <EditCategoryForm
              category={selectedCategory}
              onSuccess={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{selectedCategory?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {deleteCategory.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BusinessCategories;
