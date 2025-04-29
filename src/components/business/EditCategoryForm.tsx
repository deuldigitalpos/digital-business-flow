
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
import { useBusinessCategoryMutations } from "@/hooks/useBusinessCategoryMutations";
import { BusinessCategory } from "@/types/business-category";
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCategoryFormProps {
  category: BusinessCategory;
  onSuccess?: () => void;
}

const EditCategoryForm: React.FC<EditCategoryFormProps> = ({ category, onSuccess }) => {
  const { updateCategory } = useBusinessCategoryMutations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      description: category.description || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await updateCategory.mutateAsync({
        id: category.id,
        data: {
          name: values.name,
          description: values.description,
        },
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating category:", error);
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
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
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
                  placeholder="Enter category description"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={updateCategory.isPending}>
            {updateCategory.isPending ? "Updating..." : "Update Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCategoryForm;
