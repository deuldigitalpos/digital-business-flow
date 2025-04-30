
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBusinessBrandMutations } from "@/hooks/useBusinessBrandMutations";
import { BusinessBrand, BusinessBrandFormValues } from "@/types/business-brand";
import { DialogClose } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  description: z.string().optional(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditBrandFormProps {
  brand: BusinessBrand;
  onSuccess?: () => void;
}

const EditBrandForm: React.FC<EditBrandFormProps> = ({ brand, onSuccess }) => {
  const { updateBrand } = useBusinessBrandMutations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: brand.name,
      description: brand.description || "",
      is_active: brand.is_active ?? true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const brandData: BusinessBrandFormValues = {
        name: values.name,
        description: values.description,
        is_active: values.is_active,
      };
      
      await updateBrand.mutateAsync({
        id: brand.id,
        data: brandData,
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating brand:", error);
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
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter brand name" {...field} />
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
                <Textarea
                  placeholder="Enter brand description"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Whether this brand is currently active
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={updateBrand.isPending}>
            {updateBrand.isPending ? "Updating..." : "Update Brand"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditBrandForm;
