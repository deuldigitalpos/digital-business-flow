
import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { BusinessUser } from '@/types/business-user';

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  username: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.string().min(1, "Role is required."),
});

type FormValues = z.infer<typeof formSchema>;

interface AddBusinessUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessUser?: BusinessUser | null;
}

const AddBusinessUserForm: React.FC<AddBusinessUserFormProps> = ({ 
  isOpen, 
  onClose, 
  businessId,
  businessUser
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!businessUser;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: businessUser?.first_name || '',
      last_name: businessUser?.last_name || '',
      email: businessUser?.email || '',
      username: businessUser?.username || '',
      password: businessUser?.password ? '********' : '',
      role: businessUser?.role || 'Staff',
    }
  });

  // Reset form when business user changes
  React.useEffect(() => {
    if (isEditing && businessUser) {
      form.reset({
        first_name: businessUser.first_name || '',
        last_name: businessUser.last_name || '',
        email: businessUser.email || '',
        username: businessUser.username || '',
        password: '********', // Placeholder for existing password
        role: businessUser.role || 'Staff',
      });
    } else if (!isEditing) {
      form.reset({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        role: 'Staff',
      });
    }
  }, [businessUser, form, isEditing]);

  const saveBusinessUser = useMutation({
    mutationFn: async (values: FormValues) => {
      const userId = crypto.randomUUID(); // Generate a user ID
      
      // If editing, update existing user
      if (isEditing && businessUser) {
        let updateData: Record<string, any> = { 
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          username: values.username,
          role: values.role,
        };
        
        // Only update password if it was changed
        if (values.password !== '********') {
          updateData.password = values.password;
        }
        
        const { data, error } = await supabase
          .from('business_users')
          .update(updateData)
          .eq('id', businessUser.id)
          .select();
        
        if (error) throw error;
        return data;
      } else {
        // Create new user
        const { data, error } = await supabase
          .from('business_users')
          .insert([
            {
              business_id: businessId,
              user_id: userId,
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              username: values.username,
              password: values.password,
              role: values.role,
            }
          ])
          .select();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessUsers', businessId] });
      toast({
        title: isEditing ? "User Updated" : "User Added",
        description: isEditing
          ? "The user has been successfully updated."
          : "The user has been successfully added to this business."
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} user: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (values: FormValues) => {
    saveBusinessUser.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
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
                    <Input placeholder="Enter username" {...field} />
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
                    <Input 
                      type="password" 
                      placeholder={isEditing ? "Leave unchanged or enter new password" : "Enter password"}
                      {...field} 
                    />
                  </FormControl>
                  {isEditing && (
                    <p className="text-xs text-muted-foreground">
                      Leave unchanged to keep the existing password
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button 
                type="submit"
                disabled={saveBusinessUser.isPending}
              >
                {saveBusinessUser.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? 'Update User' : 'Add User'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBusinessUserForm;
