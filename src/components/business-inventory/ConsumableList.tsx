
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
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ConsumableForm from './ConsumableForm';
import { Badge } from '@/components/ui/badge';
import ConsumableTransactionHistory from './ConsumableTransactionHistory';

const ConsumableList = () => {
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
          ) : consumables && consumables.length > 0 ? (
            consumables.map((consumable) => (
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
                No consumables found. Add your first consumable.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <ConsumableForm 
          consumable={selectedConsumable} 
          onClose={() => {
            setIsFormOpen(false);
            setSelectedConsumable(null);
            refetch();
          }}
        />
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
