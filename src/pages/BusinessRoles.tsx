
import React, { useState } from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

// Dummy role data - would be replaced with real data from Supabase
const initialRoles = [
  { id: 1, name: 'Admin', permissions: ['dashboard', 'users', 'products', 'sales'] },
  { id: 2, name: 'Manager', permissions: ['dashboard', 'products', 'sales'] },
  { id: 3, name: 'Cashier', permissions: ['pos', 'sales'] },
];

const BusinessRoles = () => {
  const { businessUser, business } = useBusinessAuth();
  const [roles, setRoles] = useState(initialRoles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [allPermissions, setAllPermissions] = useState(false);
  const { toast } = useToast();

  const handleAddRole = () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Error",
        description: "Role name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newRole = {
      id: roles.length + 1,
      name: newRoleName,
      permissions: allPermissions ? ['all'] : [],
    };

    setRoles([...roles, newRole]);
    setIsDialogOpen(false);
    setNewRoleName('');
    setAllPermissions(false);

    toast({
      title: "Success",
      description: `Role "${newRoleName}" has been created`,
    });
  };

  const resetForm = () => {
    setNewRoleName('');
    setAllPermissions(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" /> Add Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Roles</CardTitle>
          <CardDescription>
            Manage roles and permissions for {business?.business_name || 'your business'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.id}</TableCell>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      {role.permissions.includes('all') 
                        ? 'Full Access' 
                        : role.permissions.join(', ')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No roles have been created yet.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role with specific permissions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input 
                id="role-name" 
                placeholder="Enter role name" 
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="all-permissions" 
                checked={allPermissions} 
                onCheckedChange={(checked) => 
                  setAllPermissions(checked === true)
                } 
              />
              <label 
                htmlFor="all-permissions" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Full access to all features (sidebar and POS)
              </label>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddRole}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessRoles;
