import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { BusinessUser } from '@/types/business-user';
import { BusinessRole } from '@/types/business-role';
import { BusinessLocation } from '@/types/business-location';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBusinessUserMutations } from '@/hooks/useBusinessUserMutations';

// Define the schema for form validation
const formSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  username: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  email: z.string().email("Invalid email address."),
  role_id: z.string().min(1, "Role is required."),
  location_ids: z.array(z.string()).optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  marital_status: z.string().optional(),
  contact_number: z.string().optional(),
  bank_name: z.string().optional(),
  bank_account_name: z.string().optional(),
  bank_account_number: z.string().optional(),
  primary_work_location: z.string().optional(),
  daily_rate: z.string().optional(),
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
  const [activeTab, setActiveTab] = React.useState("basic-info");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      password: '',
      email: '',
      role_id: '',
      location_ids: [],
      date_of_birth: '',
      gender: '',
      marital_status: '',
      contact_number: '',
      bank_name: '',
      bank_account_name: '',
      bank_account_number: '',
      primary_work_location: '',
      daily_rate: '',
    }
  });

  // Fetch business roles
  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['business-roles', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_roles')
        .select('*')
        .eq('business_id', businessId)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as BusinessRole[];
    },
    enabled: !!businessId,
  });

  // Fetch business locations
  const { data: locations, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['business-locations', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_locations')
        .select('*')
        .eq('business_id', businessId)
        .eq('status', 'active')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as BusinessLocation[];
    },
    enabled: !!businessId,
  });

  // Fetch user's assigned locations if editing
  const { data: userLocations, isLoading: isLoadingUserLocations } = useQuery({
    queryKey: ['user-locations', businessUser?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_locations')
        .select('location_id')
        .eq('user_id', businessUser.id);
      
      if (error) throw error;
      return data.map(item => item.location_id);
    },
    enabled: !!businessUser?.id,
  });

  // Reset form when business user changes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && businessUser) {
        // For edit mode, populate the form with existing user data
        form.reset({
          first_name: businessUser.first_name || '',
          last_name: businessUser.last_name || '',
          username: businessUser.username || '',
          password: '********', // Placeholder for existing password
          email: businessUser.email || '',
          role_id: businessUser.role_id || '',
          location_ids: userLocations || [],
          date_of_birth: businessUser.date_of_birth ? new Date(businessUser.date_of_birth).toISOString().split('T')[0] : '',
          gender: businessUser.gender || '',
          marital_status: businessUser.marital_status || '',
          contact_number: businessUser.contact_number || '',
          bank_name: businessUser.bank_name || '',
          bank_account_name: businessUser.bank_account_name || '',
          bank_account_number: businessUser.bank_account_number || '',
          primary_work_location: businessUser.primary_work_location || '',
          daily_rate: businessUser.daily_rate ? String(businessUser.daily_rate) : '',
        });
      } else {
        // For add mode, reset to defaults
        form.reset({
          first_name: '',
          last_name: '',
          username: '',
          password: '',
          email: '',
          role_id: roles && roles.length > 0 ? roles[0].id : '',
          location_ids: [],
          date_of_birth: '',
          gender: '',
          marital_status: '',
          contact_number: '',
          bank_name: '',
          bank_account_name: '',
          bank_account_number: '',
          primary_work_location: '',
          daily_rate: '',
        });
      }
      // Always reset to first tab when opening
      setActiveTab("basic-info");
    }
  }, [businessUser, form, isEditing, isOpen, roles, userLocations]);

  const { createBusinessUser, updateBusinessUser } = useBusinessUserMutations();

  const onSubmit = (values: FormValues) => {
    if (isEditing && businessUser) {
      // Prepare data for update, omitting password if unchanged
      let updateData: any = { 
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        username: values.username,
        role_id: values.role_id,
        date_of_birth: values.date_of_birth || null,
        gender: values.gender || null,
        marital_status: values.marital_status || null,
        contact_number: values.contact_number || null,
        bank_name: values.bank_name || null,
        bank_account_name: values.bank_account_name || null,
        bank_account_number: values.bank_account_number || null,
        primary_work_location: values.primary_work_location || null,
        daily_rate: values.daily_rate ? parseFloat(values.daily_rate) : null,
      };
      
      // Only update password if it was changed
      if (values.password !== '********') {
        updateData.password = values.password;
      }
      
      // Find the selected role to get the role name
      const selectedRole = roles?.find(r => r.id === values.role_id);
      if (selectedRole) {
        updateData.role = selectedRole.name;
      }
      
      // Call update mutation
      const updatePromise = updateBusinessUser.mutateAsync({ 
        userData: updateData, 
        userId: businessUser.id,
        businessId 
      });
      
      // Handle location updates after user update
      updatePromise.then(() => {
        handleLocationUpdates(businessUser.id, values.location_ids || []);
      }).catch(error => {
        console.error("Error updating user:", error);
      });
    } else {
      // For creating new user
      const userId = crypto.randomUUID(); // Generate a user ID
      const selectedRole = roles?.find(r => r.id === values.role_id);
      const roleName = selectedRole ? selectedRole.name : 'Staff';
      
      // Prepare user data
      const userData = {
        user_id: userId,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        username: values.username,
        password: values.password,
        role: roleName,
        role_id: values.role_id,
        date_of_birth: values.date_of_birth || null,
        gender: values.gender || null,
        marital_status: values.marital_status || null,
        contact_number: values.contact_number || null,
        bank_name: values.bank_name || null,
        bank_account_name: values.bank_account_name || null,
        bank_account_number: values.bank_account_number || null,
        primary_work_location: values.primary_work_location || null,
        daily_rate: values.daily_rate ? parseFloat(values.daily_rate) : null,
      };
      
      // Call create mutation
      const createPromise = createBusinessUser.mutateAsync({ userData, businessId });
      
      // Handle location assignments after user creation
      createPromise.then((data) => {
        if (data && data[0]) {
          handleLocationUpdates(data[0].id, values.location_ids || []);
        }
      }).catch(error => {
        console.error("Error creating user:", error);
      });
    }
  };
  
  // Helper function to handle location assignments
  const handleLocationUpdates = async (userId: string, locationIds: string[]) => {
    if (locationIds.length === 0) return;
    
    // First delete existing user locations
    await supabase
      .from('user_locations')
      .delete()
      .eq('user_id', userId);
    
    // Then add new user locations
    const locationInserts = locationIds.map(locationId => ({
      user_id: userId,
      location_id: locationId
    }));
    
    const { error: locError } = await supabase
      .from('user_locations')
      .insert(locationInserts);
      
    if (locError) {
      console.error("Error updating locations:", locError);
      toast({
        title: "Warning",
        description: "User was saved but there was an error updating location assignments.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit User' : 'Add User'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                <TabsTrigger value="roles-permissions">Roles & Permissions</TabsTrigger>
                <TabsTrigger value="personal">Personal Details</TabsTrigger>
                <TabsTrigger value="banking-payroll">Banking & Payroll</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic-info" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="roles-permissions" className="space-y-4">
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
                  name="role_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                        disabled={isLoadingRoles || !roles || roles.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles?.map((role) => (
                            <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isLoadingRoles ? (
                        <p className="text-xs text-muted-foreground">Loading roles...</p>
                      ) : roles?.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          No roles available. Please create roles first.
                        </p>
                      ) : null}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isLoadingLocations ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading locations...</span>
                  </div>
                ) : locations && locations.length > 0 ? (
                  <div className="space-y-2">
                    <FormLabel>Assigned Locations</FormLabel>
                    <div className="border rounded-md p-4 space-y-2">
                      {locations.map((location) => (
                        <FormField
                          key={location.id}
                          control={form.control}
                          name="location_ids"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={location.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(location.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), location.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== location.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {location.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No locations available. Add locations first.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="personal" className="space-y-4">
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="marital_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select marital status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="contact_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="banking-payroll" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Bank Details</h3>
                  <FormField
                    control={form.control}
                    name="bank_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bank name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bank_account_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bank_account_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payroll Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="primary_work_location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Work Location</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value || ""}
                          disabled={isLoadingLocations || !locations || locations.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select primary work location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations?.map((location) => (
                              <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="daily_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Rate</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter daily salary rate" 
                            step="0.01" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button 
                type="submit"
                disabled={createBusinessUser.isPending || updateBusinessUser.isPending}
              >
                {(createBusinessUser.isPending || updateBusinessUser.isPending) && (
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
