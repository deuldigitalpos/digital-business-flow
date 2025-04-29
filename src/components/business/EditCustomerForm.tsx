
import React, { useEffect } from 'react';
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
import { BusinessCustomer, CustomerUpdateInput, AccountStatusOptions, LeadOptions } from '@/types/business-customer';
import { useBusinessCustomerMutations } from '@/hooks/useBusinessCustomerMutations';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useBusinessLeadsMutations } from '@/hooks/useBusinessLeadsMutations';

interface EditCustomerFormProps {
  customer: BusinessCustomer;
  onSuccess: () => void;
}

const formSchema = z.object({
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
  account_status: z.string(),
  is_lead: z.boolean().default(false),
  lead_source_id: z.string().nullable(),
});

const EditCustomerForm: React.FC<EditCustomerFormProps> = ({ customer, onSuccess }) => {
  const { updateCustomer } = useBusinessCustomerMutations();
  const { useBusinessLeads } = useBusinessLeadsMutations();
  
  // Fetch lead sources
  const { data: leadSources } = useBusinessLeads(customer.business_id);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: customer.first_name,
      last_name: customer.last_name,
      business_name: customer.business_name,
      email: customer.email,
      tin_number: customer.tin_number,
      credit_limit: customer.credit_limit,
      mobile_number: customer.mobile_number,
      address: customer.address,
      account_status: customer.account_status,
      is_lead: customer.is_lead || false,
      lead_source_id: customer.is_lead ? (customer.lead_source_id || null) : "null"
    },
  });

  // Update form if customer prop changes
  useEffect(() => {
    form.reset({
      first_name: customer.first_name,
      last_name: customer.last_name,
      business_name: customer.business_name,
      email: customer.email,
      tin_number: customer.tin_number,
      credit_limit: customer.credit_limit,
      mobile_number: customer.mobile_number,
      address: customer.address,
      account_status: customer.account_status,
      is_lead: customer.is_lead || false,
      lead_source_id: customer.is_lead ? (customer.lead_source_id || null) : "null"
    });
  }, [customer, form]);

  // Update is_lead when lead_source_id changes
  useEffect(() => {
    const leadSourceId = form.watch('lead_source_id');
    if (leadSourceId && leadSourceId !== "null") {
      form.setValue('is_lead', true);
    } else {
      form.setValue('is_lead', false);
    }
  }, [form.watch('lead_source_id')]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Process lead_source_id
      const customerData: CustomerUpdateInput = {
        ...values,
        is_lead: values.lead_source_id !== "null",
        lead_source_id: values.lead_source_id === "null" ? null : values.lead_source_id,
      };
      
      await updateCustomer.mutateAsync({
        id: customer.id,
        data: customerData
      });
      onSuccess();
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {customer.customer_id && (
          <div className="p-3 bg-muted rounded-md text-sm">
            <span className="font-medium">Customer ID:</span> {customer.customer_id}
          </div>
        )}
        
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
            disabled={updateCustomer.isPending}
          >
            {updateCustomer.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCustomerForm;
