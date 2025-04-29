import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomerCreateInput, AccountStatusOptions, LeadOptions } from '@/types/business-customer';
import { useBusinessCustomerMutations } from '@/hooks/useBusinessCustomerMutations';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessCustomer } from '@/types/business-customer';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

interface AddCustomerFormProps {
  businessId: string;
  onSuccess: () => void;
}

const formSchema = z.object({
  business_id: z.string().nonempty(),
  first_name: z.string().nonempty('First name is required'),
  last_name: z.string().nonempty('Last name is required'),
  business_name: z.string().nullable(),
  email: z.string().email('Invalid email format').nullable(),
  tin_number: z.string().nullable(),
  credit_limit: z.union([
    z.number().nonnegative('Credit limit must be a non-negative number'),
    z.string().transform(v => (v === '' ? null : parseFloat(v))).nullable()
  ]),
  mobile_number: z.string().nullable(),
  address: z.string().nullable(),
  account_status: z.string().default('active'),
  is_lead: z.boolean().default(false),
});

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ businessId, onSuccess }) => {
  const { createCustomer } = useBusinessCustomerMutations();
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const { businessUser } = useBusinessAuth();
  
  console.log("AddCustomerForm - businessId:", businessId);
  
  // Fetch existing leads for this business
  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ['business-leads', businessId],
    queryFn: async () => {
      if (!businessId) {
        console.log("No business ID provided");
        return [];
      }
      
      try {
        // Ensure authentication before fetching leads
        if (businessUser?.username && businessUser?.password) {
          console.log("Checking auth in AddCustomerForm");
          const { data: authData } = await supabase.auth.getSession();
          
          if (!authData.session) {
            console.log("No active session, authenticating in AddCustomerForm");
            await supabase.auth.signInWithPassword({
              email: `${businessUser.username}@temporary.com`,
              password: businessUser.password,
            });
          }
        }
        
        console.log("Fetching leads for dropdown");
        const { data, error } = await supabase
          .from('business_customers')
          .select('*')
          .eq('business_id', businessId)
          .eq('is_lead', true)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching leads for dropdown:', error);
          throw new Error(error.message);
        }
        
        console.log("Leads fetched for dropdown:", data?.length);
        return data as BusinessCustomer[];
      } catch (error) {
        console.error('Error in leads fetch for dropdown:', error);
        throw error;
      }
    },
    enabled: !!businessId && !!businessUser
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_id: businessId,
      first_name: '',
      last_name: '',
      business_name: null,
      email: null,
      tin_number: null,
      credit_limit: null,
      mobile_number: null,
      address: null,
      account_status: 'active',
      is_lead: false
    },
  });

  // When a lead is selected, populate the form with lead data
  useEffect(() => {
    if (selectedLead && leads) {
      console.log("Lead selected:", selectedLead);
      const lead = leads.find(l => l.id === selectedLead);
      if (lead) {
        console.log("Populating form with lead data:", lead);
        form.setValue('first_name', lead.first_name);
        form.setValue('last_name', lead.last_name);
        if (lead.business_name) form.setValue('business_name', lead.business_name);
        if (lead.email) form.setValue('email', lead.email);
        if (lead.tin_number) form.setValue('tin_number', lead.tin_number);
        if (lead.mobile_number) form.setValue('mobile_number', lead.mobile_number);
        if (lead.address) form.setValue('address', lead.address);
        
        // Mark the is_lead field as false as we're converting a lead to a customer
        form.setValue('is_lead', false);
      }
    }
  }, [selectedLead, leads, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting customer form:", values);
      
      const result = await createCustomer.mutateAsync(values as CustomerCreateInput);
      console.log("Customer created:", result);
      
      // Handle lead conversion logic
      if (selectedLead) {
        console.log("Lead converted to customer, original lead:", selectedLead);
        // In a complete implementation, you would delete the original lead or mark it as converted
      }
      
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Lead Selection Option */}
        <div className="bg-muted/30 p-4 rounded-md mb-6">
          <h3 className="font-medium mb-2">Convert Lead to Customer</h3>
          <Select onValueChange={(value) => setSelectedLead(value === "none" ? null : value)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select a lead to convert..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (Create New Customer)</SelectItem>
              {leads && leads.length > 0 ? (
                leads.map(lead => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.first_name} {lead.last_name}{lead.business_name ? ` (${lead.business_name})` : ''}
                  </SelectItem>
                ))
              ) : leadsLoading ? (
                <SelectItem value="loading" disabled>
                  Loading leads...
                </SelectItem>
              ) : (
                <SelectItem value="no-leads" disabled>
                  No leads available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-2">
            Converting a lead will automatically fill in their information
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
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
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="ACME Inc." 
                  {...field} 
                  value={field.value || ''}
                  onChange={e => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormDescription>
                Optional, if this customer represents a business
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="john.doe@example.com" 
                    {...field} 
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="+1 234 567 8900" 
                    {...field} 
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="tin_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TIN Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123-45-6789" 
                    {...field} 
                    value={field.value || ''}
                    onChange={e => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="credit_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credit Limit</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1000" 
                    {...field} 
                    value={field.value === null ? '' : field.value}
                    onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="123 Main St, Anytown, AT 12345" 
                  className="resize-none" 
                  {...field} 
                  value={field.value || ''}
                  onChange={e => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="account_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AccountStatusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_lead"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lead Status</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === "true")} 
                  defaultValue={field.value ? "true" : "false"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lead status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LeadOptions.map(option => (
                      <SelectItem key={option.label} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={createCustomer.isPending}
          >
            {createCustomer.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Add Customer'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddCustomerForm;
