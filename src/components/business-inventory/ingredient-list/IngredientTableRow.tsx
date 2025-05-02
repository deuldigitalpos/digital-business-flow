
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { BusinessIngredient } from '@/hooks/useBusinessIngredients';
import StockStatusBadge from './StockStatusBadge';
import IngredientTableActions from './IngredientTableActions';

interface IngredientTableRowProps {
  ingredient: BusinessIngredient;
  onEdit: (ingredient: BusinessIngredient) => void;
  onDelete: (id: string) => void;
  onViewTransactions: (ingredient: BusinessIngredient) => void;
}

const IngredientTableRow: React.FC<IngredientTableRowProps> = ({
  ingredient,
  onEdit,
  onDelete,
  onViewTransactions
}) => {
  return (
    <TableRow key={ingredient.id}>
      <TableCell className="font-medium">{ingredient.name}</TableCell>
      <TableCell className="max-w-[200px] truncate">{ingredient.description || '-'}</TableCell>
      <TableCell>{ingredient.category?.name || '-'}</TableCell>
      <TableCell>{ingredient.quantity?.toFixed(2) || '0'}</TableCell>
      <TableCell>{ingredient.unit?.short_name || '-'}</TableCell>
      <TableCell>${ingredient.average_cost?.toFixed(2) || '0.00'}</TableCell>
      <TableCell>${ingredient.total_value?.toFixed(2) || '0.00'}</TableCell>
      <TableCell>
        <StockStatusBadge quantity={ingredient.quantity || 0} />
      </TableCell>
      <TableCell className="text-right">
        <IngredientTableActions
          ingredient={ingredient}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewTransactions={onViewTransactions}
        />
      </TableCell>
    </TableRow>
  );
};

export default IngredientTableRow;
