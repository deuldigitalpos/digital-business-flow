
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useBusinessIngredientMutations } from '@/hooks/useBusinessIngredientMutations';
import { Loader2 } from 'lucide-react';
import { IngredientFormProps, IngredientFormValues, ingredientFormSchema } from './ingredient-form/types';
import { NameField } from './ingredient-form/NameField';
import { DescriptionField } from './ingredient-form/DescriptionField';
import { CategorySelect } from './ingredient-form/CategorySelect';
import { UnitSelect } from './ingredient-form/UnitSelect';

const IngredientForm: React.FC<IngredientFormProps> = ({ ingredient, onClose }) => {
  const { createIngredient, updateIngredient } = useBusinessIngredientMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: null,
      unit_id: null,
      image_url: null
    }
  });

  useEffect(() => {
    if (ingredient) {
      form.reset({
        name: ingredient.name,
        description: ingredient.description || '',
        category_id: ingredient.category_id || null,
        unit_id: ingredient.unit_id || null,
        image_url: ingredient.image_url || null
      });
    } else {
      form.reset({
        name: '',
        description: '',
        category_id: null,
        unit_id: null,
        image_url: null
      });
    }
  }, [ingredient, form]);

  const onSubmit = async (data: IngredientFormValues) => {
    setIsSubmitting(true);
    try {
      if (ingredient) {
        await updateIngredient.mutateAsync({
          id: ingredient.id,
          name: data.name,
          description: data.description || '',
          category_id: data.category_id || null,
          unit_id: data.unit_id || null,
          image_url: data.image_url || null
        });
      } else {
        await createIngredient.mutateAsync({
          name: data.name,
          description: data.description || '',
          category_id: data.category_id || null,
          unit_id: data.unit_id || null,
          image_url: data.image_url || null
        });
      }
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{ingredient ? 'Edit Ingredient' : 'Add New Ingredient'}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <NameField form={form} />
          <DescriptionField form={form} />
          <CategorySelect form={form} />
          <UnitSelect form={form} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {ingredient ? 'Update' : 'Add'} Ingredient
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default IngredientForm;
