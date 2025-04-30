
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBusinessIngredientMutations } from '@/hooks/useBusinessIngredientMutations';
import { useBusinessUnits } from '@/hooks/useBusinessUnits';
import { BusinessIngredient, IngredientFormValues } from '@/types/business-ingredient';

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
  quantity_available: z.coerce.number().min(0, { message: 'Quantity must be 0 or greater' })
});

interface EditIngredientFormProps {
  ingredient: BusinessIngredient;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const EditIngredientForm: React.FC<EditIngredientFormProps> = ({ ingredient, onSuccess, onError }) => {
  const { updateIngredient } = useBusinessIngredientMutations();
  const { data: units, isLoading: isLoadingUnits } = useBusinessUnits();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessUser } = useBusinessAuth();
  
  // Add debug logging for business user
  console.log('Current business user in EditIngredientForm:', businessUser);
  console.log('Business user ID:', businessUser?.id);
  
  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ingredient.name,
      description: ingredient.description || '',
      unit_id: ingredient.unit_id || undefined,
      unit_price: ingredient.unit_price,
      quantity_available: ingredient.quantity_available
    }
  });

  const onSubmit = async (data: IngredientFormValues) => {
    try {
      console.log('Submitting edit ingredient form data:', data);
      console.log('Current business user ID:', businessUser?.id);
      setIsSubmitting(true);
      await updateIngredient.mutateAsync({
        id: ingredient.id,
        data
      });
      console.log('Ingredient updated successfully');
      
      if (onSuccess) onSuccess();
      toast.success('Ingredient updated successfully');
    } catch (error) {
      console.error('Error submitting edit ingredient form:', error);
      if (onError) {
        onError(error);
      } else {
        toast.error(`Failed to update ingredient: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

        <div className="bg-amber-50 p-3 rounded-md text-amber-800 text-sm mb-4">
          <p className="font-medium">Note:</p>
          <p>Quantity can only be updated through the Stock Management page.</p>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || updateIngredient.isPending}
        >
          {(isSubmitting || updateIngredient.isPending) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Ingredient...
            </>
          ) : (
            'Update Ingredient'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditIngredientForm;
