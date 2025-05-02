
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
import { useBusinessWarrantyMutations } from "@/hooks/useBusinessWarrantyMutations";
import { BusinessWarranty } from "@/types/business-warranty";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, "Warranty name is required"),
  description: z.string().optional(),
  duration: z.coerce.number().positive("Duration must be positive"),
  duration_unit: z.enum(["days", "weeks", "months", "years"]),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface EditWarrantyFormProps {
  warranty: BusinessWarranty;
  onSuccess?: () => void;
}

const EditWarrantyForm: React.FC<EditWarrantyFormProps> = ({ warranty, onSuccess }) => {
  const { updateWarranty } = useBusinessWarrantyMutations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: warranty.name,
      description: warranty.description || "",
      duration: warranty.duration,
      duration_unit: warranty.duration_unit as "days" | "weeks" | "months" | "years",
      is_active: warranty.is_active === true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await updateWarranty.mutateAsync({
        id: warranty.id,
        data: {
          name: values.name,
          description: values.description,
          duration: values.duration,
          duration_unit: values.duration_unit,
          is_active: values.is_active,
        },
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating warranty:", error);
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
              <FormLabel>Warranty Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter warranty name" {...field} />
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
                  placeholder="Enter warranty description"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    placeholder="Enter duration"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Set whether this warranty is active or inactive
                </p>
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
          <Button type="submit" disabled={updateWarranty.isPending}>
            {updateWarranty.isPending ? "Updating..." : "Update Warranty"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditWarrantyForm;
