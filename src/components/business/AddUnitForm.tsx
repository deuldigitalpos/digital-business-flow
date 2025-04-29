
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
import { useBusinessUnitMutations } from "@/hooks/useBusinessUnitMutations";
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, "Unit name is required"),
  short_name: z.string().min(1, "Short name is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddUnitFormProps {
  onSuccess?: () => void;
}

const AddUnitForm: React.FC<AddUnitFormProps> = ({ onSuccess }) => {
  const { createUnit } = useBusinessUnitMutations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      short_name: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createUnit.mutateAsync(values);
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating unit:", error);
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
              <FormLabel>Unit Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter unit name (e.g. Kilogram)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="short_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Name</FormLabel>
              <FormControl>
                <Input placeholder="Short name (e.g. kg)" {...field} />
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
                  placeholder="Enter unit description"
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
          <Button type="submit" disabled={createUnit.isPending}>
            {createUnit.isPending ? "Creating..." : "Create Unit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddUnitForm;
