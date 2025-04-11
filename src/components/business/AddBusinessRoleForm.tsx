
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { useBusinessRoleMutations } from '@/hooks/useBusinessRoleMutations';
import { BusinessRole } from '@/types/business-role';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Role name is required."),
  permissions: z.record(z.boolean().default(false)).default({})
});

type FormValues = z.infer<typeof formSchema>;

interface AddBusinessRoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  role?: BusinessRole | null;
}

const AddBusinessRoleForm: React.FC<AddBusinessRoleFormProps> = ({ 
  isOpen, 
  onClose, 
  businessId,
  role
}) => {
  const { createBusinessRole, updateBusinessRole } = useBusinessRoleMutations();
  const isEditing = !!role;

  // Define permission groups
  const permissionGroups = [
    {
      name: 'Dashboard',
      key: 'dashboard',
      permissions: [{ key: 'dashboard', label: 'Access Dashboard' }]
    },
    {
      name: 'User Management',
      key: 'user_management',
      permissions: [
        { key: 'user_management', label: 'User Management' },
        { key: 'users', label: 'Users' },
        { key: 'roles', label: 'Roles' }
      ]
    },
    {
      name: 'Point of Sale',
      key: 'pos',
      permissions: [
        { key: 'pos', label: 'POS' },
        { key: 'sales', label: 'Sales' }
      ]
    },
    {
      name: 'Products & Inventory',
      key: 'products',
      permissions: [
        { key: 'products', label: 'Products' },
        { key: 'inventory', label: 'Inventory' },
        { key: 'stock', label: 'Stock Management' },
        { key: 'purchases', label: 'Purchases' }
      ]
    },
    {
      name: 'Bookings',
      key: 'bookings',
      permissions: [{ key: 'bookings', label: 'Bookings' }]
    },
    {
      name: 'Finance',
      key: 'finance',
      permissions: [
        { key: 'expenses', label: 'Expenses' },
        { key: 'financials', label: 'Financial Management' },
        { key: 'reports', label: 'Reports' }
      ]
    },
    {
      name: 'Settings',
      key: 'settings',
      permissions: [{ key: 'settings', label: 'Settings' }]
    }
  ];

  // Initialize form with default values or edit values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: role?.name || '',
      permissions: role?.permissions || {}
    }
  });

  // Reset form when role changes or when opening/closing the dialog
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: role?.name || '',
        permissions: role?.permissions || {}
      });
    }
  }, [form, role, isOpen]);

  const onSubmit = (values: FormValues) => {
    if (isEditing && role) {
      updateBusinessRole.mutate({
        id: role.id,
        name: values.name,
        permissions: values.permissions
      });
    } else {
      createBusinessRole.mutate({
        businessId,
        name: values.name,
        permissions: values.permissions
      });
    }
    onClose();
  };

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(
    Object.fromEntries(permissionGroups.map(group => [group.key, true]))
  );

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleFullAccessToggle = (checked: boolean) => {
    const allPermissions = permissionGroups.flatMap(group => 
      group.permissions.map(permission => permission.key)
    );
    
    const newPermissions = Object.fromEntries(
      allPermissions.map(key => [key, checked])
    );
    
    form.setValue('permissions', newPermissions);
  };

  // Check if all permissions are selected
  const allPermissionsSelected = () => {
    const permissions = form.watch('permissions');
    const allPermissions = permissionGroups.flatMap(group => 
      group.permissions.map(permission => permission.key)
    );
    
    return allPermissions.every(key => permissions[key]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Role' : 'Add Role'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fullAccess" 
                  checked={allPermissionsSelected()}
                  onCheckedChange={handleFullAccessToggle}
                />
                <label
                  htmlFor="fullAccess"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Full Access (All Permissions)
                </label>
              </div>

              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-lg font-medium">Permissions</h3>
                
                {permissionGroups.map(group => (
                  <Collapsible 
                    key={group.key} 
                    open={openSections[group.key]} 
                    onOpenChange={() => toggleSection(group.key)}
                    className="border rounded-md"
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-muted/50">
                      <span className="font-medium">{group.name}</span>
                      {openSections[group.key] ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 pt-0 border-t">
                      <div className="space-y-2">
                        {group.permissions.map(permission => (
                          <FormField
                            key={permission.key}
                            control={form.control}
                            name={`permissions.${permission.key}`}
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={permission.key}
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                                <label
                                  htmlFor={permission.key}
                                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {permission.label}
                                </label>
                              </div>
                            )}
                          />
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createBusinessRole.isPending || updateBusinessRole.isPending}
              >
                {(createBusinessRole.isPending || updateBusinessRole.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? 'Update Role' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBusinessRoleForm;
