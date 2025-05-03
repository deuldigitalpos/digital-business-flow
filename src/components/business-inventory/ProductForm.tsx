
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { IngredientSelector } from "./product-form/IngredientSelector";
import { ConsumableSelector } from "./product-form/ConsumableSelector";
import { SizeManager } from "./product-form/SizeManager";
import { ProductFormValues } from "./product-form/types";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import useBusinessIngredients from "@/hooks/useBusinessIngredients";
import useBusinessConsumables from "@/hooks/useBusinessConsumables";
import { UnitSelect } from "./product-form/UnitSelect";
import { BrandSelect } from "./product-form/BrandSelect";
import { WarrantySelect } from "./product-form/WarrantySelect";

interface ProductFormProps {
  form: UseFormReturn<ProductFormValues>;
  isEditMode?: boolean;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}

const ProductForm: React.FC<ProductFormProps> = ({ form, isEditMode, onSubmit }) => {
  const { data: categories } = useBusinessCategories();
  const { ingredients } = useBusinessIngredients();
  const { consumables } = useBusinessConsumables();

  useEffect(() => {
    // Reset the sizes field when isEditMode changes
    if (!isEditMode) {
      form.setValue('ingredients', []);
      form.setValue('consumables', []);
      form.setValue('sizes', []);
    }
  }, [isEditMode, form]);

  const handleSubmit = (values: ProductFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="SKU" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Product description" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        </div>

        <Separator />

        {/* Add Unit, Brand, and Warranty selectors */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UnitSelect form={form} />
            <BrandSelect form={form} />
            <WarrantySelect form={form} />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Product Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cost_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selling_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="sizes">Sizes</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="consumables">Consumables</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <FormField
              control={form.control}
              name="auto_generate_sku"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Auto-generate SKU</FormLabel>
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
          </TabsContent>
          
          <TabsContent value="sizes" className="space-y-2">
            <SizeManager
              form={form}
              isEditMode={isEditMode}
            />
          </TabsContent>
          
          <TabsContent value="ingredients" className="space-y-2">
            <IngredientSelector
              form={form}
              ingredients={ingredients || []}
              isEditMode={isEditMode}
            />
          </TabsContent>
          
          <TabsContent value="consumables" className="space-y-2">
            <ConsumableSelector
              form={form}
              consumables={consumables || []}
              isEditMode={isEditMode}
            />
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
