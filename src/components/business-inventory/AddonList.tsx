
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Search, 
  Plus
} from 'lucide-react';
import { BusinessAddon } from '@/hooks/useBusinessAddons';
import { useBusinessAddonMutations } from '@/hooks/useBusinessAddonMutations';
import AddonForm from './AddonForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AddonListProps {
  addons: BusinessAddon[];
  isLoading: boolean;
}

export const AddonList: React.FC<AddonListProps> = ({ addons, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAddon, setSelectedAddon] = useState<BusinessAddon | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { deleteAddon } = useBusinessAddonMutations();

  const handleEditClick = (addon: BusinessAddon) => {
    setSelectedAddon(addon);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (addon: BusinessAddon) => {
    setSelectedAddon(addon);
    setDeleteConfirmOpen(true);
  };

  const handleAddNewClick = () => {
    setSelectedAddon(null);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAddon) {
      await deleteAddon.mutateAsync(selectedAddon.id);
      setDeleteConfirmOpen(false);
      setSelectedAddon(null);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedAddon(null);
  };

  // Filter add-ons based on search term
  const filteredAddons = addons.filter(addon => 
    addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (addon.description && addon.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (addon.category?.name && addon.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add-ons</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search add-ons..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAddNewClick} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading add-ons...
                    </TableCell>
                  </TableRow>
                ) : filteredAddons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {searchTerm ? 'No add-ons match your search' : 'No add-ons found. Add some!'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAddons.map((addon) => (
                    <TableRow key={addon.id}>
                      <TableCell className="font-medium">{addon.name}</TableCell>
                      <TableCell>{addon.category?.name || 'Uncategorized'}</TableCell>
                      <TableCell>{addon.unit?.name || 'No unit'}</TableCell>
                      <TableCell className="text-right">{addon.quantity || 0} {addon.unit?.short_name || ''}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(addon)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => handleDeleteClick(addon)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Add-on Form */}
      {isFormOpen && (
        <AddonForm 
          addon={selectedAddon} 
          onClose={closeForm} 
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the add-on "{selectedAddon?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddonList;
