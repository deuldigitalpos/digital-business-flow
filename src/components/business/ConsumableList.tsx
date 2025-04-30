
import React from 'react';
import { useBusinessConsumables } from '@/hooks/useBusinessConsumables';
import { BusinessConsumable } from '@/types/business-consumable';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ConsumableListProps {
  onEdit: (consumable: BusinessConsumable) => void;
  onDelete: (consumable: BusinessConsumable) => void;  // Changed from string to BusinessConsumable
  onAddNew: () => void;
}

const ConsumableList: React.FC<ConsumableListProps> = ({ onEdit, onDelete, onAddNew }) => {
  const { data: consumables, isLoading, error } = useBusinessConsumables();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        Error loading consumables. Please try again.
      </div>
    );
  }

  if (!consumables || consumables.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Consumables</span>
            <Button onClick={onAddNew} size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <p className="text-muted-foreground">No consumables found.</p>
            <Button 
              onClick={onAddNew} 
              variant="outline" 
              className="mt-4"
            >
              Add Your First Consumable
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-500';
      case 'Low Stock':
        return 'bg-amber-500';
      case 'Out of Stock':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Consumables</span>
          <Button onClick={onAddNew} size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Add New</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>List of all consumables</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consumables.map((consumable) => (
              <TableRow key={consumable.id}>
                <TableCell className="font-medium">{consumable.name}</TableCell>
                <TableCell>${consumable.unit_price}</TableCell>
                <TableCell>{consumable.quantity_available}</TableCell>
                <TableCell>${consumable.total_cost}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(consumable.status)}>
                    {consumable.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(consumable)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(consumable)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ConsumableList;
