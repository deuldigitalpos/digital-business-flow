
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

interface IngredientTableStateProps {
  isLoading: boolean;
  isEmpty: boolean;
  searchTerm?: string;
  categoryFilter?: string;
}

const IngredientTableState: React.FC<IngredientTableStateProps> = ({
  isLoading,
  isEmpty,
  searchTerm,
  categoryFilter
}) => {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={9} className="h-24 text-center">
          Loading ingredients...
        </TableCell>
      </TableRow>
    );
  }
  
  if (isEmpty) {
    return (
      <TableRow>
        <TableCell colSpan={9} className="h-24 text-center">
          {searchTerm || categoryFilter 
            ? 'No ingredients match your search criteria.'
            : 'No ingredients found. Add your first ingredient.'}
        </TableCell>
      </TableRow>
    );
  }
  
  return null;
};

export default IngredientTableState;
