
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useBusinessAddonMutations from "@/hooks/useBusinessAddonMutations";
import { useBusinessAddons } from "@/hooks/useBusinessAddons";
import { z } from "zod";

// Define schema for the form
const addonFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category_id: z.string().optional(),
  image_url: z.string().optional(),
});

type AddonFormValues = z.infer<typeof addonFormSchema>;

const AddonForm = ({ addon, onClose }: { addon: any | null, onClose: () => void }) => {
  const { addons } = useBusinessAddons();
  const { createAddon, updateAddon } = useBusinessAddonMutations();
  
  const defaultValues: AddonFormValues = addon ? {
    name: addon.name || "",
    description: addon.description || "",
    category_id: addon.category_id || "",
    image_url: addon.image_url || "",
  } : {
    name: "",
    description: "",
    category_id: "",
    image_url: "",
  };

  const form = useForm<AddonFormValues>({
    resolver: zodResolver(addonFormSchema),
    defaultValues,
  });

  const handleSubmit = async (values: AddonFormValues) => {
    try {
      if (addon) {
        // Update existing addon
        await updateAddon.mutateAsync({
          id: addon.id,
          name: values.name,
          description: values.description,
          category_id: values.category_id,
          image_url: values.image_url,
        });
      } else {
        // Create new addon
        await createAddon.mutateAsync({
          name: values.name,
          description: values.description,
          category_id: values.category_id,
          image_url: values.image_url,
        });
      }
      onClose();
    } catch (error) {
      console.error("Failed to save addon:", error);
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
                <Input placeholder="Addon name" {...field} />
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
                  placeholder="Brief description of the addon"
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
              <select
                className="w-full p-2 border rounded"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              >
                <option value="">Select Category</option>
                {/* We'd populate this with categories */}
              </select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Image URL"
                  {...field}
                  value={field.value || ''}
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
            {addon ? "Update" : "Create"} Addon
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddonForm;
