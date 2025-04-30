
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
import { Loader2 } from 'lucide-react';

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
    console.log('Submitting form with data:', data);
    try {
      await createConsumable.mutateAsync(data);
      console.log('Consumable created successfully');
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
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
