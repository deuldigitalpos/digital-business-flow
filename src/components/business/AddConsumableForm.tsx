
import React, { useState, useRef } from 'react';
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  unit_id: z.string().optional(),
  unit_price: z.coerce.number().min(0, { message: 'Unit price must be 0 or greater' }),
  quantity_available: z.coerce.number().min(0, { message: 'Quantity must be 0 or greater' }).optional()
});

interface AddConsumableFormProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const AddConsumableForm: React.FC<AddConsumableFormProps> = ({ onSuccess, onError }) => {
  const { createConsumable } = useBusinessConsumableMutations();
  const { data: units, isLoading: isLoadingUnits } = useBusinessUnits();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessUser } = useBusinessAuth();
  const submitTimeRef = useRef<number | null>(null);
  const formProcessingRef = useRef<boolean>(false);
  
  // Add debug logging for business user
  console.log('Current business user in AddConsumableForm:', businessUser);
  console.log('Business user ID:', businessUser?.id);
  
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
    // Multiple safeguards against double submission
    if (isSubmitting || formProcessingRef.current) {
      console.log('Form submission already in progress, ignoring duplicate submission');
      return;
    }
    
    // Advanced time-based debounce for double click issues
    const now = Date.now();
    if (submitTimeRef.current && now - submitTimeRef.current < 2000) {
      console.log('Submission too soon after previous submission (within 2s), ignoring');
      return;
    }
    
    // Set multiple flags to prevent duplicate submissions
    submitTimeRef.current = now;
    setIsSubmitting(true);
    formProcessingRef.current = true;
    
    // Show immediate feedback
    toast.loading('Adding consumable...');

    try {
      console.log('Submitting form data:', data);
      console.log('Current business user ID:', businessUser?.id);
      
      if (!businessUser?.id) {
        throw new Error('Business user ID is not available. Please log in again.');
      }
      
      // Ensure quantity_available is at least 0 if undefined
      const formData = {
        ...data,
        quantity_available: data.quantity_available ?? 0
      };
      
      console.log('Processed form data:', formData);
      await createConsumable.mutateAsync(formData);
      console.log('Consumable created successfully');
      
      form.reset();
      toast.dismiss(); 
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.dismiss();
      if (onError) {
        onError(error);
      } else {
        toast.error(`Failed to add consumable: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      // Longer delay before allowing another submission
      setTimeout(() => {
        setIsSubmitting(false);
        formProcessingRef.current = false;
      }, 1000);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormLabel>Initial Quantity (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="1" 
                  min="0" 
                  placeholder="Enter initial quantity or leave empty"
                  {...field} 
                  onChange={(e) => {
                    // Allow empty value by setting to undefined
                    const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || createConsumable.isPending || formProcessingRef.current}
        >
          {(isSubmitting || createConsumable.isPending) ? (
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
