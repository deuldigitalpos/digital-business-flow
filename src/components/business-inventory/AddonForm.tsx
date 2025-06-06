
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useBusinessAddonMutations } from '@/hooks/useBusinessAddonMutations';
import { AddonFormProps, AddonFormValues, addonFormSchema } from './addon-form/types';
import { NameField } from './addon-form/NameField';
import { DescriptionField } from './addon-form/DescriptionField';
import { CategorySelect } from './addon-form/CategorySelect';
import { UnitSelect } from './addon-form/UnitSelect';

export const AddonForm: React.FC<AddonFormProps> = ({ addon, onClose }) => {
  const { createAddon, updateAddon } = useBusinessAddonMutations();
  const isEditing = !!addon;

  const form = useForm<AddonFormValues>({
    resolver: zodResolver(addonFormSchema),
    defaultValues: {
      name: addon?.name || '',
      description: addon?.description || null,
      category_id: addon?.category_id || null,
      unit_id: addon?.unit_id || null,
      image_url: addon?.image_url || null
    }
  });

  const handleSubmit = async (values: AddonFormValues) => {
    try {
      if (isEditing && addon) {
        await updateAddon.mutateAsync({
          id: addon.id,
          addonData: values // Fix: Wrap the values in addonData object
        });
      } else {
        // Make sure the form values match the expected type
        const { name, description, category_id, unit_id, image_url } = values;
        await createAddon.mutateAsync({
          name, // This is guaranteed to be a string due to form validation
          description,
          category_id,
          unit_id,
          image_url
        });
      }
      onClose();
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Add-on' : 'Add New Add-on'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <NameField form={form} />
            <DescriptionField form={form} />
            <CategorySelect form={form} />
            <UnitSelect form={form} />
            <DialogFooter className="pt-2 sm:pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="sm:w-auto w-full"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="sm:w-auto w-full"
                disabled={form.formState.isSubmitting || !form.formState.isDirty}
              >
                {isEditing ? 'Update Add-on' : 'Create Add-on'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddonForm;
