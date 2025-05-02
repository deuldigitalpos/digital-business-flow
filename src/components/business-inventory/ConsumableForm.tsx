
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useBusinessConsumables } from "@/hooks/useBusinessConsumables";
import ImageUploader from "@/components/ImageUploader";
import { ConsumableFormValues, consumableFormSchema } from "./consumable-form/types";
import CategorySelect from "./shared/CategorySelect";

const ConsumableForm = ({ consumable, onClose }: { consumable: any | null, onClose: () => void }) => {
  const { createConsumable, updateConsumable } = useBusinessConsumables();
  
  const defaultValues: ConsumableFormValues = consumable ? {
    name: consumable.name || "",
    description: consumable.description || "",
    category_id: consumable.category_id || "",
    image_url: consumable.image_url || "",
  } : {
    name: "",
    description: "",
    category_id: "",
    image_url: "",
  };

  const form = useForm<ConsumableFormValues>({
    resolver: zodResolver(consumableFormSchema),
    defaultValues,
  });

  const handleSubmit = async (values: ConsumableFormValues) => {
    try {
      if (consumable) {
        // Update existing consumable
        await updateConsumable.mutateAsync({
          id: consumable.id,
          name: values.name,
          description: values.description,
          category_id: values.category_id,
          image_url: values.image_url,
        });
      } else {
        // Create new consumable
        await createConsumable.mutateAsync({
          name: values.name,
          description: values.description,
          category_id: values.category_id,
          image_url: values.image_url,
        });
      }
      onClose();
    } catch (error) {
      console.error("Failed to save consumable:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Consumable name" {...field} />
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
                  placeholder="Brief description of the consumable"
                  className="min-h-[100px]"
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
              <CategorySelect
                value={field.value || ''}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUploader
                  value={field.value || ''}
                  onChange={field.onChange}
                  bucketName="product-images"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {consumable ? "Update" : "Create"} Consumable
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ConsumableForm;
