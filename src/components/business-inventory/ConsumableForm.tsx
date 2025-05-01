
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
import { useBusinessConsumableMutations } from '@/hooks/useBusinessConsumableMutations';
import { Loader2 } from 'lucide-react';
import { ConsumableFormProps, ConsumableFormValues, consumableFormSchema } from './consumable-form/types';
import { NameField } from './consumable-form/NameField';
import { DescriptionField } from './consumable-form/DescriptionField';
import { CategorySelect } from './consumable-form/CategorySelect';
import { UnitSelect } from './consumable-form/UnitSelect';

const ConsumableForm: React.FC<ConsumableFormProps> = ({ consumable, onClose }) => {
  const { createConsumable, updateConsumable } = useBusinessConsumableMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ConsumableFormValues>({
    resolver: zodResolver(consumableFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: null,
      unit_id: null,
      image_url: null
    }
  });

  useEffect(() => {
    if (consumable) {
      form.reset({
        name: consumable.name,
        description: consumable.description || '',
        category_id: consumable.category_id || null,
        unit_id: consumable.unit_id || null,
        image_url: consumable.image_url || null
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
  }, [consumable, form]);

  const onSubmit = async (data: ConsumableFormValues) => {
    setIsSubmitting(true);
    try {
      if (consumable) {
        await updateConsumable.mutateAsync({
          id: consumable.id,
          name: data.name,
          description: data.description || '',
          category_id: data.category_id || null,
          unit_id: data.unit_id || null,
          image_url: data.image_url || null
        });
      } else {
        await createConsumable.mutateAsync({
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
        <DialogTitle>{consumable ? 'Edit Consumable' : 'Add New Consumable'}</DialogTitle>
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
              {consumable ? 'Update' : 'Add'} Consumable
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ConsumableForm;
