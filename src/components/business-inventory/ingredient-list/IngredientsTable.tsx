
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BusinessIngredient } from '@/hooks/useBusinessIngredients';
import IngredientTableState from './IngredientTableState';
import IngredientTableRow from './IngredientTableRow';

interface IngredientsTableProps {
  ingredients: BusinessIngredient[];
  isLoading: boolean;
  searchTerm?: string;
  categoryFilter?: string;
  onEdit: (ingredient: BusinessIngredient) => void;
  onDelete: (id: string) => void;
  onViewTransactions: (ingredient: BusinessIngredient) => void;
}

const IngredientsTable: React.FC<IngredientsTableProps> = ({
  ingredients,
  isLoading,
  searchTerm,
  categoryFilter,
  onEdit,
  onDelete,
  onViewTransactions
}) => {
  const filteredIngredients = ingredients.filter(ingredient => {
    // Filter by search term
    const matchesSearch = !searchTerm || 
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ingredient.description && ingredient.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by category - using the categoryMatches function
    const matchesCategory = categoryMatches(ingredient, categoryFilter);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <IngredientTableState
            isLoading={isLoading}
            isEmpty={filteredIngredients.length === 0}
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
          />

          {!isLoading && filteredIngredients.length > 0 && filteredIngredients.map((ingredient) => (
            <IngredientTableRow
              key={ingredient.id}
              ingredient={ingredient}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewTransactions={onViewTransactions}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper to check if an ingredient's category matches the filter
const categoryMatches = (ingredient: BusinessIngredient, filter?: string) => {
  // Case 1: No filter selected or "all" is selected
  if (!filter || filter === 'all') return true;
  
  // Case 2: Direct category ID match
  if (ingredient.category_id && filter.includes(ingredient.category_id)) return true;
  
  // Case 3: Handle generated ID matches - match based on category name in filter
  if (filter.includes('category-') && ingredient.category?.name) {
    return filter.toLowerCase().includes(ingredient.category.name.toLowerCase());
  }
  
  // Case 4: Handle unnamed categories
  if (ingredient.category_id === null && filter.includes('unnamed')) {
    return true;
  }
  
  return false;
};

export default IngredientsTable;
