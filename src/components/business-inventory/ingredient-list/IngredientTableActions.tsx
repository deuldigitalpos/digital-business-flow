
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { BusinessIngredient } from '@/hooks/useBusinessIngredients';

interface IngredientTableActionsProps {
  ingredient: BusinessIngredient;
  onEdit: (ingredient: BusinessIngredient) => void;
  onDelete: (id: string) => void;
  onViewTransactions: (ingredient: BusinessIngredient) => void;
}

const IngredientTableActions: React.FC<IngredientTableActionsProps> = ({
  ingredient,
  onEdit,
  onDelete,
  onViewTransactions
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewTransactions(ingredient)}>
          <Eye className="mr-2 h-4 w-4" />
          View History
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(ingredient)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(ingredient.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default IngredientTableActions;
