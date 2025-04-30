
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBusinessConsumableMutations } from '@/hooks/useBusinessConsumableMutations';
import { useBusinessUnits } from '@/hooks/useBusinessUnits';
import { BusinessConsumable, ConsumableFormValues } from '@/types/business-consumable';

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
  quantity_available: z.coerce.number().min(0, { message: 'Quantity must be 0 or greater' }).optional()
});

interface EditConsumableFormProps {
  consumable: BusinessConsumable;
  onSuccess?: () => void;
}

const EditConsumableForm: React.FC<EditConsumableFormProps> = ({ consumable, onSuccess }) => {
  const { updateConsumable } = useBusinessConsumableMutations();
  const { data: units, isLoading: isLoadingUnits } = useBusinessUnits();
  
  const form = useForm<ConsumableFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      unit_price: 0
    }
  });

  useEffect(() => {
    if (consumable) {
      form.reset({
        name: consumable.name,
        description: consumable.description || '',
        unit_id: consumable.unit_id || undefined,
        unit_price: consumable.unit_price
      });
    }
  }, [consumable, form]);

  const onSubmit = async (data: ConsumableFormValues) => {
    try {
      await updateConsumable.mutateAsync({
        id: consumable.id,
        data: {
          ...data,
          // Exclude quantity_available as it should be updated via stock transactions
          quantity_available: consumable.quantity_available
        }
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating consumable:', error);
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

        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-4">
            Current quantity: {consumable.quantity_available} 
            <span className="ml-2">
              (To adjust quantity, use the Stock Management page)
            </span>
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={updateConsumable.isPending}
        >
          {updateConsumable.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Consumable...
            </>
          ) : (
            'Update Consumable'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditConsumableForm;
