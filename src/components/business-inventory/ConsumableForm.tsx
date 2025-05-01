
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useBusinessConsumableMutations } from '@/hooks/useBusinessConsumableMutations';
import { BusinessConsumable } from '@/hooks/useBusinessConsumables';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { useBusinessUnits } from '@/hooks/useBusinessUnits';
import { Loader2 } from 'lucide-react';

interface ConsumableFormProps {
  consumable: BusinessConsumable | null;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category_id: z.string().optional().nullable(),
  unit_id: z.string().optional().nullable(),
  image_url: z.string().optional().nullable()
});

type FormValues = z.infer<typeof formSchema>;

const ConsumableForm: React.FC<ConsumableFormProps> = ({ consumable, onClose }) => {
  const { createConsumable, updateConsumable } = useBusinessConsumableMutations();
  const { data: categories } = useBusinessCategories();
  const { data: units } = useBusinessUnits();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = async (data: FormValues) => {
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter description (optional)" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
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
            name="unit_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units?.map(unit => (
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
