
import React, { useState } from 'react';
import { useBusinessIngredients } from '@/hooks/useBusinessIngredients';
import { useBusinessIngredientMutations } from '@/hooks/useBusinessIngredientMutations';
import { Dialog } from '@/components/ui/dialog';
import IngredientForm from './IngredientForm';
import ConsumableTransactionHistory from './ConsumableTransactionHistory';
import IngredientsTable from './ingredient-list/IngredientsTable';

interface IngredientListProps {
  searchTerm?: string;
  categoryFilter?: string;
}

const IngredientList: React.FC<IngredientListProps> = ({ 
  searchTerm = '', 
  categoryFilter 
}) => {
  const { ingredients, isLoading, refetch } = useBusinessIngredients();
  const { deleteIngredient } = useBusinessIngredientMutations();
  const [selectedIngredient, setSelectedIngredient] = useState<BusinessIngredient | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTransactionHistoryOpen, setIsTransactionHistoryOpen] = useState(false);

  const handleEdit = (ingredient: BusinessIngredient) => {
    setSelectedIngredient(ingredient);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      try {
        await deleteIngredient.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting ingredient:', error);
      }
    }
  };

  const handleViewTransactions = (ingredient: BusinessIngredient) => {
    setSelectedIngredient(ingredient);
    setIsTransactionHistoryOpen(true);
  };

  return (
    <>
      <IngredientsTable
        ingredients={ingredients}
        isLoading={isLoading}
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewTransactions={handleViewTransactions}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        {selectedIngredient ? (
          <IngredientForm 
            ingredient={selectedIngredient} 
            onClose={() => {
              setIsFormOpen(false);
              setSelectedIngredient(null);
              refetch();
            }}
          />
        ) : (
          <IngredientForm 
            ingredient={null} 
            onClose={() => {
              setIsFormOpen(false);
              refetch();
            }}
          />
        )}
      </Dialog>

      <Dialog open={isTransactionHistoryOpen} onOpenChange={setIsTransactionHistoryOpen}>
        {selectedIngredient && (
          <ConsumableTransactionHistory 
            consumable={{
              ...selectedIngredient,
              unit: selectedIngredient.unit
            }}
            onClose={() => {
              setIsTransactionHistoryOpen(false);
              setSelectedIngredient(null);
            }}
          />
        )}
      </Dialog>
    </>
  );
};

export default IngredientList;
