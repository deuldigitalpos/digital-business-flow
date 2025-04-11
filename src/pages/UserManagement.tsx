
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  UserPlus, 
  Search, 
  Filter, 
  RefreshCw, 
  MoreHorizontal, 
  Eye, 
  Pencil, 
  Trash2,
  AlertCircle
} from 'lucide-react';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.string().optional(),
  status: z.string().optional(),
});

type UserFormValues = z.infer<typeof formSchema>;

type AdminUser = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  role: string;
  status: string;
  password?: string;
};

const UserManagement = () => {
  const { user } = useAuth();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      role: 'staff',
      status: 'active',
    },
  });

  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      role: '',
      status: '',
    },
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('adminuser')
        .select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } else {
        setUsers(data as unknown as AdminUser[]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure we use the proper field naming to match the database schema
      const newUser = {
        first_name: data.firstName,
        last_name: data.lastName,
        username: data.username,
        password: data.password,
        role: data.role || 'staff',
        status: data.status || 'active'
      };

      console.log('Creating new user:', newUser);

      const { data: insertedData, error } = await supabase
        .from('adminuser')
        .insert([newUser])
        .select();

      if (error) {
        console.error('Error creating user:', error);
        if (error.code === '23505') {
          toast.error('Username already exists');
        } else {
          toast.error(`Failed to create user: ${error.message}`);
        }
        return;
      }

      console.log('User created successfully:', insertedData);
      toast.success(`User ${data.firstName} ${data.lastName} has been created successfully`);
      
      form.reset();
      setIsAddUserModalOpen(false);
      
      // Refresh the users list
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditSubmit = async (data: UserFormValues) => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      const updateData: Record<string, any> = {
        first_name: data.firstName,
        last_name: data.lastName,
        username: data.username,
        role: data.role,
        status: data.status
      };

      // Only include password if it's been changed
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }

      const { error } = await supabase
        .from('adminuser')
        .update(updateData)
        .eq('id', selectedUser.id);

      if (error) {
        console.error('Error updating user:', error);
        if (error.code === '23505') {
          toast.error('Username already exists');
        } else {
          toast.error(`Failed to update user: ${error.message}`);
        }
        return;
      }

      toast.success(`User ${data.firstName} ${data.lastName} has been updated successfully`);
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('adminuser')
        .delete()
        .eq('id', selectedUser.id);

      if (error) {
        console.error('Error deleting user:', error);
        toast.error(`Failed to delete user: ${error.message}`);
        return;
      }

      toast.success(`User ${selectedUser.first_name} ${selectedUser.last_name} has been deleted`);
      setIsDeleteDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    editForm.reset({
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      password: '',
      role: user.role,
      status: user.status
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers().finally(() => setIsRefreshing(false));
  };

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      user.first_name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <Button 
          onClick={() => setIsAddUserModalOpen(true)}
          className="hover:bg-[#f99b23] transition-colors"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input 
            placeholder="Search users..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        {searchQuery ? 'No users found matching your search' : 'No users found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteUser(user)}
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
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New User</DialogTitle>
            <DialogDescription>
              Fill in the user details below to create a new account.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsAddUserModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="hover:bg-[#f99b23] transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Save User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View User Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="mt-1">{selectedUser.first_name} {selectedUser.last_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Username</h3>
                <p className="mt-1">{selectedUser.username}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                <p className="mt-1">{selectedUser.role}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedUser.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.status}
                  </span>
                </p>
              </div>
              <DialogFooter className="pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEditUser(selectedUser);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit User</DialogTitle>
            <DialogDescription>
              Update user information below.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Leave blank to keep current password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="staff" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input placeholder="active" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="hover:bg-[#f99b23] transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user 
              {selectedUser && ` "${selectedUser.first_name} ${selectedUser.last_name}"`} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
