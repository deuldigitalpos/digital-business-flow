
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash2, Eye } from 'lucide-react';
import { BusinessIngredient, useBusinessIngredients } from '@/hooks/useBusinessIngredients';
import { useBusinessIngredientMutations } from '@/hooks/useBusinessIngredientMutations';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import IngredientForm from './IngredientForm';
import { Badge } from '@/components/ui/badge';
import ConsumableTransactionHistory from './ConsumableTransactionHistory'; // We'll reuse this for now

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

  const getStockStatusBadge = (quantity: number = 0) => {
    if (quantity <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity <= 10) {
      return <Badge variant="warning" className="bg-amber-500">Low Stock</Badge>;
    } else {
      return <Badge variant="success" className="bg-green-500">In Stock</Badge>;
    }
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

  // Filter ingredients based on search term and category
  const filteredIngredients = ingredients.filter(ingredient => {
    // Filter by search term
    const matchesSearch = !searchTerm || 
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ingredient.description && ingredient.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by category
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Loading ingredients...
              </TableCell>
            </TableRow>
          ) : filteredIngredients && filteredIngredients.length > 0 ? (
            filteredIngredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell className="font-medium">{ingredient.name}</TableCell>
                <TableCell>{ingredient.description || '-'}</TableCell>
                <TableCell>{ingredient.category?.name || '-'}</TableCell>
                <TableCell>{ingredient.quantity?.toFixed(2) || '0'}</TableCell>
                <TableCell>{ingredient.unit?.short_name || '-'}</TableCell>
                <TableCell>${ingredient.average_cost?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>${ingredient.total_value?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>{getStockStatusBadge(ingredient.quantity)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewTransactions(ingredient)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View History
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(ingredient)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(ingredient.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                {searchTerm || categoryFilter 
                  ? 'No ingredients match your search criteria.'
                  : 'No ingredients found. Add your first ingredient.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <IngredientForm 
          ingredient={selectedIngredient} 
          onClose={() => {
            setIsFormOpen(false);
            setSelectedIngredient(null);
            refetch();
          }}
        />
      </Dialog>

      <Dialog open={isTransactionHistoryOpen} onOpenChange={setIsTransactionHistoryOpen}>
        {selectedIngredient && (
          <ConsumableTransactionHistory 
            consumable={{...selectedIngredient, id: selectedIngredient.id}}
            onClose={() => {
              setIsTransactionHistoryOpen(false);
              setSelectedIngredient(null);
            }}
          />
        )}
      </Dialog>
    </div>
  );
};

export default IngredientList;
