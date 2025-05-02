
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBusinessUnitMutations } from "@/hooks/useBusinessUnitMutations";
import { BusinessUnit, BusinessUnitFormValues, UnitType } from "@/types/business-unit";
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, "Unit name is required"),
  short_name: z.string().min(1, "Short name is required"),
  type: z.enum(["weight", "volume", "length", "count"] as const),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUnitFormProps {
  unit: BusinessUnit;
  onSuccess?: () => void;
}

const EditUnitForm: React.FC<EditUnitFormProps> = ({ unit, onSuccess }) => {
  const { updateUnit } = useBusinessUnitMutations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: unit.name,
      short_name: unit.short_name,
      type: unit.type,
      description: unit.description || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Convert form values to match BusinessUnitFormValues
      const formData: BusinessUnitFormValues = {
        name: data.name,
        short_name: data.short_name,
        description: data.description,
        type: data.type
      };
      
      await updateUnit.mutateAsync({
        id: unit.id,
        data: formData,
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating unit:", error);
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
                <Input placeholder="Enter unit name" {...field} />
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
                <Input placeholder="Enter short name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="length">Length</SelectItem>
                  <SelectItem value="count">Count</SelectItem>
                </SelectContent>
              </Select>
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
          <Button type="submit" disabled={updateUnit.isPending}>
            {updateUnit.isPending ? "Updating..." : "Update Unit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditUnitForm;
