
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBusinessIngredientMutations } from '@/hooks/useBusinessIngredientMutations';
import { useBusinessUnits } from '@/hooks/useBusinessUnits';
import { IngredientFormValues } from '@/types/business-ingredient';

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

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  unit_id: z.string().optional(),
  unit_price: z.coerce.number().min(0, { message: 'Unit price must be 0 or greater' }),
  quantity_available: z.coerce.number().min(0, { message: 'Quantity must be 0 or greater' })
});

interface AddIngredientFormProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const AddIngredientForm: React.FC<AddIngredientFormProps> = ({ onSuccess, onError }) => {
  const { createIngredient } = useBusinessIngredientMutations();
  const { data: units, isLoading: isLoadingUnits } = useBusinessUnits();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      unit_price: 0,
      quantity_available: 0
    }
  });

  const onSubmit = async (data: IngredientFormValues) => {
    try {
      console.log('Submitting ingredient form data:', data);
      setIsSubmitting(true);
      await createIngredient.mutateAsync(data);
      console.log('Ingredient created successfully');
      
      form.reset();
      if (onSuccess) onSuccess();
      toast.success('Ingredient added successfully');
    } catch (error) {
      console.error('Error submitting ingredient form:', error);
      if (onError) {
        onError(error);
      } else {
        toast.error(`Failed to add ingredient: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
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
                <Input placeholder="Enter ingredient name" {...field} />
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
          disabled={isSubmitting || createIngredient.isPending}
        >
          {(isSubmitting || createIngredient.isPending) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Ingredient...
            </>
          ) : (
            'Add Ingredient'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddIngredientForm;
