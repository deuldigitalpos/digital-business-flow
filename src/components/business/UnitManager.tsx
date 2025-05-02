import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useBusinessUnits } from '@/hooks/useBusinessUnits';
import { BusinessUnit } from '@/types/business-unit';
import { useBusinessUnitMutations } from '@/hooks/useBusinessUnitMutations';
import AddUnitForm from './AddUnitForm';
import EditUnitForm from './EditUnitForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

interface SetDefaultUnitProps {
  id: string;
  unitData: Partial<BusinessUnit>;
}

const UnitManager: React.FC = () => {
  const { units, isLoading, refetch } = useBusinessUnits();
  const { createUnit, updateUnit, deleteUnit, setDefaultUnit } = useBusinessUnitMutations();
  const [editUnit, setEditUnit] = useState<BusinessUnit | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteUnit.mutateAsync(id);
      toast.success('Unit deleted successfully');
    } catch (error) {
      console.error('Error deleting unit:', error);
      toast.error('Failed to delete unit');
    }
  };

  const handleSetDefault = async (unit: BusinessUnit) => {
    try {
      const result = await setDefaultUnit.mutateAsync({
        id: unit.id,
        unitData: { 
          is_default: true,
          name: unit.name,
          short_name: unit.short_name,
          description: unit.description,
          type: unit.type // Add the type field
        }
      });
      
      if (result) {
        toast.success('Default unit updated successfully');
        refetch();
      } else {
        toast.error('Failed to set default unit');
      }
    } catch (error) {
      console.error('Error setting default unit:', error);
      toast.error('Failed to set default unit');
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Units</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Unit</DialogTitle>
              <DialogDescription>
                Create a new unit for your business.
              </DialogDescription>
            </DialogHeader>
            <AddUnitForm onSuccess={() => { refetch(); }} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Default</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : units && units.length > 0 ? (
              units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>{unit.short_name}</TableCell>
                  <TableCell>{unit.type}</TableCell>
                  <TableCell>{unit.description}</TableCell>
                  <TableCell>
                    <Button 
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSetDefault(unit)}
                      disabled={unit.is_default}
                    >
                      {unit.is_default ? 'Default' : 'Set Default'}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditUnit(unit)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(unit.id)} className="text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No units found. Add one to get started.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Unit Dialog */}
      <Dialog open={!!editUnit} onOpenChange={() => setEditUnit(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Unit</DialogTitle>
            <DialogDescription>
              Edit an existing unit for your business.
            </DialogDescription>
          </DialogHeader>
          <EditUnitForm unit={editUnit} onSuccess={() => { setEditUnit(null); refetch(); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitManager;
