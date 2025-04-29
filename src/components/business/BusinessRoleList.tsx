
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
import { format } from 'date-fns';
import { toast } from 'sonner';

interface BusinessRoleListProps {
  roles: BusinessRole[];
  onEdit: (role: BusinessRole) => void;
}

const BusinessRoleList: React.FC<BusinessRoleListProps> = ({ roles, onEdit }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [roleToDelete, setRoleToDelete] = React.useState<BusinessRole | null>(null);
  const { deleteBusinessRole } = useBusinessRoleMutations();

  const handleEditRole = (role: BusinessRole, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(role);
  };

  const handleDeleteClick = (role: BusinessRole, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (roleToDelete) {
      try {
        deleteBusinessRole.mutate(roleToDelete.id, {
          onSuccess: () => {
            toast.success(`${roleToDelete.name} role deleted successfully`);
            setIsDeleteDialogOpen(false);
            setRoleToDelete(null);
          },
          onError: (error) => {
            console.error('Error deleting role:', error);
            toast.error(`Failed to delete ${roleToDelete.name} role`);
          }
        });
      } catch (error) {
        console.error('Error in handleConfirmDelete:', error);
        toast.error('An unexpected error occurred');
      }
    }
  };

  const getPermissionsSummary = (permissions: Record<string, boolean>) => {
    try {
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
    } catch (error) {
      console.error('Error in getPermissionsSummary:', error);
      return 'Error loading permissions';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid date';
    }
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
                <TableCell>{formatDate(role.created_at)}</TableCell>
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
                      <Button variant="ghost" size="icon" className="focus:ring-2 focus:ring-offset-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleEditRole(role, e)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      {!role.is_default && (
                        <DropdownMenuItem 
                          onClick={(e) => handleDeleteClick(role, e)}
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
