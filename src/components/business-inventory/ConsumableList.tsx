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
import { Edit, MoreHorizontal, Trash2, Eye, ArrowDown, ArrowUp } from 'lucide-react';
import { BusinessConsumable, useBusinessConsumables } from '@/hooks/useBusinessConsumables';
import { useBusinessConsumableMutations } from '@/hooks/useBusinessConsumableMutations';
import { Dialog } from '@/components/ui/dialog';
import ConsumableForm from './ConsumableForm';
import { Badge } from '@/components/ui/badge';
import ConsumableTransactionHistory from './ConsumableTransactionHistory';
import { Card, CardContent } from '@/components/ui/card';

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
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    }
    return null;
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
    if (consumable.category_id && filter === consumable.category_id) return true;
    
    // No need for complex matching logic that could cause errors
    return false;
  };

  // Filter consumables based on search term and category
  const filteredConsumables = (consumables || []).filter(consumable => {
    // Filter by search term
    const matchesSearch = !searchTerm || 
      consumable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (consumable.description && consumable.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by category using our comprehensive helper function
    const matchesCategory = categoryMatches(consumable, categoryFilter);
    
    return matchesSearch && matchesCategory;
  });

  // Sort consumables
  const sortedConsumables = [...filteredConsumables].sort((a, b) => {
    if (sortField === 'quantity') {
      return sortDirection === 'asc' 
        ? (a.quantity || 0) - (b.quantity || 0)
        : (b.quantity || 0) - (a.quantity || 0);
    }
    if (sortField === 'average_cost') {
      return sortDirection === 'asc' 
        ? (a.average_cost || 0) - (b.average_cost || 0)
        : (b.average_cost || 0) - (a.average_cost || 0);
    }
    if (sortField === 'total_value') {
      return sortDirection === 'asc' 
        ? (a.total_value || 0) - (b.total_value || 0)
        : (b.total_value || 0) - (a.total_value || 0);
    }
    
    // Default to string comparison for other fields
    const aValue = a[sortField as keyof BusinessConsumable] || '';
    const bValue = b[sortField as keyof BusinessConsumable] || '';
    
    return sortDirection === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  // Render mobile card view for each consumable (for small screens)
  const renderMobileCard = (consumable: BusinessConsumable) => (
    <Card key={consumable.id} className="mb-4 md:hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{consumable.name}</h3>
            <p className="text-sm text-muted-foreground">{consumable.description || '-'}</p>
          </div>
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
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Category: </span>
            <span>{consumable.category?.name || '-'}</span>
          </div>
          <div>
            <span className="font-medium">Status: </span>
            <span>{getStockStatusBadge(consumable.quantity)}</span>
          </div>
          <div>
            <span className="font-medium">Quantity: </span>
            <span>{consumable.quantity?.toFixed(2) || '0'}</span>
          </div>
          <div>
            <span className="font-medium">Unit: </span>
            <span>{consumable.unit?.short_name || '-'}</span>
          </div>
          <div>
            <span className="font-medium">Cost: </span>
            <span>${consumable.average_cost?.toFixed(2) || '0.00'}</span>
          </div>
          <div>
            <span className="font-medium">Value: </span>
            <span>${consumable.total_value?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        {/* Mobile view for each consumable */}
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading consumables...</p>
          </div>
        ) : filteredConsumables.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchTerm || categoryFilter 
                ? 'No consumables match your search criteria.'
                : 'No consumables found. Add your first consumable.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile cards view */}
            <div className="md:hidden">
              {sortedConsumables.map(consumable => renderMobileCard(consumable))}
            </div>
            
            {/* Desktop table view */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center">
                        Name {getSortIcon('name')}
                      </div>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('quantity')}>
                      <div className="flex items-center">
                        Quantity {getSortIcon('quantity')}
                      </div>
                    </TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('average_cost')}>
                      <div className="flex items-center">
                        Cost {getSortIcon('average_cost')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('total_value')}>
                      <div className="flex items-center">
                        Value {getSortIcon('total_value')}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedConsumables.map((consumable) => (
                    <TableRow key={consumable.id}>
                      <TableCell className="font-medium">{consumable.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{consumable.description || '-'}</TableCell>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

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
    </>
  );
};

export default ConsumableList;
