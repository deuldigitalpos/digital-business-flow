
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
      description: addon?.description || '',
      category_id: addon?.category_id || undefined,
      unit_id: addon?.unit_id || undefined,
      image_url: addon?.image_url || ''
    }
  });

  const handleSubmit = async (values: AddonFormValues) => {
    try {
      if (isEditing && addon) {
        await updateAddon.mutateAsync({
          id: addon.id,
          ...values
        });
      } else {
        await createAddon.mutateAsync(values);
      }
      onClose();
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Add-on' : 'Add New Add-on'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <NameField form={form} />
            <DescriptionField form={form} />
            <div className="grid grid-cols-2 gap-4">
              <CategorySelect form={form} />
              <UnitSelect form={form} />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="mt-4"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="mt-4"
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
