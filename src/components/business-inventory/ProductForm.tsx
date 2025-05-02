import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
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
import { ProductConsumableInput, ProductIngredientInput, ProductSizeInput } from "@/types/business-product";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import { useBusinessUnits } from "@/hooks/useBusinessUnits";
import { useBusinessBrands } from "@/hooks/useBusinessBrands";
import useBusinessWarranties from "@/hooks/useBusinessWarranties";
import useBusinessIngredients from "@/hooks/useBusinessIngredients";
import useBusinessConsumables from "@/hooks/useBusinessConsumables";

interface ProductFormProps {
  form: UseFormReturn<ProductFormValues>;
  isEditMode?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ form, isEditMode }) => {
  const { data: categories } = useBusinessCategories();
  const { data: units } = useBusinessUnits();
  const { brands } = useBusinessBrands();
  const { warranties } = useBusinessWarranties();
  const { ingredients } = useBusinessIngredients();
  const { consumables } = useBusinessConsumables();

  useEffect(() => {
    // Reset the sizes field when isEditMode changes
    if (!isEditMode) {
      form.reset({
        sizes: [],
        ingredients: [],
        consumables: [],
      });
    }
  }, [isEditMode, form]);

  return (
    <div className="space-y-4">
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
            </FormItem>
          )}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="unit_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {units?.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name} ({unit.short_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands?.brands?.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="warranty_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warranty</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a warranty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {warranties?.warranties?.map((warranty) => (
                    <SelectItem key={warranty.id} value={warranty.id}>
                      {warranty.name}
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

      <Tabs defaultValue="sizes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="consumables">Consumables</TabsTrigger>
        </TabsList>
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
    </div>
  );
};

export default ProductForm;
