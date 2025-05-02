
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useBusinessConsumableMutations } from '@/hooks/useBusinessConsumableMutations';
import { NameField } from './consumable-form/NameField';
import { DescriptionField } from './consumable-form/DescriptionField';
import { CategorySelect } from './consumable-form/CategorySelect';
import { UnitSelect } from './consumable-form/UnitSelect';
import { ConsumableFormValues, consumableFormSchema } from './consumable-form/types';
import { BusinessConsumable } from '@/hooks/useBusinessConsumables';

export interface ConsumableFormProps {
  consumable: BusinessConsumable | null;
  onClose: () => void;
}

export const ConsumableForm: React.FC<ConsumableFormProps> = ({
  consumable,
  onClose,
}) => {
  const { createConsumable, updateConsumable } = useBusinessConsumableMutations();
  const isEditMode = !!consumable;

  const form = useForm<ConsumableFormValues>({
    resolver: zodResolver(consumableFormSchema),
    defaultValues: {
      name: consumable?.name || '',
      description: consumable?.description || '',
      category_id: consumable?.category_id || undefined,
      unit_id: consumable?.unit_id || undefined,
      image_url: consumable?.image_url || '',
    },
  });

  const onSubmit = async (data: ConsumableFormValues) => {
    try {
      if (isEditMode && consumable) {
        await updateConsumable.mutateAsync({
          id: consumable.id,
          consumableData: data,
        });
      } else {
        await createConsumable.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving consumable:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NameField form={form} />
        <DescriptionField form={form} />
        <CategorySelect form={form} />
        <UnitSelect form={form} />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createConsumable.isPending || updateConsumable.isPending}
          >
            {isEditMode ? 'Update' : 'Create'} Consumable
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ConsumableForm;
