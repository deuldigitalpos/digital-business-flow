
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
  is_lead: z.boolean().default(false),
  lead_source_id: z.string().nullable(),
});

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ businessId, onSuccess }) => {
  const { createCustomer } = useBusinessCustomerMutations();
  const { businessUser } = useBusinessAuth();
  const { useBusinessLeads } = useBusinessLeadsMutations();
  
  // Fetch lead sources
  const { data: leadSources, isLoading: isLoadingLeadSources } = useBusinessLeads(businessId);
  
  console.log("AddCustomerForm - businessId:", businessId);
  console.log("AddCustomerForm - businessUser:", businessUser);
  console.log("AddCustomerForm - leadSources:", leadSources);
  
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
      is_lead: false,
      lead_source_id: null,
    },
  });

  // Update business_id when it changes
  useEffect(() => {
    if (businessId) {
      form.setValue('business_id', businessId);
      console.log("Set business_id to:", businessId);
    }
  }, [businessId, form]);

  // Update is_lead when lead_source_id changes
  useEffect(() => {
    const leadSourceId = form.watch('lead_source_id');
    if (leadSourceId) {
      form.setValue('is_lead', true);
    } else {
      form.setValue('is_lead', false);
    }
  }, [form.watch('lead_source_id')]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting customer form with business ID:", businessId);
      console.log("Form values:", values);
      
      // Double check that business_id is set correctly
      if (!values.business_id && businessUser) {
        console.log("Setting business_id from businessUser:", businessUser.business_id);
        values.business_id = businessUser.business_id;
      }
      
      // Create the customer input
      const customerInput: CustomerCreateInput = {
        business_id: values.business_id, 
        first_name: values.first_name, 
        last_name: values.last_name, 
        account_status: values.account_status,
        is_lead: values.lead_source_id ? true : false,
        lead_source_id: values.lead_source_id,
        // Optional fields
        business_name: values.business_name,
        email: values.email,
        tin_number: values.tin_number,
        credit_limit: values.credit_limit,
        mobile_number: values.mobile_number,
        address: values.address,
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
        {/* Lead Source */}
        <FormField
          control={form.control}
          name="lead_source_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lead Source</FormLabel>
              <Select 
                onValueChange={field.onChange}
                value={field.value || "null"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead source or none" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">Not a lead</SelectItem>
                  {leadSources?.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select a lead source if this is a lead, or "Not a lead" for regular customers
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
