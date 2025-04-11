
import React from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { BusinessRole } from '@/types/business-role';
import { useBusinessRoleMutations } from '@/hooks/useBusinessRoleMutations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/checkbox';
import { format } from 'date-fns';

interface BusinessRoleListProps {
  roles: BusinessRole[];
  onEdit: (role: BusinessRole) => void;
}

const BusinessRoleList: React.FC<BusinessRoleListProps> = ({ roles, onEdit }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [roleToDelete, setRoleToDelete] = React.useState<BusinessRole | null>(null);
  const { deleteBusinessRole } = useBusinessRoleMutations();

  const handleEditRole = (role: BusinessRole) => {
    onEdit(role);
  };

  const handleDeleteClick = (role: BusinessRole) => {
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (roleToDelete) {
      deleteBusinessRole.mutate(roleToDelete.id);
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const getPermissionsSummary = (permissions: Record<string, boolean>) => {
    const enabledPermissions = Object.entries(permissions)
      .filter(([_, isEnabled]) => isEnabled)
      .map(([key]) => key);
    
    if (enabledPermissions.length === 0) {
      return 'No permissions';
    }
    
    if (enabledPermissions.length > 3) {
      return `${enabledPermissions.slice(0, 3).join(', ')} +${enabledPermissions.length - 3} more`;
    }
    
    return enabledPermissions.join(', ');
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role Name</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Default</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No roles found.
              </TableCell>
            </TableRow>
          ) : (
            roles.map(role => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{getPermissionsSummary(role.permissions)}</TableCell>
                <TableCell>{format(new Date(role.created_at), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  {role.is_default && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Default
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditRole(role)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      {!role.is_default && (
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(role)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role <span className="font-semibold">{roleToDelete?.name}</span>? 
              This action cannot be undone and may affect users with this role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteBusinessRole.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BusinessRoleList;
