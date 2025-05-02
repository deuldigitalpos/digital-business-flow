
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
import { BusinessConsumable, useBusinessConsumables } from '@/hooks/useBusinessConsumables';
import { useBusinessConsumableMutations } from '@/hooks/useBusinessConsumableMutations';
import { Dialog } from '@/components/ui/dialog';
import ConsumableForm from './ConsumableForm';
import { Badge } from '@/components/ui/badge';
import ConsumableTransactionHistory from './ConsumableTransactionHistory';

interface ConsumableListProps {
  searchTerm?: string;
  categoryFilter?: string;
}

const ConsumableList: React.FC<ConsumableListProps> = ({ 
  searchTerm = '', 
  categoryFilter 
}) => {
  const { consumables, isLoading, refetch } = useBusinessConsumables();
  const { deleteConsumable } = useBusinessConsumableMutations();
  const [selectedConsumable, setSelectedConsumable] = useState<BusinessConsumable | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTransactionHistoryOpen, setIsTransactionHistoryOpen] = useState(false);

  const handleEdit = (consumable: BusinessConsumable) => {
    setSelectedConsumable(consumable);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this consumable?')) {
      try {
        await deleteConsumable.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting consumable:', error);
      }
    }
  };

  const handleViewTransactions = (consumable: BusinessConsumable) => {
    setSelectedConsumable(consumable);
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

  // Comprehensive helper to check if a consumable's category matches the filter
  const categoryMatches = (consumable: BusinessConsumable, filter?: string) => {
    // Case 1: No filter selected or "all" is selected
    if (!filter || filter === 'all') return true;
    
    // Case 2: Direct category ID match
    if (consumable.category_id && filter.includes(consumable.category_id)) return true;
    
    // Case 3: Handle generated ID matches - match based on category name in filter
    if (filter.includes('category-') && consumable.category?.name) {
      // If filter contains both "category-" and the category name, likely a match
      return filter.toLowerCase().includes(consumable.category.name.toLowerCase());
    }
    
    // Case 4: Handle unnamed categories
    if (consumable.category_id === null && filter.includes('unnamed')) {
      return true;
    }
    
    return false;
  };

  // Filter consumables based on search term and category
  const filteredConsumables = consumables.filter(consumable => {
    // Filter by search term
    const matchesSearch = !searchTerm || 
      consumable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (consumable.description && consumable.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by category using our comprehensive helper function
    const matchesCategory = categoryMatches(consumable, categoryFilter);
    
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
                Loading consumables...
              </TableCell>
            </TableRow>
          ) : filteredConsumables && filteredConsumables.length > 0 ? (
            filteredConsumables.map((consumable) => (
              <TableRow key={consumable.id}>
                <TableCell className="font-medium">{consumable.name}</TableCell>
                <TableCell>{consumable.description || '-'}</TableCell>
                <TableCell>{consumable.category?.name || '-'}</TableCell>
                <TableCell>{consumable.quantity?.toFixed(2) || '0'}</TableCell>
                <TableCell>{consumable.unit?.short_name || '-'}</TableCell>
                <TableCell>${consumable.average_cost?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>${consumable.total_value?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>{getStockStatusBadge(consumable.quantity)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewTransactions(consumable)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View History
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(consumable)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(consumable.id)}>
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
                  ? 'No consumables match your search criteria.'
                  : 'No consumables found. Add your first consumable.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        {selectedConsumable ? (
          <ConsumableForm 
            consumable={selectedConsumable} 
            onClose={() => {
              setIsFormOpen(false);
              setSelectedConsumable(null);
              refetch();
            }}
          />
        ) : (
          <ConsumableForm 
            consumable={null} 
            onClose={() => {
              setIsFormOpen(false);
              refetch();
            }}
          />
        )}
      </Dialog>

      <Dialog open={isTransactionHistoryOpen} onOpenChange={setIsTransactionHistoryOpen}>
        {selectedConsumable && (
          <ConsumableTransactionHistory 
            consumable={selectedConsumable}
            onClose={() => {
              setIsTransactionHistoryOpen(false);
              setSelectedConsumable(null);
            }}
          />
        )}
      </Dialog>
    </div>
  );
};

export default ConsumableList;
