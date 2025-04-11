
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface BusinessUser {
  id: string;
  business_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  created_at: string;
}

interface BusinessUserListProps {
  businessUsers: BusinessUser[];
  isLoading: boolean;
  onEdit: (user: BusinessUser) => void;
  onDelete: (id: string) => void;
}

const BusinessUserList: React.FC<BusinessUserListProps> = ({
  businessUsers,
  isLoading,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading users...</div>;
  }

  if (businessUsers.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No users found for this business. Add your first user to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businessUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{`${user.first_name} ${user.last_name}`}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(user)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(user.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BusinessUserList;
