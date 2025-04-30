
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBusinessConsumableMutations } from '@/hooks/useBusinessConsumableMutations';
import { useBusinessUnits } from '@/hooks/useBusinessUnits';
import { ConsumableFormValues } from '@/types/business-consumable';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  unit_id: z.string().optional(),
  unit_price: z.coerce.number().min(0, { message: 'Unit price must be 0 or greater' }),
  quantity_available: z.coerce.number().min(0, { message: 'Quantity must be 0 or greater' })
});

interface AddConsumableFormProps {
  onSuccess?: () => void;
}

const AddConsumableForm: React.FC<AddConsumableFormProps> = ({ onSuccess }) => {
  const { createConsumable } = useBusinessConsumableMutations();
  const { data: units, isLoading: isLoadingUnits } = useBusinessUnits();
  const { businessUser, business, isAuthenticated } = useBusinessAuth();
  const [errorDetails, setErrorDetails] = React.useState<string | null>(null);
  
  const form = useForm<ConsumableFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      unit_price: 0,
      quantity_available: 0
    }
  });

  const onSubmit = async (data: ConsumableFormValues) => {
    setErrorDetails(null);
    console.log('Submitting form with data:', data);
    
    // Validate business data is available
    if (!business?.id) {
      setErrorDetails('Business information is not available. Please try logging in again.');
      return;
    }
    
    // Validate business user authentication
    if (!businessUser?.id) {
      setErrorDetails('Business user authentication is not available. Please try logging in again.');
      return;
    }
    
    try {
      await createConsumable.mutateAsync({
        name: data.name,
        description: data.description,
        unit_id: data.unit_id,
        unit_price: Number(data.unit_price),
        quantity_available: Number(data.quantity_available)
      });
      
      console.log('Consumable created successfully');
      form.reset();
      toast.success('Consumable added successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = typeof error === 'object' && error !== null 
        ? JSON.stringify(error, null, 2) 
        : String(error);
      
      setErrorDetails(errorMessage);
      toast.error('Failed to add consumable');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {errorDetails && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs overflow-auto max-h-32">
              <details>
                <summary>Error Details</summary>
                <pre className="whitespace-pre-wrap">{errorDetails}</pre>
              </details>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Show auth status warning if needed */}
        {!isAuthenticated && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You may not be properly authenticated. Try logging in again if you encounter issues.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Show business user ID info */}
        {businessUser?.id && (
          <Alert variant="default" className="mb-4 bg-green-50">
            <AlertDescription className="text-xs">
              Using business user: {businessUser.id}
            </AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter consumable name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full" disabled={isLoadingUnits}>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {units?.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name} ({unit.short_name})
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
          name="unit_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity_available"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Quantity</FormLabel>
              <FormControl>
                <Input type="number" step="1" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={createConsumable.isPending}
        >
          {createConsumable.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Consumable...
            </>
          ) : (
            'Add Consumable'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddConsumableForm;
