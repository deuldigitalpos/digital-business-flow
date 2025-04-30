
import React, { useState } from 'react';
import { useBusinessIngredients } from '@/hooks/useBusinessIngredients';
import { BusinessIngredient } from '@/types/business-ingredient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, MoreVertical, Plus, Search, Trash2 } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface IngredientListProps {
  onAddNew: () => void;
  onEdit: (ingredient: BusinessIngredient) => void;
  onDelete: (ingredient: BusinessIngredient) => void;
}

const IngredientList: React.FC<IngredientListProps> = ({ onAddNew, onEdit, onDelete }) => {
  const { data: ingredients, isLoading, error } = useBusinessIngredients();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter ingredients based on search term
  const filteredIngredients = ingredients?.filter(
    ingredient => 
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ingredient.description && ingredient.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Ingredients</CardTitle>
          <CardDescription>
            Manage your raw ingredients inventory
          </CardDescription>
        </div>
        <Button onClick={onAddNew} className="h-9">
          <Plus className="h-4 w-4 mr-2" /> Add New
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search ingredients..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading ingredients. Please try again.
          </div>
        ) : !filteredIngredients?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "No ingredients found matching your search." : "No ingredients found. Add your first ingredient!"}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIngredients.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">
                      <div className="font-medium">{ingredient.name}</div>
                      {ingredient.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {ingredient.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{ingredient.unit_id ? 'Unit' : '-'}</TableCell>
                    <TableCell className="text-right">{ingredient.unit_price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{ingredient.quantity_available}</TableCell>
                    <TableCell className="text-right">{ingredient.total_cost?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell className="text-right">
                      <span 
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          ingredient.status === 'In Stock'
                            ? 'bg-green-50 text-green-700'
                            : ingredient.status === 'Low Stock'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {ingredient.status || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(ingredient)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-700" 
                            onClick={() => onDelete(ingredient)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IngredientList;
