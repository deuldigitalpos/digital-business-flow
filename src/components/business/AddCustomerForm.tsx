
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
import { CustomerCreateInput, AccountStatusOptions } from '@/types/business-customer';
import { useBusinessCustomerMutations } from '@/hooks/useBusinessCustomerMutations';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { useBusinessLeadsMutations } from '@/hooks/useBusinessLeadsMutations';

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
  lead_id: z.string().nullable(),
});

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ businessId, onSuccess }) => {
  const { createCustomer } = useBusinessCustomerMutations();
  const { businessUser } = useBusinessAuth();
  const { useBusinessLeads } = useBusinessLeadsMutations();
  
  console.log("AddCustomerForm - businessId:", businessId);
  
  // Fetch lead sources for this business
  const { data: leads, isLoading: leadsLoading } = useBusinessLeads(businessId);
  
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
      lead_id: null,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting customer form:", values);
      
      // Extract the lead_id from the form values
      const { lead_id, ...customerData } = values;

      // Create a customer with is_lead=false and the selected lead source
      const customerInput: CustomerCreateInput = {
        ...customerData,
        is_lead: false,
        // Store the lead ID in custom fields
        lead_source_id: lead_id || null
      };
      
      const result = await createCustomer.mutateAsync(customerInput);
      console.log("Customer created:", result);
      
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Lead Source Selection Option */}
        <FormField
          control={form.control}
          name="lead_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lead Source</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lead source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {leads && leads.length > 0 ? (
                    leads.map(lead => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.name}
                      </SelectItem>
                    ))
                  ) : leadsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading lead sources...
                    </SelectItem>
                  ) : (
                    <SelectItem value="no-leads" disabled>
                      No lead sources available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Select where this customer came from
              </FormDescription>
            </FormItem>
          )}
        />

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
