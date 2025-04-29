import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AccountStatusOptions, BusinessSupplier } from '@/types/business-supplier';
import { useBusinessSupplierMutations } from '@/hooks/useBusinessSupplierMutations';

// Define the form schema with validation
const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  business_name: z.string().optional().nullable(),
  email: z.string().email("Invalid email format").optional().nullable(),
  tin_number: z.string().optional().nullable(),
  credit_limit: z.string().optional().nullable().transform(val => val ? Number(val) : null),
  address: z.string().optional().nullable(),
  mobile_number: z.string().optional().nullable(),
  account_status: z.string().default("active"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditSupplierFormProps {
  supplier: BusinessSupplier;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditSupplierForm: React.FC<EditSupplierFormProps> = ({
  supplier,
  onSuccess,
  onCancel,
}) => {
  const { updateSupplier } = useBusinessSupplierMutations();

  // Initialize the form with supplier data - convert numbers to strings for form fields
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: supplier.first_name,
      last_name: supplier.last_name,
      business_name: supplier.business_name,
      email: supplier.email,
      tin_number: supplier.tin_number,
      credit_limit: supplier.credit_limit !== null ? supplier.credit_limit.toString() : null,
      address: supplier.address,
      mobile_number: supplier.mobile_number,
      account_status: supplier.account_status,
    },
  });

  // Update form when supplier data changes
  useEffect(() => {
    form.reset({
      first_name: supplier.first_name,
      last_name: supplier.last_name,
      business_name: supplier.business_name,
      email: supplier.email,
      tin_number: supplier.tin_number,
      credit_limit: supplier.credit_limit !== null ? supplier.credit_limit.toString() : null,
      address: supplier.address,
      mobile_number: supplier.mobile_number,
      account_status: supplier.account_status,
    });
  }, [supplier, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateSupplier.mutateAsync({
        id: supplier.id,
        data: {
          first_name: values.first_name,
          last_name: values.last_name,
          business_name: values.business_name,
          email: values.email,
          tin_number: values.tin_number,
          credit_limit: values.credit_limit ? Number(values.credit_limit) : null,
          address: values.address,
          mobile_number: values.mobile_number,
          account_status: values.account_status,
        },
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
      // Error is handled by the mutation itself
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
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
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name (optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Business name" 
                    {...field} 
                    value={field.value || ""} 
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormDescription>
                  If the supplier is a business, enter the name here
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Email address" 
                    {...field} 
                    value={field.value || ""} 
                    onChange={(e) => field.onChange(e.target.value || null)}
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
                <FormLabel>Mobile Number (optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Mobile number" 
                    {...field} 
                    value={field.value || ""} 
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tin_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TIN Number (optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="TIN number" 
                    {...field} 
                    value={field.value || ""} 
                    onChange={(e) => field.onChange(e.target.value || null)}
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
                <FormLabel>Credit Limit (optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Credit limit" 
                    {...field} 
                    value={field.value || ""} 
                    onChange={(e) => field.onChange(e.target.value || null)}
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
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AccountStatusOptions.map((status) => (
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
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Supplier address" 
                  className="resize-none" 
                  {...field} 
                  value={field.value || ""} 
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Display readonly information */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-muted/50 rounded-lg p-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Supplier ID</p>
            <p>{supplier.supplier_id || '—'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Purchase</p>
            <p>{supplier.total_purchase?.toLocaleString() || '0'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
            <p>{supplier.total_invoices?.toLocaleString() || '0'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Invoices Due</p>
            <p>{supplier.total_invoices_due?.toLocaleString() || '0'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Amount Due</p>
            <p>{supplier.total_amount_invoices_due?.toLocaleString() || '0'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Return Due</p>
            <p>{supplier.total_purchase_return_due?.toLocaleString() || '0'}</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={updateSupplier.isPending}>
            {updateSupplier.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditSupplierForm;
