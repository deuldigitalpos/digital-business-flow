
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { BusinessWarranty, BusinessWarrantyFormValues } from "@/types/business-warranty";
import { useBusinessWarrantyMutations } from "@/hooks/useBusinessWarrantyMutations";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  expiration_date: z.string().min(1, "Expiration date is required"),
  is_active: z.boolean().default(true),
});

interface EditWarrantyFormProps {
  warranty: BusinessWarranty;
  onSuccess?: () => void;
}

const EditWarrantyForm: React.FC<EditWarrantyFormProps> = ({ warranty, onSuccess }) => {
  const { updateWarranty } = useBusinessWarrantyMutations();

  const form = useForm<BusinessWarrantyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: warranty.name || "",
      description: warranty.description || "",
      expiration_date: warranty.expiration_date || format(new Date(), "yyyy-MM-dd"),
      is_active: warranty.is_active ?? true,
    },
  });

  useEffect(() => {
    if (warranty) {
      form.reset({
        name: warranty.name,
        description: warranty.description || "",
        expiration_date: warranty.expiration_date || format(new Date(), "yyyy-MM-dd"),
        is_active: warranty.is_active ?? true,
      });
    }
  }, [warranty, form]);

  const onSubmit = async (data: BusinessWarrantyFormValues) => {
    try {
      console.log("Updating warranty data:", data);
      await updateWarranty.mutateAsync({
        id: warranty.id,
        data,
      });
      
      toast.success("Warranty updated successfully");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update warranty");
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
              <FormLabel>Name</FormLabel>
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
              <FormLabel>Description</FormLabel>
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

        <FormField
          control={form.control}
          name="expiration_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiration Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
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

        <Button
          type="submit"
          className="w-full"
          disabled={updateWarranty.isPending}
        >
          {updateWarranty.isPending ? "Updating..." : "Update Warranty"}
        </Button>
      </form>
    </Form>
  );
};

export default EditWarrantyForm;
